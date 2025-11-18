import '../models/currency.dart';
import 'api_client.dart';

class CurrencyService {
  static final ApiClient _api = ApiClient();

  static Future<List<Currency>> getAll() async {
    final r = await _api.get("/Currency");
    if (r.statusCode != null && r.statusCode! < 400 && r.data is List) {
      return (r.data as List).map((e) => Currency.fromJson(e as Map<String, dynamic>)).toList();
    }
    return [];
  }

  static Future<Currency> getById(String id) async {
    final r = await _api.get("/Currency/$id");
    if (r.statusCode != null && r.statusCode! < 400) {
      return Currency.fromJson(r.data as Map<String, dynamic>);
    }
    throw Exception("Moeda não encontrada");
  }

  static Future<List<CurrencyHistoryItem>> getHistory(String id) async {
    final r = await _api.get("/Currency/$id/history");
    if (r.statusCode != null && r.statusCode! < 400 && r.data is List) {
      return (r.data as List).map((e) => CurrencyHistoryItem.fromJson(e as Map<String, dynamic>)).toList();
    }
    return [];
  }

  static Future<Currency> create(Currency currency) async {
    final r = await _api.post("/Currency", currency.toJson());
    if (r.statusCode != null && r.statusCode! < 400) {
      return Currency.fromJson(r.data as Map<String, dynamic>);
    }
    throw Exception("Falha ao criar moeda");
  }

  static Future<Currency> update(String id, Currency currency) async {
    final r = await _api.put("/Currency/$id", currency.toJson());
    if (r.statusCode != null && r.statusCode! < 400) {
      return Currency.fromJson(r.data as Map<String, dynamic>);
    }
    throw Exception("Falha ao atualizar moeda");
  }

  static Future<void> delete(String id) async {
    await _api.delete("/Currency/$id");
  }
}
