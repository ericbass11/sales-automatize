import React, { useState, useMemo } from 'react';
import { Sale, SalesTarget, KPI, Product } from './types';
import KPICards from './components/KPICards';
import SalesChart from './components/SalesChart';
import AICoach from './components/AICoach';
import TransactionList from './components/TransactionList';
import SettingsModal from './components/SettingsModal';
import { LayoutDashboard, PlusCircle, Settings, X } from 'lucide-react';

// INITIAL DATA (Can be overwritten in Settings)
const INITIAL_TARGET: SalesTarget = {
  month: '2023-10',
  targetAmount: 150000,
  daysInMonth: 31,
  workingDays: 22
};

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Licença Enterprise', defaultPrice: 5000 },
  { id: '2', name: 'Plano Inicial', defaultPrice: 1200 },
  { id: '3', name: 'Horas de Consultoria', defaultPrice: 350 },
  { id: '4', name: 'Adicional Pro', defaultPrice: 800 },
];

const INITIAL_REPS = ['Alice M.', 'Bob D.', 'Carlos K.', 'Diana P.'];

const INITIAL_OBJECTIONS = [
  "Preço muito elevado comparado ao concorrente",
  "Cliente precisa aprovar budget com diretoria",
  "Falta de tempo para implementação agora"
];

const generateMockSales = (products: Product[], reps: string[]): Sale[] => {
  const sales: Sale[] = [];
  
  // Generate some realistic looking data for the first 15 days
  for (let i = 1; i <= 15; i++) {
    const dailyCount = Math.floor(Math.random() * 3); // 0 to 2 sales a day
    for (let j = 0; j < dailyCount; j++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      sales.push({
        id: `sale-${i}-${j}`,
        date: `2023-10-${i.toString().padStart(2, '0')}`,
        // Variate price slightly from default to simulate discounts/custom deals
        amount: Math.floor(randomProduct.defaultPrice * (0.9 + Math.random() * 0.2)), 
        customer: `Cliente ${Math.random().toString(36).substring(7).toUpperCase()}`,
        representative: reps[Math.floor(Math.random() * reps.length)],
        product: randomProduct.name,
        status: 'Closed'
      });
    }
  }
  return sales;
};

function App() {
  // State for configuration
  const [target, setTarget] = useState<SalesTarget>(INITIAL_TARGET);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reps, setReps] = useState<string[]>(INITIAL_REPS);
  const [objections, setObjections] = useState<string[]>(INITIAL_OBJECTIONS);
  
  // Initialize mock sales based on initial config
  const [sales, setSales] = useState<Sale[]>(() => generateMockSales(INITIAL_PRODUCTS, INITIAL_REPS));
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // New Sale Form State
  const [newSaleAmount, setNewSaleAmount] = useState('');
  const [newSaleCustomer, setNewSaleCustomer] = useState('');
  const [newSaleProduct, setNewSaleProduct] = useState(''); // Stores Product Name
  const [newSaleRep, setNewSaleRep] = useState('');

  // Calculate KPIs
  const kpi: KPI = useMemo(() => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const dealsClosed = sales.length;
    const averageTicket = dealsClosed > 0 ? Math.round(totalRevenue / dealsClosed) : 0;
    
    const today = new Date().getDate(); 
    const simDay = 15; // Mock simulation day
    const dailyPace = totalRevenue / simDay;
    const projection = Math.round(dailyPace * target.daysInMonth);
    const percentToGoal = (totalRevenue / target.targetAmount) * 100;

    return {
      totalRevenue,
      dealsClosed,
      averageTicket,
      projection,
      percentToGoal
    };
  }, [sales, target]);

  // Handlers for Settings
  const handleUpdateTarget = (amount: number) => {
    setTarget(prev => ({ ...prev, targetAmount: amount }));
  };

  const handleAddProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleAddRep = (name: string) => {
    setReps(prev => [...prev, name]);
  };

  const handleRemoveRep = (name: string) => {
    setReps(prev => prev.filter(r => r !== name));
  };

  const handleAddObjection = (text: string) => {
    setObjections(prev => [...prev, text]);
  };

  const handleRemoveObjection = (text: string) => {
    setObjections(prev => prev.filter(o => o !== text));
  };

  // Handlers for New Sale
  const handleProductSelect = (productName: string) => {
    setNewSaleProduct(productName);
    // Find default price and auto-fill
    const prod = products.find(p => p.name === productName);
    if (prod) {
      setNewSaleAmount(prod.defaultPrice.toString());
    }
  };

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSaleAmount || !newSaleCustomer || !newSaleProduct || !newSaleRep) return;

    const newSale: Sale = {
      id: `new-${Date.now()}`,
      date: `2023-10-16`, // Simulating "today"
      amount: parseFloat(newSaleAmount),
      customer: newSaleCustomer,
      representative: newSaleRep,
      product: newSaleProduct,
      status: 'Closed'
    };

    setSales([...sales, newSale]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewSaleAmount('');
    setNewSaleCustomer('');
    setNewSaleProduct('');
    setNewSaleRep('');
  };

  const openAddModal = () => {
    // Set defaults if lists are not empty
    if (products.length > 0) handleProductSelect(products[0].name);
    if (reps.length > 0) setNewSaleRep(reps[0]);
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-10">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
              SalesPulse AI
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:block text-right">
                <p className="text-xs text-slate-400">Meta Atual</p>
                <p className="font-bold text-slate-700">{target.targetAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
             </div>
             <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                title="Configurações"
             >
                <Settings className="w-5 h-5" />
             </button>
            <button 
              onClick={openAddModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Registrar Venda</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* KPI Section */}
        <section>
          <KPICards kpi={kpi} target={target} />
        </section>

        {/* Charts & AI Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <SalesChart sales={sales} target={target} />
            <TransactionList sales={sales} />
          </div>
          <div className="lg:col-span-1 h-full min-h-[500px]">
            <AICoach sales={sales} target={target} kpi={kpi} objections={objections} />
          </div>
        </section>
      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        target={target}
        onUpdateTarget={handleUpdateTarget}
        products={products}
        onAddProduct={handleAddProduct}
        onRemoveProduct={handleRemoveProduct}
        reps={reps}
        onAddRep={handleAddRep}
        onRemoveRep={handleRemoveRep}
        objections={objections}
        onAddObjection={handleAddObjection}
        onRemoveObjection={handleRemoveObjection}
      />

      {/* Add Sale Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Registrar Nova Venda</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSale} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Cliente</label>
                <input 
                  type="text" 
                  required
                  value={newSaleCustomer}
                  onChange={(e) => setNewSaleCustomer(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                  placeholder="ex: Empresa Acme"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Produto</label>
                    <select 
                        value={newSaleProduct}
                        onChange={(e) => handleProductSelect(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-slate-900"
                    >
                        {products.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                    <input 
                    type="number" 
                    required
                    min="0"
                    value={newSaleAmount}
                    onChange={(e) => setNewSaleAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white text-slate-900"
                    placeholder="0.00"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Representante</label>
                 <select 
                        value={newSaleRep}
                        onChange={(e) => setNewSaleRep(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-slate-900"
                    >
                        {reps.map(rep => (
                          <option key={rep} value={rep}>{rep}</option>
                        ))}
                    </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors bg-white"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Salvar Transação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;