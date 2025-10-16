'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import WalletModal from './WalletModel';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { WalletError } from '@solana/wallet-adapter-base';
import { PlasticButton } from '../ui/plastic-button';

interface ConnectWalletButtonProps {
  className?: string;
  isMobile?: boolean;
}

export default function ConnectWalletButton({
  className = '',
  isMobile = false,
}: ConnectWalletButtonProps) {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [hasShownInitialModal, setHasShownInitialModal] = useState(false);
  const [isManualConnection, setIsManualConnection] = useState(false);

  const { connected, publicKey, disconnect, connecting, select, wallet } =
    useWallet();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    const fetchWalletAddress = async () => {
      let addressStr: string | undefined;
      if (publicKey) {
        addressStr = publicKey.toString();
      }

      setWalletAddress(addressStr || '');
    };

    fetchWalletAddress();
  }, [publicKey]);

  useEffect(() => {
    if (connected && isManualConnection && !hasShownInitialModal) {
      setShowWalletModal(true);
      setHasShownInitialModal(true);
      setIsManualConnection(false);
    }
  }, [connected, isManualConnection, hasShownInitialModal]);

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setShowWalletModal(false);
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const handleLoginClick = async () => {
    if (connected) {
      setShowWalletModal(true);
    } else {
      setIsManualConnection(true);
      try {
        // Show the wallet selection modal
        setVisible(true);
      } catch (error) {
        console.error('Wallet connection error:', error);
        toast.error('Failed to open wallet selection', {
          description: 'Please try again',
          duration: 4000,
        });
        setIsManualConnection(false);
      }
    }
  };

  // Handle wallet connection errors
  useEffect(() => {
    if (wallet && wallet.adapter) {
      const handleError = (error: WalletError) => {
        console.error('Wallet error:', error);

        if (error.name === 'WalletNotSelectedError') {
          // User cancelled wallet selection
          setIsManualConnection(false);
          return;
        }

        if (error.name === 'WalletNotConnectedError') {
          // User rejected connection
          toast.error('Wallet connection was rejected', {
            description: 'Please try connecting again',
            duration: 4000,
          });
          setIsManualConnection(false);
          return;
        }

        setIsManualConnection(false);
      };

      wallet.adapter.on('error', handleError);

      return () => {
        wallet.adapter.off('error', handleError);
      };
    }
  }, [wallet]);

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getButtonText = () => {
    if (connected && walletAddress) {
      return isMobile
        ? formatAddress(walletAddress)
        : formatAddress(walletAddress);
    }

    if (connecting) {
      return 'Connecting...';
    }

    return 'Connect Wallet';
  };

  return (
    <>
      <div onClick={connecting ? undefined : handleLoginClick}>
        <PlasticButton text={getButtonText()} disabled={connecting} />
      </div>

      <WalletModal
        open={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        disconnect={handleDisconnect}
      />
    </>
  );
}
