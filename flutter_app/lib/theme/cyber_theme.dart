import 'package:flutter/material.dart';

class CyberTheme {
  static const Color bgPrimary = Color(0xFF060B17);
  static const Color bgSecondary = Color(0xFF0B1528);
  static const Color cardBg = Color(0xBF0D1930);
  
  static const Color cyberCyan = Color(0xFF00F0FF);
  static const Color cyberGreen = Color(0xFF00FF9D);
  static const Color cyberAmber = Color(0xFFFFB703);
  static const Color cyberCrimson = Color(0xFFFF0055);
  static const Color cyberBlue = Color(0xFF0088FF);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: bgPrimary,
      primaryColor: cyberCyan,
      cardColor: cardBg,
      fontFamily: 'Roboto',
      appBarTheme: const AppBarTheme(
        backgroundColor: bgSecondary,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.0,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: bgSecondary,
        selectedItemColor: cyberCyan,
        unselectedItemColor: Color(0xFF4A5D78),
        type: BottomNavigationBarType.fixed,
      ),
      colorScheme: const ColorScheme.dark(
        primary: cyberCyan,
        secondary: cyberGreen,
        error: cyberCrimson,
        surface: cardBg,
      ),
    );
  }
}
