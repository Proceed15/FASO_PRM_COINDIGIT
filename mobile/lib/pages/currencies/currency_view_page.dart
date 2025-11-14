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

  Future<void> loadCurrency(String id) async {
    setState(() => loading = true);

    try {
      currency = await CurrencyService.getById(id);
    } catch (_) {
      currency = null;
    }

    setState(() => loading = false);
  }

  void editCurrency(String id) {
    Navigator.pushNamed(context, "/currency/edit", arguments: id)
        .then((_) => loadCurrency(id));
  }

  void openHistory(String id) {
    Navigator.pushNamed(context, "/currency/history", arguments: id);
  }

  void deleteCurrency(String id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Excluir moeda"),
        content: const Text("Tem certeza que deseja excluir esta moeda?"),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text("Cancelar")),
          ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text("Excluir"))
        ],
      ),
    );

    if (confirm != true) return;

    await CurrencyService.delete(id);

    if (!mounted) return;
    Navigator.pop(context);
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
        title: const Text("Detalhes da Moeda"),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: currency == null ? null : () => deleteCurrency(currency!.id!),
          ),
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: currency == null ? null : () => editCurrency(currency!.id!),
          ),
        ],
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : currency == null
              ? const Center(child: Text("Moeda não encontrada"))
              : Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.monetization_on,
                          size: 80, color: Colors.white70),
                      const SizedBox(height: 20),

                      Text(
                        "${currency!.symbol} - ${currency!.name}",
                        style: const TextStyle(
                            fontSize: 26, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 10),

                      Text("Backing: ${currency!.backing}",
                          style: const TextStyle(
                              fontSize: 18, color: Colors.white70)),
                      const SizedBox(height: 10),

                      Text("Reverse: ${currency!.reverse ? "Sim" : "Não"}",
                          style: const TextStyle(
                              fontSize: 18, color: Colors.white70)),
                      const SizedBox(height: 30),

                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () => openHistory(currency!.id!),
                          child: const Text("Ver Histórico de Preços"),
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }
}
