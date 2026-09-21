import 'package:flutter/material.dart';
import '../models/threat_model.dart';
import '../services/api_service.dart';
import '../widgets/threat_card.dart';
import '../theme/cyber_theme.dart';

class AlertsScreen extends StatefulWidget {
  const AlertsScreen({Key? key}) : super(key: key);

  @override
  State<AlertsScreen> createState() => _AlertsScreenState();
}

class _AlertsScreenState extends State<AlertsScreen> {
  final ApiService _apiService = ApiService();
  List<ThreatAlert> _alerts = [
    ThreatAlert(
      alertId: 'ALT-9042',
      threatType: 'Unknown CAN Message',
      riskLevel: 'HIGH',
      riskScore: 76.5,
      source: 'CAN Bus Bus 0 (OBD-II Port)',
      description: 'Unregistered arbitration ID 0x18DAF110 injected with anomalous payload.',
      status: 'Active',
      timestamp: 'Just now',
    ),
    ThreatAlert(
      alertId: 'ALT-9040',
      threatType: 'Abnormal Charging Behaviour',
      riskLevel: 'CRITICAL',
      riskScore: 91.2,
      source: 'Charging Station CS-1024',
      description: 'Sudden transient spike exceeding rated charging current profile (84.5A vs nominal 32A limit).',
      status: 'Blocked',
      timestamp: '1h ago',
    ),
  ];

  void _resolve(String id) {
    setState(() {
      for (var a in _alerts) {
        if (a.alertId == id) a.status = 'Resolved';
      }
    });
    _apiService.resolveAlert(id);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Alert $id Resolved'), backgroundColor: CyberTheme.cyberGreen),
    );
  }

  void _block(String id) {
    setState(() {
      for (var a in _alerts) {
        if (a.alertId == id) a.status = 'Blocked';
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Traffic Blocked for $id'), backgroundColor: CyberTheme.cyberCrimson),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('CYBERSECURITY ALERTS')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _alerts.length,
        itemBuilder: (context, index) {
          final alert = _alerts[index];
          return ThreatCardWidget(
            alert: alert,
            onInspect: () {},
            onResolve: () => _resolve(alert.alertId),
            onBlock: () => _block(alert.alertId),
          );
        },
      ),
    );
  }
}
