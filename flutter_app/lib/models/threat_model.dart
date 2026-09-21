class ThreatAlert {
  final String alertId;
  final String threatType;
  final String riskLevel;
  final double riskScore;
  final String source;
  final String description;
  String status;
  final String timestamp;

  ThreatAlert({
    required this.alertId,
    required this.threatType,
    required this.riskLevel,
    required this.riskScore,
    required this.source,
    required this.description,
    required this.status,
    required this.timestamp,
  });

  factory ThreatAlert.fromJson(Map<String, dynamic> json) {
    return ThreatAlert(
      alertId: json['alertId'] ?? '',
      threatType: json['threatType'] ?? '',
      riskLevel: json['riskLevel'] ?? 'LOW',
      riskScore: (json['riskScore'] ?? 0.0).toDouble(),
      source: json['source'] ?? '',
      description: json['description'] ?? '',
      status: json['status'] ?? 'Active',
      timestamp: json['timestamp'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'alertId': alertId,
    'threatType': threatType,
    'riskLevel': riskLevel,
    'riskScore': riskScore,
    'source': source,
    'description': description,
    'status': status,
    'timestamp': timestamp,
  };
}
