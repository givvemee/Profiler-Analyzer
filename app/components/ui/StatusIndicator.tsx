import React from 'react';
import { PerformanceStatus } from '@/app/types/profiler';
import { getStatusBgColor, getStatusTextColor, getStatusIcon } from '@/app/utils/thresholds';

interface StatusIndicatorProps {
  status: PerformanceStatus;
  value: number;
  unit?: string;
  label?: string;
}

export function StatusIndicator({ status, value, unit = 'ms', label }: StatusIndicatorProps) {
  const bgColor = getStatusBgColor(status);
  const textColor = getStatusTextColor(status);
  const icon = getStatusIcon(status);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bgColor} ${textColor}`}>
      <span className="text-lg">{icon}</span>
      {label && <span className="font-medium">{label}:</span>}
      <span className="font-bold">
        {value.toFixed(2)} {unit}
      </span>
    </div>
  );
}

interface StatusBadgeProps {
  status: PerformanceStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const bgColor = getStatusBgColor(status);
  const textColor = getStatusTextColor(status);
  const icon = getStatusIcon(status);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${bgColor} ${textColor} ${sizeClasses[size]}`}>
      <span>{icon}</span>
      <span className="font-medium capitalize">{status}</span>
    </span>
  );
}