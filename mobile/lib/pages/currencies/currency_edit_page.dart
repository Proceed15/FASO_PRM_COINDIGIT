import 'package:flutter/material.dart';
import '../../models/currency.dart';
import '../../services/currency_service.dart';

class CurrencyEditPage extends StatefulWidget {
  const CurrencyEditPage({super.key});

  @override
  State<CurrencyEditPage> createState() => _CurrencyEditPageState();
}

class _CurrencyEditPageState extends State<CurrencyEditPage> {
  final symbolCtrl = TextEditingController();
  final nameCtrl = TextEditingController();
  final backingCtrl = TextEditingController();
  bool reverse = false;

  bool loading = true;
  String? currencyId;
  String? error;

  Future<void> loadCurrency(String id) async {
    setState(() => loading = true);

    try {
      final c = await CurrencyService.getById(id);

      currencyId = c.id;
      symbolCtrl.text = c.symbol;
      nameCtrl.text = c.name;
      backingCtrl.text = c.backing;
      reverse = c.reverse;
    } catch (_) {
      error = "Moeda não encontrada";
    }

    setState(() => loading = false);
  }

  Future<void> save() async {
    if (currencyId == null) return;

    setState(() {
      loading = true;
      error = null;
    });

    try {
      final currency = Currency(
        id: currencyId,
        symbol: symbolCtrl.text,
        name: nameCtrl.text,
        backing: backingCtrl.text,
        reverse: reverse,
      );

      await CurrencyService.update(currencyId!, currency);

      if (!mounted) return;
      Navigator.pop(context);
    } catch (e) {
      setState(() => error = "Erro ao salvar alterações.");
    }

    setState(() => loading = false);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    final id = ModalRoute.of(context)!.settings.arguments as String;
    loadCurrency(id);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Editar Moeda"),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
              ? Center(child: Text(error!))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      TextField(
                        controller: symbolCtrl,
                        decoration: const InputDecoration(labelText: "Símbolo"),
                      ),
                      const SizedBox(height: 15),

                      TextField(
                        controller: nameCtrl,
                        decoration: const InputDecoration(labelText: "Nome"),
                      ),
                      const SizedBox(height: 15),

                      TextField(
                        controller: backingCtrl,
                        decoration: const InputDecoration(labelText: "Backing"),
                      ),
                      const SizedBox(height: 15),

                      Row(
                        children: [
                          Checkbox(
                            value: reverse,
                            onChanged: (v) => setState(() => reverse = v ?? false),
                          ),
                          const Text("Reverse")
                        ],
                      ),

                      if (error != null) ...[
                        const SizedBox(height: 10),
                        Text(error!, style: const TextStyle(color: Colors.redAccent)),
                      ],

                      const SizedBox(height: 25),

                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: save,
                          child: const Text("Salvar"),
                        ),
                      )
                    ],
                  ),
                ),
    );
  }
}
