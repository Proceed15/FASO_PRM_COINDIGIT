import 'package:flutter/material.dart';
import '../../models/user.dart';
import '../../services/user_service.dart';

class UserCreatePage extends StatefulWidget {
  const UserCreatePage({super.key});

  @override
  State<UserCreatePage> createState() => _UserCreatePageState();
}

class _UserCreatePageState extends State<UserCreatePage> {
  final nameCtrl = TextEditingController();
  final emailCtrl = TextEditingController();
  final passwordCtrl = TextEditingController();
  bool loading = false;
  String? error;

  Future<void> create() async {
    setState(() {
      loading = true;
      error = null;
    });

    try {
      final user = User(
        name: nameCtrl.text.trim(),
        email: emailCtrl.text.trim(),
        password: passwordCtrl.text.trim(),
        phone: "",
        address: "",
        photo: "",
      );

      await UserService.register(user);

      if (!mounted) return;
      Navigator.pop(context, true);
    } catch (e) {
      setState(() => error = "Erro ao criar usuário.");
    }

    setState(() => loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Criar Usuário")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(
              controller: nameCtrl,
              decoration: const InputDecoration(labelText: "Nome"),
            ),
            const SizedBox(height: 15),
            TextField(
              controller: emailCtrl,
              decoration: const InputDecoration(labelText: "Email"),
            ),
            const SizedBox(height: 15),
            TextField(
              controller: passwordCtrl,
              obscureText: true,
              decoration: const InputDecoration(labelText: "Senha"),
            ),
            const SizedBox(height: 25),
            if (error != null)
              Text(error!, style: const TextStyle(color: Colors.redAccent)),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: loading ? null : create,
                child: loading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text("Criar"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
