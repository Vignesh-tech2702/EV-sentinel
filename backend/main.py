"""
EV-Sentinel: Smart Cybersecurity for Connected Electric Vehicles
FastAPI Backend Server & Real-time AI Inference Service
"""

import time
import uuid
import math
import random
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
import os

from backend.ai_engine import ai_anomaly_engine
from backend.database import db

app = FastAPI(
    title="EV-Sentinel AI Cybersecurity API",
    description="Edge AI and Cloud Monitoring for Connected Electric Vehicles and Charging Infrastructure",
    version="2.0.0"
)

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Current Attack Simulation State
CURRENT_SIMULATION_ATTACK = "NORMAL"
ATTACK_TRIGGER_TIME = 0.0

# ----------------------------------------------------
# Request & Response Schemas
# ----------------------------------------------------
class RegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    password: str
    role: str

class LoginRequest(BaseModel):
    email: str
    password: str
    biometric: Optional[bool] = False

class ActionRequest(BaseModel):
    alertId: Optional[str] = None
    reason: Optional[str] = None

class TelemetryPayload(BaseModel):
    vehicle_speed: Optional[float] = None
    battery_voltage: Optional[float] = None
    battery_temp: Optional[float] = None
    motor_current: Optional[float] = None
    charging_voltage: Optional[float] = None
    charging_current: Optional[float] = None
    can_msg_frequency: Optional[float] = None
    esp32_vibration_g: Optional[float] = None

# ----------------------------------------------------
# 1. AUTHENTICATION ENDPOINTS
# ----------------------------------------------------
@app.post("/register")
def register_user(req: RegisterRequest):
    user_id = f"u{len(db.users) + 1}"
    new_user = {
        "userId": user_id,
        "name": req.name,
        "email": req.email,
        "phone": req.phone,
        "role": req.role,
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }
    db.users[user_id] = new_user
    db.security_logs.insert(0, {
        "logId": f"LOG-{random.randint(11000, 99999)}",
        "eventType": "User Registration",
        "description": f"New {req.role} account created for {req.name}",
        "status": "SUCCESS",
        "userId": user_id,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    })
    return {"status": "success", "message": "Registration successful", "user": new_user}

@app.post("/login")
def login_user(req: LoginRequest):
    # Simulated auth lookup
    matched_user = None
    for u in db.users.values():
        if u["email"].lower() == req.email.lower():
            matched_user = u
            break
            
    if not matched_user:
        # Default demo profile for seamless evaluation
        matched_user = db.users["u1"]
        
    db.security_logs.insert(0, {
        "logId": f"LOG-{random.randint(11000, 99999)}",
        "eventType": "Login History",
        "description": f"User authenticated via {'Biometric Face ID' if req.biometric else 'Password Credential'}",
        "status": "SUCCESS",
        "userId": matched_user["userId"],
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    })
    return {
        "status": "success",
        "token": f"jwt_sentinel_token_{uuid.uuid4().hex[:12]}",
        "user": matched_user
    }

@app.post("/logout")
def logout_user():
    return {"status": "success", "message": "Logged out securely"}

# ----------------------------------------------------
# 2. VEHICLE ENDPOINTS
# ----------------------------------------------------
@app.get("/vehicle/status")
def get_vehicle_status():
    global CURRENT_SIMULATION_ATTACK
    v = db.vehicles["EV-Sentinel Test Vehicle"]
    raw_telemetry = ai_anomaly_engine.generate_simulated_telemetry(CURRENT_SIMULATION_ATTACK)
    ai_result = ai_anomaly_engine.analyze_telemetry(raw_telemetry)
    
    # Update stored vehicle state
    v["speed"] = raw_telemetry["vehicle_speed"]
    v["voltage"] = raw_telemetry["battery_voltage"]
    v["temperature"] = raw_telemetry["battery_temp"]
    
    return {
        "status": "success",
        "vehicle": v,
        "telemetry": raw_telemetry,
        "ai_health": ai_result
    }

@app.get("/vehicle/data")
def get_vehicle_data():
    global CURRENT_SIMULATION_ATTACK
    raw = ai_anomaly_engine.generate_simulated_telemetry(CURRENT_SIMULATION_ATTACK)
    ai_res = ai_anomaly_engine.analyze_telemetry(raw)
    return {
        "speed": raw["vehicle_speed"],
        "battery_voltage": raw["battery_voltage"],
        "battery_temp": raw["battery_temp"],
        "motor_status": "Abnormal" if raw["motor_current"] > 140 else "Normal",
        "brake_status": "Normal",
        "charging_status": "Active",
        "connection_status": "Encrypted TLS 1.3",
        "ai_analysis": ai_res
    }

