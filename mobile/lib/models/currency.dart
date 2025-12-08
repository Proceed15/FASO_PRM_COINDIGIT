class Currency {
  final String? id;
  final String symbol;
  final String name;
  final String backing;
  final bool reverse;

  Currency({
    this.id,
    required this.symbol,
    required this.name,
    required this.backing,
    required this.reverse,
  });

  factory Currency.fromJson(Map<String, dynamic> json) => Currency(
        id: json['id'] != null ? json['id'].toString() : null,
        symbol: json['symbol']?.toString() ?? "",
        name: json['name']?.toString() ?? "",
        backing: json['backing']?.toString() ?? "",
        reverse: json['reverse'] == null
            ? false
            : (json['reverse'] is bool
                ? json['reverse']
                : json['reverse'].toString().toLowerCase() == 'true'),
      );

  Map<String, dynamic> toJson({bool includeId = true}) {
    final map = {
      "symbol": symbol,
      "name": name,
      "backing": backing,
      "reverse": reverse,
    };
    if (includeId && id != null) {
      map["id"] = id!;
    }
    return map;
  }
}

class CurrencyHistoryItem {
  final DateTime date;
  final double price;

  CurrencyHistoryItem({
    required this.date,
    required this.price,
  });

  factory CurrencyHistoryItem.fromJson(Map<String, dynamic> json) {
    return CurrencyHistoryItem(
      date: DateTime.parse(json['date'].toString()),
      price: (json['price'] as num).toDouble(),
    );
  }
}
