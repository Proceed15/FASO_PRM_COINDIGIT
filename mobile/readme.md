# Mobile App - Acesso Rápido

## 1. Visão Geral
A versão móvel da corretora foca em agilidade, permitindo que o usuário consulte saldo e realize transferências rápidas através de uma interface nativa e responsiva desenvolvida em Flutter. O aplicativo se comunica exclusivamente com o API Gateway para realizar suas operações.

## 2. Tecnologias Utilizadas
* **Framework:** Flutter (UI Toolkit)
* **Linguagem:** Dart
* **Gerenciamento de Estado:** Provider / Bloc (conforme implementação)
* **Comunicação:** Dio / Http package (Consumo de API REST)
* **Armazenamento Seguro:** Flutter Secure Storage (para persistência de Tokens JWT)

## 3. Como Executar
**Pré-requisitos:** Flutter SDK instalado e um Emulador (Android/iOS) ou dispositivo físico configurado e conectado.

Para rodar o projeto:

```bash
# Navegue até a pasta mobile
cd mobile

# Baixe as dependências do projeto
flutter pub get

# Execute a aplicação no dispositivo selecionado
flutter run

```
# 4. Configuração de Rede (Gateway)
Como o aplicativo roda em um ambiente isolado (emulador ou celular), a configuração de rede difere da Web:

**Para Emulador Android:**

O endereço `localhost` da sua máquina de desenvolvimento é mapeado para `10.0.2.2.` Você deve configurar a URL base da API no código (geralmente em um arquivo de constantes, ex: `lib/constants.dart`):

```Dart
// Configuração para Android Emulator
const String BASE_URL = "[http://10.0.2.2:5000](http://10.0.2.2:5000)";
```

**Para Simulador iOS:**

O simulador iOS compartilha a rede do host, então pode-se utilizar:

```Dart
const String BASE_URL = "http://localhost:5000";
```

**Para Dispositivo Físico:**

O celular e o computador devem estar na mesma rede Wi-Fi. Utilize o IP da sua máquina (ex: `192.168.x.x`).

# 5. Funcionalidades Principais

1. **Autenticação Segura:** Login integrado à User API via Gateway, com armazenamento seguro do Token.

2. **Resumo de Carteira:** Visualização imediata do saldo total convertido em Dólar e lista de ativos.

3. **Transferência Rápida (P2P):** Fluxo otimizado para envio de valores entre usuários:

* Busca o destinatário.

* Valida saldo.

* Envia a transação para a Wallet API.

4. **Feedback Visual:** Notificações (Snackbars) instantâneas para sucesso ou falha nas operações financeiras.
