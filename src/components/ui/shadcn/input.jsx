import * as React from 'react';
import { cn } from '@/lib/utils.js';

const Input = React.forwardRef(function Input({ className, type, ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        'flex h-9 w-full min-w-0 rounded-lg border border-border bg-card px-3 py-1 text-sm text-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-border-strong/40 focus-visible:ring-[3px] focus-visible:ring-ring/45',
        className
      )}
      {...props}
    />
  );
});

export { Input };
