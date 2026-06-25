import * as React from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils.js';

function Avatar({ className, ...props }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn('relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }) {
  return <AvatarPrimitive.Image data-slot="avatar-image" className={cn('aspect-square h-full w-full', className)} {...props} />;
}

function AvatarFallback({ className, ...props }) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn('flex h-full w-full items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-[#a9690f]', className)}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