@app.post("/vehicle/connect")
def connect_vehicle():
    return {"status": "success", "message": "Vehicle connected via OBD-II & CAN Bus Gateway"}

# ----------------------------------------------------
# 3. CHARGING STATION ENDPOINTS
# ----------------------------------------------------
@app.get("/charging/status")
def get_charging_status():
    global CURRENT_SIMULATION_ATTACK
    station = db.charging_stations["CS-1024"]
    raw = ai_anomaly_engine.generate_simulated_telemetry(CURRENT_SIMULATION_ATTACK)
    
    station["voltage"] = raw["charging_voltage"]
    station["current"] = raw["charging_current"]
    station["powerConsumption"] = round((raw["charging_voltage"] * raw["charging_current"]) / 1000.0, 2)
    
    return {
        "status": "success",
        "station": station
    }

@app.get("/charging/data")
def get_charging_data():
    return get_charging_status()

@app.post("/charging/start")
def start_charging():
    db.charging_stations["CS-1024"]["sessionStatus"] = "Active"
    db.security_logs.insert(0, {
        "logId": f"LOG-{random.randint(11000, 99999)}",
        "eventType": "Charging Event",
        "description": "Charging session manually initiated on CS-1024",
        "status": "SUCCESS",
        "userId": "u1",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    })
    return {"status": "success", "sessionStatus": "Active"}

@app.post("/charging/stop")
def stop_charging():
    db.charging_stations["CS-1024"]["sessionStatus"] = "Stopped"
    db.security_logs.insert(0, {
        "logId": f"LOG-{random.randint(11000, 99999)}",
        "eventType": "Charging Event",
        "description": "Charging session terminated securely by operator/driver",
        "status": "HALTED",
        "userId": "u1",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    })
    return {"status": "success", "sessionStatus": "Stopped"}

# ----------------------------------------------------
# 4. SECURITY & THREAT ALERTS ENDPOINTS
# ----------------------------------------------------
@app.get("/alerts")
def get_alerts():
    return {
        "status": "success",
        "count": len(db.threat_alerts),
        "alerts": db.threat_alerts
    }

@app.post("/alerts/resolve")
def resolve_alert(req: ActionRequest):
    for a in db.threat_alerts:
        if a["alertId"] == req.alertId:
            a["status"] = "Resolved"
            break
    db.security_logs.insert(0, {
        "logId": f"LOG-{random.randint(11000, 99999)}",
        "eventType": "Incident Mitigation",
        "description": f"Security alert {req.alertId} marked as Resolved",
        "status": "RESOLVED",
        "userId": "u1",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    })
    return {"status": "success", "message": f"Alert {req.alertId} resolved"}

@app.post("/alerts/block")
def block_alert(req: ActionRequest):
    for a in db.threat_alerts:
        if a["alertId"] == req.alertId:
            a["status"] = "Blocked"
            break
    db.security_logs.insert(0, {
        "logId": f"LOG-{random.randint(11000, 99999)}",
        "eventType": "Firewall Mitigation",
        "description": f"Connection blocked for threat source {req.alertId}",
        "status": "BLOCKED",
        "userId": "u1",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    })
    return {"status": "success", "message": f"Connection blocked for {req.alertId}"}

@app.post("/alerts/isolate")
def isolate_alert(req: ActionRequest):
    for a in db.threat_alerts:
        if a["alertId"] == req.alertId:
            a["status"] = "Isolated"
            break
    db.security_logs.insert(0, {
        "logId": f"LOG-{random.randint(11000, 99999)}",
        "eventType": "Zero-Trust Isolation",
        "description": f"Subsystem quarantined and physically isolated for {req.alertId}",
        "status": "ISOLATED",
        "userId": "u1",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    })
    return {"status": "success", "message": f"Device subsystem isolated for {req.alertId}"}

@app.post("/alerts/report")
def report_alert(req: ActionRequest):
    db.security_logs.insert(0, {
        "logId": f"LOG-{random.randint(11000, 99999)}",
        "eventType": "SOC Escalation",
        "description": f"Incident report forwarded to SOC Administrator for {req.alertId}",
        "status": "ESCALATED",
        "userId": "u1",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    })
    return {"status": "success", "message": f"Report escalated to SOC for {req.alertId}"}

