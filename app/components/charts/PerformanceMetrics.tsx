'use client';

import React from 'react';
import { Card } from '@/app/components/ui/Card';
import { StatusIndicator, StatusBadge } from '@/app/components/ui/StatusIndicator';
import { PerformanceMetrics as Metrics, ComponentPerformance } from '@/app/types/profiler';
import { getPerformanceStatus, RENDER_TIME_THRESHOLDS } from '@/app/utils/thresholds';
import { TrendingUp, TrendingDown, Activity, Layers, Clock, Zap } from 'lucide-react';

interface PerformanceMetricsProps {
  metrics: Metrics;
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const avgStatus = getPerformanceStatus(metrics.averageRenderTime, RENDER_TIME_THRESHOLDS);
  const maxStatus = getPerformanceStatus(metrics.maxRenderTime, RENDER_TIME_THRESHOLDS);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Render</p>
              <p className="text-2xl font-bold">{metrics.averageRenderTime.toFixed(2)} ms</p>
              <StatusBadge status={avgStatus} size="sm" />
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Max Render</p>
              <p className="text-2xl font-bold">{metrics.maxRenderTime.toFixed(2)} ms</p>
              <StatusBadge status={maxStatus} size="sm" />
            </div>
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Renders</p>
              <p className="text-2xl font-bold">{metrics.totalRenders}</p>
              <p className="text-xs text-gray-500">commits</p>
            </div>
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Components</p>
              <p className="text-2xl font-bold">{metrics.componentsCount}</p>
              <p className="text-xs text-gray-500">tracked</p>
            </div>
            <Layers className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
      </div>

      <Card title="Slowest Components">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Component</th>
                <th className="text-right py-2 px-4">Avg Render Time</th>
                <th className="text-right py-2 px-4">Render Count</th>
                <th className="text-center py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.slowestComponents.map((component: ComponentPerformance, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{component.name}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-mono">{component.renderTime.toFixed(2)} ms</span>
                  </td>
                  <td className="py-3 px-4 text-right">{component.renderCount}</td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={component.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}