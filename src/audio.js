// ==========================================
// Web Audio API によるシンセサイザー音響システム
// ==========================================

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // バーコードスキャン音 (高めのピピッ)
  playScan() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, this.ctx.currentTime);
    osc.frequency.setValueAtTime(2800, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // コンビニ入店チャイム (おなじみのメロディ: ドレミファソラシド風)
  playDoorChime() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    // メロディ周波数: F#5, D5, A4, D5, E5, A5, ... (有名な入店チャイム)
    const notes = [
      { f: 739.99, d: 0.18, pause: 0.05 }, // F#5
      { f: 587.33, d: 0.18, pause: 0.05 }, // D5
      { f: 440.00, d: 0.18, pause: 0.05 }, // A4
      { f: 587.33, d: 0.18, pause: 0.08 }, // D5
      { f: 659.25, d: 0.22, pause: 0.15 }, // E5
      { f: 880.00, d: 0.45, pause: 0.20 }, // A5
      { f: 659.25, d: 0.18, pause: 0.05 }, // E5
      { f: 739.99, d: 0.18, pause: 0.05 }, // F#5
      { f: 659.25, d: 0.18, pause: 0.05 }, // E5
      { f: 440.00, d: 0.18, pause: 0.05 }, // A4
      { f: 587.33, d: 0.50, pause: 0.10 }  // D5
    ];

    let startTime = this.ctx.currentTime;
    notes.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + note.d);

      startTime += note.d + note.pause;
    });
  }

  // 会計完了＆レジドロワー開放音 (チン！＆カシャン)
  playRegisterDing() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    // ベルのチン！
    const bell = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();
    bell.type = 'sine';
    bell.frequency.setValueAtTime(1760, this.ctx.currentTime); // A6
    bellGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

    bell.connect(bellGain);
    bellGain.connect(this.ctx.destination);
    bell.start();
    bell.stop(this.ctx.currentTime + 0.8);

    // カシャン (金属ノイズ)
    setTimeout(() => {
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start();
    }, 100);
  }

  // 商品を陳列した音 (サッ、コトッ)
  playPlaceItem() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // ダンボール箱開封/持ち上げ音
  playBox() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(260, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // おつり・硬貨の音 (チャリン)
  playCoin() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    [2200, 3100].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime + (i * 0.04);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.15);
    });
  }

  // エラー音 (ブブー)
  playError() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }
}

export const soundManager = new SoundManager();
