// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import { useWallet, useConnection } from '@solana/wallet-adapter-react';
// import { useParams } from 'next/navigation';
// import ConnectWalletButton from '@/components/wallet/ConnectWalletButton';
// import { LAMPORTS_PER_SOL, VersionedTransaction } from '@solana/web3.js';
// import axios from 'axios';
// import { toast } from 'sonner';

// interface Token {
//   address: string;
//   symbol: string;
//   name: string;
//   icon: React.ReactNode;
//   decimals: number;
// }

// const TOKENS: Token[] = [
//   {
//     address: 'So11111111111111111111111111111111111111112',
//     symbol: 'SOL',
//     name: 'Solana',
//     icon: (
//       <Image
//         src="/solana.png"
//         alt="SOL"
//         width={20}
//         height={20}
//         className="rounded-full"
//       />
//     ),
//     decimals: 9,
//   },
//   {
//     address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
//     symbol: 'USDC',
//     name: 'USDC',
//     icon: (
//       <Image
//         src="/usdc.svg"
//         alt="USDC"
//         width={20}
//         height={20}
//         className="rounded-full"
//       />
//     ),
//     decimals: 6,
//   },
// ];

// export interface QuoteResponse {
//   inputMint: string;
//   inAmount: number;
//   outputMint: string;
//   outAmount: number;
//   otherAmountThreshold: number;
//   swapMode: string;
//   slippageBps: number;
//   platformFee: null | any;
//   priceImpactPct: number;
//   routePlan: [
//     {
//       swapInfo: {
//         ammKey: string;
//         label: string;
//         inputMint: string;
//         outputMint: string;
//         inAmount: number;
//         outAmount: number;
//         feeAmount: number;
//         feeMint: string;
//       };
//       percent: number;
//     },
//   ];
//   contextSlot: number;
//   timeTaken: number;
// }

// export interface SwapResponse {
//   swapTransaction: string;
//   lastValidBlockHeight: number;
//   prioritizationFeeLamports: number;
//   computeUnitLimit: number;
//   prioritizationType: {
//     computeBudget: {
//       microLamports: number;
//       estimatedMicroLamports: number;
//     };
//   };
//   dynamicSlippageReport: {
//     slippageBps: number;
//     otherAmount: number;
//     simulatedIncurredSlippageBps: number;
//     amplificationRatio: string;
//     categoryName: string;
//     heuristicMaxSlippageBps: number;
//   };
//   simulationError: null;
// }

// interface BuySellProps {
//   tokenMint?: string;
//   tokenTicker?: string;
//   tokenBalance?: number;
//   solBalance?: number;
//   tokenName?: string;
//   tokenImage?: string;
// }

// export function BuySell({
//   tokenMint,
//   tokenTicker,
//   solBalance,
//   tokenBalance,
//   tokenImage,
//   tokenName,
// }: BuySellProps) {
//   const params = useParams();
//   const mint = tokenMint || (params?.slug as string);

//   const JUP_QUOTE_URL = 'https://lite-api.jup.ag/swap/v1/quote';
//   const JUP_SWAP_URL = 'https://lite-api.jup.ag/swap/v1/swap';

//   const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
//   const [fromAmount, setFromAmount] = React.useState('');
//   const [toAmount, setToAmount] = React.useState('');
//   const [fromToken, setFromToken] = React.useState(TOKENS[0]);
//   const [toToken, setToToken] = React.useState(TOKENS[1]);
//   const [quoteResponse, setQuoteResponse] =
//     React.useState<QuoteResponse | null>(null);
//   const [swapResponse, setSwapResponse] = React.useState<SwapResponse | null>(
//     null
//   );
//   const [isLoading, setIsLoading] = React.useState(false);

//   const [balance, setBalance] = useState<number>(0);

//   const wallet = useWallet();
//   const { connection } = useConnection();
//   const { connected, publicKey } = useWallet();
//   const isWalletConnected = connected;

//   const currentToken: Token = {
//     address: mint || '',
//     symbol: tokenTicker || 'TOKEN',
//     name: tokenName || tokenTicker || 'Token',
//     icon: tokenImage ? (
//       <Image
//         src={tokenImage}
//         alt={tokenTicker || 'Token'}
//         width={20}
//         height={20}
//         className="rounded-full"
//       />
//     ) : (
//       <div className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
//     ),
//     decimals: 6,
//   };

//   useEffect(() => {
//     if (!mint) return;

//     if (activeTab === 'buy') {
//       setFromToken(TOKENS[0]);
//       setToToken(currentToken);
//     } else {
//       setFromToken(currentToken);
//       setToToken(TOKENS[0]);
//     }
//     setFromAmount('');
//     setToAmount('');
//   }, [activeTab, mint, currentToken]);

