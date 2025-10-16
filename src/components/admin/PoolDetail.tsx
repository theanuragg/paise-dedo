'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Activity,
  DollarSign,
  TrendingUp,
  Settings,
  Pause,
  Play,
  ExternalLink,
  Copy,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import type { Pool, Transaction } from '@/types/admin';

interface CellContext<T> {
  row: {
    getValue: (key: string) => T;
  };
}

const mockPool: Pool = {
  id: 'pool_1',
  name: 'SOLANA/USDC',
  token0: {
    address: '0x123...abc',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
  },
  token1: {
    address: '0x456...def',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
  },
  creator: '0x789...ghi',
  totalValueLocked: 2847293,
  volume24h: 156789,
  volume7d: 987654,
  fees24h: 3156,
  fees7d: 19876,
  feesTotal: 45782,
  feeRate: 0.003,
  createdAt: new Date('2024-01-15'),
  status: 'active',
  chain: 'solana',
  participants: 1247,
  transactions24h: 456,
  publicKey: 'pool_public_key_1',
  symbol: 'SOL-USDC',
  tvl: 2847293,
  pendingClaimablePlatform: 945,
};

const mockTransactions: Transaction[] = [
  {
    id: 'tx_1',
    poolId: 'pool_1',
    type: 'swap',
    user: '0xabc...123',
    amount0: 1000,
    amount1: 2300,
    fee: 6.9,
    timestamp: new Date('2024-01-20T10:30:00'),
    txHash: '0xdef456...',
  },
  {
    id: 'tx_2',
    poolId: 'pool_1',
    type: 'add_liquidity',
    user: '0xdef...456',
    amount0: 5000,
    amount1: 11500,
    fee: 0,
    timestamp: new Date('2024-01-20T10:25:00'),
    txHash: '0xabc123...',
  },
  {
    id: 'tx_3',
    poolId: 'pool_1',
    type: 'remove_liquidity',
    user: '0xghi...789',
    amount0: 2000,
    amount1: 4600,
    fee: 0,
    timestamp: new Date('2024-01-20T10:20:00'),
    txHash: '0x789def...',
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
  }).format(value);
};

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const getStatusColor = (status: Pool['status']) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'paused':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'closed':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    default:
      return 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20';
  }
};

const getTransactionTypeColor = (type: Transaction['type']) => {
  switch (type) {
    case 'swap':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'add_liquidity':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'remove_liquidity':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    default:
      return 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20';
  }
};

interface PoolDetailProps {
  poolId: string;
  onBack: () => void;
}

