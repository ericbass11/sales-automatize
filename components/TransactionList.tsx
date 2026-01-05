import React from 'react';
import { Sale } from '../types';
import { User, Package, Calendar } from 'lucide-react';

interface TransactionListProps {
  sales: Sale[];
}

const TransactionList: React.FC<TransactionListProps> = ({ sales }) => {
  // Sort by date descending
  const sortedSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Helper to format date to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[400px]">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-semibold text-slate-800">Transações Recentes</h3>
      </div>
      <div className="overflow-y-auto flex-1 p-2">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              <th className="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Detalhes</th>
              <th className="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
              <th className="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800 flex items-center gap-2">
                       <User className="w-3 h-3 text-slate-400" /> {sale.customer}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <Package className="w-3 h-3" /> {sale.product} • {sale.representative}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400"/>
                        {formatDate(sale.date)}
                    </div>
                </td>
                <td className="p-3 text-right font-medium text-emerald-600">
                  +{sale.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
              </tr>
            ))}
            {sales.length === 0 && (
                <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500">Nenhuma venda registrada ainda.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;