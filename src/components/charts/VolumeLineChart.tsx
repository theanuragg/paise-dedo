'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface VolumeData {
  date: string;
  volume: number;
  fees: number;
}

interface VolumeLineChartProps {
  data: VolumeData[];
  width?: number;
  height?: number;
}

export default function VolumeLineChart({ 
  data, 
  width = 800, 
  height = 400 
}: VolumeLineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous chart

    const margin = { top: 20, right: 80, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Parse dates
    const parseDate = d3.timeParse("%Y-%m-%d");
    const processedData = data.map(d => ({
      ...d,
      date: parseDate(d.date) || new Date(),
      volume: +d.volume,
      fees: +d.fees
    }));

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(processedData, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yScaleVolume = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.volume) || 0])
      .range([innerHeight, 0]);

    const yScaleFees = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.fees) || 0])
      .range([innerHeight, 0]);

    // Line generators
    const volumeLine = d3.line<typeof processedData[0]>()
      .x(d => xScale(d.date))
      .y(d => yScaleVolume(d.volume))
      .curve(d3.curveMonotoneX);

    const feesLine = d3.line<typeof processedData[0]>()
      .x(d => xScale(d.date))
      .y(d => yScaleFees(d.fees))
      .curve(d3.curveMonotoneX);

    // Area generator for volume
    const volumeArea = d3.area<typeof processedData[0]>()
      .x(d => xScale(d.date))
      .y0(innerHeight)
      .y1(d => yScaleVolume(d.volume))
      .curve(d3.curveMonotoneX);

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add gradient for area
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "volumeGradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", 0)
      .attr("x2", 0).attr("y2", innerHeight);

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#06b6d4")
      .attr("stop-opacity", 0.3);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#06b6d4")
      .attr("stop-opacity", 0);

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickFormat(() => '')
      )
      .selectAll('line')
      .style('stroke', '#374151')
      .style('stroke-dasharray', '3,3');

    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScaleVolume)
        .tickSize(-innerWidth)
        .tickFormat(() => '')
      )
      .selectAll('line')
      .style('stroke', '#374151')
      .style('stroke-dasharray', '3,3');

    // Add volume area
    g.append('path')
      .datum(processedData)
      .attr('fill', 'url(#volumeGradient)')
      .attr('d', volumeArea)
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 1);

    // Add volume line
    const volumePath = g.append('path')
      .datum(processedData)
      .attr('fill', 'none')
      .attr('stroke', '#06b6d4')
      .attr('stroke-width', 3)
      .attr('d', volumeLine);

    // Add fees line
    const feesPath = g.append('path')
      .datum(processedData)
      .attr('fill', 'none')
      .attr('stroke', '#00d4aa')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', feesLine);

    // Animate lines
    const totalVolumeLength = volumePath.node()?.getTotalLength() || 0;
    const totalFeesLength = feesPath.node()?.getTotalLength() || 0;

    volumePath
      .attr('stroke-dasharray', totalVolumeLength + ' ' + totalVolumeLength)
      .attr('stroke-dashoffset', totalVolumeLength)
      .transition()
      .duration(2000)
      .attr('stroke-dashoffset', 0);

    feesPath
      .attr('stroke-dasharray', totalFeesLength + ' ' + totalFeesLength)
      .attr('stroke-dashoffset', totalFeesLength)
      .transition()
      .duration(2000)
      .delay(500)
      .attr('stroke-dashoffset', 0);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3.axisBottom(xScale).tickFormat((domainValue: Date | d3.NumberValue, index: number) => {
          const date = domainValue instanceof Date ? domainValue : new Date(domainValue.valueOf());
          return d3.timeFormat("%b %d")(date);
        })
      )
      .selectAll('text')
      .style('fill', '#9ca3af')
      .style('font-size', '12px');

    g.append('g')
      .call(d3.axisLeft(yScaleVolume).tickFormat(d3.format('.2s')))
      .selectAll('text')
      .style('fill', '#9ca3af')
      .style('font-size', '12px');

    g.append('g')
      .attr('transform', `translate(${innerWidth},0)`)
      .call(d3.axisRight(yScaleFees).tickFormat(d3.format('.2s')))
      .selectAll('text')
      .style('fill', '#9ca3af')
      .style('font-size', '12px');

    // Add legend
    const legend = g.append('g')
      .attr('transform', `translate(${innerWidth - 100}, 10)`);

    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 0)
      .attr('y2', 0)
      .style('stroke', '#06b6d4')
      .style('stroke-width', 3);

    legend.append('text')
      .attr('x', 25)
      .attr('y', 5)
      .text('Volume')
      .style('fill', '#ffffff')
      .style('font-size', '12px');

    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 20)
      .attr('y2', 20)
      .style('stroke', '#00d4aa')
      .style('stroke-width', 2)
      .style('stroke-dasharray', '5,5');

    legend.append('text')
      .attr('x', 25)
      .attr('y', 25)
      .text('Fees')
      .style('fill', '#ffffff')
      .style('font-size', '12px');

    // Add interactive dots
    const focus = g.append('g')
      .style('display', 'none');

    focus.append('circle')
      .attr('r', 5)
      .style('fill', '#06b6d4')
      .style('stroke', '#ffffff')
      .style('stroke-width', 2);

    focus.append('rect')
      .attr('width', 120)
      .attr('height', 50)
      .attr('x', -60)
      .attr('y', -70)
      .attr('rx', 5)
      .style('fill', '#1f2937')
      .style('stroke', '#374151')
      .style('opacity', 0.9);

    const tooltip = focus.append('g');

    tooltip.append('text')
      .attr('class', 'tooltip-date')
      .attr('text-anchor', 'middle')
      .attr('y', -50)
      .style('fill', '#ffffff')
      .style('font-size', '12px')
      .style('font-weight', 'bold');

    tooltip.append('text')
      .attr('class', 'tooltip-volume')
      .attr('text-anchor', 'middle')
      .attr('y', -35)
      .style('fill', '#06b6d4')
      .style('font-size', '11px');

    tooltip.append('text')
      .attr('class', 'tooltip-fees')
      .attr('text-anchor', 'middle')
      .attr('y', -25)
      .style('fill', '#00d4aa')
      .style('font-size', '11px');

    // Add invisible overlay for mouse tracking
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => focus.style('display', 'none'))
      .on('mousemove', function(event) {
        const [mouseX] = d3.pointer(event);
        const x0 = xScale.invert(mouseX);
        const i = d3.bisector((d: typeof processedData[0]) => d.date).left(processedData, x0, 1);
        const d0 = processedData[i - 1];
        const d1 = processedData[i];
        const d = d1 && (x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime()) ? d1 : d0;
        
        if (d) {
          focus.attr('transform', `translate(${xScale(d.date)},${yScaleVolume(d.volume)})`);
          focus.select('.tooltip-date').text(d3.timeFormat("%b %d")(d.date));
          focus.select('.tooltip-volume').text(`Volume: $${d3.format('.2s')(d.volume)}`);
          focus.select('.tooltip-fees').text(`Fees: $${d3.format('.2s')(d.fees)}`);
        }
      });

  }, [data, width, height]);

  return (
    <div className="w-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      />
    </div>
  );
}
