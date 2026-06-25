import { useState, useCallback } from 'react';
import { generateStory, getStories, getStory } from '../lib/api.js';
import toast from 'react-hot-toast';

export function useStory(bookId) {
  const [stories, setStories] = useState([]);
  const [currentStory, setCurrentStory] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadStories = useCallback(async () => {
    if (!bookId) return;
    try {
      setLoading(true);
      const { data } = await getStories(bookId);
      setStories(data || []);
    } catch (err) {
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  const generate = useCallback(async (inputs) => {
    try {
      setGenerating(true);
      const { data } = await generateStory(bookId, inputs);
      setCurrentStory(data);
      setStories(prev => [data, ...prev]);
      return data;
    } catch (err) {
      toast.error('Story generation failed: ' + err.message);
      throw err;
    } finally {
      setGenerating(false);
    }
  }, [bookId]);

  const loadStory = useCallback(async (storyId) => {
    try {
      setLoading(true);
      const { data } = await getStory(storyId);
      setCurrentStory(data);
      return data;
    } catch (err) {
      toast.error('Failed to load story');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stories, currentStory, generating, loading,
    loadStories, generate, loadStory, setCurrentStory
  };
}
