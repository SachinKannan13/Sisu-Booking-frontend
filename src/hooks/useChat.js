import { useState, useCallback } from 'react';
import { sendMessage, getChatHistory, clearChat } from '../lib/api.js';
import toast from 'react-hot-toast';

export function useChat(bookId) {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [sending, setSending] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!bookId) return;
    try {
      setHistoryLoading(true);
      const { data } = await getChatHistory(bookId);
      setMessages(data.messages || []);
      setConversationId(data.conversation_id);
    } catch (err) {
      toast.error('Failed to load chat history');
    } finally {
      setHistoryLoading(false);
    }
  }, [bookId]);

  const send = useCallback(async (text, mode = 'reading') => {
    if (!text.trim() || sending) return;

    const userMsg = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setSending(true);

    try {
      const { data } = await sendMessage(bookId, text, conversationId, mode);

      if (!conversationId) setConversationId(data.conversation_id);

      const assistantMsg = {
        id: data.message_id || `ai-${Date.now()}`,
        role: 'assistant',
        content: data.text,
        visualization_type: data.visualization?.type,
        visualization_html: data.visualization?.code,
        visualization_title: data.visualization?.title,
        business_insight: data.business_insight,
        suggested_followups: data.suggested_followups || [],
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      toast.error('Failed to send message: ' + err.message);
      // Remove optimistic user message
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
    } finally {
      setSending(false);
    }
  }, [bookId, conversationId, sending]);

  const clear = useCallback(async () => {
    try {
      await clearChat(bookId);
      setMessages([]);
      toast.success('Chat cleared');
    } catch (err) {
      toast.error('Failed to clear chat');
    }
  }, [bookId]);

  return {
    messages, conversationId, sending, historyLoading,
    loadHistory, send, clear
  };
}
