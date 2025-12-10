import 'package:flutter/material.dart';
import '../../models/currency.dart';
import '../../services/currency_service.dart';

class CurrencyHistoryPage extends StatefulWidget {
  const CurrencyHistoryPage({super.key});

  @override
  State<CurrencyHistoryPage> createState() => _CurrencyHistoryPageState();
}

class _CurrencyHistoryPageState extends State<CurrencyHistoryPage> {
  List<CurrencyHistoryItem> history = [];
  bool loading = true;

  Future<void> load(String id) async {
    setState(() => loading = true);
    try {
      history = await CurrencyService.getHistory(id);
    } catch (_) { history = []; }
    setState(() => loading = false);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)!.settings.arguments;
    if (args is Currency) load(args.id!);
  }

  String formatDate(DateTime d) => "${d.day.toString().padLeft(2,'0')}/${d.month.toString().padLeft(2,'0')}/${d.year}";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Histórico")),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : history.isEmpty
              ? const Center(child: Text("Nenhum dado"))
              : ListView.builder(
                  itemCount: history.length,
                  itemBuilder: (context, i) {
                    final h = history[i];
                    return Card(
                      color: const Color(0xFF0c0c1a),
                      child: ListTile(
                        leading: const Icon(Icons.trending_up, color: Colors.white70),
                        title: Text("R\$ ${h.price.toStringAsFixed(2)}", style: const TextStyle(color: Colors.white)),
                        subtitle: Text(formatDate(h.date), style: const TextStyle(color: Colors.white70)),
                      ),
                    );
                  },
                ),
    );
  }
}
