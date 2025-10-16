'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  Wallet,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DashboardStats } from '@/types/admin';
import { RoundedPieChart } from '@/components/ui/rounded-pie-chart';
import { ModernLineChart } from '@/components/ui/modern-line-chart';
import { IconCalendarFilled } from '@tabler/icons-react';
import { getAllCoins } from '@/utils/httpClient';

const overviewVolumeData = [
  { x: '2024-01-01', y: 18500 },
  { x: '2024-01-02', y: 22300 },
  { x: '2024-01-03', y: 19800 },
  { x: '2024-01-04', y: 25600 },
  { x: '2024-01-05', y: 31200 },
  { x: '2024-01-06', y: 28900 },
  { x: '2024-01-07', y: 34800 },
  { x: '2024-01-08', y: 32100 },
  { x: '2024-01-09', y: 38400 },
  { x: '2024-01-10', y: 41200 },
];

const tokenStatusData = [
  { label: 'Active', value: 1498, color: '#10b981' },
  { label: 'Graduated', value: 89, color: '#3b82f6' },
  { label: 'Migrated', value: 156, color: '#f59e0b' },
  { label: 'Paused', value: 91, color: '#ef4444' },
];

const mockStats: DashboardStats = {
  totalTokens: 1834,
  totalVolume: 289456.78,
  totalTvl: 156789.45,
  totalFeesCollected: 8934.92,
  totalClaimableFees: 2847.63,
  tokensByStatus: {
    active: 1498,
    paused: 91,
    migrated: 156,
    graduated: 89,
  },
  volumeTrends: {
    daily: [
      { date: '2024-01-01', volume: 45000, fees: 1200 },
      { date: '2024-01-02', volume: 52000, fees: 1380 },
    ],
    weekly: [],
    monthly: [],
  },
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

export default function AdminOverview() {
  const [timeRange, setTimeRange] = useState('7d');
  const [realStats, setRealStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const coins = await getAllCoins(1000, 1);

        // Calculate real stats from coin data
        const totalTokens = coins.length;
        const totalVolume = coins.reduce(
          (sum, coin) => sum + (coin.virtual_sol_reserves || 0),
          0
        );
        const totalTvl = coins.reduce(
          (sum, coin) => sum + (coin.virtual_sol_reserves || 0),
          0
        );
        const totalFeesCollected = totalVolume * 0.003; // Assuming 0.3% fee
        const totalClaimableFees = totalFeesCollected * 0.3; // Assuming 30% is claimable

        const tokensByStatus = {
          active: coins.filter(coin => !coin.complete).length,
          paused: 0, // Would need additional data
          migrated: 0, // Would need additional data
          graduated: coins.filter(coin => coin.complete).length,
        };

        const stats: DashboardStats = {
          totalTokens,
          totalVolume,
          totalTvl,
          totalFeesCollected,
          totalClaimableFees,
          tokensByStatus,
          volumeTrends: {
            daily: [], // Would need historical data
            weekly: [],
            monthly: [],
          },
        };

        setRealStats(stats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = realStats || mockStats;

  return (
    <div className="min-h-screen space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Platform Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor launchpad performance and metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <IconCalendarFilled className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark">
              <SelectItem value="1d">24h</SelectItem>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
              <SelectItem value="90d">90d</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Total Tokens
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {formatNumber(mockStats.totalTokens)}
              </div>
              <div className="flex items-center text-xs text-emerald-400 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12% from last month
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
              <CardTitle className="flex items-center justify-between">
                Total Volume
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {formatCurrency(mockStats.totalVolume)}
              </div>
              <div className="flex items-center text-xs text-emerald-400 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2% from last week
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
              <CardTitle className="flex items-center justify-between">
                Total TVL
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {formatCurrency(mockStats.totalTvl)}
              </div>
              <div className="flex items-center text-xs text-red-400 mt-1">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -2.1% from last week
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
              <CardTitle className="flex items-center justify-between">
                Claimable Fees
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white mb-4">
                {formatCurrency(mockStats.totalClaimableFees)}
              </div>
              <Button size="sm" variant="outline">
                Claim Now
              </Button>
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
            <CardTitle>Token Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <Badge variant="emerald">
                    {mockStats.tokensByStatus.active}
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{
                      width: `${(mockStats.tokensByStatus.active / mockStats.totalTokens) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Graduated
                  </span>
                  <Badge
                    variant="default"
                    className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                  >
                    {mockStats.tokensByStatus.graduated}
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${(mockStats.tokensByStatus.graduated / mockStats.totalTokens) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Migrated
                  </span>
                  <Badge
                    variant="default"
                    className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                  >
                    {mockStats.tokensByStatus.migrated}
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{
                      width: `${(mockStats.tokensByStatus.migrated / mockStats.totalTokens) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Paused</span>
                  <Badge
                    variant="default"
                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                  >
                    {mockStats.tokensByStatus.paused}
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${(mockStats.tokensByStatus.paused / mockStats.totalTokens) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ModernLineChart
            data={overviewVolumeData}
            title="Volume Trends"
            description="Daily trading volume over time"
            color="#06b6d4"
            showBadge={true}
            badgeText="Volume"
            badgePercentage="+15.3%"
            showGrid={true}
          />
        </div>

        <div>
          <RoundedPieChart
            data={tokenStatusData}
            title="Token Status Distribution"
            description="Current status of all tokens"
            showBadge={true}
            badgeText="Active"
            badgePercentage="81.7%"
          />
        </div>
      </div>
    </div>
  );
}