# ----------------------------------------------------
# 5. AI ENGINE & INFERENCE ENDPOINTS
# ----------------------------------------------------
@app.get("/ai/status")
def get_ai_status():
    global CURRENT_SIMULATION_ATTACK
    raw = ai_anomaly_engine.generate_simulated_telemetry(CURRENT_SIMULATION_ATTACK)
    analysis = ai_anomaly_engine.analyze_telemetry(raw)
    return {
        "modelStatus": "ACTIVE",
        "modelType": "Autoencoder-Based Anomaly Detection",
        "pipelineStages": [
            {"stage": 1, "name": "Normal Activity", "desc": "8-channel continuous sensor telemetry acquisition"},
            {"stage": 2, "name": "Data Preprocessing", "desc": "Zero-mean standardization & sliding buffer"},
            {"stage": 3, "name": "Latent Compression", "desc": "Bottleneck feature projection (8 -> 5 -> 3)"},
            {"stage": 4, "name": "Reconstruction Loss", "desc": "MSE computation vs dynamic mu+3sigma threshold"},
            {"stage": 5, "name": "Multi-Factor Risk Scoring", "desc": "Risk = 0.45*Sev + 0.25*Freq + 0.30*Impact"}
        ],
        "normalBaseline": "Calibrated (600 baseline cycles)",
        "anomalyDetectionStatus": "ANOMALY TRIGGERED" if analysis["is_anomaly"] else "NORMAL",
        "confidenceScore": analysis["confidence"],
        "analysis": analysis,
        "packetsAnalyzedToday": 142850 + random.randint(10, 99)
    }

@app.post("/ai/analyze")
def analyze_custom_telemetry(payload: TelemetryPayload):
    data_dict = {k: v for k, v in payload.dict().items() if v is not None}
    if not data_dict:
        data_dict = ai_anomaly_engine.generate_simulated_telemetry(CURRENT_SIMULATION_ATTACK)
    result = ai_anomaly_engine.analyze_telemetry(data_dict)
    return {"status": "success", "result": result}

@app.post("/ai/scan")
def run_ai_security_scan():
    global CURRENT_SIMULATION_ATTACK
    raw = ai_anomaly_engine.generate_simulated_telemetry(CURRENT_SIMULATION_ATTACK)
    res = ai_anomaly_engine.analyze_telemetry(raw)
    
    db.security_logs.insert(0, {
        "logId": f"LOG-{random.randint(11000, 99999)}",
        "eventType": "AI Scan Execution",
        "description": f"Manual AI Security Scan executed across 8 channels. Result: {res['risk_level']} Risk (Score: {res['risk_score']})",
        "status": "COMPLETED",
        "userId": "u1",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    })
    
    return {
        "status": "success",
        "scanCompleted": True,
        "summary": "AI Diagnostics completed. 1,024 packets inspected.",
        "result": res
    }

# ----------------------------------------------------
# 6. ANALYTICS & RISK SCORING ENDPOINTS
# ----------------------------------------------------
@app.get("/analytics/threats")
def get_analytics_threats():
    return {
        "threatsPerDay": [
            {"day": "Mon", "threats": 2},
            {"day": "Tue", "threats": 4},
            {"day": "Wed", "threats": 1},
            {"day": "Thu", "threats": 3},
            {"day": "Fri", "threats": 6},
            {"day": "Sat", "threats": 2},
            {"day": "Sun", "threats": 1}
        ],
        "chargingAnomalies": 4,
        "vehicleAnomalies": 7,
        "authFailures": 9
    }

@app.get("/analytics/risk-score")
def get_risk_score_analytics():
    global CURRENT_SIMULATION_ATTACK
    raw = ai_anomaly_engine.generate_simulated_telemetry(CURRENT_SIMULATION_ATTACK)
    analysis = ai_anomaly_engine.analyze_telemetry(raw)
    
    return {
        "overallSecurityHealth": analysis["security_score"],
        "currentRiskScore": analysis["risk_score"],
        "riskLevel": analysis["risk_level"],
        "formula": "Risk Score = 0.45 * Severity + 0.25 * AnomalyFrequency + 0.30 * SystemImpact",
        "tiers": {
            "Low": "0 - 30",
            "Medium": "31 - 60",
            "High": "61 - 85",
            "Critical": "86 - 100"
        },
        "riskDistribution": [
            {"category": "Low Risk", "percentage": 55, "color": "#00ff9d"},
            {"category": "Medium Risk", "percentage": 25, "color": "#ffb703"},
            {"category": "High Risk", "percentage": 15, "color": "#fb8500"},
            {"category": "Critical Risk", "percentage": 5, "color": "#ff0055"}
        ]
    }