//   React.useEffect(() => {
//     if (!fromAmount || isNaN(Number(fromAmount)) || Number(fromAmount) <= 0) {
//       setToAmount('');
//       setQuoteResponse(null);
//       return;
//     }

//     const timeoutId = setTimeout(async () => {
//       await handleQuote();
//     }, 500);

//     return () => clearTimeout(timeoutId);
//   }, [fromAmount, fromToken.address, toToken.address, currentToken.address, handleQuote]);

//   const handleQuote = async () => {
//     if (fromToken.address === toToken.address) {
//       setToAmount('');
//       setQuoteResponse(null);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const fromTokenDecimals = Math.pow(10, fromToken.decimals);
//       const toTokenDecimals = Math.pow(10, toToken.decimals);

//       const quoteRes = await axios.get(
//         `${JUP_QUOTE_URL}?inputMint=${fromToken.address}&outputMint=${
//           toToken.address
//         }&amount=${
//           Number(fromAmount) * fromTokenDecimals
//         }&slippageBps=50&onlyDirectRoutes=true`
//       );
//       const data = quoteRes.data;
//       setQuoteResponse(data);
//       setToAmount((data.outAmount / toTokenDecimals).toFixed(6));
//     } catch (error: any) {
//       setToAmount('');
//       setQuoteResponse(null);
//       console.error('Error fetching quote:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSwap = async () => {
//     try {
//       if (!quoteResponse) {
//         toast.error('No quote available');
//         return;
//       }

//       setIsLoading(true);
//       const swapResponse = await axios.post(JUP_SWAP_URL, {
//         quoteResponse,
//         userPublicKey: wallet.publicKey?.toBase58(),
//         dynamicComputeUnitLimit: true,
//         dynamicSlippage: true,
//       });

//       const data = swapResponse.data;
//       toast.success('Swap transaction created successfully');
//       setSwapResponse(data);

//       if (data && data.swapTransaction) {
//         const transactionBase64 = data.swapTransaction;
//         const transaction = VersionedTransaction.deserialize(
//           Buffer.from(transactionBase64, 'base64')
//         );

//         if (wallet.signTransaction) {
//           const latestBlockhash = await connection.getLatestBlockhash();
//           const signedTx = await wallet.signTransaction(transaction);
//           const txid = await wallet.sendTransaction(signedTx, connection, {
//             maxRetries: 2,
//           });
//           const { value } = await connection.confirmTransaction(
//             {
//               signature: txid,
//               blockhash: latestBlockhash.blockhash,
//               lastValidBlockHeight: data.lastValidBlockHeight,
//             },
//             'confirmed'
//           );

//           console.log('Transaction confirmation:', value);
//           toast.success(`Swap transaction sent: ${txid}`);
//         } else {
//           toast.error('Wallet does not support transaction signing');
//         }
//       }
//     } catch (error: any) {
//       const message =
//         error?.response?.data?.error || error.message || 'Unknown error';
//       toast.error(`Failed to create swap transaction: ${message}`);
//       console.error('Error creating swap transaction:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleTabChange = (tab: 'buy' | 'sell') => {
//     setActiveTab(tab);
//   };

//   useEffect(() => {
//     if (!wallet.connected || wallet.connecting) {
//       setFromAmount('');
//       setToAmount('');
//       setQuoteResponse(null);
//     }
//   }, [wallet.connected, wallet.connecting]);

//   const handleFromTokenClick = () => {
//     if (activeTab === 'buy') {
//       const currentIndex = TOKENS.findIndex(
//         t => t.address === fromToken.address
//       );
//       const nextIndex = (currentIndex + 1) % TOKENS.length;
//       setFromToken(TOKENS[nextIndex]);
//       setToAmount('');
//       setQuoteResponse(null);
//     }
//   };



