import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext.jsx';
import { useProfile } from './context/ProfileContext.jsx';
import Auth from './pages/Auth.jsx';
import Library from './pages/Library.jsx';
import BookHub from './pages/BookHub.jsx';
import LearnHub from './pages/LearnHub.jsx';
import LearningSession from './pages/LearningSession.jsx';
import ExperienceLab from './pages/ExperienceLab.jsx';
import LearningMemory from './pages/LearningMemory.jsx';
import ProfileSetup from './components/profile/ProfileSetup.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import SourceDetail from './pages/SourceDetail.jsx';
import KnowledgeMap from './pages/KnowledgeMap.jsx';
import ExperimentReview from './pages/ExperimentReview.jsx';
import BuilderStudio from './pages/BuilderStudio.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ed] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#f5a623]/20 border-t-[#f5a623] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  const { user, loading } = useApp();
  const { showProfileSetup, setShowProfileSetup, setProfile } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ed] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#f5a623]/20 border-t-[#f5a623] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/library" replace /> : <Navigate to="/auth" replace />}
        />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <ProtectedRoute>
              <BookHub />
            </ProtectedRoute>
          }
        />
        <Route path="/learn" element={<ProtectedRoute><LearnHub /></ProtectedRoute>} />
        <Route path="/learn/:sessionId" element={<ProtectedRoute><LearningSession /></ProtectedRoute>} />
        <Route path="/lab" element={<ProtectedRoute><ExperienceLab /></ProtectedRoute>} />
        <Route path="/memory" element={<ProtectedRoute><LearningMemory /></ProtectedRoute>} />
        <Route path="/source/:id" element={<ProtectedRoute><SourceDetail /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><KnowledgeMap /></ProtectedRoute>} />
        <Route path="/lab/:id/review" element={<ProtectedRoute><ExperimentReview /></ProtectedRoute>} />
        <Route path="/builder" element={<ProtectedRoute><BuilderStudio /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {user && <CommandPalette />}

      {user && showProfileSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <ProfileSetup
            onComplete={(data) => { setProfile(data); setShowProfileSetup(false); }}
            onClose={() => setShowProfileSetup(false)}
          />
        </div>
      )}
    </>
  );
}
