'use client';

import { useState, useEffect } from 'react';

interface WebVitalGaugeProps {
  label: string;
  value: number;
  unit: string;
  thresholds: {
    good: number;
    needsImprovement: number;
  };
  description: string;
  inverse?: boolean; // For CLS where lower is better
}

export function WebVitalGauge({ 
  label, 
  value, 
  unit, 
  thresholds, 
  description,
  inverse = false 
}: WebVitalGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  // Determine status based on thresholds
  const getStatus = () => {
    if (inverse) {
      if (value <= thresholds.good) return 'good';
      if (value <= thresholds.needsImprovement) return 'needs-improvement';
      return 'poor';
    }
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
  };

  const status = getStatus();

  const statusConfig = {
    good: {
      color: 'hsl(var(--success))',
      bg: 'bg-success/10',
      text: 'text-success',
      label: 'Bun',
    },
    'needs-improvement': {
      color: 'hsl(var(--warning))',
      bg: 'bg-warning/10',
      text: 'text-warning',
      label: 'De îmbunătățit',
    },
    poor: {
      color: 'hsl(var(--destructive))',
      bg: 'bg-destructive/10',
      text: 'text-destructive',
      label: 'Slab',
    },
  };

  const config = statusConfig[status];

  // Calculate percentage for the gauge (normalize to 0-100 based on poor threshold)
  const maxValue = thresholds.needsImprovement * 1.5;
  const percentage = Math.min((animatedValue / maxValue) * 100, 100);

  // SVG arc calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75; // 270 degree arc

  return (
    <div className="relative flex flex-col items-center p-6 bg-card rounded-xl border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300">
      {/* Gauge */}
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 100 100">
          {/* Background arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-muted/30"
            strokeDasharray={circumference * 0.75}
            strokeDashoffset={0}
          />
          {/* Value arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference * 0.75}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${config.text}`}>
            {animatedValue.toFixed(unit === 's' ? 1 : unit === '' ? 3 : 0)}
          </span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>

      {/* Label */}
      <h4 className="text-lg font-semibold text-foreground mb-1">{label}</h4>
      
      {/* Status badge */}
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} mb-3`}>
        {config.label}
      </span>
      
      {/* Description */}
      <p className="text-xs text-muted-foreground text-center">{description}</p>

      {/* Threshold indicators */}
      <div className="flex items-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-muted-foreground">≤{thresholds.good}{unit}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-warning" />
          <span className="text-muted-foreground">≤{thresholds.needsImprovement}{unit}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-destructive" />
          <span className="text-muted-foreground">&gt;{thresholds.needsImprovement}{unit}</span>
        </div>
      </div>
    </div>
  );
}
