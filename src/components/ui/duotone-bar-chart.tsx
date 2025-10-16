'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';

interface DuotoneBarChartData {
  name: string;
  value: number;
}

interface DuotoneBarChartProps {
  data: DuotoneBarChartData[];
  title?: string;
  description?: string;
  dataKey?: string;
  nameKey?: string;
  color?: string;
  showBadge?: boolean;
  badgeText?: string;
  badgePercentage?: string;
}

export function DuotoneBarChart({
  data,
  title = 'Bar Chart',
  description = 'Data visualization',
  dataKey = 'value',
  nameKey = 'name',
  color = 'hsl(var(--muted-foreground))',
  showBadge = false,
  badgeText = 'Growth',
  badgePercentage = '5.2%',
}: DuotoneBarChartProps) {
  const chartData = data.map(item => ({
    [nameKey]: item.name,
    [dataKey]: item.value,
  }));

  const chartConfig = {
    [dataKey]: {
      label: dataKey,
      color: color,
    },
  } satisfies ChartConfig;

  return (
    <div className="bg-secondary/50 rounded-[24px] p-2">
      <div className="px-2 pb-4 pt-2 text-sm">
        <div className='flex items-center justify-between'>
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
        <div className='text-muted-foreground'>{description}</div>
      </div>
      <div className="bg-background rounded-2xl">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <rect
              x="0"
              y="0"
              width="100%"
              height="85%"
              fill="url(#default-pattern-dots)"
            />
            <defs>
              <DottedBackgroundPattern />
            </defs>
            <XAxis
              dataKey={nameKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey={dataKey}
              fill={color}
              shape={<CustomDuotoneBar dataKey={dataKey} />}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}

const CustomDuotoneBar = (
  props: React.SVGProps<SVGRectElement> & { dataKey?: string }
) => {
  const { fill, x, y, width, height, dataKey } = props;

  return (
    <>
      <rect
        rx={4}
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="none"
        fill={`url(#duotone-bar-pattern-${dataKey})`}
      />
      <defs>
        <linearGradient
          key={dataKey}
          id={`duotone-bar-pattern-${dataKey}`}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop offset="50%" stopColor={fill} stopOpacity={0.5} />
          <stop offset="50%" stopColor={fill} />
        </linearGradient>
      </defs>
    </>
  );
};

const DottedBackgroundPattern = () => {
  return (
    <pattern
      id="default-pattern-dots"
      x="0"
      y="0"
      width="10"
      height="10"
      patternUnits="userSpaceOnUse"
    >
      <circle
        className="dark:text-muted/40 text-muted"
        cx="2"
        cy="2"
        r="1"
        fill="currentColor"
      />
    </pattern>
  );
};
