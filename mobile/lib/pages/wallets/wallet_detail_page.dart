import 'package:flutter/material.dart';

import '../../models/wallet.dart';
import '../../services/wallet_service.dart';
import 'add_coin_page.dart';


class WalletDetailPage extends StatelessWidget {
  final String walletId;

  const WalletDetailPage({super.key, required this.walletId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Carteira")),
      body: FutureBuilder(
        future: WalletService.getWallet(walletId),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }

          final wallet = snapshot.data as Wallet;

          return ListView(
            children: wallet.items.map((item) {
              return ListTile(
                title: Text(item.symbol),
                trailing: Text(item.amount.toString()),
              );
            }).toList(),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => AddCoinPage(walletId: walletId),
            ),
          );
        },
      ),
    );
  }
}
