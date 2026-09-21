import 'package:flutter/material.dart';
import 'theme/cyber_theme.dart';
import 'screens/dashboard_screen.dart';
import 'screens/vehicle_screen.dart';
import 'screens/charging_screen.dart';
import 'screens/alerts_screen.dart';
import 'screens/reports_screen.dart';

void main() {
  runApp(const EVSentinelApp());
}

class EVSentinelApp extends StatelessWidget {
  const EVSentinelApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EV-Sentinel',
      debugShowCheckedModeBanner: false,
      theme: CyberTheme.darkTheme,
      home: const MainNavigationShell(),
    );
  }
}

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({Key? key}) : super(key: key);

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    DashboardScreen(),
    VehicleScreen(),
    ChargingScreen(),
    AlertsScreen(),
    ReportsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.directions_car), label: 'Vehicle'),
          BottomNavigationBarItem(icon: Icon(Icons.ev_station), label: 'Charging'),
          BottomNavigationBarItem(icon: Icon(Icons.shield), label: 'Alerts'),
          BottomNavigationBarItem(icon: Icon(Icons.analytics), label: 'Reports'),
        ],
      ),
    );
  }
}
