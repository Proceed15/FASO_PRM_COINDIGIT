import 'package:flutter/material.dart';
import '../../models/currency.dart';
import '../../services/currency_service.dart';

class CurrencyListPage extends StatefulWidget {
  const CurrencyListPage({super.key});

  @override
  State<CurrencyListPage> createState() => _CurrencyListPageState();
}

class _CurrencyListPageState extends State<CurrencyListPage> {
  List<Currency> currencies = [];
  bool loading = true;

  Future<void> loadCurrencies() async {
    setState(() => loading = true);

    try {
      currencies = await CurrencyService.getAll();
    } catch (_) {
      currencies = [];
    }

    setState(() => loading = false);
  }

  @override
  void initState() {
    super.initState();
    loadCurrencies();
  }

  void openCurrency(Currency c) {
    Navigator.pushNamed(context, "/currency/view", arguments: c.id)
        .then((_) => loadCurrencies());
  }

  void createCurrency() {
    Navigator.pushNamed(context, "/currency/create")
        .then((_) => loadCurrencies());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Moedas"),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: createCurrency,
        child: const Icon(Icons.add),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : currencies.isEmpty
              ? const Center(child: Text("Nenhuma moeda cadastrada"))
              : ListView.builder(
                  itemCount: currencies.length,
                  itemBuilder: (context, i) {
                    final c = currencies[i];

                    return Card(
                      color: const Color(0xFF0c0c1a),
                      child: ListTile(
                        title: Text(
                          "${c.symbol} - ${c.name}",
                          style: const TextStyle(color: Colors.white),
                        ),
                        subtitle: Text(
                          "Backing: ${c.backing}",
                          style: const TextStyle(color: Colors.white70),
                        ),
                        trailing: const Icon(Icons.arrow_forward_ios,
                            size: 18, color: Colors.white70),
                        onTap: () => openCurrency(c),
                      ),
                    );
                  },
                ),
    );
  }
}
