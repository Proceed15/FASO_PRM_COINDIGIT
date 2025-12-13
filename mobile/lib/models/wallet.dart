import 'wallet_item.dart';

class Wallet {
  final String id;
  final List<WalletItem> items;

  Wallet({
    required this.id,
    required this.items,
  });

  factory Wallet.fromJson(Map<String, dynamic> json) {
    return Wallet(
      id: json['id'],
      items: (json['items'] as List)
          .map((e) => WalletItem.fromJson(e))
          .toList(),
    );
  }
}
