import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CategoryTrendsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-60 border rounded-md flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No category trend data available</p>
      </div>
    );
  }

  // Extract all categories from the first data point (excluding 'date')
  const categories = Object.keys(data[0]).filter(key => key !== 'date');
  
  // Generate colors for each category
  const colors = [
    '#8884d8', // purple
    '#82ca9d', // green
    '#ffc658', // yellow
    '#ff8042', // orange
    '#0088fe', // blue
    '#00C49F', // teal
    '#FFBB28', // amber
    '#FF8042', // coral
  ];

  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [value, name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())]}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString();
            }}
          />
          <Legend formatter={(value) => value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} />
          {categories.map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              name={category}
              stroke={colors[index % colors.length]}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryTrendsChart;