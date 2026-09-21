"""
EV-Sentinel: In-Memory Database and Data Models
-----------------------------------------------
Implements the 7 core collections requested:
1. Users
2. Vehicles
3. ChargingStations
4. SensorData
5. ThreatAlerts
6. SecurityLogs
7. AIAnalysis
Plus real-time streaming buffers for CAN, OCPP 2.0.1, and MQTT frames.
"""

import time
import uuid
from typing import Dict, List, Any, Optional

class Database:
    def __init__(self):
        self.users: Dict[str, Dict[str, Any]] = {
            "u1": {
                "userId": "u1",
                "name": "Alex Mercer",
                "email": "alex.mercer@ev-sentinel.io",
                "phone": "+1 (555) 438-9120",
                "role": "EV Owner",
                "createdAt": "2026-01-15T08:30:00Z"
            },
            "u2": {
                "userId": "u2",
                "name": "Sarah Connor",
                "email": "sarah.c@gridpower.com",
                "phone": "+1 (555) 892-3341",
                "role": "Station Operator",
                "createdAt": "2026-02-10T11:20:00Z"
            },
            "u3": {
                "userId": "u3",
                "name": "Dr. Viktor Vance",
                "email": "viktor.v@cybersec.soc",
                "phone": "+1 (555) 019-2834",
                "role": "Administrator",
                "createdAt": "2025-11-04T09:12:00Z"
            },
            "u4": {
                "userId": "u4",
                "name": "Marcus Kane",
                "email": "marcus.k@voltlogistics.com",
                "phone": "+1 (555) 773-4920",
                "role": "Fleet Manager",
                "createdAt": "2026-03-01T14:45:00Z"
            }
        }
        
        self.vehicles: Dict[str, Dict[str, Any]] = {
            "EV-Sentinel Test Vehicle": {
                "vehicleId": "v101",
                "ownerId": "u1",
                "vehicleName": "EV-Sentinel Test Vehicle",
                "vin": "1G1FX6S05N4189201",
                "model": "CyberSedan GT Dual-Motor",
                "batteryLevel": 78,
                "voltage": 392.4,
                "temperature": 32.4,
                "speed": 45.0,
                "motorStatus": "Normal",
                "brakeStatus": "Normal",
                "chargingStatus": "Connected",
                "connectionStatus": "Encrypted TLS 1.3"
            }
        }
        
        self.charging_stations: Dict[str, Dict[str, Any]] = {
            "CS-1024": {
                "stationId": "CS-1024",
                "stationName": "Supercharge Hub Alpha - Bay 4",
                "location": "Metro Transit Center, Sector 7",
                "voltage": 400.0,
                "current": 32.0,
                "powerConsumption": 12.8,
                "durationMinutes": 45,
                "sessionStatus": "Active",
                "connectionStatus": "Secure",
                "ocppVersion": "OCPP 2.0.1",
                "maxPowerKw": 150.0
            }
        }
        
        self.sensor_data: List[Dict[str, Any]] = [
            {"sensorId": "S-HVDC-01", "name": "High-Voltage DC Probe", "vehicleId": "v101", "voltage": 392.4, "current": 32.0, "temperature": 32.4, "status": "Active", "unit": "V", "timestamp": time.time()},
            {"sensorId": "S-CURR-02", "name": "Hall Effect Current Shunt", "vehicleId": "v101", "voltage": 400.0, "current": 31.8, "temperature": 33.1, "status": "Active", "unit": "A", "timestamp": time.time()},
            {"sensorId": "S-THRM-03", "name": "Battery Pack Thermal Array (16-pt)", "vehicleId": "v101", "voltage": 0.0, "current": 0.0, "temperature": 32.2, "status": "Active", "unit": "°C", "timestamp": time.time()},
            {"sensorId": "S-IMU-04", "name": "6-DOF IMU & Chassis Accelerometer", "vehicleId": "v101", "voltage": 3.3, "current": 0.05, "temperature": 28.5, "status": "Active", "unit": "G", "timestamp": time.time()},
            {"sensorId": "S-ESP-05", "name": "ESP32 Secure CAN-IoT Gateway", "vehicleId": "v101", "voltage": 5.0, "current": 0.35, "temperature": 38.0, "status": "Online (WiFi+CAN)", "unit": "pkt/s", "timestamp": time.time()}
        ]
        
        self.threat_alerts: List[Dict[str, Any]] = [
            {
                "alertId": "ALT-9042",
                "threatType": "Unknown CAN Message",
                "riskLevel": "HIGH",
                "riskScore": 76.5,
                "source": "CAN Bus Bus 0 (OBD-II Port)",
                "description": "Unregistered arbitration ID 0x18DAF110 injected with anomalous payload pattern matching UDS backdoor exploit.",
                "status": "Active",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time() - 340))
            },
            {
                "alertId": "ALT-9041",
                "threatType": "Multiple Failed Authentication Attempts",
                "riskLevel": "MEDIUM",
                "riskScore": 54.0,
                "source": "Vehicle Telematics Gateway",
                "description": "5 consecutive failed cryptographic handshakes detected from IP 198.51.100.42 within 15 seconds.",
                "status": "Resolved",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time() - 1450))
            },
            {
                "alertId": "ALT-9040",
                "threatType": "Abnormal Charging Behaviour",
                "riskLevel": "CRITICAL",
                "riskScore": 91.2,
                "source": "Charging Station CS-1024",
                "description": "Sudden transient spike exceeding rated charging current profile (84.5A vs nominal 32A limit).",
                "status": "Blocked",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time() - 3600))
            },
            {
                "alertId": "ALT-9039",
                "threatType": "Sudden Battery Parameter Changes",
                "riskLevel": "LOW",
                "riskScore": 22.0,
                "source": "BMS Slave Node 3",
                "description": "Minor cell voltage drift detected during rapid regenerative braking event.",
                "status": "Resolved",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time() - 86400))
            }
        ]
        
        self.security_logs: List[Dict[str, Any]] = [
            {"logId": "LOG-10892", "eventType": "Threat Detection", "description": "Autoencoder detected latent space reconstruction loss anomaly (MSE=0.482)", "status": "FLAGGED", "userId": "u1", "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time() - 120))},
            {"logId": "LOG-10891", "eventType": "Device Connection", "description": "ESP32 Gateway established mutual mTLS handshake with Cloud Broker", "status": "SUCCESS", "userId": "u1", "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time() - 360))},
            {"logId": "LOG-10890", "eventType": "Blocked Connection", "description": "Automated firewall blocked unauthorized CAN frame 0x7DF broadcast", "status": "BLOCKED", "userId": "u3", "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time() - 1200))},
            {"logId": "LOG-10889", "eventType": "Charging Event", "description": "Session CS-1024 initiated: 400V / 32A nominal power flow negotiation", "status": "AUTHORIZED", "userId": "u1", "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time() - 2700))},
            {"logId": "LOG-10888", "eventType": "AI Analysis", "description": "Scheduled 5-stage inference pass completed across 8 telemetry channels", "status": "COMPLETED", "userId": "SYSTEM", "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time() - 3600))},
            {"logId": "LOG-10887", "eventType": "Login History", "description": "Biometric Face ID authentication verified for user Alex Mercer", "status": "SUCCESS", "userId": "u1", "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time() - 7200))}
        ]
        
        self.notifications: List[Dict[str, Any]] = [
            {"id": "n1", "title": "Critical Anomaly Blocked", "message": "High-risk cyber threat detected in Charging Station #EV102.", "priority": "CRITICAL", "read": False, "timestamp": "2m ago"},
            {"id": "n2", "title": "Intrusion Prevented", "message": "Unauthorized access attempt blocked by zero-trust gateway.", "priority": "HIGH", "read": False, "timestamp": "14m ago"},
            {"id": "n3", "title": "BMS Warning Resolved", "message": "Battery temperature anomaly mitigated via cooling flow boost.", "priority": "MEDIUM", "read": True, "timestamp": "1h ago"},
            {"id": "n4", "title": "AI Diagnostics Passed", "message": "AI security scan completed successfully across 1,024 packets.", "priority": "LOW", "read": True, "timestamp": "3h ago"}
        ]
        
        self.communication_feed: List[Dict[str, Any]] = [
            {"id": 1, "protocol": "CAN", "identifier": "0x18DAF110", "data": "03 22 F1 90 AA BB CC DD", "status": "Suspicious", "time": "10:45:25"},
            {"id": 2, "protocol": "CAN", "identifier": "0x0C04A102", "data": "F4 01 28 00 00 00 00 00", "status": "Normal", "time": "10:45:24"},
            {"id": 3, "protocol": "OCPP", "identifier": "MeterValuesRequest", "data": '{"connectorId":1,"power":12.8,"voltage":400}', "status": "Normal", "time": "10:45:22"},
            {"id": 4, "protocol": "MQTT", "identifier": "v101/telemetry/bms", "data": '{"soc":78,"temp":32.4,"pack_v":392}', "status": "Normal", "time": "10:45:20"},
            {"id": 5, "protocol": "CAN", "identifier": "0x7DF", "data": "02 01 0D 00 00 00 00 00", "status": "Suspicious", "time": "10:45:18"},
            {"id": 6, "protocol": "AUTH", "identifier": "mTLS / SessionHandshake", "data": "SHA-256 Sig Verified / cert valid", "status": "Verified", "time": "10:45:15"},
            {"id": 7, "protocol": "CAN", "identifier": "0x00000000", "data": "FF FF FF FF FF FF FF FF", "status": "Blocked", "time": "10:45:10"}
        ]

db = Database()
