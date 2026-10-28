import React, { useState } from 'react';
import { AiSolution } from '../types';
import { Sparkles, Send, Loader2, ArrowRight, Code2, AlertCircle, Check, Copy } from 'lucide-react';

interface AiAssistantProps {
  onLoadExpressionToCalculator: (expr: string) => void;
  onLoadCodeToPythonPanel: (code: string) => void;
}

const SAMPLE_PROMPTS = [
  'Qual a hipotenusa de um triângulo com catetos 3 e 4?',
  'Resolva a equação 2x + 10 = 20',
  'Qual a área de um círculo com raio 5?',
  'Calcule o juro composto de R$ 1000 a 10% por 3 anos',
  'Qual a derivada de x^3 + 4x no ponto x=2?',
];

export const AiAssistant: React.FC<AiAssistantProps> = ({
  onLoadExpressionToCalculator,
  onLoadCodeToPythonPanel,
}) => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [solution, setSolution] = useState<AiSolution | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSubmit = async (userPrompt?: string) => {
    const textToSearch = userPrompt || query;
    if (!textToSearch.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: textToSearch.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao processar resposta do assistente');
      }

      const newSolution: AiSolution = {
        query: textToSearch.trim(),
        expression: data.expression,
        result: data.result,
        summary: data.summary,
        steps: data.steps,
        pythonCode: data.pythonCode,
        pythonExplanation: data.pythonExplanation,
      };

      setSolution(newSolution);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erro ao conectar ao assistente de IA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPython = () => {
    if (!solution?.pythonCode) return;
    navigator.clipboard.writeText(solution.pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl shadow-black/40 p-4 sm:p-5 w-full">
      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            Assistente Matemático com IA
          </h2>
          <p className="text-xs text-slate-400">
            Pergunte em linguagem natural para receber passos didáticos e código Python
          </p>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 text-xs">
        <span className="text-slate-400 font-semibold shrink-0">Sugestões:</span>
        {SAMPLE_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => {
              setQuery(p);
              handleSubmit(p);
            }}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-md bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800 shrink-0 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex items-center gap-2 mb-4"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: Qual a hipotenusa de catetos 3 e 4? Ou resolva 2x + 10 = 20..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50 shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <div className="flex items-center gap-1.5">
              <span>Perguntar</span>
              <Send className="w-3.5 h-3.5" />
            </div>
          )}
        </button>
      </form>

      {/* Error state */}
      {errorMessage && (
        <div className="p-3 mb-4 rounded-xl bg-rose-950/40 border border-rose-800/50 flex items-start gap-2 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Solution Display */}
      {solution ? (
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[460px] pr-1">
          {/* Summary and Result Box */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-400">Resposta da IA</span>
              {solution.expression && (
                <button
                  onClick={() => onLoadExpressionToCalculator(solution.expression)}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  <span>Enviar para Calculadora</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <p className="text-sm text-slate-200 mb-2 font-medium">{solution.summary}</p>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-xs">
              <span className="text-slate-400">Expressão:</span>
              <span className="text-cyan-300 font-bold">{solution.expression || 'N/A'}</span>
              <span className="text-slate-500">=</span>
              <span className="text-emerald-300 font-bold">{solution.result}</span>
            </div>
          </div>

          {/* Step-by-Step Mathematical Reasoning */}
          {solution.steps && solution.steps.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <span>Raciocínio Passo a Passo:</span>
              </h4>
              <ol className="space-y-2 text-xs text-slate-300 leading-relaxed">
                {solution.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-cyan-400 text-[11px] font-mono shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Python Code Block */}
          {solution.pythonCode && (
            <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-mono text-slate-300">
                  <Code2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Código Python Gerado</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onLoadCodeToPythonPanel(solution.pythonCode)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Abrir no Editor Python
                  </button>
                  <button
                    onClick={handleCopyPython}
                    className="p-1 hover:text-slate-200 text-slate-400"
                    title="Copiar código Python"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <pre className="p-3 font-mono text-xs text-amber-200/90 overflow-x-auto leading-relaxed max-h-[160px]">
                <code>{solution.pythonCode}</code>
              </pre>

              {solution.pythonExplanation && (
                <div className="p-2.5 bg-slate-950/70 border-t border-slate-800 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Explicação: </span>
                  {solution.pythonExplanation}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center text-xs text-slate-500">
          <Sparkles className="w-6 h-6 mx-auto mb-2 text-slate-600" />
          <p>Faça uma pergunta acima ou clique em uma das sugestões para ver o passo a passo com IA e código Python.</p>
        </div>
      )}
    </div>
  );
};
