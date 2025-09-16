// src/components/TaskPieChart.tsx
import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { TaskPieChartProps } from '../types'

/**
 * Props:
 *  - data: [{ name: 'Linear Algebra', value: 3.5 }, ...]  (hours per task)
 */
export default function TaskPieChart({ data = [] }: TaskPieChartProps) {
  if (!data || data.length === 0) {
    return <div style={{ padding: 12, color: '#666' }}>No task data to show.</div>
  }

  // pick some nice distinct colors
  const COLORS = [
    '#10b981', '#3b82f6', '#f59e0b',
    '#ef4444', '#8b5cf6', '#06b6d4',
    '#84cc16', '#f43f5e', '#6366f1'
  ]

  return (
    <div style={{
      width: '100%',
      height: 220,
      background: 'transparent',
      borderRadius: 10,
      padding: 8,
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label={({ value }) => `${value}h`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `${value} hrs`}
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 36, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#e6eef6'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
