import React, { useState, useEffect, useCallback } from 'react';
import { AngleMode, HistoryItem } from '../types';
import { evaluateExpression } from '../services/mathEngine';
import { RotateCcw, Delete, Equal, Sparkles, Check, Copy } from 'lucide-react';

interface ScientificCalculatorProps {
  onCalculated: (item: HistoryItem) => void;
  onActiveExpressionChange: (expr: string, angleMode: AngleMode, lastOperationKey?: string) => void;
  initialExpression?: string;
  onSendToAI?: (expr: string) => void;
}

export const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({
  onCalculated,
  onActiveExpressionChange,
  initialExpression,
  onSendToAI,
}) => {
  const [expression, setExpression] = useState<string>('');
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [isSecondMode, setIsSecondMode] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(0);
  const [hasMemory, setHasMemory] = useState<boolean>(false);
  const [lastCalculated, setLastCalculated] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const lastSyncedInitialRef = React.useRef<string | undefined>(undefined);

  // Sync initial expression if passed from history or AI
  useEffect(() => {
    if (initialExpression !== undefined && initialExpression !== lastSyncedInitialRef.current) {
      lastSyncedInitialRef.current = initialExpression;
      setExpression(initialExpression);
      setDisplayValue(initialExpression || '0');
      setLastCalculated(false);
    }
  }, [initialExpression]);

  // Insert character or function into expression
  const appendToken = useCallback(
    (token: string, keyId?: string) => {
      let next: string;
      if (lastCalculated && !['+', '-', '×', '÷', '^', '%'].includes(token)) {
        next = token;
      } else {
        next = expression + token;
      }
      setExpression(next);
      setDisplayValue(next);
      setLastCalculated(false);
      onActiveExpressionChange(next, angleMode, keyId);
    },
    [expression, lastCalculated, angleMode, onActiveExpressionChange]
  );

  // Backspace
  const handleBackspace = useCallback(() => {
    if (!expression) return;
    const match = expression.match(/(sin|cos|tan|asin|acos|atan|sqrt|cbrt|log10|log|ln|exp|abs)\($/);
    const next = match ? expression.slice(0, -match[0].length) : expression.slice(0, -1);
    setExpression(next);
    setDisplayValue(next || '0');
    setLastCalculated(false);
    onActiveExpressionChange(next, angleMode);
  }, [expression, angleMode, onActiveExpressionChange]);

  // Clear
  const handleClear = useCallback(() => {
    setExpression('');
    setDisplayValue('0');
    setLastCalculated(false);
    onActiveExpressionChange('', angleMode);
  }, [angleMode, onActiveExpressionChange]);

  // Evaluate
  const handleEvaluate = useCallback(() => {
    if (!expression.trim()) return;

    const calc = evaluateExpression(expression, angleMode);

    if (calc.success) {
      setDisplayValue(calc.result);
      setLastCalculated(true);

      const newItem: HistoryItem = {
        id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        timestamp: Date.now(),
        expression,
        result: calc.result,
        pythonCode: calc.pythonCode,
        explanation: calc.explanation,
        source: 'calculator',
      };

      onCalculated(newItem);
      onActiveExpressionChange(expression, angleMode);
    } else {
      setDisplayValue('Erro: ' + (calc.error || 'Inválido'));
      setLastCalculated(true);
    }
  }, [expression, angleMode, onCalculated, onActiveExpressionChange]);

  // Memory functions
  const handleMemoryAdd = () => {
    const val = parseFloat(displayValue);
    if (!isNaN(val)) {
      const next = memory + val;
      setMemory(next);
      setHasMemory(true);
    }
  };

  const handleMemorySub = () => {
    const val = parseFloat(displayValue);
    if (!isNaN(val)) {
      const next = memory - val;
      setMemory(next);
      setHasMemory(true);
    }
  };

  const handleMemoryRecall = () => {
    appendToken(String(memory));
  };

  const handleMemoryClear = () => {
    setMemory(0);
    setHasMemory(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a textarea or input outside
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        appendToken(e.key);
      } else if (e.key === '.') {
        appendToken('.');
      } else if (e.key === '+') {
        appendToken('+');
      } else if (e.key === '-') {
        appendToken('-');
      } else if (e.key === '*') {
        appendToken('×');
      } else if (e.key === '/') {
        e.preventDefault();
        appendToken('÷');
      } else if (e.key === '^') {
        appendToken('^');
      } else if (e.key === '(' || e.key === ')') {
        appendToken(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEvaluate();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appendToken, handleEvaluate, handleBackspace, handleClear]);

  const copyDisplay = () => {
    navigator.clipboard.writeText(displayValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl shadow-black/40 p-4 sm:p-5 w-full">
      {/* Top LCD Display Box */}
      <div className="relative mb-4 bg-slate-950 rounded-xl p-3 sm:p-4 border border-slate-800/80 shadow-inner overflow-hidden">
        {/* Subtle Neon Glow line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 opacity-60" />

        {/* Display Status Indicators */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
                setAngleMode(nextMode);
                onActiveExpressionChange(expression, nextMode);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                angleMode === 'DEG'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}
              title="Clique para alternar entre Graus (DEG) e Radianos (RAD)"
            >
              {angleMode}
            </button>

            {hasMemory && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                M ({memory})
              </span>
            )}

            {isSecondMode && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                2nd
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onSendToAI && expression && (
              <button
                onClick={() => onSendToAI(expression)}
                className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 rounded transition-colors"
                title="Pedir explicação detalhada para a IA"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Explicar com IA</span>
              </button>
            )}

            <button
              onClick={copyDisplay}
              className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Copiar resultado"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expression Tape */}
        <div className="h-6 text-right font-mono text-xs sm:text-sm text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-none">
          {expression || <span className="opacity-40">0</span>}
        </div>

        {/* Main Result Display */}
        <div className="text-right font-mono text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums overflow-x-auto whitespace-nowrap scrollbar-none py-1">
          {displayValue}
        </div>
      </div>

      {/* Calculator Keypad Grid */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* Row 1: Mode & Memory */}
        <button
          onClick={() => setIsSecondMode(!isSecondMode)}
          className={`py-2 px-1 text-xs font-semibold rounded-lg transition-all ${
            isSecondMode
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
          title="Alternar funções secundárias (inversas)"
        >
          2nd
        </button>

        <button
          onClick={() => {
            const nextMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
            setAngleMode(nextMode);
            onActiveExpressionChange(expression, nextMode);
          }}
          className="py-2 px-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all font-mono"
        >
          {angleMode}
        </button>

        <button
          onClick={handleMemoryClear}
          className="py-2 px-1 text-xs font-medium rounded-lg bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-all font-mono"
        >
          MC
        </button>

        <button
          onClick={handleMemoryRecall}
          className="py-2 px-1 text-xs font-medium rounded-lg bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-all font-mono"
        >
          MR
        </button>

        <button
          onClick={handleMemoryAdd}
          className="py-2 px-1 text-xs font-medium rounded-lg bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-all font-mono"
        >
          M+
        </button>

        {/* Row 2: Scientific Trig Functions */}
        <button
          onClick={() => appendToken(isSecondMode ? 'asin(' : 'sin(', 'sin')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 hover:text-purple-100 border border-purple-800/40 transition-all"
        >
          {isSecondMode ? 'sin⁻¹' : 'sin'}
        </button>

        <button
          onClick={() => appendToken(isSecondMode ? 'acos(' : 'cos(', 'cos')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 hover:text-purple-100 border border-purple-800/40 transition-all"
        >
          {isSecondMode ? 'cos⁻¹' : 'cos'}
        </button>

        <button
          onClick={() => appendToken(isSecondMode ? 'atan(' : 'tan(', 'tan')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 hover:text-purple-100 border border-purple-800/40 transition-all"
        >
          {isSecondMode ? 'tan⁻¹' : 'tan'}
        </button>

        <button
          onClick={() => appendToken('(')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all font-mono"
        >
          (
        </button>

        <button
          onClick={() => appendToken(')')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all font-mono"
        >
          )
        </button>

        {/* Row 3: Scientific Log, Roots & Clear */}
        <button
          onClick={() => appendToken('ln(', 'ln')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 hover:text-purple-100 border border-purple-800/40 transition-all"
        >
          ln
        </button>

        <button
          onClick={() => appendToken('log10(', 'log10')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 hover:text-purple-100 border border-purple-800/40 transition-all"
        >
          log₁₀
        </button>

        <button
          onClick={() => appendToken('^', 'power')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 hover:text-purple-100 border border-purple-800/40 transition-all font-mono"
        >
          xʸ
        </button>

        <button
          onClick={handleClear}
          className="py-2 px-1 text-xs sm:text-sm font-bold rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 hover:text-rose-100 border border-rose-800/50 transition-all"
        >
          AC
        </button>

        <button
          onClick={handleBackspace}
          className="flex items-center justify-center py-2 px-1 text-xs sm:text-sm font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
          title="Apagar último caractere"
        >
          <Delete className="w-4 h-4" />
        </button>

        {/* Row 4: Power, Roots & Numbers 7, 8, 9, ÷ */}
        <button
          onClick={() => appendToken(isSecondMode ? 'cbrt(' : 'sqrt(', 'sqrt')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 hover:text-purple-100 border border-purple-800/40 transition-all"
        >
          {isSecondMode ? '∛x' : '√x'}
        </button>

        <button
          onClick={() => appendToken('7')}
          className="py-2.5 px-1 text-base font-medium rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition-all font-mono"
        >
          7
        </button>

        <button
          onClick={() => appendToken('8')}
          className="py-2.5 px-1 text-base font-medium rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition-all font-mono"
        >
          8
        </button>

        <button
          onClick={() => appendToken('9')}
          className="py-2.5 px-1 text-base font-medium rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition-all font-mono"
        >
          9
        </button>

        <button
          onClick={() => appendToken('÷')}
          className="py-2.5 px-1 text-base font-semibold rounded-lg bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 hover:text-cyan-100 border border-cyan-800/40 transition-all font-mono"
        >
          ÷
        </button>

        {/* Row 5: Factorial & Numbers 4, 5, 6, × */}
        <button
          onClick={() => appendToken('!', 'factorial')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 hover:text-purple-100 border border-purple-800/40 transition-all font-mono"
        >
          n!
        </button>

        <button
          onClick={() => appendToken('4')}
          className="py-2.5 px-1 text-base font-medium rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition-all font-mono"
        >
          4
        </button>

        <button
          onClick={() => appendToken('5')}
          className="py-2.5 px-1 text-base font-medium rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition-all font-mono"
        >
          5
        </button>

        <button
          onClick={() => appendToken('6')}
          className="py-2.5 px-1 text-base font-medium rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition-all font-mono"
        >
          6
        </button>

        <button
          onClick={() => appendToken('×')}
          className="py-2.5 px-1 text-base font-semibold rounded-lg bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 hover:text-cyan-100 border border-cyan-800/40 transition-all font-mono"
        >
          ×
        </button>

        {/* Row 6: Exp & Numbers 1, 2, 3, - */}
        <button
          onClick={() => appendToken('exp(', 'exp')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 hover:text-purple-100 border border-purple-800/40 transition-all font-mono"
        >
          eˣ
        </button>

        <button
          onClick={() => appendToken('1')}
          className="py-2.5 px-1 text-base font-medium rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition-all font-mono"
        >
          1
        </button>

        <button
          onClick={() => appendToken('2')}
          className="py-2.5 px-1 text-base font-medium rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition-all font-mono"
        >
          2
        </button>

        <button
          onClick={() => appendToken('3')}
          className="py-2.5 px-1 text-base font-medium rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition-all font-mono"
        >
          3
        </button>

        <button
          onClick={() => appendToken('-')}
          className="py-2.5 px-1 text-base font-semibold rounded-lg bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 hover:text-cyan-100 border border-cyan-800/40 transition-all font-mono"
        >
          -
        </button>

        {/* Row 7: Constants & 0, ., =, + */}
        <button
          onClick={() => appendToken('pi', 'pi')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 hover:text-purple-100 border border-purple-800/40 transition-all font-serif italic"
        >
          π
        </button>

        <button
          onClick={() => appendToken('e', 'e')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 hover:text-purple-100 border border-purple-800/40 transition-all font-serif italic"
        >
          e
        </button>

        <button
          onClick={() => appendToken('0')}
          className="py-2.5 px-1 text-base font-medium rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition-all font-mono"
        >
          0
        </button>

        <button
          onClick={() => appendToken('.')}
          className="py-2.5 px-1 text-base font-medium rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition-all font-mono"
        >
          .
        </button>

        <button
          onClick={() => appendToken('+')}
          className="py-2.5 px-1 text-base font-semibold rounded-lg bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 hover:text-cyan-100 border border-cyan-800/40 transition-all font-mono"
        >
          +
        </button>
      </div>

      {/* Row 8: Equal Button full width row with dark neon gradient */}
      <div className="mt-2.5 grid grid-cols-5 gap-2">
        <button
          onClick={() => appendToken('^2', 'power')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all font-mono"
          title="Elevar ao quadrado"
        >
          x²
        </button>

        <button
          onClick={() => appendToken('abs(', 'basic')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all font-mono"
          title="Valor Absoluto |x|"
        >
          |x|
        </button>

        <button
          onClick={() => appendToken('%')}
          className="py-2 px-1 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all font-mono"
          title="Porcentagem"
        >
          %
        </button>

        <button
          onClick={handleEvaluate}
          className="col-span-2 py-2.5 px-4 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>=</span>
          <span className="text-xs font-normal opacity-90 hidden sm:inline">Calcular</span>
        </button>
      </div>
    </div>
  );
};
