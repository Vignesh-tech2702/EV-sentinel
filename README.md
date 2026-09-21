# EV-Sentinel: Smart Cybersecurity for Connected Electric Vehicles

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![Flutter](https://img.shields.io/badge/Flutter-Ready-02569B.svg)](https://flutter.dev/)
[![Security](https://img.shields.io/badge/ISO%2FSAE-21434-critical.svg)](#)
[![ASIL-D](https://img.shields.io/badge/ISO-26262%20ASIL--D-green.svg)](#)

---

## 🛡️ Project Overview
**EV-Sentinel** is an intelligent, real-time cybersecurity monitoring and anomaly mitigation platform designed for connected electric vehicles (EVs) and charging infrastructure. By pairing an **Edge AI Autoencoder Neural Engine** with continuous telemetry ingestion (CAN Bus, OCPP 2.0.1, MQTT, ESP32 IoT sensors), EV-Sentinel defends against zero-day exploits, unauthorized bus injections, overcurrent surge attacks, and battery thermal manipulations in real time.

---

## 📐 Mathematical Formulation & AI Architecture

### 1. Autoencoder Anomaly Detection
The Edge Autoencoder compresses 8 continuous telemetry dimensions into a bottleneck latent space ($8 \to 5 \to 3 \to 5 \to 8$) and computes the **Mean Squared Reconstruction Loss**:

$$\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (x_i - \hat{x}_i)^2$$

Where:
- $n = 8$ telemetry channels: Vehicle Speed, Battery Voltage, Battery Temperature, Motor Current, Charging Voltage, Charging Current, CAN Message Frequency, and ESP32 IMU Vibration.
- $x_i$: Normalized sensor observation.
- $\hat{x}_i$: Neural decoded reconstruction.

### 2. Dynamic 3-Sigma Adaptive Thresholding
Rather than hardcoding rigid thresholds, the anomaly boundary dynamically adapts based on a running baseline sliding window:

$$\text{Threshold} = \mu + 3\sigma$$

Where $\mu$ is the baseline mean reconstruction loss and $\sigma$ is the standard deviation. An observation exceeding this threshold is flagged as an anomaly.

### 3. Multi-Factor Risk Score Calculation
When an anomaly occurs, the multi-factor risk scoring engine categorizes the threat:

$$\text{Risk Score} = 0.45 \times \text{Severity} + 0.25 \times \text{Anomaly Frequency} + 0.30 \times \text{System Impact}$$

- **Severity (45%)**: Proportional to the ratio of MSE loss to the dynamic threshold.
- **Anomaly Frequency (25%)**: Density of consecutive anomalous cycles in recent memory.
- **System Impact (30%)**: Criticality weighting of the compromised physical subsystem (e.g., Battery thermal runaway = 95, Inverter overcurrent = 90, Bus flood = 70).

**Risk Level Tiers:**
- **Low Risk (0–30)**: Green, nominal operation.
- **Medium Risk (31–60)**: Yellow, sensory drift or non-critical bus noise.
- **High Risk (61–85)**: Orange, unauthorized access or gateway scanning.
- **Critical Risk (86–100)**: Red, active overcurrent surge or CAN bus injection.

---

## 📱 All 18 Complete Screens + Demo Mode

| Screen # | Screen Name | Key Features |
|---|---|---|
| **Screen 1** | **Splash Screen** | Animated shield + EV icon, cyber matrix sync bar, automatic initialization. |
| **Screen 2** | **Onboarding Screen** | 3 swipeable pages explaining AI threat detection, charging protection, and live alerts. |
| **Screen 3** | **Login & Registration** | Role selector (*EV Owner, Station Operator, Administrator, Fleet Manager*), biometric Face ID / Fingerprint simulation. |
| **Screen 4** | **Main Dashboard** | Large circular SVG animated security score (92% Safe), live telemetry tiles, threat counters, quick action triggers. |
| **Screen 5** | **Real-Time Vehicle Monitoring** | Digital EV wireframe blueprint with interactive sensor hotspots (BMS, Inverter, CCS2 Port), live speed/voltage/temp charts. |
| **Screen 6** | **Charging Station Monitoring** | Station CS-1024, animated energy flow beam, 12.8 kW power charts, Start/Stop session triggers. |
| **Screen 7** | **AI Threat Detection Engine** | 5-stage inference pipeline, confidence meter (96.4%), "Run AI Security Scan" button with neural animations. |
| **Screen 8** | **Security Alerts** | Filterable feed (*Critical, High, Medium, Low*) with mitigation triggers (*Resolve, Block, Isolate, Report*). |
| **Screen 9** | **Threat Details Page** | Deep Packet Inspection (raw hex preview), risk score breakdown, visual threat timeline, zero-trust isolation. |
| **Screen 10** | **Risk Analysis Dashboard** | Threats per day bar chart, risk distribution doughnut, charging anomalies counter, mathematical formula display card. |
| **Screen 11** | **Communication Monitoring** | Live streaming feed of CAN frames (`0x18DA...`), OCPP 2.0.1 messages, and MQTT packets with protocol filter chips. |
| **Screen 12** | **Sensor Data Monitoring** | High-voltage DC probe, current sensor, thermal sensor, 6-DOF IMU, and ESP32 gateway mTLS status with animated gauges. |
| **Screen 13** | **Security Logs** | Searchable zero-trust audit trail with timestamps, categories, and incident logs. |
| **Screen 14** | **Notification Center** | Real-time push alert cards with priority badges, mark read, and clear all. |
| **Screen 15** | **User Profile** | User credentials, role badge, connected vehicles list, connected hubs, quick role switcher. |
| **Screen 16** | **Settings** | 2FA toggle, biometric unlock, automatic isolation policy, AI sensitivity slider. |
| **Screen 17** | **Admin Dashboard** | Multi-tenant SOC view with enterprise fleet statistics (1,284 vehicles, 412 hubs), Remote lockdown, Global firewall deploy. |
| **Screen 18** | **Report Generation** | Formatted Daily/Weekly/Monthly cybersecurity audits with PDF print and CSV export. |
| **Screen 19 / Floating Panel** | **Dedicated Demo Mode** | Specially designed for hackathons and presentations: 1-click trigger for 6 cyber attacks, real-time audio sirens, risk score recalculation, and mitigation workflows. |

---

## 🚀 Quick Start Guide

### 1. Run the Complete System (FastAPI Backend + Web App Prototype)
Open your terminal in the project directory:

```bash
python run_system.py
```

- **Interactive Mobile Simulator**: Open your browser at [http://localhost:8000](http://localhost:8000)
- **FastAPI Interactive Docs**: Open [http://localhost:8000/docs](http://localhost:8000/docs)

*Note: You can toggle between **Phone Frame View** and **Full Desktop View** using the button in the top toolbar!*

### 2. Run the Flutter Codebase (Optional)
If you have Flutter installed:

```bash
cd flutter_app
flutter pub get
flutter run
```

---

## 🎤 Hackathon & College Demonstration Guide

1. **Start on Screen 4 (Dashboard)**: Show the circular security score gauge (92% Safe) and live telemetry.
2. **Open Screen 19 (Demo Mode)**: Click the top-right `⚡ DEMO MODE` pill.
3. **Trigger Attack 3 (Abnormal Charging Surge)**:
   - Hear the synthesized cybersecurity siren.
   - Watch the security score drop to 32% (Critical).
   - Point out the dominant channel (`charging_current: 84.5A`).
4. **Demonstrate Mitigation**:
   - Jump to **Screen 8 (Security Alerts)** or **Screen 9 (Threat Deep Dive)**.
   - Click **Isolate Device** or **Block Connection**.
   - Note the real-time event appended to the **Screen 13 (Zero-Trust Security Logs)**.
5. **Generate the Audit**:
   - Go to **Screen 18 (Reports)** and click **Export CSV** or **Print PDF** to show enterprise compliance with ISO/SAE 21434.
