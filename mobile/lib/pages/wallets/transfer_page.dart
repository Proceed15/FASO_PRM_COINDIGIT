import 'package:flutter/material.dart';

import '../../services/wallet_service.dart';


class TransferPage extends StatefulWidget {
  const TransferPage({super.key});

  @override
  State<TransferPage> createState() => _TransferPageState();
}

class _TransferPageState extends State<TransferPage> {
  final fromWalletCtrl = TextEditingController();
  final toWalletCtrl = TextEditingController();
  final toUserCtrl = TextEditingController();
  final symbolCtrl = TextEditingController();
  final amountCtrl = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Transferir")),
      body: SingleChildScrollView(
        child: Column(
          children: [
            TextField(controller: fromWalletCtrl, decoration: const InputDecoration(labelText: "Carteira origem")),
            TextField(controller: toWalletCtrl, decoration: const InputDecoration(labelText: "Carteira destino (opcional)")),
            TextField(controller: toUserCtrl, decoration: const InputDecoration(labelText: "Usuário destino (opcional)")),
            TextField(controller: symbolCtrl, decoration: const InputDecoration(labelText: "Moeda")),
            TextField(controller: amountCtrl, decoration: const InputDecoration(labelText: "Quantidade")),
            ElevatedButton(
              onPressed: () async {
                await WalletService.transfer({
                  "fromWalletId": fromWalletCtrl.text,
                  if (toWalletCtrl.text.isNotEmpty) "toWalletId": toWalletCtrl.text,
                  if (toUserCtrl.text.isNotEmpty) "toUserId": int.parse(toUserCtrl.text),
                  "symbol": symbolCtrl.text,
                  "amount": double.parse(amountCtrl.text),
                });
                Navigator.pop(context);
              },
              child: const Text("Transferir"),
            )
          ],
        ),
      ),
    );
  }
}
