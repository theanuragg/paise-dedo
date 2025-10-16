import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Create Project - OnlyFounders',
  description:
    'Create a new fundraising project on OnlyFounders. Set up your campaign, define goals, and start raising funds.',
  keywords: 'create project, fundraising campaign, token launch, OnlyFounders',
  openGraph: {
    title: 'Create Project - OnlyFounders',
    description:
      'Create a new fundraising project on OnlyFounders. Set up your campaign, define goals, and start raising funds.',
    type: 'website',
  },
};

export default function CreateProjectLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
