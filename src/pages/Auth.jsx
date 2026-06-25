import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import supabase from '../lib/supabase.js';
import { useApp } from '../context/AppContext.jsx';
import Button from '../components/ui/Button.jsx';
import toast from 'react-hot-toast';

const QUOTES = [
  'Your next business breakthrough is hidden in a book.',
  'Every great founder was first a great reader.',
  'Read across sources. Think in one place.',
  'Read differently. Build differently.'
];

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const { user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/library');
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx(i => (i + 1) % QUOTES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Account created! Welcome to BookSphere.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Welcome back!');
      }
      navigate('/library');
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#fbf9f3] to-[#f7f4ed] p-12 border-r border-[#eceae4]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f5a623] rounded-xl flex items-center justify-center">
            <BookOpen size={20} className="text-[#1c1c1c]" />
          </div>
          <span className="text-[#1c1c1c] font-bold text-xl tracking-tight">BookSphere</span>
        </div>

        <div className="space-y-6">
          <div className="h-1 w-16 bg-[#f5a623] rounded-full" />
          <motion.div
            key={quoteIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-[#1c1c1c] leading-tight">
              {QUOTES[quoteIdx]}
            </h1>
          </motion.div>
          <p className="text-[#5f5f5d] text-base leading-relaxed max-w-md">
            Your personal Learning OS. Bring in books, articles, and notes,
            then think across all of them with six distinct learning modes.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          {['Multi-source RAG', 'Six Learning Modes', 'Concept Graph', 'Experience Lab'].map(tag => (
            <span key={tag} className="text-xs bg-[#fbf9f3] border border-[#eceae4] text-[#5f5f5d] px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-8 h-8 bg-[#f5a623] rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-[#1c1c1c]" />
            </div>
            <span className="text-[#1c1c1c] font-bold text-lg">BookSphere</span>
          </div>

          <h2 className="text-2xl font-bold text-[#1c1c1c] mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-[#5f5f5d] text-sm mb-8">
            {mode === 'login'
              ? 'Sign in to access your library.'
              : 'Start your reading journey today.'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-[#5f5f5d] mb-1.5 block font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#fbf9f3] border border-[#eceae4] rounded-xl px-4 py-3 text-[#1c1c1c] text-sm placeholder:text-[#8f8a80] outline-none focus:border-[#b8b3a8] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-[#5f5f5d] mb-1.5 block font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-[#fbf9f3] border border-[#eceae4] rounded-xl px-4 py-3 pr-10 text-[#1c1c1c] text-sm placeholder:text-[#8f8a80] outline-none focus:border-[#b8b3a8] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8a80] hover:text-[#5f5f5d]"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-[#5f5f5d] mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[#f5a623] hover:underline font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
