import 'package:flutter/material.dart';
import '../theme/cyber_theme.dart';

class ChargingScreen extends StatelessWidget {
  const ChargingScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('CHARGING STATION CS-1024')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: CyberTheme.cardBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: CyberTheme.cyberCyan.withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Station ID: CS-1024', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      Text('OCPP 2.0.1', style: TextStyle(fontSize: 11, color: CyberTheme.cyberCyan)),
                    ],
                  ),
                  const SizedBox(height: 14),
                  const LinearProgressIndicator(
                    value: 0.78,
                    backgroundColor: Colors.white10,
                    color: CyberTheme.cyberGreen,
                    minHeight: 8,
                  ),
                  const SizedBox(height: 16),
                  _rowItem('Charging Voltage', '400.0 V'),
                  _rowItem('Charging Current', '31.8 A'),
                  _rowItem('Power Consumption', '12.8 kW'),
                  _rowItem('Session Status', 'Secure Active'),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: CyberTheme.cyberCyan,
                      foregroundColor: Colors.black,
                      minimumSize: const Size(double.infinity, 48),
                    ),
                    child: const Text('Start Monitoring'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: CyberTheme.cyberCrimson,
                      minimumSize: const Size(double.infinity, 48),
                    ),
                    child: const Text('Stop Session'),
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget _rowItem(String label, String val) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.white70)),
          Text(val, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
        ],
      ),
    );
  }
}
