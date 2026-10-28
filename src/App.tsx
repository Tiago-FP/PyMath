import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ScientificCalculator } from './components/ScientificCalculator';
import { PythonEduPanel } from './components/PythonEduPanel';
import { FunctionPlotter } from './components/FunctionPlotter';
import { AiAssistant } from './components/AiAssistant';
import { HistoryPanel } from './components/HistoryPanel';
import { QuickGuideModal } from './components/QuickGuideModal';
import { HistoryItem, AngleMode } from './types';
import { generatePythonCode } from './services/mathEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'graph' | 'ai' | 'history'>('calculator');
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('pymath_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'hist_sample_1',
        timestamp: Date.now() - 1000 * 60 * 5,
        expression: 'sin(30) + cos(60)',
        result: '1',
        pythonCode: `# Cálculo com Graus convertidos para Radianos
import math

angulo_30 = math.radians(30)
angulo_60 = math.radians(60)

resultado = math.sin(angulo_30) + math.cos(angulo_60)
print(f"Resultado: {resultado}")
`,
        explanation: 'Seno de 30° (0.5) somado ao cosseno de 60° (0.5), resultando em 1.',
        source: 'calculator',
      },
      {
        id: 'hist_sample_2',
        timestamp: Date.now() - 1000 * 60 * 12,
        expression: 'sqrt(3^2 + 4^2)',
        result: '5',
        pythonCode: `# Teorema de Pitágoras: hipotenusa = sqrt(a² + b²)
import math

cateto_a = 3
cateto_b = 4

hipotenusa = math.sqrt(cateto_a**2 + cateto_b**2)
print(f"Hipotenusa: {hipotenusa}")
`,
        explanation: 'Cálculo da hipotenusa para um triângulo retângulo clássico 3-4-5.',
        source: 'calculator',
      },
    ];
  });

  const [currentExpression, setCurrentExpression] = useState<string>('sin(30)');
  const [currentPythonCode, setCurrentPythonCode] = useState<string>(() =>
    generatePythonCode('sin(30)', 'DEG')
  );
  const [activeKeyId, setActiveKeyId] = useState<string>('sin');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pymath_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const handleCalculated = useCallback((item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);
    setCurrentPythonCode(item.pythonCode);
  }, []);

  const handleActiveExpressionChange = useCallback((expr: string, angleMode: AngleMode, keyId?: string) => {
    if (keyId) {
      setActiveKeyId(keyId);
    }
    if (expr) {
      const py = generatePythonCode(expr, angleMode);
      setCurrentPythonCode(py);
    }
  }, []);

  const handleLoadExpressionToCalculator = useCallback((expr: string) => {
    setCurrentExpression(expr);
    const py = generatePythonCode(expr, 'DEG');
    setCurrentPythonCode(py);
    setActiveTab('calculator');
  }, []);

  const handleLoadCodeToPythonPanel = useCallback((code: string) => {
    setCurrentPythonCode(code);
    setActiveTab('calculator');
  }, []);

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('pymath_history');
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3-Zone Header Top Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenGuide={() => setIsGuideOpen(true)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* VIEW 1: Calculator & Python Educational Panel */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Scientific Calculator (5 cols on large desktop) */}
            <div className="lg:col-span-5 w-full">
              <ScientificCalculator
                initialExpression={currentExpression}
                onCalculated={handleCalculated}
                onActiveExpressionChange={handleActiveExpressionChange}
                onSendToAI={(expr) => {
                  setCurrentExpression(expr);
                  setActiveTab('ai');
                }}
              />
            </div>

            {/* Right Column: Educational Python Panel (7 cols on large desktop) */}
            <div className="lg:col-span-7 w-full h-full min-h-[580px]">
              <PythonEduPanel
                currentPythonCode={currentPythonCode}
                activeKeyId={activeKeyId}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: 2D Function Plotter */}
        {activeTab === 'graph' && (
          <div className="max-w-4xl mx-auto">
            <FunctionPlotter />
          </div>
        )}

        {/* VIEW 3: AI Math Assistant (Gemini) */}
        {activeTab === 'ai' && (
          <div className="max-w-4xl mx-auto">
            <AiAssistant
              onLoadExpressionToCalculator={handleLoadExpressionToCalculator}
              onLoadCodeToPythonPanel={handleLoadCodeToPythonPanel}
            />
          </div>
        )}

        {/* VIEW 4: Session History */}
        {activeTab === 'history' && (
          <div className="max-w-3xl mx-auto">
            <HistoryPanel
              history={history}
              onSelectExpression={handleLoadExpressionToCalculator}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}
      </main>

      {/* Footer Note */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PyMath · Calculadora Científica Educacional com Python & Gemini AI</span>
          <span>Ambiente WebAssembly Pyodide & Node.js</span>
        </div>
      </footer>

      {/* Quick Guide Modal */}
      <QuickGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
