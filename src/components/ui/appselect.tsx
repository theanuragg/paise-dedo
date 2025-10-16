'use client';

import { ChevronDown, Check } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export type AppSelectOption = { label: string; value: string };

export function AppSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  className,
}: {
  id?: string;
  value?: string;
  onChange: (next: string) => void;
  options: AppSelectOption[];
  placeholder?: string;
  className?: string;
}) {
  const selected = options.find(o => o.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            'flex w-full items-center justify-between rounded-md border border-[#00ffff]/10 bg-[#0a0f12]/60 px-3 py-2 text-sm text-[#e5e7eb] shadow-xs outline-none transition-all duration-300 hover:border-[#00ffff]/30 focus:border-[#00ffff]/50 focus:outline-none focus:ring-0 cursor-pointer',
            className
          )}
          aria-haspopup="listbox"
          aria-expanded="false"
        >
          <span
            className={cn(
              'truncate text-left',
              !selected ? 'text-[#9ca3af]' : 'text-[#e5e7eb]'
            )}
          >
            {selected ? selected.label : (placeholder ?? 'Select')}
          </span>
          <ChevronDown className="ml-2 size-4 shrink-0 opacity-70 text-[#9ca3af]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[--radix-dropdown-menu-trigger-width] p-1 bg-[#0a0f12]/95 border border-[#00ffff]/20 backdrop-blur-xl"
      >
        {options.map(opt => {
          const isActive = opt.value === value;
          return (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                'cursor-pointer rounded-sm px-2 py-1.5 text-sm transition-all duration-200 focus:bg-[#0a0f12]/80 focus:text-[#00ffff]',
                isActive
                  ? 'bg-[#00ffff]/20 text-[#00ffff]'
                  : 'text-[#e5e7eb] hover:bg-[#0a0f12]/80 hover:text-[#00ffff]'
              )}
            >
              <span className="mr-2 inline-flex size-4 items-center justify-center">
                {isActive ? <Check className="size-4" /> : null}
              </span>
              <span>{opt.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}