'use client';

import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { getStatusColor } from '@/app/utils/thresholds';

interface ComponentTreeProps {
  data: any[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded shadow-lg border">
        <p className="font-semibold">{data.name}</p>
        <p className="text-sm">Actual: {data.actualDuration?.toFixed(2)} ms</p>
        <p className="text-sm">Self: {data.selfDuration?.toFixed(2)} ms</p>
        <p className="text-sm">Status: {data.status}</p>
      </div>
    );
  }
  return null;
};

const CustomContent = (props: any) => {
  const { x, y, width, height, name, actualDuration, status } = props;
  
  if (width < 50 || height < 30) return null;
  
  const fillColor = getStatusColor(status || 'good');
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: fillColor,
          stroke: '#fff',
          strokeWidth: 2,
          strokeOpacity: 1,
          fillOpacity: 0.8,
        }}
      />
      {width > 70 && height > 40 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight="bold"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 8}
            textAnchor="middle"
            fill="#fff"
            fontSize={10}
          >
            {actualDuration?.toFixed(1)} ms
          </text>
        </>
      )}
    </g>
  );
};

export function ComponentTree({ data }: ComponentTreeProps) {
  const flattenedData = data.flatMap(root => 
    root.children && root.children.length > 0 ? root.children : []
  );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <Treemap
          data={flattenedData}
          dataKey="actualDuration"
          aspectRatio={4 / 3}
          stroke="#fff"
          content={<CustomContent />}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
  );
}