# Currency API - Microsserviço de Cotações

## 1. Visão Geral
A **Currency API** fornece dados de mercado em tempo real (simulado ou espelhado) para o sistema. Ela mantém o cadastro de moedas suportadas (ex: BTC, ETH, USDT) e seus históricos de preço, servindo como fonte de verdade para conversões de valor.

## 2. Tecnologias Utilizadas
* **Linguagem:** C# (.NET 8)
* **Arquitetura:** Clean Architecture
* **Persistência:** SQLite / In-Memory (para dados voláteis de preço)
* **Comunicação:** HTTP (REST API)

## 3. Estrutura do Projeto
O projeto segue o padrão de **Clean Architecture**:

* `API`: Controllers (`CurrencyController`, `CurrencyChartController`) e DTOs.
* `Application`: Serviços de consulta de preços e lógica de atualização.
* `Domain`: Entidades (`Currency`, `History`) e Interfaces.
* `Infrastructure`: Repositórios e contexto de dados.

## 4. Como Executar
**Pré-requisitos:** .NET SDK 8.0 instalado.

Para rodar o serviço localmente:

```bash
# Navegue até a pasta raiz do serviço
cd currencyAPI

# Restaure as dependências
dotnet restore

# Execute a aplicação
dotnet run
O serviço iniciará (por padrão) na porta: http://localhost:50025. Endpoints PrincipaisMétodoRotaDescriçãoGET/api/CurrencyLista todas as moedas cadastradas e seus preços atuais.GET/api/Currency/{symbol}Busca detalhes e histórico de uma moeda específica (ex: BTC).GET/api/CurrencyChart/top-currenciesRetorna dados formatados e simplificados para renderização de gráficos no Frontend.6. Dicionário de DadosO serviço suporta mais de 300 ativos, incluindo:Cripto: BTC, ETH, SOL, BNB, XRP, etc.Stablecoins: USDT, USDC.Fiats (Simulado): USD, BRL.7. IntegraçõesA Currency API é passiva e responde a consultas de outros serviços via HTTP:Wallet API: Consulta preços para validar trades e calcular o saldo total do usuário.Chatbot API: Consulta cotações solicitadas pelos usuários via chat.
Quando estiver pronto, digite **"próximo"** para eu enviar o do **Gateway API**.