//   if (!mint || !tokenName) {
//     return (
//       <div className="w-full max-w-md mx-auto">
//         <div className="bg-[#1a1f2e] border border-[#2a3441] rounded-2xl p-6 text-center">
//           <div className="text-slate-400 text-sm">
//             Token information not available
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <div className="bg-[#1a1f2e] border border-[#2a3441] rounded-[28px] p-3 space-y-4">
//         <div className="flex bg-[#2a3441] rounded-[20px] p-1">
//           <button
//             onClick={() => handleTabChange('buy')}
//             className={`flex-1 py-4 px-4 rounded-2xl font-medium transition-all ${
//               activeTab === 'buy'
//                 ? 'bg-cyan-400 text-white'
//                 : 'text-slate-400 hover:text-white'
//             }`}
//           >
//             Buy
//           </button>
//           <button
//             onClick={() => handleTabChange('sell')}
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
//                 value={fromAmount}
//                 onChange={e => setFromAmount(e.target.value)}
//                 className="bg-transparent text-left text-xl font-medium text-white placeholder-slate-500 border-none outline-none flex-1"
//               />
//               <div
//                 onClick={activeTab === 'buy' ? handleFromTokenClick : undefined}
//                 className={`absolute -right-2.5 flex items-center gap-2 bg-[#1a1f2e] rounded-[14px] px-3 py-3 transition-colors ${
//                   activeTab === 'buy'
//                     ? 'cursor-pointer hover:bg-[#252a3a]'
//                     : 'cursor-default'
//                 }`}
//               >
//                 {activeTab === 'buy' ? fromToken.icon : currentToken.icon}
//                 <span className="text-white font-medium">
//                   {activeTab === 'buy' ? fromToken.symbol : currentToken.symbol}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-1 font-mono">
//           <button
//             onClick={() => setFromAmount('')}
//             className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//           >
//             Reset
//           </button>
//           {activeTab === 'buy' ? (
//             <>
//               <button
//                 onClick={() => setFromAmount('0.1')}
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 0.1
//               </button>
//               <button
//                 onClick={() => setFromAmount('0.5')}
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 0.5
//               </button>
//               <button
//                 onClick={() => setFromAmount('1')}
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 1
//               </button>
//               <button
//                 onClick={async () =>
//                   setFromAmount(
//                     (
//                       (await connection.getBalance(publicKey!)) /
//                         LAMPORTS_PER_SOL -
//                       0.000105
//                     ).toString()
//                   )
//                 }
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 MAX
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 onClick={() =>
//                   setFromAmount(((tokenBalance || 0) * 0.25).toString())
//                 }
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 25%
//               </button>
//               <button
//                 onClick={() =>
//                   setFromAmount(((tokenBalance || 0) * 0.5).toString())
//                 }
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 50%
//               </button>
//               <button
//                 onClick={() =>
//                   setFromAmount(((tokenBalance || 0) * 0.75).toString())
//                 }
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 75%
//               </button>
//               <button
//                 onClick={() => setFromAmount((tokenBalance || 0).toString())}
//                 className="px-3 py-1 bg-[#2a3441] text-slate-300 text-xs rounded-lg border border-slate-700 hover:bg-[#3a4451] transition-colors"
//               >
//                 100%
//               </button>
//             </>
//           )}
//         </div>

//         {quoteResponse && fromAmount && parseFloat(fromAmount) > 0 && (
//           <div className="bg-[#2a3441] rounded-xl p-4 space-y-3">
//             <div className="flex justify-between items-center text-sm">
//               <span className="text-slate-400">You will receive:</span>
//               <div className="text-right">
//                 <div className="text-white font-medium">
//                   {(
//                     quoteResponse.outAmount /
//                     Math.pow(
//                       10,
//                       activeTab === 'buy'
//                         ? currentToken.decimals
//                         : toToken.decimals
//                     )
//                   ).toFixed(6)}
//                 </div>
//                 <div className="text-xs text-slate-400">
//                   {activeTab === 'buy' ? currentToken.symbol : toToken.symbol}
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-between items-center text-sm">
//               <span className="text-slate-400">Slippage Tolerance:</span>
//               <span className="text-white font-medium">
//                 {(quoteResponse.slippageBps / 100).toFixed(2)}%
//               </span>
//             </div>
//           </div>
//         )}

//         <div className="pt-2">
//           {isWalletConnected ? (
//             <Button
//               onClick={handleSwap}
//               disabled={
//                 !quoteResponse ||
//                 isLoading ||
//                 !wallet.connected ||
//                 !fromAmount ||
//                 fromAmount === '0' ||
//                 fromToken.address === toToken.address
//               }
//               className={`w-full py-6 text-base font-medium rounded-xl transition-all duration-200 ${
//                 activeTab === 'buy'
//                   ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
//                   : 'bg-red-500 hover:bg-red-600 text-white'
//               }`}
//             >
//               {isLoading
//                 ? 'Processing...'
//                 : !fromAmount || fromAmount === '0'
//                   ? 'Enter amount'
//                   : fromToken.address === toToken.address
//                     ? 'Same tokens selected'
//                   : !quoteResponse
//                     ? 'Getting quote...'
//                     : activeTab === 'buy'
//                       ? 'Buy Token'
//                       : 'Sell Token'}
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

// export default BuySell;
