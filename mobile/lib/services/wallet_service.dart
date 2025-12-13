import '../../services/api_client.dart';
import '../models/wallet.dart';
import '../models/transaction.dart';

class WalletService {
  static final _api = ApiClient();

  // Listar carteiras
  static Future<List<Wallet>> getWallets() async {
    final res = await _api.get("/api/wallet");
    return (res.data as List)
        .map((e) => Wallet.fromJson(e))
        .toList();
  }

  // Carteira específica
  static Future<Wallet> getWallet(String walletId) async {
    final res = await _api.get("/api/wallet/$walletId");
    return Wallet.fromJson(res.data);
  }

  // Adicionar moeda
  static Future<void> addCoin(
    String walletId,
    String symbol,
    double amount,
  ) async {
    await _api.post(
      "/api/wallet/$walletId/items",
      {
        "symbol": symbol,
        "amount": amount,
      },
    );
  }

  // Transferência (interna ou externa)
  static Future<void> transfer(Map<String, dynamic> body) async {
    await _api.post("/api/wallet/transfer", body);
  }

  // Histórico
  static Future<List<WalletTransaction>> getTransactions() async {
    final res = await _api.get("/api/wallet/transactions");
    return (res.data as List)
        .map((e) => WalletTransaction.fromJson(e))
        .toList();
  }
}
