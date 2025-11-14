//import 'package:dio/dio.dart';
import '../models/currency.dart';
import 'api_client.dart';
import '../core/constants.dart';

class CurrencyService {
  static final ApiClient _api = ApiClient(baseUrl: API_BASE);

  // LIST MOEDAS
  static Future<List<Currency>> getAll() async {
    final endpoints = [
      "/api/Currency",
      "/api/currencies",
      "/currencies",
      "/currency"
    ];

    for (final ep in endpoints) {
      try {
        final r = await _api.get(ep);

        if (r.statusCode != null && r.statusCode! < 400) {
          if (r.data is List) {
            return (r.data as List)
                .map((e) => Currency.fromJson(e as Map<String, dynamic>))
                .toList();
          }
        }
      } catch (_) {}
    }

    throw Exception("Falha ao carregar moedas.");
  }

  // BUSCAR POR ID
  static Future<Currency> getById(String id) async {
    final endpoints = [
      "/api/Currency/$id",
      "/api/currencies/$id",
      "/currencies/$id",
      "/currency/$id"
    ];

    for (final ep in endpoints) {
      try {
        final r = await _api.get(ep);

        if (r.statusCode != null &&
            r.statusCode! < 400 &&
            r.data is Map<String, dynamic>) {
          return Currency.fromJson(r.data as Map<String, dynamic>);
        }
      } catch (_) {}
    }

    throw Exception("Moeda não encontrada.");
  }

  // CRIAR MOEDA
  static Future<Currency> create(Currency currency) async {
    final endpoints = [
      "/api/Currency",
      "/api/currencies",
      "/currencies",
      "/currency",
    ];

    for (final ep in endpoints) {
      try {
        final r = await _api.post(ep, currency.toJson());

        if (r.statusCode != null && r.statusCode! < 400) {
          return Currency.fromJson(r.data as Map<String, dynamic>);
        }
      } catch (_) {}
    }

    throw Exception("Falha ao criar moeda.");
  }

  // ATUALIZAR MOEDA
  static Future<Currency> update(String id, Currency currency) async {
    final endpoints = [
      "/api/Currency/$id",
      "/api/currencies/$id",
      "/currencies/$id",
      "/currency/$id"
    ];

    for (final ep in endpoints) {
      try {
        final r = await _api.put(ep, currency.toJson());

        if (r.statusCode != null && r.statusCode! < 400) {
          return Currency.fromJson(r.data as Map<String, dynamic>);
        }
      } catch (_) {}
    }

    throw Exception("Falha ao atualizar moeda.");
  }

  // DELETAR MOEDA
  static Future<void> delete(String id) async {
    final endpoints = [
      "/api/Currency/$id",
      "/api/currencies/$id",
      "/currencies/$id",
      "/currency/$id",
    ];

    for (final ep in endpoints) {
      try {
        final r = await _api.delete(ep);
        if (r.statusCode != null && r.statusCode! < 400) return;
      } catch (_) {}
    }

    throw Exception("Falha ao excluir moeda.");
  }

  // HISTÓRICO
  static Future<List<CurrencyHistoryItem>> getHistory(String currencyId) async {
    final endpoints = [
      "/api/Currency/$currencyId/history",
      "/api/currencies/$currencyId/history",
      "/currencies/$currencyId/history",
      "/currency/$currencyId/history",
    ];

    for (final ep in endpoints) {
      try {
        final r = await _api.get(ep);

        if (r.statusCode != null &&
            r.statusCode! < 400 &&
            r.data is List) {
          return (r.data as List)
              .map((e) => CurrencyHistoryItem.fromJson(e))
              .toList();
        }
      } catch (_) {}
    }
    //retornar lista vazia
    return [];
  }
}
