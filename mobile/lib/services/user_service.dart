import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/user.dart';
import 'api_client.dart';
import '../core/constants.dart';

class UserService {
  static final ApiClient _api = ApiClient(baseUrl: API_BASE);

  // ===========================================================
  // LOGIN
  // ===========================================================
  static Future<String> login(String email, String password) async {
    final payload = {
      "email": email,
      "password": password,
    };

    final endpoints = [
      "$API_BASE/api/User/login",
      "$API_BASE/api/user/login",
      "$API_BASE/user/login",
      "$API_BASE/auth/login",
    ];

    for (final url in endpoints) {
      try {
        final dio = Dio();
        final resp = await dio.post(url, data: payload);

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
      } catch (_) {
        // tenta o próximo endpoint
      }
    }

    throw Exception("Falha ao realizar login.");
  }

  // ===========================================================
  // LOGOUT
  // ===========================================================
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove("token");
    await prefs.remove("user");
  }

  // ===========================================================
  // REGISTRO
  // ===========================================================
  static Future<User> register(User user) async {
    final endpoints = [
      "/api/User/register",
      "/api/user/register",
      "/user/register",
      "/auth/register",
    ];

    for (final ep in endpoints) {
      try {
        final r = await _api.post(ep, user.toJson());
        if (r.statusCode != null && r.statusCode! < 400) {
          return User.fromJson(
              r.data is Map ? r.data as Map<String, dynamic> : {});
        }
      } catch (_) {}
    }

    throw Exception("Falha ao registrar usuário.");
  }

  // ===========================================================
  // LISTAR TODOS
  // ===========================================================
  static Future<List<User>> getAll() async {
    final endpoints = [
      "/api/User",
      "/api/users",
      "/users",
      "/user",
    ];

    for (final ep in endpoints) {
      try {
        final r = await _api.get(ep);

        if (r.statusCode != null &&
            r.statusCode! < 400 &&
            r.data is List) {
          return (r.data as List)
              .map((e) => User.fromJson(e as Map<String, dynamic>))
              .toList();
        }
      } catch (_) {}
    }

    throw Exception("Falha ao carregar usuários.");
  }

  // ===========================================================
  // BUSCAR POR ID
  // ===========================================================
  static Future<User> getById(String id) async {
    final endpoints = [
      "/api/User/$id",
      "/api/users/$id",
      "/users/$id",
      "/user/$id",
    ];

    for (final ep in endpoints) {
      try {
        final r = await _api.get(ep);

        if (r.statusCode != null &&
            r.statusCode! < 400 &&
            r.data is Map) {
          return User.fromJson(r.data as Map<String, dynamic>);
        }
      } catch (_) {}
    }

    throw Exception("Usuário não encontrado.");
  }

  // ===========================================================
  // ATUALIZAR
  // ===========================================================
  static Future<User> update(String id, User user) async {
    final endpoints = [
      "/api/User/$id",
      "/api/users/$id",
      "/users/$id",
      "/user/$id",
    ];

    for (final ep in endpoints) {
      try {
        final r = await _api.put(ep, user.toJson());

        if (r.statusCode != null && r.statusCode! < 400) {
          return User.fromJson(r.data as Map<String, dynamic>);
        }
      } catch (_) {}
    }

    throw Exception("Falha ao atualizar usuário.");
  }

  // ===========================================================
  // DELETAR
  // ===========================================================
  static Future<void> delete(String id) async {
    final endpoints = [
      "/api/User/$id",
      "/api/users/$id",
      "/users/$id",
      "/user/$id",
    ];

    for (final ep in endpoints) {
      try {
        final r = await _api.delete(ep);
        if (r.statusCode != null && r.statusCode! < 400) return;
      } catch (_) {}
    }

    throw Exception("Falha ao excluir usuário.");
  }
}
