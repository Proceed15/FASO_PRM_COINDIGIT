import 'package:flutter/material.dart';
import '../../models/user.dart';
import '../../services/user_service.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final nameCtrl = TextEditingController();
  final emailCtrl = TextEditingController();
  final passCtrl = TextEditingController();
  bool loading = false;
  String? error;

  Future<void> register() async {
    setState(() { loading = true; error = null; });

    try {
      final user = User(name: nameCtrl.text.trim(), email: emailCtrl.text.trim(), password: passCtrl.text.trim());
      await UserService.register(user);
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, "/login");
    } catch (e) {
      setState(() => error = "Erro ao criar conta.");
    }

    setState(() { loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              const Icon(Icons.person_add, size: 80, color: Colors.white),
              const SizedBox(height: 20),
              const Text("Criar conta", style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
              const SizedBox(height: 30),
              TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: "Nome")),
              const SizedBox(height: 15),
              TextField(controller: emailCtrl, decoration: const InputDecoration(labelText: "Email")),
              const SizedBox(height: 15),
              TextField(controller: passCtrl, obscureText: true, decoration: const InputDecoration(labelText: "Senha")),
              const SizedBox(height: 20),
              if (error != null) Text(error!, style: const TextStyle(color: Colors.redAccent)),
              const SizedBox(height: 25),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(onPressed: loading ? null : register, child: loading ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white)) : const Text("Criar conta")),
              ),
              const SizedBox(height: 10),
              TextButton(onPressed: () => Navigator.pop(context), child: const Text("Já tenho uma conta", style: TextStyle(color: Colors.white70))),
            ],
          ),
        ),
      ),
    );
  }
}
