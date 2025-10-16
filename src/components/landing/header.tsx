'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HowItWorksModal } from './how-it-works-modal';
import ConnectWalletButton from '../wallet/ConnectWalletButton';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Plus } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '../ui/button';

interface HeaderProps {
  onSidebarToggle?: () => void;
  isSidebarExpanded?: boolean;
}

export default function Header({
  onSidebarToggle,
  isSidebarExpanded = true,
}: HeaderProps) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { connected } = useWallet();

  const navigationItems = [
    { id: 'tokens', label: 'Tokens', href: '/markets' },
    {
      id: 'docs',
      label: 'Documentation',
      href: 'https://only-founder.gitbook.io/only-founder-docs',
      external: true,
    },
  ];

  useEffect(() => {
    if (connected) {
      const isFirstConnection =
        localStorage.getItem('firstConnection') !== 'done';

      if (isFirstConnection) {
        localStorage.setItem('firstConnection', 'done');
        router.push('/markets');
      }
    }
  }, [connected, router]);

  const headerClasses = `fixed top-0 backdrop-blur-sm z-40 transition-all duration-300 md:bg-transparent backdrop-blur-md md:border-none md:border-b border-white/10 ${
    onSidebarToggle && isSidebarExpanded
      ? 'md:left-80 md:right-0 left-0 right-0'
      : onSidebarToggle && !isSidebarExpanded
        ? 'md:left-20 md:right-0 left-0 right-0'
        : 'left-0 right-0'
  }`;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
          staggerChildren: 0.1,
          delayChildren: 0.2,
        }}
        className={headerClasses}
      >
        <div className="mx-auto max-w-7xl flex w-full items-center justify-between px-4 md:py-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-center md:gap-20"
          >
            <Link href="/" aria-label="Home" className="group">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/onlyfoundersdotfun cat-Photoroom.png"
                  alt="OnlyFounders Logo"
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
              </motion.div>
            </Link>
            <div className="hidden lg:flex items-center gap-8">
              <Button
                variant="link"
                className="text-cyan-100 hover:text-[#65e7fc] transition-colors duration-200 font-medium"
                onClick={() => setShowHowItWorks(true)}
              >
                <span>How it Works</span>
              </Button>
              <HowItWorksModal
                trigger={'How It Works'}
                onOpenChange={setShowHowItWorks}
                open={showHowItWorks}
              />
              {navigationItems.map(item =>
                item.external ? (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-100 hover:text-[#65e7fc] transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="text-cyan-100 hover:text-[#65e7fc] transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>

          <div className="hidden lg:flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.3,
              }}
            >
              <ConnectWalletButton />
            </motion.div>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <ConnectWalletButton isMobile={true} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-black/20 border border-white/10 hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          {onSidebarToggle && (
            <button
              onClick={onSidebarToggle}
              className="hidden md:block p-2 rounded-lg bg-black/20 border border-white/10"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-[#020617]/30 backdrop-blur-md border-b border-white/10 p-4"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.2,
                      }}
                    >
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center px-4 py-3 rounded-lg text-white/80 hover:text-[#65e7fc] hover:bg-white/5 transition-all duration-200"
                        >
                          <span>{item.label}</span>
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center px-4 py-3 rounded-lg text-white/80 hover:text-[#65e7fc] hover:bg-white/5 transition-all duration-200"
                        >
                          <span>{item.label}</span>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="border-t border-white/10 pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  <Link
                    href="/markets/create"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="secondary"
                      className="w-full rounded-xl cursor-pointer bg-gradient-to-l from-cyan-400 to-blue-500 text-white px-6 py-4 hover:from-blue-500 hover:to-cyan-400 transition-colors duration-300 font-medium"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tokenize Yourself
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <HowItWorksModal open={showHowItWorks} onOpenChange={setShowHowItWorks} />
    </>
  );
}
