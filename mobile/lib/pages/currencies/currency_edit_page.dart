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
  Currency? currency;
  String? error;

  Future<void> load(Currency c) async {
    setState(() => loading = true);
    try {
      currency = await CurrencyService.getById(c.id!);
      symbolCtrl.text = currency?.symbol ?? "";
      nameCtrl.text = currency?.name ?? "";
      backingCtrl.text = currency?.backing ?? "";
      reverse = currency?.reverse ?? false;
    } catch (_) { error = "Erro"; }
    setState(() => loading = false);
  }

  Future<void> save() async {
    if (currency == null) return;
    setState(() { loading = true; });
    try {
      final updated = Currency(id: currency!.id, symbol: symbolCtrl.text.trim(), name: nameCtrl.text.trim(), backing: backingCtrl.text.trim(), reverse: reverse);
      await CurrencyService.update(currency!.id!, updated);
      if (!mounted) return;
      Navigator.pop(context);
    } catch (e) { setState(() => error = "Erro ao salvar"); }
    setState(() { loading = false; });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)!.settings.arguments;
    if (args is Currency) load(args);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Editar Moeda")),
      body: loading ? const Center(child: CircularProgressIndicator()) : error != null ? Center(child: Text(error!)) : SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(children: [
          TextField(controller: symbolCtrl, decoration: const InputDecoration(labelText: "Símbolo")),
          const SizedBox(height: 15),
          TextField(controller: nameCtrl, decoration: const InputDecoration(labelText: "Nome")),
          const SizedBox(height: 15),
          TextField(controller: backingCtrl, decoration: const InputDecoration(labelText: "Backing")),
          Row(children: [Checkbox(value: reverse, onChanged: (v) => setState(() => reverse = v ?? false)), const Text("Reverse")]),
          if (error != null) Text(error!, style: const TextStyle(color: Colors.redAccent)),
          const SizedBox(height: 25),
          SizedBox(width: double.infinity, child: ElevatedButton(onPressed: save, child: const Text("Salvar"))),
        ]),
      ),
    );
  }
}
