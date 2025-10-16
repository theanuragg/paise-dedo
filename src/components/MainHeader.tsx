'use client';

import {
  Plus,
  Menu,
  X,
  User,
  Wallet,
  Copy,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import ConnectWalletButton from './wallet/ConnectWalletButton';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import WalletModel from './wallet/WalletModel';
import { PlasticButton } from './ui/plastic-button';
import { IconUserFilled } from '@tabler/icons-react';

export function MainHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);
  const currentPath = usePathname();
  const { connected, publicKey, disconnect } = useWallet();

  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toString());
    } else {
      setWalletAddress('');
    }
  }, [connected, publicKey]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success('Address copied to clipboard!');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error('Failed to disconnect wallet');
    }
  };
  const navigationItems = [
    { id: 'home', label: 'Home', href: '/' },
    {
      id: 'explore',
      label: 'Explore Markets',
      href: '/markets',
    },
    {
      id: 'create',
      label: 'Launch Token',
      href: '/markets/create',
    },
    {
      id: 'docs',
      label: 'Documentation',
      href: 'https://only-founder.gitbook.io/only-founder-docs',
    },
  ];

  return (
    <header className="fixed top-0 right-0 left-0 bg-[#0C1014] z-50 transition-all duration-300 py-2 px-6">
      <div className="mx-auto flex w-full px-4 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/onlyfoundersdotfun cat-Photoroom.png"
              alt="OnlyFounders Logo"
              width={60}
              height={60}
              className="rounded-lg"
            />
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {navigationItems.map(item => {
            const isActive = isHydrated && item.href === currentPath;
            return (
              <Link
                key={item.id}
                href={item.href}
                target={item.id === 'docs' ? '_blank' : undefined}
                rel={item.id === 'docs' ? 'noopener noreferrer' : undefined}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/5 ${
                  isActive
                    ? 'text-[#65e7fc] bg-white/5'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:grid grid-cols-2 gap-3">
          <Link href="/markets/create" className="w-full">
            <PlasticButton text="Tokenize Yourself" />
          </Link>

          {connected && walletAddress ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 text-cyan-400 hover:text-cyan-300 focus:outline-none focus-visible:ring-0"
                >
                  <span className="font-mono text-sm">
                    {formatAddress(walletAddress)}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-black/90 backdrop-blur-md border border-cyan-500/20 rounded-xl"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setWalletModalOpen(true)}
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 cursor-pointer"
                >
                  <Wallet className="w-4 h-4" />
                  <span>View Wallet</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleCopyAddress}
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy address</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDisconnect}
                  className="flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="w-full">
              <ConnectWalletButton />
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="lg:hidden flex items-center gap-4">
          {connected && walletAddress ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-cyan-400 cursor-pointer">
                  <IconUserFilled className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-black/90 backdrop-blur-md border border-cyan-500/20 rounded-xl"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setWalletModalOpen(true)}
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 cursor-pointer"
                >
                  <Wallet className="w-4 h-4" />
                  <span>View Wallet</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleCopyAddress}
                  className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy address</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDisconnect}
                  className="flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <ConnectWalletButton />
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-cyan-400"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-cyan-300" />
            ) : (
              <Menu className="w-6 h-6 text-cyan-300" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#0C1014] border-b border-white/10 p-4"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {navigationItems.map((item, index) => {
                  const isActive = isHydrated && item.href === currentPath;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.2,
                      }}
                    >
                      <Link
                        href={item.href}
                        target={item.id === 'docs' ? '_blank' : undefined}
                        rel={item.id === 'docs' ? 'noopener noreferrer' : undefined}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/5 ${
                          isActive
                            ? 'text-[#65e7fc] bg-white/5'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
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
                  <PlasticButton text="Tokenize Yourself" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet Modal */}
      <WalletModel
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        disconnect={handleDisconnect}
      />
    </header>
  );
}
