import 'package:flutter/material.dart';

import '../../models/transaction.dart';
import '../../services/wallet_service.dart';


class TransactionsPage extends StatelessWidget {
  const TransactionsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Histórico")),
      body: FutureBuilder(
        future: WalletService.getTransactions(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }

          final txs = snapshot.data as List<WalletTransaction>;

          return ListView(
            children: txs.map((t) {
              return ListTile(
                title: Text("${t.symbol} ${t.amount}"),
                subtitle: Text(t.createdAt.toString()),
              );
            }).toList(),
          );
        },
      ),
    );
  }
}
