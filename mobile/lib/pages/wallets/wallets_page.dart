import 'package:flutter/material.dart';

import '../../models/wallet.dart';
import '../../services/wallet_service.dart';
import 'wallet_detail_page.dart';


class WalletsPage extends StatefulWidget {
  const WalletsPage({super.key});

  @override
  State<WalletsPage> createState() => _WalletsPageState();
}

class _WalletsPageState extends State<WalletsPage> {
  late Future walletsFuture;

  @override
  void initState() {
    super.initState();
    walletsFuture = WalletService.getWallets();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Minhas Carteiras")),
      body: FutureBuilder(
        future: walletsFuture,
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }

          final wallets = snapshot.data as List<Wallet>;

          return ListView.builder(
            itemCount: wallets.length,
            itemBuilder: (_, i) {
              final w = wallets[i];
              return ListTile(
                title: Text("Carteira ${w.id.substring(0, 6)}"),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => WalletDetailPage(walletId: w.id),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}
