'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import Overview from '@/components/admin/Overview';

export default function AdminPage() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!publicKey) {
      router.push('/');
      return;
    }

    fetch('/api/is-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicKey: publicKey.toBase58() }),
    })
      .then(res => res.json())
      .then(data => {
        if (!data.isAdmin) {
          router.push('/');
        } else {
          setIsAdmin(true);
        }
      });
  }, [publicKey, router]);

  if (isAdmin !== true) return null;

  return (
    <AdminLayout>
      <Overview />
    </AdminLayout>
  );
}
