
# 🎬 EAREC | Cinematic Proposals System

[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-black?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

> **High-End Audiovisual Experience**
>
> Uma plataforma de orçamentos projetada para encantar clientes premium. Não é apenas sobre calcular preços, é sobre vender uma experiência visual desde o primeiro contato.

---

## ✨ Features Principais

*   **Cinematic UX:** Animações fluidas, transições de estado e feedback visual rico.
*   **Precificação Dinâmica:** Cálculo em tempo real considerando tipo de evento, horas, quantidade de mídia e adicionais.
*   **Logística Inteligente:** Integração com OpenStreetMap para cálculo automático de frete baseado na distância.
*   **Fluxo Seguro:** Painel administrativo protegido por senha para ajuste de preços base.
*   **Fechamento WhatsApp:** Geração automática de mensagem formatada para conversão imediata.

---

## 🏗 Arquitetura do Sistema

O projeto segue uma arquitetura **SPA (Single Page Application)** leve, gerenciada por uma máquina de estados finita no componente raiz (`App.tsx`).

### 🔄 Fluxo de Dados

1.  **Entrada (`IntroView`):** Landing page minimalista.
2.  **Captura (`WelcomeView`):** Validação de datas (API Calendar) e input de dados.
3.  **Configuração (`QuoteView`):** O coração da aplicação.
    *   *Categorização:* Social, Comercial, Estúdio, Produção.
    *   *Upsell:* Sugestão de adicionais (Drone, RealTime).
4.  **Revisão (`SummaryView`):** Edição final e seleção de pagamento (Pix, Cartão, Espécie).
5.  **Conversão (`SuccessView`):** Link direto para negociação.

---

## 📂 Estrutura de Código

```bash
src/
├── components/           # UI Blocks
│   ├── quote/            # Lógica de Negócio (UpsellList, Pricing)
│   └── ui/               # Design System (Buttons, Logos, Inputs)
│
├── data/                 # Configurações Estáticas
│   └── mock.ts           # ⚠️ PREÇOS BASE E API KEYS
│
├── lib/                  # Helpers & Logic
│   ├── maps.ts           # Cálculo Geográfico (Haversine)
│   ├── calendar.ts       # Validação de Agenda
│   └── security.ts       # Autenticação Admin
│
├── pages/                # Views da Aplicação
│   ├── QuoteView.tsx     # 🧠 Motor de Cálculo de Preço
│   └── ...
```

---

## 🚀 Como Manter e Editar

### 1. Alterar Tabela de Preços
O sistema possui dois níveis de configuração:
1.  **Valores Base (Km, Taxa Fixa):** Editáveis visualmente no `/admin` (Senha: XINGU) ou no arquivo `src/data/mock.ts`.
2.  **Regras de Negócio:** A lógica de composição (ex: Combo = Vídeo + Fotos) reside no hook `useMemo` dentro de `src/pages/QuoteView.tsx`.

### 2. Personalizar Serviços
Para adicionar um novo tipo de serviço (ex: "Podcast"), edite:
1.  `src/types/index.ts`: Adicione o ID ao tipo `ServiceId`.
2.  `src/pages/QuoteView.tsx`: Adicione a entrada na `PRICING_TABLE` e a lógica no `totalPrice`.
3.  `src/components/quote/UpsellList.tsx`: Adicione o Card visual na renderização.

### 3. Integrações (Maps & Calendar)
As chaves de API e configurações externas ficam centralizadas em `src/data/mock.ts`.
*   **Mapas:** Usa Nominatim (OpenSource), não requer chave.
*   **Calendar:** Requer Google API Key válida para funcionar em produção (Fallback automático para simulação em dev).

---

## 🎨 Design Guidelines

*   **Tipografia:** `Playfair Display` para elegância (Títulos) e `Inter` para legibilidade (UI).
*   **Cores:** Fundo `Neutral-950` (Deep Black) com acentos em `Brand-Red (#DC2626)`.
*   **Interação:** Tudo deve reagir ao cursor. Botões têm hover states, cards expandem, números rolam (slot machine effect).

---

*Desenvolvido com excelência para EAREC Mídia.*
