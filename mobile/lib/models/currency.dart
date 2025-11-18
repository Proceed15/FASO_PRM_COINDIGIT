class Currency {
  String? id;
  String symbol;
  String name;
  String backing;
  bool reverse;
  double? price;

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
        symbol: json['symbol'] ?? json['Symbol'] ?? "",
        name: json['name'] ?? json['Name'] ?? "",
        backing: json['backing'] ?? json['Backing'] ?? "",
        reverse: json['reverse'] == true || json['Reverse'] == true,
        price: json['price'] != null ? double.tryParse(json['price'].toString()) : null,
      );

  Map<String, dynamic> toJson() {
    final m = <String, dynamic>{};
    if (id != null) m['id'] = id;
    m['symbol'] = symbol;
    m['name'] = name;
    m['backing'] = backing;
    m['reverse'] = reverse;
    if (price != null) m['price'] = price;
    return m;
  }
}

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

  factory CurrencyHistoryItem.fromJson(Map<String, dynamic> json) => CurrencyHistoryItem(
        id: json['id']?.toString() ?? '',
        currencyId: json['currencyId']?.toString() ?? '',
        price: double.tryParse(json['price']?.toString() ?? '0') ?? 0,
        date: DateTime.tryParse(json['date'] ?? json['createdAt'] ?? '') ?? DateTime.now(),
      );
}