# ----------------------------------------------------
# 7. SENSOR & COMMUNICATION ENDPOINTS
# ----------------------------------------------------
@app.get("/sensors/data")
def get_sensor_data():
    global CURRENT_SIMULATION_ATTACK
    raw = ai_anomaly_engine.generate_simulated_telemetry(CURRENT_SIMULATION_ATTACK)
    
    sensors = [
        {"sensorId": "S-HVDC-01", "name": "High-Voltage DC Probe", "vehicleId": "v101", "value": raw["battery_voltage"], "unit": "V", "status": "Active", "nominal": "360-420 V"},
        {"sensorId": "S-CURR-02", "name": "Hall Effect Current Shunt", "vehicleId": "v101", "value": raw["charging_current"], "unit": "A", "status": "Active", "nominal": "25-32 A"},
        {"sensorId": "S-THRM-03", "name": "Thermal Sensor Array", "vehicleId": "v101", "value": raw["battery_temp"], "unit": "°C", "status": "Active", "nominal": "25-45 °C"},
        {"sensorId": "S-IMU-04", "name": "6-DOF IMU & Vibration", "vehicleId": "v101", "value": raw["esp32_vibration_g"], "unit": "G", "status": "Active", "nominal": "< 0.35 G"},
        {"sensorId": "S-ESP-05", "name": "ESP32 Secure CAN Gateway", "vehicleId": "v101", "value": raw["can_msg_frequency"], "unit": "msg/s", "status": "Connected (mTLS)", "nominal": "200-350 msg/s"}
    ]
    return {"status": "success", "sensors": sensors}

@app.get("/communication/logs")
def get_communication_logs():
    return {"status": "success", "logs": db.communication_feed}

@app.get("/logs/security")
def get_security_logs():
    return {"status": "success", "logs": db.security_logs}

@app.get("/notifications")
def get_notifications():
    return {"status": "success", "notifications": db.notifications}

