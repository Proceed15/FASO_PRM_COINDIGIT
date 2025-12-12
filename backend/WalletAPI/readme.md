# Wallet API - Microsserviço de Carteiras

## 1. Visão Geral
A **Wallet API** é o núcleo financeiro do sistema. Ela gerencia o saldo dos usuários, controla múltiplas carteiras (Spot, Funding) e processa transações de depósito e transferência de ativos entre usuários de forma síncrona.

## 2. Tecnologias Utilizadas
* **Linguagem:** C# (.NET 8)
* **Arquitetura:** Clean Architecture
* **Banco de Dados:** SQLite
* **Comunicação:** HTTP (REST API)

## 3. Estrutura do Projeto
O projeto segue o padrão de **Clean Architecture** para garantir a separação de responsabilidades:

* `API`: Camada de entrada (Controllers, DTOs e Configurações).
* `Application`: Regras de negócio, Serviços de Domínio e Interfaces.
* `Domain`: Entidades (Wallet, WalletItem) e Interfaces de Repositório.
* `Infrastructure`: Acesso a dados (EF Core), Migrations e Implementação de Repositórios.

## 4. Como Executar
**Pré-requisitos:** .NET SDK 8.0 instalado.

Para rodar o serviço localmente:

```bash
# Navegue até a pasta raiz do serviço
cd walletAPI

# Restaure as dependências
dotnet restore

# Execute a aplicação
dotnet run
O serviço iniciará (por padrão) na porta: http://localhost:50045. Endpoints PrincipaisMétodoRotaDescriçãoGET/api/Wallet/{userId}Retorna todas as carteiras e o saldo total de um usuário.POST/api/Wallet/{userId}Cria uma nova carteira para o usuário (se necessário).GET/api/Wallet/{userId}/{walletId}Retorna detalhes de uma carteira específica.POST/api/Wallet/{userId}/{walletId}/itemsRealiza um Depósito (adiciona fundos/items à carteira).DELETE/api/Wallet/{userId}/{walletId}/items/{symbol}Remove um item/ativo específico da carteira.POST/api/Wallet/transferRealiza transferência de valores entre dois usuários (P2P).6. IntegraçõesA Wallet API se comunica diretamente via HTTP com outros serviços para validar operações:Currency API: Consumida para obter a cotação atual dos ativos (lastPriceUsd) e calcular o saldo total em Dólar.User API: Pode ser consultada para validar a existência de usuários antes de criar carteiras ou transferências.
