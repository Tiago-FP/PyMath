import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { History, Trash2, ArrowUpRight, Copy, Check } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelectExpression: (expr: string) => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelectExpression,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl shadow-black/40 p-4 sm:p-5 w-full h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Histórico de Operações
            </h2>
            <p className="text-xs text-slate-400">
              {history.length} {history.length === 1 ? 'cálculo gravado' : 'cálculos gravados'}
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
            title="Limpar todo o histórico"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpar</span>
          </button>
        )}
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
            <History className="w-8 h-8 mb-2 text-slate-600 stroke-[1.5]" />
            <p>Nenhuma operação realizada nesta sessão ainda.</p>
            <p className="text-slate-600 mt-1">
              Faça contas na calculadora ou pergunte à IA para gravar o histórico.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="group p-3 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono">{formatTime(item.timestamp)}</span>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={() => handleCopy(item.id, `${item.expression} = ${item.result}`)}
                    className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Copiar conta"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={() => onSelectExpression(item.expression)}
                    className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] transition-colors"
                    title="Carregar de volta na calculadora"
                  >
                    <span>Carregar</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Expression and Result */}
              <div className="flex flex-col">
                <div className="font-mono text-xs text-slate-400 truncate">
                  {item.expression}
                </div>
                <div className="font-mono text-base font-semibold text-white tabular-nums flex items-center justify-between">
                  <span className="text-cyan-400 text-xs mr-2">=</span>
                  <span className="truncate">{item.result}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
