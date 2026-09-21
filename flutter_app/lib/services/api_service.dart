import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/telemetry_model.dart';
import '../models/threat_model.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:8000';

  Future<Map<String, dynamic>> fetchVehicleStatus() async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/vehicle/status'));
      if (res.statusCode == 200) {
        return json.decode(res.body);
      }
    } catch (_) {}
    return {};
  }

  Future<List<ThreatAlert>> fetchAlerts() async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/alerts'));
      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        final list = (data['alerts'] as List)
            .map((item) => ThreatAlert.fromJson(item))
            .toList();
        return list;
      }
    } catch (_) {}
    return [];
  }

  Future<bool> triggerAttack(int attackId) async {
    try {
      final res = await http.post(Uri.parse('$baseUrl/demo/attack/$attackId'));
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  Future<bool> resolveAlert(String alertId) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/alerts/resolve'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'alertId': alertId}),
      );
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}
