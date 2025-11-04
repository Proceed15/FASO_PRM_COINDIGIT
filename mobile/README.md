# Tutorial Completo: Criando um App Flutter Básico com Dashboard

Este tutorial apresenta um passo a passo completo para quem deseja criar um aplicativo Flutter do zero, abordando desde a criação do projeto até a explicação da estrutura do código.

O exemplo final será um Dashboard simples com menu lateral (Drawer), tabela de dados e gráfico de barras usando o pacote `fl_chart`.

---

## 1. O que é Flutter

Flutter é um framework de código aberto criado pelo Google para desenvolver aplicativos multiplataforma (Android, iOS, Web, Desktop) com uma única base de código, utilizando a linguagem Dart.

O Flutter oferece:
- Desenvolvimento rápido com Hot Reload (atualização instantânea do app durante a edição).
- Interface moderna baseada em Widgets.
- Alto desempenho (usa renderização nativa).

---

## 2. Pré-requisitos

Antes de começar, é necessário ter instalado:
- [Flutter SDK](https://docs.flutter.dev/get-started/install)
- Dart SDK (vem junto com o Flutter)
- Android Studio ou Visual Studio Code (ambos com suporte a plugins Flutter e Dart)
- Emulador Android ou dispositivo físico conectado

---

## 3. Criando o Projeto

Abra o terminal e execute:

```bash
flutter create mobile
