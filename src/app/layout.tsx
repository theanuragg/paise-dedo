import type { Metadata } from 'next';
import './globals.css';
import { Sora, Space_Grotesk } from 'next/font/google';
import { SolanaProvider } from '@/components/wallet/SolanaProvider';

import React from 'react';
import { Toaster } from 'sonner';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://onlyfounders.fun'),
  title:
    'OnlyFounders: Launch Your Token. Build Your Empire. Founder Capital Markets.',
  description:
    'OnlyFounders is the viral, low-friction launchpad for first-time founders & degen traders. Tokenize your startup or personal brand, raise capital, and create your mini-economy. Fast, fair, funded.',
  keywords:
    'degen launchpad, first-time founder crypto, permissionless token raise, personal brand token, founder capital markets, tokenize startup, viral launchpad, web3 fundraising, onchain liquidity, crypto capital raise, founder funding, blockchain launchpad, token launch platform, ICM, internet capital markets',
  authors: [{ name: 'OnlyFounders' }],
  creator: 'OnlyFounders',
  publisher: 'OnlyFounders',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://onlyfounders.fun',
    title:
      'OnlyFounders: Launch Your Token. Build Your Empire. Founder Capital Markets.',
    description:
      'OnlyFounders is the viral, low-friction launchpad for first-time founders & degen traders. Tokenize your startup or personal brand, raise capital, and create your mini-economy. Fast, fair, funded.',
    siteName: 'OnlyFounders',
    images: [
      {
        url: '/onlyfoundersdotfun cat-Photoroom.png',
        width: 1200,
        height: 630,
        alt: 'OnlyFounders logo - ICM launchpad for founders launching viral tokens',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'OnlyFounders: Launch Your Token. Build Your Empire. Founder Capital Markets.',
    description:
      'OnlyFounders is the viral, low-friction launchpad for first-time founders & degen traders. Tokenize your startup or personal brand, raise capital, and create your mini-economy. Fast, fair, funded.',
    images: ['/onlyfoundersdotfun cat-Photoroom.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'OnlyFounders',
              description:
                'OnlyFounders is the viral, low-friction launchpad for first-time founders & degen traders. Tokenize your startup or personal brand, raise capital, and create your mini-economy.',
              url: 'https://onlyfounders.fun',
              logo: 'https://icm-bucket.sfo3.digitaloceanspaces.com/tokens/myimage.png',
              sameAs: ['https://x.com/ofdotfun'],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                email: 'moe@foundershub.network',
              },
              offers: {
                '@type': 'Service',
                name: 'Token Launch Platform',
                description:
                  'Permissionless fundraising launchpad for visionary founders',
                provider: {
                  '@type': 'Organization',
                  name: 'OnlyFounders',
                },
              },
            }),
          }}
        />
      </head>
      <body
        className={`${sora.className} font-sora antialiased bg-[#0a0f12] min-h-screen text-white`}
      >
        <SolanaProvider>
          <div className="fixed inset-0 mix-blend-overlay pointer-events-none" />
          {children}
        </SolanaProvider>
        <Toaster
          position="bottom-left"
          theme="light"
          toastOptions={{
            style: {
              borderRadius: '24px',
              border: '0px',
            },
          }}
        />
      </body>
    </html>
  );
}

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};
