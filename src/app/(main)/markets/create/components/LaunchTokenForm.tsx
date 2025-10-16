'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction } from '@solana/web3.js';
import axios from 'axios';
import { environment } from '@/lib/environment/solana';
import { BasicInfoStep, BasicTokenForm } from './BasicInfoStep';
import { ReviewStep, ReviewForm } from './ReviewStep';
import { TokenCreationSuccessDialog } from '@/components/TokenLaunches/TokenCreationSuccessDialog';

const basicTokenSchema = z.object({
  name: z
    .string()
    .min(1, 'Token name is required')
    .max(32, 'Token name must be 32 characters or less'),
  ticker: z
    .string()
    .min(1, 'Token ticker is required')
    .max(4, 'Token ticker must be 4 characters or less'),
  image: z.instanceof(File, { message: 'Token image is required' }).nullable(),
});

const reviewFormSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters'),
  twitter: z.string().optional(),
  website: z.string().optional(),
  telegram: z.string().optional(),
});

type StepType = 'basic' | 'review';

export default function LaunchTokenForm() {
  const [currentStep, setCurrentStep] = useState<StepType>('basic');
  const [isLaunching, setIsLaunching] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successTokenData, setSuccessTokenData] = useState<
    | {
        name: string;
        symbol: string;
        mintAddress?: string;
        poolAddress?: string;
      }
    | undefined
  >(undefined);

  const { publicKey, signTransaction, connected } = useWallet();

  const [connection] = useState(
    () => new Connection(environment.rpcUrl!, 'confirmed')
  );

  const basicForm = useForm<BasicTokenForm>({
    resolver: zodResolver(basicTokenSchema),
    defaultValues: {
      name: '',
      ticker: '',
      image: null,
    },
  });

  const reviewForm = useForm<ReviewForm>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      description: '',
      twitter: '',
      website: '',
      telegram: '',
    },
  });

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/svg+xml',
      ];
      if (!allowedTypes.includes(file.type)) {
        reject(
          new Error('Please select a valid image file (PNG, JPG, or SVG)')
        );
        return;
      }

      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        reject(new Error('File size must be less than 2MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleLaunch = async (socialDataString: string) => {
    try {
      if (!connected || !publicKey) {
        toast.error('Please connect your wallet first');
        return;
      }

      setIsLaunching(true);
      toast.loading('Creating token...', { duration: 2000 });

      const basicData = basicForm.getValues();
      const socialData = JSON.parse(socialDataString);

      console.log('basicData:', basicData);
      console.log('socialData:', socialData);

      const response = await axios.post('/api/launch', {
        tokenName: basicData.name,
        tokenTicker: basicData.ticker,
        tokenDescription: socialData.description,
        tokenImage: basicData.image
          ? await convertFileToBase64(basicData.image)
          : undefined,
        userWallet: publicKey.toString(),
        network: environment.network,
        twitter: socialData.twitter || '',
        website: socialData.website || '',
        telegram: socialData.telegram || '',
      });

      if (response.status !== 200) {
        toast.error(response.data.error || 'Error creating token');
        return;
      }

      const {
        poolTx,
        tokenMint,
        poolAddress: responsePoolAddress,
      } = response.data;

      const transaction = Transaction.from(Buffer.from(poolTx, 'base64'));

      toast.info('Please approve the transaction in your wallet', {
        description:
          'You will be prompted to sign the transaction for creating the DBC pool',
        duration: 5000,
      });

      if (!signTransaction) {
        toast.error('Wallet does not support transaction signing');
        return;
      }

      const signedTransaction = await signTransaction(transaction);
      const signedBase64 = signedTransaction
        .serialize({ requireAllSignatures: false, verifySignatures: false })
        .toString('base64');

      const finalResponse = await axios.post('/api/sendtxn', {
        signedTransaction: signedBase64,
        mint: tokenMint,
        userWallet: publicKey.toString(),
      });

      if (finalResponse.status !== 200) {
        toast.error(finalResponse.data.error || 'Transaction broadcast failed');
        return;
      }

      const { signature, poolAddress } = finalResponse.data;

      toast.success('Transaction confirmed', { duration: 5000 });
      toast.success('Woohu! Token created successfully');

      setSuccessTokenData({
        name: basicData.name,
        symbol: basicData.ticker,
        mintAddress: tokenMint,
        poolAddress: poolAddress,
      });

      basicForm.reset();
      reviewForm.reset();
      setCurrentStep('basic');
      setShowSuccessDialog(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          (error instanceof Error ? error.message : 'Unknown error')
      );
    } finally {
      toast.dismiss();
      setIsLaunching(false);
    }
  };

  const handleNextToReview = () => {
    setCurrentStep('review');
  };

  const handleBackToBasic = () => {
    setCurrentStep('basic');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div
          className={`flex items-center space-x-2 ${currentStep === 'basic' ? 'text-[#00ffff]' : 'text-muted-foreground'}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'basic' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
          >
            1
          </div>
          <span>Basic Info</span>
        </div>

        <div className="w-16 h-0.5 bg-muted"></div>

        <div
          className={`flex items-center space-x-2 ${currentStep === 'review' ? 'text-[#00ffff]' : 'text-muted-foreground'}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'review' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
          >
            2
          </div>
          <span>Review</span>
        </div>
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {currentStep === 'basic' && (
          <BasicInfoStep form={basicForm} onNext={handleNextToReview} />
        )}

        {currentStep === 'review' && (
          <ReviewStep
            basicForm={basicForm}
            reviewForm={reviewForm}
            onBack={handleBackToBasic}
            onLaunch={handleLaunch}
            onCustomize={handleBackToBasic}
            isLaunching={isLaunching}
            walletConnected={connected}
          />
        )}
      </motion.div>

      <TokenCreationSuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        tokenData={successTokenData}
      />
    </div>
  );
}