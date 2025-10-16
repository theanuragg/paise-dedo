'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
  required?: boolean;
}

export function FormField({
  label,
  htmlFor,
  children,
  error,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-[#e5e7eb]">
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
