# 🔴 EAREC | Produtora Audiovisual & Orçamento Facilitado

[![React](https://img.shields.io/badge/React-19.0-20232A?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-007ACC?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-000000?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://www.earec.com.br/)

---

### **"High-End Audiovisual Experience"**
Plataforma web oficial da **EAREC Produtora Audiovisual**, projetada com estética cinematográfica e foco em conversão:
1. **Primeira Tela (Escolha Inicial):** Apresenta ao visitante a opção direta de conhecer o trabalho da produtora ou iniciar imediatamente uma simulação de orçamento.
2. **Página de Portfólio Renovada (`/portfolio`):** Interface limpa, minimalista e rápida, com o vídeo de apresentação (showreel) em destaque, galeria de outros trabalhos e botão dedicado para o Instagram oficial ao final.
3. **Orçamento Facilitado (`/orcamentos`):** Ferramenta interativa de cálculo de propostas comerciais em tempo real com envio formatado para o WhatsApp.
4. **Transições Fluidas:** Elementos deslizam e desaparecem suavemente com *stagger*, dando lugar aos novos itens da tela seguinte com elegância cinematográfica.

* Site Oficial: **[www.earec.com.br](https://www.earec.com.br)**  
* Portfólio & Showreel: **[www.earec.com.br/portfolio](https://www.earec.com.br/portfolio)**  
* Orçamentador Direto: **[www.earec.com.br/orcamentos](https://www.earec.com.br/orcamentos)**  

---

## 🌐 Estrutura de Rotas e Navegação

A aplicação adota um roteador SPA customizado e ultraleve ([`src/hooks/useRouter.ts`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/hooks/useRouter.ts)) integrado com a *HTML5 History API*:

| Rota | Descrição | Componente Principal |
| :--- | :--- | :--- |
| `/` ou `/home` | **Primeira Tela (Decisão Inicial):** Pergunta direta *"Você já conhece nosso trabalho ou deseja fazer um orçamento?"* com 2 opções de acesso limpo. | [`IntroView.tsx`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/pages/IntroView.tsx) |
| `/portfolio` ou `/portfólio` | **Página de Portfólio:** Vídeo showreel oficial em 4K, grade de Outros Trabalhos (Casamentos, Comerciais, Eventos, Estúdio & Drone) e botão de acesso ao Instagram no rodapé. | [`PortfolioView.tsx`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/pages/PortfolioView.tsx) |
| `/orcamentos` ou `/orçamentos` | **Orçamento Facilitado:** Simulador de valores, seleção de pacotes, cálculo de frete e envio no WhatsApp. | [`ConfirmationView`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/pages/ConfirmationView.tsx) $\rightarrow$ [`QuoteView`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/pages/QuoteView.tsx) |
| `/orcamentos?cat=wedding` | Abre o orçamentador já com a categoria específica pré-selecionada (*wedding*, *commercial*, *social*, *studio*, *video_production*). | [`QuoteView.tsx`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/pages/QuoteView.tsx) |
| `/admin` | **Painel de Controle:** Ajuste de preços base, taxa de quilômetro e diárias em tempo real. | [`AdminDashboard.tsx`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/pages/AdminDashboard.tsx) |

---

## 🎬 Fluxo do Usuário e Transições Fluidas

### 1. Primeira Tela (`IntroView.tsx`)
Ao acessar o site pela raiz (`/`), o visitante visualiza uma tela ultralimpa com o mínimo de texto possível:
* Logotipo cinematográfico EAREC.
* Pergunta central direta: *"Você já conhece nosso trabalho ou deseja um orçamento?"*
* **Opção 1 - Conhecer Trabalho:** Direciona para `/portfolio`.
* **Opção 2 - Iniciar Orçamento:** Direciona para `/orcamentos`.

### 2. Página de Portfólio (`PortfolioView.tsx`)
Design limpo, minimalista e 100% focado no visual:
* **Fundo Filmstrip 3D Sutil:** Ativo de forma suave e cinematográfica em todo o site.
* **Barra Superior Discreta:** Botão para voltar à tela inicial (`← Início`) e logotipo centralizado.
* **Vídeo Showreel (Apresentação):**
  * Player HTML5 widescreen (16:9) apontando para o arquivo local `public/showreel.mp4`.
  * HUD Viewfinder minimalista com *timecode* ativo.
  * Controles de reprodução: Play/Pause, Ativar/Silenciar Som e Tela Cheia.
* **Galeria de Destaques do Instagram (@earecmidia):**
  * Mídias reais salvas localmente em `public/portfolio/instagram/` (4 Vídeos Reels e 3 Ensaios Fotográficos).
  * Modal/Lightbox em tela cheia com carrossel de fotos, reprodução de vídeo com áudio e link para o post original.
* **Seção de Encerramento (Instagram Oficial):**
  * Destaque direto: *"Acompanhe Nosso Instagram"* com botão **"@earecmidia"**.
* **Único Botão Fixo de Orçamento:**
  * Botão flutuante sutil no canto inferior direito (`fixed bottom-6 right-6`), discreto e sempre ao alcance enquanto o usuário navega pelo portfólio.

### 3. Transições Fluidas (Framer Motion)
Configuradas em [`src/lib/animations.ts`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/lib/animations.ts) com `pageSlideVariants` e `slideFadeItem`:
* Ao sair de uma tela, os itens deslizam suavemente para o lado com fade out e desfoque sutil (`filter: blur`).
* Ao entrar na próxima tela, os itens deslizam em cascata (*staggerChildren: 0.08s*) surgindo de forma sequencial e fluida.

---

## 🗺️ Mapa Interativo e Logística (Google Maps Gratuito)

O modal de seleção de localidade ([`LocationMapModal.tsx`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/components/ui/LocationMapModal.tsx)) funciona **100% gratuitamente sem necessidade de chave de API**:

* **Camada Principal:** **Google Maps Roadmap** (`https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}`). Renderização rápida, estética familiar do Google e detalhes completos de ruas do Brasil.
* **Redundância Automática (Fallback):** Caso a rede local do usuário oscile, o Leaflet alterna automaticamente para o **OpenStreetMap oficial**.
* **Geocodificação Reversa:** Ao arrastar o marcador vermelho no mapa, o endereço e cidade são detectados instantaneamente via Nominatim.
* **Cálculo de Frete:** A distância de deslocamento a partir da base (Goianinha/RN) é calculada com fator de tortuosidade rodoviária (1.35x a distância geodésica linear) e multiplicada pela taxa por KM definida no `AppConfig` ou Admin.

---

## ⏳ Transições e Animação de Carregamento (Buffer de 1,5s)

Para garantir uma percepção de alto padrão cinematográfico e evitar que telas "pisquem" rápido demais em computadores velozes:
* Ao avançar de etapas com validação ou calcular orçamentos no wizard, a tela de *Loading* permanece visível por **no mínimo 1,5 segundos (1500ms)**.
* O pulso da logo e a barra de progresso do `Loading.tsx` são sincronizados com esse ciclo de 1,5s.

---

## 🏗 Estrutura de Diretórios

```bash
├── public/                   # Arquivos estáticos servidos na raiz da Vercel
│   ├── showreel.mp4          # Vídeo padrão de apresentação (local)
│   └── README.md
│
├── src/
│   ├── assets/               # Imagens e logos locais
│   │   └── logo.png
│   │
│   ├── components/
│   │   ├── quote/            # Componentes específicos do orçamentador
│   │   │   ├── UpsellList    # Seletor visual de serviços e adicionais
│   │   │   ├── StickyFooter  # Barra fixa inferior com totais e botões de ação
│   │   │   ├── SignatureModal# Canvas para assinatura manuscrita do cliente
│   │   │   └── Moodboard     # Galeria com efeito cross-parallax
│   │   │
│   │   └── ui/               # Componentes visuais do Design System
│   │       ├── Button.tsx    # Botão padrão com variantes e estados
│   │       ├── Loading.tsx   # Tela de carregamento com logo pulsante
│   │       ├── LocationMapModal.tsx # Modal interativo com Google Maps (gratuito)
│   │       └── Logo.tsx      # SVG animado oficial da marca EAREC
│   │
│   ├── config/
│   │   ├── AppConfig.ts      # Singleton: preços, textos, showreel e telefones
│   │   └── EnvConfig.ts      # Leitor seguro de variáveis de ambiente
│   │
│   ├── core/
│   │   └── PricingEngine.ts  # Motor de cálculo matemático de preços
│   │
│   ├── data/
│   │   └── mock.ts           # Configuração inicial e dados mockados
│   │
│   ├── hooks/
│   │   ├── useQuoteLogic.ts  # Toda a máquina de estado do orçamentador
│   │   └── useRouter.ts      # Roteador SPA com suporte a rotas /, /portfolio e /orcamentos
│   │
│   ├── lib/
│   │   ├── animations.ts     # Variantes centralizadas do Framer Motion (pageSlide, slideFadeItem)
│   │   ├── maps.ts           # Algoritmo de cálculo de distância (Haversine)
│   │   └── utils.ts          # Formatadores de moeda (BRL), delays e classes
│   │
│   ├── pages/
│   │   ├── IntroView.tsx     # Primeira Tela: Decisão (Conhecer Trabalho vs Iniciar Orçamento)
│   │   ├── PortfolioView.tsx # Página de Portfólio Limpa: Showreel + Outros Trabalhos + Instagram
│   │   ├── HomeView.tsx      # Reexportação para PortfolioView (retrocompatibilidade)
│   │   ├── ConfirmationView.tsx # Tela tutorial explicativa ("Como Funciona?")
│   │   ├── WelcomeView.tsx   # Wizard de captação de dados do cliente
│   │   ├── QuoteView.tsx     # Configurador de pacotes e adicionais
│   │   ├── SummaryView.tsx   # Resumo contratual e forma de pagamento
│   │   ├── SuccessView.tsx   # Tela de sucesso com link formatado de WhatsApp
│   │   └── AdminDashboard.tsx# Painel restrito para alteração de tabelas de preço
│   │
│   ├── services/
│   │   ├── AuthService.ts    # Validação de credenciais do painel admin
│   │   ├── CalendarService.ts# Verificação de disponibilidade de agenda
│   │   └── LocationService.ts# Cálculo de frete e coordenadas
│   │
│   └── types/
│       └── index.ts          # Tipos e interfaces de domínio (TypeScript)
│
├── vercel.json               # Regra de rewrites SPA para a Vercel
├── vite.config.ts            # Configuração do empacotador Vite
├── package.json              # Dependências e script de build com fallbacks físicos
└── index.html                # HTML raiz com fontes, Tailwind e metatags OpenGraph
```

---

## 🚀 Deploy na Vercel e Prevenção de Erro 404

### Como garantimos que o F5 nunca quebre em nenhuma rota:
Em SPAs (Single Page Applications) construídas com Vite, rotas como `/orcamentos`, `/portfolio` ou `/home` são virtuais e gerenciadas pelo JavaScript no navegador. Se o usuário recarregar (F5) ou acessar o link diretamente na Vercel, o servidor procura um arquivo físico correspondente.

Para solucionar isso definitivamente, implementamos uma **dupla camada de proteção**:
1. **[`vercel.json`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/vercel.json):**
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/"
       }
     ]
   }
   ```
2. **[`package.json`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/package.json):** O script de build gera automaticamente cópias estáticas no diretório `dist/`:
   * `dist/portfolio.html`
   * `dist/orcamentos.html`
   * `dist/404.html` (o arquivo padrão que a Vercel entrega quando uma rota não existe)

Dessa forma, a página **nunca** exibe tela de erro 404 na Vercel, seja em `/orcamentos`, `/portfolio` ou em qualquer subrota.

---

## 🛠️ Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento local
npm run dev

# Gerar build de produção e criar fallbacks estáticos (portfolio.html, orcamentos.html, 404.html)
npm run build

# Visualizar o build de produção localmente
npm run preview
```

---

## 📝 Guia Rápido de Manutenção

### 1. Alterar o Vídeo de Apresentação
Em [`src/config/AppConfig.ts`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/config/AppConfig.ts), localize `SHOWREEL.VIDEO_URL`:
- Para usar arquivo local: coloque em `public/showreel.mp4` e use `"/showreel.mp4"`.
- Para usar CDN ou Vercel Blob: insira o link direto do MP4.

### 2. Alterar o Link do Instagram ou WhatsApp
Em [`src/config/AppConfig.ts`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/config/AppConfig.ts):
- Instagram: `BRAND.INSTAGRAM_URL` (padrão: `https://www.instagram.com/earecmidia/`)
- WhatsApp: `BRAND.WHATSAPP` (padrão: `5584981048857`)

### 3. Alterar Preços de Pacotes ou Serviços
Os preços padrão estão todos centralizados na tabela `PRICING_TABLE` do [`src/config/AppConfig.ts`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/config/AppConfig.ts). Basta editar os valores numéricos sem precisar mexer em nenhum componente visual.

### 4. Acessar o Painel Admin
Acesse diretamente `www.earec.com.br/admin` (ou clique no ícone de cadeado na tela inicial do orçamentador). A senha de acesso pode ser verificada ou alterada em [`src/services/AuthService.ts`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/services/AuthService.ts).

---

## 🎨 Identidade Visual e Tokens

* **Cores:**
  * 🌑 Fundo: `#0a0a0a` (Deep Cinematic Black)
  * 🔴 Marca / Destaques: `#DC2626` (Red Brand Glow)
* **Tipografia:**
  * *Playfair Display*: Títulos de impacto e estética editorial de cinema.
  * *Inter*: Tipografia de alta legibilidade para tabelas, botões e valores.
  * *Michroma*: Detalhes técnicos, HUD e marcadores de foco.

---
*EAREC Produtora Audiovisual • Cinema, Comerciais, Casamentos e Conteúdo de Alto Impacto.*
