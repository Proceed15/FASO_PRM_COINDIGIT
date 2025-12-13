# 🎬 Roteiro de Demonstração (DEMO)

Este documento guia a apresentação do projeto "Corretora de Criptomoedas", garantindo que todos os requisitos funcionais e técnicos sejam demonstrados para a banca avaliadora.

**Tempo Estimado:** 10 minutos.

---

## 🏁 1. Preparação (Antes de começar)

Certifique-se de que o ambiente está limpo e rodando:

- [ ] **Backend:** Todas as APIs (`User`, `Wallet`, `Currency`, `Chatbot`) e o `Gateway` estão rodando.
- [ ] **Banco de Dados:** (Opcional) Apagar o arquivo `.db` do SQLite para começar com dados zerados (ou garantir que já existam alguns usuários como "Usuário_Exemplo" e "Isabel").
- [ ] **Frontend Web:** Rodando em `localhost:3000`.
- [ ] **Mobile:** Emulador aberto e app rodando.
- [ ] **Logs:** Deixar os terminais das APIs visíveis (ou o Console do IDE) para mostrar as requisições acontecendo.

---

## 🎭 2. O Roteiro (Passo a Passo)

### CENA 1: O Novo Investidor (Frontend Web)
**Narrativa:** "Vamos começar cadastrando um novo usuário na plataforma Web."

1.  **Acessar Web:** Abrir `http://localhost:3000`.
2.  **Registro:**
    * Clicar em "Criar Conta".
    * Nome: `Usuário_Exemplo`
    * Email: `Usuário_Exemplo@fatec.sp.gov.br`
    * Senha: `1234`
    * *Ação:* Clicar em Cadastrar.
3.  **Login:**
    * Logar com as credenciais criadas.
    * **Mostrar:** O Dashboard inicia com **Saldo $0.00**.
    * *Técnico:* Mencionar que o Token JWT foi gerado e salvo.

### CENA 2: Analisando o Mercado (Currency API)
**Narrativa:** "O usuário verifica as cotações antes de investir."

1.  **Navegação:** Ir para a aba "Mercado" ou "Cotações".
2.  **Visualização:**
    * Mostrar a lista de moedas (BTC, ETH, SOL).
    * Clicar no Bitcoin.
    * **Mostrar:** Gráfico ou valor atualizado.
    * *Técnico:* Explicar que esses dados vêm da `Currency API` via Gateway.

### CENA 3: O Chatbot Inteligente (Injeção de Fundos)
**Narrativa:** "Para operar, precisamos de saldo. Vamos usar o Chatbot com IA para facilitar isso."

1.  **Ação:** Abrir o Widget de Chatbot.
2.  **Identificação:**
    * Digitar: `Meu nome é Usuário_Exemplo`
    * Resposta esperada: "Olá Usuário_Exemplo! (ID: XX)".
3.  **Consulta Vazia:**
    * Digitar: `Qual meu saldo?`
    * Resposta esperada: "Saldo: $ 0.00".
4.  **Depósito (O Grande Momento):**
    * Digitar: `Depositar 10000 USD`
    * Resposta esperada: "Depósito realizado com sucesso".
5.  **Validação:**
    * Atualizar a página do Dashboard.
    * **Mostrar:** O saldo agora é **$ 10,000.00**.

### CENA 4: A Segunda Usuária (Mobile)
**Narrativa:** "Agora, vamos mostrar a integração multiplataforma. Uma segunda usuária acessará pelo celular."

1.  **Ação:** Abrir o Emulador Android/iOS.
2.  **Login:**
    * Usuário: `Isabel` (previamente cadastrada) ou criar nova.
    * Senha: `123`.
3.  **Home:**
    * Mostrar que a interface é nativa (Flutter).
    * Mostrar o saldo atual dela (ex: $ 0.00).

### CENA 5: Transferência P2P (Web -> Mobile)
**Narrativa:** "O Usuário_Exemplo vai transferir Bitcoin para a Isabel em tempo real."

1.  **Voltar para a Web (Usuário_Exemplo):**
    * Abrir o Chatbot novamente (ou tela de transferência).
2.  **Comando Complexo:**
    * Digitar: `Transferir 0.5 BTC para Isabel`
    * *Obs:* O Bot precisa calcular quanto vale 0.5 BTC em Dólar na hora e fazer a transação.
    * Resposta esperada: "Transferência realizada de 0.5 BTC para Isabel".
3.  **Verificação na Web:**
    * Mostrar que o saldo do Usuário_Exemplo diminuiu.

### CENA 6: Confirmação no Mobile
**Narrativa:** "Vamos ver se a Isabel recebeu instantaneamente."

1.  **Voltar para o Mobile (Isabel):**
    * Puxar para atualizar (ou clicar em atualizar).
    * **Mostrar:** O saldo da Isabel aumentou (valor equivalente a 0.5 BTC).
    * **Mostrar:** Histórico de transações (se houver essa tela) com a entrada recebida.

---

## 🔍 3. Destaques Técnicos (Para responder à banca)

Se o professor perguntar "Como isso funcionou?", mostre:

1.  **Gateway:** "Tudo passou pela porta 5000. O Frontend não falou direto com a Wallet."
2.  **Sincronismo:** "Quando o Usuário_Exemplo transferiu, a WalletAPI chamou a CurrencyAPI para ver o preço do BTC naquele milissegundo antes de aprovar."
3.  **Segurança:** "Se tentarmos transferir sem saldo, a API retorna Erro 400 (Bad Request), validando a regra de negócio."

---

## ⚠️ 4. Plano de Contingência (Se algo der errado)

* **API caiu?** Reinicie o projeto no Visual Studio.
* **Chatbot não entendeu?** Use o comando exato do script, evite gírias.
* **Mobile não conecta?** Verifique se o IP no `constants.dart` está `10.0.2.2` (Android) ou o IP da máquina (Físico).

