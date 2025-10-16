'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconClock,
  IconTrendingUp,
  IconAlertCircle,
  IconCheck,
  IconDownload,
  IconCalendar,
  IconArrowsUpDown,
  IconExternalLink,
  IconSettings,
  IconCalendarFilled,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { DataTable } from '@/components/ui/data-table';
import type { Claim } from '@/types/admin';
import type { ColumnDef } from '@tanstack/react-table';

const mockClaims: Claim[] = [
  {
    id: '1',
    poolId: 'pool_1',
    poolName: 'SOLANA/USDC',
    amount: 1250.75,
    claimedBy: '9pQqweRT4L...8jH2k',
    claimedAt: new Date('2024-01-20T10:30:00'),
    transactionId: 'tx_abc123...def456',
    type: 'platform',
    status: 'completed',
  },
  {
    id: '2',
    poolId: 'pool_1',
    poolName: 'SOLANA/USDC',
    amount: 2100.5,
    claimedBy: '7xKXtg2CW9...3mF8s',
    claimedAt: new Date('2024-01-19T15:45:00'),
    transactionId: 'tx_ghi789...jkl012',
    type: 'creator',
    status: 'completed',
  },
  {
    id: '3',
    poolId: 'pool_2',
    poolName: 'ETHEREUM/USDT',
    amount: 890.25,
    claimedBy: '9pQqweRT4L...8jH2k',
    claimedAt: new Date('2024-01-18T09:15:00'),
    transactionId: 'tx_mno345...pqr678',
    type: 'platform',
    status: 'pending',
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export default function FeeManagement() {
  const [autoClaimEnabled, setAutoClaimEnabled] = useState(true);
  const [autoClaimThreshold, setAutoClaimThreshold] = useState('1000');
  const [notificationEmail, setNotificationEmail] =
    useState('admin@example.com');
  const [timeRange, setTimeRange] = useState('7d');

  const totalPendingClaims = mockClaims
    .filter(claim => claim.status === 'pending' && claim.type === 'platform')
    .reduce((sum, claim) => sum + claim.amount, 0);

  const totalClaimedThisMonth = mockClaims
    .filter(
      claim =>
        claim.status === 'completed' &&
        claim.type === 'platform' &&
        claim.claimedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    )
    .reduce((sum, claim) => sum + claim.amount, 0);

  const columns: ColumnDef<Claim>[] = [
    {
      accessorKey: 'poolName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3 text-gray-300 hover:text-cyan-400 hover:bg-gray-800"
          >
            Pool
            <IconArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-medium text-foreground">
            {row.original.poolName}
          </div>
          <div className="text-xs text-muted-foreground">
            {row.original.poolId}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <Badge
            className={
              type === 'platform'
                ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
                : 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20'
            }
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3 text-gray-300 hover:text-cyan-400 hover:bg-gray-800"
          >
            Amount
            <IconArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {formatCurrency(row.original.amount)}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            className={
              status === 'completed'
                ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                : status === 'pending'
                  ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                  : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
            }
          >
            {status === 'completed' && <IconCheck className="h-3 w-3 mr-1" />}
            {status === 'pending' && <IconClock className="h-3 w-3 mr-1" />}
            {status === 'failed' && (
              <IconAlertCircle className="h-3 w-3 mr-1" />
            )}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'claimedAt',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3 text-gray-300 hover:text-cyan-400 hover:bg-gray-800"
          >
            Date
            <IconArrowsUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {formatDate(row.original.claimedAt)}
        </div>
      ),
    },
    {
      accessorKey: 'claimedBy',
      header: 'Claimed By',
      cell: ({ row }) => (
        <div className="font-mono text-xs text-muted-foreground">
          {formatAddress(row.original.claimedBy)}
        </div>
      ),
    },
    {
      accessorKey: 'transactionId',
      header: 'Transaction',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-gray-300 hover:text-cyan-400 hover:bg-gray-800"
        >
          <IconExternalLink className="h-3 w-3 mr-1" />
          {formatAddress(row.original.transactionId)}
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen - space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Fee Management</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage platform fee claims and settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <IconCalendarFilled className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='dark'>
              <SelectItem value="1d">24h</SelectItem>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
              <SelectItem value="90d">90d</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">
            <IconDownload className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm text-gray-400">Pending Claims</p>
                  <p className="text-xl font-semibold text-white">
                    {formatCurrency(totalPendingClaims)}
                  </p>
                </div>
                <IconClock className="h-8 w-8 text-amber-500" />
              </div>
              {totalPendingClaims > 0 && (
                <Button size="sm" variant="outline">
                  Claim Now
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatCurrency(totalClaimedThisMonth)}
                  </p>
                </div>
                <IconTrendingUp className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Claims</p>
                  <p className="text-xl font-semibold text-foreground">
                    {mockClaims.filter(c => c.status === 'completed').length}
                  </p>
                </div>
                <IconCheck className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Auto-Claim</p>
                  <p className="text-sm font-medium text-foreground">
                    {autoClaimEnabled ? 'Active' : 'Inactive'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Threshold: ${autoClaimThreshold}
                  </p>
                </div>
                <IconSettings className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-foreground flex items-center">
              <IconSettings className="h-4 w-4 mr-2" />
              Claim IconSettings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Auto-Claim</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically claim fees when threshold is reached
                    </p>
                  </div>
                  <Switch
                    checked={autoClaimEnabled}
                    onCheckedChange={setAutoClaimEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threshold" className="text-sm font-medium">
                    Auto-Claim Threshold (USD)
                  </Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={autoClaimThreshold}
                    onChange={e => setAutoClaimThreshold(e.target.value)}
                    disabled={!autoClaimEnabled}
                    placeholder="1000"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Email Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified when claims exceed threshold
                    </p>
                  </div>
                  <Switch checked={true} onCheckedChange={() => {}} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Notification Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={notificationEmail}
                    onChange={e => setNotificationEmail(e.target.value)}
                    placeholder="admin@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline">Save IconSettings</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-foreground">
              Claims History ({mockClaims.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={mockClaims}
              searchKey="poolName"
              searchPlaceholder="Search claims..."
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
