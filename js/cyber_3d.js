/**
 * EV-Sentinel: Native 3D Mathematical & WebGL/Canvas Projection Engine
 * Delivers stripped-back minimalism to immersive 3D interactive graphics.
 * Fully self-contained, 100% offline, zero external dependencies, 60 FPS.
 */

// --- 3D Vector & Matrix Math Utilities ---
const Math3D = {
  project(v, width, height, fov = 400, cameraDist = 450) {
    const z = v.z + cameraDist;
    if (z <= 10) return { x: 0, y: 0, scale: 0, visible: false };
    const scale = fov / z;
    return {
      x: (width / 2) + v.x * scale,
      y: (height / 2) - v.y * scale, // invert Y for screen space
      scale: scale,
      depth: z,
      visible: true
    };
  },

  rotateX(v, rad) {
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
      x: v.x,
      y: v.y * cos - v.z * sin,
      z: v.y * sin + v.z * cos
    };
  },

  rotateY(v, rad) {
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
      x: v.x * cos + v.z * sin,
      y: v.y,
      z: -v.x * sin + v.z * cos
    };
  },

  rotateZ(v, rad) {
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
      x: v.x * cos - v.y * sin,
      y: v.x * sin + v.y * cos,
      z: v.z
    };
  }
};

// ============================================================================
// 1. IMMERSIVE 3D VEHICLE WIREFRAME ENGINE (Screen 5 & Hero Views)
// ============================================================================
class EVVehicle3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.currentModel = 'tesla';
    this.rotX = 0.28;
    this.rotY = -0.75;
    this.targetRotX = 0.28;
    this.targetRotY = -0.75;
    this.zoom = 1.0;
    this.targetZoom = 1.0;
    
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.autoRotate = true;
    this.speedOffset = 0;
    this.xrayMode = false;
    this.animTime = 0;
    
    this.hoveredHotspot = null;
    this.activeHotspot = null;
    
    this._loadModel(this.currentModel);
    this._bindEvents();
    this._animate();
  }

  setModel(modelKey) {
    if (!['tesla', 'porsche', 'mercedes', 'cybertruck'].includes(modelKey)) return;
    this.currentModel = modelKey;
    this._loadModel(modelKey);
    this._updateUI();
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
    return this.autoRotate;
  }

  resetCamera() {
    this.targetRotX = 0.28;
    this.targetRotY = -0.75;
    this.targetZoom = 1.0;
    this.autoRotate = true;
  }

  toggleXRay() {
    this.xrayMode = !this.xrayMode;
    return this.xrayMode;
  }

  _loadModel(key) {
    if (key === 'tesla') {
      // 1. Tesla Model 3 / Model S (Aerodynamic teardrop fastback silhouette)
      const l = 88, w = 35, h = 23;
      this.modelMeta = {
        name: 'Tesla Model 3 / Model S',
        chassisCode: 'TSLA-M3-DUAL',
        architecture: '400V Architecture',
        battery: '82.0 kWh NCA Pack',
        motors: 'Dual PMSM 360 kW AWD',
        accel: '3.1s (0-100 km/h)',
        tagline: 'Sleek aerodynamic curves, flush nose, and panoramic glass canopy.'
      };

      this.bodyNodes = [
        // Lower chassis loop
        { x: -l, y: -12, z: -w }, { x: -l * 0.75, y: -12, z: -w },
        { x: l * 0.65, y: -12, z: -w }, { x: l, y: -10, z: -w * 0.7 },
        { x: l, y: -10, z: w * 0.7 }, { x: l * 0.65, y: -12, z: w },
        { x: -l * 0.75, y: -12, z: w }, { x: -l, y: -12, z: w },
        // Glass canopy roof & fastback arch
        { x: -l * 0.55, y: h, z: -w * 0.65 }, { x: l * 0.15, y: h, z: -w * 0.65 },
        { x: l * 0.15, y: h, z: w * 0.65 }, { x: -l * 0.55, y: h, z: w * 0.65 },
        // Aero hood scoop & flush nose
        { x: l * 0.75, y: 1, z: -w * 0.8 }, { x: l * 0.75, y: 1, z: w * 0.8 },
        { x: l * 0.95, y: -4, z: 0 },
        // Rear ducktail spoiler & diffuser
        { x: -l * 0.88, y: 5, z: -w * 0.75 }, { x: -l * 0.88, y: 5, z: w * 0.75 },
        { x: -l * 0.95, y: 2, z: 0 }
      ];

      this.edges = [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
        [8, 9], [9, 10], [10, 11], [11, 8],
        [1, 8], [6, 11], [2, 9], [5, 10],
        [9, 12], [10, 13], [12, 3], [13, 4], [12, 14], [13, 14], [14, 3], [14, 4],
        [8, 15], [11, 16], [15, 0], [16, 7], [15, 17], [16, 17], [17, 0], [17, 7]
      ];

      const bl = 52, bw = 24, bh = 7;
      this.bmsSlab = [
        { x: -bl, y: -13, z: -bw }, { x: bl, y: -13, z: -bw },
        { x: bl, y: -13, z: bw }, { x: -bl, y: -13, z: bw },
        { x: -bl, y: -13 + bh, z: -bw }, { x: bl, y: -13 + bh, z: -bw },
        { x: bl, y: -13 + bh, z: bw }, { x: -bl, y: -13 + bh, z: bw }
      ];
      this.bmsEdges = [
        [0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      this.wheelCenters = [
        { x: 54, y: -12, z: -w - 3, type: 'aero' },
        { x: 54, y: -12, z: w + 3, type: 'aero' },
        { x: -56, y: -12, z: -w - 3, type: 'aero' },
        { x: -56, y: -12, z: w + 3, type: 'aero' }
      ];

      this.hotspots = [
        { id: 'fsd', name: 'Autopilot HW4 Neural Computer', x: 18, y: 16, z: 0, status: 'ENCRYPTED', nominal: 'Dual FSD HW4 • 300 TOPS', color: '#00f0ff' },
        { id: 'bms', name: '400V 82 kWh Structural Pack', x: 0, y: -11, z: 0, status: 'SECURE', nominal: '392.4V • 32.4°C Nominal', color: '#00ff9d' },
        { id: 'inverter', name: 'Dual PMSM 360 kW Inverter', x: -54, y: -6, z: 0, status: 'NOMINAL', nominal: 'SiC MOSFET Inverter 450A', color: '#00f0ff' },
        { id: 'nacs', name: 'Tesla NACS Supercharging Port', x: -84, y: 3, z: 27, status: 'STANDBY', nominal: '250 kW Peak • 400V DC', color: '#ffb703' }
      ];
    } 
    else if (key === 'porsche') {
      // 2. Porsche Taycan Turbo S (Low-slung, ultra-wide sporty stance & quad-LEDs)
      const l = 92, w = 40, h = 20;
      this.modelMeta = {
        name: 'Porsche Taycan Turbo S',
        chassisCode: 'PORSCHE-J1-TAYCAN',
        architecture: '800V Performance Architecture',
        battery: '93.4 kWh Performance Plus',
        motors: 'Dual PSM 560 kW (761 hp)',
        accel: '2.6s (0-100 km/h)',
        tagline: 'Wide muscular haunches, quad-LED matrix pods, and 800V ultra-fast architecture.'
      };

      this.bodyNodes = [
        // Lower wide chassis
        { x: -l, y: -12, z: -w * 0.95 }, { x: -l * 0.7, y: -12, z: -w },
        { x: l * 0.65, y: -12, z: -w }, { x: l, y: -11, z: -w * 0.7 },
        { x: l, y: -11, z: w * 0.7 }, { x: l * 0.65, y: -12, z: w },
        { x: -l * 0.7, y: -12, z: w }, { x: -l, y: -12, z: w * 0.95 },
        // Low sporty flyline roof
        { x: -l * 0.5, y: h, z: -w * 0.55 }, { x: l * 0.1, y: h, z: -w * 0.55 },
        { x: l * 0.1, y: h, z: w * 0.55 }, { x: -l * 0.5, y: h, z: w * 0.55 },
        // Low sculpted hood & quad headlamp pods
        { x: l * 0.72, y: -1, z: -w * 0.75 }, { x: l * 0.72, y: -1, z: w * 0.75 },
        { x: l * 0.88, y: -4, z: -w * 0.5 }, { x: l * 0.88, y: -4, z: w * 0.5 },
        // Broad rear shoulders & horizontal light bar
        { x: -l * 0.85, y: 3, z: -w * 0.85 }, { x: -l * 0.85, y: 3, z: w * 0.85 },
        { x: -l * 0.98, y: 1, z: -w * 0.65 }, { x: -l * 0.98, y: 1, z: w * 0.65 }
      ];

      this.edges = [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
        [8, 9], [9, 10], [10, 11], [11, 8],
        [1, 8], [6, 11], [2, 9], [5, 10],
        [9, 12], [10, 13], [12, 14], [13, 15], [14, 3], [15, 4], [14, 15],
        [8, 16], [11, 17], [16, 18], [17, 19], [18, 19], [18, 0], [19, 7]
      ];

      const bl = 56, bw = 28, bh = 6;
      this.bmsSlab = [
        { x: -bl, y: -13, z: -bw }, { x: bl, y: -13, z: -bw },
        { x: bl, y: -13, z: bw }, { x: -bl, y: -13, z: bw },
        { x: -bl, y: -13 + bh, z: -bw }, { x: bl, y: -13 + bh, z: -bw },
        { x: bl, y: -13 + bh, z: bw }, { x: -bl, y: -13 + bh, z: bw }
      ];
      this.bmsEdges = [
        [0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      this.wheelCenters = [
        { x: 56, y: -12, z: -w - 4, type: 'sport' },
        { x: 56, y: -12, z: w + 4, type: 'sport' },
        { x: -58, y: -12, z: -w - 5, type: 'sport' },
        { x: -58, y: -12, z: w + 5, type: 'sport' }
      ];

      this.hotspots = [
        { id: 'bms', name: '800V Performance Battery Plus', x: 0, y: -11, z: 0, status: 'SECURE', nominal: '800V High-Current Pack • 93.4 kWh', color: '#00ff9d' },
        { id: 'transaxle', name: '2-Speed Rear Axle Transmission', x: -58, y: -8, z: 0, status: 'NOMINAL', nominal: 'High-Torque Launch Gearbox', color: '#00f0ff' },
        { id: 'charge_port', name: 'Porsche 270 kW DC Fast Port', x: 42, y: 2, z: 32, status: 'STANDBY', nominal: '800V DC • 5% to 80% in 21m', color: '#ffb703' },
        { id: 'chassis', name: '4D Integrated Chassis Control ECU', x: 10, y: 6, z: 0, status: 'MONITORED', nominal: 'PASM Air Suspension • CAN-FD', color: '#00f0ff' }
      ];
    }
    else if (key === 'mercedes') {
      // 3. Mercedes-Benz Vision AVTR (Bionic organic dome, transparent cocoon, spherical crab wheels)
      const l = 95, w = 42, h = 26;
      this.modelMeta = {
        name: 'Mercedes-Benz Vision AVTR',
        chassisCode: 'MB-VISION-AVTR-BIO',
        architecture: '1000V Graphene Organic',
        battery: '110 kWh Graphene Bio-Cell',
        motors: 'Quad Spherical Omni-Drive 350 kW',
        accel: '3.5s • Crab-Walk 30°',
        tagline: 'Futuristic concept EV with 33 bionic spine flaps and spherical crab-walk wheels.'
      };

      this.bodyNodes = [
        // Organic flowing perimeter
        { x: -l, y: -10, z: -w * 0.7 }, { x: -l * 0.6, y: -11, z: -w },
        { x: l * 0.6, y: -11, z: -w }, { x: l, y: -10, z: -w * 0.6 },
        { x: l, y: -10, z: w * 0.6 }, { x: l * 0.6, y: -11, z: w },
        { x: -l * 0.6, y: -11, z: w }, { x: -l, y: -10, z: w * 0.7 },
        // High bionic transparent cocoon dome
        { x: -l * 0.35, y: h + 3, z: -w * 0.5 }, { x: l * 0.15, y: h + 2, z: -w * 0.5 },
        { x: l * 0.15, y: h + 2, z: w * 0.5 }, { x: -l * 0.35, y: h + 3, z: w * 0.5 },
        // Curving front nose
        { x: l * 0.85, y: 0, z: -w * 0.4 }, { x: l * 0.85, y: 0, z: w * 0.4 },
        // Rear bionic spine flap spine
        { x: -l * 0.55, y: h - 4, z: 0 },
        { x: -l * 0.75, y: h - 10, z: 0 },
        { x: -l * 0.92, y: 0, z: 0 }
      ];

      this.edges = [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
        [8, 9], [9, 10], [10, 11], [11, 8],
        [1, 8], [6, 11], [2, 9], [5, 10],
        [9, 12], [10, 13], [12, 3], [13, 4], [12, 13],
        [8, 14], [11, 14], [14, 15], [15, 16], [16, 0], [16, 7]
      ];

      // Graphene Cell core
      const bl = 50, bw = 22, bh = 8;
      this.bmsSlab = [
        { x: -bl, y: -12, z: -bw }, { x: bl, y: -12, z: -bw },
        { x: bl, y: -12, z: bw }, { x: -bl, y: -12, z: bw },
        { x: -bl, y: -12 + bh, z: -bw }, { x: bl, y: -12 + bh, z: -bw },
        { x: bl, y: -12 + bh, z: bw }, { x: -bl, y: -12 + bh, z: bw }
      ];
      this.bmsEdges = [
        [0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      // Spherical omni-directional wheels
      this.wheelCenters = [
        { x: 55, y: -11, z: -w - 2, type: 'spherical' },
        { x: 55, y: -11, z: w + 2, type: 'spherical' },
        { x: -55, y: -11, z: -w - 2, type: 'spherical' },
        { x: -55, y: -11, z: w + 2, type: 'spherical' }
      ];

      this.hotspots = [
        { id: 'biocore', name: 'Neuromorphic AI Biometric Console', x: -5, y: 12, z: 0, status: 'SECURE', nominal: 'Zero-Touch Biometric Brain Sync', color: '#00f0ff' },
        { id: 'graphene', name: '110 kWh Graphene Bio-Cell', x: 0, y: -10, z: 0, status: 'ORGANIC', nominal: 'Zero Rare Earth • 100% Compostable', color: '#00ff9d' },
        { id: 'flaps', name: '33 Bionic Spine Flap Array', x: -65, y: 15, z: 0, status: 'ACTIVE', nominal: 'Aerodynamic Flap Sync • 33 Actuators', color: '#ffb703' },
        { id: 'omni', name: 'Quad Spherical Crab-Motors', x: 55, y: -11, z: 32, status: 'NOMINAL', nominal: '30° Lateral Crab-Walk Active', color: '#00f0ff' }
      ];
    }
    else if (key === 'cybertruck') {
      // 4. Tesla Cybertruck / Rivian R1T (Origami angular exoskeleton & triangular peak)
      const l = 96, w = 38, h = 30;
      this.modelMeta = {
        name: 'Tesla Cybertruck / Rivian',
        chassisCode: 'TSLA-CYBERBEAST-30X',
        architecture: '800V Cyber Architecture',
        battery: '123 kWh Structural 4680',
        motors: 'Cyberbeast Tri-Motor AWD 630 kW (845 hp)',
        accel: '2.6s (0-100 km/h)',
        tagline: 'Ultra-hard 30X cold-rolled stainless steel exoskeleton and horizon LED light bar.'
      };

      // Iconic triangular apex at x: -10, y: h
      this.bodyNodes = [
        // Lower polygonal chassis
        { x: -l, y: -12, z: -w }, { x: -l * 0.7, y: -12, z: -w },
        { x: l * 0.65, y: -12, z: -w }, { x: l, y: -10, z: -w },
        { x: l, y: -10, z: w }, { x: l * 0.65, y: -12, z: w },
        { x: -l * 0.7, y: -12, z: w }, { x: -l, y: -12, z: w },
        // Triangular roof peak (Apex)
        { x: -12, y: h, z: -w * 0.7 }, { x: -12, y: h, z: w * 0.7 },
        // Horizon front light bar (Full width horizontal line)
        { x: l, y: 6, z: -w }, { x: l, y: 6, z: w },
        // Tailgate vault top edge
        { x: -l, y: 10, z: -w }, { x: -l, y: 10, z: w }
      ];

      this.edges = [
        // Chassis perimeter
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
        // Apex roofline
        [8, 9],
        // Front windshield rake (from horizon bar to apex)
        [10, 8], [11, 9], [10, 11], [10, 3], [11, 4],
        // Vault bed slope (from apex to tailgate)
        [8, 12], [9, 13], [12, 13], [12, 0], [13, 7],
        // Side exoskeleton folds
        [1, 8], [6, 9], [2, 8], [5, 9]
      ];

      const bl = 58, bw = 26, bh = 8;
      this.bmsSlab = [
        { x: -bl, y: -13, z: -bw }, { x: bl, y: -13, z: -bw },
        { x: bl, y: -13, z: bw }, { x: -bl, y: -13, z: bw },
        { x: -bl, y: -13 + bh, z: -bw }, { x: bl, y: -13 + bh, z: -bw },
        { x: bl, y: -13 + bh, z: bw }, { x: -bl, y: -13 + bh, z: bw }
      ];
      this.bmsEdges = [
        [0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      this.wheelCenters = [
        { x: 58, y: -12, z: -w - 4, type: 'angular' },
        { x: 58, y: -12, z: w + 4, type: 'angular' },
        { x: -60, y: -12, z: -w - 4, type: 'angular' },
        { x: -60, y: -12, z: w + 4, type: 'angular' }
      ];

      this.hotspots = [
        { id: 'exoskeleton', name: '30X Cold-Rolled Stainless Exoskeleton', x: 0, y: 15, z: 28, status: 'ARMORED', nominal: 'Bulletproof Monocoque Exoskeleton', color: '#00f0ff' },
        { id: 'bms4680', name: '800V Structural 4680 Cyber Pack', x: 0, y: -11, z: 0, status: 'SECURE', nominal: '123 kWh Armor-Protected Pack', color: '#00ff9d' },
        { id: 'tri_motor', name: 'Tri-Motor Cyberbeast Powertrain', x: -60, y: -7, z: 0, status: 'NOMINAL', nominal: '845 hp • Torque Vectoring Active', color: '#00f0ff' },
        { id: 'powershare', name: 'Powershare 11.5 kW V2L/V2H Inverter', x: -75, y: 4, z: 0, status: 'STANDBY', nominal: '120V / 240V Bi-Directional Power', color: '#ffb703' }
      ];
    }

    this.activeHotspot = this.hotspots[0];
  }

  _updateUI() {
    // Synchronize selector tab buttons
    document.querySelectorAll('.ev-model-tab').forEach(tab => {
      const isSelected = tab.getAttribute('data-model') === this.currentModel;
      tab.classList.toggle('active', isSelected);
    });

    // Update HUD text if present in DOM
    const modelHud = document.getElementById('ev-model-name-hud');
    if (modelHud) modelHud.textContent = this.modelMeta.name.toUpperCase();

    const dashHud = document.getElementById('dash-ev-model-hud');
    if (dashHud) dashHud.textContent = this.modelMeta.name.toUpperCase();

    // Update specs strip if present in DOM
    const specArch = document.getElementById('ev-spec-arch');
    const specBatt = document.getElementById('ev-spec-batt');
    const specMotor = document.getElementById('ev-spec-motor');
    const specAccel = document.getElementById('ev-spec-accel');
    if (specArch) specArch.textContent = this.modelMeta.architecture;
    if (specBatt) specBatt.textContent = this.modelMeta.battery;
    if (specMotor) specMotor.textContent = this.modelMeta.motors;
    if (specAccel) specAccel.textContent = this.modelMeta.accel;

    this._updateHotspotUI(this.activeHotspot);
  }

  _bindEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) {
        this._checkHover(e);
        return;
      }
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.targetRotY += dx * 0.008;
      this.targetRotX -= dy * 0.008;
      this.targetRotX = Math.max(-0.6, Math.min(0.9, this.targetRotX));
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Wheel zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      this.targetZoom = Math.max(0.6, Math.min(2.0, this.targetZoom + delta));
    }, { passive: false });

    // Touch support for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.autoRotate = false;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - this.lastMouseX;
        const dy = e.touches[0].clientY - this.lastMouseY;
        this.targetRotY += dx * 0.008;
        this.targetRotX -= dy * 0.008;
        this.targetRotX = Math.max(-0.6, Math.min(0.9, this.targetRotX));
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Click hotspot
    this.canvas.addEventListener('click', () => {
      if (this.hoveredHotspot) {
        this.activeHotspot = this.hoveredHotspot;
        if (window.cyberAudio) window.cyberAudio.playClick();
        this._updateHotspotUI(this.activeHotspot);
      }
    });
  }

  _checkHover(e) {
    if (!this.canvas || this.canvas.offsetParent === null) {
      this.hoveredHotspot = null;
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      this.hoveredHotspot = null;
      this.canvas.style.cursor = 'default';
      return;
    }
    const mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    
    let found = null;
    if (this.projectedHotspots) {
      this.projectedHotspots.forEach(h => {
        const dist = Math.hypot(mouseX - h.screenX, mouseY - h.screenY);
        if (dist < 22) found = h.source;
      });
    }

    this.hoveredHotspot = found;
    this.canvas.style.cursor = found ? 'pointer' : 'grab';
  }

  _updateHotspotUI(h) {
    if (!h) return;
    const ui = document.getElementById('ev-hotspot-info');
    if (ui) {
      ui.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;">
          <span style="font-weight:700;color:#fff;letter-spacing:0.06em;text-transform:uppercase;">${h.name}</span>
          <span style="font-family:var(--font-mono);color:${h.color};padding:2px 6px;border:1px solid ${h.color};border-radius:4px;">${h.status}</span>
        </div>
        <div style="font-size:10px;color:var(--text-dim);margin-top:2px;">${h.nominal} • ISO 26262 ASIL-D Diagnostic Active</div>
      `;
    }
  }

  _transformPoint(p) {
    const scaled = { x: p.x * this.zoom, y: p.y * this.zoom, z: p.z * this.zoom };
    let pt = Math3D.rotateX(scaled, this.rotX);
    pt = Math3D.rotateY(pt, this.rotY);
    return pt;
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    
    this.animTime += 0.03;
    // Smooth damping
    this.rotX += (this.targetRotX - this.rotX) * 0.08;
    this.rotY += (this.targetRotY - this.rotY) * 0.08;
    this.zoom += (this.targetZoom - this.zoom) * 0.1;

    if (this.autoRotate && !this.isDragging) {
      this.targetRotY += 0.003;
    }

    this.speedOffset = (this.speedOffset + 1.2) % 40;
    this.render();
  }

  render() {
    if (!this.canvas || this.canvas.offsetParent === null) return;
    if (this.canvas.clientWidth > 0 && (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight)) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    }
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    const isAnomaly = window.app?.aiAnalysis?.is_anomaly;

    // 1. Perspective Minimalist Grid Floor
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    this.ctx.lineWidth = 1;
    const gridRange = 180;
    const gridStep = 45;

    for (let x = -gridRange; x <= gridRange; x += gridStep) {
      const p1 = Math3D.project(this._transformPoint({ x, y: -22, z: -gridRange }), w, h);
      const p2 = Math3D.project(this._transformPoint({ x, y: -22, z: gridRange }), w, h);
      if (p1.visible && p2.visible) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
      }
    }

    for (let z = -gridRange; z <= gridRange; z += gridStep) {
      const animZ = z + (this.speedOffset % gridStep);
      const p1 = Math3D.project(this._transformPoint({ x: -gridRange, y: -22, z: animZ }), w, h);
      const p2 = Math3D.project(this._transformPoint({ x, gridRange, y: -22, z: animZ }), w, h);
      if (p1.visible && p2.visible) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
      }
    }

    // 2. High-Voltage Battery Pack Slab
    const bmsProj = this.bmsSlab.map(p => Math3D.project(this._transformPoint(p), w, h));
    this.ctx.strokeStyle = isAnomaly ? 'rgba(255, 0, 85, 0.45)' : 'rgba(0, 255, 157, 0.4)';
    this.ctx.lineWidth = 1.2;
    this.bmsEdges.forEach(([i, j]) => {
      const p1 = bmsProj[i];
      const p2 = bmsProj[j];
      if (p1.visible && p2.visible) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
      }
    });

    // 3. Wheels Rendering (Custom geometries per model: Aero, Sport, Spherical, Angular)
    this.wheelCenters.forEach(wc => {
      const pt = this._transformPoint(wc);
      const proj = Math3D.project(pt, w, h);
      if (proj.visible) {
        const r = 12 * proj.scale * this.zoom;
        const wheelColor = wc.type === 'spherical' ? 'rgba(0, 240, 255, 0.85)' : 'rgba(255, 255, 255, 0.6)';
        this.ctx.strokeStyle = wheelColor;
        this.ctx.lineWidth = 1.5;

        if (wc.type === 'spherical') {
          // Mercedes AVTR Spherical glowing omni-wheels
          this.ctx.beginPath();
          this.ctx.arc(proj.x, proj.y, Math.max(2, r), 0, Math.PI * 2);
          this.ctx.stroke();
          // Inner glowing latitude ring
          this.ctx.strokeStyle = 'rgba(0, 255, 157, 0.7)';
          this.ctx.beginPath();
          this.ctx.ellipse(proj.x, proj.y, r, r * 0.45, this.animTime * 2, 0, Math.PI * 2);
          this.ctx.stroke();
        } else if (wc.type === 'angular') {
          // Cybertruck Angular Octagonal Rims
          const sides = 8;
          this.ctx.beginPath();
          for (let s = 0; s <= sides; s++) {
            const rad = (s / sides) * Math.PI * 2;
            const px = proj.x + Math.cos(rad) * r;
            const py = proj.y + Math.sin(rad) * r;
            if (s === 0) this.ctx.moveTo(px, py);
            else this.ctx.lineTo(px, py);
          }
          this.ctx.stroke();
        } else {
          // Tesla / Porsche Round Wheels with Spoke detail
          this.ctx.beginPath();
          this.ctx.arc(proj.x, proj.y, Math.max(2, r), 0, Math.PI * 2);
          this.ctx.stroke();

          // Spokes
          this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          this.ctx.beginPath();
          this.ctx.moveTo(proj.x - r * 0.7, proj.y);
          this.ctx.lineTo(proj.x + r * 0.7, proj.y);
          this.ctx.moveTo(proj.x, proj.y - r * 0.7);
          this.ctx.lineTo(proj.x, proj.y + r * 0.7);
          this.ctx.stroke();
        }
      }
    });

    // 4. Mercedes AVTR Special: 33 Bionic Spine Flaps (Reactive 3D fluttering scales)
    if (this.currentModel === 'mercedes') {
      const spineStart = -50, spineEnd = -85;
      for (let i = 0; i < 7; i++) {
        const sx = spineStart + (i / 6) * (spineEnd - spineStart);
        const flapOffset = Math.sin(this.animTime * 3 + i * 0.6) * 3;
        const pScale = { x: sx, y: 22 - (i * 2) + flapOffset, z: 0 };
        const p1 = Math3D.project(this._transformPoint({ x: pScale.x, y: pScale.y, z: -4 }), w, h);
        const p2 = Math3D.project(this._transformPoint({ x: pScale.x + 3, y: pScale.y + 4, z: 0 }), w, h);
        const p3 = Math3D.project(this._transformPoint({ x: pScale.x, y: pScale.y, z: 4 }), w, h);
        if (p1.visible && p2.visible && p3.visible) {
          this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.lineTo(p3.x, p3.y);
          this.ctx.closePath();
          this.ctx.stroke();
        }
      }
    }

    // 5. Outer Chassis 3D Wireframe with Depth Lighting
    const bodyProj = this.bodyNodes.map(p => Math3D.project(this._transformPoint(p), w, h));
    this.edges.forEach(([i, j]) => {
      const p1 = bodyProj[i];
      const p2 = bodyProj[j];
      if (p1 && p2 && p1.visible && p2.visible) {
        const avgZ = (p1.depth + p2.depth) / 2;
        const alpha = Math.max(0.25, Math.min(0.95, 1 - (avgZ - 300) / 450));
        
        let strokeCol = `rgba(0, 240, 255, ${alpha})`;
        if (isAnomaly) strokeCol = `rgba(255, 0, 85, ${alpha})`;
        else if (this.currentModel === 'porsche') strokeCol = `rgba(0, 240, 255, ${alpha})`;
        else if (this.currentModel === 'cybertruck') strokeCol = `rgba(230, 235, 245, ${alpha})`;
        else if (this.currentModel === 'mercedes') strokeCol = `rgba(160, 100, 255, ${alpha})`;

        this.ctx.strokeStyle = strokeCol;
        this.ctx.lineWidth = 1.4;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
      }
    });

    // 6. Interactive Hotspots with Depth Sorting
    this.projectedHotspots = [];
    const sortedHotspots = [...this.hotspots].sort((a, b) => {
      const ptA = this._transformPoint(a);
      const ptB = this._transformPoint(b);
      return ptB.z - ptA.z;
    });

    sortedHotspots.forEach(hItem => {
      const pt = this._transformPoint(hItem);
      const proj = Math3D.project(pt, w, h);
      if (proj.visible) {
        this.projectedHotspots.push({ source: hItem, screenX: proj.x, screenY: proj.y });

        const isHovered = this.hoveredHotspot === hItem;
        const isActive = this.activeHotspot === hItem;
        const rad = (isHovered || isActive) ? 6.5 : 4;
        const color = hItem.color;

        // Halo ring
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(proj.x, proj.y, rad + 4, 0, Math.PI * 2);
        this.ctx.stroke();

        // Solid core
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(proj.x, proj.y, rad, 0, Math.PI * 2);
        this.ctx.fill();

        // Billboarding Text
        if (isHovered || isActive) {
          this.ctx.font = '600 9px monospace';
          this.ctx.fillStyle = '#ffffff';
          this.ctx.fillText(hItem.name.toUpperCase(), proj.x + 12, proj.y - 4);
          
          this.ctx.fillStyle = color;
          this.ctx.fillText(hItem.status, proj.x + 12, proj.y + 7);
        }
      }
    });
  }
}

// ============================================================================
// 2. IMMERSIVE 3D GYROSCOPIC CORE / SECURITY SHIELD (Screen 4 Dashboard)
// ============================================================================
class GyroSecurityCore3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.angleX = 0;
    this.angleY = 0;
    this.angleZ = 0;
    this.radius = 42;
    
    this._initIcosahedron();
    this._animate();
  }

  _initIcosahedron() {
    const t = (1.0 + Math.sqrt(5.0)) / 2.0;
    const r = 22;
    const rawVerts = [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
    ];
    
    this.coreVerts = rawVerts.map(v => {
      const len = Math.hypot(v[0], v[1], v[2]);
      return { x: (v[0] / len) * r, y: (v[1] / len) * r, z: (v[2] / len) * r };
    });

    this.coreEdges = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
      [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
      [3, 9], [3, 4], [3, 2], [3, 6], [3, 8],
      [9, 4], [4, 2], [2, 6], [6, 8], [8, 9],
      [4, 5], [5, 9], [8, 1], [1, 9], [7, 8], [7, 6],
      [6, 10], [10, 2], [2, 11], [11, 4]
    ];
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    
    const isAnomaly = window.app?.aiAnalysis?.is_anomaly;
    const speedMultiplier = isAnomaly ? 3.5 : 1.0;
    
    this.angleX += 0.012 * speedMultiplier;
    this.angleY += 0.018 * speedMultiplier;
    this.angleZ += 0.007 * speedMultiplier;

    this.render();
  }

  _renderRing(radius, rotX, rotY, rotZ, color, alpha) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const segments = 36;
    const pts = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      let v = { x: Math.cos(theta) * radius, y: Math.sin(theta) * radius, z: 0 };
      v = Math3D.rotateX(v, rotX);
      v = Math3D.rotateY(v, rotY);
      v = Math3D.rotateZ(v, rotZ);
      pts.push(Math3D.project(v, w, h, 280, 280));
    }

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1.2;
    this.ctx.globalAlpha = alpha;
    this.ctx.beginPath();
    pts.forEach((p, idx) => {
      if (idx === 0) this.ctx.moveTo(p.x, p.y);
      else this.ctx.lineTo(p.x, p.y);
    });
    this.ctx.stroke();
    this.ctx.globalAlpha = 1.0;
  }

  render() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    const isAnomaly = window.app?.aiAnalysis?.is_anomaly;
    const color = isAnomaly ? '#ff0055' : (window.app?.aiAnalysis?.risk_level === 'MEDIUM' ? '#ffb703' : '#00ff9d');

    // 1. Outer Gyroscope Rings (3D Gimbal)
    this._renderRing(this.radius, this.angleX, 0, 0, color, 0.4);
    this._renderRing(this.radius * 0.9, 0, this.angleY, 0, color, 0.5);
    this._renderRing(this.radius * 0.8, 0, 0, this.angleZ, color, 0.6);

    // 2. Inner 3D Holographic Core (Icosahedron)
    const transformed = this.coreVerts.map(v => {
      let pt = Math3D.rotateX(v, this.angleX * 1.5);
      pt = Math3D.rotateY(pt, this.angleY * 1.5);
      pt = Math3D.rotateZ(pt, this.angleZ * 1.5);
      return Math3D.project(pt, w, h, 280, 280);
    });

    this.ctx.strokeStyle = isAnomaly ? 'rgba(255, 0, 85, 0.85)' : 'rgba(0, 240, 255, 0.8)';
    this.ctx.lineWidth = 1;
    this.coreEdges.forEach(([i, j]) => {
      const p1 = transformed[i];
      const p2 = transformed[j];
      if (p1.visible && p2.visible) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
      }
    });

    // 3. Central Energy Particle
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(w / 2, h / 2, 2.5, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

// ============================================================================
// 3. IMMERSIVE 3D LATENT SPACE PROJECTION (Screen 7 AI Anomaly Engine)
// ============================================================================
class LatentSpace3D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.angleY = 0.5;
    this.angleX = 0.35;
    this.targetAngleY = 0.5;
    this.targetAngleX = 0.35;
    this.zoom = 1.0;
    this.targetZoom = 1.0;
    this.autoRotate = true;
    this.isDragging = false;
    this.lastX = 0;
    this.lastY = 0;
    
    // Generate 60 nominal training baseline points in 3D latent space
    this.baselinePoints = [];
    for (let i = 0; i < 60; i++) {
      const r = Math.random() * 22 + 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      this.baselinePoints.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta) * 0.75,
        z: r * Math.cos(phi)
      });
    }

    this._bindEvents();
    this._animate();
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
    return this.autoRotate;
  }

  resetCamera() {
    this.targetAngleX = 0.35;
    this.targetAngleY = 0.5;
    this.targetZoom = 1.0;
    this.autoRotate = true;
  }

  _bindEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;
      this.targetAngleY += dx * 0.008;
      this.targetAngleX -= dy * 0.008;
      this.targetAngleX = Math.max(-1.2, Math.min(1.2, this.targetAngleX));
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Wheel zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      this.targetZoom = Math.max(0.6, Math.min(2.2, this.targetZoom + delta));
    }, { passive: false });

    // Mobile touch controls
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.autoRotate = false;
        this.lastX = e.touches[0].clientX;
        this.lastY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - this.lastX;
        const dy = e.touches[0].clientY - this.lastY;
        this.targetAngleY += dx * 0.008;
        this.targetAngleX -= dy * 0.008;
        this.targetAngleX = Math.max(-1.2, Math.min(1.2, this.targetAngleX));
        this.lastX = e.touches[0].clientX;
        this.lastY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    
    // Inertia damping
    this.angleX += (this.targetAngleX - this.angleX) * 0.08;
    this.angleY += (this.targetAngleY - this.angleY) * 0.08;
    this.zoom += (this.targetZoom - this.zoom) * 0.1;

    if (this.autoRotate && !this.isDragging) {
      this.targetAngleY += 0.004;
    }
    this.render();
  }

  _transformPoint(p) {
    const scaled = { x: p.x * this.zoom, y: p.y * this.zoom, z: p.z * this.zoom };
    let pt = Math3D.rotateX(scaled, this.angleX);
    pt = Math3D.rotateY(pt, this.angleY);
    return pt;
  }

  render() {
    if (!this.canvas || this.canvas.offsetParent === null) return;
    if (this.canvas.clientWidth > 0 && (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight)) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    }

    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    const isAnomaly = window.app?.aiAnalysis?.is_anomaly;

    // 1. Draw 3D Safety Manifold Bounding Sphere (μ + 3σ threshold envelope)
    const sphereRadius = 30;
    const ringSegments = 32;
    this.ctx.strokeStyle = isAnomaly ? 'rgba(255, 0, 85, 0.28)' : 'rgba(0, 255, 157, 0.22)';
    this.ctx.lineWidth = 1;

    // Equator Ring
    this.ctx.beginPath();
    for (let i = 0; i <= ringSegments; i++) {
      const theta = (i / ringSegments) * Math.PI * 2;
      const p = { x: Math.cos(theta) * sphereRadius, y: 0, z: Math.sin(theta) * sphereRadius };
      const proj = Math3D.project(this._transformPoint(p), w, h, 260, 260);
      if (i === 0) this.ctx.moveTo(proj.x, proj.y);
      else this.ctx.lineTo(proj.x, proj.y);
    }
    this.ctx.stroke();

    // Meridian Ring
    this.ctx.beginPath();
    for (let i = 0; i <= ringSegments; i++) {
      const theta = (i / ringSegments) * Math.PI * 2;
      const p = { x: 0, y: Math.cos(theta) * sphereRadius, z: Math.sin(theta) * sphereRadius };
      const proj = Math3D.project(this._transformPoint(p), w, h, 260, 260);
      if (i === 0) this.ctx.moveTo(proj.x, proj.y);
      else this.ctx.lineTo(proj.x, proj.y);
    }
    this.ctx.stroke();

    // Secondary Meridian Ring (45 degree offset)
    this.ctx.strokeStyle = isAnomaly ? 'rgba(255, 0, 85, 0.14)' : 'rgba(0, 240, 255, 0.14)';
    this.ctx.beginPath();
    for (let i = 0; i <= ringSegments; i++) {
      const theta = (i / ringSegments) * Math.PI * 2;
      const rad45 = Math.PI / 4;
      const p = { 
        x: Math.cos(theta) * sphereRadius * Math.sin(rad45), 
        y: Math.sin(theta) * sphereRadius, 
        z: Math.cos(theta) * sphereRadius * Math.cos(rad45) 
      };
      const proj = Math3D.project(this._transformPoint(p), w, h, 260, 260);
      if (i === 0) this.ctx.moveTo(proj.x, proj.y);
      else this.ctx.lineTo(proj.x, proj.y);
    }
    this.ctx.stroke();

    // 2. Draw 3D Coordinate Axes (Z1, Z2, Z3)
    const axisLen = 55;
    const axes = [
      { p: { x: axisLen, y: 0, z: 0 }, label: 'Z₁ (Kinetic)', color: 'rgba(0, 240, 255, 0.7)' },
      { p: { x: 0, y: axisLen, z: 0 }, label: 'Z₂ (Power/Temp)', color: 'rgba(255, 183, 3, 0.7)' },
      { p: { x: 0, y: 0, z: axisLen }, label: 'Z₃ (CAN/IMU)', color: 'rgba(157, 78, 221, 0.7)' }
    ];

    axes.forEach(ax => {
      const proj = Math3D.project(this._transformPoint(ax.p), w, h, 260, 260);
      const origin = Math3D.project(this._transformPoint({ x: 0, y: 0, z: 0 }), w, h, 260, 260);

      this.ctx.strokeStyle = ax.color;
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.ctx.moveTo(origin.x, origin.y);
      this.ctx.lineTo(proj.x, proj.y);
      this.ctx.stroke();

      this.ctx.font = '500 9px monospace';
      this.ctx.fillStyle = ax.color;
      this.ctx.fillText(ax.label, proj.x + 4, proj.y + 3);
    });

    // 3. Draw Baseline Nominal Cluster (Cyan dots inside sphere)
    this.baselinePoints.forEach(p => {
      const proj = Math3D.project(this._transformPoint(p), w, h, 260, 260);
      if (proj.visible) {
        this.ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
        this.ctx.beginPath();
        this.ctx.arc(proj.x, proj.y, 1.8 * this.zoom, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    // 4. Draw Active Ingested Sample (Current Latent Position)
    const t = Date.now() / 1000;
    const samplePos = isAnomaly 
      ? { x: 62 + Math.sin(t) * 4, y: 48 + Math.cos(t) * 3, z: -42 + Math.sin(t * 1.5) * 4 } // Flung far outside
      : { x: 8 + Math.sin(t) * 3, y: 6 + Math.cos(t * 0.8) * 2, z: 4 + Math.sin(t * 1.2) * 2 }; // Snug inside safe cluster

    const distFromOrigin = Math.hypot(samplePos.x, samplePos.y, samplePos.z).toFixed(1);

    // Update real-time HUD elements if present in DOM
    const z1El = document.getElementById('latent-hud-z1');
    const z2El = document.getElementById('latent-hud-z2');
    const z3El = document.getElementById('latent-hud-z3');
    const distEl = document.getElementById('latent-hud-dist');
    const stateEl = document.getElementById('latent-hud-state');

    if (z1El) z1El.textContent = (samplePos.x > 0 ? '+' : '') + samplePos.x.toFixed(1);
    if (z2El) z2El.textContent = (samplePos.y > 0 ? '+' : '') + samplePos.y.toFixed(1);
    if (z3El) z3El.textContent = (samplePos.z > 0 ? '+' : '') + samplePos.z.toFixed(1);
    if (distEl) distEl.textContent = `${distFromOrigin} (Safe ≤ 30.0)`;
    if (stateEl) {
      stateEl.textContent = isAnomaly ? 'ANOMALOUS OUTLIER' : 'INSIDE MANIFOLD';
      stateEl.style.color = isAnomaly ? '#ff0055' : '#00ff9d';
    }

    const proj = Math3D.project(this._transformPoint(samplePos), w, h, 260, 260);
    const origin = Math3D.project(this._transformPoint({ x: 0, y: 0, z: 0 }), w, h, 260, 260);

    // Vector line from origin
    this.ctx.strokeStyle = isAnomaly ? '#ff0055' : '#00ff9d';
    this.ctx.lineWidth = 1.6;
    this.ctx.beginPath();
    this.ctx.moveTo(origin.x, origin.y);
    this.ctx.lineTo(proj.x, proj.y);
    this.ctx.stroke();

    // Pulse dot and ring
    this.ctx.fillStyle = isAnomaly ? '#ff0055' : '#00ff9d';
    this.ctx.beginPath();
    this.ctx.arc(proj.x, proj.y, (isAnomaly ? 5 : 3.5) * this.zoom, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.strokeStyle = isAnomaly ? 'rgba(255,0,85,0.6)' : 'rgba(0,255,157,0.6)';
    this.ctx.beginPath();
    this.ctx.arc(proj.x, proj.y, ((isAnomaly ? 10 : 7) + Math.sin(t * 5) * 2) * this.zoom, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.font = '700 9px monospace';
    this.ctx.fillStyle = isAnomaly ? '#ff0055' : '#00ff9d';
    this.ctx.fillText(isAnomaly ? 'OUTLIER (MSE EXCEEDED)' : 'NOMINAL MANIFOLD', proj.x + 10, proj.y - 4);
  }
}

// Global 3D Initializer (Singleton Pattern)
window.initCyber3D = function() {
  const dashEvCanvas = document.getElementById('dash-ev-3d-canvas');
  if (dashEvCanvas && !window.dashEv3D) {
    window.dashEv3D = new EVVehicle3D('dash-ev-3d-canvas');
  }
  const evCanvas = document.getElementById('ev-3d-canvas');
  if (evCanvas && !window.evVehicle3D) {
    window.evVehicle3D = new EVVehicle3D('ev-3d-canvas');
  }
  const gyroCanvas = document.getElementById('gyro-3d-canvas');
  if (gyroCanvas && !window.gyroCore3D) {
    window.gyroCore3D = new GyroSecurityCore3D('gyro-3d-canvas');
  }
  const latentCanvas = document.getElementById('latent-3d-canvas');
  if (latentCanvas && !window.latentSpace3D) {
    window.latentSpace3D = new LatentSpace3D('latent-3d-canvas');
  }
};
