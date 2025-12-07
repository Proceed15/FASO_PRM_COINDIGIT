import 'package:dio/dio.dart';
import '../models/user.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class UserService {
  static final Dio _dio = Dio(
    BaseOptions(
      baseUrl: "http://localhost:5000",
      headers: {"Content-Type": "application/json"},
    ),
  );

  // LOGIN
  // Guarda o usuário logado
  static User? loggedUser;

  static Future<bool> login(String email, String password) async {
    try {
      final response = await _dio.post(
        "/api/auth/login",
        data: {"email": email, "password": password},
      );

      final token = response.data["token"];

      if (token == null) return false;

      // Decodifica o token jwt
      Map<String, dynamic> decoded = JwtDecoder.decode(token);

      // Preenche o usuário logado usando os dados do token
      loggedUser = User(
        id: decoded["sub"]?.toString(),
        name: decoded["unique_name"] ?? "",
        email: decoded["email"] ?? "",
        role: decoded["role"] ?? "",
      );

      return true;
    } catch (e) {
      print("Erro login: $e");
      return false;
    }
  }

  // CADASTRAR

  static Future<bool> register(User user) async {
    try {
      final response = await _dio.post("/api/User", data: user.toJson());
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      print("Erro register: $e");
      return false;
    }
  }

  // LISTAR

  static Future<List<User>> getAll() async {
    try {
      final response = await _dio.get("/api/User");

      final List data = response.data;
      return data.map((json) => User.fromJson(json)).toList();
    } catch (e) {
      print("Erro getAll: $e");
      return [];
    }
  }

  // GET BY ID

  static Future<User?> getById(String id) async {
    try {
      final response = await _dio.get("/api/User/$id");
      return User.fromJson(response.data);
    } catch (e) {
      print("Erro getById: $e");
      return null;
    }
  }

  // UPDATE

  static Future<bool> update(User user) async {
    try {
      final response = await _dio.put("/api/User/${user.id}", data: user.toJson());
      return response.statusCode == 200;
    } catch (e) {
      print("Erro update: $e");
      return false;
    }
  }

  // DELETE

  static Future<bool> delete(String id) async {
    try {
      final response = await _dio.delete("/api/User/$id");
      return response.statusCode == 200;
    } catch (e) {
      print("Erro delete: $e");
      return false;
    }
  }
}
