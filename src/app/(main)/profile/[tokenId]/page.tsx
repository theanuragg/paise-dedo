import React from 'react';
import TokenOnboardPage from './components/TokenOnboardPage';

export default async function Page({
  params,
}: {
  params: Promise<{ tokenId: string }>;
}) {
  const { tokenId } = await params;
  return <TokenOnboardPage tokenId={tokenId} />;
}
