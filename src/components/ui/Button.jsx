import { motion } from 'framer-motion';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#f7f4ed] disabled:opacity-40 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#f5a623] text-[#1c1c1c] shadow-[rgba(255,255,255,0.5)_0px_0.5px_0px_0px_inset,rgba(28,28,28,0.12)_0px_0px_0px_1px_inset] hover:bg-[#e09520] focus:ring-[#f5a623]/45',
    secondary: 'bg-[#f3efe4] text-[#1c1c1c] border border-[#eceae4] hover:bg-[#eceae4] focus:ring-[#b8b3a8]',
    ghost: 'text-[#5f5f5d] hover:text-[#1c1c1c] hover:bg-[#1c1c1c]/[0.04] focus:ring-[#d6d2c7]',
    danger: 'bg-[#c85250] text-[#fcfbf8] hover:bg-[#b04040] focus:ring-[#c85250]/45',
    outline: 'border border-[#f5a623] text-[#f5a623] hover:bg-[#f5a623] hover:text-[#1c1c1c] focus:ring-[#f5a623]/45'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
