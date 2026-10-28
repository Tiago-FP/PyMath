import { AngleMode } from '../types';

export interface CalculationResult {
  success: boolean;
  result: string;
  numericValue: number | null;
  pythonCode: string;
  explanation: string;
  error?: string;
}

// Factorial helper
function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('Fatorial é definido apenas para inteiros não-negativos.');
  }
  if (n > 170) {
    throw new Error('Número muito grande para cálculo em precisão float (estouro de limite).');
  }
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

/**
 * Transpiles calculator expression into executable JavaScript and Python equivalents
 */
export function evaluateExpression(expr: string, angleMode: AngleMode): CalculationResult {
  if (!expr || !expr.trim()) {
    return {
      success: false,
      result: '0',
      numericValue: 0,
      pythonCode: '# Nenhuma expressão informada',
      explanation: 'O visor está vazio.',
    };
  }

  const raw = expr.trim();

  try {
    // 1. Generate Python Code Equivalent
    const pythonCode = generatePythonCode(raw, angleMode);

    // 2. Prepare JavaScript expression
    // Replace visual symbols
    let jsExpr = raw
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'Math.PI')
      .replace(/\bpi\b/gi, 'Math.PI')
      .replace(/\be\b/gi, 'Math.E')
      .replace(/\^/g, '**');

    // Handle angle conversion in trig functions for DEG mode
    if (angleMode === 'DEG') {
      jsExpr = jsExpr
        .replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * (Math.PI / 180))')
        .replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * (Math.PI / 180))')
        .replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * (Math.PI / 180))')
        .replace(/asin\(([^)]+)\)/g, '(Math.asin($1) * (180 / Math.PI))')
        .replace(/acos\(([^)]+)\)/g, '(Math.acos($1) * (180 / Math.PI))')
        .replace(/atan\(([^)]+)\)/g, '(Math.atan($1) * (180 / Math.PI))');
    } else {
      jsExpr = jsExpr
        .replace(/sin\(([^)]+)\)/g, 'Math.sin($1)')
        .replace(/cos\(([^)]+)\)/g, 'Math.cos($1)')
        .replace(/tan\(([^)]+)\)/g, 'Math.tan($1)')
        .replace(/asin\(([^)]+)\)/g, 'Math.asin($1)')
        .replace(/acos\(([^)]+)\)/g, 'Math.acos($1)')
        .replace(/atan\(([^)]+)\)/g, 'Math.atan($1)');
    }

    // Other math functions
    jsExpr = jsExpr
      .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
      .replace(/cbrt\(([^)]+)\)/g, 'Math.cbrt($1)')
      .replace(/log10\(([^)]+)\)/g, 'Math.log10($1)')
      .replace(/log\(([^)]+)\)/g, 'Math.log10($1)') // standard log button is log10
      .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
      .replace(/exp\(([^)]+)\)/g, 'Math.exp($1)')
      .replace(/abs\(([^)]+)\)/g, 'Math.abs($1)')
      .replace(/fact\(([^)]+)\)/g, 'factorial($1)')
      .replace(/factorial\(([^)]+)\)/g, 'factorial($1)');

    // Handle postfix factorial notation like "5!"
    jsExpr = jsExpr.replace(/(\d+(\.\d+)?|\([^)]+\))!/g, 'factorial($1)');

    // Create safe sandbox function
    const evaluator = new Function('factorial', `return (${jsExpr});`);
    const val = evaluator(factorial);

    if (typeof val !== 'number' || isNaN(val)) {
      throw new Error('Resultado indeterminado ou não numérico.');
    }

    let formattedResult = '';
    if (!isFinite(val)) {
      formattedResult = val > 0 ? '∞' : '-∞';
    } else {
      // Clean precision rounding to avoid floating point artifact like 0.30000000000000004
      const rounded = Math.round(val * 1e12) / 1e12;
      formattedResult = rounded.toString();
    }

    const explanation = generateExplanation(raw, formattedResult, angleMode);

    return {
      success: true,
      result: formattedResult,
      numericValue: val,
      pythonCode,
      explanation,
    };
  } catch (err: any) {
    return {
      success: false,
      result: 'Erro',
      numericValue: null,
      pythonCode: generatePythonCode(raw, angleMode),
      explanation: 'Verifique parênteses ou domínio matemático da operação (ex.: divisão por zero, raiz de número negativo).',
      error: err?.message || 'Erro de sintaxe',
    };
  }
}

