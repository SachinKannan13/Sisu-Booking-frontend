import { useState, useEffect, useCallback, useRef } from 'react';
import { getBook, getBookChunks, updateProgress, getProgress } from '../lib/api.js';
import toast from 'react-hot-toast';

export function useBook(bookId) {
  const [book, setBook] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [chunksLoading, setChunksLoading] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const highlightsRef = useRef([]); // mirrors `highlights` so saveProgress always sends the latest set, even when called without an explicit highlights argument
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
      // Resume where the reader left off, once, on first load only.
      if (!restoredInitialPage.current && data?.current_chunk > 0) {
        restoredInitialPage.current = true;
        setCurrentPage(Math.max(1, Math.floor(data.current_chunk / 8) + 1));
      }
    } catch (_) {
      // No saved progress yet — fine, start fresh.
    }
  };

  const fetchChunks = async (page) => {
    try {
      setChunksLoading(true);
      const { data } = await getBookChunks(bookId, page);
      setChunks(data.chunks || []);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      toast.error('Failed to load reading content');
    } finally {
      setChunksLoading(false);
    }
  };

  // Always sends the current highlights set unless the caller explicitly
  // overrides it — previously this defaulted to `[]`, which meant every
  // plain page-turn save silently wiped out any saved highlights.
  const saveProgress = useCallback(async (chunkIndex, highlightsOverride = null, notes = []) => {
    try {
      const highlightsToSave = highlightsOverride !== null ? highlightsOverride : highlightsRef.current;
      await updateProgress(bookId, { current_chunk: chunkIndex, highlights: highlightsToSave, notes });
    } catch (_) {
      // Silently fail for progress saves
    }
  }, [bookId]);

  const addHighlight = useCallback((chunkIndex, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const next = [...highlightsRef.current, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, chunk_index: chunkIndex, text: trimmed }];
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

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  // Jump directly to the page containing a given chunk index (size=8 per page,
  // matching the default `size` used by fetchChunks/getBookChunks).
  const jumpToChunk = useCallback((chunkIndex) => {
    const page = Math.max(1, Math.floor(chunkIndex / 8) + 1);
    setCurrentPage(page);
  }, []);

  const goToPage = useCallback((page) => {
    setCurrentPage(p => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      return clamped;
    });
  }, [totalPages]);

  return {
    book, chunks, currentPage, totalPages,
    loading, chunksLoading, highlights,
    nextPage, prevPage, saveProgress, jumpToChunk, goToPage,
    addHighlight, removeHighlight,
    refetch: fetchBook
  };
}
