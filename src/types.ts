export type AngleMode = 'DEG' | 'RAD';

export interface HistoryItem {
  id: string;
  timestamp: number;
  expression: string;
  result: string;
  pythonCode: string;
  explanation: string;
  source: 'calculator' | 'ai' | 'script';
}

export interface AiSolution {
  query: string;
  expression: string;
  result: string;
  summary: string;
  steps: string[];
  pythonCode: string;
  pythonExplanation: string;
}

export interface PythonDoc {
  id: string;
  title: string;
  funcName: string;
  category: 'basic' | 'trig' | 'power' | 'log' | 'special';
  formula: string;
  pythonCode: string;
  explanation: string;
  example: {
    input: string;
    output: string;
  };
}

export type PyodideStatus = 'unloaded' | 'loading' | 'ready' | 'error';

export interface PyodideRunResult {
  success: boolean;
  output: string;
  error?: string;
  durationMs: number;
}

export interface GraphPoint {
  x: number;
  y: number;
}
