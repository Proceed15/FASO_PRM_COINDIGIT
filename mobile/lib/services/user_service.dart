import 'api_client.dart';
import '../models/user.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class UserService {
  static final _api = ApiClient();

  static Future<List<User>> getAll() async {
    final res = await _api.get("/api/User");
    return (res.data as List).map((e) => User.fromJson(e)).toList();
  }

  static Future<User> getById(String id) async {
    final res = await _api.get("/api/User/${int.parse(id)}");
    return User.fromJson(res.data);
  }

  static Future<bool> register(User user) async {
    print("ENVIANDO CREATE:");
    print(user.toJson());

    final res = await _api.post("/api/User", user.toJson());
    return res.statusCode == 200 || res.statusCode == 201;
  }

  static Future<bool> update(User user) async {
    print("ENVIANDO UPDATE:");
    print(user.toJson());

    final res = await _api.put(
      "/api/User/${int.parse(user.id!)}",
      user.toJson(),
    );

    print("STATUS CODE: ${res.statusCode}");
    return res.statusCode == 200;
  }

  static Future<void> delete(String id) async {
    await _api.delete("/api/User/${int.parse(id)}");
  }

  /*static Future<bool> login(String email, String password) async {
    final res = await _api.post("/api/auth/login", {
      "email": email,
      "password": password,
    });

    return res.statusCode == 200;
  }*/

  static Future<bool> login(String email, String password) async {
    final res = await _api.post("/api/auth/login", {
      "email": email,
      "password": password,
    });

    print("LOGIN STATUS: ${res.statusCode}");
    print("LOGIN BODY: ${res.data}");

    if (res.statusCode == 200) {
      //BUSCA USERS
      final usersRes = await _api.get("/api/User");

      print("USERS BODY:");
      print(usersRes.data);

      //LISTA
      final List list = usersRes.data is List
          ? usersRes.data
          : usersRes.data["data"] ?? usersRes.data["users"] ?? [];

      //PELO EMAIL
      final userJson = list.cast<Map>().firstWhere(
        (u) => u["email"].toString().toLowerCase() == email.toLowerCase(),
        orElse: () => {},
      );

      if (userJson.isEmpty) {
        print("USUÁRIO NÃO ENCONTRADO PELO EMAIL");
        return false;
      }

      final prefs = await SharedPreferences.getInstance();

      //SAVE
      await prefs.setString("user", jsonEncode(userJson));

      print("USUÁRIO SALVO NO CACHE:");
      print(userJson);

      return true;
    }

    return false;
  }
}
