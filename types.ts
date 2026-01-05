export interface Sale {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  amount: number;
  customer: string;
  representative: string;
  product: string;
  status: 'Closed' | 'Pending' | 'Canceled';
}

export interface SalesTarget {
  month: string; // YYYY-MM
  targetAmount: number;
  daysInMonth: number;
  workingDays: number;
}

export interface KPI {
  totalRevenue: number;
  dealsClosed: number;
  averageTicket: number;
  projection: number;
  percentToGoal: number;
}

export interface Product {
  id: string;
  name: string;
  defaultPrice: number;
}

export interface AIAnalysisResult {
  analysis: string;
  recommendedActions: string[];
}
