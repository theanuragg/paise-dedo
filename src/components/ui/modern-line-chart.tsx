'use client';

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

interface ModernLineChartData {
  x: string;
  y: number;
  [key: string]: any;
}

interface ModernLineChartProps {
  data: ModernLineChartData[];
  title?: string;
  description?: string;
  dataKey?: string;
  nameKey?: string;
  color?: string;
  showBadge?: boolean;
  badgeText?: string;
  badgePercentage?: string;
  showGrid?: boolean;
  className?: string;
}

export function ModernLineChart({
  data,
  title = 'Line Chart',
  description = 'Data visualization',
  dataKey = 'y',
  nameKey = 'x',
  color = 'hsl(var(--muted-foreground))',
  showBadge = false,
  badgeText = 'Growth',
  badgePercentage = '5.2%',
  showGrid = true,
  className,
}: ModernLineChartProps) {
  const chartConfig = {
    [dataKey]: {
      label: dataKey,
      color: color,
    },
  } satisfies ChartConfig;

  return (
    <div className={`bg-secondary/50 rounded-[24px] p-2`}>
      <div className="px-2 pb-4 pt-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-lg">{title}</span>
          {showBadge && (
            <Badge variant="emerald" className="ml-2 space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>{badgePercentage}</span>
            </Badge>
          )}
        </div>
        <div className="text-muted-foreground">{description}</div>
      </div>
      <div className="bg-background rounded-2xl">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                />
              )}
              <XAxis
                dataKey={nameKey}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => `${value}`}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={{
                  stroke: color,
                  strokeWidth: 1,
                  strokeDasharray: '4 4',
                }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={{
                  fill: color,
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  stroke: color,
                  strokeWidth: 2,
                  fill: '#fff',
                }}
                filter="url(#line-glow)"
              />
              <defs>
                <filter
                  id="line-glow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
