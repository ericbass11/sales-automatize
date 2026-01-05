import React, { useState } from 'react';
import { SalesTarget, Product } from '../types';
import { X, Plus, Trash2, Save, MessageCircleWarning } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: SalesTarget;
  onUpdateTarget: (amount: number) => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onRemoveProduct: (id: string) => void;
  reps: string[];
  onAddRep: (name: string) => void;
  onRemoveRep: (name: string) => void;
  objections: string[];
  onAddObjection: (text: string) => void;
  onRemoveObjection: (text: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen, onClose, target, onUpdateTarget,
  products, onAddProduct, onRemoveProduct,
  reps, onAddRep, onRemoveRep,
  objections, onAddObjection, onRemoveObjection
}) => {
  const [activeTab, setActiveTab] = useState<'meta' | 'produtos' | 'time' | 'objecoes'>('meta');
  
  // Local states for inputs
  const [targetInput, setTargetInput] = useState(target.targetAmount.toString());
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newRepName, setNewRepName] = useState('');
  const [newObjection, setNewObjection] = useState('');

  if (!isOpen) return null;

  const handleSaveTarget = () => {
    onUpdateTarget(parseFloat(targetInput));
    alert('Meta atualizada com sucesso!');
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProductName && newProductPrice) {
      onAddProduct({
        id: Date.now().toString(),
        name: newProductName,
        defaultPrice: parseFloat(newProductPrice)
      });
      setNewProductName('');
      setNewProductPrice('');
    }
  };

  const handleAddRepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRepName) {
      onAddRep(newRepName);
      setNewRepName('');
    }
  };

  const handleAddObjectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newObjection) {
      onAddObjection(newObjection);
      setNewObjection('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">Configurações do Sistema</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('meta')}
            className={`flex-1 py-3 px-4 whitespace-nowrap text-sm font-medium transition-colors ${activeTab === 'meta' ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Metas
          </button>
          <button 
            onClick={() => setActiveTab('produtos')}
            className={`flex-1 py-3 px-4 whitespace-nowrap text-sm font-medium transition-colors ${activeTab === 'produtos' ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Produtos
          </button>
          <button 
            onClick={() => setActiveTab('time')}
            className={`flex-1 py-3 px-4 whitespace-nowrap text-sm font-medium transition-colors ${activeTab === 'time' ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Equipe
          </button>
          <button 
            onClick={() => setActiveTab('objecoes')}
            className={`flex-1 py-3 px-4 whitespace-nowrap text-sm font-medium transition-colors ${activeTab === 'objecoes' ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Objeções
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          
          {/* META TAB */}
          {activeTab === 'meta' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <label className="block text-sm font-medium text-slate-700 mb-2">Meta Mensal (R$)</label>
                <div className="flex gap-4">
                  <input 
                    type="number" 
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900"
                  />
                  <button 
                    onClick={handleSaveTarget}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Salvar
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Isso atualizará os gráficos e os cálculos de projeção imediatamente.</p>
              </div>
            </div>
          )}

          {/* PRODUTOS TAB */}
          {activeTab === 'produtos' && (
            <div className="space-y-6">
               <form onSubmit={handleAddProductSubmit} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Nome do Produto</label>
                    <input 
                      required
                      placeholder="Ex: Consultoria Premium"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500 bg-white text-slate-900"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Preço (R$)</label>
                    <input 
                      required
                      type="number"
                      placeholder="0.00"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500 bg-white text-slate-900"
                    />
                  </div>
                  <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
                    <Plus className="w-5 h-5" />
                  </button>
               </form>

               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                     <tr>
                       <th className="p-3">Produto</th>
                       <th className="p-3">Preço Padrão</th>
                       <th className="p-3 text-right">Ação</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {products.map(p => (
                       <tr key={p.id} className="group hover:bg-slate-50">
                         <td className="p-3 text-slate-700 font-medium">{p.name}</td>
                         <td className="p-3 text-slate-600">R$ {p.defaultPrice.toLocaleString('pt-BR')}</td>
                         <td className="p-3 text-right">
                           <button 
                            onClick={() => onRemoveProduct(p.id)}
                            className="text-slate-400 hover:text-red-500 p-1"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </td>
                       </tr>
                     ))}
                     {products.length === 0 && (
                       <tr><td colSpan={3} className="p-4 text-center text-slate-400">Nenhum produto cadastrado.</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* TIME TAB */}
          {activeTab === 'time' && (
            <div className="space-y-6">
              <form onSubmit={handleAddRepSubmit} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Nome do Representante</label>
                    <input 
                      required
                      placeholder="Ex: João Silva"
                      value={newRepName}
                      onChange={(e) => setNewRepName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500 bg-white text-slate-900"
                    />
                  </div>
                  <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
                    <Plus className="w-5 h-5" />
                  </button>
               </form>

               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 <ul className="divide-y divide-slate-100">
                   {reps.map(rep => (
                     <li key={rep} className="p-3 flex justify-between items-center group hover:bg-slate-50">
                       <span className="text-slate-700 font-medium">{rep}</span>
                       <button 
                          onClick={() => onRemoveRep(rep)}
                          className="text-slate-400 hover:text-red-500 p-1"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>
                     </li>
                   ))}
                   {reps.length === 0 && (
                     <li className="p-4 text-center text-slate-400">Nenhum representante cadastrado.</li>
                   )}
                 </ul>
               </div>
            </div>
          )}

           {/* OBJECTIONS TAB */}
           {activeTab === 'objecoes' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                 <MessageCircleWarning className="w-6 h-6 text-blue-600 flex-shrink-0" />
                 <p className="text-sm text-blue-800">
                   Cadastre aqui as principais barreiras que seu time encontra. A IA usará essas informações para sugerir scripts de vendas e contornos de objeções na análise.
                 </p>
              </div>

              <form onSubmit={handleAddObjectionSubmit} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Nova Objeção</label>
                    <input 
                      required
                      placeholder="Ex: Preço muito acima da concorrência"
                      value={newObjection}
                      onChange={(e) => setNewObjection(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-indigo-500 bg-white text-slate-900"
                    />
                  </div>
                  <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
                    <Plus className="w-5 h-5" />
                  </button>
               </form>

               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 <ul className="divide-y divide-slate-100">
                   {objections.map((obj, index) => (
                     <li key={index} className="p-3 flex justify-between items-center group hover:bg-slate-50">
                       <span className="text-slate-700 font-medium">{obj}</span>
                       <button 
                          onClick={() => onRemoveObjection(obj)}
                          className="text-slate-400 hover:text-red-500 p-1"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>
                     </li>
                   ))}
                   {objections.length === 0 && (
                     <li className="p-4 text-center text-slate-400">Nenhuma objeção cadastrada.</li>
                   )}
                 </ul>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;