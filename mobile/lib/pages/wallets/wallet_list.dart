import 'package:flutter/material.dart';

class WalletList extends StatelessWidget {
  final List wallets;
  final Function(Map wallet) onSelect;
  final Function onCreate;

  const WalletList({
    super.key,
    required this.wallets,
    required this.onSelect,
    required this.onCreate,
  });

  @override
  Widget build(BuildContext context) {
    final totalFundos =
        wallets.fold(0.0, (sum, w) => sum + (w["totalUsd"] ?? 0));

    return Column(
      children: [
        const SizedBox(height: 20),

        // TOTAL FUNDOS
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            border: Border.all(color: Colors.white),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Center(
            child: Text(
              "TOTAL DE FUNDOS: \$${totalFundos.toStringAsFixed(2)}",
              style: const TextStyle(fontSize: 20, color: Colors.white),
            ),
          ),
        ),

        const SizedBox(height: 20),

        // BOTÃO CRIAR
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.yellow[600],
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            onPressed: () => onCreate(),
            child: const Text(
              "Criar Nova Carteira",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),

        const SizedBox(height: 20),

        // LISTA
        Expanded(
          child: wallets.isEmpty
              ? const Center(
                  child: Text(
                    "Você ainda não possui carteiras cadastradas.",
                    style: TextStyle(color: Colors.white70),
                  ),
                )
              : GridView.builder(
                  padding: const EdgeInsets.all(10),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 1,
                    mainAxisExtent: 150,
                    mainAxisSpacing: 16,
                  ),
                  itemCount: wallets.length,
                  itemBuilder: (context, i) {
                    final w = wallets[i];

                    return GestureDetector(
                      onTap: () => onSelect(w),
                      child: Container(
                        decoration: BoxDecoration(
                          color: const Color(0xff171e33),
                          border: Border.all(color: Colors.yellow),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.account_balance_wallet,
                                size: 40, color: Colors.white),
                            const SizedBox(height: 8),
                            Text(
                              "Carteira ${w["walletId"].substring(0, 8)}",
                              style: const TextStyle(
                                  color: Colors.white, fontSize: 18),
                            ),
                            Text(
                              "\$${w["totalUsd"].toStringAsFixed(2)}",
                              style: const TextStyle(
                                color: Colors.yellow,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}
