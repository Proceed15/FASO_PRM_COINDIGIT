# Gateway API - Porta de Entrada

## 1. Visão Geral
O **API Gateway** atua como um proxy reverso e ponto único de entrada para o Frontend e o Mobile. Ele roteia as requisições HTTP para os microserviços apropriados, simplificando a comunicação, centralizando políticas de acesso (CORS) e ocultando a complexidade da arquitetura interna.

## 2. Tecnologias Utilizadas
* **Linguagem:** C# (.NET 8)
* **Biblioteca:** Ocelot (Roteamento de API)
* **Comunicação:** HTTP (REST API)

## 3. Como Executar
**Pré-requisitos:** .NET SDK 8.0 instalado.

Para rodar o serviço localmente:

```bash
# Navegue até a pasta raiz do serviço
cd gatewayAPI

# Restaure as dependências
dotnet restore

# Execute a aplicação
dotnet run
```

O Gateway iniciará (por padrão) na porta: `http://localhost:5000` (ou conforme configurado no `launchSettings.json`).

## 4. Mapeamento de Rotas (Ocelot)

O arquivo `ocelot.json` define como as requisições externas são encaminhadas para os serviços internos:

Rota Externa (Gateway)Rota Interna (Microserviço)Destino (Host:Porta)/user/*/api/User/*User API (:5120)/wallet/*/api/Wallet/*Wallet API (:5004)/currency/*/api/Currency/*Currency API (:5002)/chatbot/*/analyzeChatbot API (:5005)

## 5. Configuração

* O Gateway deve ser o **primeiro serviço** a ser acessado pelos clientes (Frontend/Mobile).
  
* Certifique-se de que todos os microsserviços de destino estejam rodando para que o roteamento funcione corretamente.
  
* O CORS deve estar habilitado para permitir chamadas do Frontend (`:3000`) e dispositivos móveis.
