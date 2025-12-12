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
  Map<String, dynamic>? response;

  Future<void> handleAnalyze() async {
    final text = textCtrl.text.trim();
    if (text.isEmpty) return;

    setState(() {
      loading = true;
      response = null;
    });

    try {
      final url = Uri.parse("http://127.0.0.1:5000/api/chatbot/analyze");

      final res = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"text": text}),
      );

      if (res.statusCode != 200) {
        throw Exception("Erro ao conectar ao servidor");
      }

      setState(() {
        response = jsonDecode(res.body);
      });
    } catch (e) {
      setState(() {
        response = {"erro": "Falha ao conectar com o chatbot."};
      });
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF283976),
      appBar: AppBar(
        title: const Text("ChatBot"),
        backgroundColor: const Color(0xFF171E33),
        centerTitle: true,
        automaticallyImplyLeading: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: const Color(0xFF171E33),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "C H A T B O T - COTAÇÃO DE MOEDAS",
                style: TextStyle(
                  color: Color(0xFFFFFCB7),
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),

              // INPUT
              TextField(
                controller: textCtrl,
                maxLines: 5,
                style: const TextStyle(color: Colors.white),
                decoration: InputDecoration(
                  hintText: "Digite sigla da moeda desejada para cotação.",
                  hintStyle: const TextStyle(color: Colors.white54),
                  filled: true,
                  fillColor: const Color(0xFF11172B),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFFFFCB7)),
                  ),
                ),
              ),

              const SizedBox(height: 12),

              // BOTÃO
              Align(
                alignment: Alignment.centerRight,
                child: ElevatedButton(
                  onPressed: loading ? null : handleAnalyze,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFFFD23F),
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 22,
                      vertical: 12,
                    ),
                  ),
                  child: Text(
                    loading ? "Consultando..." : "Consultar",
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // LOADING
              if (loading)
                const Center(
                  child: Text(
                    "Buscando cotação...",
                    style: TextStyle(
                      color: Color(0xFFFFD23F),
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),

              // RESPOSTA
              if (response != null)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF020617),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFFFFCB7)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // ERRO
                      if (response!.containsKey("erro"))
                        Text(
                          response!["erro"],
                          style: const TextStyle(
                            color: Colors.red,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),

                      // MESSAGE
                      if (response!.containsKey("message"))
                        Text(
                          response!["message"],
                          style: const TextStyle(
                            color: Color(0xFF78FFEF),
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),

                      const SizedBox(height: 10),

                      // COTAÇÃO FORMATADA
                      if (response!["intent"] == "cotacao")
                        Text(
                          "O preço da moeda ${response!["symbol"]} é "
                          "R\$ ${double.parse(response!["price"].toString()).toStringAsFixed(2)}",
                          style: const TextStyle(
                            color: Color(0xFF78FFEF),
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
