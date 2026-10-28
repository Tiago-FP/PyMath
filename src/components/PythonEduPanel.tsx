import React, { useState, useEffect } from 'react';
import { pyodideService } from '../services/pyodideService';
import { PYTHON_DOCS, SAMPLE_PYTHON_EXPERIMENTS } from '../services/pythonCatalog';
import { PyodideStatus, PyodideRunResult } from '../types';
import { Play, RotateCcw, Copy, Check, Terminal, BookOpen, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

interface PythonEduPanelProps {
  currentPythonCode: string;
  activeKeyId?: string;
  onCodeExecuted?: (code: string, result: PyodideRunResult) => void;
}

export const PythonEduPanel: React.FC<PythonEduPanelProps> = ({
  currentPythonCode,
  activeKeyId,
}) => {
  const [code, setCode] = useState<string>(currentPythonCode || '');
  const [pyStatus, setPyStatus] = useState<PyodideStatus>('unloaded');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [output, setOutput] = useState<string>('');
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'explanation' | 'repl'>('explanation');

  // Track Pyodide status
  useEffect(() => {
    const unsub = pyodideService.subscribe((status) => {
      setPyStatus(status);
    });
    // Start loading Pyodide in background
    pyodideService.init().catch(console.error);
    return unsub;
  }, []);

  // Update editor when calculator generates new Python code
  useEffect(() => {
    if (currentPythonCode) {
      setCode(currentPythonCode);
    }
  }, [currentPythonCode]);

  // Find documentation for the active key or default
  const activeDoc = activeKeyId && PYTHON_DOCS[activeKeyId]
    ? PYTHON_DOCS[activeKeyId]
    : PYTHON_DOCS.sin;

  const handleRunCode = async () => {
    if (!code.trim()) return;

    setIsRunning(true);
    setErrorMsg(null);
    setOutput('');

    try {
      const res = await pyodideService.runCode(code);
      if (res.success) {
        setOutput(res.output);
        setExecutionTime(res.durationMs);
      } else {
        setErrorMsg(res.error || 'Erro na execução do script Python');
        setExecutionTime(res.durationMs);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Falha ao executar script');
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLoadSample = (sampleCode: string) => {
    setCode(sampleCode);
    setOutput('');
    setErrorMsg(null);
  };

  return (
    <div className="flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl shadow-black/40 p-4 sm:p-5 w-full h-full">
      {/* Top Bar with Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Modo Educacional Python
            </h2>
            <p className="text-xs text-slate-400">
              Aprenda como a matemática é calculada em Python
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('explanation')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'explanation'
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Explicação Didática
          </button>
          <button
            onClick={() => setActiveTab('repl')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'repl'
                ? 'bg-slate-800 text-purple-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Laboratório REPL
          </button>
        </div>
      </div>

      {/* Preset selector in REPL mode */}
      {activeTab === 'repl' && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-400">
          <span className="font-semibold text-slate-300 shrink-0">Modelos didáticos:</span>
          {SAMPLE_PYTHON_EXPERIMENTS.map((sample) => (
            <button
              key={sample.name}
              onClick={() => handleLoadSample(sample.code)}
              className="px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 hover:text-slate-200 border border-slate-800 shrink-0 transition-colors"
            >
              {sample.name}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === 'explanation' ? (
        <div className="flex-1 flex flex-col gap-3 mt-3 overflow-y-auto pr-1">
          {/* Documentation Card for Active Operation */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-cyan-400 font-mono">
                {activeDoc.funcName}
              </span>
              <span className="text-xs text-slate-400 font-serif italic">
                {activeDoc.formula}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">{activeDoc.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeDoc.explanation}
            </p>
          </div>

          {/* Real Python Code Box */}
          <div className="flex-1 flex flex-col rounded-xl bg-slate-950 border border-slate-800 overflow-hidden min-h-[190px]">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-slate-300">script_operacao.py</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 transition-colors"
                  title="Copiar código Python"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <pre className="p-3 font-mono text-xs text-cyan-200/90 overflow-x-auto flex-1 leading-relaxed bg-slate-950">
              <code>{code || activeDoc.pythonCode}</code>
            </pre>
          </div>
        </div>
      ) : (
        /* REPL / Code Editor Mode */
        <div className="flex-1 flex flex-col gap-3 mt-3 min-h-[300px]">
          <div className="flex-1 flex flex-col rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-slate-800 text-xs text-slate-400">
              <span className="font-mono text-slate-300">Editor Python Interativo</span>
              <button
                onClick={() => setCode(currentPythonCode)}
                className="flex items-center gap-1 hover:text-slate-200 text-slate-400"
                title="Restaurar código da calculadora"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restaurar</span>
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full p-3 font-mono text-xs text-cyan-100 bg-slate-950 border-none outline-none resize-none leading-relaxed selection:bg-cyan-500/30"
              spellCheck={false}
              placeholder="# Digite seu código Python com a biblioteca math..."
            />
          </div>
        </div>
      )}

      {/* Execution Controls & Terminal Output */}
      <div className="mt-3 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Ambiente:</span>
            {pyStatus === 'ready' ? (
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Python 3 (Pyodide Wasm)
              </span>
            ) : pyStatus === 'loading' ? (
              <span className="flex items-center gap-1 text-amber-300 font-mono">
                <Loader2 className="w-3 h-3 animate-spin" />
                Carregando Pyodide...
              </span>
            ) : (
              <span className="text-slate-400 font-mono">Pronto</span>
            )}

            {executionTime !== null && (
              <span className="text-slate-500 font-mono text-[11px]">
                ({executionTime}ms)
              </span>
            )}
          </div>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Executando...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Executar no Python</span>
              </>
            )}
          </button>
        </div>

        {/* Terminal Output Screen */}
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/90 font-mono text-xs min-h-[50px] max-h-[110px] overflow-y-auto">
          {errorMsg ? (
            <div className="flex items-start gap-1.5 text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="whitespace-pre-wrap">{errorMsg}</div>
            </div>
          ) : output ? (
            <div className="text-emerald-300 whitespace-pre-wrap">{output}</div>
          ) : (
            <div className="text-slate-600 italic">
              Clique em "Executar no Python" para rodar o código e ver a saída do terminal...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
