import { useState, useEffect, useCallback, useRef } from 'react';
import { getBook, getBookChunks, updateProgress, getProgress } from '../lib/api.js';
import toast from 'react-hot-toast';

export function useBook(bookId) {
  const [book,          setBook]         = useState(null);
  const [chunks,        setChunks]       = useState([]);
  const [currentPage,   setCurrentPage]  = useState(1);
  const [totalPages,    setTotalPages]   = useState(1);
  const [loading,       setLoading]      = useState(true);
  const [chunksLoading, setChunksLoading]= useState(false);
  const [highlights,    setHighlights]   = useState([]);
  const [bookmarks,     setBookmarks]    = useState([]);

  // Refs mirror the above arrays so saveProgress always sends the latest
  // values even when called from within a stale closure (e.g. page-turn).
  const highlightsRef = useRef([]);
  const bookmarksRef  = useRef([]);
  const restoredInitialPage = useRef(false);

  useEffect(() => {
    if (!bookId) return;
    fetchBook();
    fetchProgress();
  }, [bookId]);

  useEffect(() => {
    if (!bookId) return;
    fetchChunks(currentPage);
  }, [bookId, currentPage]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const { data } = await getBook(bookId);
      setBook(data);
    } catch (err) {
      toast.error('Failed to load book: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data } = await getProgress(bookId);

      const savedHighlights = data?.highlights || [];
      setHighlights(savedHighlights);
      highlightsRef.current = savedHighlights;

      const savedBookmarks = data?.bookmarks || [];
      setBookmarks(savedBookmarks);
      bookmarksRef.current = savedBookmarks;

      // Resume where the reader left off, once, on first load.
      if (!restoredInitialPage.current && data?.current_chunk > 0) {
        restoredInitialPage.current = true;
        setCurrentPage(Math.max(1, Math.floor(data.current_chunk / 8) + 1));
      }
    } catch (_) {
      // No saved progress yet — start fresh.
    }
  };

  const fetchChunks = async (page) => {
    try {
      setChunksLoading(true);
      const { data } = await getBookChunks(bookId, page);
      setChunks(data.chunks || []);
      setTotalPages(data.total_pages || 1);
    } catch {
      toast.error('Failed to load reading content');
    } finally {
      setChunksLoading(false);
    }
  };

  // Central save — always includes the latest highlights AND bookmarks.
  const saveProgress = useCallback(async (chunkIndex, highlightsOverride = null, notes = [], bookmarksOverride = null) => {
    try {
      const highlightsToSave = highlightsOverride !== null ? highlightsOverride : highlightsRef.current;
      const bookmarksToSave  = bookmarksOverride  !== null ? bookmarksOverride  : bookmarksRef.current;
      await updateProgress(bookId, {
        current_chunk: chunkIndex,
        highlights: highlightsToSave,
        notes,
        bookmarks: bookmarksToSave,
      });
    } catch (_) {
      // Silently fail — progress saves are best-effort.
    }
  }, [bookId]);

  // ── Highlights ─────────────────────────────────────────────────────
  const addHighlight = useCallback((chunkIndex, text, color = 'amber') => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      chunk_index: chunkIndex,
      text: trimmed,
      color,
    };
    const next = [...highlightsRef.current, entry];
    highlightsRef.current = next;
    setHighlights(next);
    saveProgress(chunkIndex, next);
  }, [saveProgress]);

  const removeHighlight = useCallback((id) => {
    const next = highlightsRef.current.filter(h => h.id !== id);
    highlightsRef.current = next;
    setHighlights(next);
    saveProgress(chunks[0]?.chunk_index || 0, next);
  }, [saveProgress, chunks]);

  // ── Bookmarks ──────────────────────────────────────────────────────
  const addBookmark = useCallback((chunkIndex, label = '') => {
    // Prevent duplicate bookmarks for the same chunk
    if (bookmarksRef.current.some(b => b.chunk_index === chunkIndex)) return;
    const entry = {
      id: `bm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      chunk_index: chunkIndex,
      label: label || `Page ${Math.max(1, Math.floor(chunkIndex / 8) + 1)}`,
      created_at: new Date().toISOString(),
    };
    const next = [...bookmarksRef.current, entry];
    bookmarksRef.current = next;
    setBookmarks(next);
    saveProgress(chunkIndex, null, [], next);
  }, [saveProgress]);

  const removeBookmark = useCallback((id) => {
    const next = bookmarksRef.current.filter(b => b.id !== id);
    bookmarksRef.current = next;
    setBookmarks(next);
    saveProgress(chunks[0]?.chunk_index || 0, null, [], next);
  }, [saveProgress, chunks]);

  // ── Navigation ─────────────────────────────────────────────────────
  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };
  const prevPage = () => { if (currentPage > 1)          setCurrentPage(p => p - 1); };

  // Jump to the page that contains a given chunk index (8 chunks per page).
  const jumpToChunk = useCallback((chunkIndex) => {
    setCurrentPage(Math.max(1, Math.floor(chunkIndex / 8) + 1));
  }, []);

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  return {
    book, chunks, currentPage, totalPages,
    loading, chunksLoading,
    highlights, addHighlight, removeHighlight,
    bookmarks,  addBookmark,  removeBookmark,
    nextPage, prevPage, saveProgress, jumpToChunk, goToPage,
    refetch: fetchBook,
  };
}
