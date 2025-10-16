import React from 'react';
import { Metadata } from 'next';
import LaunchTokenForm from './components/LaunchTokenForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Create Token - ICM Platform',
  description:
    'Launch your own cryptocurrency token with our step-by-step process. Configure settings, add branding, and deploy to the blockchain.',
  keywords: [
    'token creation',
    'cryptocurrency',
    'blockchain',
    'DeFi',
    'token launch',
  ],
};

export default function CreateProjectPage() {
  return (
    <div className="min-h-screen bg-neutral-950/10 rounded-4xl">
      <div className="py-8 px-4">
        <Link
          className="text-sm mb-6 text-neutral-300 hover:text-white cursor-pointer flex items-center gap-2 w-fit"
          href={'/markets'}
        >
          <ArrowLeft className="size-4" /> Back
        </Link>
        <h1 className="text-2xl font-semibold text-gray-300 text-center mb-12">
          Launch Your Token
        </h1>
        <LaunchTokenForm/>
      </div>
    </div>
  );
}
