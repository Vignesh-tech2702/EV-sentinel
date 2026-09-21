/**
 * EV-Sentinel: Web Audio API Cyber Sound Synthesizer
 * Generates futuristic audio feedback, attack alarms, and scan sweeps without external files.
 */
class CyberAudioSynth {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.alarmInterval = null;
  }

  _initCtx() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (this.isMuted) return;
    try {
      this._initCtx();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  playSuccess() {
    if (this.isMuted) return;
    try {
      this._initCtx();
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc2.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc2.frequency.setValueAtTime(1046.50, now + 0.24); // C6

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.2);
      osc2.start(now + 0.16);
      osc2.stop(now + 0.45);
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  playScanSweep() {
    if (this.isMuted) return;
    try {
      this._initCtx();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.6);
      osc.frequency.exponentialRampToValueAtTime(400, now + 1.2);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.3);
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  playThreatAlarm() {
    if (this.isMuted) return;
    try {
      this._initCtx();
      this.stopAlarm();
      let step = 0;
      this.alarmInterval = setInterval(() => {
        if (step > 4) {
          this.stopAlarm();
          return;
        }
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.linearRampToValueAtTime(540, now + 0.18);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        step++;
      }, 240);
    } catch (e) {
      console.warn("Alarm error", e);
    }
  }

  stopAlarm() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) this.stopAlarm();
    return this.isMuted;
  }
}

window.cyberAudio = new CyberAudioSynth();
