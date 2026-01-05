import { GoogleGenAI, Type } from "@google/genai";
import { Sale, SalesTarget, KPI } from "../types";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeSalesPerformance = async (
  sales: Sale[],
  target: SalesTarget,
  kpi: KPI,
  objections: string[]
): Promise<string> => {
  const ai = getGeminiClient();
  if (!ai) return "Erro: Chave de API não configurada.";

  // Simplify data for the prompt to save tokens and focus on trends
  const salesSummary = sales.map(s => ({
    date: s.date,
    amount: s.amount,
    rep: s.representative,
    product: s.product
  }));

  const objectionsList = objections.length > 0 
    ? objections.map(o => `- ${o}`).join('\n') 
    : "Nenhuma objeção específica registrada.";

  const prompt = `
    Você é um experiente Diretor Comercial e Analista Financeiro.
    Analise os seguintes dados de vendas para o mês atual (${target.month}).
    
    Data Atual: ${new Date().toISOString().split('T')[0]}
    
    **Metas:**
    - Objetivo: R$${target.targetAmount}
    - Dias no Mês: ${target.daysInMonth}
    
    **Desempenho Atual (KPIs):**
    - Receita Total até agora: R$${kpi.totalRevenue}
    - Negócios Fechados: ${kpi.dealsClosed}
    - Ticket Médio: R$${kpi.averageTicket}
    - Projeção Atual (Linear): R$${kpi.projection}
    - % da Meta: ${kpi.percentToGoal.toFixed(1)}%
    
    **Principais Objeções Relatadas pelo Time:**
    ${objectionsList}

    **Transações Detalhadas (Recentes):**
    ${JSON.stringify(salesSummary.slice(-20))} 
    
    **Instruções:**
    1. Forneça uma breve avaliação do ritmo atual. Estamos no caminho certo?
    2. Identifique padrões nos dados de vendas.
    3. **CRÍTICO:** Com base nas objeções listadas acima, forneça argumentos ou scripts de contorno específicos para ajudar o time a fechar mais vendas.
    4. Dê 3 recomendações estratégicas acionáveis para atingir a meta.
    
    Formate a saída em Markdown limpo. Use negrito para ênfase. Seja encorajador, mas realista e analítico. Responda inteiramente em Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 } // Use a bit of thinking for better analysis
      }
    });
    
    return response.text || "Nenhuma análise gerada.";
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return "Falha ao gerar análise. Verifique sua conexão ou chave de API.";
  }
};

export const suggestMessageToTeam = async (kpi: KPI): Promise<string> => {
    const ai = getGeminiClient();
    if (!ai) return "";

    const prompt = `Escreva uma mensagem curta e motivacional para o Slack/Teams para a equipe de vendas com base neste status: Estamos em ${kpi.percentToGoal.toFixed(1)}% da nossa meta com receita de R$${kpi.totalRevenue}. Mantenha profissional mas com alta energia. Máximo de 50 palavras. Responda em Português do Brasil.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });
        return response.text || "";
    } catch (e) {
        return "";
    }
}