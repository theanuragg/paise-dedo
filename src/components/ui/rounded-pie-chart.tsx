"use client";

import { LabelList, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export const description = "A pie chart with a label list";

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface RoundedPieChartProps {
  data: PieChartData[];
  title?: string;
  description?: string;
  showBadge?: boolean;
  badgeText?: string;
  badgePercentage?: string;
}

export function RoundedPieChart({ 
  data, 
  title = "Pie Chart", 
  description = "Data visualization", 
  showBadge = false,
  badgeText = "Growth",
  badgePercentage = "0%"
}: RoundedPieChartProps) {
  const chartData = data.map((item, index) => ({
    name: item.label,
    value: item.value,
    fill: item.color,
  }));

  const chartConfig = data.reduce((config, item, index) => {
    const key = item.label.toLowerCase().replace(/\s+/g, '');
    config[key] = {
      label: item.label,
      color: item.color,
    };
    return config;
  }, {
    value: {
      label: "Value",
    },
  } as ChartConfig);

  return (
    <div className="bg-secondary/50 rounded-[24px] p-2">
      <div className="px-2 pb-4 pt-2 text-sm">
        <div className='flex items-center justify-between'>
          <span className="text-lg">
            {title}
          </span>
          {showBadge && (
            <Badge
              variant="emerald"
              className="ml-2 space-x-2"
            >
              <TrendingUp className="h-4 w-4" />
              <span>{badgePercentage}</span>
            </Badge>
          )}
        </div>
        <div className='text-muted-foreground'>{description}</div>
      </div>
      <div className="bg-background rounded-2xl">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="value" hideLabel />}
            />
            <Pie
              data={chartData}
              innerRadius={30}
              dataKey="value"
              radius={10}
              cornerRadius={8}
              paddingAngle={4}
            >
              <LabelList
                dataKey="value"
                stroke="none"
                fontSize={12}
                fontWeight={500}
                fill="currentColor"
                formatter={(value: number) => value.toString()}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}
