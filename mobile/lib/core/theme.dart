import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

final appTheme = ThemeData(
  brightness: Brightness.dark,
  scaffoldBackgroundColor: const Color(0xFF101320),

  colorScheme: const ColorScheme.dark(
    primary: Color(0xFF265DBF),
    secondary: Color(0xFF265DBF),
    surface: Color(0xFF0c0c1a),
    background: Color(0xFF101320),
  ),

  primaryColor: const Color(0xFF265DBF),

  textTheme: GoogleFonts.poppinsTextTheme(
    const TextTheme(
      bodyMedium: TextStyle(color: Colors.white),
    ),
  ),

  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: const Color(0xFF0c0c1a),
    labelStyle: const TextStyle(color: Colors.white70),
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: const BorderSide(color: Colors.blueAccent),
    ),
  ),

  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: const Color(0xFF265DBF),
      foregroundColor: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 14),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    ),
  ),
);
