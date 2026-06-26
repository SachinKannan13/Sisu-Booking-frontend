import axios from 'axios';
import supabase from './supabase.js';

// In dev, VITE_API_URL is unset → baseURL is '' → all /api/* requests go through
// the Vite dev-server proxy (vite.config.js) to avoid CORS pre-flight issues.
// In production, set VITE_API_URL to your backend domain.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  timeout: 20000
});

// Attach auth token to every request.
// Guard: if getSession() fails (network/timeout), skip the header rather than
// hanging the entire request indefinitely.
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (_) { /* non-fatal — server will return 401 if token is needed */ }
  return config;
});

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ── Book helpers ──────────────────────────────────────────────
export const uploadBook = (formData) =>
  api.post('/api/books/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000 // uploads + processing can take 2 min
  });

// Full library list (Library page)
export const getBooks = (limit = 50) =>
  api.get('/api/books', { params: { limit } });

// Lightweight card list — only id, title, source_type, status, genre, cover_color
// Use for LearnHub source selector and Memory Library tab (much faster)
export const getBooksSlim = () =>
  api.get('/api/books', { params: { slim: 'true', limit: 200 } });

// Single most-recent book (used where only 1 book is needed)
export const getRecentBook = () =>
  api.get('/api/books', { params: { recent: '1' } });

export const getBook = (id) => api.get(`/api/books/${id}`);

export const getBookStatus = (id) => api.get(`/api/books/${id}/status`);

export const getBookChunks = (id, page = 1) =>
  api.get(`/api/books/${id}/chunks`, { params: { page, size: 8 } });

export const updateProgress = (id, progress) =>
  api.put(`/api/books/${id}/progress`, progress);

export const getProgress = (id) => api.get(`/api/books/${id}/progress`);

export const searchBookChapters = (bookId, q, limit = 8) =>
  api.get(`/api/books/${bookId}/chapter-search`, { params: { q, limit } });

// ── Chat helpers ──────────────────────────────────────────────
export const sendMessage = (bookId, message, conversationId, mode = 'reading') =>
  api.post(`/api/chat/${bookId}`, { message, conversation_id: conversationId, mode });

export const getChatHistory = (bookId) =>
  api.get(`/api/chat/${bookId}/history`);

export const clearChat = (bookId) =>
  api.delete(`/api/chat/${bookId}/clear`);

// ── Profile helpers ────────────────────────────────────────────
export const getUserProfile = () => api.get('/api/profile');
export const saveUserProfile = (data) => api.post('/api/profile', data);
export const updateUserProfile = (data) => api.patch('/api/profile', data);

// ── Sources ───────────────────────────────────────────────────
export const ingestURL  = (url, tags) =>
  api.post('/api/sources/ingest-url', { url, tags });

export const ingestText = (payload) =>
  api.post('/api/sources/ingest-text', payload);

// ── Learning sessions ─────────────────────────────────────────
export const createLearnSession = (payload) =>
  api.post('/api/learn/session', payload);

export const getSessions = () =>
  api.get('/api/learn/sessions');

export const getLearnSession = (id) =>
  api.get(`/api/learn/session/${id}`);

export async function askLearnSession(sessionId, message, onDelta) {
  const supabaseModule = await import('./supabase.js');
  const supabase = supabaseModule.default;
  const { data: { session: authSession } } = await supabase.auth.getSession();
  const token = authSession?.access_token;
  const response = await fetch(
    (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/learn/session/' + sessionId + '/ask',
    {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ message })
    }
  );
  if (!response.ok) {
    const errData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errData.error || 'Failed to send message');
  }
  const reader  = response.body.getReader();
  const decoder = new TextDecoder();
  let   buffer  = '';
  let   lastSession = null;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'data: [DONE]') continue;
      if (trimmed.startsWith('data: ')) {
        try {
          const json = JSON.parse(trimmed.slice(6));
          if (json.error) throw new Error(json.error);
          if (json.delta && onDelta) onDelta(json.delta);
          if (json.session) lastSession = json.session;
        } catch (parseErr) {
          if (parseErr.message && !parseErr.message.includes('JSON')) throw parseErr;
        }
      }
    }
  }
  return { data: { session: lastSession } };
}

export const saveInsight = (sessionId, content, tags, sourceIds, insightType) =>
  api.post(`/api/learn/session/${sessionId}/insight`, { content, tags, source_ids: sourceIds, insight_type: insightType });

export const switchSessionMode = (id, mode) =>
  api.patch(`/api/learn/session/${id}/mode`, { mode });

export const completeSession = (id) =>
  api.post(`/api/learn/session/${id}/complete`);

export const addObservation = (id, observation) =>
  api.post(`/api/lab/${id}/observe`, { observation });

export const getInsights = (type) =>
  api.get('/api/learn/insights', { params: type ? { type } : {} });

export const getConcepts = () =>
  api.get('/api/learn/concepts');

// ── Lab ───
export const getExperiments = () =>
  api.get('/api/lab/experiments');

export const designExperiment = (payload) =>
  api.post('/api/lab/design', payload, { timeout: 90000 });

export const saveExperiment = (payload) =>
  api.post('/api/lab/experiment', payload);          // backend: POST /api/lab/experiment

export const updateExperiment = (id, payload) =>
  api.patch(`/api/lab/${id}/update`, payload);       // backend: PATCH /api/lab/:id/update

export const captureExperimentLessons = (id, payload) =>
  api.post(`/api/lab/${id}/capture`, payload);       // backend: POST /api/lab/:id/capture

// ── Simulation ────────────────────────────────────────────────────────
export const runSimulation = (payload) =>
  api.post('/api/simulate', payload, { timeout: 120000 });

// ── Source detail ─────────────────────────────────────────────────────
export const getSourceDetail = (id) => api.get(`/api/books/${id}`);

// ── Concept graph ─────────────────────────────────────────────────────
export const getConceptGraph = () => api.get('/api/learn/concepts');

// ── Experiment review ─────────────────────────────────────────────────
export const reviewExperiment = (id, data) =>
  api.post(`/api/lab/${id}/review`, data, { timeout: 90000 });

// ── AI study recommendations ──────────────────────────────────────────
export const getStudyRecommendations = () =>
  api.get('/api/learn/recommend').catch(() => ({ data: { recommendations: [] } }));

// ── Client-side grouping helper ───────────────────────────────────────
export function groupBySourceType(books) {
  const groups = {};
  (books || []).forEach(b => {
    const type = b.source_type || 'book';
    if (!groups[type]) groups[type] = [];
    groups[type].push(b);
  });
  return groups;
}

export default api;
