import 'package:flutter/material.dart';

// Auth
import 'pages/auth/login_page.dart';
import 'pages/auth/register_page.dart';

// Dashboard
import 'pages/dashboard/dashboard_page.dart';

// Users
import 'pages/users/user_list_page.dart';
import 'pages/users/user_view_page.dart';
import 'pages/users/user_create_page.dart';
import 'pages/users/user_edit_page.dart';
import 'pages/users/user_profile_page.dart';

// Currencies
import 'pages/currencies/currency_list_page.dart';
import 'pages/currencies/currency_view_page.dart';
import 'pages/currencies/currency_create_page.dart';
import 'pages/currencies/currency_edit_page.dart';
import 'pages/currencies/currency_history_page.dart';

final Map<String, WidgetBuilder> appRoutes = {
  '/login': (context) => const LoginPage(),
  '/register': (context) => const RegisterPage(),
  '/dashboard': (context) => const DashboardPage(),

  // Users
  '/users': (context) => const UserListPage(),
  '/users/create': (context) => const UserCreatePage(),
  '/users/view': (context) => const UserViewPage(),
  '/users/edit': (context) => const UserEditPage(),
  '/user/profile': (context) => const UserProfilePage(),

  // Currencies
  '/currencies': (context) => const CurrencyListPage(),
  '/currency/view': (context) => const CurrencyViewPage(),
  '/currency/create': (context) => const CurrencyCreatePage(),
  '/currency/edit': (context) => const CurrencyEditPage(),
  '/currency/history': (context) => const CurrencyHistoryPage(),
};