export default function PoolDetail({ onBack }: PoolDetailProps) {
  const [timeRange, setTimeRange] = useState('24h');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
    }, 1000);
  };

  const handleClaimFees = async () => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const transactionColumns = [
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }: CellContext<Transaction['type']>) => (
        <Badge variant="outline" className={getTransactionTypeColor(row.getValue('type'))}>
          {row.getValue('type').replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }: CellContext<string>) => (
        <div className="flex items-center gap-2">
          <code className="text-xs text-white">{formatAddress(row.getValue('user'))}</code>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => copyToClipboard(row.getValue('user'))}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: 'amount0',
      header: 'Amount 0',
      cell: ({ row }: CellContext<number>) => (
        <span className="font-mono text-sm text-white">
          {formatNumber(row.getValue('amount0'))} {mockPool.token0.symbol}
        </span>
      ),
    },
    {
      accessorKey: 'amount1',
      header: 'Amount 1',
      cell: ({ row }: CellContext<number>) => (
        <span className="font-mono text-sm text-white">
          {formatNumber(row.getValue('amount1'))} {mockPool.token1.symbol}
        </span>
      ),
    },
    {
      accessorKey: 'fee',
      header: 'Fee',
      cell: ({ row }: CellContext<number>) => (
        <span className="font-mono text-sm text-emerald-500">
          {row.getValue('fee') > 0 ? `$${row.getValue('fee')}` : '—'}
        </span>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Time',
      cell: ({ row }: CellContext<Date>) => {
        const date = row.getValue('timestamp');
        return (
          <span className="text-sm text-gray-400">
            {date.toLocaleTimeString()}
          </span>
        );
      },
    },
    {
      accessorKey: 'txHash',
      header: 'Transaction',
      cell: ({ row }: CellContext<string>) => (
        <div className="flex items-center gap-2">
          <code className="text-xs text-white">{formatAddress(row.getValue('txHash'))}</code>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => window.open(`https://explorer.solana.com/tx/${row.getValue('txHash')}`, '_blank')}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div className="flex items-center gap-4">
          <Button variant="outline" size="default" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-white">{mockPool.name}</h1>
              <Badge variant="outline" className={getStatusColor(mockPool.status)}>
                {mockPool.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                {mockPool.status === 'paused' && <AlertCircle className="h-3 w-3 mr-1" />}
                {mockPool.status}
              </Badge>
              <Badge variant="secondary" className="capitalize bg-gray-600 text-white">
                {mockPool.chain}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Pool ID: {mockPool.id} • Created {mockPool.createdAt.toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" disabled={isUpdating}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleStatusToggle} >
                {mockPool.status === 'active' ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Pool
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Activate Pool
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleClaimFees} >
                <DollarSign className="h-4 w-4 mr-2" />
                Claim Fees
              </DropdownMenuItem>
              <DropdownMenuItem >
                <Settings className="h-4 w-4 mr-2" />
                Pool Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Value Locked
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {formatCurrency(mockPool.totalValueLocked)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {formatNumber(mockPool.participants)} participants
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-300">
                Volume ({timeRange})
              </CardTitle>
              <Activity className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {timeRange === '24h' 
                  ? formatCurrency(mockPool.volume24h)
                  : formatCurrency(mockPool.volume7d)
                }
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {formatNumber(mockPool.transactions24h)} transactions today
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
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-300">
                Fees ({timeRange})
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {timeRange === '24h' 
                  ? formatCurrency(mockPool.fees24h)
                  : formatCurrency(mockPool.fees7d)
                }
              </div>
              <div className="text-xs text-emerald-500 mt-1">
                {(mockPool.feeRate * 100).toFixed(2)}% fee rate
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
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Fees Earned
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {formatCurrency(mockPool.feesTotal)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Since {mockPool.createdAt.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pool Details - Individual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Token 0 Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium text-white">
                Token 0 ({mockPool.token0.symbol})
              </CardTitle>
              <CardDescription className="text-gray-400">
                {mockPool.token0.name} token details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-300 mb-2">Token Name</p>
                  <p className="font-medium text-white">{mockPool.token0.name}</p>
                </div>
                <div>
                  <p className="text-sm mb-2">Contract Address</p>
                  <div className="flex items-center gap-2">
                    <code >
                      {mockPool.token0.address}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-600"
                      onClick={() => copyToClipboard(mockPool.token0.address)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-2">Decimals</p>
                  <p className="font-medium text-white">{mockPool.token0.decimals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Token 1 Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium text-white">
                Token 1 ({mockPool.token1.symbol})
              </CardTitle>
              <CardDescription className="text-gray-400">
                {mockPool.token1.name} token details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-300 mb-2">Token Name</p>
                  <p className="font-medium text-white">{mockPool.token1.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-2">Contract Address</p>
                  <div className="flex items-center gap-2">
                    <code>
                      {mockPool.token1.address}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-600"
                      onClick={() => copyToClipboard(mockPool.token1.address)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-2">Decimals</p>
                  <p className="font-medium text-white">{mockPool.token1.decimals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Creator Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium text-white">
                Pool Creator
              </CardTitle>
              <CardDescription className="text-gray-400">
                Address of the pool creator
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-300 mb-2">Creator Address</p>
                  <div className="flex items-center gap-2">
                    <code>
                      {mockPool.creator}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-600"
                      onClick={() => copyToClipboard(mockPool.creator)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-2">Created Date</p>
                  <p className="font-medium text-white">{mockPool.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fee Configuration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium text-white">
                Fee Configuration
              </CardTitle>
              <CardDescription className="text-gray-400">
                Pool fee structure and distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-sm text-gray-300">Pool Fee Rate</span>
                  <span className="font-semibold text-base text-white">
                    {(mockPool.feeRate * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-sm text-gray-300">Platform Share</span>
                  <span className="font-semibold text-base text-white">30%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-300">Creator Share</span>
                  <span className="font-semibold text-base text-white">70%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-medium text-white">Recent Transactions</CardTitle>
              <CardDescription className="text-gray-400">Latest activity in this pool</CardDescription>
            </div>
            <Button size="default">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={transactionColumns}
              data={mockTransactions}
              searchKey="user"
              searchPlaceholder="Search by user address..."
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
