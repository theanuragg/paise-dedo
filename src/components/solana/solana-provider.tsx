import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import {
  createSolanaMainnet,
  createSolanaLocalnet,
  createWalletUiConfig,
  WalletUi,
  createSolanaDevnet,
} from '@wallet-ui/react';

export const WalletButton = dynamic(
  async () => (await import('@wallet-ui/react')).WalletUiDropdown,
  {
    ssr: false,
  }
);
export const ClusterButton = dynamic(
  async () => (await import('@wallet-ui/react')).WalletUiClusterDropdown,
  {
    ssr: false,
  }
);

// const config = createWalletUiConfig({
//   clusters: [createSolanaMainnet(), createSolanaLocalnet()],
// });
const config = createWalletUiConfig({
  clusters: [createSolanaDevnet(), createSolanaLocalnet()],
});

// export function SolanaProvider({ children }: { children: ReactNode }) {
//   return <WalletUi config={config}>{children}</WalletUi>;
// }
export function SolanaProvider({ children }: { children: ReactNode }) {
  return <WalletUi config={config}>{children}</WalletUi>;
}
