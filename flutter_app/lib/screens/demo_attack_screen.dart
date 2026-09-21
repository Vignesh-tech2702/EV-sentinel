import 'package:flutter/material.dart';
import '../theme/cyber_theme.dart';
import '../services/api_service.dart';

class DemoAttackScreen extends StatefulWidget {
  const DemoAttackScreen({Key? key}) : super(key: key);

  @override
  State<DemoAttackScreen> createState() => _DemoAttackScreenState();
}

class _DemoAttackScreenState extends State<DemoAttackScreen> {
  final ApiService _apiService = ApiService();
  String _activeMessage = "Select an attack to simulate zero-day threat injection.";

  void _trigger(int id, String name) async {
    setState(() => _activeMessage = "Triggering $name...");
    final ok = await _apiService.triggerAttack(id);
    if (mounted) {
      setState(() {
        _activeMessage = ok
            ? "Injected: $name. Telemetry & AI Model updated."
            : "Triggered locally: $name.";
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Attack Triggered: $name"),
          backgroundColor: id == 1 ? CyberTheme.cyberGreen : CyberTheme.cyberCrimson,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('DEMO MODE: CYBER ATTACKS'),
        backgroundColor: Colors.black,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: CyberTheme.bgSecondary,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: CyberTheme.cyberAmber.withOpacity(0.4)),
              ),
              child: Text(
                _activeMessage,
                style: const TextStyle(fontSize: 12, color: CyberTheme.cyberAmber),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView(
                children: [
                  _attackButton(1, '1. Restore Normal Operation', 'Nominal telemetry, baseline calibration', isNormal: true),
                  _attackButton(2, '2. Unauthorized Access Attempt', 'Port scanning on telematics gateway'),
                  _attackButton(3, '3. Abnormal Charging Surge', '84.5A current spike on CS-1024'),
                  _attackButton(4, '4. Unknown CAN Message Injection', '0x18DAF110 arbitration flood'),
                  _attackButton(5, '5. Sudden Battery Temp Spike', 'Thermal runaway exploit (>62°C)'),
                  _attackButton(6, '6. Multiple Login Failures', 'Credential stuffing brute force'),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _attackButton(int id, String title, String desc, {bool isNormal = false}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(
            color: isNormal ? CyberTheme.cyberGreen.withOpacity(0.5) : CyberTheme.cyberCrimson.withOpacity(0.5),
          ),
        ),
        tileColor: CyberTheme.cardBg,
        title: Text(title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: isNormal ? CyberTheme.cyberGreen : Colors.white)),
        subtitle: Text(desc, style: const TextStyle(fontSize: 11, color: Colors.white60)),
        trailing: Icon(isNormal ? Icons.check_circle : Icons.warning, color: isNormal ? CyberTheme.cyberGreen : CyberTheme.cyberCrimson),
        onTap: () => _trigger(id, title),
      ),
    );
  }
}
