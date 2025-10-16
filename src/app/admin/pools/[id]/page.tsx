'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import PoolDetail from '@/components/admin/PoolDetail';

export default function PoolDetailPage() {
  const router = useRouter();
  const params = useParams();
  const poolId = params?.id as string;

  const handleBack = () => {
    router.push('/admin/pools');
  };

  if (!poolId) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Pool not found</h2>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PoolDetail poolId={poolId} onBack={handleBack} />
    </AdminLayout>
  );
}
