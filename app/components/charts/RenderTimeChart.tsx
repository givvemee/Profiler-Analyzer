'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { RENDER_TIME_THRESHOLDS } from '@/app/utils/thresholds';

interface RenderTimeChartProps {
  data: any[];
  type?: 'line' | 'bar';
}

export function RenderTimeChart({ data, type = 'line' }: RenderTimeChartProps) {
  const Chart = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? Line : Bar;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <Chart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="commitIndex" 
            label={{ value: 'Commit', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            label={{ value: 'Duration (ms)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: any) => `${value.toFixed(2)} ms`}
            labelFormatter={(label) => `Commit #${label}`}
          />
          <Legend />
          
          <ReferenceLine 
            y={RENDER_TIME_THRESHOLDS.good} 
            stroke="#22c55e" 
            strokeDasharray="5 5"
            label={{ value: "Good", position: "right" }}
          />
          <ReferenceLine 
            y={RENDER_TIME_THRESHOLDS.warning} 
            stroke="#eab308" 
            strokeDasharray="5 5"
            label={{ value: "Warning", position: "right" }}
          />
          <ReferenceLine 
            y={RENDER_TIME_THRESHOLDS.critical} 
            stroke="#ef4444" 
            strokeDasharray="5 5"
            label={{ value: "Critical", position: "right" }}
          />
          
          <DataComponent
            type="monotone"
            dataKey="renderDuration"
            stroke="#3b82f6"
            fill="#3b82f6"
            name="Render Duration"
            strokeWidth={2}
          />
          <DataComponent
            type="monotone"
            dataKey="effectDuration"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            name="Effect Duration"
            strokeWidth={2}
          />
          <DataComponent
            type="monotone"
            dataKey="passiveEffectDuration"
            stroke="#10b981"
            fill="#10b981"
            name="Passive Effect"
            strokeWidth={2}
          />
        </Chart>
      </ResponsiveContainer>
  );
}