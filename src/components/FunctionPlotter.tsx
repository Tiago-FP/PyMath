import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Copy, Check, Terminal, TrendingUp } from 'lucide-react';

interface FunctionPlotterProps {
  initialFunction?: string;
}

const PRESET_FUNCTIONS = [
  { label: 'sen(x)', expr: 'Math.sin(x)', py: 'np.sin(x)' },
  { label: 'cos(x)', expr: 'Math.cos(x)', py: 'np.cos(x)' },
  { label: 'x² - 4', expr: 'Math.pow(x, 2) - 4', py: 'x**2 - 4' },
  { label: 'x³ - 3x', expr: 'Math.pow(x, 3) - 3 * x', py: 'x**3 - 3*x' },
  { label: 'e^(x/2)', expr: 'Math.exp(x / 2)', py: 'np.exp(x / 2)' },
  { label: '1 / x', expr: '1 / (x || 0.0001)', py: '1 / x' },
  { label: '√x', expr: 'x >= 0 ? Math.sqrt(x) : NaN', py: 'np.sqrt(np.maximum(0, x))' },
];

export const FunctionPlotter: React.FC<FunctionPlotterProps> = ({ initialFunction = 'Math.sin(x)' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [expr, setExpr] = useState<string>(initialFunction);
  const [pyExpr, setPyExpr] = useState<string>('np.sin(x)');
  const [xRange, setXRange] = useState<number>(10); // [-10, 10]
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const drawPlot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    const xMin = -xRange;
    const xMax = xRange;
    const yRange = (xRange * height) / width;
    const yMin = -yRange;
    const yMax = yRange;

    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;
    const toMathX = (cx: number) => xMin + (cx / width) * (xMax - xMin);

    // Draw Grid Lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e293b';

    const step = xRange <= 5 ? 1 : xRange <= 15 ? 2 : 5;

    // Vertical grid
    for (let x = Math.ceil(xMin / step) * step; x <= xMax; x += step) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();

      if (x !== 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(x.toString(), cx + 3, toCanvasY(0) - 4);
      }
    }

    // Horizontal grid
    for (let y = Math.ceil(yMin / step) * step; y <= yMax; y += step) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();

      if (y !== 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(y.toString(), toCanvasX(0) + 4, cy - 3);
      }
    }

    // Draw Main Axes X and Y
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#475569';

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, toCanvasY(0));
    ctx.lineTo(width, toCanvasY(0));
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), 0);
    ctx.lineTo(toCanvasX(0), height);
    ctx.stroke();

    // Prepare Function
    let fn: (x: number) => number;
    try {
      fn = new Function('x', `with(Math) { return (${expr}); }`) as (x: number) => number;
    } catch {
      return;
    }

    // Plot Curve
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#38bdf8'; // Cyan Neon curve
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;

    ctx.beginPath();
    let started = false;

    const pixelsPerSample = 1;
    const numPoints = Math.ceil(width / pixelsPerSample);

    for (let i = 0; i <= numPoints; i++) {
      const cx = i * pixelsPerSample;
      const x = toMathX(cx);
      try {
        const y = fn(x);
        if (typeof y === 'number' && isFinite(y)) {
          const cy = toCanvasY(y);
          if (!started) {
            ctx.moveTo(cx, cy);
            started = true;
          } else {
            ctx.lineTo(cx, cy);
          }
        } else {
          started = false;
        }
      } catch {
        started = false;
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow

    // Draw Hover Point if mouse on canvas
    if (hoverCoord) {
      const hx = toCanvasX(hoverCoord.x);
      const hy = toCanvasY(hoverCoord.y);

      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(hx, hy, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText(
        `(${hoverCoord.x.toFixed(2)}, ${hoverCoord.y.toFixed(2)})`,
        Math.min(hx + 8, width - 110),
        Math.max(hy - 8, 15)
      );
    }
  }, [expr, xRange, hoverCoord]);

  useEffect(() => {
    drawPlot();
  }, [drawPlot]);

  // Handle Canvas Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const width = rect.width;
    const xMin = -xRange;
    const xMax = xRange;
    const x = xMin + (cx / width) * (xMax - xMin);

    try {
      const fn = new Function('x', `with(Math) { return (${expr}); }`);
      const y = fn(x);
      if (typeof y === 'number' && isFinite(y)) {
        setHoverCoord({ x, y });
      } else {
        setHoverCoord(null);
      }
    } catch {
      setHoverCoord(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverCoord(null);
  };

  const handleZoom = (factor: number) => {
    setXRange((prev) => Math.max(2, Math.min(100, Math.round(prev * factor))));
  };

  const pythonMatplotlibCode = `# Plotagem de Função 2D com Python, NumPy e Matplotlib
import numpy as np
import matplotlib.pyplot as plt

# Gerar valores de x no domínio [-${xRange}, ${xRange}]
x = np.linspace(-${xRange}, ${xRange}, 1000)

# Avaliar a função: f(x) = ${pyExpr}
y = ${pyExpr}

# Configuração do gráfico estilizado
plt.figure(figsize=(9, 5), facecolor='#090d16')
ax = plt.axes()
ax.set_facecolor('#090d16')

# Plotar curva com tom ciano neon
plt.plot(x, y, color='#38bdf8', linewidth=2.5, label='f(x)')

# Eixos e Grade
plt.axhline(0, color='#475569', linewidth=1)
plt.axvline(0, color='#475569', linewidth=1)
plt.grid(True, linestyle='--', alpha=0.3, color='#334155')

plt.title('Gráfico da Função f(x)', color='white', fontsize=14, pad=12)
plt.xlabel('Eixo X', color='#94a3b8')
plt.ylabel('Eixo Y', color='#94a3b8')
plt.tick_params(colors='#94a3b8')

plt.show()
`;

  const copyPython = () => {
    navigator.clipboard.writeText(pythonMatplotlibCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl shadow-black/40 p-4 sm:p-5 w-full">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">Plotador 2D de Funções</h2>
            <p className="text-xs text-slate-400">Visualização de curvas cartesianas interativas</p>
          </div>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => handleZoom(0.7)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Aproximar (Zoom In)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(1.4)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Afastar (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setXRange(10)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Redefinir Escala"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Functions */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 text-xs">
        <span className="text-slate-400 font-semibold shrink-0">Funções:</span>
        {PRESET_FUNCTIONS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setExpr(p.expr);
              setPyExpr(p.py);
            }}
            className={`px-2.5 py-1 rounded-md font-mono transition-all shrink-0 ${
              expr === p.expr
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Interactive 2D Canvas */}
      <div className="relative w-full h-[280px] sm:h-[340px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-crosshair"
        />
        <div className="absolute bottom-2 left-3 text-[11px] font-mono text-slate-400 pointer-events-none bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          Escala X: [-{xRange}, +{xRange}]
        </div>
      </div>

      {/* Python Matplotlib Code Generator */}
      <div className="mt-3 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono text-slate-300">Como plotar isso em Python (Matplotlib + NumPy)</span>
          </div>
          <button
            onClick={copyPython}
            className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>
        <pre className="p-3 font-mono text-xs text-purple-200/90 overflow-x-auto max-h-[140px] leading-relaxed">
          <code>{pythonMatplotlibCode}</code>
        </pre>
      </div>
    </div>
  );
};
