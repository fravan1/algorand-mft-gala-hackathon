'use client';

import React from 'react';
import styles from './PieChart.module.css';

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  showLegend?: boolean;
  className?: string;
}

export default function PieChart({ 
  data, 
  size = 200, 
  showLegend = true, 
  className = '' 
}: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let cumulativePercentage = 0;
  
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = (cumulativePercentage / 100) * 360;
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
    
    cumulativePercentage += percentage;
    
    const radius = (size - 20) / 2;
    const centerX = size / 2;
    const centerY = size / 2;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    return {
      ...item,
      pathData,
      percentage: percentage.toFixed(1)
    };
  });

  return (
    <div className={`${styles.pieChartContainer} ${className}`}>
      <div className={styles.chartWrapper}>
        <svg width={size} height={size} className={styles.pieChart}>
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.pathData}
              fill={segment.color}
              className={styles.segment}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          ))}
        </svg>
        <div className={styles.centerText}>
          <div className={styles.totalValue}>{total.toLocaleString()}</div>
          <div className={styles.totalLabel}>Total</div>
        </div>
      </div>
      
      {showLegend && (
        <div className={styles.legend}>
          {segments.map((segment, index) => (
            <div key={index} className={styles.legendItem}>
              <div 
                className={styles.legendColor} 
                style={{ backgroundColor: segment.color }}
              />
              <div className={styles.legendText}>
                <span className={styles.legendLabel}>{segment.label}</span>
                <span className={styles.legendValue}>
                  {segment.value.toLocaleString()} ({segment.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

