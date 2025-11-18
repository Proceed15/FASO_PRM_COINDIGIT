import 'package:flutter/material.dart';
import '../../services/user_service.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  Future<void> logout(BuildContext context) async {
    await UserService.delete;
    Navigator.pushReplacementNamed(context, "/login");
  }

  Widget _menuButton({required IconData icon, required String label, required VoidCallback onTap}) {
    return Card(
      color: const Color(0xFF0c0c1a),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            Icon(icon, size: 40, color: Colors.white),
            const SizedBox(height: 12),
            Text(label, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ]),
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
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: GridView.count(
          crossAxisCount: 2,
          crossAxisSpacing: 14,
          mainAxisSpacing: 14,
          children: [
            _menuButton(icon: Icons.monetization_on, label: "Moedas", onTap: () => Navigator.pushNamed(context, "/currencies")),
            _menuButton(icon: Icons.people, label: "Usuários", onTap: () => Navigator.pushNamed(context, "/users")),
            _menuButton(icon: Icons.person_outline, label: "Meu Perfil", onTap: () => Navigator.pushNamed(context, "/user/profile")),
          ],
        ),
      ),
    );
  }
}
