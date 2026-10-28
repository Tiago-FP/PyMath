import React from 'react';
import { Calculator, Sparkles, HelpCircle, Code2, TrendingUp, History } from 'lucide-react';

interface HeaderProps {
  activeTab: 'calculator' | 'graph' | 'ai' | 'history';
  onSelectTab: (tab: 'calculator' | 'graph' | 'ai' | 'history') => void;
  onOpenGuide: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenGuide,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-3">
        {/* Zone 1: Wordmark Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/20 text-white font-bold">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              PyMath <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Científica</span>
            </h1>
            <p className="hidden sm:block text-xs text-slate-400 font-sans">
              Calculadora Científica Educacional com Python & IA
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Views */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('calculator')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'calculator'
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span className="whitespace-nowrap">Calculadora & Python</span>
          </button>

          <button
            onClick={() => onSelectTab('graph')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'graph'
                ? 'bg-slate-800 text-purple-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="whitespace-nowrap">Gráficos 2D</span>
          </button>

          <button
            onClick={() => onSelectTab('ai')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'ai'
                ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="whitespace-nowrap">Assistente IA</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <History className="w-4 h-4 text-emerald-400" />
            <span className="whitespace-nowrap">Histórico</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Instruções e Guia de Uso"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline whitespace-nowrap">Guia de Uso</span>
          </button>
        </div>
      </div>
    </header>
  );
};
