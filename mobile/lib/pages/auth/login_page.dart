import 'package:flutter/material.dart';
import '../../services/user_service.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final emailCtrl = TextEditingController();
  final passCtrl = TextEditingController();
  bool loading = false;
  String? error;

  Future<void> doLogin() async {
    setState(() { loading = true; error = null; });
    try {
      await UserService.login(emailCtrl.text.trim(), passCtrl.text.trim());
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, "/dashboard");
    } catch (e) {
      setState(() => error = "Credenciais inválidas ou backend inacessível.");
    }
    setState(() => loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.account_balance_wallet, size: 80, color: Colors.white),
              const SizedBox(height: 20),
              const Text("CoinDigit Mobile", style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
              const SizedBox(height: 30),
              TextField(controller: emailCtrl, decoration: const InputDecoration(labelText: "Email")),
              const SizedBox(height: 15),
              TextField(controller: passCtrl, obscureText: true, decoration: const InputDecoration(labelText: "Senha")),
              if (error != null) ...[
                const SizedBox(height: 10),
                Text(error!, style: const TextStyle(color: Colors.redAccent)),
              ],
              const SizedBox(height: 25),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: loading ? null : doLogin,
                  child: loading ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Text("Entrar"),
                ),
              ),
              const SizedBox(height: 10),
              TextButton(onPressed: () => Navigator.pushNamed(context, "/register"), child: const Text("Criar uma conta", style: TextStyle(color: Colors.white70))),
            ],
          ),
        ),
      ),
    );
  }
}
