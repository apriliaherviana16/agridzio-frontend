"use client";

import { Loader2 } from 'lucide-react';

/**
 * Simple spinner component for loading states.  
 * Utilises Tailwind’s animate-spin class with a Lucide icon to display an
 * animated loader. An optional className can be passed to adjust size or
 * color.
 */
export default function Spinner({ className }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className || ''}`} />;
}