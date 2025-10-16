'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const Step = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    step: number;
    isActive?: boolean;
    isCompleted?: boolean;
  }
>(({ step, isActive, isCompleted, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'size-10 rounded-full grid place-items-center text-sm font-medium border-2 transition-all duration-300',
      isActive
        ? 'border-[#00ffff] bg-[#00ffff] text-[#0a0f12]'
        : isCompleted
          ? 'border-[#00ffff] bg-[#00ffff] text-[#0a0f12]'
          : 'border-[#00ffff]/20 bg-transparent text-[#9ca3af]',
      className
    )}
    {...props}
  >
    {isCompleted ? <Check className="size-5" /> : step}
  </div>
));

Step.displayName = 'Step';

const StepContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mt-3 text-sm text-[#9ca3af] font-medium', className)}
    {...props}
  />
));

StepContent.displayName = 'StepContent';

export function Stepper({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        {Array.from({ length: total }, (_, i) => i).map(i => (
          <div key={i} className="flex items-center gap-3 relative">
            <Step
              step={i + 1}
              isActive={i === current - 1}
              isCompleted={i < current - 1}
            />
            {i < total && (
              <div className="relative h-[2px] w-12 sm:w-32">
                <div
                  className={cn(
                    'absolute inset-0 rounded-full transition-all duration-300',
                    i < current ? 'bg-[#00ffff]/50' : 'bg-[#00ffff]/10'
                  )}
                />
                {i < current && (
                  <div
                    className="absolute inset-0 rounded-full bg-[#00ffff]/20 animate-pulse"
                    style={{ animationDuration: '2s' }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <StepContent>
        Step {current} of {total}
      </StepContent>
    </div>
  );
}
