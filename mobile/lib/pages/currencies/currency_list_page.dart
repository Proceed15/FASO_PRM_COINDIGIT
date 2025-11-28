import 'package:flutter/material.dart';
import '../../models/currency.dart';
import '../../services/currency_service.dart';

class CurrencyListPage extends StatefulWidget {
  const CurrencyListPage({super.key});
  @override
  State<CurrencyListPage> createState() => _CurrencyListPageState();
}

class _CurrencyListPageState extends State<CurrencyListPage> {
  List<Currency> list = [];
  bool loading = true;

  Future<void> load() async {
    setState(() => loading = true);
    try {
      list = await CurrencyService.getAll();
    } catch (_) { list = []; }
    setState(() => loading = false);
  }

  @override
  void initState() { super.initState(); load(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Moedas")),
      floatingActionButton: FloatingActionButton(onPressed: () => Navigator.pushNamed(context, "/currency/create").then((_) => load()), child: const Icon(Icons.add)),
      body: loading ? const Center(child: CircularProgressIndicator()) : list.isEmpty ? const Center(child: Text("Nenhuma moeda")) : ListView.builder(
        itemCount: list.length,
        itemBuilder: (context, i) {
          final c = list[i];
          return Card(
            color: const Color(0xFF0c0c1a),
            child: ListTile(
              title: Text("${c.symbol} - ${c.name}", style: const TextStyle(color: Colors.white)),
              subtitle: Text("Backing: ${c.backing}", style: const TextStyle(color: Colors.white70)),
              trailing: const Icon(Icons.arrow_forward_ios, color: Colors.white70, size: 16),
              onTap: () => Navigator.pushNamed(context, "/currency/view", arguments: c).then((_) => load()),
            ),
          );
        },
      ),
    );
  }
}
