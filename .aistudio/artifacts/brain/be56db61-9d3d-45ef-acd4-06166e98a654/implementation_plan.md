# Calculadora Científica Educacional com Python & IA

Uma aplicação web interativa de calculadora científica com temática Dark Neon moderna, projetada para aprendizado prático de matemática e programação. A ferramenta integra cálculo científico de alta precisão, execução real de scripts e funções em Python via WebAssembly (Pyodide), um assistente de IA com Gemini para resolução passo a passo de questões em linguagem natural, plotador gráfico 2D e um laboratório educacional de código Python.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Decisões confirmadas com base nas suas preferências:
> - **Motor de Execução Python**: Pyodide (WebAssembly no navegador) para rodar código Python genuíno diretamente no cliente, com visualizador didático e editor interativo.
> - **Visualização Gráfica**: Módulo de plotagem 2D interativo com suporte a zoom, pan, e análise de funções matemáticas (ex.: $f(x) = \sin(x)$, $f(x) = x^2 - 4$).
> - **Disposição de Telas**: Layout integrado de painel triplo em tema Dark Neon com transições suaves (Calculadora Científica à esquerda, Visualizador Educacional de Python & Gráficos ao centro/topo, e Histórico de Cálculos & Assistente IA à direita/lateral).

---

### 1. Overview & Core Concept

- **O que faz**: Oferece uma calculadora científica completa (álgebra, trigonometria, logaritmos, fatoriais, potências e raízes) conectada em tempo real com código Python que a executa. Além de calcular com precisão, exibe o trecho de código Python equivalente para cada operação, permite editar e rodar scripts Python pelo Pyodide, desenha gráficos 2D de funções e conta com um Assistente de IA que responde a perguntas em linguagem natural (ex: *"Qual a hipotenusa de um triângulo com catetos 3 e 4?"* ou *"Resolva 2x + 10 = 20"*), preenchendo a calculadora e explicando a resolução detalhada.
- **Público-alvo**: Estudantes de ciências exatas, engenharia, professores e entusiastas de programação Python que desejam entender a relação prática entre operações matemáticas e algoritmos de código.
- **Valor Principal**: Desmistifica funções matemáticas complexas mostrando exatamente como são calculadas em Python, permitindo experimentação imediata no browser sem necessidade de instalar ambiente local.

---

### 2. User Experience & Visual Design

- **Fluxos Principais do Usuário**:
  1. *Cálculo Científico Instantâneo*: O usuário clica nos botões da calculadora ou digita pelo teclado. A fórmula é avaliada com precisão e salva no histórico com um clique para reutilização.
  2. *Modo Educacional Python*: Cada botão clicado ou expressão calculada atualiza instantaneamente o painel de código, exibindo a função Python correspondente (ex: `math.sin`, `math.sqrt`, `math.factorial`), a explicação conceitual e um botão "Executar no Pyodide" com saída em tempo real.
  3. *Assistente Matemático com IA*: O usuário digita uma dúvida ou problema em português no chat da IA. A IA divide a resolução em passos didáticos, destaca o resultado final e oferece a opção de aplicar a resposta diretamente ao visor da calculadora.
  4. *Plotador de Funções 2D*: Alterna para a visualização gráfica para explorar curvas matemáticas com visualização de eixos, escala e pontos notáveis.

- **Identidade Visual & Tema**:
  - *Estilo Estético*: Dark Neon sofisticado com visual limpo e moderno. Fundo escuro profundo com toques de azul elétrico e roxo suave para hierarquia visual de botões numéricos versus operadores científicos.
  - *Paleta de Cores (60-30-10)*:
    - 60% Fundo neutro escuro: `slate-950` (`#0b0f19`) e `slate-900` (`#0f172a`).
    - 30% Superfícies estruturais: superfícies de painel `slate-900/80` com bordas sutis `slate-800` e sombras suaves.
    - 10% Acentos focais: Azul neon (`#38bdf8` / `#2563eb`) para ações primárias e operadores principais; Roxo neon (`#a855f7` / `#8b5cf6`) para funções científicas e modo IA; Esmeralda (`#10b981`) para confirmação e saídas de sucesso do Python.
  - *Tipografia*: Fonte de exibição `Outfit` ou `Plus Jakarta Sans` para títulos e botões; `JetBrains Mono` ou `IBM Plex Mono` com algarismos tabulares (`tabular-nums`) para o visor da calculadora e o editor de código Python.
  - *Hierarquia do Teclado da Calculadora*:
    - Botões numéricos: visual clean em tons de cinza escuro de alto contraste.
    - Operações básicas: destaque sutil em ciano/azul.
    - Funções científicas: tom roxo elegante com rótulos matemáticos claros ($\sin$, $\cos$, $\tan$, $\log_{10}$, $\ln$, $x^y$, $\sqrt{x}$, $n!$, $\pi$, $e$).
    - Botão Igual ($=$): gradiente sutil azul/roxo neon com brilho suave.

- **Feedback Interativo & Movimento**:
  - Transições táteis rápidas ($\le 150$ms) ao clicar em teclas.
  - Notificações de cópia de código Python e reutilização de itens do histórico.
  - Efeito suave de carregamento ao consultar a IA e ao inicializar o Pyodide.

