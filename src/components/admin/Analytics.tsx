'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IconTrendingUp,
  IconUsers,
  IconActivity,
  IconCurrencyDollar,
  IconCalendar,
  IconDownload,
  IconArrowUpRight,
} from '@tabler/icons-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Analytics as AnalyticsType } from '@/types/admin';
import { RoundedPieChart } from '@/components/ui/rounded-pie-chart';
import { ModernLineChart } from '@/components/ui/modern-line-chart';

const mockAnalytics: AnalyticsType = {
  feeShareRatio: {
    creator: 50.0,
    onlyFoundersTreasury: 30.0,
    communityTreasury: 20.0,
  },
  userEngagement: {
    activeCreators: 247,
    claimingCreators: 189,
    avgClaimFrequency: 2.3,
  },
  chainMetrics: {
    solana: {
      tokens: 1834,
      volume: 8934,
      fees: 178923,
      gasCosts: 2345,
    },
  },
};

const volumeTrendData = [
  { x: '2024-01-01', y: 1200000 },
  { x: '2024-01-02', y: 1350000 },
  { x: '2024-01-03', y: 1180000 },
  { x: '2024-01-04', y: 1420000 },
  { x: '2024-01-05', y: 1680000 },
  { x: '2024-01-06', y: 1540000 },
  { x: '2024-01-07', y: 1890000 },
  { x: '2024-01-08', y: 2100000 },
  { x: '2024-01-09', y: 1950000 },
  { x: '2024-01-10', y: 2250000 },
];

const feeDistributionData = [
  {
    label: 'Creator',
    value: mockAnalytics.feeShareRatio.creator,
    color: '#8b5cf6',
  },
  {
    label: 'OnlyFounders Treasury',
    value: mockAnalytics.feeShareRatio.onlyFoundersTreasury,
    color: '#06b6d4',
  },
  {
    label: 'Community Treasury',
    value: mockAnalytics.feeShareRatio.communityTreasury,
    color: '#10b981',
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

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');

  const totalVolume = Object.values(mockAnalytics.chainMetrics).reduce(
    (sum, chain) => sum + chain.volume,
    0
  );
  const totalFees = Object.values(mockAnalytics.chainMetrics).reduce(
    (sum, chain) => sum + chain.fees,
    0
  );
  const totalTokens = Object.values(mockAnalytics.chainMetrics).reduce(
    (sum, chain) => sum + chain.tokens,
    0
  );

  return (
    <div className="min-h-screen space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Solana platform performance insights and metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <IconCalendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
              <SelectItem value="1y">1 year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="default">
            <IconDownload className="h-4 w-4 mr-2" />
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
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Total Volume</CardTitle>
              <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {formatCurrency(totalVolume)}
              </div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <IconArrowUpRight className="h-3 w-3 mr-1" />
                +23.5% from last month
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
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Active Creators</CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {formatNumber(mockAnalytics.userEngagement.activeCreators)}
              </div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <IconArrowUpRight className="h-3 w-3 mr-1" />
                +15.8% from last month
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
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Total Tokens</CardTitle>
              <IconActivity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {formatNumber(totalTokens)}
              </div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <IconArrowUpRight className="h-3 w-3 mr-1" />
                +8.3% from last month
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
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Total Fees</CardTitle>
              <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-white">
                {formatCurrency(totalFees)}
              </div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <IconArrowUpRight className="h-3 w-3 mr-1" />
                +31.2% from last month
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ModernLineChart
            data={volumeTrendData}
            title="Volume Trends"
            description="Trading volume over the selected period"
            color="#06b6d4"
            showBadge={true}
            badgeText="Volume"
            badgePercentage="+23.4%"
            showGrid={true}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <RoundedPieChart
            data={feeDistributionData}
            title="Fee Distribution"
            description="Creator, OnlyFounders Treasury & Community Treasury split"
            showBadge={true}
            badgeText="Creator"
            badgePercentage="50%"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Solana Metrics
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Performance metrics for the Solana network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(mockAnalytics.chainMetrics).map(
                ([chain, metrics]) => (
                  <div
                    key={chain}
                    className="space-y-3 p-4 border border-border rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium capitalize text-white">
                        {chain}
                      </h4>
                      <Badge
                        variant="secondary"
                        className="bg-muted text-foreground"
                      >
                        {formatNumber(metrics.tokens)} tokens
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Volume</p>
                        <p className="font-medium text-white">
                          {formatCurrency(metrics.volume)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fees</p>
                        <p className="font-medium text-white">
                          {formatCurrency(metrics.fees)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gas Costs</p>
                        <p className="font-medium text-red-500">
                          {formatCurrency(metrics.gasCosts)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Net Profit</p>
                        <p className="font-medium text-emerald-500">
                          {formatCurrency(metrics.fees - metrics.gasCosts)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription className="text-muted-foreground">
              Creator activity and engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-white mb-1">
                  {formatNumber(mockAnalytics.userEngagement.activeCreators)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Creators
                </div>
                <div className="text-xs text-emerald-500 mt-1">
                  +15.8% this month
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-white mb-1">
                  {formatNumber(mockAnalytics.userEngagement.claimingCreators)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Claiming Creators
                </div>
                <div className="text-xs text-blue-500 mt-1">
                  {(
                    (mockAnalytics.userEngagement.claimingCreators /
                      mockAnalytics.userEngagement.activeCreators) *
                    100
                  ).toFixed(1)}
                  % of active
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-white mb-1">
                  {mockAnalytics.userEngagement.avgClaimFrequency.toFixed(1)}x
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg Claim Frequency
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Claims per month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
