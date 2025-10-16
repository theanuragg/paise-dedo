'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface LineData {
  x: string | number | Date;
  y: number;
  series?: string;
}

interface MultiLineData {
  [key: string]: LineData[];
}

interface LineChartProps {
  data: LineData[] | MultiLineData;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  className?: string;
  colors?: string[];
  showGrid?: boolean;
  showDots?: boolean;
  animate?: boolean;
}

export default function LineChart({
  data,
  width = 600,
  height = 400,
  margin = { top: 20, right: 80, bottom: 40, left: 60 },
  className = '',
  colors = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'],
  showGrid = true,
  showDots = true,
  animate = true,
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Process data
    let processedData: { key: string; values: LineData[] }[];
    
    if (Array.isArray(data)) {
      processedData = [{ key: 'default', values: data }];
    } else {
      processedData = Object.entries(data).map(([key, values]) => ({ key, values }));
    }

    if (!processedData.length || !processedData[0].values.length) return;

    // Create scales
    const allValues = processedData.flatMap(d => d.values);
    
    const xScale = d3.scaleTime()
      .domain(d3.extent(allValues, d => new Date(d.x)) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(allValues, d => d.y) as [number, number])
      .nice()
      .range([innerHeight, 0]);

    // Create line generator
    const line = d3.line<LineData>()
      .x(d => xScale(new Date(d.x)))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    // Create area generator for gradient fill
    const area = d3.area<LineData>()
      .x(d => xScale(new Date(d.x)))
      .y0(innerHeight)
      .y1(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.9)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '6px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000);

    // Add grid lines
    if (showGrid) {
      g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale)
          .ticks(6)
          .tickSize(-innerHeight)
          .tickFormat(() => '')
        )
        .selectAll('line')
        .style('stroke', '#374151')
        .style('stroke-dasharray', '3,3')
        .style('opacity', 0.3);

      g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
        )
        .selectAll('line')
        .style('stroke', '#374151')
        .style('stroke-dasharray', '3,3')
        .style('opacity', 0.3);
    }

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6).tickFormat((domainValue) => d3.timeFormat('%m/%d')(domainValue as Date)))
      .selectAll('text')
      .style('fill', '#9ca3af')
      .style('font-size', '12px');

    // Add Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format('.2s')))
      .selectAll('text')
      .style('fill', '#9ca3af')
      .style('font-size', '12px');

    // Style axes
    g.selectAll('.domain')
      .style('stroke', '#374151');

    g.selectAll('.tick line')
      .style('stroke', '#374151');

    // Create gradients for each line
    const defs = svg.append('defs');
    processedData.forEach((series, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${i}`)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', 0).attr('y2', innerHeight);

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', colors[i % colors.length])
        .attr('stop-opacity', 0.3);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', colors[i % colors.length])
        .attr('stop-opacity', 0);
    });

    // Draw lines and areas for each series
    processedData.forEach((series, i) => {
      const color = colors[i % colors.length];

      // Add area
      const areaPath = g.append('path')
        .datum(series.values)
        .attr('class', `area-${i}`)
        .attr('fill', `url(#gradient-${i})`)
        .attr('d', area);

      // Add line
      const linePath = g.append('path')
        .datum(series.values)
        .attr('class', `line-${i}`)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', line);

      // Animate line drawing
      if (animate) {
        const totalLength = linePath.node()!.getTotalLength();
        
        linePath
          .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0);

        areaPath
          .style('opacity', 0)
          .transition()
          .duration(2000)
          .delay(500)
          .style('opacity', 1);
      }

      // Add dots
      if (showDots) {
        const dots = g.selectAll(`.dot-${i}`)
          .data(series.values)
          .enter().append('circle')
          .attr('class', `dot-${i}`)
          .attr('cx', d => xScale(new Date(d.x)))
          .attr('cy', d => yScale(d.y))
          .attr('r', 4)
          .attr('fill', color)
          .attr('stroke', '#1f2937')
          .attr('stroke-width', 2)
          .style('cursor', 'pointer')
          .style('opacity', animate ? 0 : 1)
          .on('mouseover', function(event, d) {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('r', 6);

            tooltip.transition()
              .duration(200)
              .style('opacity', 1);
            
            tooltip.html(`
              <div>
                <div style="font-weight: bold; color: ${color};">${series.key !== 'default' ? series.key : 'Value'}</div>
                <div>Date: ${new Date(d.x).toLocaleDateString()}</div>
                <div>Value: ${d.y.toLocaleString()}</div>
              </div>
            `)
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 10) + 'px');
          })
          .on('mousemove', function(event) {
            tooltip
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 10) + 'px');
          })
          .on('mouseout', function() {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('r', 4);

            tooltip.transition()
              .duration(200)
              .style('opacity', 0);
          });

        if (animate) {
          dots.transition()
            .duration(300)
            .delay((d, j) => 2000 + j * 100)
            .style('opacity', 1);
        }
      }
    });

    // Add legend for multi-line charts
    if (processedData.length > 1) {
      const legend = g.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${innerWidth - 80}, 20)`);

      const legendItems = legend.selectAll('.legend-item')
        .data(processedData)
        .enter().append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`);

      legendItems.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', (d, i) => colors[i % colors.length]);

      legendItems.append('text')
        .attr('x', 16)
        .attr('y', 6)
        .attr('dy', '0.35em')
        .style('fill', '#9ca3af')
        .style('font-size', '12px')
        .text(d => d.key);
    }

    // Cleanup tooltip on unmount
    return () => {
      d3.select('body').selectAll('.tooltip').remove();
    };
  }, [data, width, height, margin, colors, showGrid, showDots, animate]);

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      />
    </div>
  );
}
