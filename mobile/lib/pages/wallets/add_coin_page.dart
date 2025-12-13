import 'package:flutter/material.dart';

import '../../services/wallet_service.dart';


class AddCoinPage extends StatefulWidget {
  final String walletId;
  const AddCoinPage({super.key, required this.walletId});

  @override
  State<AddCoinPage> createState() => _AddCoinPageState();
}

class _AddCoinPageState extends State<AddCoinPage> {
  final symbolCtrl = TextEditingController();
  final amountCtrl = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Adicionar Moeda")),
      body: Column(
        children: [
          TextField(controller: symbolCtrl, decoration: const InputDecoration(labelText: "Moeda")),
          TextField(controller: amountCtrl, decoration: const InputDecoration(labelText: "Quantidade")),
          ElevatedButton(
            onPressed: () async {
              await WalletService.addCoin(
                widget.walletId,
                symbolCtrl.text,
                double.parse(amountCtrl.text),
              );
              Navigator.pop(context);
            },
            child: const Text("Adicionar"),
          )
        ],
      ),
    );
  }
}
