import 'package:flutter/material.dart';

class WalletViewPage extends StatelessWidget {
  const WalletViewPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Wallet API"),
        centerTitle: true,
      ),
      body: const Center(
        child: Text(
          "Tela da Wallet API",
          style: TextStyle(fontSize: 22),
        ),
      ),
    );
  }
}
