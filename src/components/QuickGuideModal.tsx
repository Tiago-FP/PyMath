import React from 'react';
import { X, BookOpen, Terminal, Sparkles, Keyboard, CheckCircle } from 'lucide-react';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Guia de Uso & Instruções</h3>
            <p className="text-xs text-slate-400">Calculadora Científica Educacional com Python & IA</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
              <CheckCircle className="w-4 h-4" />
              <span>1. Calculadora Científica & Modo Angular (DEG / RAD)</span>
            </div>
            <p className="text-slate-400">
              A calculadora suporta aritmética básica, potências (<code className="text-cyan-300">^</code>), raízes (<code className="text-cyan-300">sqrt</code>, <code className="text-cyan-300">cbrt</code>), logaritmos (<code className="text-cyan-300">log10</code>, <code className="text-cyan-300">ln</code>), trigonometria e fatoriais (<code className="text-cyan-300">n!</code>).
              O botão <strong>DEG / RAD</strong> converte automaticamente ângulos em graus para radianos ao executar em Python (<code className="text-cyan-300">math.radians()</code>).
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center gap-2 text-purple-400 font-bold mb-1">
              <Terminal className="w-4 h-4" />
              <span>2. Código Python Real & Pyodide (WebAssembly)</span>
            </div>
            <p className="text-slate-400">
              Cada operação realizada na calculadora gera dinamicamente o código Python equivalente com a biblioteca <code className="text-purple-300">math</code>.
              Você pode clicar em <strong>"Executar no Python"</strong> para rodar o código instantaneamente no seu navegador via WebAssembly (Pyodide) e conferir a saída do terminal.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>3. Assistente com Inteligência Artificial (Gemini)</span>
            </div>
            <p className="text-slate-400">
              Na aba <strong>Assistente IA</strong>, pergunte qualquer problema em português (ex.: <em>"Qual a hipotenusa de um triângulo com catetos 3 e 4?"</em> ou <em>"Resolva 2x + 10 = 20"</em>).
              A IA responderá com raciocínio passo a passo didático, código Python executável e um botão para enviar o cálculo direto para o visor da calculadora.
            </p>
          </div>

          {/* Section 4: Keyboard Shortcuts */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
              <Keyboard className="w-4 h-4" />
              <span>Atalhos de Teclado Suportados</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
              <div><strong className="text-white">0 a 9</strong>: Números</div>
              <div><strong className="text-white">+ - * /</strong>: Operadores</div>
              <div><strong className="text-white">Enter</strong> ou <strong className="text-white">=</strong>: Calcular</div>
              <div><strong className="text-white">Backspace</strong>: Apagar caractere</div>
              <div><strong className="text-white">Esc</strong>: Limpar visor (AC)</div>
              <div><strong className="text-white">^</strong>: Potência (exponenciação)</div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs sm:text-sm transition-colors"
          >
            Entendido, vamos calcular!
          </button>
        </div>
      </div>
    </div>
  );
};
