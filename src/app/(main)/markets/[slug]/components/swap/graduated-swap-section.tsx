// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
// import { CpAmm } from '@meteora-ag/cp-amm-sdk';
// import BN from 'bn.js';
// import { toast } from 'sonner';
// import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
// import { getGraduationAddress } from '@/utils/getGraduationAddress';
// import ConnectWalletButton from '@/components/wallet/ConnectWalletButton';

// interface GraduatedSwapSectionProps {
//   activeTab?: 'buy' | 'sell';
//   onTabChange?: (tab: 'buy' | 'sell') => void;
//   connection: Connection;
//   poolAddress: string;
//   mintAddress: string;
//   tokenSymbol: string;
//   tokenImage?: string;
//   tokenName?: string;
// }

// export function GraduatedSwapSection({
//   activeTab = 'buy',
//   onTabChange,
//   poolAddress,
//   mintAddress,
//   connection,
//   tokenSymbol,
//   tokenImage,
//   tokenName,
// }: GraduatedSwapSectionProps) {
//   const [buyAmount, setBuyAmount] = useState('');
//   const [sellAmount, setSellAmount] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [graduatedPoolAddress, setGraduatedPoolAddress] = useState<
//     string | null
//   >(null);
//   const [solBalance, setSolBalance] = useState<number>(0);
//   const [tokenBalance, setTokenBalance] = useState<number>(0);
//   const wallet = useWallet();

//   const PUBLIC_KEY_MINT = new PublicKey(mintAddress);
//   const PUBLIC_KEY_POOL = new PublicKey(poolAddress);

//   useEffect(() => {
//     const fetchGraduatedAddress = async () => {
//       try {
//         const address = await getGraduationAddress({
//           connection,
//           poolAddress: PUBLIC_KEY_POOL,
//           mintAddress: PUBLIC_KEY_MINT,
//         });
//         if (address) {
//           setGraduatedPoolAddress(address.toString());
//         }
//         console.log('Graduated pool address:', address?.toString());
//       } catch (error) {
//         console.error('Failed to fetch graduation address:', error);
//       }
//     };

//     fetchGraduatedAddress();
//   }, [connection, poolAddress, mintAddress]);

//   useEffect(() => {
//     const fetchBalances = async () => {
//       if (!wallet.publicKey) {
//         setSolBalance(0);
//         setTokenBalance(0);
//         return;
//       }

//       try {
//         const balance = await connection.getBalance(wallet.publicKey);
//         setSolBalance(balance / LAMPORTS_PER_SOL);

//         const { getAccount, getAssociatedTokenAddress } = await import(
//           '@solana/spl-token'
//         );
//         try {
//           const tokenAccount = await getAssociatedTokenAddress(
//             PUBLIC_KEY_MINT,
//             wallet.publicKey
//           );
//           const accountInfo = await getAccount(connection, tokenAccount);
//           setTokenBalance(Number(accountInfo.amount) / LAMPORTS_PER_SOL);
//         } catch (error) {
//           setTokenBalance(0);
//         }
//       } catch (error) {
//         console.error('Failed to fetch balances:', error);
//       }
//     };

//     fetchBalances();

//     const interval = setInterval(fetchBalances, 10000);
//     return () => clearInterval(interval);
//   }, [wallet.publicKey, connection, mintAddress]);

//   const TOKEN_SYMBOL = tokenSymbol;
//   const SLIPPAGE = 0.5;

//   const cpAmm = new CpAmm(connection);

//   async function performCpAmmSwap(amountIn: BN, swapAToB: boolean) {
//     if (!wallet.connected || !wallet.publicKey) {
//       toast.error('Please connect your wallet first');
//       return;
//     }

//     if (!wallet.signTransaction) {
//       toast.error('Wallet does not support transaction signing');
//       return;
//     }

//     if (!graduatedPoolAddress) {
//       toast.error('Graduated pool address not available');
//       return;
//     }

//     const poolState = await cpAmm.fetchPoolState(
//       new PublicKey(graduatedPoolAddress)
//     );

//     const currentSlot = await connection.getSlot();
//     const blockTime = await connection.getBlockTime(currentSlot);
//     if (blockTime === null) {
//       toast.error('Unable to fetch block time');
//       throw new Error('Unable to fetch block time');
//     }
//     const inputMint = swapAToB ? poolState.tokenAMint : poolState.tokenBMint;
//     const outputMint = swapAToB ? poolState.tokenBMint : poolState.tokenAMint;
//     const tokenADecimal = 9;
//     const tokenBDecimal = 9;

