import 'package:flutter/material.dart';

// Auth
import 'pages/auth/login_page.dart';
import 'pages/auth/register_page.dart';

// Dashboard
import 'pages/dashboard/dashboard_page.dart';

//wallet
import 'pages/wallets/wallets_page.dart';

// Currencies
import 'pages/currencies/currency_list_page.dart';
import 'pages/currencies/currency_view_page.dart';
import 'pages/currencies/currency_create_page.dart';
import 'pages/currencies/currency_edit_page.dart';
import 'pages/currencies/currency_history_page.dart';

// Users
import 'pages/users/user_list_page.dart';
import 'pages/users/user_view_page.dart';
import 'pages/users/user_create_page.dart';
import 'pages/users/user_edit_page.dart';
import 'pages/users/user_profile_page.dart';

// Chatbot
import 'pages/chatbot/chatbot_page.dart';

final Map<String, WidgetBuilder> appRoutes = {
  // Auth
  '/login': (context) => const LoginPage(),
  '/register': (context) => const RegisterPage(),

  // Dashboard
  '/dashboard': (context) => const DashboardPage(),

  // Currencies
  '/currencies': (context) => const CurrencyListPage(),
  '/currency/view': (context) => const CurrencyViewPage(),
  '/currency/create': (context) => const CurrencyCreatePage(),
  '/currency/edit': (context) => const CurrencyEditPage(),
  '/currency/history': (context) => const CurrencyHistoryPage(),

  // Users
  '/users': (context) => const UserListPage(),
  '/user/view': (context) => const UserViewPage(),
  '/user/create': (context) => const UserCreatePage(),
  '/user/edit': (context) => const UserEditPage(),
  '/user/profile': (context) => const UserProfilePage(),

  // Chatbot
  '/chatbot': (context) => const ChatbotPage(),

    // Wallet
  '/wallets': (context) => const WalletsPage(),

};
