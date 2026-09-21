class VehicleTelemetry {
  final double speed;
  final double batteryVoltage;
  final double batteryTemp;
  final double motorCurrent;
  final double chargingVoltage;
  final double chargingCurrent;
  final double canMsgFrequency;
  final double esp32Vibration;
  final int batteryLevel;

  VehicleTelemetry({
    required this.speed,
    required this.batteryVoltage,
    required this.batteryTemp,
    required this.motorCurrent,
    required this.chargingVoltage,
    required this.chargingCurrent,
    required this.canMsgFrequency,
    required this.esp32Vibration,
    this.batteryLevel = 78,
  });

  factory VehicleTelemetry.fromJson(Map<String, dynamic> json) {
    return VehicleTelemetry(
      speed: (json['vehicle_speed'] ?? 45.0).toDouble(),
      batteryVoltage: (json['battery_voltage'] ?? 392.4).toDouble(),
      batteryTemp: (json['battery_temp'] ?? 32.4).toDouble(),
      motorCurrent: (json['motor_current'] ?? 41.2).toDouble(),
      chargingVoltage: (json['charging_voltage'] ?? 400.0).toDouble(),
      chargingCurrent: (json['charging_current'] ?? 31.8).toDouble(),
      canMsgFrequency: (json['can_msg_frequency'] ?? 260.0).toDouble(),
      esp32Vibration: (json['esp32_vibration_g'] ?? 0.18).toDouble(),
      batteryLevel: json['battery_level'] ?? 78,
    );
  }

  Map<String, dynamic> toJson() => {
    'vehicle_speed': speed,
    'battery_voltage': batteryVoltage,
    'battery_temp': batteryTemp,
    'motor_current': motorCurrent,
    'charging_voltage': chargingVoltage,
    'charging_current': chargingCurrent,
    'can_msg_frequency': canMsgFrequency,
    'esp32_vibration_g': esp32Vibration,
    'battery_level': batteryLevel,
  };
}

class AiAnalysisResult {
  final bool isAnomaly;
  final double mse;
  final double threshold;
  final double riskScore;
  final String riskLevel;
  final int securityScore;
  final double confidence;
  final String dominantChannel;

  AiAnalysisResult({
    required this.isAnomaly,
    required this.mse,
    required this.threshold,
    required this.riskScore,
    required this.riskLevel,
    required this.securityScore,
    required this.confidence,
    required this.dominantChannel,
  });

  factory AiAnalysisResult.fromJson(Map<String, dynamic> json) {
    return AiAnalysisResult(
      isAnomaly: json['is_anomaly'] ?? false,
      mse: (json['mse'] ?? 0.124).toDouble(),
      threshold: (json['threshold'] ?? 0.286).toDouble(),
      riskScore: (json['risk_score'] ?? 8.5).toDouble(),
      riskLevel: json['risk_level'] ?? 'LOW',
      securityScore: json['security_score'] ?? 92,
      confidence: (json['confidence'] ?? 96.4).toDouble(),
      dominantChannel: json['dominant_channel'] ?? 'esp32_vibration_g',
    );
  }
}
