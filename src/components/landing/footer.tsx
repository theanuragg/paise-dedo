'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Send, Mail } from 'lucide-react';
import { useState } from 'react';
import { HowItWorksModal } from './how-it-works-modal';

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="w-full px-4 md:px-20 border-t border-neutral-400/20 py-4 transition-all duration-300">
      <div className="px-4 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-10">
              <Image
                src="/onlyfoundersdotfun cat-Photoroom.png"
                alt="OnlyFounders Logo"
                width={80}
                height={80}
                className="rounded-lg"
              />
              <p className="text-neutral-400 text-sm mb-6 max-w-sm">
                The world's first launchpad turning founders reputation into
                liquid, onchain capital.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="https://x.com/ofdotfun"
                target="_blank"
                className="text-neutral-400 hover:text-[#65e7fc] transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="https://www.linkedin.com/company/foundershubnetwork"
                target="_blank"
                className="text-neutral-400 hover:text-[#65e7fc] transition-colors"
              >
                <Linkedin size={20} />
              </Link>
              <Link
                href="https://t.me/onlyfoundersofficial/1"
                target="_blank"
                className="text-neutral-400 hover:text-[#65e7fc] transition-colors"
              >
                <Send size={20} />
              </Link>
              <Link
                href="mailto:moe@foundershub.network"
                className="text-neutral-400 hover:text-[#65e7fc] transition-colors"
              >
                <Mail size={20} />
              </Link>
            </div>
            <div className="mt-12">
              <p className="text-neutral-200 mb-3">Built on</p>
              <div className="flex items-center gap-4">
                <Link href={'https://solana.com'} target="_blank">
                  <Image
                    src="/solana.svg"
                    alt="Solana"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href={'https://www.meteora.ag/'} target="_blank">
                  <Image
                    src="/meteora.svg"
                    alt="Meteora"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href={'https://triton.one/'} target="_blank">
                  <Image
                    src="/triton.png"
                    alt="Triton"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link href={'https://jup.ag/'} target="_blank">
                  <Image src="/jup.svg" alt="Jupiter" width={24} height={24} />
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/markets"
                  className="text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  Browse Markets
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  How it Works
                </button>
              </li>
              <li>
                <Link
                  href="/markets/create"
                  className="text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  Create Token
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://only-founder.gitbook.io/only-founder-docs"
                  target="_blank"
                  className="text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.onlyfounders.xyz/about"
                  target="_blank"
                  className="text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.onlyfounders.xyz/blogs"
                  target="_blank"
                  className="text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-neutral-800/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-sm">
              © 2025 OnlyFounders. All rights reserved.
            </p>
            <Link
              href="https://www.producthunt.com/posts/onlyfounders"
              target="_blank"
              className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <span>Find us on</span>
              <span className="font-semibold">Product Hunt</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </div>
      <HowItWorksModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </footer>
  );
};

export default Footer;
