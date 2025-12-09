import 'package:flutter/material.dart';
import '../../models/currency.dart';
import '../../services/currency_service.dart';

class CurrencyCreatePage extends StatefulWidget {
  const CurrencyCreatePage({super.key});

  @override
  State<CurrencyCreatePage> createState() => _CurrencyCreatePageState();
}

class _CurrencyCreatePageState extends State<CurrencyCreatePage> {
  final symbolCtrl = TextEditingController();
  final nameCtrl = TextEditingController();
  final backingCtrl = TextEditingController();
  bool reverse = false;
  bool loading = false;
  String? error;

  Future<void> create() async {
    setState(() { loading = true; error = null; });
    try {
      final currency = Currency(
        symbol: symbolCtrl.text.trim(),
        name: nameCtrl.text.trim(),
        backing: backingCtrl.text.trim(),
        reverse: reverse,
      );
      await CurrencyService.create(currency);
      if (!mounted) return;
      Navigator.pop(context, true); //RELOAD
    } catch (e) {
      setState(() => error = "Erro ao criar moeda: $e");
    }
    setState(() { loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Criar Moeda")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(children: [
          TextField(controller: symbolCtrl, decoration: const InputDecoration(labelText: "Símbolo")),
          const SizedBox(height: 15),
          TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: "Nome")),
          const SizedBox(height: 15),
          TextField(controller: backingCtrl, decoration: const InputDecoration(labelText: "Backing")),
          const SizedBox(height: 15),
          Row(children: [
            Checkbox(value: reverse, onChanged: (v) => setState(() => reverse = v ?? false)),
            const Text("Reverse")
          ]),
          if (error != null)
            Text(error!, style: const TextStyle(color: Colors.redAccent)),
          const SizedBox(height: 25),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: loading ? null : create,
              child: loading
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white))
                  : const Text("Criar"),
            ),
          ),
        ]),
      ),
    );
  }
}
