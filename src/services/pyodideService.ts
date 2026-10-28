import { PyodideRunResult, PyodideStatus } from '../types';

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<any>;
  }
}

class PyodideManager {
  private pyodide: any = null;
  private status: PyodideStatus = 'unloaded';
  private initPromise: Promise<void> | null = null;
  private listeners: Array<(status: PyodideStatus) => void> = [];

  public getStatus(): PyodideStatus {
    return this.status;
  }

  public subscribe(listener: (status: PyodideStatus) => void): () => void {
    this.listeners.push(listener);
    listener(this.status);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.status));
  }

  public async init(): Promise<void> {
    if (this.status === 'ready' && this.pyodide) return;
    if (this.initPromise) return this.initPromise;

    this.status = 'loading';
    this.notify();

    this.initPromise = (async () => {
      try {
        // Wait up to 5 seconds for window.loadPyodide script to be available
        let tries = 0;
        while (!window.loadPyodide && tries < 50) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          tries++;
        }

        if (window.loadPyodide) {
          const py = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
          });

          // Preload math and prepare capture buffers
          await py.runPythonAsync(`
import sys
import io
import math

class StdoutCatcher:
    def __init__(self):
        self.buffer = io.StringIO()
    def write(self, text):
        self.buffer.write(text)
    def flush(self):
        pass
    def getvalue(self):
        return self.buffer.getvalue()
    def reset(self):
        self.buffer = io.StringIO()

__catcher = StdoutCatcher()
sys.stdout = __catcher
sys.stderr = __catcher
`);

          this.pyodide = py;
          this.status = 'ready';
          this.notify();
          console.log('Pyodide inicializado com sucesso.');
        } else {
          console.warn('Script do Pyodide não encontrado no window. Usando modo de simulação nativo.');
          this.status = 'ready'; // ready via simulator fallback
          this.notify();
        }
      } catch (err) {
        console.error('Falha ao inicializar Pyodide:', err);
        this.status = 'error';
        this.notify();
      }
    })();

    return this.initPromise;
  }

  public async runCode(code: string): Promise<PyodideRunResult> {
    const start = performance.now();

    // Ensure initialization attempted
    if (this.status === 'unloaded') {
      await this.init();
    }

    if (this.pyodide && this.status === 'ready') {
      try {
        // Reset stdout buffer
        await this.pyodide.runPythonAsync(`
__catcher.reset()
`);

        // Run user python code
        const result = await this.pyodide.runPythonAsync(code);

        // Fetch captured stdout
        const stdout = await this.pyodide.runPythonAsync(`__catcher.getvalue()`);
        const duration = Math.round(performance.now() - start);

        let finalOutput = (stdout || '').trim();
        if (!finalOutput && result !== undefined && result !== null) {
          finalOutput = String(result);
        }
        if (!finalOutput) {
          finalOutput = '[Código executado com sucesso sem saída de print]';
        }

        return {
          success: true,
          output: finalOutput,
          durationMs: duration,
        };
      } catch (err: any) {
        const duration = Math.round(performance.now() - start);
        return {
          success: false,
          output: '',
          error: err?.message || String(err),
          durationMs: duration,
        };
      }
    }

    // Fallback: Smart local evaluator for math scripts if Pyodide is still loading or unavailable
    return this.simulatePythonRun(code, start);
  }

  private simulatePythonRun(code: string, start: number): PyodideRunResult {
    try {
      const prints: string[] = [];
      const lines = code.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#') || !trimmed) continue;

        // Check if print statement
        const printMatch = trimmed.match(/^print\((.*)\)$/);
        if (printMatch) {
          const content = printMatch[1];
          // simple f-string or string cleaner
          const cleaned = content
            .replace(/^f?["']|["']$/g, '')
            .replace(/\{([^}]+)\}/g, (_match, expr) => {
              try {
                // evaluate simple math inside {expr}
                const js = expr
                  .replace(/math\.pi/g, String(Math.PI))
                  .replace(/math\.e/g, String(Math.E))
                  .replace(/math\.sin/g, 'Math.sin')
                  .replace(/math\.cos/g, 'Math.cos')
                  .replace(/math\.sqrt/g, 'Math.sqrt')
                  .replace(/math\.radians\(([^)]+)\)/g, '(($1)*Math.PI/180)')
                  .replace(/\*\*/g, '**');
                return String(new Function(`return (${js});`)());
              } catch {
                return expr;
              }
            });
          prints.push(cleaned);
        }
      }

      const duration = Math.round(performance.now() - start);
      return {
        success: true,
        output: prints.length > 0 ? prints.join('\n') : '[Execução concluída em modo didático]',
        durationMs: duration,
      };
    } catch (err: any) {
      return {
        success: false,
        output: '',
        error: err?.message || 'Erro ao processar script Python',
        durationMs: Math.round(performance.now() - start),
      };
    }
  }
}

export const pyodideService = new PyodideManager();
