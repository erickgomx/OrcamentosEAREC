# 🔴 EAREC | Produtora Audiovisual & Orçamento Facilitado

[![React](https://img.shields.io/badge/React-19.0-20232A?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-007ACC?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-000000?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://www.earec.com.br/)

---

### **"High-End Audiovisual Experience"**
Plataforma web oficial da **EAREC** combinando:
1. **Landing Page Cinematográfica:** Apresentação da produtora com vídeo showreel em destaque, direção de arte e vitrine de serviços.
2. **Orçamento Facilitado:** Ferramenta interativa de cálculo de propostas comerciais em tempo real com envio formatado para o WhatsApp.

Site Oficial: **[www.earec.com.br](https://www.earec.com.br)**  
Orçamentador Direto: **[www.earec.com.br/orcamentos](https://www.earec.com.br/orcamentos)**

---

## 🌐 Estrutura de Rotas e URLs

A aplicação adota um roteador SPA leve (`src/hooks/useRouter.ts`) integrado com a *HTML5 History API*:

| Rota | Descrição | Componente Principal |
| :--- | :--- | :--- |
| `/` ou `/home` | **Home Cinematográfica:** Vídeo showreel em destaque, controles de áudio, serviços audiovisuais e botão para orçamentos. | `HomeView.tsx` |
| `/orcamentos` ou `/orçamentos` | **Orçamento Facilitado:** Simulador de valores, seleção de pacotes, cálculo de frete e envio no WhatsApp. | `ConfirmationView` $\rightarrow$ `QuoteView` |
| `/orcamentos?cat=wedding` | Abre o orçamentador já com a categoria específica pré-selecionada (*wedding*, *commercial*, *social*, *studio*, *video_production*). | `QuoteView.tsx` |
| `/admin` | **Painel de Controle:** Ajuste de preços base, taxa de quilômetro e diárias em tempo real. | `AdminDashboard.tsx` |

---

## 🎬 Vídeo de Apresentação (Showreel)

O vídeo da página inicial é reproduzido dentro de uma moldura de câmera (*HUD Viewfinder* com *timecode* ativo e resolução 4K DCI).

* **Reprodução Inteligente:** Inicia em *autoplay* e mudo (requisito dos navegadores modernos como Chrome, Safari e Edge para permitir inicialização sem clique).
* **Controles Interativos:**
  * 🔊 **Botão "Ativar Som / Áudio Ligado":** Permite ao visitante ouvir a trilha sonora com um único clique.
  * ⏯️ **Botão Play/Pause:** Pausa e retoma a reprodução.
  * ⛶ **Botão Modo Tela Cheia:** Abre o showreel em tela cheia imersiva.
* **Origem do Arquivo:** O arquivo padrão local fica salvo em `public/showreel.mp4`, garantindo carregamento instantâneo sem bloqueios de CORS ou servidores externos.

### 💡 Como Trocar o Vídeo no Futuro
Abra o arquivo [`src/config/AppConfig.ts`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/config/AppConfig.ts) e altere a seção `SHOWREEL`:

```typescript
static readonly SHOWREEL = {
  // Para usar um arquivo local: salve seu vídeo em 'public/showreel.mp4'
  VIDEO_URL: "/showreel.mp4",
  
  // Ou informe a URL direta de um MP4 hospedado (Vercel Blob, Supabase, Cloudflare, etc):
  // VIDEO_URL: "https://seu-servidor.com/video-earec.mp4",
  
  POSTER_URL: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80",
  TITLE: "EAREC Showreel",
  TAGLINE: "Histórias que emocionam. Imagens que marcam."
};
```

---

## 🗺️ Mapa Interativo e Logística (Google Maps Gratuito)

O modal de seleção de localidade ([`LocationMapModal.tsx`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/components/ui/LocationMapModal.tsx)) funciona **100% gratuitamente sem necessidade de chave de API**:

* **Camada Principal:** **Google Maps Roadmap** (`https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}`). Oferece renderização rápida, estética familiar do Google e detalhes completos de ruas do Brasil.
* **Redundância Automática (Fallback):** Caso a rede local do usuário oscile, o Leaflet alterna automaticamente para o **OpenStreetMap oficial**.
* **Geocodificação Reversa:** Ao arrastar o marcador vermelho no mapa, o endereço e cidade são detectados instantaneamente via Nominatim.
* **Cálculo de Frete:** A distância de deslocamento a partir da base (Goianinha/RN) é calculada com fator de tortuosidade rodoviária (1.35x a distância geodésica linear) e multiplicada pela taxa por KM definida no `AppConfig` ou Admin.

---

## ⏳ Transições e Animação de Carregamento (Buffer de 1,5s)

Para garantir uma percepção de alto padrão cinematográfico e evitar que telas "pisquem" rápido demais em computadores velozes:
* Ao clicar em **"Fazer Orçamento"**, **"Iniciar Orçamento"** ou avançar entre etapas, a animação de *Loading* permanece visível por **no mínimo 1,5 segundos (1500ms)**.
* O pulso da logo e a barra de progresso do `Loading.tsx` são sincronizados com esse ciclo de 1,5s.

---

## 🏗 Estrutura de Diretórios

```bash
├── public/                   # Arquivos estáticos servidos na raiz da Vercel
│   ├── showreel.mp4          # Vídeo padrão de apresentação
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
│   │       ├── LocationMapModal.tsx # Modal interativo com Google Maps
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
│   │   └── useRouter.ts      # Roteador SPA com suporte a History API e popstate
│   │
│   ├── lib/
│   │   ├── animations.ts     # Variantes centralizadas do Framer Motion
│   │   ├── maps.ts           # Algoritmo de cálculo de distância (Haversine)
│   │   └── utils.ts          # Formatadores de moeda (BRL), delays e classes
│   │
│   ├── pages/
│   │   ├── HomeView.tsx      # Landing Page Cinematográfica com Vídeo Showreel
│   │   ├── ConfirmationView.tsx # Tela tutorial explicativa ("Como Funciona?")
│   │   ├── IntroView.tsx     # Menu de opções (Orçamento Rápido / Instagram)
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
├── package.json              # Dependências e script de build com fallbacks
└── index.html                # HTML raiz com fontes, Tailwind e metatags OpenGraph
```

---

## 🚀 Deploy na Vercel e Prevenção de Erro 404

### Por que configuramos o `vercel.json` e fallbacks físicos?
Em SPAs (Single Page Applications) construídas com Vite, rotas como `/orcamentos` ou `/home` são virtuais e gerenciadas pelo JavaScript no navegador. Se o usuário der F5 ou acessar o link diretamente na Vercel, o servidor procuraria um arquivo físico chamado `orcamentos.html` e retornaria `404 NOT_FOUND`.

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
   * `dist/orcamentos.html`
   * `dist/404.html` (o arquivo padrão que a Vercel entrega quando uma rota não existe)

Dessa forma, a página **nunca** exibe tela de erro 404.

---

## 🛠️ Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento local
npm run dev

# Gerar build de produção e criar fallbacks estáticos
npm run build

# Visualizar o build de produção localmente
npm run preview
```

---

## 📝 Guia Rápido de Manutenção

### 1. Alterar o Número do WhatsApp
Em [`src/config/AppConfig.ts`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/config/AppConfig.ts), localize `BRAND.WHATSAPP` e altere o número (formato: DDI + DDD + Número, ex: `"5584981048857"`).

### 2. Alterar Preços de Pacotes ou Serviços
Os preços padrão estão todos centralizados na tabela `PRICING_TABLE` do [`src/config/AppConfig.ts`](file:///e:/Pessoal/2025/12%20-%20DEZ/EAREC%20OR%C3%87AMENTOS/src/config/AppConfig.ts). Basta editar os valores numéricos sem precisar mexer em nenhum componente visual.

### 3. Acessar o Painel Admin
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
