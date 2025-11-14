import 'package:flutter/material.dart';
import '../../models/user.dart';
import '../../services/user_service.dart';

class UserListPage extends StatefulWidget {
  const UserListPage({super.key});

  @override
  State<UserListPage> createState() => _UserListPageState();
}

class _UserListPageState extends State<UserListPage> {
  List<User> users = [];
  bool loading = true;

  Future<void> loadUsers() async {
    setState(() => loading = true);

    try {
      users = await UserService.getAll();
    } catch (e) {
      users = [];
    }

    setState(() => loading = false);
  }

  @override
  void initState() {
    super.initState();
    loadUsers();
  }

  void openUser(User user) {
    Navigator.pushNamed(context, "/user/view", arguments: user.id)
        .then((_) => loadUsers());
  }

  void createUser() {
    Navigator.pushNamed(context, "/user/create").then((_) => loadUsers());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Usuários"),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: createUser,
        child: const Icon(Icons.add),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : users.isEmpty
              ? const Center(child: Text("Nenhum usuário encontrado"))
              : ListView.builder(
                  itemCount: users.length,
                  itemBuilder: (context, i) {
                    final u = users[i];

                    return Card(
                      color: const Color(0xFF0c0c1a),
                      child: ListTile(
                        title: Text(u.name,
                            style: const TextStyle(color: Colors.white)),
                        subtitle: Text(u.email,
                            style: const TextStyle(color: Colors.white70)),
                        trailing: const Icon(Icons.arrow_forward_ios,
                            color: Colors.white70, size: 18),
                        onTap: () => openUser(u),
                      ),
                    );
                  },
                ),
    );
  }
}
