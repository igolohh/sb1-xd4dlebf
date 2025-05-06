import React from 'react';
import { WorkEntry } from '../contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyStatsProps {
  entries: WorkEntry[];
}

interface EmployeeStats {
  name: string;
  total: number;
  approved: number;
  rejected: number;
  pending: number;
}

const MonthlyStats: React.FC<MonthlyStatsProps> = ({ entries }) => {
  // Group entries by employee
  const employeeStats = entries.reduce<Record<string, EmployeeStats>>((acc, entry) => {
    const name = entry.pegawai;
    
    if (!acc[name]) {
      acc[name] = {
        name,
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0
      };
    }
    
    acc[name].total += 1;
    
    switch (entry.status) {
      case 'disetujui':
        acc[name].approved += 1;
        break;
      case 'ditolak':
        acc[name].rejected += 1;
        break;
      case 'tertunda':
        acc[name].pending += 1;
        break;
    }
    
    return acc;
  }, {});

  const chartData = Object.values(employeeStats);

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, Math.max(...chartData.map(item => item.total))]} allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="approved" 
            name="Disetujui" 
            fill="#22c55e"
          />
          <Bar 
            dataKey="pending" 
            name="Tertunda" 
            fill="#eab308"
          />
          <Bar 
            dataKey="rejected" 
            name="Ditolak" 
            fill="#ef4444"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyStats;