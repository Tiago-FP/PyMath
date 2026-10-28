# 🧮 PyMath — Calculadora Científica Educacional com Python & IA

Uma aplicação web moderna, interativa e educacional que une o rigor de uma **Calculadora Científica**, a didática da **programação em Python** (executada no próprio navegador via WebAssembly com Pyodide) e o poder da **Inteligência Artificial (Google Gemini)** para resolução passo a passo de problemas matemáticos em linguagem natural.

---

## ✨ Principais Funcionalidades

### 1. 🔬 Calculadora Científica Completa (Dark Neon)
- **Interface Dark Mode**: Design elegante em tons de ardósia profunda com destaques em azul e roxo neon, cantos arredondados e sombras suaves.
- **Display OLED/LCD Multilinha**: Visualização em alta precisão da expressão em edição e do resultado formatado com algarismos tabulares (`tabular-nums`).
- **Operações Científicas Avançadas**:
  - Aritmética básica (+, -, ×, ÷, %).
  - Potências e Raízes ($x^y$, $x^2$, $\sqrt{x}$, $\sqrt[3]{x}$, $e^x$, $10^x$).
  - Trigonometria e Inversas ($\sin$, $\cos$, $\tan$, $\arcsin$, $\arccos$, $\arctan$).
  - Logaritmos ($\log_{10}$, $\ln$).
  - Fatorial ($n!$) e Valor Absoluto ($|x|$).
  - Constantes fundamentais ($\pi$ e $e$).
- **Modo Angular Dinâmico (DEG / RAD)**: Alternância em tempo real com conversão automática de graus para radianos (`math.radians()`).
- **Memória & Teclado Físico**: Suporte às operações de memória ($MC$, $MR$, $M+$, $M-$) e digitação direta no teclado do computador.

---

### 2. 🐍 Modo Educacional & Execução Real de Python (Pyodide Wasm)
- **Transpilação Dinâmica**: Cada botão pressionado ou expressão digitada na calculadora gera automaticamente o script Python 3 equivalente utilizando o módulo `math`.
- **Explicação Didática Imediata**: Painel que descreve como cada função matemática é implementada em Python, domínios de validade, conversão de unidades e boas práticas.
- **Ambiente Pyodide no Navegador**: Execute o código Python em tempo real sem instalar nada na máquina local. O runtime WebAssembly compila o código e exibe a saída padrão (`stdout`) e tempo de execução em milissegundos.
- **Laboratório & Modelos Prontos**: REPL interativo com presets pedagógicos prontos:
  - *Teorema de Pitágoras*
  - *Fórmula de Bhaskara*
  - *Série de Taylor para Aproximação do Seno*
  - *Juros Compostos com Capitalização Contínua*

---

### 3. 🤖 Assistente Matemático com IA (Google Gemini)
- **Perguntas em Linguagem Natural**: Digite problemas como:
  - *"Qual a hipotenusa de um triângulo com catetos 3 e 4?"*
  - *"Resolva a equação 2x + 10 = 20"*
  - *"Qual a área de um círculo com raio 10?"*
  - *"Calcule a derivada de x^3 + 4x no ponto x=2"*
- **Raciocínio Passo a Passo**: A IA decompõe a resolução em passos didáticos numerados e explicados em português.
- **Integração com Visor**: Botão **"Enviar para Calculadora"** que transfere a expressão matemática resolvida diretamente para o visor.
- **Geração de Script Python**: Código Python auto-contido correspondente para cada resolução.

---

### 4. 📈 Plotador 2D Interativo de Funções
- Canvas vetorial responsivo para visualização de curvas cartesianas ($f(x) = \sin(x)$, $x^2 - 4$, $e^{x/2}$, $1/x$, etc.).
- Controles de zoom (in/out), redefinição de escala, linhas de grade e eixos coordenados.
- Leitura interativa de coordenadas $(x, y)$ ao passar o mouse sobre a curva.
- Gerador de código Python para plotagem com `numpy` e `matplotlib.pyplot`.

