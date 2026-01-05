import React from 'react';
import { KPI, SalesTarget } from '../types';
import { DollarSign, Target, TrendingUp, ShoppingBag } from 'lucide-react';

interface KPICardsProps {
  kpi: KPI;
  target: SalesTarget;
}

const KPICards: React.FC<KPICardsProps> = ({ kpi, target }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const projectionColor = kpi.projection >= target.targetAmount ? 'text-emerald-600' : 'text-amber-600';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Revenue */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">Receita Total</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(kpi.totalRevenue)}</h3>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(kpi.percentToGoal, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-500 mt-2">{kpi.percentToGoal.toFixed(1)}% da meta</p>
      </div>

      {/* Projection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">Projeção Final do Mês</p>
            <h3 className={`text-2xl font-bold mt-1 ${projectionColor}`}>
              {formatCurrency(kpi.projection)}
            </h3>
          </div>
          <div className={`p-2 rounded-lg ${kpi.projection >= target.targetAmount ? 'bg-emerald-50' : 'bg-amber-50'}`}>
            <TrendingUp className={`w-5 h-5 ${kpi.projection >= target.targetAmount ? 'text-emerald-600' : 'text-amber-600'}`} />
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-4">
          Meta: <span className="font-semibold">{formatCurrency(target.targetAmount)}</span>
        </p>
      </div>

      {/* Deals */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">Negócios Fechados</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{kpi.dealsClosed}</h3>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-purple-600" />
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-4">
          Ticket Médio: <span className="font-semibold">{formatCurrency(kpi.averageTicket)}</span>
        </p>
      </div>

       {/* Gap */}
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">Falta para a Meta</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {target.targetAmount - kpi.totalRevenue > 0 
                  ? formatCurrency(target.targetAmount - kpi.totalRevenue) 
                  : 'R$ 0'}
            </h3>
          </div>
          <div className="p-2 bg-red-50 rounded-lg">
            <Target className="w-5 h-5 text-red-600" />
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-4">
          Ritmo Diário Necessário: <span className="font-semibold">
            {formatCurrency(Math.max(0, (target.targetAmount - kpi.totalRevenue) / Math.max(1, (target.daysInMonth - new Date().getDate()))))}
          </span>
        </p>
      </div>
    </div>
  );
};

export default KPICards;