'use client';

import React from 'react';
import { Poppins, Jost } from 'next/font/google';
import './globals.css';

const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jost',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],

  variable: '--font-poppins',
  display: 'swap',
});

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`min-h-screen font-[jost] bg-black text-white dark ${poppins.variable} ${jost.variable}`}
    >
      {children}
    </div>
  );
}
