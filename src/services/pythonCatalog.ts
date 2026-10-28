import { PythonDoc } from '../types';

export const PYTHON_DOCS: Record<string, PythonDoc> = {
  sin: {
    id: 'sin',
    title: 'Seno (Trigonometria)',
    funcName: 'math.sin',
    category: 'trig',
    formula: 'sin(x)',
    pythonCode: `# Cálculo do Seno em Python
import math

# Nota: As funções trigonométricas da biblioteca 'math' esperam o ângulo em Radianos.
# Para converter Graus em Radianos, utilize math.radians(graus).

angulo_graus = 30
angulo_rad = math.radians(angulo_graus)

resultado = math.sin(angulo_rad)
print(f"sen({angulo_graus}°) = {resultado:.4f}")  # 0.5000
`,
    explanation: 'A função `math.sin(x)` calcula o seno de um ângulo `x` medido em radianos. Se você estiver trabalhando com graus, converta previamente com `math.radians(x)`. O retorno está sempre no intervalo [-1, 1].',
    example: {
      input: 'math.sin(math.radians(30))',
      output: '0.5',
    },
  },
  cos: {
    id: 'cos',
    title: 'Cosseno (Trigonometria)',
    funcName: 'math.cos',
    category: 'trig',
    formula: 'cos(x)',
    pythonCode: `# Cálculo do Cosseno em Python
import math

angulo_graus = 60
angulo_rad = math.radians(angulo_graus)

resultado = math.cos(angulo_rad)
print(f"cos({angulo_graus}°) = {resultado:.4f}")  # 0.5000
`,
    explanation: 'Calcula o cosseno do ângulo dado em radianos. A função `math.cos(x)` é periódica com período 2π e retorna valores no intervalo fechado de -1 a 1.',
    example: {
      input: 'math.cos(math.radians(60))',
      output: '0.5',
    },
  },
  tan: {
    id: 'tan',
    title: 'Tangente (Trigonometria)',
    funcName: 'math.tan',
    category: 'trig',
    formula: 'tan(x) = sin(x) / cos(x)',
    pythonCode: `# Cálculo da Tangente em Python
import math

angulo_graus = 45
angulo_rad = math.radians(angulo_graus)

# Em 45° (ou pi/4 rad), a tangente é exatamente 1.0
resultado = math.tan(angulo_rad)
print(f"tan({angulo_graus}°) = {resultado:.4f}")
`,
    explanation: 'Calcula a tangente de `x` em radianos. Lembre-se de que a tangente tende a infinito (ou indeterminação) em 90° e 270° (quando o cosseno é zero).',
    example: {
      input: 'math.tan(math.radians(45))',
      output: '1.0',
    },
  },
  sqrt: {
    id: 'sqrt',
    title: 'Raiz Quadrada',
    funcName: 'math.sqrt',
    category: 'power',
    formula: '√x = x^(1/2)',
    pythonCode: `# Raiz Quadrada em Python
import math

numero = 25
resultado = math.sqrt(numero)

# Alternativa direta com operador de exponenciação:
resultado_op = numero ** 0.5

print(f"A raiz de {numero} é {resultado} (ou {resultado_op})")
`,
    explanation: 'A função `math.sqrt(x)` retorna a raiz quadrada de um número real não-negativo `x`. Tentar passar um número negativo gerará um erro `ValueError: math domain error`.',
    example: {
      input: 'math.sqrt(144)',
      output: '12.0',
    },
  },
  power: {
    id: 'power',
    title: 'Potência / Exponenciação',
    funcName: 'pow / **',
    category: 'power',
    formula: 'x^y (base elevada ao expoente)',
    pythonCode: `# Exponenciação em Python
# Você pode usar a função math.pow() ou o operador nativo **
import math

base = 2
expoente = 8

# Operador nativo (suporta inteiros de precisão arbitrária):
resultado = base ** expoente

# Função math.pow (converte argumentos para ponto flutuante float):
resultado_float = math.pow(base, expoente)

print(f"{base}^{expoente} = {resultado}")
`,
    explanation: 'Em Python, o operador `**` calcula potências inteiras com precisão infinita arbitrária, enquanto `math.pow(x, y)` sempre converte os argumentos para `float`.',
    example: {
      input: '2 ** 10',
      output: '1024',
    },
  },
  log10: {
    id: 'log10',
    title: 'Logaritmo na Base 10',
    funcName: 'math.log10',
    category: 'log',
    formula: 'log₁₀(x)',
    pythonCode: `# Logaritmo Comum (Base 10) em Python
import math

valor = 1000
resultado = math.log10(valor)

print(f"log10({valor}) = {resultado}")  # 3.0
`,
    explanation: 'Retorna a potência a que a base 10 deve ser elevada para produzir `x`. É fundamental em escalas como decibéis, pH e Richter.',
    example: {
      input: 'math.log10(1000)',
      output: '3.0',
    },
  },
  ln: {
    id: 'ln',
    title: 'Logaritmo Natural (Base e)',
    funcName: 'math.log',
    category: 'log',
    formula: 'ln(x) = logₑ(x)',
    pythonCode: `# Logaritmo Natural em Python
import math

# 'math.log(x)' sem segundo argumento calcula na base natural 'e'
# 'math.e' é a constante de Euler (~ 2.71828)
x = math.e ** 2
resultado = math.log(x)

print(f"ln(e^2) = {resultado}")  # 2.0
`,
    explanation: 'A função `math.log(x, [base])` calcula o logaritmo. Se a base for omitida, calcula o logaritmo natural (base `e`).',
    example: {
      input: 'math.log(math.e)',
      output: '1.0',
    },
  },
  factorial: {
    id: 'factorial',
    title: 'Fatorial',
    funcName: 'math.factorial',
    category: 'special',
    formula: 'n! = n × (n - 1) × ... × 1',
    pythonCode: `# Fatorial em Python
import math

n = 5
resultado = math.factorial(n)

print(f"{n}! = {resultado}")  # 120 (5 * 4 * 3 * 2 * 1)
`,
    explanation: '`math.factorial(n)` calcula o fatorial de inteiros não-negativos. Em Python, suporta números imensos com precisão total.',
    example: {
      input: 'math.factorial(6)',
      output: '720',
    },
  },
  exp: {
    id: 'exp',
    title: 'Exponencial Natural (e^x)',
    funcName: 'math.exp',
    category: 'power',
    formula: 'e^x',
    pythonCode: `# Exponencial Natural em Python
import math

x = 2
resultado = math.exp(x)

print(f"e^{x} = {resultado:.5f}")  # ~ 7.38906
`,
    explanation: '`math.exp(x)` calcula `e ** x` com precisão numérica superior a `math.e ** x`, especialmente para valores próximos de zero.',
    example: {
      input: 'math.exp(1)',
      output: '2.71828...',
    },
  },
  pi: {
    id: 'pi',
    title: 'Constante Pi (π)',
    funcName: 'math.pi',
    category: 'special',
    formula: 'π ≈ 3.141592653589793',
    pythonCode: `# Constante Pi em Python
import math

raio = 5
area = math.pi * (raio ** 2)

print(f"Raio: {raio} | Área do círculo: {area:.2f}")
`,
    explanation: '`math.pi` é uma constante de ponto flutuante definida pelo módulo `math` representando a razão entre a circunferência e o diâmetro de um círculo.',
    example: {
      input: 'math.pi',
      output: '3.141592653589793',
    },
  },
  e: {
    id: 'e',
    title: 'Número de Euler (e)',
    funcName: 'math.e',
    category: 'special',
    formula: 'e ≈ 2.718281828459045',
    pythonCode: `# Constante de Euler em Python
import math

print(f"Número de Euler: {math.e}")
`,
    explanation: '`math.e` é a base dos logaritmos naturais, fundamental no cálculo de juros compostos contínuos e decaimento radioativo.',
    example: {
      input: 'math.e',
      output: '2.718281828459045',
    },
  },
};

