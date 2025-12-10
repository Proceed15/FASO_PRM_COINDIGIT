import '../models/currency.dart';
import 'api_client.dart';

class CurrencyService {
  static final ApiClient _api = ApiClient();

  static Future<List<Currency>> getAll() async {
    final r = await _api.get("/api/Currency");
    if (r.statusCode != null && r.statusCode! < 400 && r.data is List) {
      return (r.data as List)
          .map((e) => Currency.fromJson(e as Map<String, dynamic>))
          .toList();
    }
    return [];
  }

  static Future<Currency> getById(String id) async {
    final r = await _api.get("/api/Currency/$id");
    if (r.statusCode != null && r.statusCode! < 400) {
      return Currency.fromJson(r.data as Map<String, dynamic>);
    }
    throw Exception("Moeda não encontrada");
  }

  static Future<Currency> create(Currency currency) async {
    final r = await _api.post(
      "/api/Currency",
      currency.toJson(includeId: false),
    );
    if (r.statusCode != null && r.statusCode! < 400) {
      return Currency.fromJson(r.data as Map<String, dynamic>);
    }
    throw Exception("Falha ao criar moeda");
  }

  /*static Future<Currency> update(String id, Currency currency) async {
    final r = await _api.put("/api/Currency/$id", currency.toJson(includeId: false));
    if (r.statusCode != null && r.statusCode! < 400) {
      return Currency.fromJson(r.data as Map<String, dynamic>);
    }
    throw Exception("Falha ao atualizar moeda: ${r.statusCode} ${r.data}");
  }*/

  static Future<Currency> update(String id, Currency currency) async {
    final r = await _api.put(
      "/api/Currency/$id",
      currency.toJson(includeId: false),
    );

    if (r.statusCode != null && r.statusCode! < 400) {
      if (r.data is Map<String, dynamic>) {
        return Currency.fromJson(r.data as Map<String, dynamic>);
      }
      return currency;
    }

    throw Exception("Falha ao atualizar moeda");
  }

  static Future<void> delete(String id) async {
    await _api.delete("/api/Currency/$id");
  }

  static Future<List<CurrencyHistoryItem>> getHistory(String id) async {
    final r = await _api.get("/api/Currency/$id/history");
    if (r.statusCode != null && r.statusCode! < 400 && r.data is List) {
      return (r.data as List)
          .map((e) => CurrencyHistoryItem.fromJson(e as Map<String, dynamic>))
          .toList();
    }
    return [];
  }
}
