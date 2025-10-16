'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

interface BarPatternChartData {
  name: string;
  value: number;
  fill?: string;
}

interface BarPatternChartProps {
  data: BarPatternChartData[];
  title?: string;
  description?: string;
  dataKey?: string;
  nameKey?: string;
  color?: string;
  className?: string;
  showBadge?: boolean;
  badgeText?: string;
  badgePercentage?: string;
}

export function BarPatternChart({
  data,
  title = 'Bar Chart',
  description = 'Data visualization',
  dataKey = 'value',
  nameKey = 'name',
  color = 'hsl(var(--muted-foreground))',
  className,
  showBadge = false,
  badgeText = 'Growth',
  badgePercentage = '5.2%',
}: BarPatternChartProps) {
  const chartConfig = {
    [dataKey]: {
      label: dataKey,
      color: color,
    },
  } satisfies ChartConfig;

  return (
    <div className={`bg-secondary/50 rounded-[24px] p-2 ${className}`}>
      <div className="px-2 pb-4 pt-2 text-sm">
        <div className="flex items-center justify-between">
          {title}
          {showBadge && (
            <Badge
              variant="outline"
              className="text-muted-foreground bg-muted border-none ml-2 space-x-2"
            >
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
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
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
                cursor={{ fill: 'hsl(var(--muted)/0.1)' }}
              />
              <Bar
                dataKey={dataKey}
                fill={color}
                radius={[4, 4, 0, 0]}
                className="transition-opacity duration-200 hover:opacity-80"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
