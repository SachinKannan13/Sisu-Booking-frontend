import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function ProcessingStatus({ status }) {
  if (status === 'ready') {
    return (
      <div className="flex items-center gap-1.5 text-[#2d9b6f] text-xs">
        <CheckCircle size={12} />
        <span>Ready</span>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex items-center gap-1.5 text-[#c85250] text-xs">
        <AlertCircle size={12} />
        <span>Processing failed</span>
      </div>
    );
  }

  // processing or pending
  return (
    <div className="flex items-center gap-1.5 text-[#f5a623] text-xs">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
      >
        <Clock size={12} />
      </motion.div>
      <span>Analysing...</span>
    </div>
  );
}