# ----------------------------------------------------
# 8. DEMO MODE ATTACK SIMULATION (Screen 19)
# ----------------------------------------------------
@app.post("/demo/attack/{attack_id}")
def trigger_demo_attack(attack_id: int):
    """
    Triggers 6 cyber attacks for live hackathon presentations:
    1: Normal Charging (Baseline Reset)
    2: Unauthorized Access (Port scan / Gateway probe)
    3: Abnormal Charging (84.5A Current Surge)
    4: Unknown CAN Message (0x18DA injection flood)
    5: High Temperature (Thermal Runaway exploit)
    6: Multiple Login Failures (Brute-force credential stuffing)
    """
    global CURRENT_SIMULATION_ATTACK, ATTACK_TRIGGER_TIME
    ATTACK_TRIGGER_TIME = time.time()
    
    attack_map = {
        1: ("NORMAL", "Normal Charging Restored", "LOW", 10.0, "Charging Station CS-1024"),
        2: ("UNAUTHORIZED_ACCESS", "Unauthorized Access Attempt", "HIGH", 78.0, "Wireless OBD-II Port"),
        3: ("ABNORMAL_CHARGING", "Abnormal Charging Behaviour (Overcurrent)", "CRITICAL", 94.5, "Charging Station CS-1024"),
        4: ("CAN_INJECTION", "Unknown CAN Message Injection (0x18DAF110)", "CRITICAL", 91.0, "Vehicle CAN Bus Bus 0"),
        5: ("HIGH_TEMP", "Sudden Battery Parameter Changes (Thermal Surge)", "CRITICAL", 89.2, "BMS Master Pack A"),
        6: ("LOGIN_BRUTEFORCE", "Multiple Failed Authentication Attempts", "HIGH", 72.0, "Central SOC Gateway")
    }
    
    attack_tuple = attack_map.get(attack_id, attack_map[1])
    CURRENT_SIMULATION_ATTACK = attack_tuple[0]
    
    if attack_id != 1:
        # Create corresponding alert
        new_alert = {
            "alertId": f"ALT-{random.randint(9050, 9999)}",
            "threatType": attack_tuple[1],
            "riskLevel": attack_tuple[2],
            "riskScore": attack_tuple[3],
            "source": attack_tuple[4],
            "description": f"AI Autoencoder detected severe MSE deviation. Attack simulation '{attack_tuple[1]}' triggered.",
            "status": "Active",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        db.threat_alerts.insert(0, new_alert)
        
        # Add security log
        db.security_logs.insert(0, {
            "logId": f"LOG-{random.randint(11000, 99999)}",
            "eventType": "Cyber Attack Injected",
            "description": f"Demo simulation attack triggered: {attack_tuple[1]}",
            "status": "FLAGGED",
            "userId": "DEMO_PRESENTER",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        })
        
        # Add push notification
        db.notifications.insert(0, {
            "id": f"n{len(db.notifications) + 1}",
            "title": f"Threat Alert: {attack_tuple[1]}",
            "message": f"Immediate mitigation advised for {attack_tuple[4]}.",
            "priority": attack_tuple[2],
            "read": False,
            "timestamp": "Just now"
        })
    else:
        # Resolve alerts
        for a in db.threat_alerts:
            if a["status"] == "Active":
                a["status"] = "Resolved"
                
    telemetry = ai_anomaly_engine.generate_simulated_telemetry(CURRENT_SIMULATION_ATTACK)
    ai_result = ai_anomaly_engine.analyze_telemetry(telemetry)
    
    return {
        "status": "success",
        "attack_id": attack_id,
        "attack_mode": CURRENT_SIMULATION_ATTACK,
        "description": attack_tuple[1],
        "telemetry": telemetry,
        "ai_result": ai_result
    }

@app.post("/demo/reset")
def reset_demo():
    return trigger_demo_attack(1)

# ----------------------------------------------------
# 9. ADMIN DASHBOARD & SOC CONTROLS
# ----------------------------------------------------
@app.get("/admin/soc-overview")
def get_admin_soc():
    return {
        "totalUsers": len(db.users) + 348,
        "connectedVehicles": 1284,
        "activeChargingStations": 412,
        "totalThreatsDetected": 182,
        "criticalThreats": 3,
        "blockedAttacks": 179,
        "globalFirewallActive": True,
        "socStatus": "GREEN_MONITORING"
    }

@app.post("/admin/remote-lockdown")
def remote_lockdown():
    db.security_logs.insert(0, {
        "logId": f"LOG-{random.randint(11000, 99999)}",
        "eventType": "SOC Emergency",
        "description": "SOC Remote Lockdown protocol triggered. Telematics throttled.",
        "status": "LOCKDOWN_ENGAGED",
        "userId": "ADMIN_SOC",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    })
    return {"status": "success", "message": "Fleet lockdown engaged. High-voltage isolation standby."}

@app.post("/admin/firewall-deploy")
def deploy_global_firewall():
    return {"status": "success", "message": "CAN ID Zero-Day Filter rules pushed to all 1,284 vehicles."}

# ----------------------------------------------------
# 10. REPORT GENERATION
# ----------------------------------------------------
@app.get("/report/data")
def get_report_data(period: str = "daily"):
    return {
        "reportId": f"REP-SENTINEL-2026-{random.randint(100, 999)}",
        "period": period.upper(),
        "generatedAt": time.strftime("%Y-%m-%d %H:%M:%S"),
        "auditor": "EV-Sentinel Edge AI Autonomous SOC",
        "vehicleName": "EV-Sentinel Test Vehicle (VIN: 1G1FX6S05N4189201)",
        "stationId": "Supercharge Hub CS-1024",
        "overallSecurityScore": "92%",
        "safetyIntegrityLevel": "ISO 26262 ASIL-D & ISO/SAE 21434 Compliant",
        "threatsDetected": 3,
        "blockedAttacks": 2,
        "activeThreats": 1,
        "aiConfidence": "96.4%",
        "channelSummaries": [
            {"channel": "Battery Voltage", "status": "Nominal", "peak": "402V", "deviation": "0.4%"},
            {"channel": "Charging Current", "status": "Mitigated Peak", "peak": "84.5A (Throttled)", "deviation": "Anomalous Spike"},
            {"channel": "CAN Bus Frequency", "status": "Monitored", "peak": "290 msg/s", "deviation": "Within Limits"},
            {"channel": "Battery Temperature", "status": "Cooling Active", "peak": "34.8°C", "deviation": "Nominal"}
        ]
    }

# Mount Web App static directory and subdirectories
web_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "web_app")
css_dir = os.path.join(web_dir, "css")
js_dir = os.path.join(web_dir, "js")
images_dir = os.path.join(web_dir, "images")

if os.path.exists(css_dir):
    app.mount("/css", StaticFiles(directory=css_dir), name="css")
if os.path.exists(js_dir):
    app.mount("/js", StaticFiles(directory=js_dir), name="js")
if os.path.exists(images_dir):
    app.mount("/images", StaticFiles(directory=images_dir), name="images")
if os.path.exists(web_dir):
    app.mount("/static", StaticFiles(directory=web_dir), name="static")

@app.get("/")
def serve_index():
    index_path = os.path.join(web_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "EV-Sentinel AI Backend running. Visit /docs for API documentation."}
