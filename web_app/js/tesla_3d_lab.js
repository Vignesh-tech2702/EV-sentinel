/**
 * EV-Sentinel: Ultra-Realistic 3D Tesla EV Laboratory & Adder-Based Resource Usage Engine
 * Built with Three.js, Extruded Aerodynamic Body Shell, PMREM Studio Environment Lighting,
 * PBR Automotive Clearcoat Lacquer, and Ripple-Carry Multi-Bit Digital Logic Processor.
 * 100% offline-ready, zero external dependencies, 60 FPS WebGL rendering.
 */

class AdderResourceCalculator {
  constructor(onUpdate) {
    this.onUpdate = onUpdate || (() => {});
    // 4-bit Binary Inputs: A3 A2 A1 A0, B3 B2 B1 B0
    this.inputA = [1, 0, 1, 0]; // 10 (decimal)
    this.inputB = [1, 0, 1, 1]; // 11 (decimal)
    this.state = {};
    this.calculate();
  }

  setBit(inputKey, bitIndex, val) {
    if (inputKey === 'A') {
      this.inputA[bitIndex] = val ? 1 : 0;
    } else if (inputKey === 'B') {
      this.inputB[bitIndex] = val ? 1 : 0;
    }
    this.calculate();
  }

  toggleBit(inputKey, bitIndex) {
    if (inputKey === 'A') {
      this.inputA[bitIndex] = this.inputA[bitIndex] === 1 ? 0 : 1;
    } else if (inputKey === 'B') {
      this.inputB[bitIndex] = this.inputB[bitIndex] === 1 ? 0 : 1;
    }
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.calculate();
  }

  calculate() {
    // Multi-bit ripple carry adder using Full Adder / Half Adder logic
    const a = [...this.inputA].reverse(); // a[0] = bit0
    const b = [...this.inputB].reverse();
    
    const sumBits = [];
    const carryBits = [0]; // cin for bit0 is 0
    const faSteps = [];

    for (let i = 0; i < 4; i++) {
      const bitA = a[i];
      const bitB = b[i];
      const cin = carryBits[i];

      // Full Adder Logic:
      // Sum = A ^ B ^ Cin
      // Cout = (A & B) | (Cin & (A ^ B))
      const axorb = bitA ^ bitB;
      const sum = axorb ^ cin;
      const cout = (bitA & bitB) | (cin & axorb);

      sumBits.push(sum);
      carryBits.push(cout);

      faSteps.push({
        bit: i,
        a: bitA,
        b: bitB,
        cin: cin,
        sum: sum,
        cout: cout
      });
    }

    // 5-bit final output with final carry-out
    const finalCarry = carryBits[4];
    sumBits.push(finalCarry);
    const finalOutputBits = [...sumBits].reverse(); // [C4, S3, S2, S1, S0]
    const binaryString = finalOutputBits.join('');
    const decimalResult = parseInt(binaryString, 2); // 0 to 30

    // Derive EV Resource Usage Metrics
    const maxDecimal = 30;
    const resourceUsagePercent = Math.min(100, Math.round((decimalResult / maxDecimal) * 100));

    // Power Consumption: 8.0 kW to 42.0 kW
    const powerKw = (8.0 + (resourceUsagePercent / 100) * 34.0).toFixed(1);

    // Energy Used: 10.0 kWh to 30.0 kWh
    const energyKwh = (10.0 + (resourceUsagePercent / 100) * 20.0).toFixed(1);

    // Battery Level: 100% down to 18% under high simulated drain
    const batteryLevel = Math.max(18, 100 - Math.round(resourceUsagePercent * 0.32));

    // Range: based on battery
    const rangeKm = Math.round(480 * (batteryLevel / 100));

    // Speed: 20 km/h to 125 km/h
    const speedKmh = Math.round(20 + (resourceUsagePercent / 100) * 105);

    // System Status & Alert Level
    let status = 'NORMAL';
    let statusLevel = 'low';
    let statusColor = '#00ff9d';

    if (resourceUsagePercent < 35) {
      status = 'NORMAL';
      statusLevel = 'low';
      statusColor = '#00ff9d';
    } else if (resourceUsagePercent < 70) {
      status = 'OPTIMAL';
      statusLevel = 'medium';
      statusColor = '#00f0ff';
    } else if (resourceUsagePercent < 90) {
      status = 'HIGH LOAD';
      statusLevel = 'high';
      statusColor = '#ffb703';
    } else {
      status = 'CRITICAL OVERLOAD';
      statusLevel = 'critical';
      statusColor = '#ff0055';
    }

    this.state = {
      inputA: this.inputA,
      inputB: this.inputB,
      decimalA: parseInt(this.inputA.join(''), 2),
      decimalB: parseInt(this.inputB.join(''), 2),
      outputBinary: binaryString,
      decimalResult: decimalResult,
      resourceUsage: resourceUsagePercent,
      batteryLevel: batteryLevel,
      powerConsumption: powerKw,
      energyUsed: energyKwh,
      rangeKm: rangeKm,
      speedKmh: speedKmh,
      status: status,
      statusLevel: statusLevel,
      statusColor: statusColor,
      steps: faSteps
    };

    this.onUpdate(this.state);
  }
}

// ============================================================================
// ULTRA-REALISTIC THREE.JS TESLA 3D VEHICLE LABORATORY
// ============================================================================
class Tesla3DLab {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.width = this.container.clientWidth || 600;
    this.height = this.container.clientHeight || 420;

    this.currentView = 'exterior';
    this.energyFlowEnabled = false;
    this.autoRotate = true;
    this.headlightsOn = true;
    this.lastInteractionTime = Date.now();
    this.wheels = [];
    this.rotAngle = 0;
    this.wheelSpeed = 0.03;
    this.flowSpeed = 1.0;

    // Animated Real EV Physical Parts State
    this.chargePortOpen = false;
    this.chargePortAngle = 0;
    this.targetChargePortAngle = 0;

    this.frunkOpen = false;
    this.frunkAngle = 0;
    this.targetFrunkAngle = 0;

    this.trunkOpen = false;
    this.trunkAngle = 0;
    this.targetTrunkAngle = 0;

    this.spoilerDeployed = false;
    this.spoilerLift = 0;
    this.targetSpoilerLift = 0;
    this.spoilerPitch = 0;
    this.targetSpoilerPitch = 0;

    this.suspensionMode = 1; // 0: Sport Low, 1: Standard, 2: High Clearance
    this.suspensionY = 0;
    this.targetSuspensionY = 0;

    this.steerAngle = 0;
    this.motorRotorAngle = 0;
    this.showcaseActive = false;

    // Threat & Cyber Attack Red Signal State
    this.threatSignalActive = false;
    this.threatData = {
      attackType: 'NORMAL',
      riskScore: 0,
      riskLevel: 'LOW',
      dominantChannel: ''
    };
    this.threatPulseTimer = 0;

    // Hotspot Data
    this.hotspotData = {
      battery: {
        title: "BATTERY PACK",
        specs: "82.0 kWh Structural 4680",
        rating: "400V High-Current Architecture",
        purpose: "Stores and delivers electrical energy to the dual traction inverters with micro-channel liquid thermal cooling.",
        impact: "High (Base Voltage Source)",
        connection: "Adder multi-bit output directly computes cell discharge rate and high-voltage power demand."
      },
      motor: {
        title: "DUAL TRACTION MOTORS",
        specs: "Front PMSM 150 kW • Rear SiC 210 kW",
        rating: "Combined 360 kW (490 hp)",
        purpose: "Converts high-voltage DC power into immediate mechanical torque with millisecond traction management.",
        impact: "High (Kinetic Power Demand)",
        connection: "Adder binary sum sets rotational wheel speed and inverter switching frequency."
      },
      inverter: {
        title: "SiC POWER INVERTER",
        specs: "450A Peak Current Capacity",
        rating: "98.8% Inversion Efficiency",
        purpose: "Converts 400V DC battery power to variable-frequency 3-phase AC power with ultra-low thermal dissipation.",
        impact: "Medium (Loss & Thermal Load)",
        connection: "Adder result modulates PWM duty cycle and thermal loss monitoring."
      },
      charge_port: {
        title: "TESLA NACS CHARGING PORT",
        specs: "250 kW DC Peak • 48A AC Level 2",
        rating: "CCS / NACS Dual Protocol",
        purpose: "Fast-charging interface with integrated thermal sensors, motorized door, and automated safety lock.",
        impact: "Medium (Input Energy Rate)",
        connection: "Adder state computes simulated session energy delivery and thermal rise."
      },
      wheels: {
        title: "19\" AERO SPORT WHEELS",
        specs: "Directional Turbine Alloys",
        rating: "Pirelli P-Zero Elect / 235/40R19",
        purpose: "Provides aerodynamic efficiency, wet/dry lateral grip, and regenerative braking deceleration.",
        impact: "Medium (Road Friction & Regen)",
        connection: "Wheel rotational speed in 3D scene scales dynamically with Adder output."
      },
      dashboard: {
        title: "15.4\" CENTER TOUCHSCREEN",
        specs: "2560x1600 AMD Ryzen MCU3",
        rating: "Digital Cockpit & Autonomous Gateway",
        purpose: "Primary telemetry instrument cluster displaying real-time speed, battery, and AI security status.",
        impact: "Low (HMI Display)",
        connection: "Cockpit instrument screen dynamically displays Adder decimal output and status in real-time."
      },
      energy_system: {
        title: "ENERGY MANAGEMENT SYSTEM (EMS)",
        specs: "BMS Dual-Core Gateway ASIL-D",
        rating: "ISO 26262 ASIL-D Verified",
        purpose: "Autonomous edge supervisor managing cell balancing, current limits, and zero-day threat isolation.",
        impact: "Critical (System Safety)",
        connection: "Evaluates Multi-Bit Adder result to detect abnormal power or current surges."
      }
    };

