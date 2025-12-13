# User API - Microsserviço de Autenticação

## 1. Visão Geral
A **User API** é o serviço responsável pelo gerenciamento de identidades, cadastro de usuários e autenticação no sistema. Ela implementa a segurança via tokens JWT e criptografia de senhas, garantindo que apenas usuários validados acessem os recursos protegidos através do Gateway.

## 2. Tecnologias Utilizadas
* **Linguagem:** C# (.NET 8)
* **Arquitetura:** Clean Architecture
* **Banco de Dados:** SQLite
* **Autenticação:** JWT (JSON Web Token)
* **Criptografia:** BCrypt.Net
* **Comunicação:** HTTP (REST API)

## 3. Estrutura do Projeto
O projeto segue rigorosamente o padrão de **Clean Architecture** para garantir desacoplamento e testabilidade:

* `API`: Camada de apresentação contendo Controllers, DTOs e configurações de injeção de dependência.
* `Application`: Contém a lógica de negócios, Casos de Uso (Use Cases) e Interfaces de Serviço.
* `Domain`: O núcleo do sistema, contendo as Entidades (User) e Interfaces de Repositório.
* `Infrastructure`: Implementação de acesso a dados (Entity Framework Core), Contexto do Banco e Repositórios.

## 4. Como Executar
**Pré-requisitos:** .NET SDK 8.0 instalado.

Para rodar o serviço localmente:

```bash
# Navegue até a pasta raiz do serviço
cd userAPI

# Restaure as dependências
dotnet restore

# Execute a aplicação
dotnet run
```
O serviço iniciará (por padrão) na porta: `http://localhost:5120`

## 5. Endpoints Principais

Abaixo estão as rotas essenciais para o funcionamento do sistema:

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **POST** | `/api/User/register` | Cria um novo usuário. Requer: Nome, Email e Senha. |
| **POST** | `/api/User/login` | Autentica o usuário. Retorna um objeto contendo o **Token JWT**. |
| **GET** | `/api/User` | Lista todos os usuários cadastrados (utilizado pelo Chatbot para encontrar IDs pelo nome). |
| **GET** | `/api/User/{id}` | Busca os detalhes públicos de um usuário específico pelo ID. |

## 6. Integrações

A User API é consumida principalmente por outros serviços para validar identidades:
* **Chatbot API:** Consulta a lista de usuários para traduzir nomes (ex: "Maria") em IDs técnicos (ex: 99) para realizar transferências.
* **Gateway API:** Centraliza as requisições de Login e Registro vindas do Frontend e Mobile.

## 7. Observações

* A base de dados SQLite é criada automaticamente na primeira execução (Code First).
* As chaves de segurança do JWT devem estar configuradas no `appsettings.json` para validar os tokens gerados.
