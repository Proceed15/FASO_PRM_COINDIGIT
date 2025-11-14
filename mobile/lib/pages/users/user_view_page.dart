import 'package:flutter/material.dart';
import '../../models/user.dart';
import '../../services/user_service.dart';

class UserViewPage extends StatefulWidget {
  const UserViewPage({super.key});

  @override
  State<UserViewPage> createState() => _UserViewPageState();
}

class _UserViewPageState extends State<UserViewPage> {
  User? user;
  bool loading = true;

  Future<void> loadUser(String id) async {
    setState(() => loading = true);

    try {
      user = await UserService.getById(id);
    } catch (_) {
      user = null;
    }

    setState(() => loading = false);
  }

  void deleteUser(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Excluir usuário"),
        content: const Text("Tem certeza que deseja excluir este usuário?"),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text("Cancelar")),
          ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text("Excluir"))
        ],
      ),
    );

    if (confirm != true) return;

    await UserService.delete(id);

    if (!mounted) return;
    Navigator.pop(context);
  }

  void editUser(String id) {
    Navigator.pushNamed(context, "/user/edit", arguments: id)
        .then((_) => loadUser(id));
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
        title: const Text("Detalhes do Usuário"),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: user == null ? null : () => deleteUser(user!.id!),
          ),
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: user == null ? null : () => editUser(user!.id!),
          ),
        ],
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : user == null
              ? const Center(child: Text("Usuário não encontrado"))
              : Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.person, size: 80, color: Colors.white70),
                      const SizedBox(height: 20),

                      Text(
                        user!.name,
                        style: const TextStyle(
                            fontSize: 26, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 10),

                      Text(user!.email,
                          style: const TextStyle(
                              fontSize: 18, color: Colors.white70)),
                      const SizedBox(height: 20),

                      if (user!.phone != null) ...[
                        const Text("Telefone:",
                            style: TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold)),
                        Text(user!.phone!,
                            style: const TextStyle(fontSize: 16)),
                        const SizedBox(height: 20),
                      ],

                      if (user!.address != null) ...[
                        const Text("Endereço:",
                            style: TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold)),
                        Text(user!.address!,
                            style: const TextStyle(fontSize: 16)),
                      ],
                    ],
                  ),
                ),
    );
  }
}
