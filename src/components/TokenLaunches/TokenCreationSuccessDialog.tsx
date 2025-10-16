'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Crown, ExternalLink, Trophy, User, Zap } from 'lucide-react';
import {
  IconBrandTelegram,
  IconBrandXFilled,
  IconBrandZapier,
  IconCrown,
  IconTrophyFilled,
} from '@tabler/icons-react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Image from 'next/image';
import Link from 'next/link';
interface TokenCreationSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tokenData?: {
    name: string;
    symbol: string;
    mintAddress?: string;
    poolAddress?: string;
  };
}

export function TokenCreationSuccessDialog({
  isOpen,
  onClose,
  tokenData,
}: TokenCreationSuccessDialogProps) {
  const router = useRouter();

  const handleGoToProfile = () => {
    router.push('/profile');
    onClose();
  };

  const communityLinks = [
    {
      name: 'Follow X',
      icon: IconBrandXFilled,
      url: 'https://x.com/ofdotfun',
      color: 'text-blue-400 hover:text-blue-300',
    },
    {
      name: 'Join Telegram',
      icon: IconBrandTelegram,
      url: 'https://t.me/onlyfoundersofficial',
      color: 'text-cyan-400 hover:text-cyan-300',
    },
    {
      name: 'Documents',
      icon: ExternalLink,
      url: 'https://foundershub.notion.site/OnlyFounders-Fun-Docs-0e442ea1dd764c1d921681ddcdf5c871?source=copy_link',
      color: 'text-purple-400 hover:text-purple-300',
    },
  ];

  React.useEffect(() => {
    if (!isOpen) return;

    const triggerConfetti = async () => {
      try {
        const confettiModule = await import('canvas-confetti');
        const confetti = confettiModule.default as any;

        const end = Date.now() + 1 * 1000;
        const colors = ['#00e5ff', '#00bcd4', '#26c6da', '#4dd0e1'];

        const frame = () => {
          if (Date.now() > end) return;

          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            startVelocity: 60,
            origin: { x: 0, y: 0.5 },
            colors: colors,
          });
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            startVelocity: 60,
            origin: { x: 1, y: 0.5 },
            colors: colors,
          });

          requestAnimationFrame(frame);
        };
        frame();
      } catch (error) {
        console.log('Could not load confetti:', error);
      }
    };

    triggerConfetti();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-2xl w-[95vw] bg-[#101418]/95 border border-[#65e7fc]/10 rounded-3xl p-0 overflow-hidden backdrop-blur-sm">
        <DialogTitle className="sr-only">Token Creation Success</DialogTitle>
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="/onlyfoundersdotfun cat-Photoroom.png"
              alt="Success"
              fill
              className="object-cover opacity-5"
            />
          </div>
          <div className="text-center p-6 border-[#65e7fc]/10">
            <h2 className="text-xl font-semibold text-white mb-2 flex items-center justify-center gap-2">
              <IconCrown className="w-7 h-7 text-yellow-400 fill-yellow-400" />
              Congratulations, Founder!
            </h2>
            <p className="text-gray-400 text-sm">
              You've successfully created your token and joined the exclusive
              community of founders at{' '}
              <span className="text-[#65e7fc] font-semibold">
                Only Founders
              </span>
              !
            </p>
          </div>

          {tokenData && (
            <div className="px-6">
              <div className="rounded-xl border border-[#65e7fc]/10 bg-[#0a0f12]/60 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-white font-semibold">
                    Token Created Successfully
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white font-medium">
                      {tokenData.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Symbol:</span>
                    <Badge
                      variant="outline"
                      className="text-[#65e7fc] border-[#65e7fc]/30"
                    >
                      {tokenData.symbol}
                    </Badge>
                  </div>
                  {tokenData.mintAddress && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mint:</span>
                      <span className="text-white font-mono text-xs">
                        {tokenData.mintAddress.slice(0, 8)}...
                        {tokenData.mintAddress.slice(-8)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="rounded-xl backdrop-blur-sm border border-yellow-400/20 bg-gradient-to-r from-yellow-400/5 to-orange-500/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <IconTrophyFilled className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">
                  Founder Benefits Unlocked
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <IconBrandZapier className="w-4 h-4 text-yellow-400" />
                  <span>Access to exclusive founder community</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCrown className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>Priority support and features</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconTrophyFilled className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>Special founder badge on profile</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-white font-semibold text-center mb-4">
              Next Steps 
            </h4>
            <div className="flex items-center justify-around gap-4">
              {communityLinks.map(link => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center backdrop-blur-sm gap-3 p-3 rounded-lg border border-[#65e7fc]/10 bg-[#0a0f12]/40 hover:border-[#65e7fc]/30 w-full transition-all duration-300 group ${link.color}`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="px-6 pb-3">
            <div className="space-y-3">
              <Button
                onClick={handleGoToProfile}
                className="w-full bg-[#65e7fc] hover:bg-[#65e7fc]/90 text-black font-medium py-3 rounded-lg"
              >
                View My Tokens & Profile
              </Button>
              <Link href="/markets">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white"
                >
                  Continue Exploring
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
