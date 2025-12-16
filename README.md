
# 🔴 EAREC | Cinematic Proposals System

[![React](https://img.shields.io/badge/React-19.0-20232A?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-007ACC?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-000000?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

---

### **"High-End Audiovisual Experience"**

Uma plataforma de orçamentos projetada para encantar clientes premium. Muito além de uma calculadora, o sistema oferece uma **experiência imersiva e cinematográfica** desde o primeiro contato, refletindo a qualidade visual das produções da EAREC.

---

## ✨ Features Principais

*   **🎬 Cinematic UX:** Animações fluidas, transições de estado, feedback tátil e visual rico.
*   **💰 Precificação Dinâmica:** Motor de cálculo em tempo real que considera tipo de evento, horas, quantidade de mídia e adicionais.
*   **🗺️ Logística Inteligente:** Integração com OpenStreetMap (Nominatim) para cálculo automático de frete baseado na distância real de condução.
*   **📅 Validação de Agenda:** Integração opcional com Google Calendar para verificação de disponibilidade.
*   **🔐 Painel Administrativo:** Área segura para ajuste de preços base sem necessidade de deploy.
*   **📱 Mobile First:** Design responsivo e otimizado para qualquer dispositivo.

---

## 🏗 Arquitetura do Projeto

O projeto segue uma arquitetura **SPA (Single Page Application)** leve, onde a navegação é controlada por uma máquina de estados finita no componente raiz. Isso garante transições instantâneas e uma sensação de "App Nativo".

### 📂 Estrutura de Diretórios

```bash
src/
├── components/           # Blocos de Construção da UI
│   ├── quote/            # Componentes de Negócio (Lógica de Venda)
│   │   ├── UpsellList    # Seletor visual de serviços e adicionais
│   │   ├── StickyFooter  # Barra de totalização e ação
│   │   └── Hero          # Cabeçalho imersivo com vídeo
│   └── ui/               # Design System (Botões, Inputs, Logos)
│
├── data/                 # Camada de Dados
│   └── mock.ts           # Configurações iniciais, chaves de API e preços default
│
├── lib/                  # Utilitários e Lógica Pura
│   ├── maps.ts           # Algoritmo de geocoding e cálculo de distância (Haversine)
│   ├── calendar.ts       # Serviço de verificação de disponibilidade
│   └── animations.ts     # Variantes do Framer Motion centralizadas
│
├── pages/                # Telas Principais (Views)
│   ├── IntroView.tsx     # Landing page minimalista
│   ├── WelcomeView.tsx   # Formulário de captação de dados
│   ├── QuoteView.tsx     # O "Cérebro" da aplicação (Configurador)
│   ├── SummaryView.tsx   # Revisão e fechamento
│   └── AdminDashboard.tsx# Painel de controle protegido
│
└── types/                # Definições de Tipo (TypeScript)
    └── index.ts          # Interfaces centrais (ClientData, QuoteData)
```

---

## 🔄 Fluxo de Dados (State Machine)

A aplicação não utiliza rotas tradicionais (`react-router`). O estado `view` em `App.tsx` controla o fluxo:

1.  **`intro`**: Tela inicial de boas-vindas.
2.  **`welcome`**: Coleta dados do cliente (Nome, Local, Data). Valida disponibilidade.
3.  **`quote`**: Onde a mágica acontece. O usuário monta o pacote. O sistema calcula frete e totais em tempo real.
4.  **`summary`**: Revisão final, edição de dados e escolha de pagamento.
5.  **`success`**: Gera a mensagem formatada para o WhatsApp e finaliza o fluxo.

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
npm start
```

### Configuração de APIs

Para habilitar recursos avançados, edite o arquivo `src/data/mock.ts`:

*   **Google Calendar:** Preencha `apiKey` e `calendarId` para ativar a verificação real de datas.
*   **Mapas:** O sistema utiliza OpenStreetMap (Nominatim), que é gratuito e não requer chave para uso moderado.

---

## 🔒 Segurança e Admin

O painel administrativo (`/admin` acessível via ícone de cadeado na tela de Welcome) permite alterar os preços base (Km, Taxa de Estúdio, etc.) em tempo de execução.

> **Nota:** A senha padrão está definida no arquivo `src/lib/security.ts`. Recomenda-se alterá-la para produção.

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
