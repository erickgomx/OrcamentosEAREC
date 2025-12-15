# 🎥 EAREC | Sistema de Orçamentos Cinematográficos

Bem-vindo à documentação oficial do sistema de orçamentos da **EAREC**. 

Este projeto foi desenvolvido para oferecer uma experiência de venda **High-End**, onde o cliente não apenas vê preços, mas sente o valor da produção audiovisual através de uma interface imersiva, animada e responsiva.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído sobre uma stack moderna para garantir performance e facilidade de manutenção:

*   **React 18+**: Biblioteca principal para construção da interface.
*   **TypeScript**: Adiciona tipagem estática, reduzindo erros e facilitando o entendimento dos dados (ex: `QuoteData`, `ClientData`).
*   **Tailwind CSS**: Framework de estilização "utility-first" para design rápido e responsivo.
*   **Framer Motion**: Biblioteca poderosa para as animações complexas (entradas, saídas, modais).
*   **Lucide React**: Ícones leves e modernos.

---

## 📂 Estrutura do Projeto

Para facilitar a navegação, o código está organizado da seguinte forma:

```
src/
├── components/       # Blocos de construção da interface
│   ├── quote/        # Componentes específicos do Orçamento (Hero, Moodboard, Configurador)
│   └── ui/           # Componentes genéricos (Botões, Inputs, Loading, Logo)
├── data/             # Dados estáticos e regras de negócio
│   └── mock.ts       # ⚠️ AQUI VOCÊ EDITA PREÇOS E TEXTOS PADRÃO
├── lib/              # Funções utilitárias
│   ├── animations.ts # Configurações de animação (FadeIn, SlideUp)
│   └── utils.ts      # Formatadores de moeda e classes CSS
├── pages/            # As telas principais da aplicação
│   ├── IntroView     # Tela inicial (Escolha de caminho)
│   ├── WelcomeView   # Formulário de captação de dados
│   ├── QuoteView     # A tela principal do orçamento (Cálculos)
│   └── SuccessView   # Tela final de agradecimento
└── types/            # Definições de Tipos (TypeScript Interfaces)
```

---

## 🛠 Como Personalizar (Guia Rápido)

### 1. Alterar Preços e Valores Base
Todo o controle financeiro está centralizado em um único arquivo.
*   **Arquivo:** `src/data/mock.ts`
*   **O que editar:**
    *   `basePrice`: Valor mínimo para mobilização da equipe.
    *   `photoUnitPrice`: Valor por foto extra (atualmente R$ 25,00).
    *   `videoUnitPrice`: Valor por vídeo extra (atualmente R$ 600,00).
    *   `pricePerKm`: Custo de logística por KM.

### 2. Alterar a Logo
*   Substitua o componente `src/components/ui/Logo.tsx` ou edite o SVG dentro dele para alterar a marca visual.

### 3. Ajustar Textos e Títulos
*   Os textos "Cinematográficos" (ex: frases de efeito no Hero) estão dentro dos componentes em `src/components/quote/`.

---

## 📦 Instalação e Execução

Se você é um desenvolvedor e baixou este código:

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Rode o servidor local:**
    ```bash
    npm run dev
    ```

3.  **Build para Produção:**
    ```bash
    npm run build
    ```

---

## 💡 Dicas de Desenvolvimento

*   **Comentários:** O código está amplamente comentado em português para facilitar o entendimento da lógica.
*   **Performance:** Imagens externas (Moodboard) devem ser otimizadas. No código atual, usamos links diretos (`ibb.co`), mas recomenda-se hospedar localmente ou em um CDN próprio.
