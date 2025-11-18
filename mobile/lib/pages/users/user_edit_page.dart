import 'package:flutter/material.dart';
import '../../models/user.dart';
import '../../services/user_service.dart';

class UserEditPage extends StatefulWidget {
  const UserEditPage({super.key});

  @override
  State<UserEditPage> createState() => _UserEditPageState();
}

class _UserEditPageState extends State<UserEditPage> {
  final nameCtrl = TextEditingController();
  final emailCtrl = TextEditingController();
  final passwordCtrl = TextEditingController();

  bool loading = true;
  User? user;
  String? error;

  Future<void> loadUser(User u) async {
    setState(() => loading = true);
    try {
      user = await UserService.getById(u.id!);
      nameCtrl.text = user?.name ?? "";
      emailCtrl.text = user?.email ?? "";
    } catch (_) {
      error = "Erro ao carregar";
    }
    setState(() => loading = false);
  }

  Future<void> save() async {
    if (user == null) return;
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final updated = User(
        id: user!.id,
        name: nameCtrl.text.trim(),
        email: emailCtrl.text.trim(),
        password: passwordCtrl.text.isEmpty ? null : passwordCtrl.text,
      );
      updated.id = user!.id; // garante que o id está vindo
      final success = await UserService.update(updated);

      if (!mounted) return;
      Navigator.pop(context);
    } catch (e) {
      setState(() => error = "Erro ao salvar");
    }
    setState(() => loading = false);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)!.settings.arguments;
    if (args is User) loadUser(args);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Editar Usuário")),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
          ? Center(child: Text(error!))
          : SingleChildScrollView(
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
                    decoration: const InputDecoration(
                      labelText: "Nova senha (opcional)",
                    ),
                  ),
                  const SizedBox(height: 20),
                  if (error != null)
                    Text(
                      error!,
                      style: const TextStyle(color: Colors.redAccent),
                    ),
                  const SizedBox(height: 25),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: save,
                      child: const Text("Salvar"),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
