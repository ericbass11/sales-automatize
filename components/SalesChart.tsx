import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { Sale, SalesTarget } from '../types';

interface SalesChartProps {
  sales: Sale[];
  target: SalesTarget;
}

const SalesChart: React.FC<SalesChartProps> = ({ sales, target }) => {
  // Process data for the chart
  const data = React.useMemo(() => {
    const days = Array.from({ length: target.daysInMonth }, (_, i) => i + 1);
    let cumulative = 0;
    
    // Create map of sales by day
    const salesByDay: Record<number, number> = {};
    sales.forEach(sale => {
      const day = parseInt(sale.date.split('-')[2], 10);
      salesByDay[day] = (salesByDay[day] || 0) + sale.amount;
    });

    const currentDay = new Date().getDate();

    return days.map(day => {
      // Add daily sales to cumulative
      if (day <= currentDay) {
        cumulative += (salesByDay[day] || 0);
      }
      
      // Calculate linear target pacing
      const targetPace = (target.targetAmount / target.daysInMonth) * day;

      return {
        day: `Dia ${day}`,
        actual: day <= currentDay ? cumulative : null,
        targetPace: Math.round(targetPace),
        projected: day > currentDay ? null : null // Could add advanced projection curve here
      };
    });
  }, [sales, target]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[400px]">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Projeção de Receita vs Meta</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="day" tick={{fontSize: 12}} interval={4} />
          <YAxis tickFormatter={(val) => `R$${val/1000}k`} tick={{fontSize: 12}} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="targetPace" 
            stroke="#94a3b8" 
            strokeDasharray="5 5" 
            fill="url(#colorTarget)" 
            name="Ritmo da Meta"
          />
          <Area 
            type="monotone" 
            dataKey="actual" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            fill="url(#colorActual)" 
            name="Receita Real" 
            activeDot={{ r: 6 }}
          />
          <ReferenceLine y={target.targetAmount} label="Meta" stroke="green" strokeDasharray="3 3" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;