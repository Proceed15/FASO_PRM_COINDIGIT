class Currency {
  String? id;
  String symbol;
  String name;
  String backing;
  bool reverse;
  double? price; // usado no dashboard e histórico

  Currency({
    this.id,
    required this.symbol,
    required this.name,
    required this.backing,
    this.reverse = false,
    this.price,
  });

  factory Currency.fromJson(Map<String, dynamic> json) => Currency(
        id: json['id']?.toString(),
        symbol: json['symbol'] ?? "",
        name: json['name'] ?? "",
        backing: json['backing'] ?? "",
        reverse: json['reverse'] == true || json['reverse'] == "true",
        price: json['price'] != null
            ? double.tryParse(json['price'].toString())
            : json['lastPrice'] != null
                ? double.tryParse(json['lastPrice'].toString())
                : null,
      );

  Map<String, dynamic> toJson() => {
        if (id != null) 'id': id,
        'symbol': symbol,
        'name': name,
        'backing': backing,
        'reverse': reverse,
        if (price != null) 'price': price,
      };
}

// ---------------------------
// MODELO DO HISTÓRICO DE PREÇOS
// ---------------------------

class CurrencyHistoryItem {
  String id;
  String currencyId;
  double price;
  DateTime date;

  CurrencyHistoryItem({
    required this.id,
    required this.currencyId,
    required this.price,
    required this.date,
  });

  factory CurrencyHistoryItem.fromJson(Map<String, dynamic> json) =>
      CurrencyHistoryItem(
        id: json['id']?.toString() ?? '',
        currencyId: json['currencyId']?.toString() ?? '',
        price: double.tryParse(json['price']?.toString() ?? '0') ?? 0,
        date: DateTime.tryParse(json['date'] ?? json['createdAt'] ?? "") ??
            DateTime.now(),
      );
}
