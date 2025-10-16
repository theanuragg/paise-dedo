'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

interface HeatmapProps {
  data: HeatmapData[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  className?: string;
  colorScheme?: string[];
}

export default function Heatmap({
  data,
  width = 600,
  height = 400,
  margin = { top: 40, right: 40, bottom: 60, left: 80 },
  className = '',
  colorScheme = ['#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af', '#06b6d4', '#0891b2', '#0e7490'],
}: HeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Get unique x and y values
    const xValues = Array.from(new Set(data.map(d => d.x))).sort();
    const yValues = Array.from(new Set(data.map(d => d.y))).sort();

    // Create scales
    const xScale = d3.scaleBand()
      .domain(xValues)
      .range([0, innerWidth])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(yValues)
      .range([0, innerHeight])
      .padding(0.05);

    const colorScale = d3.scaleSequential()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .interpolator(d3.interpolateRgbBasis(colorScheme));

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

    // Add X axis
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('fill', '#9ca3af')
      .style('font-size', '12px')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Add Y axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('fill', '#9ca3af')
      .style('font-size', '12px');

    // Style axes
    g.selectAll('.domain')
      .style('stroke', '#374151')
      .style('stroke-width', '1px');

    g.selectAll('.tick line')
      .style('stroke', '#374151')
      .style('stroke-width', '1px');

    // Create heatmap cells
    const cells = g.selectAll('.cell')
      .data(data)
      .enter().append('rect')
      .attr('class', 'cell')
      .attr('x', d => xScale(d.x) || 0)
      .attr('y', d => yScale(d.y) || 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d.value))
      .attr('stroke', '#1f2937')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .style('opacity', 0)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.8)
          .attr('stroke', '#06b6d4')
          .attr('stroke-width', 2);

        tooltip.transition()
          .duration(200)
          .style('opacity', 1);
        
        tooltip.html(`
          <div>
            <div style="font-weight: bold; color: #06b6d4;">${d.x} × ${d.y}</div>
            <div>Value: ${d.value.toLocaleString()}</div>
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
          .style('opacity', 1)
          .attr('stroke', '#1f2937')
          .attr('stroke-width', 1);

        tooltip.transition()
          .duration(200)
          .style('opacity', 0);
      });

    // Animate cells appearing
    cells.transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .style('opacity', 1);

    // Add color legend
    const legendWidth = 20;
    const legendHeight = innerHeight * 0.6;
    const legendX = innerWidth + 10;
    const legendY = (innerHeight - legendHeight) / 2;

    const legendScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .range([legendHeight, 0]);

    const legendAxis = d3.axisRight(legendScale)
      .ticks(5)
      .tickFormat(d3.format('.2s'));

    // Create gradient for legend
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', legendHeight)
      .attr('x2', 0).attr('y2', 0);

    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const value = (i / steps) * (d3.max(data, d => d.value)! - d3.min(data, d => d.value)!) + d3.min(data, d => d.value)!;
      gradient.append('stop')
        .attr('offset', `${(i / steps) * 100}%`)
        .attr('stop-color', colorScale(value));
    }

    // Add legend rectangle
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${legendX}, ${legendY})`);

    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)')
      .attr('stroke', '#374151')
      .attr('stroke-width', 1);

    // Add legend axis
    legend.append('g')
      .attr('transform', `translate(${legendWidth}, 0)`)
      .call(legendAxis)
      .selectAll('text')
      .style('fill', '#9ca3af')
      .style('font-size', '11px');

    legend.selectAll('.domain')
      .style('stroke', '#374151');

    legend.selectAll('.tick line')
      .style('stroke', '#374151');

    // Add legend title
    legend.append('text')
      .attr('transform', `translate(${legendWidth / 2}, -10)`)
      .attr('text-anchor', 'middle')
      .style('fill', '#9ca3af')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text('Value');

    // Cleanup tooltip on unmount
    return () => {
      d3.select('body').selectAll('.tooltip').remove();
    };
  }, [data, width, height, margin, colorScheme]);

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