//     const quote = await cpAmm.getQuote({
//       inAmount: amountIn,
//       inputTokenMint: inputMint,
//       slippage: SLIPPAGE,
//       poolState,
//       currentTime: blockTime,
//       currentSlot,
//       tokenADecimal,
//       tokenBDecimal,
//     });

//     const swapTx = await cpAmm.swap({
//       payer: wallet.publicKey,
//       pool: new PublicKey(graduatedPoolAddress),
//       inputTokenMint: inputMint,
//       outputTokenMint: outputMint,
//       amountIn: amountIn,
//       minimumAmountOut: quote.minSwapOutAmount,
//       tokenAVault: poolState.tokenAVault,
//       tokenBVault: poolState.tokenBVault,
//       tokenAMint: poolState.tokenAMint,
//       tokenBMint: poolState.tokenBMint,
//       tokenAProgram: TOKEN_PROGRAM_ID,
//       tokenBProgram: TOKEN_PROGRAM_ID,
//       referralTokenAccount: null,
//     });

//     const { blockhash, lastValidBlockHeight } =
//       await connection.getLatestBlockhash('confirmed');
//     swapTx.recentBlockhash = blockhash;
//     swapTx.lastValidBlockHeight = lastValidBlockHeight;
//     swapTx.feePayer = wallet.publicKey;

//     const signedTx = await wallet.signTransaction(swapTx);
//     const signature = await connection.sendRawTransaction(
//       signedTx.serialize(),
//       {
//         maxRetries: 5,
//         skipPreflight: false,
//       }
//     );
//     const confirmation = await connection.confirmTransaction(
//       { signature, blockhash, lastValidBlockHeight },
//       'confirmed'
//     );

//     if (confirmation.value.err) {
//       throw new Error('Transaction confirmation failed');
//     }
//   }

//   const handleBuy = async () => {
//     if (!buyAmount || parseFloat(buyAmount) <= 0) {
//       toast.error('Please enter a valid amount');
//       return;
//     }
//     try {
//       setIsLoading(true);
//       toast('Processing buy transaction...', { duration: 4000 });
//       const lamports = new BN(Math.floor(parseFloat(buyAmount) * 1e9));
//       await performCpAmmSwap(lamports, false);
//       toast.success('Buy successful');
//       setBuyAmount('');
//     } catch (e: any) {
//       console.log(' Error during buy:', e);

//       toast.error(e?.message || 'Swap failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSell = async () => {
//     if (!sellAmount || parseFloat(sellAmount) <= 0) {
//       toast.error('Please enter a valid amount');
//       return;
//     }
//     try {
//       setIsLoading(true);
//       toast('Processing sell transaction...', { duration: 4000 });
//       const baseUnits = new BN(Math.floor(parseFloat(sellAmount) * LAMPORTS_PER_SOL));
//       await performCpAmmSwap(baseUnits, true);
//       setSellAmount('');
//       toast.success('Sell successful');
//     } catch (e: any) {
//       toast.error(e?.message || 'Swap failed');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const currentAmount = activeTab === 'buy' ? buyAmount : sellAmount;
//   const setCurrentAmount = activeTab === 'buy' ? setBuyAmount : setSellAmount;

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <div className="bg-[#1a1f2e] border border-[#2a3441] rounded-[28px] p-3 space-y-4">
//         <div className="flex bg-[#2a3441] rounded-[20px] p-1">
//           <button
//             onClick={() => onTabChange?.('buy')}
//             className={`flex-1 py-4 px-4 rounded-2xl font-medium transition-all ${
//               activeTab === 'buy'
//                 ? 'bg-cyan-400 text-white'
//                 : 'text-slate-400 hover:text-white'
//             }`}
//           >
//             Buy
//           </button>
//           <button
//             onClick={() => onTabChange?.('sell')}
//             className={`flex-1 py-4 px-4 rounded-2xl font-medium transition-all ${
//               activeTab === 'sell'
//                 ? 'bg-red-500 text-white'
//                 : 'text-slate-400 hover:text-white'
//             }`}
//           >
//             Sell
//           </button>
//         </div>

