"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchSolBalance } from "@/lib/action";
interface WalletModalProps {
  open: boolean;
  onClose: () => void;
  disconnect: () => void;
}

export default function WalletModal({
  open,
  onClose,
  disconnect,
}: WalletModalProps) {
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();

  const { data: solBalance, isLoading: balanceLoading } = useQuery({
    enabled: !!publicKey,
    queryKey: ["sol-balance", publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) return 0;
      return await fetchSolBalance(connection, publicKey);
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      toast.success("Address copied to clipboard");
    }
  };

  const handleViewExplorer = () => {
    if (publicKey) {
      window.open(
        `https://solscan.io/account/${publicKey.toString()}`,
        "_blank"
      );
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Wallet Connected</DialogTitle>
          <DialogDescription className="text-gray-400">
            Your wallet is successfully connected
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {wallet && (
            <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
              {wallet.adapter.icon && (
                <img
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  className="size-12 rounded-full"
                />
              )}
              <span className="font-medium text-white">{wallet.adapter.name}</span>
            </div>
          )}

          {publicKey && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Address</p>
              <div className="flex items-center gap-2 p-3 bg-gray-900/50 rounded-lg border border-gray-800 font-mono text-sm">
                <span className="flex-1 truncate text-gray-300">{publicKey.toString()}</span>
              </div>
            </div>
          )}

          {publicKey && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Balance</p>
              <div className="flex items-center gap-2 p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-sm">
                {balanceLoading ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  <span className="font-medium text-white">{solBalance?.toFixed(4)} SOL</span>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent border-gray-800 text-white hover:bg-gray-900 hover:text-white"
              onClick={handleCopyAddress}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Address
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent border-gray-800 text-white hover:bg-gray-900 hover:text-white"
              onClick={handleViewExplorer}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start bg-red-600 hover:bg-red-700 text-white border-0"
              onClick={handleDisconnect}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect Wallet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
