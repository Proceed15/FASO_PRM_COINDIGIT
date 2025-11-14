import 'package:flutter/material.dart';
import '../../services/chatbot_service.dart';

class ChatMessage {
  final String text;
  final bool isUser;

  ChatMessage({
    required this.text,
    required this.isUser,
  });
}

class ChatbotPage extends StatefulWidget {
  const ChatbotPage({super.key});

  @override
  State<ChatbotPage> createState() => _ChatbotPageState();
}

class _ChatbotPageState extends State<ChatbotPage> {
  final List<ChatMessage> messages = [];
  final controller = TextEditingController();
  final scrollController = ScrollController();
  bool sending = false;

  Future<void> send() async {
    final text = controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      messages.add(ChatMessage(text: text, isUser: true));
      sending = true;
      controller.clear();
    });

    _scrollToBottom();

    try {
      final response = await ChatbotService.sendMessage(text);

      setState(() {
        messages.add(ChatMessage(text: response, isUser: false));
      });

    } catch (e) {
      setState(() {
        messages.add(ChatMessage(
            text: "Erro ao conectar com o chatbot.", isUser: false));
      });
    }

    setState(() => sending = false);
    _scrollToBottom();
  }

  void _scrollToBottom() {
    Future.delayed(
      const Duration(milliseconds: 100),
      () => scrollController.jumpTo(
        scrollController.position.maxScrollExtent,
      ),
    );
  }

  Widget _buildMessage(ChatMessage msg) {
    return Align(
      alignment:
          msg.isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        padding: const EdgeInsets.all(12),
        margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 12),
        decoration: BoxDecoration(
          color: msg.isUser ? const Color(0xFF265DBF) : const Color(0xFF0c0c1a),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          msg.text,
          style: const TextStyle(color: Colors.white, fontSize: 15),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Chatbot"),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: scrollController,
              itemCount: messages.length,
              itemBuilder: (context, index) {
                return _buildMessage(messages[index]);
              },
            ),
          ),

          //Envio
          Container(
            color: const Color(0xFF0c0c1a),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: controller,
                    decoration: const InputDecoration(
                      hintText: "Digite sua mensagem...",
                    ),
                    onSubmitted: (_) => send(),
                  ),
                ),
                const SizedBox(width: 10),
                IconButton(
                  onPressed: sending ? null : send,
                  icon: const Icon(Icons.send, color: Colors.white),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
