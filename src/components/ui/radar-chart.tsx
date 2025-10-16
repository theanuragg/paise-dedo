"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";

interface RadarChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface GlowingMultipleStrokeRadarChartProps {
  data: RadarChartData[];
  title?: string;
  description?: string;
  dataKey?: string;
  nameKey?: string;
  color?: string;
  showBadge?: boolean;
  badgeText?: string;
  badgePercentage?: string;
}

export function GlowingMultipleStrokeRadarChart({
  data,
  title = "Radar Chart",
  description = "Multi-dimensional data visualization",
  dataKey = "value",
  nameKey = "name",
  color = 'hsl(var(--muted-foreground))',
  showBadge = false,
  badgeText = "Change",
  badgePercentage = "5.2%"
}: GlowingMultipleStrokeRadarChartProps)    {
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
              <TrendingDown className="h-4 w-4" />
              <span>{badgePercentage}</span>
            </Badge>
          )}
        </div>
        <div className='text-muted-foreground'>{description}</div>
      </div>
      <div className="bg-background rounded-2xl">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey={nameKey} />
            <PolarGrid strokeDasharray="3 3" />
            <Radar
              stroke={color}
              dataKey={dataKey}
              fill="none"
              filter="url(#multi-stroke-line-glow)"
            />
            <defs>
              <filter
                id="multi-stroke-line-glow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          </RadarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
