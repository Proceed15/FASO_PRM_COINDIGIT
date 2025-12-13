class WalletItem {
  final String symbol;
  final double amount;

  WalletItem({
    required this.symbol,
    required this.amount,
  });

  factory WalletItem.fromJson(Map<String, dynamic> json) {
    return WalletItem(
      symbol: json['symbol'],
      amount: (json['amount'] as num).toDouble(),
    );
  }
}