---

### 5. 📜 Histórico de Cálculos da Sessão
- Gravação persistente de todas as operações realizadas (Expressão = Resultado).
- Reutilização com um clique para carregar expressões de volta ao visor.
- Botão de cópia rápida e limpeza do histórico.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - [React 19](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS 4](https://tailwindcss.com/)
  - [Lucide React](https://lucide.dev/) (Ícones modernos)
  - [Pyodide](https://pyodide.org/) (Python 3.12 WebAssembly no browser)
- **Backend**:
  - [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
  - [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (`@google/genai`)
  - [Gemini 3.8 Flash](https://ai.google.dev/)
- **Ferramentas de Build**:
  - [Vite 8](https://vitejs.dev/)
  - [tsx](https://github.com/privatenumber/tsx) (Execução TypeScript nativa)

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- `npm` ou `bun` instalado
- Uma chave de API do Google Gemini ([obtenha gratuitamente no Google AI Studio](https://aistudio.google.com/app/apikey))

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/calculadora-cientifica-python-ia.git
cd calculadora-cientifica-python-ia
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
```bash
cp .env.example .env
```
Abra o arquivo `.env` e insira sua chave da API Gemini:
```env
GEMINI_API_KEY="sua_chave_aqui"
```

### 4. Iniciar em modo de desenvolvimento
```bash
npm run dev
```
Acesse no navegador: **`http://localhost:3000`**

### 5. Build para produção
```bash
npm run build
npm start
```

---

## 📂 Estrutura do Projeto

```
├── .env.example              # Exemplo de variáveis de ambiente
├── index.html                # Ponto de entrada HTML com Pyodide CDN e fontes
├── metadata.json             # Metadados e permissões da aplicação
├── package.json              # Dependências e scripts npm
├── server.ts                 # Backend Express com proxy seguro da API Gemini
├── src/
│   ├── App.tsx               # Componente raiz e orquestrador de painéis
│   ├── main.tsx              # Ponto de montagem React
│   ├── index.css             # Estilos globais e Tailwind CSS
│   ├── types.ts              # Definições de tipos TypeScript
│   ├── components/
│   │   ├── Header.tsx                 # Top bar de navegação
│   │   ├── ScientificCalculator.tsx   # Calculadora científica completa
│   │   ├── PythonEduPanel.tsx         # Modo educacional & REPL Pyodide
│   │   ├── FunctionPlotter.tsx        # Plotador 2D de funções em Canvas
│   │   ├── AiAssistant.tsx            # Assistente matemático com Gemini
│   │   ├── HistoryPanel.tsx           # Painel de histórico de cálculos
│   │   └── QuickGuideModal.tsx        # Modal de guia de uso e atalhos
│   └── services/
│       ├── mathEngine.ts      # Avaliador matemático e transpilação para Python
│       ├── pythonCatalog.ts   # Documentação didática e modelos matemáticos
│       └── pyodideService.ts  # Gerenciador do runtime WebAssembly Python
└── tsconfig.json             # Configuração TypeScript
```

---

## ⌨️ Atalhos de Teclado Suportados

| Tecla | Ação |
| :--- | :--- |
| `0` a `9` | Inserção de dígitos numéricos |
| `+`, `-`, `*`, `/` | Operadores aritméticos básicos |
| `^` | Potenciação / Exponenciação |
| `(` e `)` | Abertura e fechamento de parênteses |
| `Enter` ou `=` | Avaliar / Calcular expressão |
| `Backspace` | Apagar último caractere ou função |
| `Escape` | Limpar visor da calculadora (AC) |

---

## 📄 Licença

Este projeto é distribuído sob a licença [Apache-2.0](LICENSE).
Sinta-se à vontade para utilizar, modificar e expandir para fins educacionais ou profissionais!
