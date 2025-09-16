// src/components/WeeklyChart.tsx
import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { WeeklyChartProps } from '../types'

/**
 * Props:
 *  - data: [{ label: 'Mon 9/15', hours: 1.5 }, ...] (last 7 days, oldest first)
 */
export default function WeeklyChart({ data = [] }: WeeklyChartProps) {
  // If no data, render a friendly placeholder
  if (!data || data.length === 0) {
    return <div style={{ padding: 12, color: '#666' }}>No data to show.</div>
  }

  // Simple tooltip formatter
  const tooltipFormatter = (value: any) => `${value} hrs`

  return (
    <div style={{
      width: '100%',
      height: 160,
      background: 'transparent',
      borderRadius: 10,
      padding: 8,
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <Tooltip 
            formatter={tooltipFormatter}
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 36, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#e6eef6'
            }}
          />
          <Bar dataKey="hours" barSize={24} radius={[6,6,0,0]} fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
