'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Pause,
  Play,
  ArrowUpDown,
  MoreHorizontal,
  ExternalLink,
  DollarSign,
  Activity,
  TrendingUp,
  Search,
  Download,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import type { Pool } from '@/types/admin';
import type { ColumnDef } from '@tanstack/react-table';

interface CellContext<T> {
  row: {
    getValue: (key: string) => T;
    original: Pool;
  };
}

interface PoolManagementProps {
  onPoolSelect?: (poolId: string) => void;
}

const mockPools: Pool[] = [
  {
    id: 'pool_1',
    name: 'MOON Token',
    symbol: 'MOON',
    token0: {
      address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      symbol: 'MOON',
      name: 'MOON Token',
      decimals: 9,
    },
    token1: {
      address: 'So11111111111111111111111111111111111111112',
      symbol: 'SOL',
      name: 'Solana',
      decimals: 9,
    },
    creator: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    totalValueLocked: 123456.78,
    volume24h: 234567.89,
    volume7d: 1640775.23,
    fees24h: 456.78,
    fees7d: 3199.46,
    feesTotal: 15673.21,
    feeRate: 0.003,
    status: 'active',
    chain: 'solana',
    participants: 1234,
    transactions24h: 567,
    createdAt: new Date('2024-01-15'),
    publicKey: 'pool_1_pubkey',
    decimals: 9,
    tvl: 123456.78,
    pendingClaimablePlatform: 234.56,
  },
  {
    id: 'pool_2',
    name: 'ROCKET Launch',
    symbol: 'ROCKET',
    token0: {
      address: '8yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsV',
      symbol: 'ROCKET',
      name: 'ROCKET Launch',
      decimals: 9,
    },
    token1: {
      address: 'So11111111111111111111111111111111111111112',
      symbol: 'SOL',
      name: 'Solana',
      decimals: 9,
    },
    creator: '8yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsV',
    totalValueLocked: 67890.12,
    volume24h: 89012.34,
    volume7d: 623086.38,
    fees24h: 234.56,
    fees7d: 1642.92,
    feesTotal: 7834.45,
    feeRate: 0.003,
    status: 'paused',
    chain: 'solana',
    participants: 567,
    transactions24h: 234,
    createdAt: new Date('2024-01-12'),
    publicKey: 'pool_2_pubkey',
    decimals: 9,
    tvl: 67890.12,
    pendingClaimablePlatform: 134.78,
  },
  {
    id: 'pool_3',
    name: 'DIAMOND Hands',
    symbol: 'DIAMOND',
    token0: {
      address: '9zKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsW',
      symbol: 'DIAMOND',
      name: 'DIAMOND Hands',
      decimals: 9,
    },
    token1: {
      address: 'So11111111111111111111111111111111111111112',
      symbol: 'SOL',
      name: 'Solana',
      decimals: 9,
    },
    creator: '9zKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsW',
    totalValueLocked: 345678.90,
    volume24h: 567890.12,
    volume7d: 3975230.84,
    fees24h: 1234.56,
    fees7d: 8642.92,
    feesTotal: 43567.89,
    feeRate: 0.003,
    status: 'graduated',
    chain: 'solana',
    participants: 2345,
    transactions24h: 891,
    createdAt: new Date('2024-01-08'),
    publicKey: 'pool_3_pubkey',
    decimals: 9,
    tvl: 345678.90,
    pendingClaimablePlatform: 678.90,
    migratedAt: new Date('2024-01-18'),
  },
];

const statusColors = {
  active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  paused: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  closed: 'bg-red-500/20 text-red-300 border-red-500/30',
  graduated: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  migrated: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
  }).format(value);
};

export default function PoolManagement({ onPoolSelect }: PoolManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleViewPool = (poolId: string) => {
    if (onPoolSelect) {
      onPoolSelect(poolId);
    }
  };

  const handlePausePool = (poolId: string) => {
    console.log('Pausing pool:', poolId);
  };

  const handleResumePool = (poolId: string) => {
    console.log('Resuming pool:', poolId);
  };

  const poolColumns: ColumnDef<Pool>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-gray-300 hover:text-cyan-400 hover:bg-gray-800"
        >
          Pool
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: CellContext<string>) => {
        const pool = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-300">
                {pool.symbol.slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="font-medium text-white">{pool.name}</p>
              <p className="text-xs text-gray-400">{pool.symbol}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: CellContext<Pool['status']>) => {
        const status = row.getValue('status');
        return (
          <Badge variant="outline" className={statusColors[status]}>
            {status === 'active' && <Play className="h-3 w-3 mr-1" />}
            {status === 'paused' && <Pause className="h-3 w-3 mr-1" />}
            {status === 'graduated' && <CheckCircle className="h-3 w-3 mr-1" />}
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'totalValueLocked',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-gray-300 hover:text-cyan-400 hover:bg-gray-800"
        >
          TVL
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: CellContext<number>) => {
        const tvl = row.getValue('totalValueLocked');
        return <span className="text-white font-medium">{formatCurrency(tvl)}</span>;
      },
    },
    {
      accessorKey: 'fees24h',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-gray-300 hover:text-cyan-400 hover:bg-gray-800"
        >
          24h Fees
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: CellContext<number>) => {
        const fees = row.getValue('fees24h');
        return <span className="text-white">{formatCurrency(fees)}</span>;
      },
    },
    {
      accessorKey: 'volume24h',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-gray-300 hover:text-cyan-400 hover:bg-gray-800"
        >
          24h Volume
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: CellContext<number>) => {
        const volume = row.getValue('volume24h');
        return <span className="text-white">{formatCurrency(volume)}</span>;
      },
    },
    {
      accessorKey: 'participants',
      header: 'Participants',
      cell: ({ row }: CellContext<number>) => {
        const participants = row.getValue('participants');
        return <span className="text-gray-300">{formatNumber(participants)}</span>;
      },
    },
    {
      accessorKey: 'transactions24h',
      header: 'Transactions',
      cell: ({ row }: CellContext<number>) => {
        const transactions = row.getValue('transactions24h');
        return <span className="text-gray-300">{formatNumber(transactions)}</span>;
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }: CellContext<string>) => {
        const pool = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => handleViewPool(pool.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {pool.status === 'active' ? (
                <DropdownMenuItem 
                  onClick={() => handlePausePool(pool.id)}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Pool
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={() => handleResumePool(pool.id)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume Pool
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredPools = mockPools.filter(pool => {
    const matchesSearch = pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pool.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pool.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Pool Management</h1>
          <p className="text-sm text-gray-400 mt-1">
            Monitor and manage all active pools
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                Total Pools
              </CardTitle>
              <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {mockPools.length}
              </div>
              <p className="text-xs text-gray-500">
                Across all statuses
              </p>
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
              <CardTitle>
                Total Volume
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {formatCurrency(mockPools.reduce((sum, pool) => sum + pool.volume24h, 0))}
              </div>
              <p className="text-xs text-gray-500">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="">
            <CardHeader>
              <CardTitle>
                Active Pools
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {mockPools.filter(p => p.status === 'active').length}
              </div>
              <p className="text-xs text-gray-500">
                Currently trading
              </p>
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
              <CardTitle>
                Total Fees
              </CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {formatCurrency(mockPools.reduce((sum, pool) => sum + pool.fees24h, 0))}
              </div>
              <p className="text-xs text-gray-500">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pools Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Pool Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <DataTable
                columns={poolColumns}
                data={filteredPools}
                searchKey="name"
                searchPlaceholder="Search pools..."
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
