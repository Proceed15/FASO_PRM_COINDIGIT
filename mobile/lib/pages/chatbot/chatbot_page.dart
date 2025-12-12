import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class ChatbotPage extends StatefulWidget {
  const ChatbotPage({super.key});

  @override
  State<ChatbotPage> createState() => _ChatbotPageState();
}

class _ChatbotPageState extends State<ChatbotPage> {
  final TextEditingController textCtrl = TextEditingController();
  bool loading = false;

  // HISTÓRICO DO CHAT
  List<Map<String, dynamic>> history = [];

  Future<void> handleAnalyze() async {
    final text = textCtrl.text.trim();
    if (text.isEmpty) return;

    // ADICIONA MSG DO USUÁRIO
    setState(() {
      history.add({"from": "user", "text": text});
      loading = true;
      textCtrl.clear();
    });

    try {
      final url = Uri.parse("http://127.0.0.1:5000/api/chatbot/analyze");//GATEWAY
      final res = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"text": text}),
      );

      Map<String, dynamic> data = {};
      if (res.statusCode == 200) {
        data = jsonDecode(res.body);
      } else {
        data = {"erro": "Falha ao conectar com o chatbot."};
      }

      // ADICIONA MSG DO BOT
      setState(() {
        history.add({"from": "bot", "data": data});
      });
    } catch (e) {
      setState(() {
        history.add({
          "from": "bot",
          "data": {"erro": "Falha ao conectar com o chatbot."}
        });
      });
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  Widget renderBotResponse(Map<String, dynamic>? response) {
    if (response == null) return const SizedBox.shrink();

    if (response.containsKey("erro")) {
      return Text(
        response["erro"],
        style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
      );
    }

    if (response.containsKey("message")) {
      return Text(
        response["message"],
        style: const TextStyle(color: Color(0xFF78FFEF), fontWeight: FontWeight.bold),
      );
    }

    switch (response["intent"]) {
      case "cotacao":
        return Text(
          "O preço da moeda ${response["symbol"]} é R\$ ${double.parse(response["price"].toString()).toStringAsFixed(2)}",
          style: const TextStyle(color: Color(0xFF78FFEF), fontWeight: FontWeight.bold),
        );

      case "saldo":
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Saldo da Carteira", style: TextStyle(color: Color(0xFF78FFEF), fontWeight: FontWeight.bold)),
            Text("Total: R\$ ${response["saldo"]}", style: const TextStyle(color: Colors.yellowAccent, fontWeight: FontWeight.bold)),
            if (response["moedas"] != null && response["moedas"].isNotEmpty)
              ...response["moedas"].map<Widget>((m) => Text("${m["symbol"]}: ${m["amount"]}", style: const TextStyle(color: Colors.white))).toList(),
          ],
        );

      case "deposito":
        return Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Text("Depósito realizado!", style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
            Text("+ ${response["valor"]} ${response["moeda"]}"),
            Text("Novo saldo: ${response["novo_saldo"]}", style: const TextStyle(color: Colors.yellowAccent, fontWeight: FontWeight.bold)),
          ],
        );

      case "transferencia":
        return Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Text("Transferência concluída!", style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold)),
            Text("${response["valor"]} ${response["moeda"]}"),
            Text("Para: ${response["destino"]}", style: const TextStyle(color: Colors.yellowAccent, fontWeight: FontWeight.bold)),
            Text("Status: ${response["status"]}", style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
          ],
        );

      default:
        return const Text("Resposta desconhecida da API.", style: TextStyle(color: Colors.white));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF09102B),
      appBar: AppBar(
        title: const Text("ChatBot"),
        backgroundColor: const Color(0xFF143A7C),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // TUTORIAL
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: const Color(0xFF11172B),
                border: Border.all(color: const Color(0xFFFFFCB7)),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    "Este bot reconhece comandos de linguagem natural. Siga a ordem lógica abaixo:",
                    style: TextStyle(color: Color(0xFF78FFEF)),
                  ),
                  SizedBox(height: 6),
                  Text.rich(
                    TextSpan(
                      children: [
                        TextSpan(text: "1. Identificação (Login): ", style: TextStyle(color: Colors.white)),
                        TextSpan(text: "Meu nome é (SeuNomeDeUsuário)", style: TextStyle(color: Colors.redAccent)),
                      ],
                    ),
                  ),
                  Text.rich(
                    TextSpan(
                      children: [
                        TextSpan(text: "2. Consultar Carteira: ", style: TextStyle(color: Colors.white)),
                        TextSpan(text: "Qual é o meu Saldo?", style: TextStyle(color: Colors.redAccent)),
                      ],
                    ),
                  ),
                  Text.rich(
                    TextSpan(
                      children: [
                        TextSpan(text: "3. Cotação de Moedas: ", style: TextStyle(color: Colors.white)),
                        TextSpan(text: "Qual o valor do BTC? ou apenas BTC", style: TextStyle(color: Colors.redAccent)),
                      ],
                    ),
                  ),
                  Text.rich(
                    TextSpan(
                      children: [
                        TextSpan(text: "4. Depósito: ", style: TextStyle(color: Colors.white)),
                        TextSpan(text: "Depositar 1000 USD para (NomeDeUsuário)", style: TextStyle(color: Colors.redAccent)),
                      ],
                    ),
                  ),
                  Text.rich(
                    TextSpan(
                      children: [
                        TextSpan(text: "5. Transferência entre Usuários: ", style: TextStyle(color: Colors.white)),
                        TextSpan(text: "Transferir 0.3 BTC para (NomeDeUsuário)", style: TextStyle(color: Colors.redAccent)),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // HISTÓRICO DO CHAT
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF020617),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: ListView.builder(
                  itemCount: history.length,
                  itemBuilder: (context, index) {
                    final msg = history[index];
                    if (msg["from"] == "user") {
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text("Você:", style: TextStyle(color: Colors.yellowAccent, fontWeight: FontWeight.bold)),
                            Text(msg["text"], style: const TextStyle(color: Colors.white)),
                          ],
                        ),
                      );
                    } else {
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text("ChatBot:", style: TextStyle(color: Colors.cyanAccent, fontWeight: FontWeight.bold)),
                            renderBotResponse(msg["data"]),
                          ],
                        ),
                      );
                    }
                  },
                ),
              ),
            ),

            if (loading)
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text("Processando...", style: TextStyle(color: Color(0xFFFFD23F))),
              ),

            const SizedBox(height: 12),

            // INPUT
            TextField(
              controller: textCtrl,
              maxLines: 3,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Digite seu comando aqui...",
                hintStyle: const TextStyle(color: Colors.white54),
                filled: true,
                fillColor: const Color(0xFF11172B),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFFFFFCB7)),
                ),
              ),
            ),

            const SizedBox(height: 8),

            // BOTÃO
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton(
                onPressed: loading ? null : handleAnalyze,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFFD23F),
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
                ),
                child: Text(loading ? "Consultando..." : "Enviar comando"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
