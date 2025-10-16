'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DonutData {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutData[];
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
}

export default function DonutChart({
  data,
  width = 300,
  height = 300,
  innerRadius = 60,
  outerRadius = 120,
  className = '',
}: DonutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const radius = Math.min(width, height) / 2;
    const adjustedOuterRadius = Math.min(outerRadius, radius - 10);
    const adjustedInnerRadius = Math.min(innerRadius, adjustedOuterRadius - 20);

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie<DonutData>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<DonutData>>()
      .innerRadius(adjustedInnerRadius)
      .outerRadius(adjustedOuterRadius);

    const hoverArc = d3.arc<d3.PieArcDatum<DonutData>>()
      .innerRadius(adjustedInnerRadius)
      .outerRadius(adjustedOuterRadius + 10);

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

    // Draw arcs
    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .style('cursor', 'pointer')
      .style('transition', 'all 0.3s ease')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', hoverArc(d) || '');

        const percentage = ((d.data.value / d3.sum(data, d => d.value)) * 100).toFixed(1);
        
        tooltip.transition()
          .duration(200)
          .style('opacity', 1);
        
        tooltip.html(`
          <div>
            <div style="font-weight: bold; color: ${d.data.color};">${d.data.label}</div>
            <div>Value: ${d.data.value.toLocaleString()}</div>
            <div>Percentage: ${percentage}%</div>
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
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc(d) || '');

        tooltip.transition()
          .duration(200)
          .style('opacity', 0);
      });

    // Add center text
    const total = d3.sum(data, d => d.value);
    const centerText = g.append('g').attr('class', 'center-text');
    
    centerText.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#06b6d4')
      .text(total.toLocaleString());

    centerText.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .style('font-size', '12px')
      .style('fill', '#9ca3af')
      .text('Total');

    // Add labels with leader lines
    const labelArc = d3.arc<d3.PieArcDatum<DonutData>>()
      .innerRadius(adjustedOuterRadius + 20)
      .outerRadius(adjustedOuterRadius + 20);

    const labels = g.selectAll('.label')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'label');

    // Leader lines
    labels.append('polyline')
      .attr('stroke', '#9ca3af')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('points', d => {
        const posA = arc.centroid(d);
        const posB = labelArc.centroid(d);
        const posC = labelArc.centroid(d);
        posC[0] = adjustedOuterRadius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [posA, posB, posC].map(p => p.join(',')).join(' ');
      });

    // Label text
    labels.append('text')
      .attr('dy', '0.35em')
      .style('font-size', '11px')
      .style('fill', '#9ca3af')
      .attr('text-anchor', d => midAngle(d) < Math.PI ? 'start' : 'end')
      .attr('transform', d => {
        const pos = labelArc.centroid(d);
        pos[0] = adjustedOuterRadius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .text(d => {
        const percentage = ((d.data.value / total) * 100).toFixed(1);
        return `${d.data.label} (${percentage}%)`;
      });

    function midAngle(d: d3.PieArcDatum<DonutData>) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    // Cleanup tooltip on unmount
    return () => {
      d3.select('body').selectAll('.tooltip').remove();
    };
  }, [data, width, height, innerRadius, outerRadius]);

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