//         <div className="space-y-2">
//           <div className="bg-[#2a3441] rounded-2xl p-4">
//             <div className="relative flex items-center justify-between">
//               <input
//                 type="number"
//                 placeholder="0.00"
//                 value={currentAmount}
//                 onChange={e => setCurrentAmount(e.target.value)}
//                 className="bg-transparent text-left text-xl font-medium text-white placeholder-slate-500 border-none outline-none flex-1"
//               />
//               <div className="absolute -right-2.5 flex items-center gap-2 bg-[#1a1f2e] rounded-[14px] px-3 py-3">
//                 {activeTab === 'buy' ? (
//                   <>
//                     <Image
//                       src="/solana.png"
//                       alt="SOL"
//                       width={20}
//                       height={20}
//                       className="rounded-full size-7 object-cover"
//                     />
//                     <span className="text-white font-medium">SOL</span>
//                   </>
//                 ) : (
//                   <>
//                     {tokenImage ? (
//                       <Image
//                         src={tokenImage}
//                         alt={TOKEN_SYMBOL}
//                         width={20}
//                         height={20}
//                         className="rounded-full"
//                       />
//                     ) : (
//                       <div className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
//                     )}
//                     <span className="text-white font-medium">
//                       {TOKEN_SYMBOL}
//                     </span>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-1 font-mono">
//           <button
//             onClick={() => setCurrentAmount('')}
//             className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//           >
//             Reset
//           </button>
//           {activeTab === 'buy' ? (
//             <>
//               <button
//                 onClick={() => setBuyAmount('0.1')}
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 0.1
//               </button>
//               <button
//                 onClick={() => setBuyAmount('0.5')}
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 0.5
//               </button>
//               <button
//                 onClick={() => setBuyAmount('1')}
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 1
//               </button>
//               <button
//                 onClick={async () => {
//                   if (wallet.publicKey) {
//                     const balance = await connection.getBalance(
//                       wallet.publicKey
//                     );
//                     setBuyAmount(
//                       (balance / LAMPORTS_PER_SOL - 0.000105).toString()
//                     );
//                   }
//                 }}
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 MAX
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 onClick={() => setSellAmount((tokenBalance * 0.25).toString())}
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 25%
//               </button>
//               <button
//                 onClick={() => setSellAmount((tokenBalance * 0.5).toString())}
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 50%
//               </button>
//               <button
//                 onClick={() => setSellAmount((tokenBalance * 0.75).toString())}
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 75%
//               </button>
//               <button
//                 onClick={() => setSellAmount(tokenBalance.toString())}
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 100%
//               </button>
//             </>
//           )}
//         </div>

//         <div className="bg-[#2a3441] rounded-xl p-4 space-y-3">
//           <div className="flex justify-between items-center text-sm">
//             <span className="text-slate-400">You will receive:</span>
//             <div className="text-right">
//               <div className="text-white font-medium">
//                 {currentAmount ? '~' : '0.00'}
//               </div>
//               <div className="text-xs text-slate-400">
//                 {activeTab === 'buy' ? TOKEN_SYMBOL : 'SOL'}
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-between items-center text-sm">
//             <span className="text-slate-400">Slippage Tolerance:</span>
//             <span className="text-white font-medium">{SLIPPAGE}%</span>
//           </div>
//         </div>

//         <div className="pt-2">
//           {wallet.connected ? (
//             <Button
//               onClick={activeTab === 'buy' ? handleBuy : handleSell}
//               disabled={
//                 isLoading || !currentAmount || parseFloat(currentAmount) <= 0
//               }
//               className={`w-full py-6 text-base font-medium rounded-xl transition-all duration-200 ${
//                 activeTab === 'buy'
//                   ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
//                   : 'bg-red-500 hover:bg-red-600 text-white'
//               }`}
//             >
//               {isLoading
//                 ? 'Processing...'
//                 : !currentAmount || parseFloat(currentAmount) <= 0
//                   ? 'Enter amount'
//                   : activeTab === 'buy'
//                     ? 'Buy Token'
//                     : 'Sell Token'}
//             </Button>
//           ) : (
//             <div className="w-full flex items-center justify-end">
//               <ConnectWalletButton className="w-full" />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GraduatedSwapSection;
