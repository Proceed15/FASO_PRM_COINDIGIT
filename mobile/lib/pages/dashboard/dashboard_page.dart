import 'package:flutter/material.dart';
import '../../services/user_service.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  Future<void> logout(BuildContext context) async {
    await UserService.logout();
    if (context.mounted) {
      Navigator.pushReplacementNamed(context, "/login");
    }
  }

  Widget _menuButton(
      {required IconData icon,
      required String label,
      required VoidCallback onTap}) {
    return Card(
      color: const Color(0xFF0c0c1a),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(22),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 42, color: Colors.white),
              const SizedBox(height: 12),
              Text(
                label,
                style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white),
              )
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Dashboard"),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => logout(context),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: GridView.count(
          crossAxisCount: 2,
          crossAxisSpacing: 14,
          mainAxisSpacing: 14,
          children: [
            _menuButton(
              icon: Icons.monetization_on,
              label: "Moedas",
              onTap: () => Navigator.pushNamed(context, "/currencies"),
            ),
            _menuButton(
              icon: Icons.people,
              label: "Usuários",
              onTap: () => Navigator.pushNamed(context, "/users"),
            ),
            _menuButton(
              icon: Icons.chat_bubble_outline,
              label: "Chatbot",
              onTap: () => Navigator.pushNamed(context, "/chatbot"),
            ),
            _menuButton(
              icon: Icons.person_outline,
              label: "Meu Perfil",
              onTap: () => Navigator.pushNamed(context, "/user/profile"),
            ),
          ],
        ),
      ),
    );
  }
}
