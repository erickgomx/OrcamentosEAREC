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
*   **✍️ Assinatura Digital:** Modal de assinatura manuscrita para aprovação formal.
*   **🔐 Painel Administrativo:** Área segura para ajuste de preços base sem necessidade de deploy.
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
│   │   ├── SignatureModal# Canvas de assinatura
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
│   ├── IntroView.tsx     # Landing page com opções (Instagram/Rápido/Normal)
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

## 🔄 Fluxo de Dados (State Machine)

A aplicação não utiliza rotas tradicionais (`react-router`). O estado `view` em `App.tsx` controla o fluxo:

1.  **`intro`**: Tela inicial de boas-vindas com fundo de filmstrip e opção de Orçamento Rápido.
2.  **`welcome`**: Coleta dados do cliente (Nome, Local, Data). Valida disponibilidade.
3.  **`quote`**: Onde a mágica acontece. O usuário monta o pacote. 
    *   *Nota:* O fundo de FilmStrip é ocultado aqui para foco total nos valores.
4.  **`summary`**: Revisão final, edição de dados e escolha de pagamento.
5.  **`success`**: Gera a mensagem formatada para o WhatsApp. O fundo de FilmStrip retorna para o encerramento.

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
    *   *Inter*: Interface e Textos (Legibilidade).
*   **Cores:**
    *   🌑 Fundo: `Neutral-950` (#0a0a0a) - "Deep Black"
    *   🔴 Marca: `Brand-Red` (#DC2626) - Acentos e Calls-to-Action.

---
*Desenvolvido com excelência para EAREC Mídia.*
