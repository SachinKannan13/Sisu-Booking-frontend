import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Library, BookOpen, FlaskConical, BrainCircuit, Plus, FileText, Book } from 'lucide-react';
import { getBooks } from '../lib/api.js';
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandShortcut, CommandSeparator
} from './ui/shadcn/command.jsx';

/**
 * Global ⌘K / Ctrl+K quick-action palette. Mounted once near the app root
 * (see App.jsx) so it's reachable from every page — Library, a Learn
 * session, the Lab, anywhere.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    getBooks().then(({ data }) => setBooks(data || [])).catch(() => setBooks([]));
  }, [open]);

  const go = useCallback((path, state) => {
    setOpen(false);
    navigate(path, state ? { state } : undefined);
  }, [navigate]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Quick actions" description="Jump anywhere in BookSphere">
      <CommandInput placeholder="Search sources, jump to a page, or run an action…" />
      <CommandList>
        <CommandEmpty>No matches. Try a different search.</CommandEmpty>

        <CommandGroup heading="Go to">
          <CommandItem onSelect={() => go('/library')}>
            <Library /> Library
          </CommandItem>
          <CommandItem onSelect={() => go('/learn')}>
            <BookOpen /> Learn
          </CommandItem>
          <CommandItem onSelect={() => go('/lab')}>
            <FlaskConical /> Experience Lab
          </CommandItem>
          <CommandItem onSelect={() => go('/memory')}>
            <BrainCircuit /> Learning Memory
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => go('/library', { openUpload: true })}>
            <Plus /> Add a new source
          </CommandItem>
          <CommandItem onSelect={() => go('/learn')}>
            <FileText /> Start a new learning session
            <CommandShortcut>Scholar · Critic · Synthesizer…</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        {books.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Your sources">
              {books.slice(0, 30).map((b) => (
                <CommandItem key={b.id} value={`${b.title} ${b.author || ''}`} onSelect={() => go(`/book/${b.id}`)}>
                  <Book /> {b.title}
                  {b.author && <CommandShortcut>{b.author}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
