import React, { useState } from 'react';
import { Bot, Sparkles, RefreshCw, MessageSquareQuote } from 'lucide-react';
import { Sale, SalesTarget, KPI } from '../types';
import { analyzeSalesPerformance, suggestMessageToTeam } from '../services/geminiService';
import ReactMarkdown from 'react-markdown'; 

interface AICoachProps {
  sales: Sale[];
  target: SalesTarget;
  kpi: KPI;
  objections: string[];
}

const AICoach: React.FC<AICoachProps> = ({ sales, target, kpi, objections }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [teamMessage, setTeamMessage] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeSalesPerformance(sales, target, kpi, objections);
    setAnalysis(result);
    
    const msg = await suggestMessageToTeam(kpi);
    setTeamMessage(msg);

    setLoading(false);
  };

  // Simple renderer to replace **text** with bold without external library
  const renderMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-md shadow-indigo-200">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
             <h2 className="text-xl font-bold text-slate-800">Consultor SalesPulse AI</h2>
             <p className="text-xs text-slate-500">Desenvolvido com Gemini 3 Flash</p>
          </div>
        </div>
        
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            loading 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'
          }`}
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {loading ? 'Analisando...' : 'Gerar Estratégia'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {!analysis ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-indigo-100 rounded-xl">
            <Bot className="w-12 h-12 text-indigo-200 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">Pronto para Otimizar?</h3>
            <p className="text-slate-500 max-w-sm mt-2">
              Clique no botão acima para permitir que a IA analise suas tendências de vendas, considere as objeções cadastradas e sugira estratégias acionáveis para atingir sua meta.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
             {/* Motivation Snippet */}
             {teamMessage && (
                <div className="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                    <div className="flex items-center gap-2 text-indigo-600 mb-2 font-semibold text-sm uppercase tracking-wider">
                        <MessageSquareQuote className="w-4 h-4" />
                        <span>Mensagem Motivacional</span>
                    </div>
                    <p className="text-slate-700 italic">"{teamMessage}"</p>
                </div>
             )}

            <div className="prose prose-slate prose-sm max-w-none">
              {analysis.split('\n').map((line, i) => (
                <div key={i} className={`mb-2 ${line.startsWith('#') ? 'font-bold text-lg text-indigo-900 mt-4' : 'text-slate-700'}`}>
                  {renderMarkdown(line)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoach;