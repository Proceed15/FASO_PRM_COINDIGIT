import 'package:flutter/material.dart';
import 'routes.dart';
import 'core/theme.dart';

void main() {
  runApp(const CoinDigitApp());
}

class CoinDigitApp extends StatelessWidget {
  const CoinDigitApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CoinDigit Mobile',
      debugShowCheckedModeBanner: false,
      theme: appTheme,
      initialRoute: '/login',
      routes: appRoutes,
    );
  }
}
