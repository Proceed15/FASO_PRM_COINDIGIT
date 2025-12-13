class WalletTransaction {
  final String symbol;
  final double amount;
  final DateTime createdAt;
  final int fromUserId;
  final int toUserId;

  WalletTransaction({
    required this.symbol,
    required this.amount,
    required this.createdAt,
    required this.fromUserId,
    required this.toUserId,
  });

  factory WalletTransaction.fromJson(Map<String, dynamic> json) {
    return WalletTransaction(
      symbol: json['symbol'],
      amount: (json['amount'] as num).toDouble(),
      createdAt: DateTime.parse(json['createdAt']),
      fromUserId: json['fromUserId'],
      toUserId: json['toUserId'],
    );
  }
}
