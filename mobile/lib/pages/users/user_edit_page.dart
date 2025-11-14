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
  final phoneCtrl = TextEditingController();
  final addressCtrl = TextEditingController();
  final passCtrl = TextEditingController();

  bool loading = true;
  String? userId;
  String? error;

  Future<void> loadUser(String id) async {
    setState(() => loading = true);

    try {
      final u = await UserService.getById(id);

      nameCtrl.text = u.name;
      emailCtrl.text = u.email;
      phoneCtrl.text = u.phone ?? "";
      addressCtrl.text = u.address ?? "";
      userId = u.id;
    } catch (_) {
      error = "Usuário não encontrado";
    }

    setState(() => loading = false);
  }

  Future<void> save() async {
    if (userId == null) return;

    setState(() {
      loading = true;
      error = null;
    });

    try {
      final user = User(
        id: userId,
        name: nameCtrl.text,
        email: emailCtrl.text,
        phone: phoneCtrl.text.isEmpty ? null : phoneCtrl.text,
        address: addressCtrl.text.isEmpty ? null : addressCtrl.text,
        password: passCtrl.text.isEmpty ? null : passCtrl.text,
      );

      await UserService.update(userId!, user);

      if (!mounted) return;
      Navigator.pop(context);
    } catch (e) {
      setState(() => error = "Erro ao salvar alterações.");
    }

    setState(() => loading = false);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    final id = ModalRoute.of(context)!.settings.arguments as String;
    loadUser(id);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Editar Usuário"),
      ),
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
                        controller: phoneCtrl,
                        decoration:
                            const InputDecoration(labelText: "Telefone"),
                      ),
                      const SizedBox(height: 15),

                      TextField(
                        controller: addressCtrl,
                        decoration:
                            const InputDecoration(labelText: "Endereço"),
                      ),
                      const SizedBox(height: 15),

                      TextField(
                        controller: passCtrl,
                        obscureText: true,
                        decoration: const InputDecoration(
                            labelText: "Senha (opcional)"),
                      ),

                      if (error != null) ...[
                        const SizedBox(height: 10),
                        Text(error!,
                            style: const TextStyle(color: Colors.redAccent)),
                      ],

                      const SizedBox(height: 25),

                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: save,
                          child: const Text("Salvar"),
                        ),
                      )
                    ],
                  ),
                ),
    );
  }
}
