import 'package:flutter/material.dart';

class AddItemForm extends StatefulWidget {
  final String walletId;
  final List walletItems;
  final Function(List updated) onSuccess;
  final VoidCallback onClose;

  const AddItemForm({
    super.key,
    required this.walletId,
    required this.walletItems,
    required this.onSuccess,
    required this.onClose,
  });

  @override
  State<AddItemForm> createState() => _AddItemFormState();
}

class _AddItemFormState extends State<AddItemForm> {
  String symbol = "";
  double amount = 0;
  String message = "";

  @override
  Widget build(BuildContext context) {
    return _modal(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // TÍTULO  
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "Adicionar Moeda",
                style: TextStyle(fontSize: 20, color: Colors.white),
              ),
              IconButton(
                icon: const Icon(Icons.close, color: Colors.white),
                onPressed: widget.onClose,
              ),
            ],
          ),

          const SizedBox(height: 10),

          // INPUT SIMBOLO  
          TextField(
            onChanged: (v) => symbol = v.toUpperCase(),
            style: const TextStyle(color: Colors.white),
            decoration: _input("Símbolo (BTC, ETH...)"),
          ),

          const SizedBox(height: 10),

          TextField(
            keyboardType: TextInputType.number,
            onChanged: (v) => amount = double.tryParse(v) ?? 0,
            style: const TextStyle(color: Colors.white),
            decoration: _input("Quantidade"),
          ),

          const SizedBox(height: 15),
          if (message.isNotEmpty)
            Text(
              message,
              style: TextStyle(
                  color: message.contains("sucesso")
                      ? Colors.green
                      : Colors.redAccent),
            ),

          const SizedBox(height: 20),

          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton(
                onPressed: widget.onClose,
                child: const Text("Cancelar", style: TextStyle(color: Colors.red)),
              ),
              ElevatedButton(
                onPressed: () {
                  if (symbol.isEmpty || amount <= 0) {
                    setState(() => message = "Preencha os campos!");
                    return;
                  }

                  List updated = List.from(widget.walletItems);
                  final existing = updated.firstWhere(
                    (i) => i["symbol"] == symbol,
                    orElse: () => null,
                  );

                  if (existing != null) {
                    existing["amount"] += amount;
                  } else {
                    updated.add({
                      "symbol": symbol,
                      "amount": amount,
                      "lastPriceUsd": 0,
                      "totalUsd": 0,
                    });
                  }

                  widget.onSuccess(updated);
                  setState(() => message = "Adicionado com sucesso!");
                },
                child: const Text("Adicionar"),
              ),
            ],
          ),
        ],
      ),
    );
  }

  InputDecoration _input(String label) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: Colors.white),
      filled: true,
      fillColor: const Color(0xff0f1a45),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
    );
  }

  Widget _modal({required Widget child}) {
    return Positioned.fill(
      child: Container(
        color: Colors.black54,
        child: Center(
          child: Container(
            width: 350,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xff1b2c66),
              borderRadius: BorderRadius.circular(12),
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}
