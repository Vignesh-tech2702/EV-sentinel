/**
 * EV-Sentinel: Core Application Logic & 18-Screen Controller
 * Handles real-time telemetry updates, Edge AI Autoencoder inference,
 * CAN/OCPP stream generation, Demo attack triggers, and Report export.
 */

class EVSentinelApp {
  constructor() {
    this.currentScreen = 'screen-dashboard';
    this.activeAttack = 'NORMAL';
    this.user = {
      userId: 'u1',
      name: 'Alex Mercer',
      email: 'alex.mercer@ev-sentinel.io',
      role: 'EV Owner',
      token: 'jwt_sentinel_token_demo'
    };

    this.telemetry = {
      vehicle_speed: 45.0,
      battery_voltage: 392.4,
      battery_temp: 32.4,
      motor_current: 41.2,
      charging_voltage: 400.0,
      charging_current: 31.8,
      can_msg_frequency: 264.0,
      esp32_vibration_g: 0.18,
      batteryLevel: 78
    };

    this.selectedModelKey = 'tesla';
    this.evViewMode = 'cad';

    this.aiAnalysis = {
      is_anomaly: false,
      mse: 0.124,
      threshold: 0.286,
      risk_score: 8.5,
      risk_level: 'LOW',
      security_score: 92,
      confidence: 96.4,
      dominant_channel: 'esp32_vibration_g'
    };

    this.threatAlerts = [
      {
        alertId: "ALT-9042",
        threatType: "Unknown CAN Message",
        riskLevel: "HIGH",
        riskScore: 76.5,
        source: "CAN Bus Bus 0 (OBD-II Port)",
        description: "Unregistered arbitration ID 0x18DAF110 injected with anomalous payload pattern matching UDS backdoor exploit.",
        status: "Active",
        timestamp: "Just now"
      },
      {
        alertId: "ALT-9041",
        threatType: "Multiple Failed Authentication Attempts",
        riskLevel: "MEDIUM",
        riskScore: 54.0,
        source: "Vehicle Telematics Gateway",
        description: "5 consecutive failed cryptographic handshakes detected from IP 198.51.100.42 within 15 seconds.",
        status: "Resolved",
        timestamp: "12m ago"
      },
      {
        alertId: "ALT-9040",
        threatType: "Abnormal Charging Behaviour",
        riskLevel: "CRITICAL",
        riskScore: 91.2,
        source: "Charging Station CS-1024",
        description: "Sudden transient spike exceeding rated charging current profile (84.5A vs nominal 32A limit).",
        status: "Blocked",
        timestamp: "1h ago"
      }
    ];

    this.selectedAlert = this.threatAlerts[0];

    this.securityLogs = [
      { logId: "LOG-10892", eventType: "Threat Detection", description: "Autoencoder detected latent reconstruction loss anomaly (MSE=0.482)", status: "FLAGGED", timestamp: "10:45:25" },
      { logId: "LOG-10891", eventType: "Device Connection", description: "ESP32 Gateway established mutual mTLS handshake with Cloud Broker", status: "SUCCESS", timestamp: "10:44:10" },
      { logId: "LOG-10890", eventType: "Blocked Connection", description: "Automated firewall dropped unauthorized CAN frame 0x7DF broadcast", status: "BLOCKED", timestamp: "10:42:00" },
      { logId: "LOG-10889", eventType: "Charging Event", description: "Session CS-1024 initiated: 400V / 32A nominal power flow negotiated", status: "AUTHORIZED", timestamp: "10:30:15" },
      { logId: "LOG-10888", eventType: "AI Analysis", description: "Scheduled 5-stage inference pass completed across 8 telemetry channels", status: "COMPLETED", timestamp: "10:15:00" },
      { logId: "LOG-10887", eventType: "Login History", description: "Biometric Face ID authentication verified for user Alex Mercer", status: "SUCCESS", timestamp: "09:50:22" }
    ];

    this.notifications = [
      { id: "n1", title: "Critical Anomaly Blocked", message: "High-risk cyber threat detected in Charging Station #EV102.", priority: "CRITICAL", read: false, time: "2m ago" },
      { id: "n2", title: "Intrusion Prevented", message: "Unauthorized access attempt blocked by zero-trust gateway.", priority: "HIGH", read: false, time: "14m ago" },
      { id: "n3", title: "BMS Warning Resolved", message: "Battery temperature anomaly mitigated via cooling flow boost.", priority: "MEDIUM", read: true, time: "1h ago" },
      { id: "n4", title: "AI Diagnostics Passed", message: "AI security scan completed successfully across 1,024 packets.", priority: "LOW", read: true, time: "3h ago" }
    ];

    this.canLogBuffer = [];
    this.speedHistory = [40, 42, 45, 43, 46, 45, 47, 45];
    this.voltHistory = [390, 391, 392, 392, 393, 392, 391, 392];
    this.tempHistory = [31, 31.5, 32, 32.2, 32.4, 32.3, 32.4, 32.5];

    this.init();
  }

  init() {
    this.bindEvents();
    this.startSimulationStream();
    this.initCanStream();

    if (window.initCyber3D) window.initCyber3D();

    this.renderScreen('screen-dashboard');
    if (window.initTeslaLab) {
      setTimeout(() => {
        window.initTeslaLab();
        if (window.tesla3DLab) window.tesla3DLab.onResize();
      }, 100);
    }
  }

