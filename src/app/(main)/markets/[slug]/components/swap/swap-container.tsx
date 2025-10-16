// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { Connection } from '@solana/web3.js';
// import { DynamicBondingCurveClient } from '@meteora-ag/dynamic-bonding-curve-sdk';
// import GraduatedSwapSection from './graduated-swap-section';
// import { SwapSection } from './swap-section';

// interface SwapContainerProps {
//   poolAddress: string;
//   mintAddress: string;
//   tokenSymbol: string;
//   tokenImage?: string;
//   tokenName?: string;
// }

// export function SwapContainer({
//   poolAddress,
//   mintAddress,
//   tokenSymbol,
//   tokenImage,
//   tokenName,
// }: SwapContainerProps) {
//   const [isGraduated, setIsGraduated] = useState<boolean | null>(null);
//   const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

//   const connection = useMemo(
//     () => new Connection(process.env.NEXT_PUBLIC_RPC_URL!, 'confirmed'),
//     []
//   );

//   useEffect(() => {
//     try {
//       const saved = window.localStorage.getItem('swap.activeTab');
//       if (saved === 'buy' || saved === 'sell') {
//         setActiveTab(saved);
//       }
//     } catch {}
//   }, []);

//   useEffect(() => {
//     try {
//       window.localStorage.setItem('swap.activeTab', activeTab);
//     } catch {}
//   }, [activeTab]);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const dbcClient = new DynamicBondingCurveClient(
//           connection,
//           'confirmed'
//         );
//         const state = await dbcClient.state.getPool(poolAddress);
//         const poolStatus = (state as any)?.isMigrated;
//         if (!cancelled) {
//           setIsGraduated(!!poolStatus);
//         }
//       } catch (e) {
//         if (!cancelled) {
//           setIsGraduated(false);
//         }
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [connection, poolAddress]);

//   if (isGraduated === null) {
//     return null;
//   }

//   return isGraduated ? (
//     <GraduatedSwapSection
//       activeTab={activeTab}
//       onTabChange={setActiveTab}
//       connection={connection}
//       poolAddress={poolAddress}
//       mintAddress={mintAddress}
//       tokenSymbol={tokenSymbol}
//       tokenImage={tokenImage}
//       tokenName={tokenName}
//     />
//   ) : (
//     <SwapSection
//       connection={connection}
//       tokenMint={mintAddress}
//       tokenSymbol={tokenSymbol}
//       poolAddress={poolAddress}
//       tokenImage={tokenImage}
//       tokenName={tokenName}
//     />
//   );
// }

// export default SwapContainer;
