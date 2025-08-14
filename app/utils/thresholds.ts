import { ThresholdConfig, PerformanceStatus } from '@/app/types/profiler';

export const RENDER_TIME_THRESHOLDS: ThresholdConfig = {
  good: 16,
  warning: 50,
  critical: 100,
};

export const COMMIT_PHASE_THRESHOLDS: ThresholdConfig = {
  good: 10,
  warning: 25,
  critical: 50,
};

export const EFFECT_DURATION_THRESHOLDS: ThresholdConfig = {
  good: 5,
  warning: 15,
  critical: 30,
};

export function getPerformanceStatus(value: number, thresholds: ThresholdConfig): PerformanceStatus {
  if (value <= thresholds.good) {
    return 'good';
  } else if (value <= thresholds.warning) {
    return 'warning';
  } else {
    return 'critical';
  }
}

export function getStatusColor(status: PerformanceStatus): string {
  switch (status) {
    case 'good':
      return '#22c55e';
    case 'warning':
      return '#eab308';
    case 'critical':
      return '#ef4444';
    default:
      return '#6b7280';
  }
}

export function getStatusBgColor(status: PerformanceStatus): string {
  switch (status) {
    case 'good':
      return 'bg-green-100';
    case 'warning':
      return 'bg-yellow-100';
    case 'critical':
      return 'bg-red-100';
    default:
      return 'bg-gray-100';
  }
}

export function getStatusTextColor(status: PerformanceStatus): string {
  switch (status) {
    case 'good':
      return 'text-green-700';
    case 'warning':
      return 'text-yellow-700';
    case 'critical':
      return 'text-red-700';
    default:
      return 'text-gray-700';
  }
}

export function getStatusIcon(status: PerformanceStatus): string {
  switch (status) {
    case 'good':
      return '✅';
    case 'warning':
      return '⚠️';
    case 'critical':
      return '🚨';
    default:
      return '❓';
  }
}