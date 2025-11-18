import 'package:flutter/material.dart';
import '../../models/currency.dart';
import '../../services/currency_service.dart';

class CurrencyViewPage extends StatefulWidget {
  const CurrencyViewPage({super.key});

  @override
  State<CurrencyViewPage> createState() => _CurrencyViewPageState();
}

class _CurrencyViewPageState extends State<CurrencyViewPage> {
  Currency? currency;
  bool loading = true;

  Future<void> loadCurrency(Currency c) async {
    setState(() => loading = true);
    try {
      currency = await CurrencyService.getById(c.id!);
    } catch (_) {
      currency = c;
    }
    setState(() => loading = false);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)!.settings.arguments;
    if (args is Currency) loadCurrency(args);
  }

  void deleteCurrency() async {
    if (currency?.id == null) return;
    final confirm = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(title: const Text("Excluir moeda"), content: const Text("Confirmar?"), actions: [
        TextButton(onPressed: () => Navigator.pop(c, false), child: const Text("Cancelar")),
        ElevatedButton(onPressed: () => Navigator.pop(c, true), child: const Text("Excluir")),
      ]),
    );
    if (confirm == true) {
      await CurrencyService.delete(currency!.id!);
      if (!mounted) return;
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Detalhes da Moeda"),
        actions: [
          IconButton(icon: const Icon(Icons.edit), onPressed: currency == null ? null : () => Navigator.pushNamed(context, "/currency/edit", arguments: currency).then((_) => setState((){}))),
          IconButton(icon: const Icon(Icons.delete), onPressed: currency == null ? null : deleteCurrency),
        ],
      ),
      body: loading ? const Center(child: CircularProgressIndicator()) : currency == null ? const Center(child: Text("Moeda não encontrada")) : Padding(
        padding: const EdgeInsets.all(20),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Icon(Icons.monetization_on, size: 80, color: Colors.white70),
          const SizedBox(height: 20),
          Text("${currency!.symbol} - ${currency!.name}", style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          Text("Backing: ${currency!.backing}", style: const TextStyle(color: Colors.white70)),
          const SizedBox(height: 10),
          Text("Reverse: ${currency!.reverse ? "Sim" : "Não"}", style: const TextStyle(color: Colors.white70)),
          const SizedBox(height: 30),
          SizedBox(width: double.infinity, child: ElevatedButton(onPressed: () => Navigator.pushNamed(context, "/currency/history", arguments: currency), child: const Text("Ver Histórico"))),
        ]),
      ),
    );
  }
}
