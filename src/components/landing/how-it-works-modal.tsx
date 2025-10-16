'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
  import Image from 'next/image';
import { useRouter } from 'next/navigation';
interface HowItWorksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const steps = [
  {
    id: 1,
    title: 'Create Your Token',
    description:
      'Launch your token with our simple, no-code interface. Set your tokenomics and launch in minutes.',
  },
  {
    id: 2,
    title: 'Build Your Community',
    description:
      'Engage with your supporters and build a strong community around your vision.',
  },
  {
    id: 3,
    title: 'Raise Capital',
    description:
      'Accept investments from verified backers who believe in your project and vision.',
  },
  {
    id: 4,
    title: 'Scale & Grow',
    description:
      'Use our tools and community support to scale your project and achieve your goals.',
  },
];

export const HowItWorksModal = ({
  open,
  onOpenChange,
  trigger,
}: HowItWorksModalProps) => {
  const router = useRouter();
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="min-w-2xl bg-[#101418]/95 border border-[#65e7fc]/10 rounded-3xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">How it works</DialogTitle>

        <div className="relative">
          <div className="py-6 px-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              How it works
            </h2>
          </div>

          <div className="flex justify-center py-6">
            <div className="relative">
              <Image
                src="/onlyfoundersdotfun cat-Photoroom.png"
                alt="Only Founders"
                height={200}
                width={200}
                className="scale-120"
              />
            </div>
          </div>

          <div className="text-center px-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Start as a founder
            </h3>
            <p className="text-gray-400 text-sm">
              Launch your token and become a verified founder
            </p>
          </div>

          <div className="px-6 pb-6 space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#65e7fc] text-black text-sm font-medium flex items-center justify-center">
                  {step.id}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">{step.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 pt-0">
            <Button
              onClick={() => router.push('/markets/create')}
              className="w-full bg-[#65e7fc] hover:bg-[#65e7fc]/90 text-black font-medium py-3 rounded-lg"
            >
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
