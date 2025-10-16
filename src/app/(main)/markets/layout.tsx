import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Projects - OnlyFounders',
  description:
    'Discover and invest in innovative blockchain projects. Browse through curated fundraising campaigns and find your next investment opportunity.',
  keywords:
    'projects, fundraising, investments, blockchain, crypto, OnlyFounders',
  openGraph: {
    title: 'Projects - OnlyFounders',
    description:
      'Discover and invest in innovative blockchain projects. Browse through curated fundraising campaigns and find your next investment opportunity.',
    type: 'website',
  },
};

export default function ProjectsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
