// components/ui/charts.tsx
"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  data: ChartData<any>;
  height?: number;
  options?: ChartOptions<any>;
}

// Bar Chart Component
export function BarChart({ data, height = 300, options = {} }: ChartProps) {
  const defaultOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    ...options,
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Bar data={data} options={defaultOptions} />
    </div>
  );
}

// Line Chart Component
export function LineChart({ data, height = 300, options = {} }: ChartProps) {
  const defaultOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    ...options,
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Line data={data} options={defaultOptions} />
    </div>
  );
}

// Pie Chart Component
export function PieChart({ data, height = 300, options = {} }: ChartProps) {
  const defaultOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
    ...options,
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Pie data={data} options={defaultOptions} />
    </div>
  );
}