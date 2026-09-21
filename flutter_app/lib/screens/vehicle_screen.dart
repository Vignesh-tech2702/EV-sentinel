import 'package:flutter/material.dart';
import '../widgets/wireframe_car.dart';
import '../theme/cyber_theme.dart';

class VehicleScreen extends StatelessWidget {
  const VehicleScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('EV VEHICLE MONITORING')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const WireframeCarView(),
            const SizedBox(height: 16),
            const Text(
              'REAL-TIME SENSOR TELEMETRY',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: CyberTheme.cyberCyan),
            ),
            const SizedBox(height: 10),
            _infoRow('Vehicle Model', 'CyberSedan GT Dual-Motor'),
            _infoRow('Battery Voltage', '392.4 V (Nominal)'),
            _infoRow('Battery Temperature', '32.4 °C (Safe Range)'),
            _infoRow('Traction Inverter', 'Normal Operational'),
            _infoRow('CAN Gateway Protocol', 'ISO 11898 CAN 2.0B / FD'),
            _infoRow('Firmware State', 'ASIL-D Verified Hash'),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 14),
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: CyberTheme.cardBg,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.white70)),
          Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
        ],
      ),
    );
  }
}