---

### 3. Key Product Decisions & Trade-Offs

- **Decisão 1: Execução Híbrida de Python no Navegador (Pyodide WebAssembly + Mapeamento Didático)**
  - *Abordagem*: Carregar o Pyodide sob demanda de forma assíncrona para permitir execução real de scripts Python e pacotes no navegador. Paralelamente, manter um catálogo reativo de funções e explicações pedagógicas pré-compiladas que garantem resposta instantânea mesmo enquanto o runtime carrega.
  - *Vantagem*: Combina agilidade imediata de resposta com o poder de um ambiente Python 3 real no navegador.
  - *Alternativas Consideradas*: Apenas simulação estática de código (rejeitada por não permitir ao estudante testar alterações) ou execução remota em servidor Python (rejeitada por latência e custo).

- **Decisão 2: Assistente Matemático com Gemini 3.8 Flash (Server-Side)**
  - *Abordagem*: Rota segura de backend `/api/ai/solve` utilizando o SDK oficial `@google/genai` com `gemini-3.8-flash`. Prompt estruturado para retornar:
    1. Resposta direta formatada
    2. Raciocínio matemático passo a passo
    3. Expressão pronta para inserir na calculadora
    4. Código Python gerado para reproduzir a solução
  - *Vantagem*: Alta velocidade de resposta, explicações pedagógicas em português natural e segurança absoluta de chaves de API.

- **Decisão 3: Visualizador Gráfico 2D em Canvas Vetorial Otimizado**
  - *Abordagem*: Renderizador 2D interativo com suporte a funções trigonométricas, polinomiais e exponenciais, com eixos cartesianos, linhas de grade, cálculo dinâmico de raízes e pontos críticos.
  - *Vantagem*: Totalmente integrado e sem dependências pesadas externas, com alta performance a 60 FPS.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          APLICAÇÃO WEB CLIENTE                              │
│                                                                             │
│  ┌─────────────────────────┐  ┌──────────────────────────────────────────┐  │
│  │   Top Bar Unificada     │  │  Tabs: Calculadora | Gráfico 2D | REPL   │  │
│  └───────────┬─────────────┘  └────────────────────┬─────────────────────┘  │
│              │                                     │                        │
│  ┌───────────▼─────────────┐  ┌────────────────────▼─────────────────────┐  │
│  │  Calculadora Científica │  │  Laboratório Educacional Python          │  │
│  │  - Display Multi-linha  │  │  - Snippet do Cálculo Atual              │  │
│  │  - Teclado Científico   │  │  - Explicação Didática da Função         │  │
│  │  - Ângulos: Rad / Deg   │  │  - Editor & Execução Real (Pyodide)      │  │
│  └───────────┬─────────────┘  └──────────────────────────────────────────┘  │
│              │                                                              │
│  ┌───────────▼───────────────────────────────────────────────────────────┐  │
│  │  Painel Lateral Retrátil / Acoplado                                   │  │
│  │  - Histórico de Operações (clique para carregar / reutilizar)         │  │
│  │  - Assistente Matemático IA (Pergunte ao Gemini + Enviar p/ Calc)     │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │ POST /api/ai/solve
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVER (Node.js / Express)                   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Proxy Seguro Gemini API (@google/genai, gemini-3.8-flash)            │  │
│  │  - Recebe pergunta matemática                                         │  │
│  │  - Gera passos didáticos, resultado numérico e código Python           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Entidades de Estado (State Management)**:
  - `calcState`: Expressão atual, resultado atual, modo de ângulo (`DEG` / `RAD`), memória ($M+$, $M-$, $MR$, $MC$).
  - `history`: Lista de operações `{ id, timestamp, expression, result, pythonCode, explanation }`.
  - `pythonWorkspace`: Código ativo no editor, saída do Pyodide (`stdout`, `stderr`), status do runtime (`loading`, `ready`, `error`).
  - `aiChat`: Histórico de mensagens com o assistente, status de carregamento e ações de "Inserir no Visor".
  - `graphConfig`: Expressão da função $f(x)$, limites de eixos $[x_{\min}, x_{\max}]$, $[y_{\min}, y_{\max}]$, e opções de amostragem.

- **Componentes e Mapeamento de Eventos**:
  - `CalculatorDisplay`: Mostra a expressão em progresso e o resultado formatado com separadores de milhar e precisão controlada.
  - `ScientificKeypad`: Botões com tratamento de teclado físico e cliques, suporte a parênteses balanceados e funções compostas.
  - `PythonExplainerPanel`: Exibe o código Python equivalente e sua documentação didática imediata (ex.: parâmetros de `math.atan2` ou `math.log10`).
  - `HistoryDrawer`: Histórico rolável com botões de "Usar Expressão", "Usar Resultado" e "Limpar Histórico".
  - `AiMathAssistant`: Input de linguagem natural com sugestões pré-definidas (Teorema de Pitágoras, Bhaskara, Juros Compostos, Derivadas básicas).
