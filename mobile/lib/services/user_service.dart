import 'package:dio/dio.dart';
import '../models/user.dart';

class UserService {
  static final Dio _dio = Dio(BaseOptions(
    baseUrl: "http://localhost:5120", //api
    headers: {"Content-Type": "application/json"},
  ));

  //LOGIN
  static Future<String?> login(String email, String password) async {
    try {
      final response = await _dio.post("/auth/login", data: {
        "email": email,
        "password": password,
      });

      return response.data["token"];
    } catch (e) {
      print("Erro login: $e");
      return null;
    }
  }

  //CADASTRAR USUÁRIO
  static Future<bool> register(User user) async {
    try {
      final response = await _dio.post(
        "/User",
        data: user.toJson(),
      );

      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      print("Erro register: $e");
      return false;
    }
  }

  //LISTAR TODOS
  static Future<List<User>> getAll() async {
    try {
      final response = await _dio.get("/User");

      final List data = response.data;
      return data.map((json) => User.fromJson(json)).toList();
    } catch (e) {
      print("Erro getAll: $e");
      return [];
    }
  }

  //BUSCAR POR ID
  static Future<User?> getById(String id) async {
    try {
      final response = await _dio.get("/User/$id");
      return User.fromJson(response.data);
    } catch (e) {
      print("Erro getById: $e");
      return null;
    }
  }

  //ATUALIZAR
  static Future<bool> update(User user) async {
    try {
      final response = await _dio.put(
        "/User/${user.id}",
        data: user.toJson(),
      );
      return response.statusCode == 200;
    } catch (e) {
      print("Erro update: $e");
      return false;
    }
  }

  //DELETAR
  static Future<bool> delete(String id) async {
    try {
      final response = await _dio.delete("/User/$id");
      return response.statusCode == 200;
    } catch (e) {
      print("Erro delete: $e");
      return false;
    }
  }
}
