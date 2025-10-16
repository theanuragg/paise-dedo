'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import SwapComponent from './Swap';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  mintAddress: string;
  poolAddress: string;
  tokenSymbol: string;
  tokenImage?: string;
  tokenName?: string;
}

export function SwapModal({
  isOpen,
  onClose,
  mintAddress,
  poolAddress,
  tokenSymbol,
  tokenImage,
  tokenName,
}: SwapModalProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[85vh] bg-neutral-950 rounded-t-4xl border-neutral-800"
      >
        <div className="flex-1 mt-7 overflow-y-auto hide-scrollbar h-full">
          <SwapComponent mintAddress={mintAddress}/>
        </div>
      </SheetContent>
    </Sheet>
  );
}
