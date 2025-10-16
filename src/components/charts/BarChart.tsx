'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BarData {
  label: string;
  value: number;
  category?: string;
}

interface BarChartProps {
  data: BarData[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  className?: string;
  color?: string;
  orientation?: 'horizontal' | 'vertical';
}

export default function BarChart({
  data,
  width = 500,
  height = 300,
  margin = { top: 20, right: 30, bottom: 40, left: 80 },
  className = '',
  color = '#06b6d4',
  orientation = 'horizontal',
}: BarChartProps) {
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

    if (orientation === 'horizontal') {
      // Horizontal bar chart
      const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) || 0])
        .range([0, innerWidth]);

      const yScale = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([0, innerHeight])
        .padding(0.2);

      // Add X axis
      g.append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format('.2s')))
        .selectAll('text')
        .style('fill', '#9ca3af')
        .style('font-size', '12px');

      // Add Y axis
      g.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll('text')
        .style('fill', '#9ca3af')
        .style('font-size', '12px');

      // Style axes
      g.selectAll('.domain')
        .style('stroke', '#374151');

      g.selectAll('.tick line')
        .style('stroke', '#374151');

      // Add bars
      const bars = g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('y', d => yScale(d.label) || 0)
        .attr('height', yScale.bandwidth())
        .attr('x', 0)
        .attr('width', 0)
        .attr('fill', color)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('fill', d3.color(color)?.brighter(0.3)?.toString() || color);

          tooltip.transition()
            .duration(200)
            .style('opacity', 1);
          
          tooltip.html(`
            <div>
              <div style="font-weight: bold; color: ${color};">${d.label}</div>
              <div>Value: ${d.value.toLocaleString()}</div>
              ${d.category ? `<div>Category: ${d.category}</div>` : ''}
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
            .attr('fill', color);

          tooltip.transition()
            .duration(200)
            .style('opacity', 0);
        });

      // Animate bars
      bars.transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .attr('width', d => xScale(d.value));

      // Add value labels
      g.selectAll('.value-label')
        .data(data)
        .enter().append('text')
        .attr('class', 'value-label')
        .attr('x', d => xScale(d.value) + 5)
        .attr('y', d => (yScale(d.label) || 0) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .style('fill', '#9ca3af')
        .style('font-size', '11px')
        .style('opacity', 0)
        .text(d => d3.format('.2s')(d.value))
        .transition()
        .duration(800)
        .delay((d, i) => i * 100 + 400)
        .style('opacity', 1);

    } else {
      // Vertical bar chart
      const xScale = d3.scaleBand()
        .domain(data.map(d => d.label))
        .range([0, innerWidth])
        .padding(0.2);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) || 0])
        .range([innerHeight, 0]);

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
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format('.2s')))
        .selectAll('text')
        .style('fill', '#9ca3af')
        .style('font-size', '12px');

      // Style axes
      g.selectAll('.domain')
        .style('stroke', '#374151');

      g.selectAll('.tick line')
        .style('stroke', '#374151');

      // Add bars
      const bars = g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.label) || 0)
        .attr('width', xScale.bandwidth())
        .attr('y', innerHeight)
        .attr('height', 0)
        .attr('fill', color)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('fill', d3.color(color)?.brighter(0.3)?.toString() || color);

          tooltip.transition()
            .duration(200)
            .style('opacity', 1);
          
          tooltip.html(`
            <div>
              <div style="font-weight: bold; color: ${color};">${d.label}</div>
              <div>Value: ${d.value.toLocaleString()}</div>
              ${d.category ? `<div>Category: ${d.category}</div>` : ''}
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
            .attr('fill', color);

          tooltip.transition()
            .duration(200)
            .style('opacity', 0);
        });

      // Animate bars
      bars.transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .attr('y', d => yScale(d.value))
        .attr('height', d => innerHeight - yScale(d.value));

      // Add value labels
      g.selectAll('.value-label')
        .data(data)
        .enter().append('text')
        .attr('class', 'value-label')
        .attr('x', d => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.value) - 5)
        .attr('text-anchor', 'middle')
        .style('fill', '#9ca3af')
        .style('font-size', '11px')
        .style('opacity', 0)
        .text(d => d3.format('.2s')(d.value))
        .transition()
        .duration(800)
        .delay((d, i) => i * 100 + 400)
        .style('opacity', 1);
    }

    // Cleanup tooltip on unmount
    return () => {
      d3.select('body').selectAll('.tooltip').remove();
    };
  }, [data, width, height, margin, color, orientation]);

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
