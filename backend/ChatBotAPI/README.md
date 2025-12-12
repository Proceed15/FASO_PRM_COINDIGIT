# ChatBot_NLP_IA
ChatBot com Processamento de Texto, Análise de Sentimentos, Semântica, Sintática e Descoberta de Conhecimento em Textos
Algumas Explicações Sobre essa API de ChatBot.
Ela Pode ser Integrada a Outras Serviços qie Estiverem Rodando com algumas Modificações.

***

# Comandos e Funcionalidades - ChatBot API

Este documento resume as capacidades do **NLP Chatbot Analyzer**, um microserviço Python (Flask + SpaCy) projetado para interagir via linguagem natural com o ecossistema da Corretora de Criptomoedas.

---

## Visão Geral da Integração

O Chatbot atua como um orquestrador inteligente, interpretando a intenção do usuário e comunicando-se com as APIs de backend.

| Serviço Conectado | Porta | Função |
| :--- | :--- | :--- |
| **UserAPI** | `:5120` | Busca de ID de usuário por nome (Login). |
| **WalletAPI** | `:5004` | Consulta de saldo, criação de carteira, depósitos e transferências. |
| **CurrencyAPI** | `:5002` | Consulta de cotações em tempo real e histórico de preços. |

---

## Guia de Comandos

O processador de linguagem natural (NLP) foi treinado para reconhecer 5 intenções principais. Abaixo, os comandos suportados e seus fluxos.

### 1. Identificação (Login Simulado)
Como o Chatbot é um microserviço isolado, é necessário se identificar para estabelecer uma sessão na memória.

* **Comando:** `Meu nome é [Nome]` ou `Sou o [Nome]`
* **Ação:**
    1.  Consulta `GET /api/User` na **UserAPI**.
    2.  Filtra pelo nome (ex: "Apollo").
    3.  Armazena o `userId` (ex: 63) na sessão do Python.
* **Exemplo:**
    > "Meu nome é Apollo"
    > "Eu sou o Admin"

### 2. Consulta de Saldo
Verifica o patrimônio total do usuário logado.

* **Comando:** `Qual meu saldo?`, `Ver carteira`, `Minha conta`
* **Pré-requisito:** Estar identificado.
* **Ação:**
    1.  Consulta `GET /api/Wallet/{userId}` na **WalletAPI**.
    2.  Soma o campo `totalUsd` de todas as carteiras retornadas.
    3.  Lista os itens (BTC, ETH, etc.) se houver.
* **Exemplo:**
    > "Gostaria de ver meu saldo"

### 3. Cotação de Moedas
Verifica o preço atual de mercado de um ativo.

* **Comando:** `[Sigla]`, `Valor do [Sigla]`, `Preço [Sigla]`
* **Ação:**
    1.  Verifica se a sigla existe no **Dicionário de Dados** (324 moedas suportadas).
    2.  Consulta `GET /api/Currency` na **CurrencyAPI**.
    3.  Retorna o preço do registro histórico mais recente.
* **Exemplo:**
    > "Qual o valor do BTC?"
    > "Preço do ETH"
    > "USDT"

### 4. Depósito (Injeção de Fundos)
Cria fundos na carteira do usuário (funcionalidade para testes ou aporte inicial).

* **Comando:** `Depositar [Valor] [Moeda]`
* **Opcional:** `Depositar [Valor] [Moeda] para [Outro Usuário]`
* **Ação:**
    1.  Verifica se o usuário alvo tem carteira (se não, cria via `POST /api/Wallet/{id}`).
    2.  Executa `POST /api/Wallet/{userId}/{walletId}/items`.
* **Exemplo:**
    > "Depositar 1000 USD" (Na própria conta)
    > "Depositar 5000 USDT para Apollo" (Na conta de terceiros)

### 5. Transferência (P2P)
Move fundos reais de uma conta para outra (requer saldo existente).

* **Comando:** `Transferir [Valor] [Moeda] para [Destinatário]`
* **Pré-requisito:** Estar identificado e possuir saldo.
* **Ação:**
    1.  Busca ID do destinatário na **UserAPI**.
    2.  Busca IDs das carteiras de Origem e Destino.
    3.  Executa `POST /api/Wallet/transfer` na **WalletAPI**.
* **Exemplo:**
    > "Transferir 0.5 BTC para Maria"
    > "Enviar 100 USD para Admin"

---

## Estrutura Técnica (NLP Services)

A inteligência do bot reside no arquivo `services/nlp_services.py`, que opera com a seguinte lógica:

1.  **Sanitização:** Converte tudo para maiúsculo e remove pontuação.
2.  **Regex:** Extrai padrões complexos como valores numéricos (`\d+\.\d+`) e frases de apresentação (`MEU NOME É...`).
3.  **Dictionary Check:** Valida siglas financeiras contra um arquivo `core/dictionary.py` para evitar falsos positivos.
4.  **Fallback:** Se a API de destino retornar `null` ou erro, o Python trata a exceção para não quebrar a aplicação (ex: converte `None` para `0`).

---

## Roteiro de Teste Sugerido

Para validar o sistema completo, recomenda-se seguir a ordem abaixo:

1.  **Login:** `Meu nome é Apollo`
    * *Resultado esperado:* Confirmação de nome e exibição do ID (ex: 63).
2.  **Saldo Inicial:** `Qual meu saldo?`
    * *Resultado esperado:* Exibição do valor total e lista de ativos (se houver).
3.  **Aporte:** `Depositar 10000 USD`
    * *Resultado esperado:* Confirmação do depósito realizado.
4.  **Cotação:** `Qual o valor do BTC?`
    * *Resultado esperado:* Exibição do preço atual do ativo.
5.  **Troca de Usuário:** `Sou o Admin`
    * *Resultado esperado:* Login realizado no novo ID (ex: 1).
6.  **Transferência:** `Transferir 50 USD para Apollo`
    * *Resultado esperado:* Confirmação da transferência enviada para o usuário Apollo.

---

**Nota:** As portas das APIs (`5002`, `5004`, `5120`) devem estar ativas localmente para que o Chatbot funcione corretamente.





