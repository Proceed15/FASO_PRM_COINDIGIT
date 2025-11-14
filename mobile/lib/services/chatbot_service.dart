import 'package:dio/dio.dart';
import '../core/constants.dart';

class ChatbotService {
  static final Dio _dio = Dio(
    BaseOptions(
      baseUrl: CHATBOT_BASE,
      connectTimeout: const Duration(seconds: 12),
      receiveTimeout: const Duration(seconds: 12),
    ),
  );

  // ===========================================================
  // ENVIAR MENSAGEM PARA O CHATBOT
  // ===========================================================
  static Future<String> sendMessage(String message) async {
    final payload = {"message": message};

    final endpoints = [
      "/api/chat",
      "/chat",
      "/message",
    ];

    for (final ep in endpoints) {
      try {
        final r = await _dio.post(ep, data: payload);

        if (r.statusCode != null && r.statusCode! < 400) {
          if (r.data is Map && r.data['response'] != null) {
            return r.data['response'];
          }

          if (r.data is String) return r.data;

          return r.data.toString();
        }
      } catch (_) {}
    }

    throw Exception("Erro ao comunicar com o Chatbot.");
  }
}
