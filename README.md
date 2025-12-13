# CoinDigit, Projeto de Corretora de Criptomoedas

**Disciplina:** Programação Multiplataforma / Integração de Sistemas  
**Orientador:** André Cassulino Araújo Souza  
**Faculdade de Tecnologia de Sorocaba (FATEC)**

### Integrantes do Grupo
* **Adrian da Paz Marandola**
* **Felipe Salcedo Ramalho**
* **Isabel Almeida da Silva**
* **José Roberto Lisboa da Silva Filho**
* **Luiz Gabriel Rodrigues Frei**

---

## 1. Visão Geral do Projeto

O projeto interdisciplinar tem como objetivo o **desenvolvimento de uma aplicação multiplataforma** inspirada em corretoras de criptomoedas, como a Binance.

O sistema permite **autenticação de usuários**, **exibição de carteiras e ativos**, **simulação de transações** (depósitos e transferências P2P) e **interação via chatbot**, integrando diferentes tecnologias e conceitos de sistemas distribuídos.

A arquitetura baseia-se em **microserviços independentes**, com **comunicação síncrona** orquestrada via **API Gateway**.

**Principais tecnologias utilizadas:**

* **Backend:** .NET 8 (C#) com arquitetura limpa (Clean Architecture)
* **Frontend Web:** Next.js + TypeScript + Tailwind CSS
* **Mobile:** Flutter (Dart)
* **Chatbot:** Python (Requests + Flask + SpaCy)
* **Gateway:** Ocelot (.NET)
* **Banco de dados:** SQLite (Individual por microserviço)
* **Controle de versão:** GitHub
* **Controle de Tarefas:** Github Projects

---

## 2. Arquitetura da Aplicação

### 2.1 Estrutura Geral

O sistema é composto por **quatro APIs principais** e um **API Gateway** centralizador.

| API | Função principal |
| :--- | :--- |
| **UserAPI** | Cadastro, autenticação (JWT) e busca de usuários. |
| **WalletAPI** | Controle de carteiras, saldos, depósitos e transferências. |
| **CurrencyAPI** | Consulta de cotações em tempo real e histórico de preços. |
| **ChatbotAPI** | Processamento de Linguagem Natural (NLP) para comandos via chat. |
| **GatewayAPI** | Ponto único de entrada (Proxy Reverso) para Frontend e Mobile. |

### 2.2 Componentes de Frontend e Mobile

* **Frontend (Next.js):** Interface web completa para gestão de ativos, visualização de gráficos e interação com o Chatbot.
* **Mobile (Flutter):** Aplicação nativa focada em agilidade, permitindo consulta de saldo e transferências rápidas.

### 2.3 Comunicação entre Componentes

* **Síncrona (REST/HTTP):** Toda a comunicação entre o Frontend/Mobile e o Backend passa pelo **GatewayAPI**. A comunicação entre microserviços (ex: Wallet chamando Currency) também é feita via chamadas HTTP diretas para garantir a consistência imediata dos dados.

---

## 3. Estrutura de Pastas e Clean Architecture

A arquitetura segue o padrão **Clean Architecture**, garantindo separação de responsabilidades e desacoplamento.

### 3.1 Estrutura Base de um Microserviço (.NET)

```text
/nome-do-servico
  /API             # Controllers e DTOs (Entrada)
  /Application     # Casos de Uso e Services (Regras de Negócio)
  /Domain          # Entidades e Interfaces (Núcleo)
  /Infrastructure  # Banco de Dados e Repositórios (Persistência)
```
