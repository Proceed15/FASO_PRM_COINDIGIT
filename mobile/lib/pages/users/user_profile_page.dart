import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../models/user.dart';
//import '../../services/user_service.dart';

class UserProfilePage extends StatefulWidget {
  const UserProfilePage({super.key});

  @override
  State<UserProfilePage> createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  User? user;
  bool loading = true;

  Future<void> loadProfile() async {
    setState(() => loading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final cached = prefs.getString("user");
      if (cached != null) {
        user = User.fromJson(jsonDecode(cached));
      }
    } catch (_) {}
    setState(() => loading = false);
  }

  @override
  void initState() { super.initState(); loadProfile(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Meu Perfil")),
      body: loading ? const Center(child: CircularProgressIndicator()) : user == null ? const Center(child: Text("Nenhum dado")) : Padding(
        padding: const EdgeInsets.all(20),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Icon(Icons.person, size: 80, color: Colors.white70),
          const SizedBox(height: 20),
          Text(user!.name, style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          Text(user!.email, style: const TextStyle(fontSize: 18, color: Colors.white70)),
          const SizedBox(height: 20),
          if (user!.phone != null && user!.phone!.isNotEmpty) ...[
            const Text("Telefone:", style: TextStyle(fontWeight: FontWeight.bold)),
            Text(user!.phone!),
            const SizedBox(height: 20),
          ],
          if (user!.address != null && user!.address!.isNotEmpty) ...[
            const Text("Endereço:", style: TextStyle(fontWeight: FontWeight.bold)),
            Text(user!.address!),
          ],
        ]),
      ),
    );
  }
}
