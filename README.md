# 🔴 EAREC | Orçamento Facilitado

[![React](https://img.shields.io/badge/React-19.0-20232A?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-007ACC?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-000000?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

---

### **"High-End Audiovisual Experience"**
Uma plataforma de orçamentos projetada para encantar clientes premium. Muito além de uma calculadora, o sistema oferece uma **experiência imersiva e cinematográfica** desde o primeiro contato, refletindo a qualidade visual das produções da EAREC.

---

## ✨ Features Principais

*   **🎬 Cinematic UX:** Fundo dinâmico com FilmStrips, transições de estado, feedback tátil e animações suaves.
*   **⚡ Modo Rápido:** Opção de "Orçamento Flash" para usuários que desejam pular a introdução e ir direto aos valores.
*   **💰 Precificação Dinâmica:** Motor de cálculo (`PricingEngine`) em tempo real que considera tipo de evento, horas, quantidade de mídia e adicionais.
*   **🗺️ Logística Inteligente:** Integração com OpenStreetMap (Nominatim) para cálculo automático de frete baseado na distância real de condução. Ajustado para ser responsivo e bem apresentado em dispositivos móveis.
*   **📅 Validação de Agenda:** Integração segura com Google Calendar (suporte a .env).
*   **⚡ Aprovação Imediata:** Confirmação direta do orçamento com geração instantânea do ticket e despacho para WhatsApp, eliminando atritos de assinatura.
*   **🔐 Painel Administrativo:** Área segura para ajuste de preços base sem necessidade de deploy.
*   **✨ Cards Cinematográficos & Badges Perfeitos:** Cards com cantos perfeitamente recortados (`overflow-hidden`), botão de informações à esquerda e selo **Popular** (`Sparkles`) posicionado exclusivamente à direita, sem sobreposições ou vazamentos.
*   **📱 Mobile First:** Design responsivo e otimizado para qualquer dispositivo.

---

## 🏗 Arquitetura do Projeto

O projeto segue uma arquitetura **SPA (Single Page Application)** leve com separação clara de responsabilidades (SOLID).

### 📂 Estrutura de Diretórios

```bash
src/
├── components/           # Blocos de Construção da UI
│   ├── quote/            # Componentes de Negócio (Lógica de Venda)
│   │   ├── UpsellList    # Seletor visual de serviços e adicionais
│   │   ├── StickyFooter  # Barra de totalização e ação
│   │   └── Moodboard     # Galeria visual (Parallax)
│   └── ui/               # Design System (Botões, Inputs, Logos, FilmStrips)
│
├── config/               # Configurações Estáticas
│   └── AppConfig.ts      # Singleton com textos, branding e tabelas de preço
│
├── core/                 # Lógica de Negócio Pura
│   └── PricingEngine.ts  # Motor de cálculo de preços (Strategy Pattern)
│
├── data/                 # Camada de Dados
│   └── mock.ts           # Configurações iniciais e placeholders
│
├── lib/                  # Utilitários
│   ├── animations.ts     # Variantes do Framer Motion centralizadas
│   └── utils.ts          # Formatadores e helpers
│
├── pages/                # Telas Principais (Views)
│   ├── IntroView.tsx     # Landing page com botões sólidos e minimalistas (Iniciar Orçamento / Instagram EAREC)
│   ├── WelcomeView.tsx   # Wizard de captação de dados
│   ├── QuoteView.tsx     # Configurador de Orçamento
│   ├── SummaryView.tsx   # Resumo do Pedido e Pagamento
│   ├── SuccessView.tsx   # Mensagem final e link WhatsApp
│   └── AdminDashboard.tsx# Painel de controle protegido
│
├── services/             # Serviços Externos
│   ├── AuthService.ts    # Autenticação Admin
│   ├── CalendarService.ts# Google Calendar API
│   └── LocationService.ts# OpenStreetMap / Nominatim API
│
└── types/                # Definições de Tipo (TypeScript)
    └── index.ts          # Interfaces centrais (ClientData, QuoteData)
```

---

## 🔄 Sistema de Rotas SPA Modular & Extensibilidade de Novas Páginas

A aplicação adota um **Roteador SPA Nativo de alta performance** ([`useRouter`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/hooks/useRouter.ts)), operando via HTML5 History API (`pushState` e `popstate`). 

### ⚡ O roteamento deixa o site mais lento?
**Não! Pelo contrário:**
1. **0ms de Latência de Rede:** Não há recarregamento completo da página (full page reload). Ao mudar de rota, apenas o componente React alvo é renderizado em memória.
2. **Code-Splitting Inteligente (`React.lazy` + `Suspense`):** Cada página gera um chunk JavaScript separado. O visitante baixa apenas o que precisa, deixando a carga inicial até mais rápida do que ter tudo em uma única URL monolítica.
3. **Deep Linking & Compartilhamento:** Permite enviar links diretos pelo WhatsApp ou redes sociais (ex: `site.com.br/portfolio` ou `site.com.br/orcamento`).
4. **Histórico Nativo do Navegador:** Os botões nativos de "Voltar" e "Avançar" do navegador e do celular funcionam perfeitamente sem perder o estado.

### 🌐 Rotas Disponíveis

* **`/inicio`** (aliases `/`, `/home`): Landing page cinematográfica com efeito typewriter, botões de ação e acesso rápido.
* **`/orcamento`** (aliases `/quote`): Configurador interativo com cálculo em tempo real de horas, diárias, fotos e vídeos.
* **`/resumo`**: Tela de revisão com detalhamento financeiro, cálculo de frete e seleção de pagamento.
* **`/sucesso`**: Tela de confirmação e geração de código de pedido único com despacho para WhatsApp.
* **`/portfolio`**: Vitrine audiovisual cinematográfica demonstrando produções, depoimentos e métricas.
* **`/admin`**: Painel seguro para ajuste dinâmico de tabelas de preços e KM.

### 🧩 Como criar novas páginas no futuro (3 passos simples):
1. Crie a tela em `src/pages/SuaPagina.tsx`.
2. Em [`src/hooks/useRouter.ts`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/hooks/useRouter.ts), adicione o identificador da rota no tipo `AppRoute` e no mapeamento de pathnames.
3. Em [`src/App.tsx`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/App.tsx), importe via `lazy(() => import('./pages/SuaPagina'))` e adicione o bloco condicional dentro do `<AnimatePresence>`.

> **Suporte a Refresh / F5 e Hospedagem:**
> O arquivo `vercel.json` garante reescrita para a raiz em qualquer rota, e o comando `npm run build` gera automaticamente fallbacks estáticos (`404.html`, `inicio.html`, `orcamento.html`, `orcamentos.html`, `resumo.html`, `sucesso.html`, `portfolio.html`).

---

## ⚙️ Configuração e Instalação

### Pré-requisitos
*   Node.js 18+
*   NPM ou Yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/earec-proposals.git

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Configuração de APIs (Segurança)

Nunca insira chaves de API diretamente no código fonte. Para habilitar recursos reais, utilize variáveis de ambiente.
Crie um arquivo `.env` na raiz do projeto (se utilizar Vite ou similar):

```env
VITE_GOOGLE_API_KEY=SuaChaveAqui
VITE_GOOGLE_CALENDAR_ID=SeuIDDeCalendario
```

*   **Google Calendar:** Se as chaves acima não forem fornecidas, o sistema rodará em **Modo Simulação** (Mock), permitindo o uso da interface sem integração real.
*   **Mapas:** O sistema utiliza OpenStreetMap (Nominatim), que é gratuito e não requer chave para uso moderado.

---

## 🚀 Deploy / Atualizações Online

Quando usar uma plataforma de preview/deploy automático (como Google AI Studio Build ou Vercel):
* O **Preview** reflete o ambiente de desenvolvimento em tempo real.
* O **Link Compartilhado (Produção)** precisa ser atualizado manualmente em alguns casos. Para refletir as novas alterações em produção, vá na opção de **Share / Export** (ou Deploy) da plataforma novamente para forçar um novo build e distribuição.

---

## 🔒 Segurança e Admin

O painel administrativo (`/admin` acessível via ícone de cadeado na tela de Welcome) permite alterar os preços base (Km, Taxa de Estúdio, etc.) em tempo de execução.

> **Nota:** A senha padrão está definida no arquivo `src/services/AuthService.ts`. Recomenda-se alterá-la para produção.

---

## 🎨 Identidade Visual

*   **Tipografia:**
    *   *Playfair Display*: Títulos e Ênfases (Elegância).
    *   *Inter*: Interface, Botões e Textos Correntes.
    *   *Plus Jakarta Sans* (`font-price`): Tipografia dedicada de alta legibilidade para valores monetários (R$), contadores numéricos (horas, fotos, vídeos) e badges de preço, configurada com `tabular-nums lining-nums` para eliminar irregularidades de numerais antigos.
*   **Cores:**
    *   🌑 Fundo: `Neutral-950` (#0a0a0a) - "Deep Black"
    *   🔴 Marca: `Brand-Red` (#DC2626) - Acentos e Calls-to-Action.

---
*Desenvolvido com excelência para EAREC Mídia.*

## 📅 Últimas Atualizações

### [04/10/2026] Otimização Mobile do Teclado, Interação da Logo & Código Aleatório de Pedido
* **Resolução do Teclado Mobile no Input (`WelcomeView.tsx` & `index.html`):**
  * Adicionado `interactive-widget=resizes-content` na meta tag `viewport` para gerenciamento nativo do espaço com o teclado virtual no celular.
  * Removido `overflow-hidden` rígido e centralização forçada que empurrava o input para fora do viewport. Container agora possui rolagem vertical natural (`overflow-y-auto`) e alinhamento inteligente `my-auto`.
  * Auto-rolagem suave (`scrollIntoView`) ao focar no campo de digitação para garantir visibilidade e centralização imediata acima do teclado.
  * Padding e espaçamentos do formulário calibrados para telas móveis.
* **Comportamento Puro no Clique da Logo (`Logo.tsx` & `QuoteView.tsx`):**
  * Removido o botão de navegação que envolvia a Logo no cabeçalho do configurador.
  * O clique sobre o logotipo agora executa estritamente a animação de brilho e revela a assinatura *"Revelando seu melhor"*, sem navegar para a home ou reiniciar o estado do usuário.
### [04/10/2026] Otimização da Animação da Logo & Remoção da Página de Assinatura
* **Ajuste da Animação de Pulsar da Logomarca (`Logo.tsx`):**
  * Reduzida a escala máxima do anel de expansão/pulso de `2.5x` para `1.7x`, criando um efeito de pulso luminoso mais sofisticado, contido e cinematográfico.
  * Adicionado `transformOrigin: "135px 33px"` garantindo expansão perfeitamente concêntrica a partir do centro do círculo REC.
  * O `viewBox` do SVG foi ampliado para `60 -10 240 85` e recebeu `overflow-visible`, garantindo margem inferior confortável para que a animação e o brilho nunca sejam cortados ou truncados.
* **Remoção da Página de Assinatura (`QuoteView.tsx`, `SummaryView.tsx`, `useQuoteLogic.ts`):**
  * Removido o modal e canvas de desenho de assinatura manuscrita (`SignatureModal.tsx`), eliminando fricção e etapas burocráticas no funil de contratação.
  * O botão no resumo (`SummaryView`) agora confirma o orçamento diretamente via `onConfirm`/`handleConfirmQuote`, conduzindo o usuário imediatamente ao ticket final (`SuccessView`) com o link pronto para envio no WhatsApp.
  * Bundle final otimizado com redução de tamanho graças ao tree-shaking das dependências de assinatura.

### [04/10/2026] Tipografia Typewriter, Alinhamento de Botões, Limpeza Visual e Cards em Cascata
* **Remoção de Badge Superior por Excesso (`IntroView.tsx`):** Removido o badge "Cinema & Produção Audiovisual" acima do logotipo, simplificando a composição da página inicial e destacando a logomarca da EAREC.
* **Centralização Matemática dos Textos dos Botões (`IntroView.tsx`):** Os botões "Iniciar Orçamento" e "Instagram EAREC" agora possuem elementos laterais com larguras perfeitamente idênticas (`w-11 h-11 sm:w-12 sm:h-12`) para o ícone da esquerda e a seta da direita, garantindo que o texto central (`flex-1 text-center`) fique rigorosamente no centro físico do botão em qualquer resolução.
* **Efeito de Digitação Cinematográfico (`TypewriterText` em `IntroView.tsx`):** O texto *"Você já conhece nosso trabalho ou deseja fazer um orçamento?"* agora surge dinamicamente como se estivesse sendo digitado em tempo real (~36ms por caractere), acompanhado de um cursor pulsante vermelho que se apaga suavemente ao término da digitação, com altura mínima garantida para evitar layout shifts.
* **Resolução Definitiva do Conflito de Animação dos Cards (`UpsellList.tsx` & `animations.ts`):**
  * **Compatibilidade Total de Variantes:** `cardItemVariants` agora responde nativamente tanto a `hidden`/`visible` quanto a `enter`/`center`, eliminando conflitos de propagação originados pelo `wizardStepVariants` do configurador.
  * **Cálculo de Delay por Índice (`custom={index}`):** Todos os cards de categorias (`CategoryCard`), serviços (`ServiceCard`), adicionais (`AddonCard`) e pacotes customizados (`ProductionControlItem`) agora recebem índices ordinais explícitos (0, 1, 2, 3...) com delay incremental de 80ms (`delay: i * 0.08`), surgindo em cascata cinematográfica suave e orgânica independente de re-layouts do DOM.
  * **Chaveamento Dinâmico de Grid (`services-grid-${category}`):** O container de grid foi chaveado com a categoria ativa, garantindo que a animação gradativa seja disparada novamente a cada troca de categoria.

### [04/10/2026] Correções de UX: Teclado Virtual Mobile, Isolamento de Logo e Código de Pedido Dinâmico
* **Eliminação de Container Fixo e Degradê Conflitante:** Removida a antiga caixa fixa (`fixed bottom-[170px]`) e o degradê de fundo de 450px em `UpsellList.tsx`, que colidia e ficava sobreposto aos cards das fileiras inferiores (ex: Casamento, Social, Comercial) em telas móveis e ao rolar a página.
* **Painel Integrado no Fluxo Natural do Layout:** Os detalhes e a descrição completa do pacote selecionado agora são renderizados em um painel dedicado logo abaixo do grid de cards (`mt-4 sm:mt-6`), garantindo que os cards nunca mais sobreponham o texto explicativo.
* **Aprimoramento Estrutural em `ServiceCard`:**
  * Estrutura flex interna em `justify-between` com altura proporcional (`min-h-[160px] sm:min-h-[190px] md:min-h-[220px]`).
  * Inclusão de botão discreto com ícone de ajuda (`HelpCircle`) para consulta rápida dos detalhes completos do pacote via modal popup.
* **Harmonização do Container em `QuoteView.tsx`:** Otimização dos paddings laterais e inferiores (`px-4 sm:px-6 md:px-8 pb-32 sm:pb-36`) para respiro visual impecável acima do `StickyFooter`.

### [04/10/2026] Harmonização e Equilíbrio Visual: Textos, Cards e Botões
* **Eliminação de Textos Microscópicos:** Remoção de tamanhos ilegíveis em telas menores (`text-[8px]`, `text-[9px]`, `text-[10px]`), substituídos por tamanhos confortáveis e responsivos (`text-xs sm:text-sm` e `text-sm sm:text-base`).
* **Cards e Módulos Proporcionais (`UpsellList.tsx`):**
  * `CategoryCard`: Altura mínima balanceada (`min-h-[145px] sm:min-h-[175px] md:min-h-[200px]`), ícones ampliados com fundo contrastante suave e descrições perfeitamente legíveis.
  * `ServiceCard` & `AddonCard`: Hierarquia clara entre título do pacote, descrição da composição e badges de preço (`font-price`) e destaque ("Popular").
  * `ProductionControlItem`: Contadores de horas, fotos e vídeos com tipografia generosa e botões de incremento/decremento com áreas de toque acessíveis.
* **Harmonização de Botões e CTAs (`Button.tsx`, `StickyFooter.tsx`, `IntroView.tsx`):**
  * Ajuste em todos os tamanhos (`sm`, `md`, `lg`) com tipografia nítida e padding equilibrado.
  * Botões principais da página inicial ("Iniciar Orçamento" e "Instagram EAREC") com hierarquia nobre e ícones alinhados.
  * Rodapé Fixo (`StickyFooter`): Destaque elegante para o "Valor Estimado", tipografia de valor total de alto impacto (`text-2xl sm:text-3xl md:text-4xl font-price`) e botão de ação rápido.
* **Resumo e Checkout Elegantes (`SummaryView.tsx`):** Textos descritivos, discriminador de itens e CTA de confirmação reescalonados para clareza máxima de entendimento pelo cliente.

### [04/10/2026] API Gratuita do Google, Saída Individual Orgânica & Otimização de Performance
* **API Gratuita do Google (Google Maps Tiles):** Integração restaurada e otimizada da camada de mapa oficial do Google Maps Roadmap (`https://{s}.google.com/vt/lyrs=m...` via subdomínios `mt0` a `mt3`), 100% gratuita, sem necessidade de chave paga ou fatura, com `preconnect` no `index.html` para latência zero e fallback dinâmico para OpenStreetMap.
* **Saída Individual Orgânica por Elemento (Sem Bloco Rígido):** A página não sai mais como um bloco retangular estático. Cada componente filho (Badge, Logotipo, Título, Botões de Ação, Cards de Serviços, Divisores, Inputs e Rodapé) possui sua própria animação física com aceleração orgânica (`CINE_EASE_ORGANIC [0.32, 0, 0.67, 0]`) e desfoque óptico, saindo em efeito cascata escalonado (`staggerChildren: 0.045, staggerDirection: -1`).
* **Entrada Cinematográfica Suave:** Os elementos entram em cascata física natural (`[0.16, 1, 0.3, 1]`), proporcionando uma experiência de movimento contínuo e vivo.
* **Otimização Extrema de Performance & Leveza:**
  * **Code Splitting Inteligente no Vite (`manualChunks`):** Separação em chunks dedicados (`vendor-react`, `vendor-motion`, `vendor-map`, `vendor-icons`), reduzindo o tempo de carregamento inicial e otimizando o cache de navegador via HTTP/2.
  * **Aceleração por Hardware (GPU):** Regras de aceleração via `.gpu-accelerated` e aceleração composicional no CSS (`translate3d(0,0,0)`, `will-change`).
  * **Cache em Memória de Logística:** `LocationService` agora guarda consultas de geolocalização e distâncias em cache (`Map`), eliminando requisições duplicadas e tornando cálculos repetidos instantâneos.

### [04/10/2026] Renovação Visual & Sistema de Animações Fluidas Deslizantes
* **Física Cinematográfica e Curva Bezier (`CINE_EASE [0.16, 1, 0.3, 1]`):** Novo motor de animações com curvas de desaceleração suave, física elástica (Spring) e desfoque óptico (`filter: blur`) coordenado em entradas e saídas.
* **Transição Bidirecional Deslizante entre Rotas (`/inicio` <-> `/orcamento`):** Navegação fluida que detecta avanço ou retorno, deslizando as telas para a esquerda ao avançar e para a direita ao voltar (`pageSlideVariants` com `routeDirection`).
* **Etapas do Configurador Deslizantes (`wizardStepVariants`):** Deslizamento direcional nos passos de `QuoteView` e `WelcomeView`, corrigindo e refinando o fluxo de troca de etapas.
* **Modais com Slide Vertical & Backdrop Blur:** `SignatureModal`, `AddonUpsellModal` e menus flutuantes agora abrem deslizando suavemente de baixo para cima com desfoque de fundo profundo.
* **Refinamento Estético e Micro-interações:** Cards e botões atualizados com glassmorphism (`backdrop-blur-md`), bordas com iluminação sutil, feedback tátil com molas responsivas e botões de controle otimizados.

### [04/10/2026] Sistema de Rotas (/inicio e /orcamento) & Tipografia de Valores
* **Roteamento SPA Nativo (`/inicio` e `/orcamento`):** Implementado hook de roteamento leve `useRouter` integrado à History API (`pushState`/`popState`), permitindo URLs diretas `/inicio` e `/orcamento` sem recarregar a página, além de suporte de retorno suave (`← Início` no topo e logo clicável).
* **Servidor e Deploy Sem Erro 404:** Adicionado `vercel.json` com regra de rewrite e automação no `package.json` para gerar cópias estáticas de fallback (`404.html`, `inicio.html`, `orcamento.html`, `orcamentos.html`).
* **Nova Fonte para Valores (`font-price`):** Substituídos todos os valores monetários e contadores numéricos que usavam `font-serif` pela nova classe `font-price` baseada em *Plus Jakarta Sans* com numerais alinhados e tabulares.
* **Botões da Página Inicial Sólidos:** Botões "Iniciar Orçamento" e "Instagram EAREC" com fundo sólido escuro sem degradês ou brilhos exagerados.
* **Otimização de Splash Screen:** Exibição inteligente apenas na primeira carga da sessão (`sessionStorage`), acelerando instantaneamente a navegação entre rotas.

### [14/08/2026] Refinamento Lógico e Visual
* **Painel de Comercial vs Pessoal:** A lógica de cálculo do motor de preços (`PricingEngine`) foi corrigida para aplicar corretamente os valores extras baseados na escolha do tipo de projeto (Comercial vs Pessoa Física).
* **Tooltips de Preço:** O componente `PriceTooltip` nos botões de soma agora exibe o valor correto do acréscimo de serviços (ex: H/Extra de estúdio para R$ 175) de forma dinâmica ao invés de ficar travado em R$ 0.
* **Layout Adaptativo (Estúdio):** Quando o usuário seleciona a categoria Estúdio e a visualização é de "Tempo de Cobertura", a caixa de "Quantidade" foi removida para simplificar a visualização, evitando redundância.
* **Textos de Pagamento:** Os textos explicativos para os métodos de pagamento **Pix** e **Espécie** foram atualizados no SummaryView para: "Pagamento de 50% para marcar e 50% até a data de realização do serviço."
* **Card Personalizado:** Adicionado o card "Personalizado" na seção "Comercial".
* **Promoção de Fotos Estúdio:** Mínimo de fotos alterado para 7. Ao atingir 13 ou mais fotos, o valor da 13ª fica cravado em 250 (preço promocional) com um selo "Promoção" aparecendo no seletor de quantidade.
