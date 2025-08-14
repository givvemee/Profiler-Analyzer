'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUpload } from '@/components/ui/file-upload';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { MagicCard } from '@/components/ui/magic-card';
import NumberTicker from '@/components/ui/number-ticker';
import { 
  parseProfilerData, 
  calculatePerformanceMetrics,
  getCommitDataForChart,
  getComponentTreeData,
  getRenderPhasesData
} from '@/app/utils/profilerParser';
import { 
  getPerformanceStatus, 
  RENDER_TIME_THRESHOLDS,
  getStatusColor,
  getStatusIcon
} from '@/app/utils/thresholds';
import { RenderTimeChart } from '@/app/components/charts/RenderTimeChart';
import { ComponentTree } from '@/app/components/charts/ComponentTree';
import { RenderPhases } from '@/app/components/charts/RenderPhases';
import { 
  Activity, 
  Clock, 
  Layers, 
  TrendingUp,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { ProfilerData, PerformanceMetrics } from '@/app/types/profiler';

export function Dashboard() {
  const [profilerData, setProfilerData] = useState<ProfilerData | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (data: any) => {
    try {
      const parsedData = parseProfilerData(data);
      setProfilerData(parsedData);
      const calculatedMetrics = calculatePerformanceMetrics(parsedData);
      setMetrics(calculatedMetrics);
      setError(null);
    } catch (err) {
      setError('Failed to parse profiler data. Please check the file format.');
      console.error(err);
    }
  };

  if (!profilerData || !metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              React Profiler Analyzer
            </h1>
            <p className="text-center text-neutral-600 dark:text-neutral-400 mb-8">
              Upload your React DevTools Profiler data to analyze performance
            </p>
            
            <FileUpload onFileUpload={handleFileUpload} onError={setError} />
            
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  const avgStatus = getPerformanceStatus(metrics.averageRenderTime, RENDER_TIME_THRESHOLDS);
  const maxStatus = getPerformanceStatus(metrics.maxRenderTime, RENDER_TIME_THRESHOLDS);
  const chartData = getCommitDataForChart(profilerData);
  const treeData = getComponentTreeData(profilerData);
  const phasesData = getRenderPhasesData(profilerData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Performance Analysis Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            React Version: {profilerData.reactVersion}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <MagicCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="h-8 w-8 text-blue-500" />
                <StatusIcon status={avgStatus} />
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Average Render
              </p>
              <div className="text-3xl font-bold">
                <NumberTicker value={metrics.averageRenderTime} decimalPlaces={2} />
                <span className="text-lg ml-1 text-neutral-500">ms</span>
              </div>
            </MagicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <MagicCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <StatusIcon status={maxStatus} />
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Max Render
              </p>
              <div className="text-3xl font-bold">
                <NumberTicker value={metrics.maxRenderTime} decimalPlaces={2} />
                <span className="text-lg ml-1 text-neutral-500">ms</span>
              </div>
            </MagicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <MagicCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Total Commits
              </p>
              <div className="text-3xl font-bold">
                <NumberTicker value={metrics.totalRenders} />
              </div>
            </MagicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <MagicCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Layers className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Components
              </p>
              <div className="text-3xl font-bold">
                <NumberTicker value={metrics.componentsCount} />
              </div>
            </MagicCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <MagicCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Render Time Trends</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Commit-by-commit performance analysis
            </p>
            <RenderTimeChart data={chartData} />
          </MagicCard>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MagicCard className="p-6 h-full">
                <h2 className="text-xl font-semibold mb-4">Component Performance Tree</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Visual representation of component render times
                </p>
                <ComponentTree data={treeData} />
              </MagicCard>
            </div>
            
            <div className="lg:col-span-1">
              <MagicCard className="p-6 h-full">
                <h2 className="text-xl font-semibold mb-4">Slowest Components</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Top components by render time
                </p>
                <ComponentList components={metrics.slowestComponents} />
              </MagicCard>
            </div>
          </div>

          <MagicCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Render Phases Breakdown</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Detailed breakdown of render, effect, and passive effect phases
            </p>
            <RenderPhases data={phasesData} />
          </MagicCard>
        </motion.div>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: 'good' | 'warning' | 'critical' }) {
  switch (status) {
    case 'good':
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    case 'critical':
      return <XCircle className="h-6 w-6 text-red-500" />;
  }
}

function ComponentList({ components }: { components: any[] }) {
  return (
    <div className="space-y-2">
      {components.slice(0, 8).map((component, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center justify-between p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{component.name}</p>
            <p className="text-xs text-neutral-500">
              {component.renderCount} renders
            </p>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <span className="font-mono text-sm whitespace-nowrap">
              {component.renderTime.toFixed(2)}ms
            </span>
            <StatusIcon status={component.status} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}