  bindEvents() {
    // Nav item clicks
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = btn.getAttribute('data-target');
        if (target) {
          if (window.cyberAudio) window.cyberAudio.playClick();
          this.navigateTo(target);
        }
      });
    });

    // Quick screen jumper selector
    const jumper = document.getElementById('screen-jumper');
    if (jumper) {
      jumper.addEventListener('change', (e) => {
        if (window.cyberAudio) window.cyberAudio.playClick();
        this.navigateTo(e.target.value);
      });
    }

    // Demo Mode toggle
    const demoBtn = document.getElementById('btn-open-demo');
    const demoModal = document.getElementById('demo-modal');
    const closeDemoBtn = document.getElementById('btn-close-demo');

    if (demoBtn && demoModal) {
      demoBtn.addEventListener('click', () => {
        if (window.cyberAudio) window.cyberAudio.playClick();
        demoModal.classList.add('open');
      });
    }
    if (closeDemoBtn && demoModal) {
      closeDemoBtn.addEventListener('click', () => {
        if (window.cyberAudio) window.cyberAudio.playClick();
        demoModal.classList.remove('open');
      });
    }

    // Audio mute toggle
    const muteBtn = document.getElementById('btn-toggle-mute');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = window.cyberAudio.toggleMute();
        muteBtn.innerHTML = isMuted ? '🔇' : '🔊';
      });
    }

    // Viewport Toggle (Responsive Desktop vs Phone Simulation)
    const toggleViewBtn = document.getElementById('btn-toggle-viewport');
    const deviceWrapper = document.getElementById('device-wrapper');
    if (toggleViewBtn && deviceWrapper) {
      toggleViewBtn.addEventListener('click', () => {
        deviceWrapper.classList.toggle('phone-viewport');
        const isPhone = deviceWrapper.classList.contains('phone-viewport');
        toggleViewBtn.textContent = isPhone ? '🖥️ Desktop View' : '📱 Phone View';
        if (window.cyberAudio) window.cyberAudio.playClick();
        if (window.tesla3DLab) setTimeout(() => window.tesla3DLab.onResize(), 360);
      });
    }
  }

  showIntroModal() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    const modal = document.getElementById('intro-modal');
    if (modal) modal.classList.add('open');
  }

  closeIntroModal() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    const modal = document.getElementById('intro-modal');
    if (modal) modal.classList.remove('open');
  }

  navigateTo(screenId) {
    const screens = document.querySelectorAll('.app-screen');
    screens.forEach(s => s.classList.remove('active'));

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;

      // Update quick jumper select
      const jumper = document.getElementById('screen-jumper');
      if (jumper) jumper.value = screenId;

      // Sync active state on bottom navigation
      document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-target') === screenId);
      });

      // Scroll to top
      const viewport = document.getElementById('screens-viewport');
      if (viewport) viewport.scrollTop = 0;

      this.renderScreen(screenId);
      if (window.initCyber3D) setTimeout(window.initCyber3D, 50);
      if (window.initTeslaLab && (screenId === 'screen-vehicle' || screenId === 'screen-dashboard')) {
        setTimeout(() => {
          window.initTeslaLab();
          if (window.tesla3DLab) window.tesla3DLab.onResize();
        }, 60);
      }
    }
  }

  renderScreen(screenId) {
    if (screenId === 'screen-dashboard') this.updateDashboard();
    if (screenId === 'screen-vehicle') this.updateVehicleScreen();
    if (screenId === 'screen-charging') this.updateChargingScreen();
    if (screenId === 'screen-ai-engine') this.updateAiScreen();
    if (screenId === 'screen-alerts') this.renderAlerts();
    if (screenId === 'screen-threat-details') this.renderThreatDetails();
    if (screenId === 'screen-risk-analysis') this.renderRiskAnalysis();
    if (screenId === 'screen-sensors') this.renderSensorScreen();
    if (screenId === 'screen-communication') this.renderCommunicationScreen();
    if (screenId === 'screen-logs') this.renderLogsScreen();
    if (screenId === 'screen-notifications') this.renderNotifications();
    if (screenId === 'screen-profile') this.renderProfileScreen();
    if (screenId === 'screen-settings') this.renderSettingsScreen();
    if (screenId === 'screen-admin') this.renderAdminScreen();
    if (screenId === 'screen-reports') this.renderReportsScreen();
  }

  // --- Real-World EV 3D Model Switcher ---
  switchVehicleModel(modelKey) {
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.selectedModelKey = modelKey;

    // Update 3D Wireframe CAD models
    if (window.dashEv3D) window.dashEv3D.setModel(modelKey);
    if (window.evVehicle3D) window.evVehicle3D.setModel(modelKey);

    // Update interactive component pins on photorealistic stages
    this.renderPhotoPins('dash-pins-container', modelKey);
    this.renderPhotoPins('veh-pins-container', modelKey);

    // Update active state on all model tabs across screens
    document.querySelectorAll('.ev-model-tab').forEach(tab => {
      const isMatch = tab.getAttribute('data-model') === modelKey;
      tab.classList.toggle('active', isMatch);
    });

    // Update dynamic HUD labels
    const modelData = window.evVehicle3D?.modelMeta || window.dashEv3D?.modelMeta;
    if (modelData) {
      const dashHud = document.getElementById('dash-ev-model-hud');
      const vehHud = document.getElementById('ev-model-name-hud');
      if (dashHud) dashHud.textContent = modelData.name.toUpperCase();
      if (vehHud) vehHud.textContent = modelData.name.toUpperCase();

      const specArch = document.getElementById('ev-spec-arch');
      const specBatt = document.getElementById('ev-spec-batt');
      const specMotor = document.getElementById('ev-spec-motor');
      const specAccel = document.getElementById('ev-spec-accel');
      if (specArch) specArch.textContent = modelData.architecture;
      if (specBatt) specBatt.textContent = modelData.battery;
      if (specMotor) specMotor.textContent = modelData.motors;
      if (specAccel) specAccel.textContent = modelData.accel;
    }
  }

  setEvViewMode(mode) {
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.evViewMode = mode;
    const isPhoto = mode === 'photo';

    // Dashboard
    const dashPhoto = document.getElementById('dash-photo-stage');
    const dashCanvas = document.getElementById('dash-ev-3d-canvas');
    const dashBtnPhoto = document.getElementById('dash-mode-photo');
    const dashBtnCad = document.getElementById('dash-mode-cad');
    const dashSub = document.getElementById('dash-ev-mode-sub');

    if (dashPhoto) dashPhoto.style.display = isPhoto ? 'flex' : 'none';
    if (dashCanvas) dashCanvas.style.display = isPhoto ? 'none' : 'block';
    if (dashBtnPhoto) dashBtnPhoto.classList.toggle('active', isPhoto);
    if (dashBtnCad) dashBtnCad.classList.toggle('active', !isPhoto);
    if (dashSub) dashSub.textContent = isPhoto ? 'INTERACTIVE 3D TWIN • DRAG TO TILT 360°' : '3D WIREFRAME CAD • DRAG TO ROTATE 360°';

    // Vehicle Screen
    const vehPhoto = document.getElementById('veh-photo-stage');
    const vehCanvas = document.getElementById('ev-3d-canvas');
    const vehBtnPhoto = document.getElementById('veh-mode-photo');
    const vehBtnCad = document.getElementById('veh-mode-cad');
    const vehSub = document.getElementById('ev-mode-sub');

    if (vehPhoto) vehPhoto.style.display = isPhoto ? 'flex' : 'none';
    if (vehCanvas) vehCanvas.style.display = isPhoto ? 'none' : 'block';
    if (vehBtnPhoto) vehBtnPhoto.classList.toggle('active', isPhoto);
    if (vehBtnCad) vehBtnCad.classList.toggle('active', !isPhoto);
    if (vehSub) vehSub.textContent = isPhoto ? 'PERSPECTIVE 3D • TOUCH HOTSPOTS TO DIAGNOSE' : '3D CAD BLUEPRINT • DRAG TO ROTATE 360°';

    if (!isPhoto && window.initCyber3D) {
      setTimeout(window.initCyber3D, 50);
    }
  }

  toggleActiveEvRotate() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    if (this.evViewMode === 'cad') {
      if (window.evVehicle3D) window.evVehicle3D.toggleAutoRotate();
      if (window.dashEv3D) window.dashEv3D.toggleAutoRotate();
    } else {
      const dashImg = document.getElementById('dash-photo-img');
      const vehImg = document.getElementById('veh-photo-img');
      this._photoRotateActive = !this._photoRotateActive;
      const current = this._photoRotateActive;
      if (dashImg) dashImg.style.animation = current ? 'ev-scan-vertical 4s infinite alternate' : 'none';
      if (vehImg) vehImg.style.animation = current ? 'ev-scan-vertical 4s infinite alternate' : 'none';
    }
  }

  resetActiveEvCam() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    if (window.evVehicle3D) window.evVehicle3D.resetCamera();
    if (window.dashEv3D) window.dashEv3D.resetCamera();
    
    ['dash-photo-stage', 'veh-photo-stage'].forEach(id => {
      const stage = document.getElementById(id);
      if (stage) {
        stage.style.setProperty('--tilt-x', '0deg');
        stage.style.setProperty('--tilt-y', '0deg');
        stage.style.setProperty('--zoom-scale', '1');
      }
    });
  }

  renderPhotoPins(containerId, modelKey) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const PIN_PROFILES = {
      tesla: [
        { name: 'Autopilot HW4 Neural Core', status: 'ENCRYPTED', top: 42, left: 40, color: '#00f0ff', info: 'Dual FSD HW4 • 300 TOPS • Encrypted' },
        { name: '400V 82 kWh Structural Pack', status: 'SECURE', top: 62, left: 52, color: '#00ff9d', info: '392.4V • 32.4°C Nominal • ASIL-D' },
        { name: 'Dual PMSM 360 kW Inverter', status: 'NOMINAL', top: 64, left: 74, color: '#00f0ff', info: 'SiC MOSFET Inverter 450A' },
        { name: 'Tesla NACS Supercharging Port', status: 'STANDBY', top: 50, left: 83, color: '#ffb703', info: '250 kW Peak • 400V DC Supercharge' }
      ],
      porsche: [
        { name: '4D Integrated Chassis ECU', status: 'MONITORED', top: 44, left: 40, color: '#00f0ff', info: 'PASM Air Suspension • CAN-FD' },
        { name: '800V Performance Battery Plus', status: 'SECURE', top: 64, left: 54, color: '#00ff9d', info: '800V High-Current Pack • 93.4 kWh' },
        { name: '2-Speed Rear Axle Transaxle', status: 'NOMINAL', top: 62, left: 76, color: '#00f0ff', info: 'High-Torque Launch Gearbox' },
        { name: 'Porsche 270 kW DC Fast Port', status: 'STANDBY', top: 50, left: 68, color: '#ffb703', info: '800V DC • 5% to 80% in 21m' }
      ],
      mercedes: [
        { name: 'Neuromorphic AI Palm Console', status: 'SECURE', top: 40, left: 45, color: '#00f0ff', info: 'Zero-Touch Biometric Brain Sync' },
        { name: '110 kWh Graphene Bio-Cell', status: 'ORGANIC', top: 64, left: 50, color: '#00ff9d', info: 'Zero Rare Earth • 100% Compostable' },
        { name: '33 Bionic Spine Flap Array', status: 'ACTIVE', top: 32, left: 24, color: '#ffb703', info: 'Aerodynamic Flap Sync • 33 Actuators' },
        { name: 'Quad Spherical Crab-Motors', status: 'NOMINAL', top: 66, left: 68, color: '#00f0ff', info: '30° Lateral Crab-Walk Active' }
      ],
      cybertruck: [
        { name: '30X Stainless Exoskeleton', status: 'ARMORED', top: 38, left: 50, color: '#00f0ff', info: 'Bulletproof Monocoque Exoskeleton' },
        { name: '800V Structural 4680 Cyber Pack', status: 'SECURE', top: 66, left: 52, color: '#00ff9d', info: '123 kWh Armor-Protected Pack' },
        { name: 'Tri-Motor Cyberbeast Powertrain', status: 'NOMINAL', top: 64, left: 32, color: '#00f0ff', info: '845 hp • Torque Vectoring Active' },
        { name: 'Powershare 11.5 kW V2L/V2H Port', status: 'STANDBY', top: 54, left: 84, color: '#ffb703', info: '120V / 240V Bi-Directional Inverter' }
      ]
    };

    const pins = PIN_PROFILES[modelKey] || PIN_PROFILES.tesla;
    container.innerHTML = pins.map(p => `
      <div class="ev-pin-node" style="top:${p.top}%;left:${p.left}%;--pin-color:${p.color};" onclick="window.app.onPinClick('${p.name}', '${p.status}', '${p.info}', '${p.color}')">
        <div class="core-dot"></div>
        <div class="pin-tooltip">${p.name}</div>
      </div>
    `).join('');
  }

  onPinClick(name, status, info, color) {
    if (window.cyberAudio) window.cyberAudio.playClick();
    const ui = document.getElementById('ev-hotspot-info');
    if (ui) {
      ui.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;">
          <span style="font-weight:700;color:#fff;letter-spacing:0.06em;text-transform:uppercase;">${name}</span>
          <span style="font-family:var(--font-mono);color:${color};padding:2px 6px;border:1px solid ${color};border-radius:4px;">${status}</span>
        </div>
        <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">${info} • ISO 26262 ASIL-D Diagnostic Active</div>
      `;
    }
  }

  initPhotoParallax(stageId, imgId) {
    const stage = document.getElementById(stageId);
    if (!stage) return;

    let isDown = false;
    let startX = 0, startY = 0;
    let currentTiltX = 0, currentTiltY = 0;
    let zoom = 1.0;

    const handleMove = (clientX, clientY) => {
      const rect = stage.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;
      const midY = rect.top + rect.height / 2;
      const tiltY = ((clientX - midX) / (rect.width / 2)) * 18;
      const tiltX = -((clientY - midY) / (rect.height / 2)) * 14;

      stage.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      stage.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    };

    stage.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
    });

    stage.addEventListener('mousemove', (e) => {
      handleMove(e.clientX, e.clientY);
    });

    stage.addEventListener('mouseleave', () => {
      if (!isDown) {
        stage.style.setProperty('--tilt-x', '0deg');
        stage.style.setProperty('--tilt-y', '0deg');
      }
    });

    // Touch drag support
    stage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDown = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    stage.addEventListener('touchend', () => {
      isDown = false;
      stage.style.setProperty('--tilt-x', '0deg');
      stage.style.setProperty('--tilt-y', '0deg');
    });

    // Wheel zoom
    stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      zoom = Math.max(0.8, Math.min(1.6, zoom + delta));
      stage.style.setProperty('--zoom-scale', zoom.toFixed(2));
    }, { passive: false });
  }

  // --- Attack Injection Logic (Screen 19 Demo Mode) ---
  triggerAttack(attackId) {
    window.cyberAudio.playClick();
    const demoModal = document.getElementById('demo-modal');
    if (demoModal) demoModal.classList.remove('open');

    // Attack mapping
    const attackProfiles = {
      1: { type: 'NORMAL', title: 'Normal Operation Restored', desc: 'All telemetry channels within 3-sigma bounds.', risk: 8.5, level: 'LOW', score: 92 },
      2: { type: 'UNAUTHORIZED_ACCESS', title: 'Unauthorized Access Attempt', desc: 'Port scanning and brute-force handshake detected on telematics gateway.', risk: 78.0, level: 'HIGH', score: 68 },
      3: { type: 'ABNORMAL_CHARGING', title: 'Abnormal Charging Behaviour', desc: 'Severe current transient spike to 84.5A (Station Overcurrent Attack).', risk: 94.5, level: 'CRITICAL', score: 32 },
      4: { type: 'CAN_INJECTION', title: 'Unknown CAN Message Injection', desc: 'High-frequency spoofed arbitration frame 0x18DAF110 bus flooding.', risk: 91.0, level: 'CRITICAL', score: 38 },
      5: { type: 'HIGH_TEMP', title: 'Sudden Battery Parameter Changes', desc: 'Thermal runaway exploit detected: BMS thermal array exceeded 62°C.', risk: 89.2, level: 'CRITICAL', score: 41 },
      6: { type: 'LOGIN_BRUTEFORCE', title: 'Multiple Failed Authentication Attempts', desc: 'Credential stuffing attack triggered 10 failed logins in 5 seconds.', risk: 72.0, level: 'HIGH', score: 74 }
    };

    const atk = attackProfiles[attackId] || attackProfiles[1];
    this.activeAttack = atk.type;

    if (atk.level === 'CRITICAL' || atk.level === 'HIGH') {
      window.cyberAudio.playThreatAlarm();
      this.showToast(`🚨 CYBER THREAT DETECTED: ${atk.title}`, 'critical');

      // Prepend alert
      const newAlert = {
        alertId: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        threatType: atk.title,
        riskLevel: atk.level,
        riskScore: atk.risk,
        source: atk.type === 'ABNORMAL_CHARGING' ? 'Station CS-1024' : 'CAN Bus Bus 0',
        description: atk.desc,
        status: 'Active',
        timestamp: 'Just now'
      };
      this.threatAlerts.unshift(newAlert);
      this.selectedAlert = newAlert;

      // Prepend log
      this.securityLogs.unshift({
        logId: `LOG-${Math.floor(10000 + Math.random() * 90000)}`,
        eventType: "Attack Injected",
        description: atk.desc,
        status: "FLAGGED",
        timestamp: new Date().toLocaleTimeString()
      });

      // Prepend notification
      this.notifications.unshift({
        id: `n${this.notifications.length + 1}`,
        title: atk.title,
        message: atk.desc,
        priority: atk.level,
        read: false,
        time: "Just now"
      });
    } else {
      window.cyberAudio.playSuccess();
      this.showToast('✅ Normal Baseline Restored. AI Anomaly Filter clear.', 'safe');
      // Resolve alerts
      this.threatAlerts.forEach(a => a.status = 'Resolved');
    }

    // Edge AI Engine Evaluation
    this.runAiEvaluation();

    // Navigate to Dashboard or Alerts if attack
    if (attackId !== 1 && this.currentScreen !== 'screen-alerts' && this.currentScreen !== 'screen-dashboard') {
      this.navigateTo('screen-dashboard');
    } else {
      this.renderScreen(this.currentScreen);
    }
  }

  runAiEvaluation() {
    // Synthesize telemetry according to active attack
    const t = Date.now() / 1000;
    if (this.activeAttack === 'ABNORMAL_CHARGING') {
      this.telemetry.charging_current = 84.5;
      this.telemetry.charging_voltage = 438.0;
      this.telemetry.battery_temp = 48.0;
      this.aiAnalysis.is_anomaly = true;
      this.aiAnalysis.dominant_channel = 'charging_current';
      this.aiAnalysis.risk_score = 94.5;
      this.aiAnalysis.risk_level = 'CRITICAL';
      this.aiAnalysis.security_score = 32;
    } else if (this.activeAttack === 'CAN_INJECTION') {
      this.telemetry.can_msg_frequency = 960.0;
      this.telemetry.vehicle_speed = 138.0;
      this.aiAnalysis.is_anomaly = true;
      this.aiAnalysis.dominant_channel = 'can_msg_frequency';
      this.aiAnalysis.risk_score = 91.0;
      this.aiAnalysis.risk_level = 'CRITICAL';
      this.aiAnalysis.security_score = 38;
    } else if (this.activeAttack === 'HIGH_TEMP') {
      this.telemetry.battery_temp = 63.8;
      this.telemetry.battery_voltage = 348.0;
      this.aiAnalysis.is_anomaly = true;
      this.aiAnalysis.dominant_channel = 'battery_temp';
      this.aiAnalysis.risk_score = 89.2;
      this.aiAnalysis.risk_level = 'CRITICAL';
      this.aiAnalysis.security_score = 41;
    } else if (this.activeAttack === 'UNAUTHORIZED_ACCESS') {
      this.telemetry.can_msg_frequency = 520.0;
      this.aiAnalysis.is_anomaly = true;
      this.aiAnalysis.dominant_channel = 'can_msg_frequency';
      this.aiAnalysis.risk_score = 78.0;
      this.aiAnalysis.risk_level = 'HIGH';
      this.aiAnalysis.security_score = 68;
    } else if (this.activeAttack === 'LOGIN_BRUTEFORCE') {
      this.aiAnalysis.is_anomaly = true;
      this.aiAnalysis.dominant_channel = 'can_msg_frequency';
      this.aiAnalysis.risk_score = 72.0;
      this.aiAnalysis.risk_level = 'HIGH';
      this.aiAnalysis.security_score = 74;
    } else {
      // Normal
      this.telemetry.vehicle_speed = 45.0 + Math.sin(t) * 4;
      this.telemetry.battery_voltage = 392.0 + Math.cos(t) * 1.5;
      this.telemetry.battery_temp = 32.0 + Math.sin(t * 0.5) * 0.8;
      this.telemetry.charging_current = 31.8 + Math.sin(t * 0.2) * 0.6;
      this.telemetry.can_msg_frequency = 260.0 + Math.sin(t) * 12;
      this.aiAnalysis.is_anomaly = false;
      this.aiAnalysis.dominant_channel = 'esp32_vibration_g';
      this.aiAnalysis.risk_score = 8.5;
      this.aiAnalysis.risk_level = 'LOW';
      this.aiAnalysis.security_score = 92;
    }

    // Update notification badge count
    const unread = this.notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notif-badge-count');
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? 'flex' : 'none';
    }

    // Update global status badge in header
    const hdrBadge = document.getElementById('header-status-badge');
    if (hdrBadge) {
      hdrBadge.className = `header-status-badge badge-${this.aiAnalysis.risk_level.toLowerCase()}`;
      hdrBadge.innerHTML = `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:currentColor;"></span> ${this.aiAnalysis.risk_level} (${this.aiAnalysis.security_score}%)`;
    }

    // Propagate Real-Time Threat Signal to 3D Digital Twin
    if (window.tesla3DLab) {
      window.tesla3DLab.setThreatSignal(this.aiAnalysis.is_anomaly, {
        attackType: this.activeAttack,
        riskScore: this.aiAnalysis.risk_score,
        riskLevel: this.aiAnalysis.risk_level,
        dominantChannel: this.aiAnalysis.dominant_channel
      });
    }
  }

  startSimulationStream() {
    setInterval(() => {
      this.runAiEvaluation();
      // Push history
      this.speedHistory.push(this.telemetry.vehicle_speed);
      if (this.speedHistory.length > 10) this.speedHistory.shift();
      this.voltHistory.push(this.telemetry.battery_voltage);
      if (this.voltHistory.length > 10) this.voltHistory.shift();
      this.tempHistory.push(this.telemetry.battery_temp);
      if (this.tempHistory.length > 10) this.tempHistory.shift();

      if (this.currentScreen === 'screen-dashboard') this.updateDashboard();
      if (this.currentScreen === 'screen-vehicle') this.updateVehicleScreen();
      if (this.currentScreen === 'screen-charging') this.updateChargingScreen();
    }, 2400);
  }

  // --- Real-time CAN / OCPP bus stream ---
  initCanStream() {
    const hexChars = "0123456789ABCDEF";
    const getRandomHex = (len) => Array.from({ length: len }, () => hexChars[Math.floor(Math.random() * 16)]).join("");

    setInterval(() => {
      let id = "0x" + getRandomHex(4);
      let data = `${getRandomHex(2)} ${getRandomHex(2)} ${getRandomHex(2)} ${getRandomHex(2)} ${getRandomHex(2)} ${getRandomHex(2)}`;
      let status = "Normal";

      if (this.activeAttack === "CAN_INJECTION") {
        id = "0x18DAF110";
        data = "03 22 F1 90 AA BB CC DD";
        status = "Suspicious";
      } else if (this.activeAttack === "ABNORMAL_CHARGING") {
        id = "OCPP 2.0.1";
        data = '{"current":84.5,"overlimit":true}';
        status = "Suspicious";
      }

      this.canLogBuffer.unshift({
        time: new Date().toTimeString().split(' ')[0],
        id: id,
        data: data,
        status: status
      });
      if (this.canLogBuffer.length > 25) this.canLogBuffer.pop();

      if (this.currentScreen === 'screen-communication') {
        this.renderCommunicationScreen();
      }
    }, 1100);
  }

  // --- Screen Updaters ---

  updateDashboard() {
    const score = this.aiAnalysis.security_score;
    const scoreEl = document.getElementById('dash-score-text');
    const statusEl = document.getElementById('dash-status-text');
    const circle = document.getElementById('dash-gauge-circle');

    if (scoreEl) scoreEl.textContent = `${score}%`;
    if (statusEl) {
      statusEl.textContent = this.aiAnalysis.risk_level === 'LOW' ? 'SAFE' : this.aiAnalysis.risk_level;
      statusEl.style.color = this.aiAnalysis.risk_level === 'LOW' ? '#00ff9d' : (this.aiAnalysis.risk_level === 'MEDIUM' ? '#ffb703' : '#ff0055');
    }

    if (circle) {
      // 440 is total perimeter for r=70 (2*pi*70 ~= 439.8)
      const offset = 440 - (440 * score / 100);
      circle.style.strokeDashoffset = offset;
      circle.style.stroke = this.aiAnalysis.risk_level === 'LOW' ? '#00ff9d' : (this.aiAnalysis.risk_level === 'MEDIUM' ? '#ffb703' : '#ff0055');
      circle.style.filter = `drop-shadow(0 0 10px ${circle.style.stroke})`;
    }

    // Telemetry updates
    const elSpeed = document.getElementById('dash-val-speed');
    const elVolt = document.getElementById('dash-val-volt');
    const elTemp = document.getElementById('dash-val-temp');
    const elActiveThreats = document.getElementById('dash-val-active-threats');
    const elTotalThreats = document.getElementById('dash-val-total-threats');

    if (elSpeed) elSpeed.textContent = `${Math.round(this.telemetry.vehicle_speed)}`;
    if (elVolt) elVolt.textContent = `${this.telemetry.battery_voltage.toFixed(1)}`;
    if (elTemp) elTemp.textContent = `${this.telemetry.battery_temp.toFixed(1)}`;
    if (elActiveThreats) elActiveThreats.textContent = this.threatAlerts.filter(a => a.status === 'Active').length;
    if (elTotalThreats) elTotalThreats.textContent = this.threatAlerts.length;
  }

  updateVehicleScreen() {
    const vSpeed = document.getElementById('veh-speed');
    const vVolt = document.getElementById('veh-volt');
    const vTemp = document.getElementById('veh-temp');
    const vMotor = document.getElementById('veh-motor');

    if (vSpeed) vSpeed.textContent = `${Math.round(this.telemetry.vehicle_speed)} km/h`;
    if (vVolt) vVolt.textContent = `${this.telemetry.battery_voltage.toFixed(1)} V`;
    if (vTemp) vTemp.textContent = `${this.telemetry.battery_temp.toFixed(1)} °C`;
    if (vMotor) vMotor.textContent = this.telemetry.motor_current > 140 ? 'Anomalous Load' : 'Normal Operational';

    this.renderMiniChart('veh-speed-chart', this.speedHistory, '#00f0ff');
    this.renderMiniChart('veh-volt-chart', this.voltHistory, '#00ff9d');
    this.renderMiniChart('veh-temp-chart', this.tempHistory, '#ffb703');

    if (window.initTeslaLab) {
      setTimeout(() => {
        window.initTeslaLab();
        if (window.tesla3DLab && window.tesla3DLab.onResize) {
          window.tesla3DLab.onResize();
        }
      }, 50);
    }
  }

  updateChargingScreen() {
    const cVolt = document.getElementById('chg-volt');
    const cCurr = document.getElementById('chg-curr');
    const cPower = document.getElementById('chg-power');
    const cStatus = document.getElementById('chg-status-badge');

    if (cVolt) cVolt.textContent = `${this.telemetry.charging_voltage.toFixed(1)} V`;
    if (cCurr) cCurr.textContent = `${this.telemetry.charging_current.toFixed(1)} A`;
    const kw = (this.telemetry.charging_voltage * this.telemetry.charging_current / 1000).toFixed(1);
    if (cPower) cPower.textContent = `${kw} kW`;

    if (cStatus) {
      if (this.telemetry.charging_current > 50) {
        cStatus.className = 'header-status-badge badge-critical';
        cStatus.textContent = 'OVERCURRENT ANOMALY';
      } else {
        cStatus.className = 'header-status-badge badge-safe';
        cStatus.textContent = 'SECURE ACTIVE';
      }
    }
  }

  updateAiScreen() {
    const mseVal = document.getElementById('ai-mse-val');
    const thresVal = document.getElementById('ai-thres-val');
    const confVal = document.getElementById('ai-conf-val');
    const statusVal = document.getElementById('ai-anomaly-status');

    if (mseVal) mseVal.textContent = this.aiAnalysis.mse.toFixed(4);
    if (thresVal) thresVal.textContent = this.aiAnalysis.threshold.toFixed(4);
    if (confVal) confVal.textContent = `${this.aiAnalysis.confidence}%`;
    if (statusVal) {
      statusVal.textContent = this.aiAnalysis.is_anomaly ? 'ANOMALY DETECTED' : 'NORMAL BEHAVIOUR';
      statusVal.style.color = this.aiAnalysis.is_anomaly ? '#ff0055' : '#00ff9d';
    }
  }

  renderAlerts(filter = 'ALL') {
    const container = document.getElementById('alerts-feed-container');
    if (!container) return;

    const filtered = filter === 'ALL'
      ? this.threatAlerts
      : this.threatAlerts.filter(a => a.riskLevel.toUpperCase() === filter.toUpperCase());

    container.innerHTML = filtered.map(a => `
      <div class="cyber-card" style="border-left: 4px solid ${a.riskLevel === 'CRITICAL' ? '#ff0055' : (a.riskLevel === 'HIGH' ? '#fb8500' : '#ffb703')}">
        <div class="card-header">
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--cyber-cyan)">${a.alertId}</span>
          <span class="header-status-badge badge-${a.riskLevel.toLowerCase()}">${a.riskLevel}</span>
        </div>
        <div style="font-weight:700;font-size:14px;margin-bottom:4px;color:#fff">${a.threatType}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">${a.description}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--text-dim)">
          <span>Source: ${a.source}</span>
          <span>Status: <b>${a.status}</b></span>
        </div>
        <div style="display:flex;gap:6px;margin-top:10px">
          <button class="cyber-btn btn-outline btn-xs" onclick="window.app.viewThreatDetail('${a.alertId}')">Inspect</button>
          <button class="cyber-btn btn-primary btn-xs" onclick="window.app.mitigateThreat('${a.alertId}', 'Resolved')">Resolve</button>
          <button class="cyber-btn btn-danger btn-xs" onclick="window.app.mitigateThreat('${a.alertId}', 'Blocked')">Block</button>
          <button class="cyber-btn btn-outline btn-xs" onclick="window.app.mitigateThreat('${a.alertId}', 'Isolated')">Isolate</button>
        </div>
      </div>
    `).join('');
  }

  viewThreatDetail(alertId) {
    window.cyberAudio.playClick();
    const alert = this.threatAlerts.find(a => a.alertId === alertId);
    if (alert) {
      this.selectedAlert = alert;
      this.navigateTo('screen-threat-details');
    }
  }

  renderThreatDetails() {
    const a = this.selectedAlert;
    if (!a) return;

    const idEl = document.getElementById('td-id');
    const nameEl = document.getElementById('td-name');
    const badgeEl = document.getElementById('td-badge');
    const scoreEl = document.getElementById('td-score');
    const descEl = document.getElementById('td-desc');
    const srcEl = document.getElementById('td-source');

    if (idEl) idEl.textContent = a.alertId;
    if (nameEl) nameEl.textContent = a.threatType;
    if (badgeEl) {
      badgeEl.className = `header-status-badge badge-${a.riskLevel.toLowerCase()}`;
      badgeEl.textContent = a.riskLevel;
    }
    if (scoreEl) scoreEl.textContent = `${a.riskScore}/100`;
    if (descEl) descEl.textContent = a.description;
    if (srcEl) srcEl.textContent = a.source;
  }

  mitigateThreat(alertId, action) {
    window.cyberAudio.playSuccess();
    const a = this.threatAlerts.find(item => item.alertId === alertId);
    if (a) {
      a.status = action;
      this.showToast(`Action Applied: ${action} on ${alertId}`, 'safe');

      this.securityLogs.unshift({
        logId: `LOG-${Math.floor(10000 + Math.random() * 90000)}`,
        eventType: "Threat Mitigation",
        description: `Alert ${alertId} (${a.threatType}) set to ${action}`,
        status: action.toUpperCase(),
        timestamp: new Date().toLocaleTimeString()
      });

      this.renderAlerts();
      if (this.currentScreen === 'screen-threat-details') {
        this.renderThreatDetails();
      }
    }
  }

  renderRiskAnalysis() {
    // Renders breakdown values
    const formulaVal = document.getElementById('risk-calc-display');
    if (formulaVal) {
      formulaVal.innerHTML = `
        <div style="font-family:var(--font-mono);font-size:12px;color:var(--cyber-cyan);line-height:1.6">
          Risk Score = 0.45 × Severity + 0.25 × Frequency + 0.30 × System Impact<br>
          = 0.45 × ${(this.aiAnalysis.risk_score * 0.9).toFixed(1)} + 0.25 × 60.0 + 0.30 × 90.0<br>
          <span style="color:#00ff9d;font-size:14px;font-weight:700">Calculated Index: ${this.aiAnalysis.risk_score}</span>
        </div>
      `;
    }
  }

  renderSensorScreen() {
    const sensors = [
      { id: "S-HVDC-01", name: "High-Voltage DC Probe", val: `${this.telemetry.battery_voltage.toFixed(1)} V`, status: "Active" },
      { id: "S-CURR-02", name: "Hall Current Shunt", val: `${this.telemetry.charging_current.toFixed(1)} A`, status: "Active" },
      { id: "S-THRM-03", name: "Battery Thermal Array (16-pt)", val: `${this.telemetry.battery_temp.toFixed(1)} °C`, status: "Active" },
      { id: "S-IMU-04", name: "6-DOF IMU & Chassis G", val: `${this.telemetry.esp32_vibration_g.toFixed(2)} G`, status: "Active" },
      { id: "S-ESP-05", name: "ESP32 Secure CAN Gateway", val: `${Math.round(this.telemetry.can_msg_frequency)} msg/s`, status: "mTLS Online" }
    ];

    const container = document.getElementById('sensors-list-container');
    if (container) {
      container.innerHTML = sensors.map(s => `
        <div class="cyber-card" style="margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-size:11px;color:var(--text-dim);font-family:var(--font-mono)">${s.id}</div>
              <div style="font-weight:700;font-size:13px">${s.name}</div>
            </div>
            <div style="text-align:right">
              <div style="font-family:var(--font-mono);font-size:16px;color:var(--cyber-cyan);font-weight:700">${s.val}</div>
              <span class="header-status-badge badge-safe" style="font-size:9px">${s.status}</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  renderCommunicationScreen() {
    const feed = document.getElementById('can-hex-feed');
    if (feed) {
      feed.innerHTML = this.canLogBuffer.map(item => `
        <div class="hex-row ${item.status === 'Suspicious' ? 'critical' : ''}">
          <span>[${item.time}]</span>
          <span style="color:var(--cyber-cyan)">${item.id}</span>
          <span>${item.data}</span>
          <span style="font-weight:700">${item.status}</span>
        </div>
      `).join('');
    }
  }

  renderLogsScreen() {
    const list = document.getElementById('logs-list-container');
    if (list) {
      list.innerHTML = this.securityLogs.map(log => `
        <div class="cyber-card" style="padding:10px;margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-bottom:4px">
            <span style="font-family:var(--font-mono);color:var(--cyber-cyan)">${log.logId}</span>
            <span>${log.timestamp}</span>
          </div>
          <div style="font-weight:700;font-size:13px;margin-bottom:2px">${log.eventType}</div>
          <div style="font-size:12px;color:var(--text-muted)">${log.description}</div>
        </div>
      `).join('');
    }
  }

  renderNotifications() {
    const container = document.getElementById('notif-list-container');
    if (container) {
      container.innerHTML = this.notifications.map(n => `
        <div class="cyber-card" style="border-left:4px solid ${n.priority === 'CRITICAL' ? '#ff0055' : (n.priority === 'HIGH' ? '#fb8500' : '#00ff9d')}">
          <div class="card-header" style="margin-bottom:4px">
            <span style="font-weight:700;font-size:13px;color:#fff">${n.title}</span>
            <span style="font-size:10px;color:var(--text-dim)">${n.time}</span>
          </div>
          <div style="font-size:12px;color:var(--text-muted)">${n.message}</div>
        </div>
      `).join('');
    }
  }

  renderProfileScreen() {
    const nameEl = document.getElementById('profile-name');
    const roleEl = document.getElementById('profile-role');
    const emailEl = document.getElementById('profile-email');
    if (nameEl) nameEl.textContent = this.user.name;
    if (roleEl) roleEl.textContent = this.user.role;
    if (emailEl) emailEl.textContent = this.user.email;
  }

  switchRole(newRole) {
    window.cyberAudio.playClick();
    this.user.role = newRole;
    this.showToast(`Switched active role to: ${newRole}`, 'safe');
    this.renderProfileScreen();
  }

  renderSettingsScreen() {
    // Slider values etc.
  }

  renderAdminScreen() {
    // Admin statistics
  }

  renderReportsScreen() {
    const reportDate = document.getElementById('report-date-str');
    if (reportDate) reportDate.textContent = new Date().toLocaleString();
  }

  // --- Actions ---

  runManualScan() {
    window.cyberAudio.playScanSweep();
    const btn = document.getElementById('btn-run-scan');
    if (btn) {
      btn.innerHTML = `Scanning Neural Space...`;
      btn.style.opacity = '0.7';
    }

    setTimeout(() => {
      if (btn) {
        btn.innerHTML = `⚡ Run AI Security Scan`;
        btn.style.opacity = '1';
      }
      window.cyberAudio.playSuccess();
      this.showToast('AI Security Scan Completed. 1,024 packets verified.', 'safe');
      this.renderAiScreen();
    }, 1400);
  }

  exportReportCSV() {
    window.cyberAudio.playSuccess();
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Timestamp,Channel,MeasuredValue,Status,MSE\n"
      + `${new Date().toISOString()},Speed,${this.telemetry.vehicle_speed},Nominal,0.02\n`
      + `${new Date().toISOString()},BatteryVoltage,${this.telemetry.battery_voltage},Nominal,0.04\n`
      + `${new Date().toISOString()},BatteryTemp,${this.telemetry.battery_temp},Nominal,0.05\n`
      + `${new Date().toISOString()},ChargingCurrent,${this.telemetry.charging_current},${this.telemetry.charging_current > 50 ? 'Anomaly' : 'Nominal'},0.48\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EV_Sentinel_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('CSV Audit Report exported successfully.', 'safe');
  }

  printReportPDF() {
    window.cyberAudio.playClick();
    window.print();
  }

  showToast(message, type = 'safe') {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '80px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = type === 'critical' ? 'rgba(255, 0, 85, 0.95)' : 'rgba(11, 21, 40, 0.95)';
    toast.style.border = `1px solid ${type === 'critical' ? '#ff0055' : '#00f0ff'}`;
    toast.style.color = '#fff';
    toast.style.padding = '10px 18px';
    toast.style.borderRadius = '24px';
    toast.style.fontSize = '12px';
    toast.style.fontWeight = '700';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6)';
    toast.textContent = message;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s';
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 400);
    }, 2800);
  }

  renderMiniChart(canvasId, dataPoints, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (dataPoints.length < 2) return;
    const min = Math.min(...dataPoints);
    const max = Math.max(...dataPoints) + 0.001;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    dataPoints.forEach((val, i) => {
      const x = (i / (dataPoints.length - 1)) * w;
      const y = h - ((val - min) / (max - min)) * (h - 10) - 5;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
}

// Instantiate and expose globally
window.addEventListener('DOMContentLoaded', () => {
  window.app = new EVSentinelApp();
  if (window.initTeslaLab) setTimeout(window.initTeslaLab, 100);
});