/**
 * Transpiles the calculator expression into clean, idiomatic Python 3 code
 */
export function generatePythonCode(rawExpr: string, angleMode: AngleMode): string {
  let py = rawExpr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'math.pi')
    .replace(/\bpi\b/gi, 'math.pi')
    .replace(/\be\b/gi, 'math.e')
    .replace(/\^/g, '**');

  const needsMath = /(sin|cos|tan|sqrt|cbrt|log|ln|exp|factorial|fact|pi|e|radians)/.test(py);

  if (angleMode === 'DEG') {
    py = py
      .replace(/sin\(([^)]+)\)/g, 'math.sin(math.radians($1))')
      .replace(/cos\(([^)]+)\)/g, 'math.cos(math.radians($1))')
      .replace(/tan\(([^)]+)\)/g, 'math.tan(math.radians($1))')
      .replace(/asin\(([^)]+)\)/g, 'math.degrees(math.asin($1))')
      .replace(/acos\(([^)]+)\)/g, 'math.degrees(math.acos($1))')
      .replace(/atan\(([^)]+)\)/g, 'math.degrees(math.atan($1))');
  } else {
    py = py
      .replace(/sin\(([^)]+)\)/g, 'math.sin($1)')
      .replace(/cos\(([^)]+)\)/g, 'math.cos($1)')
      .replace(/tan\(([^)]+)\)/g, 'math.tan($1)')
      .replace(/asin\(([^)]+)\)/g, 'math.asin($1)')
      .replace(/acos\(([^)]+)\)/g, 'math.acos($1)')
      .replace(/atan\(([^)]+)\)/g, 'math.atan($1)');
  }

  py = py
    .replace(/sqrt\(([^)]+)\)/g, 'math.sqrt($1)')
    .replace(/cbrt\(([^)]+)\)/g, 'math.cbrt($1)')
    .replace(/log10\(([^)]+)\)/g, 'math.log10($1)')
    .replace(/log\(([^)]+)\)/g, 'math.log10($1)')
    .replace(/ln\(([^)]+)\)/g, 'math.log($1)')
    .replace(/exp\(([^)]+)\)/g, 'math.exp($1)')
    .replace(/abs\(([^)]+)\)/g, 'abs($1)')
    .replace(/fact\(([^)]+)\)/g, 'math.factorial($1)')
    .replace(/factorial\(([^)]+)\)/g, 'math.factorial($1)')
    .replace(/(\d+(\.\d+)?|\([^)]+\))!/g, 'math.factorial($1)');

  const lines = [
    `# Código gerado para a expressão: ${rawExpr} (${angleMode})`,
  ];
  if (needsMath) {
    lines.push('import math\n');
  }

  lines.push(`expressao = ${py}`);
  lines.push(`print(f"Resultado: {expressao}")`);

  return lines.join('\n');
}

function generateExplanation(expr: string, result: string, angleMode: AngleMode): string {
  if (/sin|cos|tan/.test(expr)) {
    return `Operação trigonométrica calculada no modo ${angleMode === 'DEG' ? 'GRAUS (DEG - com conversão de radianos via math.radians)' : 'RADIANOS (RAD)'}. Resultado: ${result}.`;
  }
  if (/sqrt/.test(expr)) {
    return `Raiz quadrada calculada via math.sqrt(). A raiz de um número 'x' é um valor 'r' tal que r² = x. Resultado: ${result}.`;
  }
  if (/log10|log/.test(expr)) {
    return `Logaritmo na base 10 (math.log10) indicando a potência a que 10 deve ser elevado para resultar no argumento. Resultado: ${result}.`;
  }
  if (/ln/.test(expr)) {
    return `Logaritmo natural na base de Euler 'e' (math.log). Resultado: ${result}.`;
  }
  if (/!|fact/.test(expr)) {
    return `Fatorial (math.factorial) calculado como o produto contínuo de todos os inteiros positivos até n. Resultado: ${result}.`;
  }
  if (/\^|\*\*/.test(expr)) {
    return `Potenciação calculada via operador ** (ou pow), elevando a base ao expoente. Resultado: ${result}.`;
  }
  return `Expressão aritmética avaliada com respeito à ordem padrão de precedência (parênteses, potências, multiplicações/divisões e adições/subtrações). Resultado: ${result}.`;
}
