import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { saveUserProfile } from '../../lib/api.js';
import toast from 'react-hot-toast';

const INDUSTRIES = ['Technology', 'EdTech', 'FinTech', 'HealthTech', 'E-commerce', 'SaaS', 'Consulting', 'Manufacturing', 'Retail', 'Media', 'Other'];
const STAGES = [
  { value: 'idea', label: 'Idea stage' },
  { value: 'mvp', label: 'MVP / Early' },
  { value: 'growth', label: 'Growing' },
  { value: 'scale', label: 'Scaling' },
  { value: 'established', label: 'Established' }
];

export default function ProfileSetup({ onComplete, onClose, existingProfile }) {
  const [form, setForm] = useState({
    business_name: existingProfile?.business_name || '',
    industry: existingProfile?.industry || '',
    stage: existingProfile?.stage || '',
    team_size: existingProfile?.team_size || '',
    main_goal: existingProfile?.main_goal || '',
    current_challenge: existingProfile?.current_challenge || ''
  });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.business_name || !form.industry || !form.stage) {
      toast.error('Please fill in business name, industry, and stage');
      return;
    }
    setSaving(true);
    try {
      const { data } = await saveUserProfile(form);
      toast.success('Profile saved — your stories and chats are now personalised!');
      onComplete && onComplete(data);
    } catch (err) {
      const serverMsg = err.response?.data?.error || err.message;
      toast.error(serverMsg || 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#fbf9f3] border border-[#eceae4] rounded-2xl p-6 w-full max-w-md"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[#1c1c1c] font-semibold text-base">Your Business Profile</h2>
          <p className="text-[#5f5f5d] text-xs mt-1">Used to personalise chat answers and "apply to my business" insights</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-[#8f8a80] hover:text-[#5f5f5d] p-1">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-[#5f5f5d] mb-1 block">Business / Startup Name *</label>
          <input
            value={form.business_name}
            onChange={e => set('business_name', e.target.value)}
            placeholder="e.g. Acme EdTech"
            className="w-full bg-[#fbf9f3] border border-[#eceae4] rounded-lg px-3 py-2 text-sm text-[#1c1c1c] placeholder-[#8f8a80] focus:outline-none focus:border-[#f5a623]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[#5f5f5d] mb-1 block">Industry *</label>
            <select
              value={form.industry}
              onChange={e => set('industry', e.target.value)}
              className="w-full bg-[#fbf9f3] border border-[#eceae4] rounded-lg px-3 py-2 text-sm text-[#1c1c1c] focus:outline-none focus:border-[#f5a623]"
            >
              <option value="">Select...</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#5f5f5d] mb-1 block">Stage *</label>
            <select
              value={form.stage}
              onChange={e => set('stage', e.target.value)}
              className="w-full bg-[#fbf9f3] border border-[#eceae4] rounded-lg px-3 py-2 text-sm text-[#1c1c1c] focus:outline-none focus:border-[#f5a623]"
            >
              <option value="">Select...</option>
              {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs text-[#5f5f5d] mb-1 block">Team Size</label>
          <input
            value={form.team_size}
            onChange={e => set('team_size', e.target.value)}
            placeholder="e.g. just me, 3 people, 15+"
            className="w-full bg-[#fbf9f3] border border-[#eceae4] rounded-lg px-3 py-2 text-sm text-[#1c1c1c] placeholder-[#8f8a80] focus:outline-none focus:border-[#f5a623]"
          />
        </div>

        <div>
          <label className="text-xs text-[#5f5f5d] mb-1 block">Your Main Goal Right Now</label>
          <input
            value={form.main_goal}
            onChange={e => set('main_goal', e.target.value)}
            placeholder="e.g. Get first 100 paying customers"
            className="w-full bg-[#fbf9f3] border border-[#eceae4] rounded-lg px-3 py-2 text-sm text-[#1c1c1c] placeholder-[#8f8a80] focus:outline-none focus:border-[#f5a623]"
          />
        </div>

        <div>
          <label className="text-xs text-[#5f5f5d] mb-1 block">Biggest Challenge Right Now</label>
          <input
            value={form.current_challenge}
            onChange={e => set('current_challenge', e.target.value)}
            placeholder="e.g. Struggling to scale beyond early adopters"
            className="w-full bg-[#fbf9f3] border border-[#eceae4] rounded-lg px-3 py-2 text-sm text-[#1c1c1c] placeholder-[#8f8a80] focus:outline-none focus:border-[#f5a623]"
          />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        {onClose && (
          <button onClick={onClose} className="flex-1 py-2 text-sm text-[#5f5f5d] hover:text-[#1c1c1c] border border-[#eceae4] rounded-lg transition-colors">
            Skip for now
          </button>
        )}
        <Button onClick={handleSave} disabled={saving} className="flex-1">
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </motion.div>
  );
}