    this._initThree();
    this._createStudioEnvironment();
    this._buildShowroom();
    this._buildTeslaModel();
    this._buildThreatSignalSystem();
    this._buildEnergyFlow();
    this._buildHotspotMarkers();
    this._bindEvents();
    this._animate();
  }

  _initThree() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070709);
    this.scene.fog = new THREE.FogExp2(0x070709, 0.035);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 100);
    this.camera.position.set(4.8, 2.1, 5.5);
    this.targetCameraPos = this.camera.position.clone();
    this.targetLookAt = new THREE.Vector3(0, 0.6, 0);

    // 3. Renderer with ACES Filmic Tone Mapping
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // Attach to DOM
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    if (window.THREE && window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.02; // stay above floor
      this.controls.minDistance = 1.2;
      this.controls.maxDistance = 14;
      this.controls.target.copy(this.targetLookAt);
    }
  }

  // Generate Photorealistic Studio Environment Map for Specular Reflections
  _createStudioEnvironment() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Studio cyclorama gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
    bgGrad.addColorStop(0, '#0a0d13');
    bgGrad.addColorStop(0.4, '#151922');
    bgGrad.addColorStop(0.6, '#0f1218');
    bgGrad.addColorStop(1, '#050608');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Overhead Center Lightbank (softbox for roof & hood reflections)
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 45;
    ctx.fillRect(256, 35, 512, 110);
    ctx.restore();

    // Side Horizon Softbox Strips (crisp shoulder line highlights)
    const leftGrad = ctx.createLinearGradient(0, 170, 240, 260);
    leftGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    leftGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = leftGrad;
    ctx.fillRect(0, 170, 240, 90);

    const rightGrad = ctx.createLinearGradient(1024, 170, 784, 260);
    rightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    rightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = rightGrad;
    ctx.fillRect(784, 170, 240, 90);

    // Subtle Cyan Accent Light Strip
    const cyanGrad = ctx.createLinearGradient(320, 0, 704, 0);
    cyanGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
    cyanGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.8)');
    cyanGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = cyanGrad;
    ctx.fillRect(320, 165, 384, 35);

    const envTexture = new THREE.CanvasTexture(canvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;

    if (THREE.PMREMGenerator) {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      pmrem.compileEquirectangularShader();
      const envMap = pmrem.fromEquirectangular(envTexture).texture;
      this.scene.environment = envMap;
      envTexture.dispose();
      pmrem.dispose();
    } else {
      this.scene.environment = envTexture;
    }
  }

  _buildShowroom() {
    // 1. Polished Reflective Studio Ground Plane
    const planeGeo = new THREE.PlaneGeometry(32, 32);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x080a0e,
      roughness: 0.32,
      metalness: 0.45
    });
    this.ground = new THREE.Mesh(planeGeo, planeMat);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -0.005;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);

    // 2. Baked Soft Ambient Occlusion Contact Shadow Plate
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 512;
    shadowCanvas.height = 512;
    const sCtx = shadowCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(256, 256, 60, 256, 256, 240);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.92)');
    sGrad.addColorStop(0.45, 'rgba(0, 0, 0, 0.65)');
    sGrad.addColorStop(0.75, 'rgba(0, 0, 0, 0.2)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 512, 512);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(2.7, 5.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.005;
    this.scene.add(contactShadow);

    // 3. Cyber Showroom Circular Pedestal Rings
    for (let r = 2.4; r <= 4.4; r += 1.0) {
      const ringGeo = new THREE.RingGeometry(r - 0.012, r + 0.012, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.008;
      this.scene.add(ring);
    }

    // 4. Subtle Studio Grid Helper
    const grid = new THREE.GridHelper(22, 44, 0x1f2633, 0x0d1117);
    grid.position.y = 0.002;
    this.scene.add(grid);

    // 5. Studio Lighting Rig
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);

    // Top Softbox Bank (Directional)
    this.topLight = new THREE.DirectionalLight(0xffffff, 1.6);
    this.topLight.position.set(0, 9, 0);
    this.scene.add(this.topLight);

    // Key Light with Soft PCF Shadows
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.keyLight.position.set(5.5, 7, 5.5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 25;
    this.keyLight.shadow.camera.left = -4;
    this.keyLight.shadow.camera.right = 4;
    this.keyLight.shadow.camera.top = 4;
    this.keyLight.shadow.camera.bottom = -4;
    this.keyLight.shadow.bias = -0.0003;
    this.scene.add(this.keyLight);

    // Cool Fill Light
    const fillLight = new THREE.DirectionalLight(0x00f0ff, 0.85);
    fillLight.position.set(-6, 4, -4);
    this.scene.add(fillLight);

    // Warm Rim Accent Light
    const rimLight = new THREE.DirectionalLight(0xffb703, 0.65);
    rimLight.position.set(0, 4.5, -6.5);
    this.scene.add(rimLight);

    // Dynamic Underglow Light
    this.underglow = new THREE.PointLight(0x00f0ff, 1.8, 4.5);
    this.underglow.position.set(0, 0.22, 0);
    this.scene.add(this.underglow);

    // Headlight Spotlights projecting road beams
    this.headlightSpotL = new THREE.SpotLight(0xffffff, 2.5, 9, Math.PI / 6, 0.5, 1.2);
    this.headlightSpotL.position.set(-0.7, 0.58, 2.15);
    this.headlightSpotL.target.position.set(-0.9, 0, 7.5);
    this.scene.add(this.headlightSpotL);
    this.scene.add(this.headlightSpotL.target);

    this.headlightSpotR = new THREE.SpotLight(0xffffff, 2.5, 9, Math.PI / 6, 0.5, 1.2);
    this.headlightSpotR.position.set(0.7, 0.58, 2.15);
    this.headlightSpotR.target.position.set(0.9, 0, 7.5);
    this.scene.add(this.headlightSpotR);
    this.scene.add(this.headlightSpotR.target);
  }

  _buildTeslaModel() {
    this.vehicleGroup = new THREE.Group();

    // Pneumatic Air Suspension Chassis Group (moves vertically relative to wheels)
    this.chassisGroup = new THREE.Group();
    this.vehicleGroup.add(this.chassisGroup);

    // ==========================================
    // 1. AUTOMOTIVE PBR MATERIALS (Quicksilver Metallic, Chrome & EV Tech)
    // ==========================================
    // Factory Quicksilver Metallic (Authentic High-End Electric Vehicle Finish)
    this.bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc4cdd9, // Liquid Quicksilver Metallic
      metalness: 0.95,
      roughness: 0.07,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 1.0,
      envMapIntensity: 2.3
    });

    // Panoramic Automotive Glass with High Specular Transmission & Deep UV Tint
    this.glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x06090e,
      metalness: 0.35,
      roughness: 0.02,
      transmission: 0.88,
      transparent: true,
      opacity: 0.65,
      reflectivity: 1.0,
      envMapIntensity: 2.1
    });

    // Mirror Polish High-Gloss Chrome
    this.chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.03,
      envMapIntensity: 2.6
    });

    // Polished Silver & Brushed Aluminum Accent Trim
    this.silverTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5eaf2,
      metalness: 0.98,
      roughness: 0.07,
      envMapIntensity: 2.2
    });

    // Chrome Internal Reflector Bowl for Projector Headlights
    this.reflectorChromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.02,
      envMapIntensity: 2.8
    });

    // Gloss Black Trim (B-pillars, camera lenses, lower diffuser base)
    this.blackGlossMaterial = new THREE.MeshStandardMaterial({
      color: 0x090a0d,
      metalness: 0.8,
      roughness: 0.1,
      envMapIntensity: 1.5
    });

    // Dark Cabin Interior Upholstery
    this.darkInteriorMaterial = new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.75,
      metalness: 0.1
    });

    // Dashboard Wood Accent Bar
    this.woodTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x423122,
      roughness: 0.4,
      metalness: 0.15
    });

    // Brembo Performance Red Brake Calipers
    this.brakeCaliperMaterial = new THREE.MeshStandardMaterial({
      color: 0xdf1622,
      metalness: 0.5,
      roughness: 0.22
    });

    // Drilled Stainless Steel Metallic Brake Rotor Steel
    this.brakeRotorMaterial = new THREE.MeshStandardMaterial({
      color: 0xc4cbd5,
      metalness: 0.97,
      roughness: 0.16,
      envMapIntensity: 1.6
    });

    // Tire Rubber
    this.wheelTireMaterial = new THREE.MeshStandardMaterial({
      color: 0x141518,
      roughness: 0.85,
      metalness: 0.05
    });

    // 19" Sport Rim Polished Silver Turbine Alloy
    this.rimMachineMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f6fa,
      metalness: 0.99,
      roughness: 0.05,
      envMapIntensity: 2.5
    });

    // 19" Sport Rim Gunmetal/Satin Inner Spoke Insets
    this.rimPocketMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d434f,
      metalness: 0.92,
      roughness: 0.2
    });

    // Headlight Polycarbonate Outer Lens
    this.headlightLensMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      transparent: true,
      opacity: 0.7,
      roughness: 0.04,
      metalness: 0.1
    });

    // Headlight DRL Daytime Running LED Ribbon
    this.drlMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.2
    });

    // Headlight Projector Optic Spheres
    this.projectorMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 2.8
    });

    // Wraparound Ruby Red OLED Taillights
    this.taillightMaterial = new THREE.MeshStandardMaterial({
      color: 0x990015,
      emissive: 0xff002b,
      emissiveIntensity: 2.4
    });

    // High-Conductivity Electrolytic Copper for Electric Motor Rotors & High-Voltage Busbars
    this.copperMaterial = new THREE.MeshStandardMaterial({
      color: 0xda7c44,
      metalness: 0.94,
      roughness: 0.22,
      envMapIntensity: 2.0
    });

    // Woven Carbon Fiber Material for Aerodynamic Splitter & Active Wing
    this.carbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x181a1f,
      roughness: 0.35,
      metalness: 0.85
    });

    // High-Voltage Safety Orange Cable Conduit
    this.hvCableMaterial = new THREE.MeshStandardMaterial({
      color: 0xff5e00,
      roughness: 0.45,
      metalness: 0.1
    });

    // ==========================================
    // 2. EXTRUDED CONTINUOUS MONOCOQUE FUSELAGE
    // ==========================================
    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(2.26, 0.22);
    bodyShape.quadraticCurveTo(2.34, 0.44, 2.24, 0.58); // Front ducktail nose curve
    bodyShape.lineTo(1.18, 0.72); // Hood slope
    bodyShape.lineTo(-1.86, 0.84); // Beltline
    bodyShape.quadraticCurveTo(-2.18, 0.74, -2.14, 0.28); // Rear bumper taper
    bodyShape.lineTo(-1.76, 0.28);
    bodyShape.absarc(-1.35, 0.35, 0.42, Math.PI, 0, true); // Rear wheel arch cutout
    bodyShape.lineTo(0.93, 0.28);
    bodyShape.absarc(1.35, 0.35, 0.42, Math.PI, 0, true); // Front wheel arch cutout
    bodyShape.lineTo(2.26, 0.22);

    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
      steps: 1,
      depth: 1.76,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.09,
      bevelSegments: 5
    });
    bodyGeo.center();
    bodyGeo.rotateY(Math.PI / 2);
    bodyGeo.computeVertexNormals();

    const mainBody = new THREE.Mesh(bodyGeo, this.bodyMaterial);
    mainBody.position.y = 0.46;
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    this.chassisGroup.add(mainBody);

    // ==========================================
    // 3. TAPERED CABIN GREENHOUSE & GLASS CANOPY
    // ==========================================
    const cabinShape = new THREE.Shape();
    cabinShape.moveTo(1.02, 0.70);
    cabinShape.quadraticCurveTo(0.62, 0.96, 0.26, 1.35); // Windshield curve
    cabinShape.quadraticCurveTo(-0.25, 1.42, -0.85, 1.34); // Roofline arc
    cabinShape.quadraticCurveTo(-1.45, 1.16, -1.82, 0.82); // Rear fastback glass
    cabinShape.lineTo(1.02, 0.70);

    const cabinGeo = new THREE.ExtrudeGeometry(cabinShape, {
      steps: 1,
      depth: 1.44,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.07,
      bevelSegments: 5
    });
    cabinGeo.center();
    cabinGeo.rotateY(Math.PI / 2);
    cabinGeo.computeVertexNormals();

    const glassCabin = new THREE.Mesh(cabinGeo, this.glassMaterial);
    glassCabin.position.set(0, 0.88, -0.2);
    glassCabin.castShadow = true;
    this.chassisGroup.add(glassCabin);

    // Chrome Window Perimeter Mouldings (Upper Arch + Lower Beltline DLO Trim)
    const chromeTrimUpperL = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.035, 2.18), this.chromeMaterial);
    chromeTrimUpperL.position.set(-0.73, 1.14, -0.15);
    const chromeTrimLowerL = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.03, 2.26), this.chromeMaterial);
    chromeTrimLowerL.position.set(-0.75, 0.72, -0.15);

    const chromeTrimUpperR = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.035, 2.18), this.chromeMaterial);
    chromeTrimUpperR.position.set(0.73, 1.14, -0.15);
    const chromeTrimLowerR = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.03, 2.26), this.chromeMaterial);
    chromeTrimLowerR.position.set(0.75, 0.72, -0.15);

    this.chassisGroup.add(chromeTrimUpperL, chromeTrimLowerL, chromeTrimUpperR, chromeTrimLowerR);

    // Satin Black B-Pillars with Autopilot camera glass apertures
    const bPillarL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.48, 0.16), this.blackGlossMaterial);
    bPillarL.position.set(-0.73, 0.88, 0.05);
    const bPillarR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.48, 0.16), this.blackGlossMaterial);
    bPillarR.position.set(0.73, 0.88, 0.05);
    this.chassisGroup.add(bPillarL, bPillarR);

    // ==========================================
    // 4. FLARED WHEEL ARCHES & AERO ROCKERS
    // ==========================================
    const archCoords = [
      { x: -0.92, z: 1.35 }, { x: 0.92, z: 1.35 },
      { x: -0.92, z: -1.35 }, { x: 0.92, z: -1.35 }
    ];
    archCoords.forEach(ac => {
      const flareGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.1, 24, 1, true, 0, Math.PI);
      const flareMesh = new THREE.Mesh(flareGeo, this.bodyMaterial);
      flareMesh.rotation.z = Math.PI / 2;
      flareMesh.position.set(ac.x, 0.36, ac.z);
      this.chassisGroup.add(flareMesh);
    });

    // Aerodynamic Sculpted Rocker Panels with Silver Runner Blades
    const skirtL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 1.8), this.blackGlossMaterial);
    skirtL.position.set(-0.92, 0.34, 0);
    const skirtBladeL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.035, 1.82), this.silverTrimMaterial);
    skirtBladeL.position.set(-0.95, 0.30, 0);

    const skirtR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 1.8), this.blackGlossMaterial);
    skirtR.position.set(0.92, 0.34, 0);
    const skirtBladeR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.035, 1.82), this.silverTrimMaterial);
    skirtBladeR.position.set(0.95, 0.30, 0);

    this.chassisGroup.add(skirtL, skirtBladeL, skirtR, skirtBladeR);

    // Front Aerodynamic Chin Splitter with Silver Winglets & Cooling Mouth
    const splitter = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.2), this.blackGlossMaterial);
    splitter.position.set(0, 0.28, 2.2);
    const splitterLipSilver = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.025, 0.22), this.silverTrimMaterial);
    splitterLipSilver.position.set(0, 0.25, 2.22);

    const intakeTrimL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.05, 0.03), this.silverTrimMaterial);
    intakeTrimL.position.set(-0.64, 0.34, 2.23);
    const intakeTrimR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.05, 0.03), this.silverTrimMaterial);
    intakeTrimR.position.set(0.64, 0.34, 2.23);

    const radMouth = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.05), this.darkInteriorMaterial);
    radMouth.position.set(0, 0.34, 2.22);
    this.chassisGroup.add(splitter, splitterLipSilver, intakeTrimL, intakeTrimR, radMouth);

    // Rear Diffuser with Silver Aero Strakes & Chrome Plate Bar
    const rearPlateBar = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.025, 0.04), this.chromeMaterial);
    rearPlateBar.position.set(0, 0.54, -2.15);

    const rearDiffuser = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.14, 0.22), this.blackGlossMaterial);
    rearDiffuser.position.set(0, 0.34, -2.12);

    const rearDiffBladeL = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.12, 0.24), this.silverTrimMaterial);
    rearDiffBladeL.position.set(-0.42, 0.32, -2.14);
    const rearDiffBladeR = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.12, 0.24), this.silverTrimMaterial);
    rearDiffBladeR.position.set(0.42, 0.32, -2.14);

    this.chassisGroup.add(rearPlateBar, rearDiffuser, rearDiffBladeL, rearDiffBladeR);

    // Flush Tesla Door Handles in Polished Mirror Chrome
    const handlePositions = [
      { x: -0.935, y: 0.62, z: 0.5 }, { x: 0.935, y: 0.62, z: 0.5 },
      { x: -0.935, y: 0.62, z: -0.45 }, { x: 0.935, y: 0.62, z: -0.45 }
    ];
    handlePositions.forEach(hp => {
      const hMesh = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.04, 0.16), this.chromeMaterial);
      hMesh.position.set(hp.x, hp.y, hp.z);
      this.chassisGroup.add(hMesh);
    });

    // Autopilot Side Repeater Camera Pods in Polished Chrome with Amber Lenses
    const repL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.06, 0.16), this.chromeMaterial);
    repL.position.set(-0.935, 0.62, 0.95);
    const repAmberL = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.02, 0.05), new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 1.4 }));
    repAmberL.position.set(-0.94, 0.62, 0.95);

    const repR = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.06, 0.16), this.chromeMaterial);
    repR.position.set(0.935, 0.62, 0.95);
    const repAmberR = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.02, 0.05), new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 1.4 }));
    repAmberR.position.set(0.94, 0.62, 0.95);

    this.chassisGroup.add(repL, repAmberL, repR, repAmberR);

    // Aerodynamic Dual-Tone Side Mirrors with Chrome Stems & Real Mirror Glass
    [-1, 1].forEach(side => {
      const mGroup = new THREE.Group();
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.12), this.chromeMaterial);
      stem.rotation.z = side * -0.45;
      stem.position.set(side * 0.95, 0.78, 0.78);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.09, 0.12), this.bodyMaterial);
      cap.position.set(side * 1.05, 0.82, 0.78);
      cap.rotation.y = side * -0.15;
      const glassFace = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.07), this.chromeMaterial);
      glassFace.position.set(side * 1.05, 0.82, 0.72);
      glassFace.rotation.y = Math.PI;
      mGroup.add(stem, cap, glassFace);
      this.chassisGroup.add(mGroup);
    });

    // ==========================================
    // 5. 19" SILVER TURBINE SPORT WHEELS & ARTICULATED STEERING KNUCKLES
    // ==========================================
    const wheelPositions = [
      { x: -0.92, y: 0.35, z: 1.35, isLeft: true, isFront: true },
      { x: 0.92, y: 0.35, z: 1.35, isLeft: false, isFront: true },
      { x: -0.92, y: 0.35, z: -1.35, isLeft: true, isFront: false },
      { x: 0.92, y: 0.35, z: -1.35, isLeft: false, isFront: false }
    ];

    // Front Steering Knuckle Groups (pivot around Y axis for steering)
    this.frontLeftSteerGroup = new THREE.Group();
    this.frontLeftSteerGroup.position.set(-0.92, 0.35, 1.35);
    this.vehicleGroup.add(this.frontLeftSteerGroup);

    this.frontRightSteerGroup = new THREE.Group();
    this.frontRightSteerGroup.position.set(0.92, 0.35, 1.35);
    this.vehicleGroup.add(this.frontRightSteerGroup);

    // Front Steering Rack & Metallic Tie Rods
    const steerRack = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 1.56, 12), this.chromeMaterial);
    steerRack.rotation.z = Math.PI / 2;
    steerRack.position.set(0, 0.35, 1.35);
    this.vehicleGroup.add(steerRack);

    this.wheels = [];
    wheelPositions.forEach((wp) => {
      const wGroup = new THREE.Group();
      if (!wp.isFront) {
        wGroup.position.set(wp.x, wp.y, wp.z);
      }

      // Rubber Tire with Rounded Shoulders
      const tireGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.24, 32);
      const tire = new THREE.Mesh(tireGeo, this.wheelTireMaterial);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wGroup.add(tire);

      // 19" Silver Alloy Rim Outer Barrel & Polished Lip
      const rimLipGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.246, 24);
      const rimLip = new THREE.Mesh(rimLipGeo, this.rimMachineMaterial);
      rimLip.rotation.z = Math.PI / 2;
      wGroup.add(rimLip);

      // 5-Double-Spoke Silver Turbine Blades
      for (let s = 0; s < 5; s++) {
        const ang = (s / 5) * Math.PI * 2;
        const spokeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.44, 0.249), this.rimMachineMaterial);
        spokeMesh.rotation.x = ang;
        const spokePocket = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.38, 0.244), this.rimPocketMaterial);
        spokePocket.rotation.x = ang;
        wGroup.add(spokeMesh, spokePocket);
      }

      // Center Hub Cap with Chrome Tesla Logo Disc
      const hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.252, 16), this.blackGlossMaterial);
      hubCap.rotation.z = Math.PI / 2;
      wGroup.add(hubCap);

      const badgeDisc = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), this.chromeMaterial);
      badgeDisc.rotation.y = wp.isLeft ? -Math.PI / 2 : Math.PI / 2;
      badgeDisc.position.x = wp.isLeft ? -0.128 : 0.128;
      wGroup.add(badgeDisc);

      // 5 Chrome Wheel Lug Nuts
      for (let ln = 0; ln < 5; ln++) {
        const lang = (ln / 5) * Math.PI * 2;
        const lug = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.02, 8), this.chromeMaterial);
        lug.rotation.z = Math.PI / 2;
        lug.position.set(wp.isLeft ? -0.127 : 0.127, Math.sin(lang) * 0.055, Math.cos(lang) * 0.055);
        wGroup.add(lug);
      }

      // Cross-Drilled Metallic Brake Disc Rotor
      const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.04, 24), this.brakeRotorMaterial);
      rotor.rotation.z = Math.PI / 2;
      rotor.position.x = wp.isLeft ? 0.05 : -0.05;
      wGroup.add(rotor);

      // Tesla Performance Red Brembo Brake Caliper
      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.11), this.brakeCaliperMaterial);
      caliper.position.set(wp.isLeft ? 0.05 : -0.05, 0.11, 0.08);
      caliper.rotation.x = -0.3;
      wGroup.add(caliper);

      if (wp.isFront) {
        if (wp.isLeft) {
          this.frontLeftSteerGroup.add(wGroup);
        } else {
          this.frontRightSteerGroup.add(wGroup);
        }
      } else {
        this.vehicleGroup.add(wGroup);
      }
      this.wheels.push(wGroup);
    });

    // ==========================================
    // 6. HEADLIGHTS & WRAPAROUND TAILLIGHTS
    // ==========================================
    const hlGroup = new THREE.Group();

    // Left Headlight
    const hlHousingL = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.1, 0.18), this.blackGlossMaterial);
    hlHousingL.position.set(-0.72, 0.58, 2.08);
    hlHousingL.rotation.y = 0.22;
    const hlReflectorL = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.085, 0.02), this.reflectorChromeMaterial);
    hlReflectorL.position.set(-0.72, 0.58, 2.12);
    hlReflectorL.rotation.y = 0.22;
    const hlLensL = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.11, 0.02), this.headlightLensMaterial);
    hlLensL.position.set(-0.72, 0.58, 2.18);
    hlLensL.rotation.y = 0.22;
    const drlL = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.025, 0.03), this.drlMaterial);
    drlL.position.set(-0.72, 0.62, 2.17);
    drlL.rotation.y = 0.22;
    const projL1 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 16), this.projectorMaterial);
    projL1.position.set(-0.64, 0.58, 2.14);
    const projBezelL1 = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.006, 8, 16), this.chromeMaterial);
    projBezelL1.position.set(-0.64, 0.58, 2.15);
    const projL2 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 16), this.projectorMaterial);
    projL2.position.set(-0.78, 0.58, 2.11);
    const projBezelL2 = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.006, 8, 16), this.chromeMaterial);
    projBezelL2.position.set(-0.78, 0.58, 2.12);

    // Right Headlight
    const hlHousingR = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.1, 0.18), this.blackGlossMaterial);
    hlHousingR.position.set(0.72, 0.58, 2.08);
    hlHousingR.rotation.y = -0.22;
    const hlReflectorR = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.085, 0.02), this.reflectorChromeMaterial);
    hlReflectorR.position.set(0.72, 0.58, 2.12);
    hlReflectorR.rotation.y = -0.22;
    const hlLensR = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.11, 0.02), this.headlightLensMaterial);
    hlLensR.position.set(0.72, 0.58, 2.18);
    hlLensR.rotation.y = -0.22;
    const drlR = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.025, 0.03), this.drlMaterial);
    drlR.position.set(0.72, 0.62, 2.17);
    drlR.rotation.y = -0.22;
    const projR1 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 16), this.projectorMaterial);
    projR1.position.set(0.64, 0.58, 2.14);
    const projBezelR1 = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.006, 8, 16), this.chromeMaterial);
    projBezelR1.position.set(0.64, 0.58, 2.15);
    const projR2 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 16), this.projectorMaterial);
    projR2.position.set(0.78, 0.58, 2.11);
    const projBezelR2 = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.006, 8, 16), this.chromeMaterial);
    projBezelR2.position.set(0.78, 0.58, 2.12);

    hlGroup.add(hlHousingL, hlReflectorL, hlLensL, drlL, projL1, projBezelL1, projL2, projBezelL2,
                hlHousingR, hlReflectorR, hlLensR, drlR, projR1, projBezelR1, projR2, projBezelR2);
    this.headlightGroup = hlGroup;
    this.chassisGroup.add(hlGroup);

    // Wraparound C-Shaped Ruby Red LED Taillights
    const tlGroup = new THREE.Group();
    const tlMain = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.075, 0.09), this.taillightMaterial);
    tlMain.position.set(0, 0.73, -2.14);
    const tlCornerL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.16), this.taillightMaterial);
    tlCornerL.position.set(-0.84, 0.72, -2.06);
    const tlCornerR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.16), this.taillightMaterial);
    tlCornerR.position.set(0.84, 0.72, -2.06);
    tlGroup.add(tlMain, tlCornerL, tlCornerR);
    this.taillightGroup = tlGroup;
    this.chassisGroup.add(tlGroup);

    // ==========================================
    // 7. MINIMALIST COCKPIT INTERIOR & SYNCHRONIZED YOKE
    // ==========================================
    const interiorGroup = new THREE.Group();

    // Dashboard Shelf with Wood Trim
    const dashShelf = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.14, 0.42), this.darkInteriorMaterial);
    dashShelf.position.set(0, 0.76, 0.65);
    const woodTrim = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.035, 0.04), this.woodTrimMaterial);
    woodTrim.position.set(0, 0.78, 0.84);
    interiorGroup.add(dashShelf, woodTrim);

    // Front Bucket Seats
    [-0.38, 0.38].forEach(sx => {
      const seatBottom = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.14, 0.52), this.darkInteriorMaterial);
      seatBottom.position.set(sx, 0.44, -0.15);
      const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.56, 0.12), this.darkInteriorMaterial);
      seatBack.position.set(sx, 0.72, -0.38);
      seatBack.rotation.x = 0.15;
      const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.18, 0.09), this.darkInteriorMaterial);
      headrest.position.set(sx, 1.05, -0.44);
      interiorGroup.add(seatBottom, seatBack, headrest);
    });

    // Center Console
    const consoleBox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.35, 1.1), this.darkInteriorMaterial);
    consoleBox.position.set(0, 0.48, 0.05);
    interiorGroup.add(consoleBox);

    // Tesla Steering Yoke with Scroll Dials (Rotates dynamically with front wheel steering)
    this.steeringYoke = new THREE.Group();
    this.steeringYoke.position.set(-0.38, 0.84, 0.46);
    this.steeringYoke.rotation.x = -0.55;

    const yokeGrip = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.022, 12, 24), this.darkInteriorMaterial);
    const yokeHub = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16), this.chromeMaterial);
    yokeHub.rotation.x = Math.PI / 2;
    const yokeScrollL = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.02, 8), this.silverTrimMaterial);
    yokeScrollL.position.set(-0.07, 0, 0.015);
    const yokeScrollR = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.02, 8), this.silverTrimMaterial);
    yokeScrollR.position.set(0.07, 0, 0.015);
    this.steeringYoke.add(yokeGrip, yokeHub, yokeScrollL, yokeScrollR);
    interiorGroup.add(this.steeringYoke);

    // 15.4" Center Floating Touchscreen with Dynamic UI Canvas
    this.screenCanvas = document.createElement('canvas');
    this.screenCanvas.width = 512;
    this.screenCanvas.height = 320;
    this.screenTexture = new THREE.CanvasTexture(this.screenCanvas);
    this._renderScreenUI(45, 94, "NORMAL", 21);

    const screenGeo = new THREE.BoxGeometry(0.42, 0.25, 0.015);
    this.screenMaterial = new THREE.MeshBasicMaterial({ map: this.screenTexture });
    const screenMesh = new THREE.Mesh(screenGeo, this.screenMaterial);
    screenMesh.position.set(0, 0.85, 0.54);
    screenMesh.rotation.x = -0.16;

    const screenBezel = new THREE.Mesh(new THREE.BoxGeometry(0.435, 0.265, 0.012), this.blackGlossMaterial);
    screenBezel.position.set(0, 0.85, 0.536);
    screenBezel.rotation.x = -0.16;
    interiorGroup.add(screenMesh, screenBezel);

    this.chassisGroup.add(interiorGroup);

    // ==========================================
    // 8. STRUCTURAL 4680 BATTERY PACK & COPPER BUSBARS
    // ==========================================
    const battMat = new THREE.MeshStandardMaterial({
      color: 0x00ff9d,
      emissive: 0x002e15,
      emissiveIntensity: 0.6,
      roughness: 0.4,
      metalness: 0.6
    });
    this.batteryPackMesh = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.12, 2.6), battMat);
    this.batteryPackMesh.position.set(0, 0.21, 0);
    this.chassisGroup.add(this.batteryPackMesh);

    // High-Voltage Copper Battery Main Busbar Rails
    const busbarL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 2.3), this.copperMaterial);
    busbarL.position.set(-0.65, 0.27, 0);
    const busbarR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 2.3), this.copperMaterial);
    busbarR.position.set(0.65, 0.27, 0);
    this.chassisGroup.add(busbarL, busbarR);

    // ==========================================
    // 9. REAL EV ANIMATED PART: DUAL MOTORS WITH SPINNING ROTORS & ELECTROMAGNETIC FLUX
    // ==========================================
    // Front Permanent Magnet Motor Housing (PMSM 150 kW)
    const fMotorHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.52, 20), this.silverTrimMaterial);
    fMotorHousing.rotation.z = Math.PI / 2;
    fMotorHousing.position.set(0, 0.35, 1.35);

    // Front Motor Spinning Rotor with Copper Coils
    this.frontMotorRotor = new THREE.Group();
    this.frontMotorRotor.position.set(0, 0.35, 1.35);
    const fRotorCore = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.48, 16), this.darkInteriorMaterial);
    fRotorCore.rotation.z = Math.PI / 2;
    this.frontMotorRotor.add(fRotorCore);
    for (let c = 0; c < 6; c++) {
      const cAng = (c / 6) * Math.PI * 2;
      const coil = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.11, 0.46), this.copperMaterial);
      coil.rotation.x = cAng;
      this.frontMotorRotor.add(coil);
    }
    // High-Voltage Orange Power Cables
    const fHvCable = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.42, 8), this.hvCableMaterial);
    fHvCable.position.set(0, 0.46, 1.15);
    fHvCable.rotation.x = 0.5;

    // Front Motor Electromagnetic Flux Ring
    this.frontMotorFlux = new THREE.Mesh(
      new THREE.RingGeometry(0.14, 0.185, 24),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })
    );
    this.frontMotorFlux.rotation.y = Math.PI / 2;
    this.frontMotorFlux.position.set(0.27, 0.35, 1.35);

    // Rear High-Output Silicon-Carbide Motor (SiC 210 kW)
    const rMotorHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.56, 20), this.silverTrimMaterial);
    rMotorHousing.rotation.z = Math.PI / 2;
    rMotorHousing.position.set(0, 0.35, -1.35);

    // Rear Motor Spinning Rotor with Heavy Copper Coils
    this.rearMotorRotor = new THREE.Group();
    this.rearMotorRotor.position.set(0, 0.35, -1.35);
    const rRotorCore = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.52, 16), this.darkInteriorMaterial);
    rRotorCore.rotation.z = Math.PI / 2;
    this.rearMotorRotor.add(rRotorCore);
    for (let c = 0; c < 8; c++) {
      const cAng = (c / 8) * Math.PI * 2;
      const coil = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.13, 0.50), this.copperMaterial);
      coil.rotation.x = cAng;
      this.rearMotorRotor.add(coil);
    }
    // Rear High-Voltage Orange Conduit
    const rHvCable = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.45, 8), this.hvCableMaterial);
    rHvCable.position.set(0, 0.48, -1.12);
    rHvCable.rotation.x = -0.5;

    // Rear Motor Electromagnetic Flux Ring
    this.rearMotorFlux = new THREE.Mesh(
      new THREE.RingGeometry(0.16, 0.21, 24),
      new THREE.MeshBasicMaterial({ color: 0x00ff9d, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })
    );
    this.rearMotorFlux.rotation.y = Math.PI / 2;
    this.rearMotorFlux.position.set(0.29, 0.35, -1.35);

    this.chassisGroup.add(
      fMotorHousing, this.frontMotorRotor, fHvCable, this.frontMotorFlux,
      rMotorHousing, this.rearMotorRotor, rHvCable, this.rearMotorFlux
    );

    // ==========================================
    // 10. REAL EV ANIMATED PART: MOTORIZED NACS CHARGING PORT & GLOWING INLET
    // ==========================================
    this.chargePortHousing = new THREE.Group();
    this.chargePortHousing.position.set(-0.88, 0.72, -1.82);

    // Recessed Socket Cavity
    const socketCavity = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 24), this.blackGlossMaterial);
    socketCavity.rotation.z = Math.PI / 2;
    socketCavity.position.x = 0.02;
    this.chargePortHousing.add(socketCavity);

    // High-Voltage Copper DC Fast-Charging Terminals (2 conductors)
    const dcPin1 = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.035, 12), this.copperMaterial);
    dcPin1.rotation.z = Math.PI / 2;
    dcPin1.position.set(0.01, -0.026, -0.022);
    const dcPin2 = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.035, 12), this.copperMaterial);
    dcPin2.rotation.z = Math.PI / 2;
    dcPin2.position.set(0.01, -0.026, 0.022);

    // AC Level 2 / Communication Silver Pins (3 contacts)
    const acPin1 = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.03, 8), this.silverTrimMaterial);
    acPin1.rotation.z = Math.PI / 2;
    acPin1.position.set(0.01, 0.025, -0.024);
    const acPin2 = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.03, 8), this.silverTrimMaterial);
    acPin2.rotation.z = Math.PI / 2;
    acPin2.position.set(0.01, 0.032, 0);
    const acPin3 = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.03, 8), this.silverTrimMaterial);
    acPin3.rotation.z = Math.PI / 2;
    acPin3.position.set(0.01, 0.025, 0.024);

    // Glowing LED Illuminated Halo Status Ring
    this.chargePortLedRing = new THREE.Mesh(
      new THREE.RingGeometry(0.058, 0.076, 24),
      new THREE.MeshBasicMaterial({ color: 0x00ff9d, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    this.chargePortLedRing.rotation.y = -Math.PI / 2;
    this.chargePortLedRing.position.set(-0.012, 0, 0);

    // Pulsing Light Source at port inlet
    this.chargePortLight = new THREE.PointLight(0x00ff9d, 0, 1.4);
    this.chargePortLight.position.set(-0.1, 0, 0);

    this.chargePortHousing.add(dcPin1, dcPin2, acPin1, acPin2, acPin3, this.chargePortLedRing, this.chargePortLight);
    this.chassisGroup.add(this.chargePortHousing);

    // Motorized Hinged Outer Charge Door (Pivots at front hinge)
    this.chargeDoorGroup = new THREE.Group();
    this.chargeDoorGroup.position.set(-0.89, 0.72, -1.74); // Front hinge axis

    const doorFlap = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.16, 0.16), this.bodyMaterial);
    doorFlap.position.set(0, 0, -0.08);
    const doorSeal = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.145, 0.145), this.blackGlossMaterial);
    doorSeal.position.set(0.008, 0, -0.08);
    this.chargeDoorGroup.add(doorFlap, doorSeal);
    this.chassisGroup.add(this.chargeDoorGroup);

    // ==========================================
    // 11. REAL EV ANIMATED PART: MOTORIZED FRUNK HOOD & RECESSED TUB
    // ==========================================
    // 1. Recessed Front Cargo Tub & Mechanical EV Components (beneath hood)
    const frunkTub = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.22, 0.78), this.darkInteriorMaterial);
    frunkTub.position.set(0, 0.58, 1.45);

    // Low-Voltage 12V LiFePO4 Auxiliary Battery
    const auxBattery = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.15, 0.20), this.blackGlossMaterial);
    auxBattery.position.set(0.38, 0.65, 1.45);
    const posTerminal = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.02, 8), new THREE.MeshStandardMaterial({ color: 0xdf1622 }));
    posTerminal.position.set(0.35, 0.74, 1.42);
    const negTerminal = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.02, 8), this.silverTrimMaterial);
    negTerminal.position.set(0.42, 0.74, 1.42);

    // Windshield Washer Fluid Reservoir with Cyan Cap
    const washerTank = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.14, 12), this.silverTrimMaterial);
    washerTank.position.set(-0.42, 0.64, 1.55);
    const washerCap = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 12), new THREE.MeshStandardMaterial({ color: 0x00f0ff }));
    washerCap.position.set(-0.42, 0.72, 1.55);

    // High-Voltage First Responder Emergency Rescue Cut-Loop (Bright Orange)
    const hvRescueLoop = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.012, 8, 16), this.hvCableMaterial);
    hvRescueLoop.position.set(-0.35, 0.68, 1.25);
    hvRescueLoop.rotation.x = Math.PI / 2;

    // Structural Aluminum Front Strut Tower Cross-Brace
    const strutBrace = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.03, 0.05), this.silverTrimMaterial);
    strutBrace.position.set(0, 0.68, 1.28);

    this.chassisGroup.add(frunkTub, auxBattery, posTerminal, negTerminal, washerTank, washerCap, hvRescueLoop, strutBrace);

    // 2. Articulated Motorized Frunk Hood Assembly (Pivots at windshield base)
    this.frunkHoodGroup = new THREE.Group();
    this.frunkHoodGroup.position.set(0, 0.74, 1.10); // Hinge line

    // Sculpted Metallic Quicksilver Hood Panel
    const hoodSkin = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.035, 0.96), this.bodyMaterial);
    hoodSkin.position.set(0, -0.01, 0.48);
    hoodSkin.castShadow = true;

    // Inner Acoustic Sound Deadener Panel
    const hoodLiner = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.015, 0.88), this.darkInteriorMaterial);
    hoodLiner.position.set(0, -0.028, 0.48);

    // Front Chrome Tesla 'T' Emblem on Hood Tip
    const hoodBadge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.08), this.chromeMaterial);
    hoodBadge.position.set(0, 0.01, 0.95);
    hoodBadge.rotation.x = -0.15;

    // Dual Chrome Telescoping Gas Struts
    this.frunkStrutL = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.32, 8), this.chromeMaterial);
    this.frunkStrutL.position.set(-0.58, -0.08, 0.35);
    this.frunkStrutL.rotation.x = -0.4;
    this.frunkStrutR = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.32, 8), this.chromeMaterial);
    this.frunkStrutR.position.set(0.58, -0.08, 0.35);
    this.frunkStrutR.rotation.x = -0.4;

    this.frunkHoodGroup.add(hoodSkin, hoodLiner, hoodBadge, this.frunkStrutL, this.frunkStrutR);
    this.chassisGroup.add(this.frunkHoodGroup);

    // ==========================================
    // 12. REAL EV ANIMATED PART: MOTORIZED REAR LIFTGATE TRUNK & CARGO BAY
    // ==========================================
    // 1. Recessed Rear Cargo Bay with Ambient Strip
    const trunkBay = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.28, 0.72), this.darkInteriorMaterial);
    trunkBay.position.set(0, 0.52, -1.55);

    const trunkLedStrip = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.015, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2.0 })
    );
    trunkLedStrip.position.set(0, 0.72, -1.35);
    this.chassisGroup.add(trunkBay, trunkLedStrip);

    // 2. Articulated Rear Liftgate (Pivots at upper roofline)
    this.trunkLidGroup = new THREE.Group();
    this.trunkLidGroup.position.set(0, 1.15, -1.18); // Roof hinge

    // Rear Liftgate Frame with Fastback Rear Glass Pane
    const hatchGlass = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.04, 0.65), this.glassMaterial);
    hatchGlass.position.set(0, -0.16, -0.32);
    hatchGlass.rotation.x = 0.45;

    // Decklid Lower Metal Panel
    const hatchLid = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.04, 0.42), this.bodyMaterial);
    hatchLid.position.set(0, -0.36, -0.68);
    hatchLid.rotation.x = 0.75;
    hatchLid.castShadow = true;

    // Chrome Model 3 Rear Logo Badge
    const hatchBadge = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.04), this.chromeMaterial);
    hatchBadge.position.set(0, -0.34, -0.89);

    // Dual Hydraulic Liftgate Struts
    this.trunkStrutL = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.38, 8), this.chromeMaterial);
    this.trunkStrutL.position.set(-0.55, -0.22, -0.35);
    this.trunkStrutL.rotation.x = 0.6;
    this.trunkStrutR = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.38, 8), this.chromeMaterial);
    this.trunkStrutR.position.set(0.55, -0.22, -0.35);
    this.trunkStrutR.rotation.x = 0.6;

    this.trunkLidGroup.add(hatchGlass, hatchLid, hatchBadge, this.trunkStrutL, this.trunkStrutR);
    this.chassisGroup.add(this.trunkLidGroup);

    // ==========================================
    // 13. REAL EV ANIMATED PART: ACTIVE DEPLOYABLE REAR SPOILER
    // ==========================================
    this.activeSpoilerGroup = new THREE.Group();
    this.activeSpoilerGroup.position.set(0, 0.82, -2.06);

    // Motorized Telescoping Chrome Lift Pylons
    this.spoilerPylonL = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.18, 12), this.chromeMaterial);
    this.spoilerPylonL.position.set(-0.48, -0.06, 0);
    this.spoilerPylonR = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.18, 12), this.chromeMaterial);
    this.spoilerPylonR.position.set(0.48, -0.06, 0);

    // Sculpted Carbon-Fiber / Quicksilver Aerofoil Blade
    const spoilerBlade = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.045, 0.24), this.bodyMaterial);
    spoilerBlade.castShadow = true;
    const spoilerCarbonGurney = new THREE.Mesh(new THREE.BoxGeometry(1.70, 0.018, 0.03), this.carbonMaterial);
    spoilerCarbonGurney.position.set(0, 0.02, -0.11);
    const spoilerChromeTrim = new THREE.Mesh(new THREE.BoxGeometry(1.70, 0.012, 0.02), this.chromeMaterial);
    spoilerChromeTrim.position.set(0, 0.01, 0.11);

    this.activeSpoilerGroup.add(this.spoilerPylonL, this.spoilerPylonR, spoilerBlade, spoilerCarbonGurney, spoilerChromeTrim);
    this.activeSpoilerGroup.rotation.x = 0.22;
    this.chassisGroup.add(this.activeSpoilerGroup);

    this.scene.add(this.vehicleGroup);
  }

  // ==========================================
  // REAL-TIME RED THREAT & CYBER ATTACK SIGNAL SYSTEM
  // ==========================================
  _buildThreatSignalSystem() {
    this.threatSignalGroup = new THREE.Group();
    this.threatSignalGroup.visible = false;

    // 1. Concentric Holographic Red Floor Signal Wave Rings
    this.threatRings = [];
    const ringGeo = new THREE.RingGeometry(0.35, 0.48, 36);
    const ringMatBase = new THREE.MeshBasicMaterial({
      color: 0xff0038,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });

    for (let r = 0; r < 4; r++) {
      const rMesh = new THREE.Mesh(ringGeo, ringMatBase.clone());
      rMesh.rotation.x = -Math.PI / 2;
      rMesh.position.y = 0.015;
      rMesh.userData = { offset: r * 0.25 };
      this.threatRings.push(rMesh);
      this.threatSignalGroup.add(rMesh);
    }

    // 2. Holographic Red Security Force Field / Radar Dome
    const domeGeo = new THREE.SphereGeometry(3.2, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.5);
    this.threatDomeMat = new THREE.MeshBasicMaterial({
      color: 0xff0033,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    this.threatDome = new THREE.Mesh(domeGeo, this.threatDomeMat);
    this.threatDome.position.y = 0.02;
    this.threatSignalGroup.add(this.threatDome);

    // 3. Four Corner Red Warning Signal Beacons
    const beaconCoords = [
      { x: -1.75, z: 2.3 },
      { x: 1.75, z: 2.3 },
      { x: -1.75, z: -2.3 },
      { x: 1.75, z: -2.3 }
    ];
    this.threatBeacons = [];
    beaconCoords.forEach(bc => {
      const bGroup = new THREE.Group();
      bGroup.position.set(bc.x, 0, bc.z);

      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.14, 0.04, 16),
        new THREE.MeshStandardMaterial({ color: 0x111317, metalness: 0.9 })
      );
      disc.position.y = 0.02;

      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.08, 1.8, 16, 1, true),
        new THREE.MeshBasicMaterial({ color: 0xff0044, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
      );
      beam.position.y = 0.9;

      const strobe = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xff0033 })
      );
      strobe.position.y = 0.05;

      bGroup.add(disc, beam, strobe);
      this.threatBeacons.push(beam);
      this.threatSignalGroup.add(bGroup);
    });

    // 4. Overhead Threat Red Alarm Point Light
    this.threatAlertLight = new THREE.PointLight(0xff0033, 0, 8.5);
    this.threatAlertLight.position.set(0, 2.6, 0);
    this.threatSignalGroup.add(this.threatAlertLight);

    this.scene.add(this.threatSignalGroup);
  }

  // Live Screen Instrument Cluster UI Generation
  _renderScreenUI(speed, battery, statusText, adderResult) {
    if (!this.screenCanvas) return;
    const ctx = this.screenCanvas.getContext('2d');
    const w = this.screenCanvas.width;
    const h = this.screenCanvas.height;

    if (this.threatSignalActive) {
      // Flashing Red Alert Hazard Background
      ctx.fillStyle = '#1a0306';
      ctx.fillRect(0, 0, w, h);

      // Warning Cross Hatch Diagonal Stripes
      ctx.fillStyle = 'rgba(255, 0, 60, 0.12)';
      for (let x = -h; x < w; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + h, h);
        ctx.lineTo(x + h + 16, h);
        ctx.lineTo(x + 16, 0);
        ctx.fill();
      }

      // Left Column: Red Alert Telemetry
      ctx.fillStyle = '#ff0044';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('🚨 RED ALERT', 20, 42);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px monospace';
      ctx.fillText(`${speed} KM/H`, 20, 84);

      ctx.fillStyle = '#ff6b81';
      ctx.font = '11px monospace';
      ctx.fillText(`STATUS: ${(this.threatData.riskLevel || 'CRITICAL')} RISK`, 20, 114);
      ctx.fillText(`INTRUSION: ${this.threatData.attackType || 'ANOMALY DETECTED'}`, 20, 134);
      ctx.fillText(`RISK SCORE: ${(this.threatData.riskScore || 94.5).toFixed(1)}%`, 20, 154);

      // Quarantine Indicator Box
      ctx.fillStyle = '#ff0044';
      ctx.fillRect(20, 175, 140, 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('QUARANTINE LOCKED', 26, 191);

      ctx.fillStyle = '#ff99aa';
      ctx.font = '9px monospace';
      ctx.fillText('ASIL-D ISOLATION ACTIVE', 20, 222);
      ctx.fillText(`GATEWAY SHIELD: SECURE`, 20, 240);

      // Right Column: Threat Radar Display
      ctx.strokeStyle = '#ff0044';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(345, 145, 88, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(345, 145, 55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(345, 145, 22, 0, Math.PI * 2);
      ctx.stroke();

      // Threat Target Blip
      ctx.fillStyle = '#ff0033';
      ctx.beginPath();
      ctx.arc(368, 125, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('CAN BUS FIREWALL RADAR', 240, 36);
      ctx.fillStyle = '#ff6b81';
      ctx.font = '10px monospace';
      ctx.fillText('ANOMALY ISOLATED AT CAN BUS 0', 215, 265);

      if (this.screenTexture) this.screenTexture.needsUpdate = true;
      return;
    }

    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, w, h);

    // Split Line
    ctx.strokeStyle = '#1a2233';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, 0);
    ctx.lineTo(180, h);
    ctx.stroke();

    // Speedometer
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px monospace';
    ctx.fillText(`${speed}`, 24, 75);
    ctx.font = '12px monospace';
    ctx.fillStyle = '#6b7a99';
    ctx.fillText('KM/H  •  DRIVE (D)', 24, 100);

    // Battery Bar
    ctx.fillStyle = '#1a2433';
    ctx.fillRect(24, 125, 130, 10);
    ctx.fillStyle = statusText === 'CRITICAL OVERLOAD' ? '#ff0055' : (statusText === 'HIGH LOAD' ? '#ffb703' : '#00ff9d');
    ctx.fillRect(24, 125, 130 * (battery / 100), 10);

    ctx.font = '13px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${battery}%`, 24, 155);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#6b7a99';
    ctx.fillText('400V PACK NOMINAL', 24, 172);

    // AI Sentinel Guard Status
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('SENTINEL AI: SECURE', 24, 210);

    // Adder Logic Compute Readout
    ctx.fillStyle = '#ffb703';
    ctx.font = '10px monospace';
    ctx.fillText(`ADDER DEC: ${adderResult}`, 24, 235);

    // Mini Map Display on Right Half
    ctx.fillStyle = '#101726';
    ctx.fillRect(195, 20, 300, 280);

    // Route Vector Line
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(220, 260);
    ctx.lineTo(290, 190);
    ctx.lineTo(380, 130);
    ctx.lineTo(450, 60);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    ctx.fillText('NAV: CHARGING HUB CS-1024', 210, 48);

    if (this.screenTexture) {
      this.screenTexture.needsUpdate = true;
    }
  }

  _buildEnergyFlow() {
    this.energyFlowGroup = new THREE.Group();
    this.energyFlowGroup.visible = false;

    const paths = [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.22, 0.2),
        new THREE.Vector3(0, 0.28, 0.8),
        new THREE.Vector3(0, 0.35, 1.35)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.35, 1.35),
        new THREE.Vector3(-0.45, 0.35, 1.35),
        new THREE.Vector3(-0.9, 0.35, 1.35)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.35, 1.35),
        new THREE.Vector3(0.45, 0.35, 1.35),
        new THREE.Vector3(0.9, 0.35, 1.35)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.22, -0.2),
        new THREE.Vector3(0, 0.28, -0.8),
        new THREE.Vector3(0, 0.35, -1.35)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.35, -1.35),
        new THREE.Vector3(-0.45, 0.35, -1.35),
        new THREE.Vector3(-0.9, 0.35, -1.35)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.35, -1.35),
        new THREE.Vector3(0.45, 0.35, -1.35),
        new THREE.Vector3(0.9, 0.35, -1.35)
      ])
    ];

    this.flowParticles = [];
    paths.forEach(path => {
      const particleCount = 28;
      const pPositions = new Float32Array(particleCount * 3);
      const pProgress = [];
      const pGeo = new THREE.BufferGeometry();

      for (let i = 0; i < particleCount; i++) {
        pProgress.push(i / particleCount);
        const pt = path.getPoint(pProgress[i]);
        pPositions[i * 3] = pt.x;
        pPositions[i * 3 + 1] = pt.y;
        pPositions[i * 3 + 2] = pt.z;
      }

      pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0x00ff9d,
        size: 0.08,
        transparent: true,
        opacity: 0.95
      });
      const pSystem = new THREE.Points(pGeo, pMat);
      this.energyFlowGroup.add(pSystem);

      this.flowParticles.push({
        system: pSystem,
        geo: pGeo,
        path: path,
        progress: pProgress,
        count: particleCount
      });
    });

    this.scene.add(this.energyFlowGroup);
  }

  _buildHotspotMarkers() {
    this.hotspotMarkers = [];
    const markerCoords = [
      { key: 'battery', pos: new THREE.Vector3(0, 0.24, 0), label: 'Battery' },
      { key: 'motor', pos: new THREE.Vector3(0, 0.44, 1.35), label: 'Motor' },
      { key: 'inverter', pos: new THREE.Vector3(0, 0.48, -0.6), label: 'Inverter' },
      { key: 'charge_port', pos: new THREE.Vector3(-0.95, 0.72, -1.8), label: 'Charge Port' },
      { key: 'wheels', pos: new THREE.Vector3(0.96, 0.38, 1.35), label: 'Wheels' },
      { key: 'dashboard', pos: new THREE.Vector3(0, 0.95, 0.55), label: 'Dashboard' },
      { key: 'energy_system', pos: new THREE.Vector3(0, 0.6, 0), label: 'EMS' }
    ];

    markerCoords.forEach(m => {
      const g = new THREE.Group();
      g.position.copy(m.pos);

      // Outer halo ring
      const ringGeo = new THREE.RingGeometry(0.08, 0.11, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      g.add(ring);

      // Inner core
      const coreGeo = new THREE.CircleGeometry(0.045, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const core = new THREE.Mesh(coreGeo, coreMat);
      g.add(core);

      g.userData = { key: m.key, label: m.label, ring: ring };
      this.scene.add(g);
      this.hotspotMarkers.push(g);
    });

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  _bindEvents() {
    window.addEventListener('resize', () => this.onResize());

    let downX = 0;
    let downY = 0;
    this.renderer.domElement.addEventListener('pointerdown', (e) => {
      this.lastInteractionTime = Date.now();
      downX = e.clientX;
      downY = e.clientY;
    });

    // Click hotspot (only if not dragged)
    this.renderer.domElement.addEventListener('click', (e) => {
      const dx = Math.abs(e.clientX - downX);
      const dy = Math.abs(e.clientY - downY);
      if (dx > 6 || dy > 6) return; // Ignore drag rotation

      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.hotspotMarkers, true);

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj.parent && !obj.userData.key) {
          obj = obj.parent;
        }
        if (obj.userData.key) {
          this.showHotspotModal(obj.userData.key);
        }
      }
    });

    // Double click to reset focus
    this.renderer.domElement.addEventListener('dblclick', () => {
      this.switchView('exterior');
    });
  }

  // Headlight illumination toggle
  toggleHeadlights() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.headlightsOn = !this.headlightsOn;

    if (this.headlightSpotL && this.headlightSpotR) {
      this.headlightSpotL.visible = this.headlightsOn;
      this.headlightSpotR.visible = this.headlightsOn;
    }
    if (this.drlMaterial) {
      this.drlMaterial.emissiveIntensity = this.headlightsOn ? 2.2 : 0.2;
    }
    if (this.projectorMaterial) {
      this.projectorMaterial.emissiveIntensity = this.headlightsOn ? 2.8 : 0.1;
    }

    const btn = document.getElementById('thm-btn-headlights');
    if (btn) btn.classList.toggle('active', this.headlightsOn);
  }

  showHotspotModal(key) {
    if (window.cyberAudio) window.cyberAudio.playClick();
    const data = this.hotspotData[key];
    if (!data) return;

    const modal = document.getElementById('tesla-hotspot-modal');
    const title = document.getElementById('thm-title');
    const specs = document.getElementById('thm-specs');
    const purpose = document.getElementById('thm-purpose');
    const impact = document.getElementById('thm-impact');
    const connection = document.getElementById('thm-connection');

    if (title) title.textContent = data.title;
    if (specs) specs.textContent = `${data.specs} • ${data.rating}`;
    if (purpose) purpose.textContent = data.purpose;
    if (impact) impact.textContent = data.impact;
    if (connection) connection.textContent = data.connection;

    if (modal) modal.style.display = 'block';
  }

  closeHotspotModal() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    const modal = document.getElementById('tesla-hotspot-modal');
    if (modal) modal.style.display = 'none';
  }

  switchView(viewName) {
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.currentView = viewName;
    this.lastInteractionTime = Date.now();

    document.querySelectorAll('.thm-view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });

    const views = {
      exterior: { pos: new THREE.Vector3(4.8, 2.1, 5.5), target: new THREE.Vector3(0, 0.6, 0) },
      interior: { pos: new THREE.Vector3(0.1, 1.15, 0.35), target: new THREE.Vector3(0.1, 1.05, 1.2) },
      dashboard: { pos: new THREE.Vector3(0.18, 1.05, 0.72), target: new THREE.Vector3(0.18, 0.95, 1.3) },
      battery: { pos: new THREE.Vector3(3.2, -0.6, 2.8), target: new THREE.Vector3(0, 0.2, 0) },
      energy_flow: { pos: new THREE.Vector3(0.1, 6.8, 2.8), target: new THREE.Vector3(0, 0.5, 0) },
      front: { pos: new THREE.Vector3(0, 1.2, 6.2), target: new THREE.Vector3(0, 0.6, 0) },
      rear: { pos: new THREE.Vector3(0, 1.2, -6.2), target: new THREE.Vector3(0, 0.6, 0) },
      left: { pos: new THREE.Vector3(-6.2, 1.2, 0), target: new THREE.Vector3(0, 0.6, 0) },
      right: { pos: new THREE.Vector3(6.2, 1.2, 0), target: new THREE.Vector3(0, 0.6, 0) },
      top: { pos: new THREE.Vector3(0.01, 8.0, 0), target: new THREE.Vector3(0, 0.6, 0) }
    };

    const targetView = views[viewName] || views.exterior;
    this.targetCameraPos.copy(targetView.pos);
    this.targetLookAt.copy(targetView.target);

    if (viewName === 'energy_flow') {
      this.setEnergyFlow(true);
    }
  }

  toggleEnergyFlow() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.setEnergyFlow(!this.energyFlowEnabled);
  }

  setEnergyFlow(enable) {
    this.energyFlowEnabled = !!enable;
    if (this.energyFlowGroup) {
      this.energyFlowGroup.visible = this.energyFlowEnabled;
    }
    const btn = document.getElementById('thm-btn-energy-flow');
    if (btn) btn.classList.toggle('active', this.energyFlowEnabled);
  }

  toggleRotate() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.autoRotate = !this.autoRotate;
    const btn = document.getElementById('thm-btn-rotate');
    if (btn) btn.classList.toggle('active', this.autoRotate);
  }

  zoomIn() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.camera.position.lerp(this.controls ? this.controls.target : new THREE.Vector3(0, 0.6, 0), 0.2);
  }

  zoomOut() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    const target = this.controls ? this.controls.target : new THREE.Vector3(0, 0.6, 0);
    const dir = this.camera.position.clone().sub(target).normalize();
    this.camera.position.add(dir.multiplyScalar(0.8));
  }

  resetCamera() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.switchView('exterior');
  }

  toggleFullscreen() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    const box = document.getElementById('tesla-lab-card');
    if (!box) return;
    if (!document.fullscreenElement) {
      box.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen().catch(err => console.log(err));
    }
  }

  // ==========================================
  // REAL EV PHYSICAL ANIMATED CONTROLS
  // ==========================================
  toggleChargePort() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.chargePortOpen = !this.chargePortOpen;
    this.targetChargePortAngle = this.chargePortOpen ? 1.45 : 0;
    const btn = document.getElementById('thm-btn-charge');
    if (btn) btn.classList.toggle('active', this.chargePortOpen);
  }

  toggleFrunk() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.frunkOpen = !this.frunkOpen;
    this.targetFrunkAngle = this.frunkOpen ? 0.78 : 0;
    const btn = document.getElementById('thm-btn-frunk');
    if (btn) btn.classList.toggle('active', this.frunkOpen);
  }

  toggleTrunk() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.trunkOpen = !this.trunkOpen;
    this.targetTrunkAngle = this.trunkOpen ? 0.95 : 0;
    const btn = document.getElementById('thm-btn-trunk');
    if (btn) btn.classList.toggle('active', this.trunkOpen);
  }

  toggleSpoiler() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.spoilerDeployed = !this.spoilerDeployed;
    this.targetSpoilerLift = this.spoilerDeployed ? 0.14 : 0;
    this.targetSpoilerPitch = this.spoilerDeployed ? 0.22 : 0;
    const btn = document.getElementById('thm-btn-spoiler');
    if (btn) btn.classList.toggle('active', this.spoilerDeployed);
  }

  toggleSuspension() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    // Cycle: Standard (1) -> Sport Low (0) -> High Clearance (2) -> Standard (1)
    if (this.suspensionMode === 1) {
      this.suspensionMode = 0; // Sport Low
      this.targetSuspensionY = -0.055;
    } else if (this.suspensionMode === 0) {
      this.suspensionMode = 2; // High Clearance
      this.targetSuspensionY = 0.055;
    } else {
      this.suspensionMode = 1; // Standard
      this.targetSuspensionY = 0.0;
    }
    const btn = document.getElementById('thm-btn-suspension');
    if (btn) {
      btn.classList.toggle('active', this.suspensionMode !== 1);
      btn.title = `Air Suspension: ${this.suspensionMode === 0 ? 'SPORT LOW (-55mm)' : (this.suspensionMode === 2 ? 'HIGH CLEARANCE (+55mm)' : 'STANDARD')}`;
    }
  }

  toggleShowcase() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    this.showcaseActive = !this.showcaseActive;
    this.chargePortOpen = this.showcaseActive;
    this.targetChargePortAngle = this.chargePortOpen ? 1.45 : 0;
    this.frunkOpen = this.showcaseActive;
    this.targetFrunkAngle = this.frunkOpen ? 0.78 : 0;
    this.trunkOpen = this.showcaseActive;
    this.targetTrunkAngle = this.trunkOpen ? 0.95 : 0;
    this.spoilerDeployed = this.showcaseActive;
    this.targetSpoilerLift = this.spoilerDeployed ? 0.14 : 0;
    this.targetSpoilerPitch = this.spoilerDeployed ? 0.22 : 0;

    const btnC = document.getElementById('thm-btn-charge');
    const btnF = document.getElementById('thm-btn-frunk');
    const btnT = document.getElementById('thm-btn-trunk');
    const btnS = document.getElementById('thm-btn-spoiler');
    const btnSh = document.getElementById('thm-btn-showcase');

    if (btnC) btnC.classList.toggle('active', this.chargePortOpen);
    if (btnF) btnF.classList.toggle('active', this.frunkOpen);
    if (btnT) btnT.classList.toggle('active', this.trunkOpen);
    if (btnS) btnS.classList.toggle('active', this.spoilerDeployed);
    if (btnSh) btnSh.classList.toggle('active', this.showcaseActive);
  }

  // ==========================================
  // THREAT & CYBER ATTACK RED SIGNAL CONTROLS
  // ==========================================
  setThreatSignal(active, data = {}) {
    this.threatSignalActive = !!active;
    this.threatData = Object.assign(this.threatData, data);

    if (this.threatSignalGroup) {
      this.threatSignalGroup.visible = this.threatSignalActive;
    }

    // Toggle button UI state in toolbar
    const btn = document.getElementById('thm-btn-threat-signal');
    if (btn) btn.classList.toggle('active', this.threatSignalActive);

    // Toggle Viewport Warning Border
    const vp = document.getElementById('tesla-3d-viewport');
    if (vp) vp.classList.toggle('threat-alert-active', this.threatSignalActive);

    // Update Threat HUD Banner Overlay
    const hud = document.getElementById('thm-threat-hud');
    if (hud) {
      hud.style.display = this.threatSignalActive ? 'flex' : 'none';
      const elTitle = document.getElementById('thm-threat-title');
      const elDesc = document.getElementById('thm-threat-desc');
      const elType = document.getElementById('thm-threat-type');
      const elRisk = document.getElementById('thm-threat-risk');

      if (elTitle) elTitle.textContent = `🚨 RED SIGNAL: ${this.threatData.attackType ? this.threatData.attackType.replace(/_/g, ' ') : 'CYBER THREAT'} DETECTED`;
      if (elDesc) elDesc.textContent = this.threatData.dominantChannel ? `Anomalous channel: ${this.threatData.dominantChannel} • Sentinel ASIL-D Quarantine Active` : `High-risk telemetry anomaly detected • Real-time CAN bus lockdown in progress`;
      if (elType) elType.textContent = this.threatData.attackType || 'THREAT_ACTIVE';
      if (elRisk) elRisk.textContent = `RISK: ${(this.threatData.riskScore || 94.5).toFixed(1)}% [${this.threatData.riskLevel || 'CRITICAL'}]`;
    }

    // Update Center Screen UI
    if (window.adderCalc && window.adderCalc.state) {
      this.updateResourceState(window.adderCalc.state);
    }
  }

  toggleThreatSignal() {
    if (window.cyberAudio) window.cyberAudio.playClick();
    const nextState = !this.threatSignalActive;
    this.setThreatSignal(nextState, {
      attackType: nextState ? 'CYBER_ATTACK_SIMULATION' : 'NORMAL',
      riskScore: nextState ? 95.8 : 8.5,
      riskLevel: nextState ? 'CRITICAL' : 'LOW',
      dominantChannel: nextState ? 'CAN_BUS_FLOOD_0x18DAF110' : ''
    });

    if (nextState && window.cyberAudio) {
      window.cyberAudio.playThreatAlarm();
    }
  }

  // Update visual state from the Adder Calculator
  updateResourceState(calcState) {
    const res = calcState.resourceUsage; // 0 to 100
    const ratio = res / 100;

    // Automatic Threat Signal integration with Adder overload
    if (calcState.statusLevel === 'critical' && !this.threatSignalActive) {
      this.setThreatSignal(true, {
        attackType: 'ADDER_LOGIC_OVERLOAD',
        riskScore: calcState.resourceUsage,
        riskLevel: 'CRITICAL',
        dominantChannel: 'MULTI_BIT_SATURATION'
      });
    } else if (calcState.statusLevel !== 'critical' && this.threatSignalActive && this.threatData.attackType === 'ADDER_LOGIC_OVERLOAD') {
      this.setThreatSignal(false, { attackType: 'NORMAL', riskLevel: 'LOW', riskScore: calcState.resourceUsage });
    }

    // 1. Wheel speed
    this.wheelSpeed = 0.02 + ratio * 0.12;

    // 2. Energy flow speed and intensity
    this.flowSpeed = 0.4 + ratio * 2.5;

    // 3. Vehicle Underglow lighting & color
    if (this.underglow && !this.threatSignalActive) {
      if (res < 35) {
        this.underglow.color.setHex(0x00ff9d); // Green
        this.underglow.intensity = 1.2;
      } else if (res < 70) {
        this.underglow.color.setHex(0x00f0ff); // Cyan
        this.underglow.intensity = 1.8;
      } else if (res < 90) {
        this.underglow.color.setHex(0xffb703); // Amber
        this.underglow.intensity = 2.4;
      } else {
        this.underglow.color.setHex(0xff0055); // Crimson
        this.underglow.intensity = 3.2;
      }
    }

    // 4. Update 15.4" Center Touchscreen live canvas UI
    this._renderScreenUI(calcState.speedKmh, calcState.batteryLevel, calcState.status, calcState.decimalResult);
  }

  onResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight || 420;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  _animate() {
    requestAnimationFrame(() => this._animate());

    const now = Date.now();
    const isUserInactive = (now - this.lastInteractionTime) > 4000;

    // Smooth Camera Transition Interpolation
    if (this.currentView !== 'free') {
      this.camera.position.lerp(this.targetCameraPos, 0.06);
      if (this.controls) {
        this.controls.target.lerp(this.targetLookAt, 0.06);
      }
    }

    // Auto-rotation when inactive
    if (this.autoRotate && isUserInactive && this.currentView === 'exterior') {
      this.vehicleGroup.rotation.y += 0.0035;
    }

    // Continuous Wheel Rotation
    this.rotAngle += this.wheelSpeed;
    this.wheels.forEach(w => {
      w.rotation.x = this.rotAngle;
    });

    // ==========================================
    // REAL EV PHYSICAL ANIMATIONS
    // ==========================================
    // 1. Dynamic Slalom Steering & Cockpit Yoke Synchronization
    const isDriving = this.autoRotate || this.wheelSpeed > 0.035;
    const targetSteer = isDriving ? Math.sin(now * 0.0018) * 0.24 : 0;
    this.steerAngle += (targetSteer - this.steerAngle) * 0.08;
    if (this.frontLeftSteerGroup) this.frontLeftSteerGroup.rotation.y = this.steerAngle;
    if (this.frontRightSteerGroup) this.frontRightSteerGroup.rotation.y = this.steerAngle;
    if (this.steeringYoke) this.steeringYoke.rotation.z = -this.steerAngle * 2.8;

    // 2. Motorized Charge Port Door & Pulsing Inlet LED Halo
    this.chargePortAngle += (this.targetChargePortAngle - this.chargePortAngle) * 0.08;
    if (this.chargeDoorGroup) {
      this.chargeDoorGroup.rotation.y = -this.chargePortAngle;
    }
    if (this.chargePortLedRing) {
      const pulse = (Math.sin(now * 0.006) + 1) * 0.5;
      this.chargePortLedRing.material.opacity = this.chargePortOpen ? (0.4 + pulse * 0.6) : 0.25;
      if (this.chargePortLight) {
        this.chargePortLight.intensity = this.chargePortOpen ? (1.5 + pulse * 1.5) : 0;
      }
    }

    // 3. Motorized Frunk Hood Assembly
    this.frunkAngle += (this.targetFrunkAngle - this.frunkAngle) * 0.08;
    if (this.frunkHoodGroup) {
      this.frunkHoodGroup.rotation.x = -this.frunkAngle;
    }

    // 4. Motorized Rear Liftgate (Trunk) Assembly
    this.trunkAngle += (this.targetTrunkAngle - this.trunkAngle) * 0.08;
    if (this.trunkLidGroup) {
      this.trunkLidGroup.rotation.x = this.trunkAngle;
    }

    // 5. Active Deployable Rear Aerodynamic Spoiler
    this.spoilerLift += (this.targetSpoilerLift - this.spoilerLift) * 0.08;
    this.spoilerPitch += (this.targetSpoilerPitch - this.spoilerPitch) * 0.08;
    if (this.activeSpoilerGroup) {
      this.activeSpoilerGroup.position.y = 0.82 + this.spoilerLift;
      this.activeSpoilerGroup.rotation.x = 0.22 + this.spoilerPitch;
      if (this.spoilerPylonL) this.spoilerPylonL.scale.y = 1 + (this.spoilerLift / 0.14) * 1.2;
      if (this.spoilerPylonR) this.spoilerPylonR.scale.y = 1 + (this.spoilerLift / 0.14) * 1.2;
    }

    // 6. Dynamic Pneumatic Air Suspension Leveling
    this.suspensionY += (this.targetSuspensionY - this.suspensionY) * 0.08;
    if (this.chassisGroup) {
      this.chassisGroup.position.y = this.suspensionY;
    }

    // 7. Dual Electric Traction Motor Rotors & Electromagnetic Flux Field
    this.motorRotorAngle += this.wheelSpeed * 6.0;
    if (this.frontMotorRotor) this.frontMotorRotor.rotation.x = this.motorRotorAngle;
    if (this.rearMotorRotor) this.rearMotorRotor.rotation.x = this.motorRotorAngle;
    if (this.frontMotorFlux) {
      this.frontMotorFlux.rotation.z += 0.05;
      this.frontMotorFlux.material.opacity = 0.35 + Math.sin(now * 0.008) * 0.25;
    }
    if (this.rearMotorFlux) {
      this.rearMotorFlux.rotation.z -= 0.05;
      this.rearMotorFlux.material.opacity = 0.35 + Math.cos(now * 0.008) * 0.25;
    }

    // ==========================================
    // 8. REAL-TIME RED THREAT & CYBER ATTACK SIGNAL EFFECT
    // ==========================================
    if (this.threatSignalActive) {
      this.threatPulseTimer += 0.035;
      const strobeOn = Math.sin(now * 0.016) > 0; // Rapid ~4 Hz hazard strobe

      // A. Concentric Expanding Red Warning Radar Rings
      if (this.threatRings) {
        this.threatRings.forEach(rm => {
          let p = (this.threatPulseTimer + rm.userData.offset) % 1.0;
          const scale = 0.4 + p * 4.6;
          rm.scale.set(scale, scale, 1);
          rm.material.opacity = Math.max(0, (1 - p) * 0.85);
        });
      }

      // B. Pulsing Geodesic Force Field Shield Dome
      if (this.threatDome) {
        this.threatDome.rotation.y += 0.008;
        const domePulse = (Math.sin(now * 0.008) + 1) * 0.5;
        this.threatDomeMat.opacity = 0.22 + domePulse * 0.42;
      }

      // C. Corner Warning Signal Beacons Strobe
      if (this.threatBeacons) {
        this.threatBeacons.forEach((bm, i) => {
          const ph = Math.sin(now * 0.018 + i * 1.3);
          bm.material.opacity = 0.15 + (ph > 0 ? 0.65 : 0.05);
        });
      }

      // D. Overhead Red Alarm Point Light
      if (this.threatAlertLight) {
        this.threatAlertLight.intensity = strobeOn ? 4.5 : 0.8;
      }

      // E. Underglow Red Alarm Hazard Flash
      if (this.underglow) {
        this.underglow.color.setHex(0xff0033);
        this.underglow.intensity = strobeOn ? 3.8 : 0.8;
      }

      // F. Taillights & Headlight Projectors Flashing Alert Strobe
      if (this.taillightMaterial) {
        this.taillightMaterial.emissiveIntensity = strobeOn ? 4.8 : 1.2;
      }
      if (this.drlMaterial) {
        this.drlMaterial.color.setHex(strobeOn ? 0xff0038 : 0xffffff);
        this.drlMaterial.emissive.setHex(strobeOn ? 0xff0033 : 0x00f0ff);
      }
    } else {
      if (this.drlMaterial) {
        this.drlMaterial.color.setHex(0xffffff);
        this.drlMaterial.emissive.setHex(0x00f0ff);
      }
    }

    // Animate Flow Particles
    if (this.energyFlowEnabled && this.flowParticles) {
      this.flowParticles.forEach(fp => {
        const positions = fp.geo.attributes.position.array;
        for (let i = 0; i < fp.count; i++) {
          fp.progress[i] = (fp.progress[i] + 0.008 * this.flowSpeed) % 1.0;
          const pt = fp.path.getPoint(fp.progress[i]);
          positions[i * 3] = pt.x;
          positions[i * 3 + 1] = pt.y;
          positions[i * 3 + 2] = pt.z;
        }
        fp.geo.attributes.position.needsUpdate = true;
      });
    }

    // Billboarding hotspot markers
    this.hotspotMarkers.forEach(hm => {
      hm.lookAt(this.camera.position);
      const scale = 1 + Math.sin(now * 0.006) * 0.12;
      hm.scale.set(scale, scale, scale);
    });

    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Global initialization
window.initTeslaLab = function() {
  const container = document.getElementById('tesla-3d-viewport');
  if (container && !window.tesla3DLab) {
    // Hide loading overlay
    const loader = document.getElementById('tesla-lab-loader');
    if (loader) loader.style.display = 'none';

    window.tesla3DLab = new Tesla3DLab('tesla-3d-viewport');
  } else if (container && window.tesla3DLab) {
    window.tesla3DLab.onResize();
  }

  if (!window.adderCalc) {
    window.adderCalc = new AdderResourceCalculator((calcState) => {
      // Update DOM elements
      const elBat = document.getElementById('calc-ev-battery');
      const elPwr = document.getElementById('calc-ev-power');
      const elEn = document.getElementById('calc-ev-energy');
      const elRes = document.getElementById('calc-ev-resource');
      const elAddOut = document.getElementById('calc-ev-adder-out');
      const elStatus = document.getElementById('calc-ev-status');

      if (elBat) elBat.textContent = `${calcState.batteryLevel}%`;
      if (elPwr) elPwr.textContent = `${calcState.powerConsumption} kW`;
      if (elEn) elEn.textContent = `${calcState.energyUsed} kWh`;
      if (elRes) elRes.textContent = `${calcState.resourceUsage}%`;
      if (elAddOut) elAddOut.textContent = `${calcState.outputBinary} (${calcState.decimalResult})`;
      if (elStatus) {
        elStatus.textContent = calcState.status;
        elStatus.style.color = calcState.statusColor;
      }

      // Update bit switch states in DOM
      for (let i = 0; i < 4; i++) {
        const btnA = document.getElementById(`bit-a-${i}`);
        const btnB = document.getElementById(`bit-b-${i}`);
        if (btnA) {
          btnA.textContent = calcState.inputA[i];
          btnA.classList.toggle('active', calcState.inputA[i] === 1);
        }
        if (btnB) {
          btnB.textContent = calcState.inputB[i];
          btnB.classList.toggle('active', calcState.inputB[i] === 1);
        }
      }

      // Propagate to Three.js Vehicle
      if (window.tesla3DLab) {
        window.tesla3DLab.updateResourceState(calcState);
      }
    });
  }
};
