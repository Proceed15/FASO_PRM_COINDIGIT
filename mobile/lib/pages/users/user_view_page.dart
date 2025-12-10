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

  Future<void> loadUser(User u) async {
    setState(() => loading = true);
    try {
      user = await UserService.getById(u.id!);
    } catch (_) {
      user = u;
    }
    setState(() => loading = false);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)!.settings.arguments;
    if (args is User) loadUser(args);
  }

  void deleteUser() async {
    if (user?.id == null) return;
    final confirm = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(title: const Text("Excluir"), content: const Text("Confirmar exclusão?"), actions: [
        TextButton(onPressed: () => Navigator.pop(c, false), child: const Text("Cancelar")),
        ElevatedButton(onPressed: () => Navigator.pop(c, true), child: const Text("Excluir")),
      ]),
    );
    if (confirm == true) {
      await UserService.delete(user!.id!);
      if (!mounted) return;
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Detalhes do Usuário"),
        actions: [
          IconButton(icon: const Icon(Icons.edit), onPressed: user == null ? null : () => Navigator.pushNamed(context, "/user/edit", arguments: user).then((_) => loadUser(user!))),
          IconButton(icon: const Icon(Icons.delete), onPressed: user == null ? null : deleteUser),
        ],
      ),
      body: loading ? const Center(child: CircularProgressIndicator()) : user == null ? const Center(child: Text("Usuário não encontrado")) : Padding(
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
