'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface RenderPhasesProps {
  data: any[];
}

export function RenderPhases({ data }: RenderPhasesProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="commit" />
          <YAxis label={{ value: 'Duration (ms)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value: any) => `${value.toFixed(2)} ms`} />
          <Legend />
          <Bar dataKey="render" stackId="a" fill="#3b82f6" name="Render Phase" />
          <Bar dataKey="effect" stackId="a" fill="#8b5cf6" name="Effect Phase" />
          <Bar dataKey="passiveEffect" stackId="a" fill="#10b981" name="Passive Effect" />
        </BarChart>
      </ResponsiveContainer>
  );
}