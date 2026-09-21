import 'dart:async';
import 'package:flutter/material.dart';
import '../theme/cyber_theme.dart';
import '../widgets/circular_score_gauge.dart';
import '../models/telemetry_model.dart';
import '../services/api_service.dart';
import 'demo_attack_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final ApiService _apiService = ApiService();
  int _securityScore = 92;
  String _securityStatus = 'Safe';
  VehicleTelemetry _telemetry = VehicleTelemetry(
    speed: 45.0,
    batteryVoltage: 392.4,
    batteryTemp: 32.4,
    motorCurrent: 41.2,
    chargingVoltage: 400.0,
    chargingCurrent: 31.8,
    canMsgFrequency: 260.0,
    esp32Vibration: 0.18,
  );
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _startPolling();
  }

  void _startPolling() {
    _timer = Timer.periodic(const Duration(seconds: 3), (_) async {
      final res = await _apiService.fetchVehicleStatus();
      if (res.isNotEmpty && mounted) {
        setState(() {
          if (res['ai_health'] != null) {
            _securityScore = res['ai_health']['security_score'] ?? 92;
            _securityStatus = res['ai_health']['risk_level'] ?? 'Safe';
          }
          if (res['telemetry'] != null) {
            _telemetry = VehicleTelemetry.fromJson(res['telemetry']);
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('EV-SENTINEL DASHBOARD'),
        actions: [
          IconButton(
            icon: const Icon(Icons.flash_on, color: CyberTheme.cyberAmber),
            tooltip: 'Hackathon Demo Mode',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const DemoAttackScreen()),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Circular Score Card
            Container(
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
              decoration: BoxDecoration(
                color: CyberTheme.cardBg,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: CyberTheme.cyberCyan.withOpacity(0.3)),
              ),
              child: Column(
                children: [
                  const Text(
                    'OVERALL CYBERSECURITY SCORE',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.0,
                      color: Colors.white70,
                    ),
                  ),
                  const SizedBox(height: 16),
                  CircularSecurityGauge(
                    score: _securityScore,
                    status: _securityStatus,
                    size: 190,
                  ),
                  const SizedBox(height: 12),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Text('Autoencoder Loss: 0.124 MSE', style: TextStyle(fontSize: 11, color: CyberTheme.cyberCyan)),
                      Text('Confidence: 96.4%', style: TextStyle(fontSize: 11, color: CyberTheme.cyberGreen)),
                    ],
                  )
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Telemetry Grid
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 1.6,
              children: [
                _metricTile('SPEED', '${_telemetry.speed.toStringAsFixed(1)} km/h', Icons.speed),
                _metricTile('BATTERY V', '${_telemetry.batteryVoltage.toStringAsFixed(1)} V', Icons.electric_bolt),
                _metricTile('BATTERY TEMP', '${_telemetry.batteryTemp.toStringAsFixed(1)} °C', Icons.thermostat),
                _metricTile('ACTIVE THREATS', '1 Detected', Icons.security, isThreat: true),
              ],
            ),
            const SizedBox(height: 16),

            // Quick Demo Launcher Button
            ElevatedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const DemoAttackScreen()),
                );
              },
              icon: const Icon(Icons.bug_report, color: Colors.white),
              label: const Text('OPEN HACKATHON DEMO PANEL (SCREEN 19)'),
              style: ElevatedButton.styleFrom(
                backgroundColor: CyberTheme.cyberCrimson,
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _metricTile(String label, String val, IconData icon, {bool isThreat = false}) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: CyberTheme.cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isThreat ? CyberTheme.cyberCrimson.withOpacity(0.5) : Colors.white.withOpacity(0.08),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: const TextStyle(fontSize: 10, color: Colors.white60)),
              Icon(icon, size: 16, color: isThreat ? CyberTheme.cyberCrimson : CyberTheme.cyberCyan),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            val,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: isThreat ? CyberTheme.cyberCrimson : Colors.white,
              fontFamily: 'monospace',
            ),
          ),
        ],
      ),
    );
  }
}
