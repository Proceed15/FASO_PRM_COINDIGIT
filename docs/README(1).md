# Tutorial Completo: Criando um App Flutter Básico com Dashboard

Este tutorial apresenta um passo a passo completo para quem deseja criar um **aplicativo Flutter do zero**, abordando desde a criação do projeto até a explicação da **estrutura do código**.
O exemplo final será um **Dashboard** simples com **menu lateral (Drawer)**, **tabela de dados** e **gráfico de barras** usando o pacote **fl_chart**.


## 1. O que é Flutter

**Flutter** é um framework de código aberto criado pelo **Google** para desenvolver **aplicativos multiplataforma** (Android, iOS, Web, Desktop) com uma única base de código, utilizando a linguagem **Dart**.

O Flutter oferece:

* Desenvolvimento rápido com **Hot Reload** (atualização instantânea do app durante a edição).
* Interface moderna baseada em **Widgets**.
* Alto desempenho (usa renderização nativa).


## 2. Pré-requisitos

Antes de começar, é necessário ter instalado:

* **Flutter SDK**
  [https://docs.flutter.dev/get-started/install](https://docs.flutter.dev/get-started/install)

* **Dart SDK** (vem junto com o Flutter)

* **Android Studio** ou **Visual Studio Code**
  (ambos com suporte a plugins Flutter e Dart)

* **Emulador Android** ou **dispositivo físico conectado**


## 3. Criando o Projeto

Abra o terminal e execute:

```bash
flutter create mobile
```

Explicando o comando:

* `flutter create` → cria um novo projeto Flutter.
* `mobile` → é o nome da pasta e do projeto.

Ao final, você terá uma estrutura semelhante a:

```
mobile/
 ├── android/
 ├── ios/
 ├── lib/
 │    └── main.dart
 ├── test/
 ├── pubspec.yaml
 └── README.md
```


## 4. Estrutura do Projeto

### Principais pastas e arquivos:

* **lib/**
  Onde fica o código-fonte principal em Dart. O arquivo inicial é `main.dart`.

* **pubspec.yaml**
  Arquivo de configuração do projeto (nome, versão, dependências, assets).

* **android/** e **ios/**
  Contêm arquivos nativos específicos de cada plataforma.

* **test/**
  Armazena testes automatizados do aplicativo.


## 5. Atualizando o `pubspec.yaml`

Abra o arquivo `pubspec.yaml` e substitua o conteúdo por:

```yaml
name: mobile
description: "A new Flutter project."

publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: ^3.9.2

dependencies:
  flutter:
    sdk: flutter
  fl_chart: ^1.1.1
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^5.0.0

flutter:
  uses-material-design: true
```

Em seguida, no terminal dentro da pasta do projeto, execute:

```bash
flutter pub get
```

Este comando baixa e instala os pacotes listados em `dependencies`, como o `fl_chart`.


## 6. Estruturando o Código-Fonte

Dentro da pasta **lib**, crie uma subpasta chamada **pages**:

```
lib/
 ├── main.dart
 └── pages/
      └── dashboard_content.dart
```


## 7. Código do arquivo `lib/main.dart`

```dart
import 'package:flutter/material.dart';
import 'pages/dashboard_content.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Dashboard Flutter',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: DashboardPage(),
    );
  }
}

class DashboardPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Meu Dashboard')),
      drawer: Drawer(
        child: ListView(
          children: [
            DrawerHeader(
              decoration: BoxDecoration(color: Colors.blue),
              child: Text(
                'Menu',
                style: TextStyle(color: Colors.white, fontSize: 24),
              ),
            ),
            ListTile(leading: Icon(Icons.home), title: Text('Home')),
            ListTile(leading: Icon(Icons.settings), title: Text('Configurações')),
          ],
        ),
      ),
      body: DashboardContent(),
      bottomNavigationBar: BottomAppBar(
        child: Container(
          height: 50,
          alignment: Alignment.center,
          child: Text('© 2025 Minha Empresa'),
        ),
      ),
    );
  }
}
```

### Explicação das partes principais

* **`void main()`**: ponto de entrada do app. Executa `runApp()` e inicia a aplicação.
* **`MaterialApp`**: define o tema, o título e a tela inicial (`home`).
* **`Scaffold`**: estrutura básica da tela (AppBar, Drawer, Body, BottomBar).
* **`AppBar`**: barra superior com título.
* **`Drawer`**: menu lateral com opções.
* **`BottomAppBar`**: rodapé fixo com texto.
* **`DashboardContent()`**: conteúdo principal do dashboard (será criado no próximo passo).


## 8. Código do arquivo `lib/pages/dashboard_content.dart`

```dart
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class DashboardContent extends StatelessWidget {
  final List<Map<String, dynamic>> tableData = [
    {'Nome': 'Alice', 'Idade': 25, 'Cidade': 'São Paulo'},
    {'Nome': 'Bruno', 'Idade': 30, 'Cidade': 'Rio de Janeiro'},
    {'Nome': 'Carla', 'Idade': 28, 'Cidade': 'Belo Horizonte'},
  ];

  final List<BarChartGroupData> barGroups = [
    BarChartGroupData(x: 0, barRods: [BarChartRodData(toY: 50, color: Colors.blue)]),
    BarChartGroupData(x: 1, barRods: [BarChartRodData(toY: 75, color: Colors.blue)]),
    BarChartGroupData(x: 2, barRods: [BarChartRodData(toY: 100, color: Colors.blue)]),
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Tabela de Usuários',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          SizedBox(height: 10),

          // Tabela de dados
          DataTable(
            columns: [
              DataColumn(label: Text('Nome')),
              DataColumn(label: Text('Idade')),
              DataColumn(label: Text('Cidade')),
            ],
            rows: tableData
                .map(
                  (user) => DataRow(cells: [
                    DataCell(Text(user['Nome'])),
                    DataCell(Text(user['Idade'].toString())),
                    DataCell(Text(user['Cidade'])),
                  ]),
                )
                .toList(),
          ),

          SizedBox(height: 30),

          Text('Gráfico de Vendas',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),

          SizedBox(
            height: 200,
            child: BarChart(
              BarChartData(
                borderData: FlBorderData(show: false),
                titlesData: FlTitlesData(
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (value, meta) {
                        switch (value.toInt()) {
                          case 0:
                            return Text('Jan');
                          case 1:
                            return Text('Fev');
                          case 2:
                            return Text('Mar');
                          default:
                            return Text('');
                        }
                      },
                    ),
                  ),
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(showTitles: true),
                  ),
                ),
                barGroups: barGroups,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
```

### Explicação do código

* **`SingleChildScrollView`**: permite rolar o conteúdo caso ultrapasse o tamanho da tela.
* **`Column`**: organiza widgets verticalmente.
* **`DataTable`**: exibe dados em formato de tabela.
* **`fl_chart`**: biblioteca usada para desenhar o gráfico.
* **`BarChart`**: widget do tipo gráfico de barras.
* **`BarChartGroupData`** e **`BarChartRodData`**: configuram os dados e as cores das barras.


## 9. Executando o Aplicativo

No terminal, dentro da pasta do projeto, execute:

```bash
flutter run
```

Se estiver usando o **Visual Studio Code**, você também pode pressionar `F5`.

O Flutter detectará o dispositivo disponível (emulador ou físico) e iniciará o aplicativo.


## 10. Entendendo o Resultado

Ao executar o app, você verá:

* **AppBar azul** com o título "Meu Dashboard".
* **Menu lateral (Drawer)** com opções "Home" e "Configurações".
* **Tabela de usuários** com três linhas.
* **Gráfico de barras** mostrando valores fictícios de vendas.
* **Rodapé fixo** com texto "© 2025 Minha Empresa".


## 11. Estrutura do Flutter em Resumo

Um aplicativo Flutter é composto por **widgets**, que são elementos visuais ou funcionais.
Tudo em Flutter é um widget: textos, botões, colunas, tabelas e até o próprio app.

Hierarquia simplificada do app criado:

```
MyApp
 └── MaterialApp
      └── DashboardPage (Scaffold)
           ├── AppBar
           ├── Drawer
           ├── Body (DashboardContent)
           │     ├── DataTable
           │     └── BarChart
           └── BottomAppBar
```


## 12. Próximos Passos

* Criar novas páginas e navegar com `Navigator.push()`.
* Tornar o gráfico dinâmico, alimentando com dados de uma API.
* Adicionar temas claro e escuro com `ThemeMode`.
* Estudar **StatefulWidget** para atualizar o conteúdo em tempo real.
