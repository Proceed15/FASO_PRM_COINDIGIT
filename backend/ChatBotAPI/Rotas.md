# Chat Bot API
### Chat Bot para Análise de Texto e Processamento de Operações
# Rotas do ChatBot
Aqui há todas as rotas dos microserviços que o ChatBot consome para executar seus comandos (Endereço Integral).

## 👤 UserAPI (Identificação)

* **Buscar Usuário por Nome (Login):**
    `GET http://localhost:5120/api/User`

## 💰 WalletAPI (Carteira e Transações)

* **Consultar Saldo / Verificar Carteira:**
    `GET http://localhost:5004/api/Wallet/{userId}`

* **Criar Carteira (Caso usuário não tenha):**
    `POST http://localhost:5004/api/Wallet/{userId}`

* **Realizar Depósito (Injeção de Fundos):**
    `POST http://localhost:5004/api/Wallet/{userId}/{walletId}/items`

* **Realizar Transferência (P2P):**
    `POST http://localhost:5004/api/Wallet/transfer`

## 📈 CurrencyAPI (Cotações)

* **Consultar Preços e Histórico:**
    `GET http://localhost:5002/api/Currency`