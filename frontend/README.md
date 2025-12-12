# Frontend Web - Plataforma de Negociação

## 1. Visão Geral
A aplicação Web oferece a interface visual principal para os usuários operarem na corretora. Desenvolvida como uma Single Page Application (SPA), ela consome o API Gateway para exibir saldos, gráficos de cotação e permitir a interação via chat inteligente.

## 2. Tecnologias Utilizadas
* **Framework:** Next.js (React)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS
* **Gráficos:** Chart.js (ou biblioteca compatível para visualização de dados)
* **Comunicação:** Axios / Fetch API (HTTP REST)

## 3. Estrutura de Pastas
A organização do projeto segue o padrão do Next.js:

* `/components`: Componentes reutilizáveis de UI (Header, Sidebar, Chart, Chatbox).
* `/pages`: Rotas da aplicação (Login, Register, Dashboard, Trade).
* `/services`: Camada de abstração para chamadas HTTP ao Gateway.
* `/styles`: Configurações globais de CSS e temas do Tailwind.
* `/context`: Gerenciamento de estado global (ex: AuthContext para sessão do usuário).

## 4. Como Executar
**Pré-requisitos:** Node.js (v18+) e NPM instalados.

Para rodar o projeto localmente:

```bash
# Navegue até a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
Acesse a aplicação no navegador: http://localhost:3000
```
# 5. Configuração de Ambiente
Crie um arquivo .env.local na raiz para configurar o endereço do Gateway:

Snippet de código

NEXT_PUBLIC_API_URL=http://localhost:5000
# 6. Funcionalidades Principais
Autenticação: Telas de Login e Registro integradas à rota /user do Gateway. Armazena o JWT em cookies ou localStorage.

Dashboard Financeiro: Exibe o saldo total e a composição da carteira consumindo a rota /wallet.

Market Data: Lista criptomoedas e exibe gráficos de preço consumindo a rota /currency.

Smart Chat: Widget flutuante que envia comandos de texto para a rota /chatbot e exibe as respostas processadas.
