# EAREC | Plataforma Audiovisual & Simulador de Orçamentos

[![React](https://img.shields.io/badge/React-18.3-20232A?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-007ACC?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Three.js](https://img.shields.io/badge/Three.js_%2F_R3F-WebGL-000000?style=for-the-badge&logo=threedotjs)](https://threejs.org/)

Aplicação web SPA da **EA REC Mídia** que reúne o **Simulador Interativo de Orçamentos**, a **Experiência 3D da Produtora** (`/produtora`) e a **Vitrine de Portfólio** (`/portfolio`) em uma interface responsiva com alternância de tema Claro/Escuro.

---

## Principais Módulos

- **Simulador Interativo de Orçamentos (`/orcamento`):** Configurador em etapas para seleção de categorias, pacotes, adicionais e forma de pagamento, com cálculo em tempo real (`PricingEngine`), estimativa de deslocamento via OpenStreetMap/Nominatim + mapa interativo (`Leaflet`) e despacho direto da proposta para o WhatsApp com suporte a QR Code.
- **Experiência 3D da Produtora (`/produtora`):** Página interativa carregada sob demanda (`React.lazy`) com cenas WebGL (`@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`), scroll suave (`GSAP` + `Lenis`), showcase de equipamentos 3D, scrubber de pós-produção, galeria de reels, galeria fotográfica e apresentação da equipe.
- **Vitrine de Portfólio (`/portfolio`):** Apresentação de produções e categorias com acesso direto ao simulador.
- **Suporte a Tema Claro/Escuro:** Detecção inicial sem flash de tema (`index.html`) com persistência local via `ThemeContext`.

---

## Rotas da Aplicação

| Rota | Descrição |
| :--- | :--- |
| `/` | Tela inicial de boas-vindas (*Como funciona*) |
| `/inicio` | Hub principal com acesso ao simulador e à produtora |
| `/orcamento` | Configurador interativo de orçamento, resumo e envio |
| `/portfolio` | Vitrine audiovisual de produções |
| `/produtora` | Experiência WebGL 3D da produtora |

---

## Estrutura de Diretórios

```text
├── public/                 # Assets estáticos (3D .glb, vídeos, fotos, texturas, favicon, _redirects, .htaccess)
├── src/
│   ├── main.tsx            # Ponto de entrada da aplicação React
│   ├── App.tsx             # Orquestrador de rotas SPA, splash screen e lazy loading
│   ├── index.css           # Estilos globais e diretivas Tailwind CSS
│   ├── pages/              # Telas principais (Confirmation, Intro, Welcome, Quote, Summary, Success, Portfolio)
│   ├── components/
│   │   ├── quote/          # Componentes do configurador (UpsellList, StickyFooter)
│   │   └── ui/             # Design system reutilizável (Logo, Button, Loading, LocationMapModal, ThemeToggle, etc.)
│   ├── produtora/          # Módulo isolado da experiência 3D (/produtora)
│   ├── core/               # Motor de cálculo de orçamentos (PricingEngine)
│   ├── services/           # Integrações externas (CalendarService, LocationService)
│   ├── config/             # Configurações de UI/catálogo (AppConfig) e leitura segura de env (EnvConfig)
│   ├── hooks/              # Hooks de estado e lógica do orçamento (useQuoteLogic)
│   ├── context/            # Contexto global de tema (ThemeContext)
│   ├── lib/                # Variantes de animação (Framer Motion) e utilitários
│   ├── data/               # Estrutura inicial padrão de proposta
│   └── types/              # Definições TypeScript de domínio
├── index.html              # Documento HTML base, fontes e metadados
├── vercel.json             # Rewrites SPA e cabeçalhos de segurança HTTP
└── vite.config.ts          # Configuração Vite, chunk splitting e otimização de CSS
```

---

## Como Executar Localmente

### Pré-requisitos
- Node.js 18+
- npm

### Instalação e Desenvolvimento

```bash
# 1. Clone o repositório
git clone https://github.com/erickgomx/OrcamentosEAREC.git
cd OrcamentosEAREC

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

### Build de Produção e Preview

```bash
# Gera o bundle otimizado em dist/ e cria os fallbacks estáticos das rotas
npm run build

# Visualiza localmente o build de produção
npm run preview
```

---

## Variáveis de Ambiente (Opcional)

Não armazene chaves ou credenciais no código-fonte. Caso deseje habilitar a verificação real de datas via Google Calendar, copie o arquivo `.env.example` para `.env.local` e preencha as variáveis abaixo:

```env
VITE_GOOGLE_API_KEY=
VITE_GOOGLE_CALENDAR_ID=
```

> Sem essas variáveis configuradas, o serviço de agenda opera automaticamente em modo de simulação para que o simulador funcione normalmente em ambiente local ou preview.

---

## Deploy

- **Vercel:** Configurado via `vercel.json` com rewrite SPA (`/(.*) -> /`) e headers de segurança (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
- **Hospedagem Estática / Apache / Netlify / Cloudflare Pages:** O script `npm run build` gera `404.html` e páginas HTML estáticas para as rotas principais em `dist/`, além de incluir `public/.htaccess` e `public/_redirects` no pacote final.

---

*Desenvolvido para EA REC Mídia.*
