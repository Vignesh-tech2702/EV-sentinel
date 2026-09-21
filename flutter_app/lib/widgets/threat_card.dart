import 'package:flutter/material.dart';
import '../models/threat_model.dart';
import '../theme/cyber_theme.dart';

class ThreatCardWidget extends StatelessWidget {
  final ThreatAlert alert;
  final VoidCallback onInspect;
  final VoidCallback onResolve;
  final VoidCallback onBlock;

  const ThreatCardWidget({
    Key? key,
    required this.alert,
    required this.onInspect,
    required this.onResolve,
    required this.onBlock,
  }) : super(key: key);

  Color get riskColor {
    switch (alert.riskLevel.toUpperCase()) {
      case 'CRITICAL':
        return CyberTheme.cyberCrimson;
      case 'HIGH':
        return CyberTheme.cyberAmber;
      default:
        return CyberTheme.cyberGreen;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: CyberTheme.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border(
          left: BorderSide(color: riskColor, width: 4),
          top: BorderSide(color: Colors.white.withOpacity(0.08)),
          right: BorderSide(color: Colors.white.withOpacity(0.08)),
          bottom: BorderSide(color: Colors.white.withOpacity(0.08)),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                alert.alertId,
                style: const TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 12,
                  color: CyberTheme.cyberCyan,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: riskColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: riskColor.withOpacity(0.5)),
                ),
                child: Text(
                  alert.riskLevel,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: riskColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            alert.threatType,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            alert.description,
            style: const TextStyle(fontSize: 12, color: Color(0xFF8B9BB4)),
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Source: ${alert.source}',
                style: const TextStyle(fontSize: 11, color: Color(0xFF4A5D78)),
              ),
              Text(
                'Status: ${alert.status}',
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: Colors.white70,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: onInspect,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: CyberTheme.cyberCyan,
                    side: const BorderSide(color: CyberTheme.cyberCyan),
                  ),
                  child: const Text('Inspect', style: TextStyle(fontSize: 11)),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  onPressed: onResolve,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: CyberTheme.cyberGreen,
                    foregroundColor: Colors.black,
                  ),
                  child: const Text('Resolve', style: TextStyle(fontSize: 11)),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  onPressed: onBlock,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: CyberTheme.cyberCrimson,
                  ),
                  child: const Text('Block', style: TextStyle(fontSize: 11)),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}