export const SAMPLE_PYTHON_EXPERIMENTS = [
  {
    name: 'Teorema de Pitágoras',
    code: `# Teorema de Pitágoras: a² + b² = c²
import math

cateto_a = 3.0
cateto_b = 4.0

# Hipotenusa c = √(a² + b²)
hipotenusa = math.hypot(cateto_a, cateto_b)
print(f"Catetos: {cateto_a} e {cateto_b}")
print(f"Hipotenusa calculada: {hipotenusa}")
`,
  },
  {
    name: 'Fórmula de Bhaskara',
    code: `# Resolução de Equação de 2º Grau (ax² + bx + c = 0)
import math

a, b, c = 1, -5, 6  # Raízes esperadas: 2 e 3

delta = (b ** 2) - (4 * a * c)
print(f"Delta: {delta}")

if delta >= 0:
    x1 = (-b + math.sqrt(delta)) / (2 * a)
    x2 = (-b - math.sqrt(delta)) / (2 * a)
    print(f"Raiz x1: {x1}")
    print(f"Raiz x2: {x2}")
else:
    print("Não possui raízes reais.")
`,
  },
  {
    name: 'Série de Taylor para Seno',
    code: `# Aproximação de Taylor para sin(x): x - x³/3! + x⁵/5! - x⁷/7!
import math

x_graus = 45
x_rad = math.radians(x_graus)

# Aproximação com os 4 primeiros termos
aproximacao = (
    x_rad
    - (x_rad**3) / math.factorial(3)
    + (x_rad**5) / math.factorial(5)
    - (x_rad**7) / math.factorial(7)
)

exato = math.sin(x_rad)

print(f"Ângulo: {x_graus}° ({x_rad:.4f} rad)")
print(f"Taylor (4 termos): {aproximacao:.6f}")
print(f"math.sin exato:    {exato:.6f}")
print(f"Erro absoluto:     {abs(exato - aproximacao):.2e}")
`,
  },
  {
    name: 'Juros Compostos Contínuos',
    code: `# Montante com Capitalização Contínua: M = C * e^(r * t)
import math

capital = 1000.0  # R$ 1.000,00
taxa = 0.08       # 8% ao ano
tempo = 5         # 5 anos

montante = capital * math.exp(taxa * tempo)
print(f"Capital Inicial: R$ {capital:.2f}")
print(f"Montante Final:   R$ {montante:.2f}")
print(f"Juros obtidos:    R$ {(montante - capital):.2f}")
`,
  },
];
