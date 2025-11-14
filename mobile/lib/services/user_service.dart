import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/user.dart';
import 'api_client.dart';
import '../core/constants.dart';

class UserService {
  static final ApiClient _api = ApiClient(baseUrl: API_BASE);

  // LOGIN
  static Future<String> login(String email, String password) async {
    final payload = {
      "email": email,
      "password": password,
    };

    try {//BASE NO SWAGGER
      final dio = Dio();
      final resp = await dio.post("$API_BASE/api/auth/login", data: payload);

      if (resp.statusCode != null && resp.statusCode! < 400) {
        final data = resp.data;
        String token;

        if (data is Map && (data['token'] != null || data['Token'] != null)) {
          token = data['token'] ?? data['Token'];
        } else if (data is String) {
          token = data;
        } else {
          token = jsonEncode(data);
        }

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString("token", token);

        return token;
      }
    } catch (e) {
      throw Exception("Erro ao fazer login: $e");
    }

    throw Exception("Falha ao realizar login.");
  }

  // LOGOUT
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove("token");
    await prefs.remove("user");
  }

  // REGISTRO
  static Future<User> register(User user) async {
    try {
      final r = await _api.post("/api/User", user.toJson());

      if (r.statusCode != null && r.statusCode! < 400) {
        return User.fromJson(r.data as Map<String, dynamic>);
      }
    } catch (e) {
      throw Exception("Erro ao registrar usuário: $e");
    }

    throw Exception("Falha ao registrar usuário.");
  }

  // LISTAR TODOS
  static Future<List<User>> getAll() async {
    try {
      final r = await _api.get("/api/User");

      if (r.statusCode != null && r.statusCode! < 400 && r.data is List) {
        return (r.data as List)
            .map((e) => User.fromJson(e as Map<String, dynamic>))
            .toList();
      }
    } catch (e) {
      throw Exception("Erro ao carregar usuários: $e");
    }

    throw Exception("Falha ao carregar usuários.");
  }

  // BUSCAR POR ID
  static Future<User> getById(String id) async {
    try {
      final r = await _api.get("/api/User/$id");

      if (r.statusCode != null &&
          r.statusCode! < 400 &&
          r.data is Map<String, dynamic>) {
        return User.fromJson(r.data as Map<String, dynamic>);
      }
    } catch (e) {
      throw Exception("Erro ao buscar usuário: $e");
    }

    throw Exception("Usuário não encontrado.");
  }

  // ATUALIZAR
  static Future<User> update(String id, User user) async {
    try {
      final r = await _api.put("/api/User/$id", user.toJson());

      if (r.statusCode != null && r.statusCode! < 400) {
        return User.fromJson(r.data as Map<String, dynamic>);
      }
    } catch (e) {
      throw Exception("Erro ao atualizar usuário: $e");
    }

    throw Exception("Falha ao atualizar usuário.");
  }

  // DELETAR
  static Future<void> delete(String id) async {
    try {
      final r = await _api.delete("/api/User/$id");

      if (r.statusCode != null && r.statusCode! < 400) return;
    } catch (e) {
      throw Exception("Erro ao excluir usuário: $e");
    }

    throw Exception("Falha ao excluir usuário.");
  }
}
