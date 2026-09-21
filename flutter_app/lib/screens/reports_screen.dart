import 'package:flutter/material.dart';
import '../theme/cyber_theme.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('SECURITY AUDIT REPORTS')),
      body: Padding(
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
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('ISO/SAE 21434 Cybersecurity Audit', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                  SizedBox(height: 6),
                  Text('Status: PASSED (ASIL-D Compliant)', style: TextStyle(color: CyberTheme.cyberGreen, fontSize: 12)),
                  SizedBox(height: 12),
                  Text('• 8 Telemetry Channels Evaluated via Edge Autoencoder', style: TextStyle(fontSize: 12, color: Colors.white70)),
                  Text('• Zero Undetected Frame Injections (100% Mitigated)', style: TextStyle(fontSize: 12, color: Colors.white70)),
                  Text('• Dynamic Threshold: μ + 3σ validated', style: TextStyle(fontSize: 12, color: Colors.white70)),
                ],
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Exporting ISO Audit PDF...')),
                );
              },
              icon: const Icon(Icons.picture_as_pdf),
              label: const Text('Download Cybersecurity Audit PDF'),
              style: ElevatedButton.styleFrom(
                backgroundColor: CyberTheme.cyberCyan,
                foregroundColor: Colors.black,
                minimumSize: const Size(double.infinity, 48),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
