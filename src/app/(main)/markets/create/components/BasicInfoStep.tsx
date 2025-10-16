'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { IconArrowRight, IconReplace } from '@tabler/icons-react';
import Image from 'next/image';

import { useWallet } from '@solana/wallet-adapter-react';

export type BasicTokenForm = {
  name: string;
  ticker: string;
  image: File | null;
  website?: string;
  twitter?: string;
};

interface BasicInfoStepProps {
  form: UseFormReturn<BasicTokenForm>;
  onNext: () => void;
}

export function BasicInfoStep({ form, onNext }: BasicInfoStepProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isFullScreenDragOver, setIsFullScreenDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageValue = form.watch('image');
  const [isLoading, setIsLoading] = useState(false);
  const dragCounterRef = useRef(0);
  const { publicKey, connected, wallet } = useWallet();

  useEffect(() => {
    console.log('🔍 Wallet state changed:', {
      connected,
      publicKey: publicKey?.toString(),
      walletName: wallet?.adapter?.name,
    });
  }, [connected, publicKey, wallet]);

  useEffect(() => {
    const handleWindowDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current++;
      if (e.dataTransfer?.types.includes('Files')) {
        setIsFullScreenDragOver(true);
      }
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current--;
      if (dragCounterRef.current === 0) {
        setIsFullScreenDragOver(false);
      }
    };

    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current = 0;
      setIsFullScreenDragOver(false);
    };

    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);

  const generateTicker = (name: string) => {
    if (!name) return '';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 4).toUpperCase();
    } else {
      return words
        .slice(0, 4)
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();
    }
  };

  const handleNameChange = (value: string) => {
    form.setValue('name', value);
    if (!form.getValues('ticker')) {
      const generatedTicker = generateTicker(value);
      form.setValue('ticker', generatedTicker);
    }
    form.trigger('name');
  };

  const processImageFile = (file: File) => {
    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/svg+xml',
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (PNG, JPG, or SVG)');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }

    form.setValue('image', file);
    form.trigger('image');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleReplaceImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setIsFullScreenDragOver(false);
    dragCounterRef.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      processImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.formState.isValid) return;

    console.log('🔍 BasicInfoStep Wallet Debug:', {
      connected,
      publicKey: publicKey?.toString(),
      formValid: form.formState.isValid,
    });

    try {
      setIsLoading(true);
      const { image } = form.getValues();

      if (!image) {
        toast.error('Token image is required');
        return;
      }

      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/svg+xml',
      ];
      if (!allowedTypes.includes(image.type)) {
        toast.error('Please select a valid image file (PNG, JPG, or SVG)');
        return;
      }

      const maxSize = 2 * 1024 * 1024; // 2MB
      if (image.size > maxSize) {
        toast.error('File size must be less than 2MB');
        return;
      }

      if (!connected || !publicKey) {
        toast.error('Wallet not connected');
        return;
      }
      onNext();
    } catch (error) {
      console.error('Error preparing token:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to prepare token';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isFullScreenDragOver && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-6 p-12 rounded-4xl border-3 border-dashed border-primary bg-primary/10">
            <Upload className="size-14 text-primary" />
            <div className="text-center">
              <p className="text-3xl font-semibold text-white mb-2">
                Drop Image Here
              </p>
              <p className="text-lg text-gray-300">
                Release to upload your token image
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Wallet Connection Status */}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-between">
            <Label className="text-right font-medium">Token Name *</Label>
            <div className="md:col-span-2">
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    value={field.value}
                    id="tokenName"
                    placeholder="Enter token name"
                    maxLength={32}
                    className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                    onChange={e => handleNameChange(e.target.value)}
                  />
                )}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-between">
            <Label className="text-right font-medium">Token Ticker *</Label>
            <div className="md:col-span-2">
              <Controller
                name="ticker"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="tokenTicker"
                    placeholder="e.g. SOL"
                    className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                    maxLength={4}
                    onChange={e => {
                      field.onChange(e.target.value.toUpperCase());
                      form.trigger('ticker');
                    }}
                  />
                )}
              />
              {form.formState.errors.ticker && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.ticker.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start justify-between">
            <Label className="text-right font-medium pt-2">Token Image *</Label>
            <div className="md:col-span-2">
              <div className="space-y-4">
                {imageValue ? (
                  <div
                    className={`flex flex-col items-center space-y-4 p-6 rounded-lg transition-colors border-2 ${
                      isDragOver
                        ? 'border-dashed border-primary bg-primary/10'
                        : 'border-transparent'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="relative">
                      <Image
                        width={160}
                        height={160}
                        src={URL.createObjectURL(imageValue)}
                        alt="Token logo"
                        className="size-40 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                      />
                      <div className="absolute -top-2 -right-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full w-8 h-8 p-0 bg-background shadow-md text-black"
                          onClick={handleReplaceImage}
                          title="Replace image"
                        >
                          <IconReplace className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
                      isDragOver
                        ? 'border-primary bg-primary/10'
                        : 'border-muted-foreground/25 hover:border-primary/50'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-4">
                        <span className="mt-2 block text-sm font-medium">
                          {isDragOver
                            ? 'Drop image here'
                            : 'Upload token image'}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {isDragOver
                            ? 'Release to upload'
                            : 'PNG, JPG up to 10MB (Required) - Click or drag & drop'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  id="tokenImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              {form.formState.errors.image && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.image.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              disabled={!form.formState.isValid || isLoading}
              className="flex items-center cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="iconify ph--spinner w-5 h-5 animate-spin" />
                  <span>Preparing Token...</span>
                </>
              ) : (
                <>
                  <span>Continue to Review</span>
                  <IconArrowRight />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
