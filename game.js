// ========================================================
// スーパーマーケット・シミュレーター 3D (Supermarket Simulator)
// デバッグ済み・安定版 メインスクリプト
// ========================================================

(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    console.error('Three.js is not loaded.');
    return;
  }

  // ========================================================
  // 1. カテゴリマスター ＆ アイテムデータ定義
  // ========================================================
  const CATEGORIES = {
    DAILY: 'デイリー',
    NON_DAILY: '非デイリー',
    EQUIPMENT: '備品'
  };

  const SUBCATEGORIES = {
    RICE: '米飯',
    BREAD: 'パン',
    SNACK: 'お菓子',
    DRINK: 'ドリンク',
    SHELF: '棚',
    REGISTER: 'レジ'
  };

  const ITEM_CATALOG = [
    // ---------------- デイリー：米飯 ----------------
    {
      id: 'rice_tsunamayo',
      name: 'おにぎり(ツナマヨ)',
      category: CATEGORIES.DAILY,
      subCategory: SUBCATEGORIES.RICE,
      cost: 80,
      price: 140,
      shelfType: 'chilled',
      modelType: 'onigiri',
      color: '#3498db',
      label: 'ツナマヨ',
      description: '一番人気の定番ツナマヨネーズおにぎり'
    },
    {
      id: 'rice_salmon',
      name: 'おにぎり(しゃけ)',
      category: CATEGORIES.DAILY,
      subCategory: SUBCATEGORIES.RICE,
      cost: 85,
      price: 150,
      shelfType: 'chilled',
      modelType: 'onigiri',
      color: '#e74c3c',
      label: 'しゃけ',
      description: '香ばしく焼き上げた紅鮭を包んだおにぎり'
    },
    {
      id: 'rice_konbu',
      name: 'おにぎり(昆布)',
      category: CATEGORIES.DAILY,
      subCategory: SUBCATEGORIES.RICE,
      cost: 70,
      price: 130,
      shelfType: 'chilled',
      modelType: 'onigiri',
      color: '#27ae60',
      label: '昆布',
      description: '甘辛く煮詰めた利尻昆布の旨味広がるおにぎり'
    },
    {
      id: 'bento_makunouchi',
      name: '弁当(幕の内)',
      category: CATEGORIES.DAILY,
      subCategory: SUBCATEGORIES.RICE,
      cost: 350,
      price: 580,
      shelfType: 'chilled',
      modelType: 'bento',
      color: '#d35400',
      label: '幕の内',
      description: '煮物・揚物・焼き魚が贅沢に入った特製幕の内弁当'
    },
    {
      id: 'bento_salmon',
      name: '弁当(鮭)',
      category: CATEGORIES.DAILY,
      subCategory: SUBCATEGORIES.RICE,
      cost: 300,
      price: 500,
      shelfType: 'chilled',
      modelType: 'bento',
      color: '#c0392b',
      label: '鮭弁当',
      description: '大きな銀鮭の塩焼きが入った定番人気弁当'
    },
    {
      id: 'bento_noriben',
      name: '弁当(のり弁)',
      category: CATEGORIES.DAILY,
      subCategory: SUBCATEGORIES.RICE,
      cost: 250,
      price: 420,
      shelfType: 'chilled',
      modelType: 'bento',
      color: '#2c3e50',
      label: 'のり弁',
      description: '白身魚フライとちくわ天がのったボリューム満点のり弁'
    },

    // ---------------- デイリー：パン ----------------
    {
      id: 'bread_anko',
      name: 'コッペパン(あんこ)',
      category: CATEGORIES.DAILY,
      subCategory: SUBCATEGORIES.BREAD,
      cost: 75,
      price: 130,
      shelfType: 'chilled',
      modelType: 'koppepan',
      color: '#6c3483',
      label: 'あんこ',
      description: 'ふんわりパンに粒あんとマーガリンをサンド'
    },
    {
      id: 'bread_peanut',
      name: 'コッペパン(ピーナッツ)',
      category: CATEGORIES.DAILY,
      subCategory: SUBCATEGORIES.BREAD,
      cost: 75,
      price: 130,
      shelfType: 'chilled',
      modelType: 'koppepan',
      color: '#d4ac0d',
      label: 'ピーナツ',
      description: '粒入りピーナッツクリームの香ばしコッペパン'
    },
    {
      id: 'bread_anpan',
      name: 'アンパン',
      category: CATEGORIES.DAILY,
      subCategory: SUBCATEGORIES.BREAD,
      cost: 70,
      price: 120,
      shelfType: 'chilled',
      modelType: 'anpan',
      color: '#7d3c98',
      label: 'アンパン',
      description: '黒ごまを散らした昔ながらの王道こしあんぱん'
    },
    {
      id: 'bread_hotdog',
      name: 'ホットドッグ',
      category: CATEGORIES.DAILY,
      subCategory: SUBCATEGORIES.BREAD,
      cost: 120,
      price: 210,
      shelfType: 'chilled',
      modelType: 'hotdog',
      color: '#b03a2e',
      label: 'ドッグ',
      description: 'ジューシーなソーセージにケチャップ＆マスタード'
    },
    {
      id: 'bread_sandwich_egg',
      name: 'サンドイッチ(たまご)',
      category: CATEGORIES.DAILY,
      subCategory: SUBCATEGORIES.BREAD,
      cost: 140,
      price: 240,
      shelfType: 'chilled',
      modelType: 'sandwich',
      color: '#f1c40f',
      label: 'たまご',
      description: 'コクのある特製たまごサラダサンドイッチ'
    },
    {
      id: 'bread_sandwich_ham',
      name: 'サンドイッチ(ハムレタス)',
      category: CATEGORIES.DAILY,
      subCategory: SUBCATEGORIES.BREAD,
      cost: 160,
      price: 270,
      shelfType: 'chilled',
      modelType: 'sandwich',
      color: '#27ae60',
      label: 'ハムレタス',
      description: 'シャキシャキのレタスとポークハムの新鮮サンド'
    },

    // ---------------- 非デイリー：お菓子 ----------------
    {
      id: 'snack_chips_salt',
      name: 'ポテトチップス(うすしお)',
      category: CATEGORIES.NON_DAILY,
      subCategory: SUBCATEGORIES.SNACK,
      cost: 85,
      price: 150,
      shelfType: 'ambient',
      modelType: 'chipbag',
      color: '#f39c12',
      label: 'うすしお',
      description: '国産じゃがいもの風味を引き立てる塩味ポテチ'
    },
    {
      id: 'snack_chips_consomme',
      name: 'ポテトチップス(コンソメ)',
      category: CATEGORIES.NON_DAILY,
      subCategory: SUBCATEGORIES.SNACK,
      cost: 85,
      price: 150,
      shelfType: 'ambient',
      modelType: 'chipbag',
      color: '#e67e22',
      label: 'コンソメ',
      description: 'お肉と野菜の旨味を凝縮した濃厚コンソメパンチ'
    },
    {
      id: 'snack_ebisen',
      name: 'えびせん',
      category: CATEGORIES.NON_DAILY,
      subCategory: SUBCATEGORIES.SNACK,
      cost: 70,
      price: 130,
      shelfType: 'ambient',
      modelType: 'chipbag',
      color: '#e08282',
      label: 'えびせん',
      description: '香ばしいえびの風味とサクサク食感スナック'
    },
    {
      id: 'snack_chocolate',
      name: 'チョコレート',
      category: CATEGORIES.NON_DAILY,
      subCategory: SUBCATEGORIES.SNACK,
      cost: 75,
      price: 140,
      shelfType: 'ambient',
      modelType: 'chocolate',
      color: '#5b3924',
      label: 'チョコ',
      description: 'カカオのアロマ広がるミルク板チョコレート'
    },
    {
      id: 'snack_cookie',
      name: 'クッキー',
      category: CATEGORIES.NON_DAILY,
      subCategory: SUBCATEGORIES.SNACK,
      cost: 95,
      price: 170,
      shelfType: 'ambient',
      modelType: 'cookiebox',
      color: '#ca6f1e',
      label: 'クッキー',
      description: '発酵バターを使用したサクサクのチョコチップクッキー'
    },
    {
      id: 'snack_imokenpi',
      name: '芋けんぴ',
      category: CATEGORIES.NON_DAILY,
      subCategory: SUBCATEGORIES.SNACK,
      cost: 80,
      price: 145,
      shelfType: 'ambient',
      modelType: 'chipbag',
      color: '#b7950b',
      label: '芋けんぴ',
      description: '国産さつまいもをカリッと揚げて糖蜜を絡めた銘菓'
    },

    // ---------------- 非デイリー：ドリンク ----------------
    {
      id: 'drink_water',
      name: '水',
      category: CATEGORIES.NON_DAILY,
      subCategory: SUBCATEGORIES.DRINK,
      cost: 50,
      price: 110,
      shelfType: 'ambient',
      modelType: 'bottle',
      color: '#5dade2',
      label: '天然水',
      description: '清冽な美味しいミネラルウォーター'
    },
    {
      id: 'drink_cola',
      name: 'コーラ',
      category: CATEGORIES.NON_DAILY,
      subCategory: SUBCATEGORIES.DRINK,
      cost: 75,
      price: 150,
      shelfType: 'ambient',
      modelType: 'bottle',
      color: '#900c3f',
      label: 'コーラ',
      description: '爽快な刺激とコクが広がる強炭酸コーラ'
    },
    {
      id: 'drink_cider',
      name: 'サイダー',
      category: CATEGORIES.NON_DAILY,
      subCategory: SUBCATEGORIES.DRINK,
      cost: 75,
      price: 150,
      shelfType: 'ambient',
      modelType: 'bottle',
      color: '#1abc9c',
      label: 'サイダー',
      description: 'すっきりクリアな味わいの爽やか炭酸サイダー'
    },
    {
      id: 'drink_greentea',
      name: '緑茶',
      category: CATEGORIES.NON_DAILY,
      subCategory: SUBCATEGORIES.DRINK,
      cost: 70,
      price: 130,
      shelfType: 'ambient',
      modelType: 'bottle',
      color: '#229954',
      label: '緑茶',
      description: '一番茶の旨味と爽やかな渋みの本格緑茶'
    },
    {
      id: 'drink_barleytea',
      name: '麦茶',
      category: CATEGORIES.NON_DAILY,
      subCategory: SUBCATEGORIES.DRINK,
      cost: 70,
      price: 130,
      shelfType: 'ambient',
      modelType: 'bottle',
      color: '#af601a',
      label: '麦茶',
      description: '焙煎大麦の香ばしいミネラル麦茶'
    },
    {
      id: 'drink_blacktea',
      name: '紅茶',
      category: CATEGORIES.NON_DAILY,
      subCategory: SUBCATEGORIES.DRINK,
      cost: 75,
      price: 140,
      shelfType: 'ambient',
      modelType: 'bottle',
      color: '#ba4a00',
      label: 'ストレート',
      description: '華やかな香りとスッキリとした後味の紅茶'
    }
  ];

  const FIXTURE_CATALOG = [
    {
      id: 'shelf_ambient',
      name: '商品棚(非デイリー専用)',
      category: CATEGORIES.EQUIPMENT,
      subCategory: SUBCATEGORIES.SHELF,
      cost: 8000,
      price: 8000,
      shelfType: 'ambient',
      capacity: 18,
      description: 'お菓子やドリンクなど非デイリー常温品を並べる3段陳列棚'
    },
    {
      id: 'shelf_chilled',
      name: '冷蔵棚(デイリー専用)',
      category: CATEGORIES.EQUIPMENT,
      subCategory: SUBCATEGORIES.SHELF,
      cost: 15000,
      price: 15000,
      shelfType: 'chilled',
      capacity: 18,
      description: '米飯やお弁当、パンなど要冷蔵デイリー商品を陳列する冷蔵ショーケース'
    },
    {
      id: 'fixture_register',
      name: 'レジカウンター',
      category: CATEGORIES.EQUIPMENT,
      subCategory: SUBCATEGORIES.REGISTER,
      cost: 10000,
      price: 10000,
      shelfType: 'register',
      capacity: 0,
      description: 'お客様の会計を行うPOSレジスター＆カウンターデスク'
    }
  ];

  function getItemById(id) {
    return ITEM_CATALOG.find(i => i.id === id) || FIXTURE_CATALOG.find(f => f.id === id);
  }

  // ========================================================
  // 2. 音響マネージャー (Web Audio API)
  // ========================================================
  class SoundManager {
    constructor() {
      this.ctx = null;
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

    playScan() {
      this.init();
      if (!this.ctx) return;
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

    playDoorChime() {
      this.init();
      if (!this.ctx) return;
      const notes = [
        { f: 739.99, d: 0.18, p: 0.05 },
        { f: 587.33, d: 0.18, p: 0.05 },
        { f: 440.00, d: 0.18, p: 0.05 },
        { f: 587.33, d: 0.18, p: 0.08 },
        { f: 659.25, d: 0.22, p: 0.15 },
        { f: 880.00, d: 0.45, p: 0.20 },
        { f: 659.25, d: 0.18, p: 0.05 },
        { f: 739.99, d: 0.18, p: 0.05 },
        { f: 659.25, d: 0.18, p: 0.05 },
        { f: 440.00, d: 0.18, p: 0.05 },
        { f: 587.33, d: 0.50, p: 0.10 }
      ];
      let t = this.ctx.currentTime;
      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + n.d);
        t += n.d + n.p;
      });
    }

    playRegisterDing() {
      this.init();
      if (!this.ctx) return;
      const bell = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(1760, this.ctx.currentTime);
      bellGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      bell.connect(bellGain);
      bellGain.connect(this.ctx.destination);
      bell.start();
      bell.stop(this.ctx.currentTime + 0.8);

      setTimeout(() => {
        if (!this.ctx) return;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1400;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start();
      }, 100);
    }

    playPlaceItem() {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    }

    playBox() {
      this.init();
      if (!this.ctx) return;
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

    playCoin() {
      this.init();
      if (!this.ctx) return;
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

    playError() {
      this.init();
      if (!this.ctx) return;
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

    playSwitch(isOn = true) {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isOn ? 587 : 440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isOn ? 880 : 330, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    }
  }

  const soundManager = new SoundManager();

  // ========================================================
  // 3. 3Dモデル生成ヘルパー (Three.js プロシージャル)
  // ========================================================
  const textureCache = {};

  function createLabelTexture(text, bgColor = '#ffffff', textColor = '#111111', width = 256, height = 128) {
    const key = `${text}_${bgColor}_${textColor}_${width}_${height}`;
    if (textureCache[key]) return textureCache[key];

    // 高解像度化: 小さいテクスチャ(幅512未満)は2倍解像度で内部描画してジャギーを防止
    const scale = (width < 512 && height < 512) ? 2 : 1;
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // 背景
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // 枠線
    ctx.strokeStyle = bgColor === '#ffffff' ? '#bdc3c7' : 'rgba(255, 255, 255, 0.4)';
    const borderWidth = Math.max(2, Math.floor(Math.min(width, height) * 0.03));
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);

    // テキストを行ごとに分割
    const lines = text.split('\n');

    // 左右・上下のマージン (文字が見切れないよう10%余白を確保)
    const padX = width * 0.10;
    const padY = height * 0.10;
    const maxAllowedWidth = width - padX * 2;
    const maxAllowedHeight = height - padY * 2;

    // 縦幅から初期フォントサイズを決定
    let fontSize = Math.floor(maxAllowedHeight / (lines.length * 1.3));
    if (lines.length === 1) {
      fontSize = Math.floor(height * 0.48);
    }
    fontSize = Math.min(fontSize, 46);
    fontSize = Math.max(fontSize, 11);

    // 横幅が収まるようにフォントサイズを自動スケールダウン
    ctx.font = `bold ${fontSize}px "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif`;
    for (let l = 0; l < lines.length; l++) {
      const measured = ctx.measureText(lines[l]).width;
      if (measured > maxAllowedWidth && measured > 0) {
        const fitRatio = maxAllowedWidth / measured;
        fontSize = Math.max(10, Math.floor(fontSize * fitRatio));
        ctx.font = `bold ${fontSize}px "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif`;
      }
    }

    // 垂直方向の中央揃え
    const lineSpacing = fontSize * 1.32;
    const totalHeight = (lines.length - 1) * lineSpacing;
    const startY = (height / 2) - (totalHeight / 2);

    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, startY + i * lineSpacing);
    });

    const texture = new THREE.CanvasTexture(canvas);
    textureCache[key] = texture;
    return texture;
  }

  function createWhiteboardTexture() {
    const key = 'office_whiteboard_texture';
    if (textureCache[key]) return textureCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // ホワイトボード白板面
    ctx.fillStyle = '#fcfdfd';
    ctx.fillRect(0, 0, 1024, 512);

    // 外枠アルミフレーム (薄いシルバーグレー)
    ctx.strokeStyle = '#95a5a6';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, 1010, 498);

    // 内枠シャドウライン
    ctx.strokeStyle = '#bdc3c7';
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, 992, 480);

    // タイトルヘッダー背景 (落ち着いた濃紺)
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(24, 24, 976, 68);

    // タイトルテキスト
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px "Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📋 【店舗運営・業務連絡・注意事項】', 512, 58);

    // 注意事項リスト (左揃え・整然としたレイアウト)
    const items = [
      { num: '①', text: '発注した商品や什器は、バックヤード奥の【配達エリア】に届きます。', color: '#1a5276' },
      { num: '②', text: '陳列棚・冷蔵棚は、黄色い矢印【正面】を通路に向けて配置してください。', color: '#7d6608' },
      { num: '③', text: 'おにぎり・パン・飲料などのデイリー食品は、必ず【冷蔵棚】に陳列！', color: '#196f3d' },
      { num: '④', text: '開店・閉店（時間進行）は、PC横の【操作スイッチ】または [O] キーで切替。', color: '#922b21' },
      { num: '⑤', text: 'お客様がお会計待ちの際は、レジ前で [E] キーを押して精算を開始。', color: '#4a235a' }
    ];

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const startY = 135;
    const lineGap = 68;

    items.forEach((item, index) => {
      const y = startY + index * lineGap;

      // 行の背景ハイライト (薄いグレー)
      ctx.fillStyle = index % 2 === 0 ? 'rgba(236, 240, 241, 0.65)' : 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(36, y - 24, 952, 48);

      // 番号バッジ
      ctx.fillStyle = item.color;
      ctx.font = 'bold 26px "Noto Sans JP", sans-serif';
      ctx.fillText(item.num, 54, y);

      // 本文
      ctx.fillStyle = '#2c3e50';
      ctx.font = '600 24px "Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif';
      ctx.fillText(item.text, 100, y);
    });

    // 右下の注意書き
    ctx.fillStyle = '#7f8c8d';
    ctx.font = 'italic 18px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('※ 本日の営業目標: 廃棄ゼロ・顧客満足度100%達成！', 970, 480);

    const texture = new THREE.CanvasTexture(canvas);
    textureCache[key] = texture;
    return texture;
  }

  function createSecurityCamScreenTexture() {
    const key = 'office_security_cam_texture';
    if (textureCache[key]) return textureCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 背景 (ダークUI)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1024, 512);

    // ヘッダーバー (監視カメラシステム)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 1024, 48);

    // ウィンドウタイトル
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px "Noto Sans JP", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('📹 CCTV SECURITY SURVEILLANCE SYSTEM v3.4 [店内・搬入口 4分割監視]', 20, 24);

    // 録画中インジケーター (赤丸点滅風)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(880, 24, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('REC 🔴 08:35:12', 895, 24);

    // 4分割カメラの描画
    const cams = [
      { name: 'CAM 01: 店舗正面・売場全景', status: 'LIVE / MOTION ACTIVE', color: '#22c55e', bg: '#09151e' },
      { name: 'CAM 02: レジカウンター #01', status: 'LIVE / POS QUEUE OK', color: '#38bdf8', bg: '#0d1822' },
      { name: 'CAM 03: バックヤード・保管庫', status: 'LIVE / AREA SECURE', color: '#22c55e', bg: '#0b1620' },
      { name: 'CAM 04: 屋外・荷受配達エリア', status: 'LIVE / CARGO CLEAR', color: '#eab308', bg: '#101d24' }
    ];

    const camW = 492;
    const camH = 210;
    const padX = 14;
    const startY = 58;

    cams.forEach((cam, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const cx = padX + col * (camW + 12);
      const cy = startY + row * (camH + 10);

      // カメラ背景
      ctx.fillStyle = cam.bg;
      ctx.fillRect(cx, cy, camW, camH);

      // カメラ枠線
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx, cy, camW, camH);

      // 擬似パースペクティブ（透視線・床グリッド）
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;
      for (let g = 0; g <= camW; g += 40) {
        ctx.beginPath();
        ctx.moveTo(cx + g, cy + camH);
        ctx.lineTo(cx + camW / 2 + (g - camW / 2) * 0.3, cy + camH * 0.4);
        ctx.stroke();
      }
      for (let h = 0.4; h <= 1.0; h += 0.15) {
        ctx.beginPath();
        ctx.moveTo(cx + 20, cy + camH * h);
        ctx.lineTo(cx + camW - 20, cy + camH * h);
        ctx.stroke();
      }

      // カメラ内の物体・人物トラッキング枠（AI検知ボックス）
      if (i === 0) {
        // 売場の人物トラッキング
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx + 180, cy + 60, 70, 110);
        ctx.fillStyle = '#22c55e';
        ctx.font = '11px monospace';
        ctx.fillText('CUSTOMER #04 (98%)', cx + 180, cy + 52);

        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(cx + 310, cy + 75, 65, 95);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('CUSTOMER #05 (94%)', cx + 310, cy + 67);
      } else if (i === 1) {
        // レジPOSトラッキング
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx + 140, cy + 80, 110, 80);
        ctx.fillStyle = '#eab308';
        ctx.font = '11px monospace';
        ctx.fillText('POS TERMINAL [IDLE]', cx + 140, cy + 72);
      } else if (i === 3) {
        // 配達エリアのパレット・荷受枠
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx + 190, cy + 90, 120, 70);
        ctx.fillStyle = '#f97316';
        ctx.font = '11px monospace';
        ctx.fillText('DELIVERY ZONE [READY]', cx + 190, cy + 82);
      }

      // カメラ名オーバーレイ（左上）
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(cx + 8, cy + 8, 220, 24);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px "Noto Sans JP", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(cam.name, cx + 14, cy + 24);

      // ステータス（右下）
      ctx.fillStyle = cam.color;
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(cam.status, cx + camW - 12, cy + camH - 12);

      // 十字照準（クロスヘア）
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(cx + camW / 2 - 12, cy + camH / 2);
      ctx.lineTo(cx + camW / 2 + 12, cy + camH / 2);
      ctx.moveTo(cx + camW / 2, cy + camH / 2 - 12);
      ctx.lineTo(cx + camW / 2, cy + camH / 2 + 12);
      ctx.stroke();
    });

    // フッターステータスバー
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 484, 1024, 28);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SYSTEM: NORMAL | STORAGE: 4.2TB / 8.0TB (52%) | FPS: 30.0 | ENCRYPTION: AES-256 | NETWORK: 1Gbps OPTICAL', 16, 500);

    const texture = new THREE.CanvasTexture(canvas);
    textureCache[key] = texture;
    return texture;
  }

  function createErpOrderScreenTexture() {
    const key = 'office_erp_order_texture';
    if (textureCache[key]) return textureCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Windows 11 デスクトップ背景
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 1024, 512);

    // アプリケーションウィンドウ
    const winX = 12, winY = 12, winW = 1000, winH = 460;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(winX, winY, winW, winH);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(winX, winY, winW, winH);

    // ウィンドウタイトルバー
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(winX, winY, winW, 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Noto Sans JP", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏪 SuperConveni HQ ERP Suite v5.2 - [店舗発注・在庫リアルタイム管理]', winX + 16, winY + 20);

    // ウィンドウ右上の最小化・最大化・閉じるボタン
    [-56, -34, -12].forEach((bx, bi) => {
      ctx.fillStyle = bi === 2 ? '#ef4444' : '#64748b';
      ctx.fillRect(winX + winW + bx, winY + 12, 16, 16);
    });

    // 左サイドバー (ナビゲーションメニュー)
    const sideW = 200;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(winX, winY + 40, sideW, winH - 40);

    const menuItems = [
      { name: '📦 商品発注', active: true },
      { name: '🛠️ 備品・什器発注', active: false },
      { name: '📊 リアルタイム売上', active: false },
      { name: '📋 在庫補充アラート', active: false },
      { name: '🚚 納品配送追跡', active: false },
      { name: '👥 スタッフ管理', active: false }
    ];

    menuItems.forEach((item, mi) => {
      const my = winY + 54 + mi * 44;
      if (item.active) {
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(winX + 8, my - 6, sideW - 16, 36);
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = '#94a3b8';
      }
      ctx.font = 'bold 14px "Noto Sans JP", sans-serif';
      ctx.fillText(item.name, winX + 22, my + 12);
    });

    // メインコンテンツエリア (右側)
    const mainX = winX + sideW + 16;
    const mainY = winY + 52;
    const mainW = winW - sideW - 32;

    // 上部 KPI ダッシュボードカード (3枚)
    const kpis = [
      { label: '本日総売上', val: '¥64,800', sub: '前日比 +14.2%', col: '#22c55e' },
      { label: '来店客数', val: '148 人', sub: 'ピーク: 昼ラッシュ', col: '#38bdf8' },
      { label: '棚在庫充足率', val: '94.6 %', sub: '要補充: 2件', col: '#eab308' }
    ];

    const kpiW = (mainW - 24) / 3;
    kpis.forEach((kpi, ki) => {
      const kx = mainX + ki * (kpiW + 12);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(kx, mainY, kpiW, 76);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(kx, mainY, kpiW, 76);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px "Noto Sans JP", sans-serif';
      ctx.fillText(kpi.label, kx + 12, mainY + 18);

      ctx.fillStyle = kpi.col;
      ctx.font = 'bold 22px "Noto Sans JP", monospace';
      ctx.fillText(kpi.val, kx + 12, mainY + 44);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.fillText(kpi.sub, kx + 12, mainY + 64);
    });

    // 時間帯別売上グラフ (バーチャート)
    const chartY = mainY + 92;
    const chartW = mainW * 0.54;
    const chartH = 180;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(mainX, chartY, chartW, chartH);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(mainX, chartY, chartW, chartH);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 13px "Noto Sans JP", sans-serif';
    ctx.fillText('📈 時間帯別 売上・客数推移', mainX + 12, chartY + 20);

    const bars = [18, 42, 65, 85, 48, 52, 92, 78, 60, 40];
    const barW = (chartW - 40) / bars.length;
    bars.forEach((b, bi) => {
      const bh = (b / 100) * 110;
      const bx = mainX + 24 + bi * barW;
      const by = chartY + chartH - 30 - bh;

      ctx.fillStyle = bi === 6 ? '#22c55e' : (bi === 3 ? '#38bdf8' : '#3b82f6');
      ctx.fillRect(bx, by, barW - 6, bh);

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${8 + bi}h`, bx + (barW - 6) / 2, chartY + chartH - 12);
    });

    // 右側: 在庫アラート＆発注ステータス表
    ctx.textAlign = 'left';
    const tblX = mainX + chartW + 14;
    const tblW = mainW - chartW - 14;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(tblX, chartY, tblW, chartH);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(tblX, chartY, tblW, chartH);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 13px "Noto Sans JP", sans-serif';
    ctx.fillText('📋 在庫状況・発注サマリー', tblX + 12, chartY + 20);

    const stockItems = [
      { name: '🍙 特製おにぎり', stock: '14 / 18', status: '適正', col: '#22c55e' },
      { name: '🥪 サンドイッチ', stock: '6 / 18', status: '要補充⚠️', col: '#eab308' },
      { name: '🍵 緑茶 500ml', stock: '18 / 18', status: '満杯', col: '#38bdf8' },
      { name: '🍫 板チョコレート', stock: '12 / 18', status: '適正', col: '#22c55e' }
    ];

    stockItems.forEach((st, si) => {
      const sy = chartY + 44 + si * 32;
      ctx.fillStyle = '#f8fafc';
      ctx.font = '12px "Noto Sans JP", sans-serif';
      ctx.fillText(st.name, tblX + 12, sy);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.fillText(st.stock, tblX + 160, sy);

      ctx.fillStyle = st.col;
      ctx.font = 'bold 11px "Noto Sans JP", sans-serif';
      ctx.fillText(st.status, tblX + tblW - 65, sy);
    });

    // 下部クイック操作アクション
    const actY = chartY + chartH + 12;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(mainX, actY, mainW, 60);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(mainX, actY, mainW, 60);

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(mainX + 16, actY + 12, 160, 36);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px "Noto Sans JP", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🛒 発注カタログを開く', mainX + 96, actY + 30);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(mainX + 190, actY + 12, 150, 36);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('📦 配達エリア状況確認', mainX + 265, actY + 30);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Noto Sans JP", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('※ [TAB] または [E] で詳細発注画面を開けます', mainX + mainW - 16, actY + 30);

    // 最下部 Windows タスクバー
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 480, 1024, 32);
    ctx.strokeStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(0, 480);
    ctx.lineTo(1024, 480);
    ctx.stroke();

    // スタートボタンアイコン
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(16, 486, 20, 20);

    // 検索バー
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(48, 486, 120, 20);
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🔍 検索', 56, 496);

    // 右端タスクバー時計
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('14:35  2026/10/10', 1008, 496);

    const texture = new THREE.CanvasTexture(canvas);
    textureCache[key] = texture;
    return texture;
  }

  function createFloorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f4f6f7';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#d5dbdb';
    ctx.lineWidth = 4;
    for (let i = 0; i <= 512; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    return texture;
  }

  function createConveniFasciaTexture() {
    const key = 'conveni_fascia_texture';
    if (textureCache[key]) return textureCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // 3色ストライプ背景 (上部: 深緑, 中央: 白, 下部: オレンジ)
    ctx.fillStyle = '#1e824c';
    ctx.fillRect(0, 0, 1024, 38);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 38, 1024, 52);

    ctx.fillStyle = '#d35400';
    ctx.fillRect(0, 90, 1024, 38);

    // 金色の細ラインアクセント
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(0, 35, 1024, 4);
    ctx.fillRect(0, 89, 1024, 4);

    // 中央ロゴ＆店名
    ctx.fillStyle = '#1e824c';
    ctx.font = '800 40px "Noto Sans JP", "M PLUS Rounded 1c", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏪 SUPER CONVENI MARKET 🏪', 530, 64);

    // 24Hバッジ
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(25, 14, 115, 100);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 34px sans-serif';
    ctx.fillText('24H', 82, 50);
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('OPEN', 82, 84);

    // 右側キャッチコピー
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 20px "Noto Sans JP", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('年中無休・新鮮デイリー食品', 980, 64);

    const texture = new THREE.CanvasTexture(canvas);
    textureCache[key] = texture;
    return texture;
  }

  function createBuildingWindowTexture(floors = 4, cols = 4, winColor = '#7fb3d5', wallColor = '#bdc3c7') {
    const key = `bldg_${floors}_${cols}_${winColor}_${wallColor}`;
    if (textureCache[key]) return textureCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = wallColor;
    ctx.fillRect(0, 0, 512, 512);

    const padX = 24;
    const padY = 32;
    const winW = (512 - padX * (cols + 1)) / cols;
    const winH = (512 - padY * (floors + 1)) / floors;

    for (let f = 0; f < floors; f++) {
      for (let c = 0; c < cols; c++) {
        const x = padX + c * (winW + padX);
        const y = padY + f * (winH + padY);

        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x - 2, y - 2, winW + 4, winH + 4);

        ctx.fillStyle = winColor;
        ctx.fillRect(x, y, winW, winH);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(x + 2, y + 2, winW * 0.4, winH - 4);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    textureCache[key] = texture;
    return texture;
  }

  function createVendingMachineTexture(brandColor = '#c0392b', brandName = 'BEVERAGE') {
    const key = `vending_${brandColor}_${brandName}`;
    if (textureCache[key]) return textureCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = brandColor;
    ctx.fillRect(0, 0, 256, 512);

    // ブランド看板
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(brandName, 128, 45);

    // ディスプレイ部
    ctx.fillStyle = '#111111';
    ctx.fillRect(18, 70, 220, 260);

    const drinkCols = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
    for (let row = 0; row < 3; row++) {
      const y = 85 + row * 82;
      for (let col = 0; col < 5; col++) {
        const x = 28 + col * 42;
        ctx.fillStyle = drinkCols[col];
        ctx.fillRect(x, y, 26, 50);

        ctx.fillStyle = (row === 2) ? '#e74c3c' : '#2980b9';
        ctx.fillRect(x, y + 54, 26, 10);
      }
    }

    // コイン部
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(165, 345, 70, 45);
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(195, 355, 12, 22);

    // 取出口
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(30, 415, 196, 75);
    ctx.fillStyle = '#444444';
    ctx.fillRect(40, 425, 176, 55);

    const texture = new THREE.CanvasTexture(canvas);
    textureCache[key] = texture;
    return texture;
  }

  function createCrosswalkTexture() {
    const key = 'crosswalk_texture';
    if (textureCache[key]) return textureCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = '#ffffff';
    for (let y = 30; y < 512; y += 80) {
      ctx.fillRect(20, y, 472, 45);
    }

    const texture = new THREE.CanvasTexture(canvas);
    textureCache[key] = texture;
    return texture;
  }

  function createBackyardFloorTexture() {
    const key = 'backyard_floor_texture';
    if (textureCache[key]) return textureCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 倉庫用コンクリート・エポキシ床 (濃いめグレー)
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(0, 0, 512, 512);

    // 目地グリッド
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 3;
    for (let i = 0; i <= 512; i += 128) {
      ctx.beginPath();
      ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }

    // 周囲の黄色・黒の安全ハザードゼブラ線
    const stripeW = 28;
    for (let x = -512; x <= 1024; x += 32) {
      ctx.fillStyle = '#f1c40f';
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 16, 0);
      ctx.lineTo(x - 8, stripeW);
      ctx.lineTo(x - 24, stripeW);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x, 512 - stripeW);
      ctx.lineTo(x + 16, 512 - stripeW);
      ctx.lineTo(x - 8, 512);
      ctx.lineTo(x - 24, 512);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 7);
    textureCache[key] = texture;
    return texture;
  }

  function createOfficeCarpetTexture() {
    const key = 'office_carpet_texture';
    if (textureCache[key]) return textureCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // オフィス用タイルカーペット (シックなスレートブルーグレー)
    ctx.fillStyle = '#34495e';
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    for (let x = 0; x <= 256; x += 64) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
    }
    for (let y = 0; y <= 256; y += 64) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
    }

    // 細かい織り目パターン
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 256; i += 8) {
      ctx.fillRect(i, 0, 2, 256);
      ctx.fillRect(0, i, 256, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 7);
    textureCache[key] = texture;
    return texture;
  }

  function createDeliveryAreaTexture() {
    const key = 'delivery_area_texture';
    if (textureCache[key]) return textureCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // アスファルト
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, 512, 512);

    // 外枠の黄色・黒斜め警告ストライプ
    const border = 36;
    ctx.strokeStyle = '#f39c12';
    ctx.lineWidth = border;
    ctx.strokeRect(border / 2, border / 2, 512 - border, 512 - border);

    // 斜めハザード線
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 14;
    for (let i = -512; i <= 1024; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 512, 512);
      ctx.stroke();
    }

    // 中央エリア表示板
    ctx.fillStyle = '#1e272e';
    ctx.fillRect(40, 150, 432, 212);

    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 150, 432, 212);

    ctx.fillStyle = '#f1c40f';
    ctx.font = '800 32px "Noto Sans JP", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📦 配達受取エリア 📦', 256, 205);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('DELIVERY RECEIVING ZONE', 256, 255);

    ctx.fillStyle = '#bdc3c7';
    ctx.font = 'bold 18px "Noto Sans JP", sans-serif';
    ctx.fillText('※発注した備品・商品はここに届きます', 256, 305);

    const texture = new THREE.CanvasTexture(canvas);
    textureCache[key] = texture;
    return texture;
  }

  function createParkingLotTexture() {
    const key = 'parking_lot_texture';
    if (textureCache[key]) return textureCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 舗装アスファルト
    ctx.fillStyle = '#2c343d';
    ctx.fillRect(0, 0, 1024, 512);

    // 駐車枠白線 (U字型パーキングロット)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 10;

    const startX = 80;
    const stallW = 140;
    const stallDepth = 260;
    const stallY = 90;

    for (let i = 0; i < 6; i++) {
      const x = startX + i * stallW;
      ctx.strokeRect(x, stallY, stallW, stallDepth);

      // 車番号
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`P-${i + 1}`, x + stallW / 2, stallY + 35);
    }

    // 手前の進行方向矢印
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('⬆ 進入路 ENTRANCE ⬆', 512, 430);

    const texture = new THREE.CanvasTexture(canvas);
    textureCache[key] = texture;
    return texture;
  }

  // 軽量商品モデル生成 (低スペックPC向けに個別商品の影計算はOFF)
  function createProductMesh(item) {
    const group = new THREE.Group();
    group.userData = { itemId: item.id };
    const { modelType, color, label } = item;

    switch (modelType) {
      case 'onigiri': {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0.12);
        shape.lineTo(-0.11, -0.09);
        shape.lineTo(0.11, -0.09);
        shape.closePath();
        const extrudeSettings = { depth: 0.08, bevelEnabled: false };
        const riceGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const riceMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const rice = new THREE.Mesh(riceGeo, riceMat);
        rice.position.z = -0.04;
        group.add(rice);

        const noriGeo = new THREE.BoxGeometry(0.13, 0.14, 0.09);
        const noriMat = new THREE.MeshLambertMaterial({ color: 0x1b1b1b });
        const nori = new THREE.Mesh(noriGeo, noriMat);
        nori.position.y = -0.03;
        group.add(nori);

        const stickerGeo = new THREE.PlaneGeometry(0.08, 0.04);
        const stickerMat = new THREE.MeshBasicMaterial({ map: createLabelTexture(label, color, '#ffffff', 128, 64) });
        const sticker = new THREE.Mesh(stickerGeo, stickerMat);
        sticker.position.set(0, 0.01, 0.05);
        group.add(sticker);
        break;
      }

      case 'bento': {
        const baseGeo = new THREE.BoxGeometry(0.36, 0.06, 0.26);
        const baseMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
        const base = new THREE.Mesh(baseGeo, baseMat);
        group.add(base);

        const riceGeo = new THREE.BoxGeometry(0.16, 0.03, 0.22);
        const riceMat = new THREE.MeshLambertMaterial({ color: 0xfcfcfc });
        const rice = new THREE.Mesh(riceGeo, riceMat);
        rice.position.set(-0.08, 0.035, 0);
        group.add(rice);

        const umeGeo = new THREE.SphereGeometry(0.018, 5, 5);
        const umeMat = new THREE.MeshLambertMaterial({ color: 0xc0392b });
        const ume = new THREE.Mesh(umeGeo, umeMat);
        ume.position.set(-0.08, 0.052, 0);
        group.add(ume);

        const sideGeo = new THREE.BoxGeometry(0.14, 0.04, 0.22);
        const sideMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(color) });
        const side = new THREE.Mesh(sideGeo, sideMat);
        side.position.set(0.08, 0.04, 0);
        group.add(side);

        const labelGeo = new THREE.PlaneGeometry(0.18, 0.06);
        const labelMat = new THREE.MeshBasicMaterial({ map: createLabelTexture(label, '#ffffff', '#222222', 128, 48) });
        const labelMesh = new THREE.Mesh(labelGeo, labelMat);
        labelMesh.rotation.x = -Math.PI / 2;
        labelMesh.position.set(0, 0.062, 0);
        group.add(labelMesh);
        break;
      }

      case 'sandwich': {
        const shape = new THREE.Shape();
        shape.moveTo(-0.1, -0.1);
        shape.lineTo(0.1, -0.1);
        shape.lineTo(-0.1, 0.1);
        shape.closePath();
        const extrudeSettings = { depth: 0.12, bevelEnabled: false };
        const sandwichGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const sandwichMat = new THREE.MeshLambertMaterial({ color: 0xfdfefe });
        const sandwich = new THREE.Mesh(sandwichGeo, sandwichMat);
        sandwich.position.z = -0.06;
        group.add(sandwich);

        const fillGeo = new THREE.PlaneGeometry(0.14, 0.10);
        const fillMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(color) });
        const fill = new THREE.Mesh(fillGeo, fillMat);
        fill.rotation.set(0, -Math.PI / 4, 0);
        fill.position.set(0.02, 0, 0);
        group.add(fill);
        break;
      }

      case 'hotdog': {
        const bunGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.26, 8);
        bunGeo.rotateZ(Math.PI / 2);
        const bunMat = new THREE.MeshLambertMaterial({ color: 0xdeb887 });
        const bun = new THREE.Mesh(bunGeo, bunMat);
        group.add(bun);

        const sausGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.28, 8);
        sausGeo.rotateZ(Math.PI / 2);
        const sausMat = new THREE.MeshLambertMaterial({ color: 0x922b21 });
        const saus = new THREE.Mesh(sausGeo, sausMat);
        saus.position.y = 0.02;
        group.add(saus);
        break;
      }

      case 'anpan': {
        const panGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.06, 10);
        const panMat = new THREE.MeshLambertMaterial({ color: 0xd35400 });
        const pan = new THREE.Mesh(panGeo, panMat);
        group.add(pan);
        break;
      }

      case 'koppepan': {
        const panGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.26, 8);
        panGeo.rotateZ(Math.PI / 2);
        const panMat = new THREE.MeshLambertMaterial({ color: 0xedbb99 });
        const pan = new THREE.Mesh(panGeo, panMat);
        group.add(pan);

        const creamGeo = new THREE.BoxGeometry(0.22, 0.015, 0.03);
        const creamMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(color) });
        const cream = new THREE.Mesh(creamGeo, creamMat);
        cream.position.y = 0.04;
        group.add(cream);
        break;
      }

      case 'chipbag': {
        const bagGeo = new THREE.BoxGeometry(0.18, 0.24, 0.09);
        const bagMat = new THREE.MeshLambertMaterial({
          color: new THREE.Color(color),
          map: createLabelTexture(label, color, '#ffffff', 256, 128)
        });
        const bag = new THREE.Mesh(bagGeo, bagMat);
        group.add(bag);
        break;
      }

      case 'chocolate': {
        const chocGeo = new THREE.BoxGeometry(0.12, 0.20, 0.025);
        const chocMat = new THREE.MeshLambertMaterial({
          color: new THREE.Color(color),
          map: createLabelTexture('CHOCO', '#873600', '#f5b041', 128, 64)
        });
        const choc = new THREE.Mesh(chocGeo, chocMat);
        group.add(choc);
        break;
      }

      case 'cookiebox': {
        const boxGeo = new THREE.BoxGeometry(0.16, 0.20, 0.07);
        const boxMat = new THREE.MeshLambertMaterial({
          color: new THREE.Color(color),
          map: createLabelTexture('COOKIE', '#d35400', '#ffffff', 128, 64)
        });
        const cookie = new THREE.Mesh(boxGeo, boxMat);
        group.add(cookie);
        break;
      }

      case 'bottle':
      default: {
        const bodyGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.22, 8);
        const bodyMat = new THREE.MeshLambertMaterial({
          color: new THREE.Color(color),
          map: createLabelTexture(label, color, '#ffffff', 128, 64)
        });
        const bottle = new THREE.Mesh(bodyGeo, bodyMat);
        group.add(bottle);

        const capGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.03, 8);
        const capMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.y = 0.125;
        group.add(cap);
        break;
      }
    }

    return group;
  }

  // 1. 商品棚(非デイリー専用) - 常温棚 3段
  function createAmbientShelfModel() {
    const group = new THREE.Group();
    group.name = 'shelf_ambient';
    const frameMat = new THREE.MeshLambertMaterial({ color: 0xecf0f1 });
    const shelfPlateMat = new THREE.MeshLambertMaterial({ color: 0xbdc3c7 });

    const postGeo = new THREE.BoxGeometry(0.06, 1.8, 0.7);
    const leftPost = new THREE.Mesh(postGeo, frameMat);
    leftPost.position.set(-0.85, 0.9, 0);
    const rightPost = new THREE.Mesh(postGeo, frameMat);
    rightPost.position.set(0.85, 0.9, 0);
    group.add(leftPost, rightPost);

    const backGeo = new THREE.BoxGeometry(1.7, 1.8, 0.04);
    const back = new THREE.Mesh(backGeo, frameMat);
    back.position.set(0, 0.9, -0.33);
    group.add(back);

    const shelfYLevels = [0.35, 0.85, 1.35];
    const shelfGeo = new THREE.BoxGeometry(1.66, 0.05, 0.65);

    shelfYLevels.forEach(y => {
      const shelf = new THREE.Mesh(shelfGeo, shelfPlateMat);
      shelf.position.set(0, y, 0);
      group.add(shelf);

      const railGeo = new THREE.BoxGeometry(1.66, 0.04, 0.02);
      const railMat = new THREE.MeshLambertMaterial({ color: 0x34495e });
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(0, y, 0.33);
      group.add(rail);
    });

    const signGeo = new THREE.BoxGeometry(1.7, 0.22, 0.08);
    const signMat = new THREE.MeshBasicMaterial({
      map: createLabelTexture('常温商品・スナック・ドリンク', '#2c3e50', '#ffffff', 512, 64)
    });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 1.9, 0);
    group.add(sign);

    group.traverse(c => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    return group;
  }

  // 2. 冷蔵棚(デイリー専用) - 青色LED冷気付きショーケース
  function createChilledShelfModel() {
    const group = new THREE.Group();
    group.name = 'shelf_chilled';

    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
    const baseGeo = new THREE.BoxGeometry(1.8, 0.3, 0.8);
    const base = new THREE.Mesh(baseGeo, bodyMat);
    base.position.set(0, 0.15, 0);
    group.add(base);

    const backGeo = new THREE.BoxGeometry(1.8, 1.7, 0.08);
    const back = new THREE.Mesh(backGeo, bodyMat);
    back.position.set(0, 1.15, -0.36);
    group.add(back);

    const sideGeo = new THREE.BoxGeometry(0.08, 1.7, 0.76);
    const leftSide = new THREE.Mesh(sideGeo, bodyMat);
    leftSide.position.set(-0.86, 1.15, 0.02);
    const rightSide = new THREE.Mesh(sideGeo, bodyMat);
    rightSide.position.set(0.86, 1.15, 0.02);
    group.add(leftSide, rightSide);

    const topGeo = new THREE.BoxGeometry(1.8, 0.15, 0.8);
    const top = new THREE.Mesh(topGeo, bodyMat);
    top.position.set(0, 2.05, 0);
    group.add(top);

    const shelfYLevels = [0.55, 1.05, 1.55];
    const shelfGeo = new THREE.BoxGeometry(1.64, 0.04, 0.68);
    const shelfMat = new THREE.MeshLambertMaterial({ color: 0xd6eaf8 });

    shelfYLevels.forEach(y => {
      const shelf = new THREE.Mesh(shelfGeo, shelfMat);
      shelf.position.set(0, y, 0.04);
      group.add(shelf);
    });

    const signGeo = new THREE.BoxGeometry(1.7, 0.2, 0.08);
    const signMat = new THREE.MeshBasicMaterial({
      map: createLabelTexture('❄️ 要冷蔵 デイリー(米飯・パン) ❄️', '#1b4f72', '#5dade2', 512, 64)
    });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 2.15, 0);
    group.add(sign);

    const coldLight = new THREE.PointLight(0x5dade2, 0.6, 2.5);
    coldLight.position.set(0, 1.6, 0.2);
    group.add(coldLight);

    group.traverse(c => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    return group;
  }

  // 3. レジカウンター
  function createRegisterModel() {
    const group = new THREE.Group();
    group.name = 'fixture_register';

    const deskMat = new THREE.MeshLambertMaterial({ color: 0x34495e });
    const topMat = new THREE.MeshLambertMaterial({ color: 0xecf0f1 });

    const deskGeo = new THREE.BoxGeometry(1.8, 0.85, 0.9);
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, 0.425, 0);
    group.add(desk);

    const topGeo = new THREE.BoxGeometry(1.86, 0.05, 0.96);
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.set(0, 0.875, 0);
    group.add(top);

    const posBaseGeo = new THREE.BoxGeometry(0.35, 0.12, 0.35);
    const posBaseMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const posBase = new THREE.Mesh(posBaseGeo, posBaseMat);
    posBase.position.set(0.35, 0.96, 0);
    group.add(posBase);

    const screenPoleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.25, 8);
    const screenPole = new THREE.Mesh(screenPoleGeo, posBaseMat);
    screenPole.position.set(0.35, 1.12, 0);
    group.add(screenPole);

    const screenGeo = new THREE.BoxGeometry(0.4, 0.3, 0.04);
    const screenMat = new THREE.MeshBasicMaterial({
      map: createLabelTexture('POS READY\nお会計', '#1a5276', '#ffffff', 256, 192)
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0.35, 1.28, 0);
    screen.rotation.y = -Math.PI / 8;
    group.add(screen);

    const scanGunGeo = new THREE.BoxGeometry(0.06, 0.14, 0.08);
    const scanGunMat = new THREE.MeshLambertMaterial({ color: 0x2ecc71 });
    const scanGun = new THREE.Mesh(scanGunGeo, scanGunMat);
    scanGun.position.set(0.05, 0.97, 0.2);
    scanGun.rotation.z = Math.PI / 6;
    group.add(scanGun);

    const basketZoneGeo = new THREE.PlaneGeometry(0.45, 0.4);
    const basketZoneMat = new THREE.MeshBasicMaterial({
      map: createLabelTexture('かご置き場', '#f1c40f', '#222222', 256, 128)
    });
    const basketZone = new THREE.Mesh(basketZoneGeo, basketZoneMat);
    basketZone.rotation.x = -Math.PI / 2;
    basketZone.position.set(-0.45, 0.902, 0);
    group.add(basketZone);

    const poleGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.2, 8);
    const pole = new THREE.Mesh(poleGeo, posBaseMat);
    pole.position.set(0.8, 1.1, -0.4);
    group.add(pole);

    const regSignGeo = new THREE.BoxGeometry(0.5, 0.25, 0.05);
    const regSignMat = new THREE.MeshBasicMaterial({
      map: createLabelTexture('お会計\nREG 1', '#27ae60', '#ffffff', 256, 128)
    });
    const regSign = new THREE.Mesh(regSignGeo, regSignMat);
    regSign.position.set(0.8, 2.1, -0.4);
    group.add(regSign);

    group.traverse(c => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    return group;
  }

  // 4. 配達ダンボール箱 (商品用 ＆ 備品用)
  function createDeliveryBoxMesh(options, countIfLegacy) {
    const group = new THREE.Group();
    group.name = 'delivery_box';

    let isFixture = false;
    let item = null;
    let count = 12;
    let fixture = null;

    if (options && options.isFixture) {
      isFixture = true;
      fixture = options.fixture;
    } else if (options && options.item) {
      item = options.item;
      count = options.count || 12;
    } else {
      item = options;
      count = countIfLegacy || 12;
    }

    if (isFixture && fixture) {
      group.userData = {
        isFixtureBox: true,
        fixture: fixture,
        itemName: `[備品] ${fixture.name}`
      };

      const boxGeo = new THREE.BoxGeometry(0.85, 0.65, 0.7);
      const boxMat = new THREE.MeshLambertMaterial({
        color: 0xba8c59,
        map: createLabelTexture(`📦 備品ダンボール\n${fixture.name}`, '#ba8c59', '#2c1e13', 384, 192)
      });
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.position.y = 0.325;
      group.add(box);

      const tapeMat = new THREE.MeshLambertMaterial({ color: 0x6e2c00 });
      const tapeX = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.08, 0.12), tapeMat);
      tapeX.position.y = 0.655;
      group.add(tapeX);

      const tapeZ = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.71), tapeMat);
      tapeZ.position.y = 0.655;
      group.add(tapeZ);
    } else if (item) {
      group.userData = {
        isFixtureBox: false,
        itemId: item.id,
        count: count,
        itemName: item.name,
        item: item
      };

      const boxGeo = new THREE.BoxGeometry(0.5, 0.38, 0.4);
      const boxMat = new THREE.MeshLambertMaterial({
        color: 0xc89d6c,
        map: createLabelTexture(`${item.name}\nx${count}`, '#c89d6c', '#3e2723', 256, 128)
      });
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.position.y = 0.19;
      group.add(box);

      const tapeGeo = new THREE.BoxGeometry(0.51, 0.06, 0.08);
      const tapeMat = new THREE.MeshLambertMaterial({ color: 0x935116 });
      const tape = new THREE.Mesh(tapeGeo, tapeMat);
      tape.position.y = 0.385;
      group.add(tape);
    }

    group.traverse(c => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    return group;
  }

  // 5. キャラクター (客 & 従業員)
  function createHumanoidModel(options = {}) {
    const {
      isEmployee = false,
      outfitColor = 0x3498db,
      skinColor = 0xffe0bd,
      hairColor = 0x2c3e50,
      hasBasket = false,
      badgeText = ''
    } = options;

    const group = new THREE.Group();

    const headGeo = new THREE.BoxGeometry(0.26, 0.28, 0.26);
    const skinMat = new THREE.MeshLambertMaterial({ color: skinColor });
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.55;
    group.add(head);

    const hairGeo = new THREE.BoxGeometry(0.28, 0.12, 0.28);
    const hairMat = new THREE.MeshLambertMaterial({ color: hairColor });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.7, 0);
    group.add(hair);

    const bodyGeo = new THREE.BoxGeometry(0.38, 0.55, 0.26);
    const bodyMat = new THREE.MeshLambertMaterial({ color: isEmployee ? 0x27ae60 : outfitColor });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.12;
    group.add(body);

    if (isEmployee) {
      const badgeGeo = new THREE.PlaneGeometry(0.12, 0.06);
      const badgeMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture('STAFF', '#ffffff', '#222222', 128, 64)
      });
      const badge = new THREE.Mesh(badgeGeo, badgeMat);
      badge.position.set(0.1, 1.25, 0.135);
      group.add(badge);
    }

    const legGeo = new THREE.BoxGeometry(0.14, 0.75, 0.18);
    const pantsMat = new THREE.MeshLambertMaterial({ color: isEmployee ? 0x2c3e50 : 0x34495e });
    const leftLeg = new THREE.Mesh(legGeo, pantsMat);
    leftLeg.position.set(-0.11, 0.38, 0);
    const rightLeg = new THREE.Mesh(legGeo, pantsMat);
    rightLeg.position.set(0.11, 0.38, 0);
    group.add(leftLeg, rightLeg);

    const armGeo = new THREE.BoxGeometry(0.11, 0.55, 0.14);
    const armMat = new THREE.MeshLambertMaterial({ color: isEmployee ? 0x27ae60 : outfitColor });
    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.25, 1.1, 0);
    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.25, 1.1, 0);
    group.add(leftArm, rightArm);

    let basket = null;
    if (hasBasket) {
      const basketGeo = new THREE.BoxGeometry(0.28, 0.18, 0.22);
      const basketMat = new THREE.MeshLambertMaterial({ color: 0xe74c3c });
      basket = new THREE.Mesh(basketGeo, basketMat);
      basket.position.set(0.3, 0.85, 0.15);
      group.add(basket);
    }

    if (badgeText) {
      const tagCanvas = document.createElement('canvas');
      tagCanvas.width = 300;
      tagCanvas.height = 70;
      const tagCtx = tagCanvas.getContext('2d');
      tagCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      tagCtx.fillRect(0, 0, 300, 70);
      tagCtx.strokeStyle = isEmployee ? '#2ecc71' : '#f39c12';
      tagCtx.lineWidth = 4;
      tagCtx.strokeRect(2, 2, 296, 66);
      tagCtx.fillStyle = '#ffffff';
      tagCtx.font = 'bold 24px "Hiragino Kaku Gothic ProN", Meiryo, sans-serif';
      tagCtx.textAlign = 'center';
      tagCtx.textBaseline = 'middle';
      tagCtx.fillText(badgeText, 150, 35);

      const tagTexture = new THREE.CanvasTexture(tagCanvas);
      const spriteMat = new THREE.SpriteMaterial({ map: tagTexture, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.2, 0.3, 1);
      sprite.position.set(0, 1.95, 0);
      group.add(sprite);
    }

    group.userData.leftLeg = leftLeg;
    group.userData.rightLeg = rightLeg;
    group.userData.leftArm = leftArm;
    group.userData.rightArm = rightArm;
    group.userData.basket = basket;
    group.userData.animTime = Math.random() * 10;

    group.traverse(c => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    return group;
  }

  // ========================================================
  // 4. 棚・店舗状態管理 (Store)
  // ========================================================
  class ShelfInstance {
    constructor(type, position, rotationY = 0) {
      this.id = 'shelf_' + Math.random().toString(36).substr(2, 9);
      this.type = type;
      this.capacity = 18;
      this.slots = [];

      this.mesh = this.type === 'ambient' ? createAmbientShelfModel() : createChilledShelfModel();
      this.mesh.position.copy(position);
      this.mesh.rotation.y = rotationY;
      this.mesh.userData = { shelfInstance: this, isInteractable: true };

      this.itemContainer = new THREE.Group();
      this.mesh.add(this.itemContainer);
    }

    canAcceptItem(item) {
      if (!item) return false;
      if (this.type === 'ambient') {
        return item.category === CATEGORIES.NON_DAILY;
      } else if (this.type === 'chilled') {
        return item.category === CATEGORIES.DAILY;
      }
      return false;
    }

    addItem(item, count = 1) {
      if (!this.canAcceptItem(item)) return 0;

      const currentTotal = this.getTotalItemCount();
      const canAdd = Math.min(count, this.capacity - currentTotal);
      if (canAdd <= 0) return 0;

      let existingSlot = this.slots.find(s => s.itemId === item.id);
      if (existingSlot) {
        existingSlot.count += canAdd;
      } else {
        this.slots.push({
          itemId: item.id,
          count: canAdd
        });
      }

      this.updateVisuals();
      soundManager.playPlaceItem();
      return canAdd;
    }

    getTotalItemCount() {
      return this.slots.reduce((sum, s) => sum + Math.max(0, s.count), 0);
    }

    updateVisuals() {
      while (this.itemContainer.children.length > 0) {
        this.itemContainer.remove(this.itemContainer.children[0]);
      }

      const yLevels = this.type === 'ambient' ? [0.42, 0.92, 1.42] : [0.62, 1.12, 1.62];
      let currentSlotIndex = 0;
      const maxPerShelf = 6;

      this.slots.forEach(slot => {
        if (!slot || slot.count <= 0) return;
        const itemMaster = getItemById(slot.itemId);
        if (!itemMaster) return;

        for (let i = 0; i < slot.count; i++) {
          if (currentSlotIndex >= this.capacity) break;

          const shelfTier = Math.floor(currentSlotIndex / maxPerShelf);
          const col = currentSlotIndex % maxPerShelf;

          const prodMesh = createProductMesh(itemMaster);
          const xOffset = -0.62 + col * 0.25;
          const yOffset = yLevels[shelfTier] || yLevels[0];
          const zOffset = 0.05;

          prodMesh.position.set(xOffset, yOffset, zOffset);
          this.itemContainer.add(prodMesh);
          currentSlotIndex++;
        }
      });
    }
  }

  class RegisterInstance {
    constructor(position, rotationY = 0) {
      this.mesh = createRegisterModel();
      this.mesh.position.copy(position);
      this.mesh.rotation.y = rotationY;
      this.mesh.userData = { isRegister: true, registerInstance: this };
    }
  }

  class Store {
    constructor(scene) {
      this.scene = scene;
      this.cash = 60000;
      this.dailyRevenue = 0;
      this.dailyCost = 0;
      this.dailyCustomersServed = 0;

      this.hour = 8;
      this.minute = 0;
      this.timeScale = 6.0;
      this.isTimeRunning = false;
      this.dayEndedFired = false;

      this.shelves = [];
      this.register = null;
      this.deliveryBoxes = [];

      this.registerQueue = [];
      this.currentRegisterCustomer = null;
      this.dayNumber = 1;
    }

    update(delta) {
      if (!this.isTimeRunning) return;

      this.minute += delta * this.timeScale;
      if (this.minute >= 60) {
        this.hour += Math.floor(this.minute / 60);
        this.minute = this.minute % 60;
      }

      // 22:00 (閉店時間) 到達時の処理
      if (this.hour >= 22) {
        this.hour = 22;
        this.minute = 0;

        // レジ待ち客・会計中客が全員終了したら日次決算へ移行
        if (this.registerQueue.length === 0 && !this.currentRegisterCustomer && !this.dayEndedFired) {
          this.dayEndedFired = true;
          this.isTimeRunning = false;
          window.dispatchEvent(new CustomEvent('store-day-ended', {
            detail: {
              day: this.dayNumber,
              revenue: this.dailyRevenue,
              cost: this.dailyCost,
              profit: this.dailyRevenue - this.dailyCost,
              customersServed: this.dailyCustomersServed
            }
          }));
        }
      }
    }

    startDay() {
      this.isTimeRunning = true;
      this.dayEndedFired = false;
    }

    pauseDay() {
      this.isTimeRunning = false;
    }

    advanceToNextDay() {
      this.dayNumber++;
      this.hour = 8;
      this.minute = 0;
      this.isTimeRunning = false;
      this.dayEndedFired = false;
      this.dailyRevenue = 0;
      this.dailyCost = 0;
      this.dailyCustomersServed = 0;
    }

    purchaseFixture(fixtureId) {
      const fixture = FIXTURE_CATALOG.find(f => f.id === fixtureId);
      if (!fixture) return { success: false, msg: '該当の備品が見つかりません' };
      if (this.cash < fixture.cost) return { success: false, msg: '資金が不足しています' };

      this.cash -= fixture.cost;
      this.dailyCost += fixture.cost;
      soundManager.playRegisterDing();

      // 仕様: 発注した備品(棚・レジ)はダンボールに入った状態で店の外に配達される
      this.spawnFixtureDeliveryBox(fixture);
      return { success: true, fixture };
    }

    purchaseItem(itemId, count = 12) {
      const item = ITEM_CATALOG.find(i => i.id === itemId);
      if (!item) return { success: false, msg: '商品が見つかりません' };

      const totalCost = item.cost * count;
      if (this.cash < totalCost) return { success: false, msg: '資金が不足しています' };

      this.cash -= totalCost;
      this.dailyCost += totalCost;
      soundManager.playRegisterDing();

      // 仕様: 発注した商品はダンボールに入った状態で店の外に配達される
      this.spawnDeliveryBox(item, count);
      return { success: true, item, count };
    }

    spawnDeliveryBox(item, count) {
      const boxMesh = createDeliveryBoxMesh({ isFixture: false, item, count });
      this.placeBoxInDeliveryZone(boxMesh);
      this.deliveryBoxes.push({
        isFixtureBox: false,
        item,
        count,
        mesh: boxMesh,
        itemName: item.name
      });
    }

    spawnFixtureDeliveryBox(fixture) {
      const boxMesh = createDeliveryBoxMesh({ isFixture: true, fixture });
      this.placeBoxInDeliveryZone(boxMesh);
      this.deliveryBoxes.push({
        isFixtureBox: true,
        fixture,
        mesh: boxMesh,
        itemName: `[備品] ${fixture.name}`
      });
    }

    placeBoxInDeliveryZone(boxMesh, customPos = null) {
      if (customPos) {
        boxMesh.position.copy(customPos);
      } else {
        const boxIndex = this.deliveryBoxes.length;
        const col = boxIndex % 3;
        const row = Math.floor(boxIndex / 3) % 4;

        // 仕様: バックヤード奥の勝手口(z=-7.0, x=-9.8)の真裏、屋外配達受取エリアに整然と配置
        const x = -8.5 - col * 0.95;
        const z = -8.3 - row * 0.95;

        boxMesh.position.set(x, 0, z);
      }
      this.scene.add(boxMesh);
    }

    pickUpBox(boxMesh) {
      const idx = this.deliveryBoxes.findIndex(b => b.mesh === boxMesh);
      if (idx === -1) return null;

      const boxData = this.deliveryBoxes.splice(idx, 1)[0];
      this.scene.remove(boxMesh);
      soundManager.playBox();
      return boxData;
    }

    addShelf(type, position, rotationY = 0) {
      const shelf = new ShelfInstance(type, position, rotationY);
      this.shelves.push(shelf);
      this.scene.add(shelf.mesh);
      return shelf;
    }

    setRegister(position, rotationY = 0) {
      if (this.register) {
        this.scene.remove(this.register.mesh);
      }
      this.register = new RegisterInstance(position, rotationY);
      this.scene.add(this.register.mesh);
      return this.register;
    }
  }

  // ========================================================
  // 5. 客ロジック ＆ AI (年代・職業・固定客・時間帯ピーク)
  // ========================================================
  const OCCUPATIONS = {
    STUDENT: '学生',
    WORKER: '会社員',
    HOMEMAKER: '主婦',
    SENIOR: 'シニア'
  };

  const CUSTOMER_TYPES = {
    REGULAR: '固定客',
    FLOATING: '流動客'
  };

  class Customer {
    constructor(options = {}) {
      this.id = 'cust_' + Math.random().toString(36).substr(2, 9);
      this.age = options.age || '20代';
      this.occupation = options.occupation || OCCUPATIONS.WORKER;
      this.customerType = options.customerType || CUSTOMER_TYPES.FLOATING;

      this.basket = [];
      this.targetItemIds = [];
      this.targetItemCount = 1;
      this.state = 'ENTERING';
      this.subState = 0;

      this.targetPos = new THREE.Vector3(0, 0, 0);
      this.speed = 2.2;
      this.currentShelfTarget = null;
      this.waitTimer = 0;

      this.givenCash = 0;
      this.totalPrice = 0;
      this.isFinished = false;

      this.setupPreferences();

      const outfitColors = {
        [OCCUPATIONS.STUDENT]: 0x2980b9,
        [OCCUPATIONS.WORKER]: 0x34495e,
        [OCCUPATIONS.HOMEMAKER]: 0xe67e22,
        [OCCUPATIONS.SENIOR]: 0x7f8c8d
      };

      const badgeText = `${this.occupation} ${this.age}・${this.customerType}`;
      this.mesh = createHumanoidModel({
        isEmployee: false,
        outfitColor: outfitColors[this.occupation] || 0x2980b9,
        hairColor: (this.age === '50代' || this.age === '60代以上') ? 0xbdc3c7 : 0x2c3e50,
        hasBasket: true,
        badgeText: badgeText
      });

      // 駐車場に出現
      const spawnX = (Math.random() - 0.5) * 4.0;
      this.mesh.position.set(spawnX, 0, 14.0);
      // 外側ドア前ウェイポイント
      this.targetPos.set(0, 0, 8.2);
    }

    setupPreferences() {
      let desiredCount = 2;
      let preferredIds = [];

      switch (this.age) {
        case '10代':
          desiredCount = Math.floor(Math.random() * 3) + 1;
          preferredIds = [
            'snack_chips_salt', 'snack_chips_consomme', 'snack_chocolate', 'snack_ebisen',
            'drink_cola', 'drink_cider', 'bread_hotdog', 'bread_anko', 'rice_tsunamayo'
          ];
          break;

        case '20代':
          desiredCount = Math.floor(Math.random() * 3) + 2;
          preferredIds = [
            'bento_noriben', 'bento_salmon', 'bread_sandwich_egg', 'bread_sandwich_ham',
            'drink_water', 'drink_greentea', 'rice_tsunamayo', 'rice_salmon', 'drink_cola'
          ];
          break;

        case '30代':
        case '40代':
          if (this.occupation === OCCUPATIONS.HOMEMAKER) {
            desiredCount = Math.floor(Math.random() * 4) + 3;
            preferredIds = [
              'bread_anko', 'bread_peanut', 'bread_anpan', 'bread_sandwich_ham',
              'snack_cookie', 'snack_imokenpi', 'snack_chips_salt', 'drink_barleytea',
              'drink_blacktea', 'rice_salmon', 'rice_konbu'
            ];
          } else {
            desiredCount = Math.floor(Math.random() * 3) + 2;
            preferredIds = [
              'bento_makunouchi', 'bento_salmon', 'bread_sandwich_ham',
              'drink_greentea', 'drink_water', 'rice_salmon', 'snack_chocolate'
            ];
          }
          break;

        case '50代':
        case '60代以上':
          desiredCount = Math.floor(Math.random() * 3) + 1;
          preferredIds = [
            'bento_salmon', 'bento_makunouchi', 'rice_konbu', 'rice_salmon',
            'drink_greentea', 'drink_barleytea', 'snack_imokenpi', 'bread_anpan'
          ];
          break;
      }

      if (this.customerType === CUSTOMER_TYPES.REGULAR) {
        desiredCount = Math.min(desiredCount + 1, 6);
      }

      this.targetItemCount = desiredCount;
      this.targetItemIds = preferredIds;
    }

    update(delta, store) {
      if (this.waitTimer > 0) {
        this.waitTimer -= delta;
        this.animate(0, delta);
        return;
      }

      switch (this.state) {
        case 'ENTERING':
          this.updateEntering(delta, store);
          break;
        case 'SHOPPING':
          this.updateShopping(delta, store);
          break;
        case 'TO_REGISTER':
          this.updateToRegister(delta, store);
          break;
        case 'QUEUEING':
          this.updateQueueing(delta, store);
          break;
        case 'CHECKOUT':
          this.animate(0, delta);
          break;
        case 'LEAVING':
          this.updateLeaving(delta, store);
          break;
      }
    }

    updateEntering(delta, store) {
      const reached = this.moveTowards(this.targetPos, delta);
      if (reached) {
        if (this.subState === 0) {
          // ドア外側からドア内側へ進む
          this.subState = 1;
          this.targetPos.set(0, 0, 5.5);
        } else {
          // 店内進入完了
          soundManager.playDoorChime();
          this.state = 'SHOPPING';
          this.pickNextShelfTarget(store);
        }
      }
    }

    pickNextShelfTarget(store) {
      if (this.basket.length >= this.targetItemCount) {
        this.goToRegister(store);
        return;
      }

      const availableShelves = store.shelves.filter(s => s.slots.some(slot => slot && slot.count > 0));

      if (availableShelves.length === 0) {
        if (this.basket.length > 0) {
          this.goToRegister(store);
        } else {
          this.startLeaving();
        }
        return;
      }

      let preferredShelves = availableShelves.filter(s => {
        return s.slots.some(slot => slot && slot.count > 0 && this.targetItemIds.includes(slot.itemId));
      });

      const chosenShelf = preferredShelves.length > 0
        ? preferredShelves[Math.floor(Math.random() * preferredShelves.length)]
        : availableShelves[Math.floor(Math.random() * availableShelves.length)];

      this.currentShelfTarget = chosenShelf;
      const forward = new THREE.Vector3(0, 0, 1).applyEuler(chosenShelf.mesh.rotation);
      const standPos = chosenShelf.mesh.position.clone().add(forward.multiplyScalar(0.95));
      // 棚の前位置にクランプ
      standPos.x = Math.max(-4.8, Math.min(4.8, standPos.x));
      standPos.z = Math.max(-5.5, Math.min(5.5, standPos.z));
      this.targetPos.copy(standPos);
    }

    updateShopping(delta, store) {
      const reached = this.moveTowards(this.targetPos, delta);
      if (reached) {
        if (this.currentShelfTarget) {
          this.mesh.lookAt(this.currentShelfTarget.mesh.position.x, this.mesh.position.y, this.currentShelfTarget.mesh.position.z);

          // 好みの商品を優先してピッキング
          let slot = this.currentShelfTarget.slots.find(s => s && s.count > 0 && this.targetItemIds.includes(s.itemId));
          if (!slot) {
            slot = this.currentShelfTarget.slots.find(s => s && s.count > 0);
          }

          if (slot) {
            slot.count--;
            this.currentShelfTarget.updateVisuals();
            const itemMaster = ITEM_CATALOG.find(i => i.id === slot.itemId);
            if (itemMaster) {
              this.basket.push({ item: itemMaster, price: itemMaster.price });
              this.totalPrice += itemMaster.price;
            }
          }
        }
        this.waitTimer = 1.0 + Math.random() * 0.5;
        this.pickNextShelfTarget(store);
      }
    }

    goToRegister(store) {
      if (!store.register) {
        this.startLeaving();
        return;
      }
      this.state = 'TO_REGISTER';
      if (!store.registerQueue.includes(this)) {
        store.registerQueue.push(this);
      }
      this.updateQueuePosition(store);
    }

    computeQueuePosition(store, queueIndex) {
      if (!store.register) return new THREE.Vector3(0, 0, 0);

      const regPos = store.register.mesh.position;
      const regRot = store.register.mesh.rotation.y;
      // レジの正面方向 (+Z)
      const forward = new THREE.Vector3(0, 0, 1).applyEuler(new THREE.Euler(0, regRot, 0));

      // 1人目はレジ正面のお客様側カウンター前 (0.95m手前)
      let curPos = regPos.clone().add(forward.clone().multiplyScalar(0.95));
      curPos.y = 0;
      curPos.x = THREE.MathUtils.clamp(curPos.x, -5.2, 5.2);
      curPos.z = THREE.MathUtils.clamp(curPos.z, -5.8, 5.2);

      if (queueIndex === 0) return curPos;

      // 2人目以降は1人ずつ後ろに並ぶが、正面ガラス(z=7.0)や外壁に当たらないよう曲げる
      let dir = forward.clone();
      const stepDist = 0.95;

      for (let i = 1; i <= queueIndex; i++) {
        let testNext = curPos.clone().add(dir.clone().multiplyScalar(stepDist));

        // 正面ガラス(z=7.0)に近づいたら(z > 4.8)、通路の中央・横方向へスネークさせる
        if (testNext.z > 4.8) {
          const bendX = curPos.x >= 0 ? -1 : 1;
          dir.set(bendX, 0, 0);
          testNext = curPos.clone().add(dir.clone().multiplyScalar(stepDist));
        }

        // 左右の壁に近づいたら店舗奥(-Z)へ曲げる
        if (Math.abs(testNext.x) > 4.8) {
          dir.set(0, 0, -1);
          testNext = curPos.clone().add(dir.clone().multiplyScalar(stepDist));
        }

        // 奥の壁に近づいたら中央へ曲げる
        if (testNext.z < -5.4) {
          const bendX = curPos.x >= 0 ? -1 : 1;
          dir.set(bendX, 0, 0);
          testNext = curPos.clone().add(dir.clone().multiplyScalar(stepDist));
        }

        testNext.x = THREE.MathUtils.clamp(testNext.x, -5.2, 5.2);
        testNext.z = THREE.MathUtils.clamp(testNext.z, -5.8, 5.2);
        curPos = testNext;
      }

      return curPos;
    }

    updateQueuePosition(store) {
      if (!store.register) return;
      const queueIndex = store.registerQueue.indexOf(this);
      if (queueIndex === -1) return;

      const qPos = this.computeQueuePosition(store, queueIndex);
      this.targetPos.copy(qPos);
    }

    updateToRegister(delta, store) {
      const reached = this.moveTowards(this.targetPos, delta);
      // ガラス突き破りを防止するため店内座標に常時クランプ
      this.mesh.position.x = THREE.MathUtils.clamp(this.mesh.position.x, -5.2, 5.2);
      this.mesh.position.z = THREE.MathUtils.clamp(this.mesh.position.z, -5.8, 5.2);

      if (reached) {
        this.state = 'QUEUEING';
        if (store.registerQueue.indexOf(this) === 0) {
          this.startCheckout(store);
        }
      }
    }

    updateQueueing(delta, store) {
      this.updateQueuePosition(store);
      this.moveTowards(this.targetPos, delta);

      // ガラス突き破りを防止するため店内座標に常時クランプ
      this.mesh.position.x = THREE.MathUtils.clamp(this.mesh.position.x, -5.2, 5.2);
      this.mesh.position.z = THREE.MathUtils.clamp(this.mesh.position.z, -5.8, 5.2);

      const queueIndex = store.registerQueue.indexOf(this);
      if (queueIndex === 0) {
        if (store.register) {
          this.mesh.lookAt(store.register.mesh.position.x, this.mesh.position.y, store.register.mesh.position.z);
        }
        if (this.mesh.position.distanceTo(this.targetPos) < 0.35) {
          this.startCheckout(store);
        }
      } else {
        // 前に並んでいるお客様の背中を向く
        const ahead = store.registerQueue[queueIndex - 1];
        if (ahead && ahead.mesh) {
          this.mesh.lookAt(ahead.mesh.position.x, this.mesh.position.y, ahead.mesh.position.z);
        }
      }
    }

    startCheckout(store) {
      this.state = 'CHECKOUT';
      if (store.register) {
        this.mesh.lookAt(store.register.mesh.position.x, this.mesh.position.y, store.register.mesh.position.z);
      }
      this.calculateGivenCash();
      store.currentRegisterCustomer = this;
    }

    calculateGivenCash() {
      const total = this.totalPrice;
      if (total <= 0) {
        this.givenCash = 0;
        return;
      }
      if (Math.random() < 0.2) {
        this.givenCash = total;
        return;
      }
      const roundUps = [
        Math.ceil(total / 100) * 100,
        Math.ceil(total / 500) * 500,
        Math.ceil(total / 1000) * 1000,
        Math.ceil(total / 5000) * 5000,
        10000
      ].filter(v => v >= total);

      this.givenCash = roundUps[Math.floor(Math.random() * roundUps.length)] || total;
    }

    finishCheckoutAndLeave(store) {
      store.currentRegisterCustomer = null;
      const idx = store.registerQueue.indexOf(this);
      if (idx !== -1) {
        store.registerQueue.splice(idx, 1);
      }
      store.registerQueue.forEach(c => c.updateQueuePosition(store));
      this.startLeaving();
    }

    startLeaving() {
      this.state = 'LEAVING';
      this.subState = 0;
      // ウェイポイント1: 店内ドア前 (ガラスを突き破らないようにまずドア正面へ)
      this.targetPos.set(0, 0, 5.5);
    }

    updateLeaving(delta, store) {
      const reached = this.moveTowards(this.targetPos, delta);
      if (reached) {
        if (this.subState === 0) {
          // ドアを抜けて歩道へ
          this.subState = 1;
          this.targetPos.set(0, 0, 8.5);
        } else if (this.subState === 1) {
          // 駐車場の遠くへ進んで退店・消滅
          this.subState = 2;
          this.targetPos.set(0, 0, 16.5);
        } else {
          this.isFinished = true;
        }
      }
    }

    moveTowards(target, delta) {
      const diff = target.clone().sub(this.mesh.position);
      diff.y = 0;
      const dist = diff.length();

      if (dist < 0.08) {
        this.mesh.position.x = target.x;
        this.mesh.position.z = target.z;
        this.animate(0, delta);
        return true;
      }

      diff.normalize();
      const moveDist = Math.min(this.speed * delta, dist);
      this.mesh.position.add(diff.multiplyScalar(moveDist));

      const targetAngle = Math.atan2(diff.x, diff.z);
      this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, targetAngle, 0.2);
      this.animate(1, delta);
      return false;
    }

    animate(movingSpeedFactor, delta = 0.016) {
      const data = this.mesh.userData;
      if (!data || !data.leftLeg) return;

      if (movingSpeedFactor > 0) {
        data.animTime = (data.animTime || 0) + delta * 9.0;
        const legAngle = Math.sin(data.animTime) * 0.45;
        data.leftLeg.rotation.x = legAngle;
        data.rightLeg.rotation.x = -legAngle;
        data.leftArm.rotation.x = -legAngle * 0.7;
        data.rightArm.rotation.x = legAngle * 0.7;
      } else {
        data.leftLeg.rotation.x = 0;
        data.rightLeg.rotation.x = 0;
        data.leftArm.rotation.x = 0;
        data.rightArm.rotation.x = 0;
      }
    }
  }

  class CustomerManager {
    constructor(scene) {
      this.scene = scene;
      this.customers = [];
      this.spawnTimer = 2.0;
      this.employees = [];
    }

    update(delta, store) {
      // 営業時間内 (8:00〜21:59) かつ時計稼働中のみスポーン
      if (store.isTimeRunning && store.hour < 22) {
        this.spawnTimer -= delta;
        const interval = this.calculateSpawnInterval(store.hour);

        if (this.spawnTimer <= 0) {
          this.spawnTimer = interval;
          this.spawnCustomer(store);
        }
      }

      for (let i = this.customers.length - 1; i >= 0; i--) {
        const c = this.customers[i];
        c.update(delta, store);
        if (c.isFinished) {
          this.scene.remove(c.mesh);
          this.customers.splice(i, 1);
        }
      }

      this.employees.forEach(emp => emp.update(delta, store));
    }

    calculateSpawnInterval(hour) {
      if (hour >= 8 && hour < 9) {
        return 5 + Math.random() * 3;
      } else if (hour >= 11 && hour < 13) {
        return 4 + Math.random() * 3;
      } else if (hour >= 17 && hour < 19) {
        return 5 + Math.random() * 3;
      } else if (hour >= 9 && hour < 11) {
        return 10 + Math.random() * 4;
      } else {
        return 8 + Math.random() * 4;
      }
    }

    spawnCustomer(store) {
      if (this.customers.length >= 8) return;

      const hour = store.hour;
      let age = '20代';
      let occupation = OCCUPATIONS.WORKER;
      const rand = Math.random();

      if (hour >= 8 && hour < 9) {
        if (rand < 0.6) {
          occupation = OCCUPATIONS.WORKER;
          age = Math.random() < 0.5 ? '20代' : (Math.random() < 0.5 ? '30代' : '40代');
        } else if (rand < 0.9) {
          occupation = OCCUPATIONS.STUDENT;
          age = '10代';
        } else {
          occupation = OCCUPATIONS.HOMEMAKER;
          age = '30代';
        }
      } else if (hour >= 9 && hour < 11) {
        if (rand < 0.5) {
          occupation = OCCUPATIONS.HOMEMAKER;
          age = Math.random() < 0.5 ? '30代' : '40代';
        } else {
          occupation = OCCUPATIONS.SENIOR;
          age = Math.random() < 0.5 ? '50代' : '60代以上';
        }
      } else if (hour >= 11 && hour < 13) {
        if (rand < 0.7) {
          occupation = OCCUPATIONS.WORKER;
          age = Math.random() < 0.4 ? '20代' : (Math.random() < 0.7 ? '30代' : '40代');
        } else {
          occupation = OCCUPATIONS.STUDENT;
          age = '10代';
        }
      } else if (hour >= 17 && hour < 19) {
        if (rand < 0.5) {
          occupation = OCCUPATIONS.WORKER;
          age = '30代';
        } else if (rand < 0.8) {
          occupation = OCCUPATIONS.STUDENT;
          age = '10代';
        } else {
          occupation = OCCUPATIONS.HOMEMAKER;
          age = '40代';
        }
      } else {
        occupation = rand < 0.6 ? OCCUPATIONS.WORKER : (rand < 0.85 ? OCCUPATIONS.STUDENT : OCCUPATIONS.SENIOR);
        age = rand < 0.4 ? '20代' : (rand < 0.7 ? '30代' : '50代');
      }

      const customerType = Math.random() < 0.35 ? CUSTOMER_TYPES.REGULAR : CUSTOMER_TYPES.FLOATING;
      const customer = new Customer({ age, occupation, customerType });
      this.customers.push(customer);
      this.scene.add(customer.mesh);
    }

    addEmployee(name = '店員 田中') {
      const empMesh = createHumanoidModel({
        isEmployee: true,
        badgeText: `スタッフ: ${name}`
      });
      empMesh.position.set(-2.5, 0, 2);

      const emp = {
        mesh: empMesh,
        name: name,
        update: (delta) => {
          empMesh.userData.animTime = (empMesh.userData.animTime || 0) + delta * 2.0;
          if (empMesh.userData.leftArm) {
            empMesh.userData.leftArm.rotation.x = Math.sin(empMesh.userData.animTime) * 0.1;
            empMesh.userData.rightArm.rotation.x = -Math.sin(empMesh.userData.animTime) * 0.1;
          }
        }
      };

      this.employees.push(emp);
      this.scene.add(empMesh);
    }
  }

  // ========================================================
  // 6. レジシステム (RegisterSystem)
  // ========================================================
  class RegisterSystem {
    constructor(store) {
      this.store = store;
      this.currentCustomer = null;
      this.scannedItems = [];
      this.unscannedBasket = [];
      this.subtotal = 0;
      this.givenCash = 0;
      this.enteredChange = 0;

      this.modal = document.getElementById('register-modal');
      this.customerInfoEl = document.getElementById('pos-customer-info');
      this.basketListEl = document.getElementById('pos-basket-list');
      this.receiptListEl = document.getElementById('pos-receipt-list');
      this.subtotalEl = document.getElementById('pos-subtotal');
      this.basketCountEl = document.getElementById('pos-basket-count');
      this.btnScanNext = document.getElementById('btn-pos-scan');
      this.btnCheckout = document.getElementById('btn-pos-checkout');

      this.paymentSection = document.getElementById('pos-payment-section');
      this.givenCashEl = document.getElementById('pos-given-cash');
      this.dueChangeEl = document.getElementById('pos-due-change');
      this.currentChangeEl = document.getElementById('pos-current-change');
      this.btnGiveChange = document.getElementById('btn-pos-give-change');
      this.btnCloseRegister = document.getElementById('btn-pos-close');

      this.initEventListeners();
    }

    initEventListeners() {
      if (this.btnScanNext) {
        this.btnScanNext.addEventListener('click', (e) => {
          e.stopPropagation();
          this.scanNextItem();
        });
      }
      if (this.btnCheckout) {
        this.btnCheckout.addEventListener('click', (e) => {
          e.stopPropagation();
          this.startPayment();
        });
      }
      if (this.btnGiveChange) {
        this.btnGiveChange.addEventListener('click', (e) => {
          e.stopPropagation();
          this.giveChangeAndComplete();
        });
      }
      if (this.btnCloseRegister) {
        this.btnCloseRegister.addEventListener('click', (e) => {
          e.stopPropagation();
          this.close();
        });
      }

      // お札・硬貨ボタン (左クリックで加算、右クリックで減算)
      document.querySelectorAll('.money-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const value = parseInt(btn.dataset.value, 10);
          if (!isNaN(value)) this.addChangeMoney(value);
        });
        btn.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const value = parseInt(btn.dataset.value, 10);
          if (!isNaN(value)) this.addChangeMoney(-value);
        });
      });

      const btnClearChange = document.getElementById('btn-pos-clear-change');
      if (btnClearChange) {
        btnClearChange.addEventListener('click', (e) => {
          e.stopPropagation();
          this.enteredChange = 0;
          this.updatePaymentUI();
        });
      }

      const btnExactChange = document.getElementById('btn-pos-exact-change');
      if (btnExactChange) {
        btnExactChange.addEventListener('click', (e) => {
          e.stopPropagation();
          const due = Math.max(0, this.givenCash - this.subtotal);
          this.enteredChange = due;
          this.updatePaymentUI();
        });
      }
    }

    open(customer) {
      if (!customer) {
        if (this.store.currentRegisterCustomer) {
          customer = this.store.currentRegisterCustomer;
        } else if (this.store.registerQueue.length > 0) {
          customer = this.store.registerQueue[0];
        }
      }

      if (!customer || !customer.basket || customer.basket.length === 0) {
        this.showToast('レジに会計待ちのお客様がいません。');
        return;
      }

      this.currentCustomer = customer;
      this.unscannedBasket = [...customer.basket];
      this.scannedItems = [];
      this.subtotal = 0;
      this.givenCash = 0;
      this.enteredChange = 0;

      // 預り金の事前確認
      if (!customer.givenCash || customer.givenCash < customer.totalPrice) {
        customer.calculateGivenCash();
      }

      this.customerInfoEl.textContent = `${customer.occupation} (${customer.age})・${customer.customerType}`;
      this.paymentSection.classList.add('hidden');
      this.paymentSection.style.display = 'none';
      this.btnGiveChange.disabled = true;
      this.btnCheckout.disabled = true;
      this.btnCheckout.classList.remove('btn-ready');
      if (this.btnScanNext) this.btnScanNext.disabled = false;

      this.modal.classList.remove('hidden');
      this.updateScanUI();

      if (document.exitPointerLock) document.exitPointerLock();
    }

    close() {
      if (this.nextCustTimer) {
        clearTimeout(this.nextCustTimer);
        this.nextCustTimer = null;
      }
      this.modal.classList.add('hidden');
      this.paymentSection.classList.add('hidden');
      this.paymentSection.style.display = 'none';
      this.btnGiveChange.disabled = true;
      this.currentCustomer = null;
    }

    // 仕様: スキャン→かご内商品数が一つずつ減る＆合計金額に加算されていく→0になったら会計するボタンが押せるようになる
    scanNextItem() {
      if (this.unscannedBasket.length === 0) return;

      const basketItem = this.unscannedBasket.shift();
      this.scannedItems.push(basketItem);
      this.subtotal += basketItem.price;

      soundManager.playScan();
      this.updateScanUI();

      if (this.unscannedBasket.length === 0) {
        this.btnCheckout.disabled = false;
        this.btnCheckout.classList.add('btn-ready');
        if (this.btnScanNext) this.btnScanNext.disabled = true;
      }
    }

    scanItemAtIndex(index) {
      if (index < 0 || index >= this.unscannedBasket.length) return;
      const basketItem = this.unscannedBasket.splice(index, 1)[0];
      this.scannedItems.push(basketItem);
      this.subtotal += basketItem.price;

      soundManager.playScan();
      this.updateScanUI();

      if (this.unscannedBasket.length === 0) {
        this.btnCheckout.disabled = false;
        this.btnCheckout.classList.add('btn-ready');
        if (this.btnScanNext) this.btnScanNext.disabled = true;
      }
    }

    updateScanUI() {
      this.basketCountEl.textContent = this.unscannedBasket.length;
      this.subtotalEl.textContent = `¥${this.subtotal.toLocaleString()}`;

      this.receiptListEl.innerHTML = '';
      this.scannedItems.forEach(item => {
        const row = document.createElement('div');
        row.className = 'receipt-row';
        row.innerHTML = `<span>${item.item.name}</span><span>¥${item.price.toLocaleString()}</span>`;
        this.receiptListEl.appendChild(row);
      });

      this.basketListEl.innerHTML = '';
      this.unscannedBasket.forEach((item, index) => {
        const badge = document.createElement('div');
        badge.className = 'basket-item-badge';
        badge.textContent = item.item.name;
        badge.title = 'クリックでこの商品をスキャン';
        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          this.scanItemAtIndex(index);
        });
        this.basketListEl.appendChild(badge);
      });

      if (this.unscannedBasket.length === 0) {
        this.basketListEl.innerHTML = '<div class="empty-basket-msg">✨ かごが空になりました！「お会計する」を押してください</div>';
      }
    }

    // 仕様: 押す→預り金受け取る
    startPayment() {
      if (this.unscannedBasket.length > 0) return;

      if (!this.currentCustomer.givenCash || this.currentCustomer.givenCash < this.subtotal) {
        this.currentCustomer.calculateGivenCash();
      }

      this.givenCash = Math.max(this.currentCustomer.givenCash || this.subtotal, this.subtotal);
      const dueChange = this.givenCash - this.subtotal;
      this.enteredChange = 0;

      this.paymentSection.classList.remove('hidden');
      this.paymentSection.style.display = 'block';
      this.btnCheckout.disabled = true;
      this.btnCheckout.classList.remove('btn-ready');
      this.btnGiveChange.disabled = false;

      this.givenCashEl.textContent = `¥${this.givenCash.toLocaleString()}`;
      this.dueChangeEl.textContent = `¥${dueChange.toLocaleString()}`;
      this.updatePaymentUI();

      soundManager.playCoin();
    }

    addChangeMoney(val) {
      this.enteredChange = Math.max(0, this.enteredChange + val);
      soundManager.playCoin();
      this.updatePaymentUI();
    }

    updatePaymentUI() {
      const dueChange = Math.max(0, this.givenCash - this.subtotal);
      this.currentChangeEl.textContent = `¥${this.enteredChange.toLocaleString()}`;

      let statusArea = document.getElementById('pos-change-status');
      if (!statusArea) {
        statusArea = document.createElement('div');
        statusArea.id = 'pos-change-status';
        this.btnGiveChange.parentNode.insertBefore(statusArea, this.btnGiveChange);
      }

      // おつりボタンは無効化せず、常にクリック可能にして自動計算または確定させる
      this.btnGiveChange.disabled = false;

      if (dueChange === 0) {
        // おつり不要（丁度預かり）
        this.btnGiveChange.textContent = '🤝 お預かり丁度（おつりなしで会計完了）';
        this.btnGiveChange.className = 'btn-pos btn-complete btn-ready';
        this.currentChangeEl.style.color = '#27ae60';
        statusArea.className = 'pos-change-status match';
        statusArea.textContent = '✅ お預かり金額が丁度です！このままボタンを押して完了してください';
      } else if (this.enteredChange === dueChange) {
        // 手動またはぴったり入力で一致
        this.btnGiveChange.textContent = `🤝 おつり ¥${dueChange.toLocaleString()} を渡して会計完了`;
        this.btnGiveChange.className = 'btn-pos btn-complete btn-ready';
        this.currentChangeEl.style.color = '#27ae60';
        statusArea.className = 'pos-change-status match';
        statusArea.textContent = '✅ おつり金額が一致しています！「おつりを渡す」を押してください';
      } else if (this.enteredChange === 0) {
        // まだ小銭トレイに入力していない初期状態
        this.btnGiveChange.textContent = `🤝 ぴったりおつり (¥${dueChange.toLocaleString()}) を渡して完了`;
        this.btnGiveChange.className = 'btn-pos btn-complete btn-auto';
        this.currentChangeEl.style.color = '#f1c40f';
        statusArea.className = 'pos-change-status hint';
        statusArea.textContent = `💡 ボタンを押すと正確なおつり(¥${dueChange.toLocaleString()})を自動で渡して完了します（下のトレイで手動入力も可能）`;
      } else {
        // 手動入力中（差額あり）
        const diff = dueChange - this.enteredChange;
        this.btnGiveChange.textContent = `🤝 差額を補正しておつり(¥${dueChange.toLocaleString()})を渡す`;
        this.btnGiveChange.className = 'btn-pos btn-complete btn-auto';
        this.currentChangeEl.style.color = '#e74c3c';
        statusArea.className = 'pos-change-status diff';
        if (diff > 0) {
          statusArea.textContent = `⚠️ 不足: ¥${diff.toLocaleString()} (このまま押せば自動補正して渡せます / ぴったり入力ボタンも有効)`;
        } else {
          statusArea.textContent = `⚠️ 超過: ¥${(-diff).toLocaleString()} (このまま押せば自動補正して渡せます / 右クリックで減算)`;
        }
      }
    }

    // 仕様: おつりを渡す→売上に反映＆客退店
    giveChangeAndComplete() {
      // 厳格ガード: 未スキャンの商品が残っている、または支払いセクションが開いていない場合は絶対に実行しない
      if (this.unscannedBasket.length > 0 || this.paymentSection.classList.contains('hidden') || this.paymentSection.style.display === 'none') {
        return;
      }
      if (!this.currentCustomer || (this.subtotal === 0 && this.currentCustomer.basket && this.currentCustomer.basket.length > 0)) {
        return;
      }

      const dueChange = Math.max(0, this.givenCash - this.subtotal);

      // おつり手渡し額を正確な額に補正
      if (this.enteredChange !== dueChange) {
        this.enteredChange = dueChange;
        soundManager.playCoin();
        this.updatePaymentUI();
      }

      this.store.cash += this.subtotal;
      this.store.dailyRevenue += this.subtotal;
      this.store.dailyCustomersServed++;

      soundManager.playRegisterDing();

      const customerRef = this.currentCustomer;
      if (customerRef) {
        customerRef.finishCheckoutAndLeave(this.store);
      }

      const changeMsg = dueChange > 0 ? ` (おつり: ¥${dueChange.toLocaleString()})` : ' (おつりなし)';
      this.showToast(`お会計完了！ 売上 +¥${this.subtotal.toLocaleString()}${changeMsg}`);

      // 次の客がいれば少し待って次の会計を開く、いなければレジを閉じる
      if (this.nextCustTimer) clearTimeout(this.nextCustTimer);
      if (this.store.registerQueue.length > 0) {
        this.nextCustTimer = setTimeout(() => {
          if (this.store.registerQueue.length > 0 && !this.modal.classList.contains('hidden')) {
            this.open(this.store.registerQueue[0]);
          } else {
            this.close();
          }
        }, 500);
      } else {
        this.close();
      }
    }

    showToast(msg) {
      const toast = document.createElement('div');
      toast.className = 'pos-toast';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    }
  }

  // ========================================================
  // 7. UIマネージャー (HUD, PC発注, チュートリアル)
  // ========================================================
  class UIManager {
    constructor(store, game) {
      this.store = store;
      this.game = game;

      this.hudTime = document.getElementById('hud-time');
      this.hudDay = document.getElementById('hud-day');
      this.hudCash = document.getElementById('hud-cash');
      this.hudRevenue = document.getElementById('hud-revenue');
      this.hudStatus = document.getElementById('hud-status');
      this.hudPrompt = document.getElementById('hud-prompt');
      this.hudHand = document.getElementById('hud-hand-info');
      this.btnToggleClock = document.getElementById('btn-toggle-clock');

      this.tutorialModal = document.getElementById('tutorial-modal');
      this.managementModal = document.getElementById('management-modal');
      this.dayEndModal = document.getElementById('day-end-modal');

      this.initEventListeners();
      this.initCatalogUI();
    }

    initEventListeners() {
      const btnCloseTutorial = document.getElementById('btn-close-tutorial');
      if (btnCloseTutorial) {
        btnCloseTutorial.addEventListener('click', (e) => {
          e.stopPropagation();
          this.tutorialModal.classList.add('hidden');
        });
      }

      const btnCloseTutorialX = document.getElementById('btn-close-tutorial-x');
      if (btnCloseTutorialX) {
        btnCloseTutorialX.addEventListener('click', (e) => {
          e.stopPropagation();
          this.tutorialModal.classList.add('hidden');
        });
      }

      if (this.btnToggleClock) {
        this.btnToggleClock.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleStoreClock();
        });
      }

      const btnOpenPc = document.getElementById('btn-open-pc');
      if (btnOpenPc) {
        btnOpenPc.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openManagementPC();
        });
      }

      const btnClosePc = document.getElementById('btn-close-pc');
      if (btnClosePc) {
        btnClosePc.addEventListener('click', (e) => {
          e.stopPropagation();
          this.closeManagementPC();
        });
      }

      const btnShowTutorial = document.getElementById('btn-show-tutorial');
      if (btnShowTutorial) {
        btnShowTutorial.addEventListener('click', (e) => {
          e.stopPropagation();
          this.tutorialModal.classList.remove('hidden');
          if (document.exitPointerLock) document.exitPointerLock();
        });
      }

      const btnNextDay = document.getElementById('btn-next-day');
      if (btnNextDay) {
        btnNextDay.addEventListener('click', (e) => {
          e.stopPropagation();
          this.store.advanceToNextDay();
          this.dayEndModal.classList.add('hidden');
          if (this.btnToggleClock) {
            this.btnToggleClock.textContent = '▶ 開店 (時間を進める)';
            this.btnToggleClock.classList.remove('running');
          }
          if (this.game && typeof this.game.updateOpenCloseSwitchVisuals === 'function') {
            this.game.updateOpenCloseSwitchVisuals();
          }
        });
      }

      window.addEventListener('store-day-ended', (e) => {
        this.showDayEndModal(e.detail);
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          if (this.managementModal.classList.contains('hidden')) {
            this.openManagementPC();
          } else {
            this.closeManagementPC();
          }
        }
        if (e.key === 'Escape') {
          if (!this.managementModal.classList.contains('hidden')) {
            this.closeManagementPC();
          }
          if (!this.tutorialModal.classList.contains('hidden')) {
            this.tutorialModal.classList.add('hidden');
          }
        }
      });

      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          const target = document.getElementById(btn.dataset.tab);
          if (target) target.classList.add('active');
        });
      });
    }

    initCatalogUI() {
      const fixtureList = document.getElementById('pc-fixture-list');
      const dailyList = document.getElementById('pc-daily-list');
      const nonDailyList = document.getElementById('pc-nondaily-list');
      const employeeList = document.getElementById('pc-employee-list');

      fixtureList.innerHTML = '';
      FIXTURE_CATALOG.forEach(fixture => {
        const card = document.createElement('div');
        card.className = 'catalog-card';
        card.innerHTML = `
          <div class="card-header">
            <span class="card-badge fixture-badge">${fixture.subCategory}</span>
            <h4>${fixture.name}</h4>
          </div>
          <p class="card-desc">${fixture.description}</p>
          <div class="card-footer">
            <span class="card-price">¥${fixture.cost.toLocaleString()}</span>
            <button class="btn btn-buy" data-fixture-id="${fixture.id}">購入して発注</button>
          </div>
        `;
        card.querySelector('.btn-buy').addEventListener('click', (e) => {
          e.stopPropagation();
          this.buyFixture(fixture.id);
        });
        fixtureList.appendChild(card);
      });

      dailyList.innerHTML = '';
      ITEM_CATALOG.filter(i => i.category === CATEGORIES.DAILY).forEach(item => {
        const card = document.createElement('div');
        card.className = 'catalog-card';
        card.innerHTML = `
          <div class="card-header">
            <span class="card-badge daily-badge">${item.subCategory}</span>
            <h4>${item.name}</h4>
          </div>
          <p class="card-desc">${item.description}</p>
          <div class="card-info">
            <span>仕入値: ¥${item.cost}</span>
            <span>売値: ¥${item.price}</span>
          </div>
          <div class="card-footer">
            <span class="card-price">1箱(12個): ¥${(item.cost * 12).toLocaleString()}</span>
            <button class="btn btn-buy" data-item-id="${item.id}">発注する</button>
          </div>
        `;
        card.querySelector('.btn-buy').addEventListener('click', (e) => {
          e.stopPropagation();
          this.buyItem(item.id, 12);
        });
        dailyList.appendChild(card);
      });

      nonDailyList.innerHTML = '';
      ITEM_CATALOG.filter(i => i.category === CATEGORIES.NON_DAILY).forEach(item => {
        const card = document.createElement('div');
        card.className = 'catalog-card';
        card.innerHTML = `
          <div class="card-header">
            <span class="card-badge nondaily-badge">${item.subCategory}</span>
            <h4>${item.name}</h4>
          </div>
          <p class="card-desc">${item.description}</p>
          <div class="card-info">
            <span>仕入値: ¥${item.cost}</span>
            <span>売値: ¥${item.price}</span>
          </div>
          <div class="card-footer">
            <span class="card-price">1箱(12個): ¥${(item.cost * 12).toLocaleString()}</span>
            <button class="btn btn-buy" data-item-id="${item.id}">発注する</button>
          </div>
        `;
        card.querySelector('.btn-buy').addEventListener('click', (e) => {
          e.stopPropagation();
          this.buyItem(item.id, 12);
        });
        nonDailyList.appendChild(card);
      });

      employeeList.innerHTML = `
        <div class="catalog-card">
          <div class="card-header">
            <span class="card-badge staff-badge">アルバイト</span>
            <h4>店員 田中さん (可視化スタッフ)</h4>
          </div>
          <p class="card-desc">コンビニ制服を着て店舗で勤務するアルバイトスタッフです。店内に可視化配置されます。</p>
          <div class="card-footer">
            <span class="card-price">日給 ¥8,000</span>
            <button class="btn btn-buy" id="btn-hire-tanaka">雇用する</button>
          </div>
        </div>
      `;

      const btnHire = employeeList.querySelector('#btn-hire-tanaka');
      if (btnHire) {
        btnHire.addEventListener('click', (e) => {
          e.stopPropagation();
          if (this.store.cash < 8000) {
            this.showToast('資金が不足しています。');
            return;
          }
          this.store.cash -= 8000;
          this.store.dailyCost += 8000;
          this.game.customerManager.addEmployee('田中さん');
          btnHire.disabled = true;
          btnHire.textContent = '雇用済み';
          this.showToast('田中さんを雇用しました！店舗内にスタッフが配置されました。');
        });
      }
    }

    buyFixture(fixtureId) {
      const res = this.store.purchaseFixture(fixtureId);
      if (!res.success) {
        this.showToast(res.msg);
        return;
      }
      this.showToast(`【配達完了】店の外に『${res.fixture.name}』の大型ダンボールが届きました！外から運んで設置してください。`);
    }

    buyItem(itemId, count = 12) {
      const res = this.store.purchaseItem(itemId, count);
      if (!res.success) {
        this.showToast(res.msg);
        return;
      }
      this.showToast(`【配達完了】店の外に『${res.item.name}』の段ボールが届きました！`);
    }

    openManagementPC() {
      this.managementModal.classList.remove('hidden');
      if (document.exitPointerLock) document.exitPointerLock();
    }

    closeManagementPC() {
      this.managementModal.classList.add('hidden');
    }

    update() {
      const h = String(Math.floor(this.store.hour)).padStart(2, '0');
      const m = String(Math.floor(this.store.minute)).padStart(2, '0');
      this.hudTime.textContent = `${h}:${m}`;
      this.hudDay.textContent = `Day ${this.store.dayNumber}`;
      this.hudCash.textContent = `所持金: ¥${this.store.cash.toLocaleString()}`;
      this.hudRevenue.textContent = `本日売上: ¥${this.store.dailyRevenue.toLocaleString()}`;

      const pcCash = document.getElementById('pc-cash-display');
      if (pcCash) {
        pcCash.textContent = `¥${this.store.cash.toLocaleString()}`;
      }

      const hour = this.store.hour;
      let statusText = '通常営業';
      if (!this.store.isTimeRunning) {
        statusText = '開店準備中 (時計停止)';
      } else if (hour >= 8 && hour < 9) {
        statusText = '🔥 出勤ピーク (朝ラッシュ)';
      } else if (hour >= 11 && hour < 13) {
        statusText = '🔥 昼ピーク (お弁当ラッシュ)';
      } else if (hour >= 17 && hour < 19) {
        statusText = '🔥 夕方ピーク (帰宅ラッシュ)';
      } else if (hour >= 22) {
        statusText = '🌙 閉店時間 (レジ受付のみ)';
      }
      this.hudStatus.textContent = statusText;

      if (this.game.holdingBox) {
        if (this.game.holdingBox.isFixtureBox) {
          this.hudHand.textContent = `📦 所持中: ${this.game.holdingBox.itemName} (配置可能)`;
        } else {
          this.hudHand.textContent = `📦 所持中: ${this.game.holdingBox.item.name} (残り ${this.game.holdingBox.count}個)`;
        }
        this.hudHand.classList.remove('hidden');
      } else {
        this.hudHand.classList.add('hidden');
      }
    }

    showPrompt(text) {
      if (text) {
        this.hudPrompt.textContent = text;
        this.hudPrompt.classList.remove('hidden');
      } else {
        this.hudPrompt.classList.add('hidden');
      }
    }

    showToast(msg) {
      const toast = document.createElement('div');
      toast.className = 'pos-toast';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }

    showDayEndModal(stats) {
      document.getElementById('end-day-number').textContent = stats.day;
      document.getElementById('end-revenue').textContent = `¥${stats.revenue.toLocaleString()}`;
      document.getElementById('end-cost').textContent = `¥${stats.cost.toLocaleString()}`;
      document.getElementById('end-profit').textContent = `¥${stats.profit.toLocaleString()}`;
      document.getElementById('end-customers').textContent = `${stats.customersServed} 人`;

      this.dayEndModal.classList.remove('hidden');
      if (document.exitPointerLock) document.exitPointerLock();
    }

    toggleStoreClock() {
      if (this.store.isTimeRunning) {
        this.store.pauseDay();
        if (this.btnToggleClock) {
          this.btnToggleClock.textContent = '▶ 開店 (時間を進める)';
          this.btnToggleClock.classList.remove('running');
        }
        soundManager.playSwitch(false);
        this.showToast('⏸ 店舗営業を一時停止しました（時計停止）');
      } else {
        if (!this.store.register) {
          this.showToast('【確認】まだレジが配置されていません！管理PC [TAB] で備品を購入し、レジカウンターを配置してください。');
        }
        this.store.startDay();
        if (this.btnToggleClock) {
          this.btnToggleClock.textContent = '⏸ 一時停止 (営業中)';
          this.btnToggleClock.classList.add('running');
        }
        soundManager.playSwitch(true);
        this.showToast('📢 開店しました！お客様の来店が始まります');
      }
      if (this.game && typeof this.game.updateOpenCloseSwitchVisuals === 'function') {
        this.game.updateOpenCloseSwitchVisuals();
      }
    }
  }

  // ========================================================
  // 8. 3Dゲームメインエンジン ＆ FPS操作
  // ========================================================
  class Game {
    constructor() {
      this.canvasContainer = document.getElementById('canvas-container');

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xd6eaf8);
      this.scene.fog = new THREE.Fog(0xd6eaf8, 18, 48);

      this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
      this.camera.position.set(0, 1.65, 4);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.canvasContainer.appendChild(this.renderer.domElement);

      this.store = new Store(this.scene);
      this.customerManager = new CustomerManager(this.scene);
      this.registerSystem = new RegisterSystem(this.store);
      this.ui = new UIManager(this.store, this);

      this.wallColliders = [];
      this.setupFPSControls();
      this.buildStoreEnvironment();

      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2(0, 0);

      this.placementMode = false;
      this.placementFixture = null;
      this.ghostMesh = null;
      this.ghostRotation = 0;
      this.holdingBox = null;

      // 無限床面との交差判定用平面 (Y = 0)
      this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      this.planeIntersectPoint = new THREE.Vector3();

      this.clock = new THREE.Clock();
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);

      window.addEventListener('resize', () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });
    }

    isAnyModalOpen() {
      const regModal = document.getElementById('register-modal');
      const pcModal = document.getElementById('management-modal');
      const tutModal = document.getElementById('tutorial-modal');
      const endModal = document.getElementById('day-end-modal');

      return (regModal && !regModal.classList.contains('hidden')) ||
             (pcModal && !pcModal.classList.contains('hidden')) ||
             (tutModal && !tutModal.classList.contains('hidden')) ||
             (endModal && !endModal.classList.contains('hidden'));
    }

    setupFPSControls() {
      this.keys = {};
      this.moveSpeed = 4.2;
      this.isPointerLocked = false;
      this.euler = new THREE.Euler(0, 0, 0, 'YXZ');

      window.addEventListener('keydown', (e) => {
        if (this.isAnyModalOpen()) return;

        this.keys[e.code] = true;

        if (e.code === 'KeyE') {
          this.handleInteraction();
        }

        if (e.code === 'KeyO') {
          this.ui.toggleStoreClock();
        }

        if (e.code === 'KeyR' && this.placementMode) {
          this.ghostRotation = (this.ghostRotation + Math.PI / 2) % (Math.PI * 2);
          if (this.ghostMesh) {
            this.ghostMesh.rotation.y = this.ghostRotation;
          }
          this.updatePlacementPrompt();
        }

        if (e.code === 'Escape' && this.placementMode) {
          this.cancelPlacement(true);
        }
      });

      window.addEventListener('keyup', (e) => {
        this.keys[e.code] = false;
      });

      this.canvasContainer.addEventListener('click', () => {
        if (!this.isAnyModalOpen() && !this.isPointerLocked) {
          this.canvasContainer.requestPointerLock();
        }
      });

      document.addEventListener('pointerlockchange', () => {
        this.isPointerLocked = document.pointerLockElement === this.canvasContainer;
      });

      document.addEventListener('mousemove', (e) => {
        if (!this.isPointerLocked || this.isAnyModalOpen()) return;

        const movementX = e.movementX || 0;
        const movementY = e.movementY || 0;

        this.euler.setFromQuaternion(this.camera.quaternion);
        this.euler.y -= movementX * 0.0022;
        this.euler.x -= movementY * 0.0022;
        this.euler.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.euler.x));
        this.camera.quaternion.setFromEuler(this.euler);
      });

      window.addEventListener('mousedown', (e) => {
        // UIモーダルが開いている最中は3D操作をブロック
        if (this.isAnyModalOpen()) return;

        if (e.button === 0) {
          if (this.placementMode) {
            this.confirmPlacement();
          } else if (this.isPointerLocked) {
            this.handleInteraction();
          }
        } else if (e.button === 2) {
          if (this.placementMode) {
            this.cancelPlacement(true);
          } else if (this.holdingBox) {
            this.dropHoldingBox();
          }
        }
      });

      window.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    buildStoreEnvironment() {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.78);
      this.scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfffaed, 0.85);
      dirLight.position.set(5, 14, 12);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      this.scene.add(dirLight);

      // コライダー配列の初期化
      this.wallColliders = [];

      // ==========================================
      // 1. 各部屋の床 (Floors)
      // ==========================================
      // ① 売場床 (中央: 12m x 14m, x: [-6, 6], z: [-7, 7])
      // ※ 事務所床と統一 (オフィス用タイルカーペット仕上げ)
      const salesFloorGeo = new THREE.PlaneGeometry(12, 14);
      const salesFloorTexture = createOfficeCarpetTexture().clone();
      salesFloorTexture.needsUpdate = true;
      salesFloorTexture.repeat.set(6, 7);
      const salesFloorMat = new THREE.MeshLambertMaterial({
        map: salesFloorTexture,
        roughness: 0.5
      });
      this.floor = new THREE.Mesh(salesFloorGeo, salesFloorMat);
      this.floor.rotation.x = -Math.PI / 2;
      this.floor.position.set(0, 0, 0);
      this.floor.receiveShadow = true;
      this.scene.add(this.floor);

      // ② バックヤード床 (左: 6m x 14m, x: [-12, -6], z: [-7, 7])
      const backyardFloorGeo = new THREE.PlaneGeometry(6, 14);
      const backyardFloorMat = new THREE.MeshLambertMaterial({
        map: createBackyardFloorTexture(),
        roughness: 0.4
      });
      const backyardFloor = new THREE.Mesh(backyardFloorGeo, backyardFloorMat);
      backyardFloor.rotation.x = -Math.PI / 2;
      backyardFloor.position.set(-9, 0.005, 0);
      backyardFloor.receiveShadow = true;
      this.scene.add(backyardFloor);

      // ③ 事務所床 (右: 6m x 14m, x: [6, 12], z: [-7, 7])
      const officeFloorGeo = new THREE.PlaneGeometry(6, 14);
      const officeFloorMat = new THREE.MeshLambertMaterial({
        map: createOfficeCarpetTexture(),
        roughness: 0.5
      });
      const officeFloor = new THREE.Mesh(officeFloorGeo, officeFloorMat);
      officeFloor.rotation.x = -Math.PI / 2;
      officeFloor.position.set(9, 0.005, 0);
      officeFloor.receiveShadow = true;
      this.scene.add(officeFloor);

      // ④ 裏の配達エリア床 (屋外左奥: 7m x 5m, x: [-12.5, -5.5], z: [-12, -7])
      const deliveryAreaGeo = new THREE.PlaneGeometry(7.0, 5.0);
      const deliveryAreaMat = new THREE.MeshLambertMaterial({
        map: createDeliveryAreaTexture()
      });
      const deliveryGround = new THREE.Mesh(deliveryAreaGeo, deliveryAreaMat);
      deliveryGround.rotation.x = -Math.PI / 2;
      deliveryGround.position.set(-9.0, 0.01, -9.5);
      deliveryGround.receiveShadow = true;
      this.scene.add(deliveryGround);

      // ==========================================
      // 2. 各部屋の天井 ＆ 照明 (Ceilings & Lighting)
      // ==========================================
      const ceilingMat = new THREE.MeshLambertMaterial({ color: 0xfcfcfc });

      // ① 売場天井 (12m x 14m)
      const salesCeiling = new THREE.Mesh(new THREE.PlaneGeometry(12, 14), ceilingMat);
      salesCeiling.rotation.x = Math.PI / 2;
      salesCeiling.position.set(0, 3.5, 0);
      this.scene.add(salesCeiling);

      // 売場照明 (6灯)
      [-3, 0, 3].forEach(x => {
        [-3, 2].forEach(z => {
          const lightBox = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 2.5), new THREE.MeshBasicMaterial({ color: 0xffffff }));
          lightBox.position.set(x, 3.46, z);
          this.scene.add(lightBox);

          const pLight = new THREE.PointLight(0xfff8ee, 0.5, 8);
          pLight.position.set(x, 3.3, z);
          this.scene.add(pLight);
        });
      });

      // ② バックヤード天井 (6m x 14m)
      const backyardCeiling = new THREE.Mesh(new THREE.PlaneGeometry(6, 14), ceilingMat);
      backyardCeiling.rotation.x = Math.PI / 2;
      backyardCeiling.position.set(-9, 3.5, 0);
      this.scene.add(backyardCeiling);

      // バックヤード照明 (倉庫用クールホワイト 3灯)
      [-4.0, 0.0, 4.0].forEach(z => {
        const cageGeo = new THREE.BoxGeometry(0.3, 0.12, 2.2);
        const cageMat = new THREE.MeshBasicMaterial({ color: 0xe0e6ed });
        const cageLight = new THREE.Mesh(cageGeo, cageMat);
        cageLight.position.set(-9.0, 3.44, z);
        this.scene.add(cageLight);

        const pLight = new THREE.PointLight(0xdff9fb, 0.55, 7.5);
        pLight.position.set(-9.0, 3.25, z);
        this.scene.add(pLight);
      });

      // ③ 事務所天井 (6m x 14m)
      const officeCeiling = new THREE.Mesh(new THREE.PlaneGeometry(6, 14), ceilingMat);
      officeCeiling.rotation.x = Math.PI / 2;
      officeCeiling.position.set(9, 3.5, 0);
      this.scene.add(officeCeiling);

      // 事務所照明 (オフィス用ウォームホワイト 3灯)
      [-4.0, 0.0, 4.0].forEach(z => {
        const panelGeo = new THREE.BoxGeometry(1.2, 0.06, 1.2);
        const panelMat = new THREE.MeshBasicMaterial({ color: 0xfffaed });
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.position.set(9.0, 3.47, z);
        this.scene.add(panel);

        const pLight = new THREE.PointLight(0xfffaed, 0.5, 7.5);
        pLight.position.set(9.0, 3.25, z);
        this.scene.add(pLight);
      });

      // ==========================================
      // 3. 壁面構造 ＆ ドア開口部 ＆ コライダー
      // ==========================================
      const wallMat = new THREE.MeshLambertMaterial({ color: 0xf4f6f7 });
      const darkWallMat = new THREE.MeshLambertMaterial({ color: 0x7f8c8d });
      const doorFrameMat = new THREE.MeshLambertMaterial({ color: 0x5d6d7e });

      const addWall = (w, h, d, x, y, z, mat = wallMat) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        mesh.position.set(x, y, z);
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        // コライダー登録 (AABB)
        this.wallColliders.push({
          minX: x - w / 2,
          maxX: x + w / 2,
          minZ: z - d / 2,
          maxZ: z + d / 2
        });
        return mesh;
      };

      // ① 外壁: 左外壁 (x = -12.0, z: [-7, 7])
      addWall(0.3, 3.5, 14.0, -12.0, 1.75, 0.0);

      // ② 外壁: 右外壁 (x = 12.0, z: [-7, 7])
      addWall(0.3, 3.5, 14.0, 12.0, 1.75, 0.0);

      // ③ 外壁: 事務所の奥壁 (z = -7.0, x: [6, 12])
      addWall(6.0, 3.5, 0.3, 9.0, 1.75, -7.0);

      // ④ 外壁: 売場の奥壁 (z = -7.0, x: [-6, 6])
      addWall(12.0, 3.5, 0.3, 0.0, 1.75, -7.0);

      // ⑤ 外壁: バックヤードの奥壁 (z = -7.0, x: [-12, -6])
      // 開口部: 配達エリア勝手口 (x: [-10.3, -8.7], 幅1.6m開放アーチ, 高さ2.5m)
      addWall(1.7, 3.5, 0.3, -11.15, 1.75, -7.0); // 左側壁 (x: -12.0 〜 -10.3)
      addWall(2.7, 3.5, 0.3, -7.35, 1.75, -7.0);  // 右側壁 (x: -8.7 〜 -6.0)
      // 勝手口上部の鴨居壁 (高さ2.5m〜3.5m)
      const lintelDelivery = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.3), wallMat);
      lintelDelivery.position.set(-9.5, 3.0, -7.0);
      this.scene.add(lintelDelivery);

      // 非常口・荷受口看板 (バックヤード側、頭上設置・障害物なし)
      const signExitMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture('非常口 EXIT 🏃\n荷受口・配達エリアへ ➡', '#1e824c', '#ffffff', 256, 128)
      });
      const signExit = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.45), signExitMat);
      signExit.position.set(-9.5, 2.75, -6.84);
      this.scene.add(signExit);

      // 屋外側ドア頭上看板 (配達エリア側、頭上設置)
      const signDelivExtMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture('📦 搬入口・荷受勝手口\nDELIVERY ENTRANCE', '#2980b9', '#ffffff', 256, 128)
      });
      const signDelivExt = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.45), signDelivExtMat);
      signDelivExt.rotation.y = Math.PI;
      signDelivExt.position.set(-9.5, 2.75, -7.16);
      this.scene.add(signDelivExt);

      // ⑥ 外壁: バックヤード手前正面壁 (z = 7.0, x: [-12, -6])
      addWall(6.0, 3.5, 0.3, -9.0, 1.75, 7.0);

      // ⑦ 外壁: 事務所手前正面壁 (z = 7.0, x: [6, 12])
      addWall(6.0, 3.5, 0.3, 9.0, 1.75, 7.0);

      // ⑧ 正面ガラス壁 ＆ 正面入口 (z = 7.0, x: [-6, 6])
      // 開口部: 正面入口 (x: [-1.1, 1.1], 幅2.2m完全開放アーチ, 高さ3.0m)
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x85c1e9,
        transparent: true,
        opacity: 0.35,
        roughness: 0.1
      });
      // 左側ガラス (x: -6.0 〜 -1.1)
      const frontGlassLeft = new THREE.Mesh(new THREE.BoxGeometry(4.9, 3.2, 0.1), glassMat);
      frontGlassLeft.position.set(-3.55, 1.6, 7.0);
      this.scene.add(frontGlassLeft);
      this.wallColliders.push({ minX: -6.0, maxX: -1.1, minZ: 6.85, maxZ: 7.15 });

      // 右側ガラス (x: 1.1 〜 6.0)
      const frontGlassRight = new THREE.Mesh(new THREE.BoxGeometry(4.9, 3.2, 0.1), glassMat);
      frontGlassRight.position.set(3.55, 1.6, 7.0);
      this.scene.add(frontGlassRight);
      this.wallColliders.push({ minX: 1.1, maxX: 6.0, minZ: 6.85, maxZ: 7.15 });

      // 正面入口上の鴨居壁 (高さ3.0m〜3.5m)
      const frontLintel = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 0.25), wallMat);
      frontLintel.position.set(0.0, 3.25, 7.0);
      this.scene.add(frontLintel);

      // ⑨ 間仕切り壁1 (バックヤード / 売場, x = -6.0, z: [-7, 7])
      // 開口部: 通路開口部 (z: [-4.8, -3.2], 幅1.6m開放アーチ, 高さ2.5m)
      addWall(0.3, 3.5, 2.2, -6.0, 1.75, -5.9); // 奥側壁 (z: -7.0 〜 -4.8)
      addWall(0.3, 3.5, 10.2, -6.0, 1.75, 1.9);   // 手前側壁 (z: -3.2 〜 7.0)
      // 通路上部の鴨居壁
      const lintelBackyard = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 1.6), wallMat);
      lintelBackyard.position.set(-6.0, 3.0, -4.0);
      this.scene.add(lintelBackyard);

      // 売場側看板 (関係者以外立入禁止、頭上設置・障害物なし)
      const signBYMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture('🚪 バックヤード\n関係者以外立入禁止', '#2c3e50', '#f1c40f', 256, 128)
      });
      const signBY = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.45), signBYMat);
      signBY.rotation.y = Math.PI / 2;
      signBY.position.set(-5.84, 2.75, -4.0);
      this.scene.add(signBY);

      // バックヤード側看板 (売場へ、頭上設置)
      const signBYInnerMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture('🚪 売場へ\nTO SALES FLOOR', '#1e824c', '#ffffff', 256, 128)
      });
      const signBYInner = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.45), signBYInnerMat);
      signBYInner.rotation.y = -Math.PI / 2;
      signBYInner.position.set(-6.16, 2.75, -4.0);
      this.scene.add(signBYInner);

      // ⑩ 間仕切り壁2 (売場 / 事務所, x = 6.0, z: [-7, 7])
      // 開口部: 通路開口部 (z: [-4.8, -3.2], 幅1.6m開放アーチ, 高さ2.5m)
      addWall(0.3, 3.5, 2.2, 6.0, 1.75, -5.9); // 奥側壁 (z: -7.0 〜 -4.8)
      addWall(0.3, 3.5, 10.2, 6.0, 1.75, 1.9);   // 手前側壁 (z: -3.2 〜 7.0)
      // 通路上部の鴨居壁
      const lintelOffice = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 1.6), wallMat);
      lintelOffice.position.set(6.0, 3.0, -4.0);
      this.scene.add(lintelOffice);

      // 売場側看板 (事務所 STAFF ONLY、頭上設置・障害物なし)
      const signOffMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture('🚪 事務所\nSTAFF ONLY', '#2980b9', '#ffffff', 256, 128)
      });
      const signOff = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.45), signOffMat);
      signOff.rotation.y = -Math.PI / 2;
      signOff.position.set(5.84, 2.75, -4.0);
      this.scene.add(signOff);

      // 事務所側看板 (売場へ、頭上設置)
      const signOffInnerMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture('🚪 売場へ\nTO SALES FLOOR', '#1e824c', '#ffffff', 256, 128)
      });
      const signOffInner = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.45), signOffInnerMat);
      signOffInner.rotation.y = Math.PI / 2;
      signOffInner.position.set(6.16, 2.75, -4.0);
      this.scene.add(signOffInner);

      // ⑪ 屋外配達エリアの周囲フェンス・防護壁
      addWall(7.2, 2.4, 0.25, -9.0, 1.2, -12.0, darkWallMat); // 奥フェンス (z = -12.0, x: -12.6 〜 -5.4)
      addWall(0.25, 2.4, 5.0, -12.5, 1.2, -9.5, darkWallMat); // 左フェンス (x = -12.5, z: -12.0 〜 -7.0)
      addWall(0.25, 2.4, 5.0, -5.5, 1.2, -9.5, darkWallMat);  // 右フェンス (x = -5.5, z: -12.0 〜 -7.0)

      // ==========================================
      // 4. バックヤード (空きスペース)
      // ==========================================
      // ※ 要望に基づき什器・保管棚・資材を全撤去し、自由に商品や備品を保管・運搬できる広々とした空部屋として確保

      // ==========================================
      // 5. 事務所内の設備・什器 (Office Interior)
      // ==========================================
      const offFurnGroup = new THREE.Group();

      // 管理金庫 (売上金保管金庫, x = 11.2, z = -5.8)
      const safeMat = new THREE.MeshLambertMaterial({ color: 0x34495e });
      const safeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 0.8), safeMat);
      safeMesh.position.set(11.2, 0.55, -5.8);
      offFurnGroup.add(safeMesh);

      const safeDial = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 12), new THREE.MeshLambertMaterial({ color: 0xf1c40f }));
      safeDial.rotation.z = Math.PI / 2;
      safeDial.position.set(10.78, 0.65, -5.8);
      offFurnGroup.add(safeDial);

      const safeSignMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture('🔒 店舗金庫', '#111111', '#f1c40f', 128, 64)
      });
      const safeSign = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.2), safeSignMat);
      safeSign.rotation.y = -Math.PI / 2;
      safeSign.position.set(10.78, 0.95, -5.8);
      offFurnGroup.add(safeSign);

      // 書類棚・ロッカー (x = 11.2, z = 1.0)
      const lockerMat = new THREE.MeshLambertMaterial({ color: 0x7f8c8d });
      const locker = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.2, 2.2), lockerMat);
      locker.position.set(11.2, 1.1, 1.0);
      offFurnGroup.add(locker);

      // 連絡用ホワイトボード (奥壁 x = 9.0, y = 1.8, z = -6.83)
      const wbMat = new THREE.MeshBasicMaterial({
        map: createWhiteboardTexture()
      });
      const whiteboard = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.5), wbMat);
      whiteboard.position.set(9.0, 1.8, -6.83);
      offFurnGroup.add(whiteboard);

      // 休憩用テーブル ＆ イス (x = 9.0, z = 3.8)
      const tableMat = new THREE.MeshLambertMaterial({ color: 0xd5dbdb });
      const breakTable = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.75, 16), tableMat);
      breakTable.position.set(9.0, 0.375, 3.8);
      offFurnGroup.add(breakTable);

      [-0.85, 0.85].forEach(cx => {
        const chair = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), new THREE.MeshLambertMaterial({ color: 0x2980b9 }));
        chair.position.set(9.0 + cx, 0.225, 3.8);
        offFurnGroup.add(chair);
      });

      // 事務所頭上バナー
      const offBannerMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture('💼 事務所 (店舗管理・発注室)', '#2980b9', '#ffffff', 512, 96),
        side: THREE.DoubleSide
      });
      const offBanner = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 0.65), offBannerMat);
      offBanner.position.set(9.0, 3.0, 0.0);
      offFurnGroup.add(offBanner);

      this.scene.add(offFurnGroup);

      // ==========================================
      // 6. 売場中央の頭上案内 (Sales Floor Sign)
      // ==========================================
      const salesBannerMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture('🛒 売場 (SALES FLOOR)', '#1e824c', '#ffffff', 512, 96),
        side: THREE.DoubleSide
      });
      const salesBanner = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 0.7), salesBannerMat);
      salesBanner.position.set(0.0, 3.15, 0.0);
      this.scene.add(salesBanner);

      // 管理PCデスクを事務所内に配置
      this.createOfficeDesk();
      this.createOpenCloseSwitch();

      // 屋外環境 (駐車場 ＆ 街並み ＆ 裏の配達受取エリア) を構築
      this.buildStoreExteriorAndScenery();
    }

    createOfficeDesk() {
      // 仕様: 店舗管理PCは「事務所」内(x: 9.0, z: -3.5)に設置
      const group = new THREE.Group();
      group.position.set(9.0, 0, -3.5);

      const deskMat = new THREE.MeshLambertMaterial({ color: 0x34495e });
      const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.9), deskMat);
      deskTop.position.set(0, 0.74, 0);
      group.add(deskTop);

      // デスク脚 ＆ 引き出しキャビネット
      [-0.8, 0.8].forEach(lx => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.74, 0.8), deskMat);
        leg.position.set(lx, 0.37, 0);
        group.add(leg);
      });
      const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.75), new THREE.MeshLambertMaterial({ color: 0x7f8c8d }));
      drawer.position.set(0.55, 0.35, 0);
      group.add(drawer);

      // デュアルモニター (左: 防犯CCTV 4分割監視システム, 右: 本部ERP 発注・在庫ダッシュボード)
      const monitorBezelMat = new THREE.MeshLambertMaterial({ color: 0x182026 });
      const leftScreenMat = new THREE.MeshBasicMaterial({ map: createSecurityCamScreenTexture() });
      const rightScreenMat = new THREE.MeshBasicMaterial({ map: createErpOrderScreenTexture() });

      // 左モニター (CCTV 監視カメラ)
      const leftMaterials = [
        monitorBezelMat, monitorBezelMat, monitorBezelMat, monitorBezelMat,
        leftScreenMat, monitorBezelMat
      ];
      const leftMonitor = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.36, 0.03), leftMaterials);
      leftMonitor.position.set(-0.33, 1.05, -0.15);
      leftMonitor.rotation.y = 0.14;
      group.add(leftMonitor);

      const leftStand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.25), deskMat);
      leftStand.position.set(-0.33, 0.88, -0.15);
      group.add(leftStand);
      const leftBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.015, 0.16), monitorBezelMat);
      leftBase.position.set(-0.33, 0.77, -0.15);
      group.add(leftBase);

      // 右モニター (ERP Suite 発注・売上在庫管理)
      const rightMaterials = [
        monitorBezelMat, monitorBezelMat, monitorBezelMat, monitorBezelMat,
        rightScreenMat, monitorBezelMat
      ];
      const rightMonitor = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.36, 0.03), rightMaterials);
      rightMonitor.position.set(0.33, 1.05, -0.15);
      rightMonitor.rotation.y = -0.14;
      group.add(rightMonitor);

      const rightStand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.25), deskMat);
      rightStand.position.set(0.33, 0.88, -0.15);
      group.add(rightStand);
      const rightBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.015, 0.16), monitorBezelMat);
      rightBase.position.set(0.33, 0.77, -0.15);
      group.add(rightBase);

      // キーボード ＆ マウス
      const kbMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
      const kb = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.02, 0.16), kbMat);
      kb.position.set(-0.1, 0.79, 0.15);
      group.add(kb);

      const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.12), kbMat);
      mouse.position.set(0.24, 0.79, 0.15);
      group.add(mouse);

      // デスクトップタワーPC (電源LED付き)
      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.45, 0.45), new THREE.MeshLambertMaterial({ color: 0x1c2833 }));
      tower.position.set(-0.65, 0.23, 0.1);
      group.add(tower);

      const pwrLed = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), new THREE.MeshBasicMaterial({ color: 0x2ecc71 }));
      pwrLed.position.set(-0.65, 0.42, 0.33);
      group.add(pwrLed);

      // オフィスチェア
      const chairGroup = new THREE.Group();
      chairGroup.position.set(0, 0, 0.65);
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.5), new THREE.MeshLambertMaterial({ color: 0x2980b9 }));
      seat.position.y = 0.48;
      chairGroup.add(seat);

      const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.55, 0.08), new THREE.MeshLambertMaterial({ color: 0x2471a3 }));
      backrest.position.set(0, 0.78, 0.22);
      chairGroup.add(backrest);

      const chairPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45), deskMat);
      chairPole.position.y = 0.24;
      chairGroup.add(chairPole);
      group.add(chairGroup);

      // 頭上案内看板 (インタラクトプロンプト・見切れ防止高精細描画)
      const signGeo = new THREE.BoxGeometry(1.6, 0.36, 0.06);
      const signMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture('💻 店舗管理・発注PC\n[E] または [TAB] で操作', '#2980b9', '#ffffff', 512, 128)
      });
      const sign = new THREE.Mesh(signGeo, signMat);
      sign.position.set(0, 1.5, -0.2);
      group.add(sign);

      group.userData = { isPC: true };
      this.scene.add(group);
      this.officeDeskGroup = group;
    }

    createOpenCloseSwitch() {
      // 事務所内、PCデスクの左手前 (x: 7.5, y: 0, z: -3.2) に開店・閉店操作スタンドを配置
      const group = new THREE.Group();
      group.position.set(7.5, 0, -3.2);

      // 台座ベース
      const baseMat = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.08, 16), baseMat);
      base.position.y = 0.04;
      group.add(base);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.82, 12), baseMat);
      pole.position.y = 0.45;
      group.add(pole);

      // 操作ボックス天面 (手前に傾斜して操作しやすい)
      const boxMat = new THREE.MeshLambertMaterial({ color: 0x34495e });
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.42), boxMat);
      box.position.set(0, 0.9, 0);
      box.rotation.x = Math.PI / 6;
      group.add(box);

      // 大きな光る丸型プッシュボタン (赤: 準備中 / 緑: 営業中)
      const btnGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 20);
      const isRunning = this.store && this.store.isTimeRunning;
      const btnMat = new THREE.MeshLambertMaterial({ color: isRunning ? 0x27ae60 : 0xc0392b });
      const btn = new THREE.Mesh(btnGeo, btnMat);
      btn.position.set(0, 0.96, 0.02);
      btn.rotation.x = Math.PI / 6;
      group.add(btn);
      this.openCloseButtonMesh = btn;

      // LEDステータスライト
      const light = new THREE.PointLight(isRunning ? 0x2ecc71 : 0xe74c3c, 0.8, 4.0);
      light.position.set(0, 1.1, 0.1);
      group.add(light);
      this.openCloseLight = light;

      // 3D頭上ステータス看板 (見切れ防止512x256高精細描画)
      const signGeo = new THREE.PlaneGeometry(0.95, 0.48);
      const signText = isRunning
        ? '🟢 営業中 (OPEN)\n[E] または クリックで閉店'
        : '🔴 準備中 (CLOSED)\n[E] または クリックで開店';
      const signBg = isRunning ? '#1e824c' : '#c0392b';
      const signMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture(signText, signBg, '#ffffff', 512, 256),
        side: THREE.DoubleSide
      });
      const sign = new THREE.Mesh(signGeo, signMat);
      sign.position.set(0, 1.45, 0);
      group.add(sign);
      this.openCloseSignMesh = sign;

      group.userData = { isOpenCloseSwitch: true };
      group.traverse(c => {
        c.userData = { isOpenCloseSwitch: true };
      });

      this.scene.add(group);
      this.openCloseSwitchGroup = group;
    }

    updateOpenCloseSwitchVisuals() {
      if (!this.openCloseSwitchGroup) return;
      const isRunning = this.store && this.store.isTimeRunning;

      if (this.openCloseButtonMesh) {
        this.openCloseButtonMesh.material.color.setHex(isRunning ? 0x27ae60 : 0xc0392b);
      }
      if (this.openCloseSignMesh) {
        const text = isRunning
          ? '🟢 営業中 (OPEN)\n[E] または クリックで閉店'
          : '🔴 準備中 (CLOSED)\n[E] または クリックで開店';
        const bgCol = isRunning ? '#1e824c' : '#c0392b';
        this.openCloseSignMesh.material.map = createLabelTexture(text, bgCol, '#ffffff', 512, 256);
        this.openCloseSignMesh.material.needsUpdate = true;
      }
      if (this.openCloseLight) {
        this.openCloseLight.color.setHex(isRunning ? 0x2ecc71 : 0xe74c3c);
      }
    }

    buildStoreExteriorAndScenery() {
      // 1. 青空＆リアルな街並みフォグ
      this.scene.background = new THREE.Color(0x7ec0ee);
      this.scene.fog = new THREE.Fog(0xb8d5f2, 28, 80);

      const outdoorGroup = new THREE.Group();
      outdoorGroup.name = 'outdoor_scenery';

      // ==========================================
      // A. 屋外・裏の「配達エリア」 (Delivery Zone)
      // ※ トラックは邪魔なため撤去し、広々とした荷受スペースを確保
      // ==========================================
      // 台車 (勝手口壁際に立てかけ)
      const dollyGroup = new THREE.Group();
      dollyGroup.position.set(-11.7, 0, -7.4);
      const dollyPlate = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.95), new THREE.MeshLambertMaterial({ color: 0x2980b9 }));
      dollyPlate.position.y = 0.1;
      dollyGroup.add(dollyPlate);
      const dollyHandle = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.85, 0.05), new THREE.MeshLambertMaterial({ color: 0xbdc3c7 }));
      dollyHandle.position.set(0, 0.52, -0.45);
      dollyGroup.add(dollyHandle);
      outdoorGroup.add(dollyGroup);

      // 配達エリアの夜間用投光器 (Wall floodlight)
      const floodLight = new THREE.PointLight(0xfffaed, 0.6, 9.0);
      floodLight.position.set(-9.8, 3.2, -7.3);
      outdoorGroup.add(floodLight);

      // ==========================================
      // B. 屋外・手前の「駐車場」 (Parking Lot)
      // ==========================================
      // 駐車場アスファルト地盤 (幅 48m x 奥行 19m, z: [7, 26])
      const parkingGeo = new THREE.PlaneGeometry(48, 19);
      const parkingMat = new THREE.MeshLambertMaterial({
        map: createParkingLotTexture()
      });
      const parkingLot = new THREE.Mesh(parkingGeo, parkingMat);
      parkingLot.rotation.x = -Math.PI / 2;
      parkingLot.position.set(0, 0.006, 16.5);
      parkingLot.receiveShadow = true;
      outdoorGroup.add(parkingLot);

      // 駐車場の車止めブロック (Wheel stops)
      [-10.5, -6.5, -2.5, 2.5, 6.5, 10.5].forEach(sx => {
        const curbBlock = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.22), new THREE.MeshLambertMaterial({ color: 0xd5dbdb }));
        curbBlock.position.set(sx, 0.06, 15.5);
        outdoorGroup.add(curbBlock);
      });

      // 駐車中の車両 3台 (お客様の車)
      // ① 軽自動車 (白)
      const keiCar = new THREE.Group();
      keiCar.position.set(-6.5, 0, 12.0);
      const keiBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.75, 3.2), new THREE.MeshLambertMaterial({ color: 0xf8f9f9 }));
      keiBody.position.y = 0.55;
      keiCar.add(keiBody);
      const keiTop = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.65, 1.8), new THREE.MeshLambertMaterial({ color: 0x34495e }));
      keiTop.position.set(0, 1.2, -0.2);
      keiCar.add(keiTop);
      [-0.8, 0.8].forEach(wx => {
        [-0.9, 0.9].forEach(wz => {
          const w = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.16, 10), new THREE.MeshLambertMaterial({ color: 0x222222 }));
          w.rotation.z = Math.PI / 2;
          w.position.set(wx, 0.26, wz);
          keiCar.add(w);
        });
      });
      outdoorGroup.add(keiCar);

      // ② ファミリーワゴン / SUV (シルバー)
      const suvCar = new THREE.Group();
      suvCar.position.set(2.5, 0, 12.0);
      const suvBody = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.85, 3.8), new THREE.MeshLambertMaterial({ color: 0xbdc3c7 }));
      suvBody.position.y = 0.65;
      suvCar.add(suvBody);
      const suvTop = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.75, 2.2), new THREE.MeshLambertMaterial({ color: 0x2c3e50 }));
      suvTop.position.set(0, 1.4, -0.2);
      suvCar.add(suvTop);
      [-0.95, 0.95].forEach(wx => {
        [-1.1, 1.1].forEach(wz => {
          const w = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.2, 10), new THREE.MeshLambertMaterial({ color: 0x222222 }));
          w.rotation.z = Math.PI / 2;
          w.position.set(wx, 0.32, wz);
          suvCar.add(w);
        });
      });
      outdoorGroup.add(suvCar);

      // ③ セダン (ネイビー)
      const sedanCar = new THREE.Group();
      sedanCar.position.set(10.5, 0, 12.0);
      const sedanBody = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.65, 3.6), new THREE.MeshLambertMaterial({ color: 0x1b4f72 }));
      sedanBody.position.y = 0.52;
      sedanCar.add(sedanBody);
      const sedanTop = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.58, 1.7), new THREE.MeshLambertMaterial({ color: 0x17202a }));
      sedanTop.position.set(0, 1.1, -0.15);
      sedanCar.add(sedanTop);
      [-0.9, 0.9].forEach(wx => {
        [-1.0, 1.0].forEach(wz => {
          const w = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 10), new THREE.MeshLambertMaterial({ color: 0x222222 }));
          w.rotation.z = Math.PI / 2;
          w.position.set(wx, 0.28, wz);
          sedanCar.add(w);
        });
      });
      outdoorGroup.add(sedanCar);

      // ==========================================
      // C. 店舗ファサード・大看板 ＆ ひさし
      // ==========================================
      // 24H スーパーマーケット大看板 (全幅 24.6m)
      const fasciaGeo = new THREE.BoxGeometry(24.6, 1.15, 0.5);
      const fasciaMat = new THREE.MeshLambertMaterial({ map: createConveniFasciaTexture() });
      const fascia = new THREE.Mesh(fasciaGeo, fasciaMat);
      fascia.position.set(0, 3.85, 7.2);
      outdoorGroup.add(fascia);

      // ひさし (Overhang Canopy)
      const roofOverhangGeo = new THREE.BoxGeometry(25.0, 0.15, 1.2);
      const roofOverhangMat = new THREE.MeshLambertMaterial({ color: 0x34495e });
      const roofOverhang = new THREE.Mesh(roofOverhangGeo, roofOverhangMat);
      roofOverhang.position.set(0, 4.45, 7.55);
      outdoorGroup.add(roofOverhang);

      // 店頭の暖色ダウンライト
      [-8.0, -4.0, 0, 4.0, 8.0].forEach(x => {
        const spot = new THREE.PointLight(0xfff3cc, 0.5, 7);
        spot.position.set(x, 4.2, 7.8);
        outdoorGroup.add(spot);
      });

      // 自動ドアサッシ枠 ＆ センサー
      const doorFrameMat = new THREE.MeshLambertMaterial({ color: 0x7f8c8d });
      const topFrame = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.25, 0.18), doorFrameMat);
      topFrame.position.set(0, 3.3, 7.02);
      outdoorGroup.add(topFrame);

      const sensorBox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.12), new THREE.MeshLambertMaterial({ color: 0x222222 }));
      sensorBox.position.set(0, 3.15, 7.15);
      outdoorGroup.add(sensorBox);

      // ガラス面の広告キャンペーンポスター
      const posterMat1 = new THREE.MeshBasicMaterial({
        map: createLabelTexture('🍙 特製手作りおにぎり・お弁当\nできたて販売中！', '#e74c3c', '#ffffff', 256, 128)
      });
      const poster1 = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.9), posterMat1);
      poster1.position.set(-3.4, 1.65, 7.08);
      outdoorGroup.add(poster1);

      const posterMat2 = new THREE.MeshBasicMaterial({
        map: createLabelTexture('❄️ つめたいドリンク\n＆お菓子・スイーツ 24H', '#2980b9', '#ffffff', 256, 128)
      });
      const poster2 = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.9), posterMat2);
      poster2.position.set(3.4, 1.65, 7.08);
      outdoorGroup.add(poster2);

      // 店舗入口の「いらっしゃいませ WELCOME」マット
      const matGeo = new THREE.PlaneGeometry(2.4, 1.0);
      const matTexture = createLabelTexture('いらっしゃいませ\nWELCOME', '#962d22', '#f1c40f', 256, 128);
      const matMaterial = new THREE.MeshBasicMaterial({ map: matTexture });
      const welcomeMat = new THREE.Mesh(matGeo, matMaterial);
      welcomeMat.rotation.x = -Math.PI / 2;
      welcomeMat.position.set(0, 0.02, 6.6);
      outdoorGroup.add(welcomeMat);

      // ==========================================
      // D. 店頭歩道 ＆ 自販機 ＆ ポスト ＆ 駐輪場
      // ==========================================
      // 店頭歩道 (幅 50m x 奥行 2.5m)
      const sidewalkGeo = new THREE.PlaneGeometry(50, 2.5);
      const sidewalkMat = new THREE.MeshLambertMaterial({ color: 0xc5c9cc });
      const sidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
      sidewalk.rotation.x = -Math.PI / 2;
      sidewalk.position.set(0, 0.008, 8.25);
      sidewalk.receiveShadow = true;
      outdoorGroup.add(sidewalk);

      // 歩道縁石 (Curb)
      const curbGeo = new THREE.BoxGeometry(50, 0.14, 0.25);
      const curbMat = new THREE.MeshLambertMaterial({ color: 0x95a5a6 });
      const curb = new THREE.Mesh(curbGeo, curbMat);
      curb.position.set(0, 0.07, 9.5);
      outdoorGroup.add(curb);

      // 自動販売機 2台 ＆ ゴミ箱
      const vendGroup = new THREE.Group();
      vendGroup.position.set(-4.9, 0, 7.35);

      const vendRedGeo = new THREE.BoxGeometry(0.85, 1.85, 0.65);
      const vendRedMat = new THREE.MeshLambertMaterial({ map: createVendingMachineTexture('#c0392b', 'COLD DRINKS') });
      const vendRed = new THREE.Mesh(vendRedGeo, vendRedMat);
      vendRed.position.set(-0.5, 0.925, 0);
      vendGroup.add(vendRed);

      const vendBlueGeo = new THREE.BoxGeometry(0.85, 1.85, 0.65);
      const vendBlueMat = new THREE.MeshLambertMaterial({ map: createVendingMachineTexture('#2980b9', 'BOSS COFFEE') });
      const vendBlue = new THREE.Mesh(vendBlueGeo, vendBlueMat);
      vendBlue.position.set(0.5, 0.925, 0);
      vendGroup.add(vendBlue);

      const binGeo = new THREE.BoxGeometry(0.42, 0.95, 0.42);
      const binMat = new THREE.MeshLambertMaterial({ color: 0x27ae60 });
      const bin = new THREE.Mesh(binGeo, binMat);
      bin.position.set(1.15, 0.475, 0);
      vendGroup.add(bin);
      outdoorGroup.add(vendGroup);

      // 赤い郵便ポスト (〒)
      const postGroup = new THREE.Group();
      postGroup.position.set(-3.3, 0, 7.8);
      const postBase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.35), new THREE.MeshLambertMaterial({ color: 0x7f8c8d }));
      postBase.position.y = 0.175;
      postGroup.add(postBase);
      const postPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8), new THREE.MeshLambertMaterial({ color: 0x333333 }));
      postPole.position.y = 0.55;
      postGroup.add(postPole);
      const postBox = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.42), new THREE.MeshLambertMaterial({
        map: createLabelTexture('〒 郵便ポスト\nPOST', '#c0392b', '#ffffff', 256, 128)
      }));
      postBox.position.y = 1.05;
      postGroup.add(postBox);
      outdoorGroup.add(postGroup);

      // 駐輪場ラック ＆ 自転車
      const bikeRackGroup = new THREE.Group();
      bikeRackGroup.position.set(4.6, 0, 7.35);
      const rackBar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.05), new THREE.MeshLambertMaterial({ color: 0xbdc3c7 }));
      rackBar.position.set(0, 0.45, 0);
      bikeRackGroup.add(rackBar);
      [-0.7, 0, 0.7].forEach(bx => {
        const rackPost = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 8), new THREE.MeshLambertMaterial({ color: 0xbdc3c7 }));
        rackPost.position.set(bx, 0.25, 0);
        bikeRackGroup.add(rackPost);
      });
      [-0.4, 0.4].forEach((bx, bi) => {
        const bikeGroup = new THREE.Group();
        bikeGroup.position.set(bx, 0, 0);
        const wheelGeo = new THREE.TorusGeometry(0.28, 0.03, 6, 16);
        const wheelMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
        const fWheel = new THREE.Mesh(wheelGeo, wheelMat);
        fWheel.position.set(0, 0.28, 0.45);
        const rWheel = new THREE.Mesh(wheelGeo, wheelMat);
        rWheel.position.set(0, 0.28, -0.45);
        bikeGroup.add(fWheel, rWheel);
        const frame = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 6), new THREE.MeshLambertMaterial({ color: bi === 0 ? 0x2980b9 : 0xe74c3c }));
        frame.rotation.x = Math.PI / 4;
        frame.position.set(0, 0.42, 0);
        bikeGroup.add(frame);
        bikeRackGroup.add(bikeGroup);
      });
      outdoorGroup.add(bikeRackGroup);

      // ロードサイド大型ポール看板 (高さ 6.5m)
      const poleGroup = new THREE.Group();
      poleGroup.position.set(13.5, 0, 9.8);
      const tallPole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 6.5, 12), new THREE.MeshLambertMaterial({ color: 0x7f8c8d }));
      tallPole.position.y = 3.25;
      poleGroup.add(tallPole);
      const poleSignMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture('24H\nSUPER\nCONVENI\n酒・たばこ・ATM', '#1e824c', '#ffffff', 256, 256)
      });
      const poleSign = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.35), poleSignMat);
      poleSign.position.y = 5.6;
      poleGroup.add(poleSign);
      const poleLight = new THREE.PointLight(0xfffaed, 0.8, 12);
      poleLight.position.set(0, 5.8, 0.5);
      poleGroup.add(poleLight);
      outdoorGroup.add(poleGroup);

      // 街路灯 ＆ 街路樹
      [-18, -8, 8, 18].forEach((lx, li) => {
        const lampGroup = new THREE.Group();
        lampGroup.position.set(lx, 0, 9.2);
        const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 4.8, 8), new THREE.MeshLambertMaterial({ color: 0x34495e }));
        lampPole.position.y = 2.4;
        lampGroup.add(lampPole);
        const lampArm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.06), new THREE.MeshLambertMaterial({ color: 0x34495e }));
        lampArm.position.set(0, 4.8, 0.4);
        lampGroup.add(lampArm);
        const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.4), new THREE.MeshBasicMaterial({ color: 0xfff9e6 }));
        lantern.position.set(0, 4.75, 0.7);
        lampGroup.add(lantern);
        outdoorGroup.add(lampGroup);

        const treeGroup = new THREE.Group();
        treeGroup.position.set(lx + 3.0, 0, 9.2);
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 2.2, 8), new THREE.MeshLambertMaterial({ color: 0x5d4037 }));
        trunk.position.y = 1.1;
        treeGroup.add(trunk);
        const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.3, 8, 8), new THREE.MeshLambertMaterial({ color: 0x27ae60 }));
        leaves.position.y = 3.0;
        treeGroup.add(leaves);
        outdoorGroup.add(treeGroup);
      });

      // ==========================================
      // E. 車道 ＆ 向かい側の街並み (Road & Buildings)
      // ==========================================
      const roadGeo = new THREE.PlaneGeometry(60, 14);
      const roadMat = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(0, 0, 33.0);
      road.receiveShadow = true;
      outdoorGroup.add(road);

      // 横断歩道
      const crosswalkGeo = new THREE.PlaneGeometry(5.0, 13.6);
      const crosswalkMat = new THREE.MeshBasicMaterial({ map: createCrosswalkTexture() });
      const crosswalk = new THREE.Mesh(crosswalkGeo, crosswalkMat);
      crosswalk.rotation.x = -Math.PI / 2;
      crosswalk.position.set(0, 0.018, 33.0);
      outdoorGroup.add(crosswalk);

      // 向かい側ビル群
      const bldg1Mat = new THREE.MeshLambertMaterial({ map: createBuildingWindowTexture(5, 4, '#5dade2', '#7f8c8d') });
      const bldg1 = new THREE.Mesh(new THREE.BoxGeometry(10, 15, 8), bldg1Mat);
      bldg1.position.set(-13, 7.5, 43);
      outdoorGroup.add(bldg1);

      const bldg2Mat = new THREE.MeshLambertMaterial({ map: createBuildingWindowTexture(4, 5, '#85c1e9', '#d5dbdb') });
      const bldg2 = new THREE.Mesh(new THREE.BoxGeometry(11, 12, 8), bldg2Mat);
      bldg2.position.set(-1.5, 6.0, 43);
      outdoorGroup.add(bldg2);

      const bldg3Mat = new THREE.MeshLambertMaterial({ map: createBuildingWindowTexture(2, 3, '#f9e79f', '#a04000') });
      const bldg3 = new THREE.Mesh(new THREE.BoxGeometry(7.5, 7.0, 7.5), bldg3Mat);
      bldg3.position.set(8.5, 3.5, 42.5);
      outdoorGroup.add(bldg3);

      const bldg4Mat = new THREE.MeshLambertMaterial({ map: createBuildingWindowTexture(4, 3, '#76d7c4', '#566573') });
      const bldg4 = new THREE.Mesh(new THREE.BoxGeometry(8, 12, 8), bldg4Mat);
      bldg4.position.set(17, 6.0, 43);
      outdoorGroup.add(bldg4);

      // 遠景ビル群スカイライン
      [-25, -15, -5, 5, 15, 25].forEach((sx, si) => {
        const sh = 18 + (si % 3) * 6;
        const skyBldg = new THREE.Mesh(new THREE.BoxGeometry(8, sh, 8), new THREE.MeshBasicMaterial({ color: 0x95a5a6 }));
        skyBldg.position.set(sx, sh / 2, 55);
        outdoorGroup.add(skyBldg);
      });

      this.scene.add(outdoorGroup);
    }

    createPlacementDirectionGuide(fixtureType) {
      const guideGroup = new THREE.Group();
      guideGroup.name = 'placement_direction_guide';

      const isReg = fixtureType === 'register';

      // 1. 正面床デカール (+Z方向: お客様側・商品陳列側)
      const frontDecalGeo = new THREE.PlaneGeometry(1.8, 0.65);
      const frontText = isReg
        ? '⬆ お客様側 (お会計・並び列) FRONT ⬆'
        : '⬆ 正面 (商品陳列・お客様側) FRONT ⬆';
      const frontTexture = createLabelTexture(frontText, isReg ? '#27ae60' : '#f39c12', '#ffffff', 512, 128);
      const frontDecalMat = new THREE.MeshBasicMaterial({
        map: frontTexture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const frontDecal = new THREE.Mesh(frontDecalGeo, frontDecalMat);
      frontDecal.rotation.x = -Math.PI / 2;
      frontDecal.position.set(0, 0.03, 0.78);
      guideGroup.add(frontDecal);

      // 2. 正面を示す大きな矢印コーン (3D Arrow pointers)
      [-0.5, 0, 0.5].forEach(x => {
        const coneGeo = new THREE.ConeGeometry(0.09, 0.22, 8);
        coneGeo.rotateX(Math.PI / 2);
        const coneMat = new THREE.MeshBasicMaterial({ color: isReg ? 0x2ecc71 : 0xf1c40f });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.set(x, 0.04, 1.25);
        guideGroup.add(cone);

        const shaftGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.16, 8);
        shaftGeo.rotateX(Math.PI / 2);
        const shaft = new THREE.Mesh(shaftGeo, coneMat);
        shaft.position.set(x, 0.04, 1.08);
        guideGroup.add(shaft);
      });

      // 3. 背面床デカール (-Z方向: 壁側 / 店員側)
      const backDecalGeo = new THREE.PlaneGeometry(1.8, 0.45);
      const backText = isReg
        ? '👤 店員側 (あなた・レジ打ち) STAFF 👤'
        : '⛔ 背面 (壁側・うしろ) BACK ⛔';
      const backColor = isReg ? '#2980b9' : '#c0392b';
      const backTexture = createLabelTexture(backText, backColor, '#ffffff', 512, 96);
      const backDecalMat = new THREE.MeshBasicMaterial({
        map: backTexture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const backDecal = new THREE.Mesh(backDecalGeo, backDecalMat);
      backDecal.rotation.x = -Math.PI / 2;
      backDecal.position.set(0, 0.03, -0.65);
      guideGroup.add(backDecal);

      // 4. 頭上3D向きバナー (高さ 2.45m)
      const bannerGeo = new THREE.PlaneGeometry(1.6, 0.35);
      const bannerText = isReg ? '⬆ お客様側【正面】 FRONT ⬆' : '⬆ 正面【商品陳列面】 FRONT ⬆';
      const bannerMat = new THREE.MeshBasicMaterial({
        map: createLabelTexture(bannerText, isReg ? '#27ae60' : '#f39c12', '#ffffff', 256, 64),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95
      });
      const banner = new THREE.Mesh(bannerGeo, bannerMat);
      banner.position.set(0, 2.45, 0);
      guideGroup.add(banner);

      return guideGroup;
    }

    updatePlacementPrompt() {
      if (!this.placementFixture) return;
      const deg = Math.round((this.ghostRotation * 180 / Math.PI)) % 360;
      let dirText = '手前(入口)向き';
      if (deg === 90) dirText = '左向き';
      else if (deg === 180) dirText = '奥(壁)向き';
      else if (deg === 270) dirText = '右向き';

      this.ui.showPrompt(`【${this.placementFixture.name} 設置モード】 [左クリック] ここに設置 / [R] 90度回転 (現在: ${deg}° ${dirText}) / [右クリック] キャンセル<br><span style="color:#f1c40f;font-weight:bold;">※ 黄色い矢印【正面 ⬆】がお客様の通路側を向くように配置してください</span>`);
    }

    startPlacementMode(fixture, sourceBoxData = null) {
      this.placementMode = true;
      this.placementFixture = fixture;
      this.placementSourceBox = sourceBoxData;
      this.ghostRotation = 0;

      if (fixture.shelfType === 'ambient') {
        this.ghostMesh = createAmbientShelfModel();
      } else if (fixture.shelfType === 'chilled') {
        this.ghostMesh = createChilledShelfModel();
      } else {
        this.ghostMesh = createRegisterModel();
      }

      // 素材の色や看板テクスチャを残したまま半透明化（棚やレジの見た目をそのまま判別可能にする）
      this.ghostMesh.traverse(c => {
        if (c.isMesh && c.material) {
          c.material = c.material.clone();
          c.material.transparent = true;
          c.material.opacity = 0.82;
        }
      });

      // 向きガイド（正面・背面床表示 ＆ 矢印 ＆ 頭上バナー）を追加
      const guide = this.createPlacementDirectionGuide(fixture.shelfType);
      this.ghostMesh.add(guide);

      this.scene.add(this.ghostMesh);
      this.updatePlacementPrompt();
    }

    // 数学的平面交差判定により、内外問わず確実にプレビュー位置を追従
    updatePlacementGhost() {
      if (!this.placementMode || !this.ghostMesh) return;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const hit = this.raycaster.ray.intersectPlane(this.groundPlane, this.planeIntersectPoint);

      if (hit) {
        const snapX = Math.round(this.planeIntersectPoint.x * 2) / 2;
        const snapZ = Math.round(this.planeIntersectPoint.z * 2) / 2;

        // 店内境界にクランプ
        const clampedX = Math.max(-4.8, Math.min(4.8, snapX));
        const clampedZ = Math.max(-5.5, Math.min(5.5, snapZ));

        this.ghostMesh.position.set(clampedX, 0, clampedZ);
        this.ghostMesh.rotation.y = this.ghostRotation;
      }
    }

    confirmPlacement() {
      if (!this.placementMode || !this.ghostMesh) return;

      const pos = this.ghostMesh.position.clone();
      const rotY = this.ghostRotation;
      const fixtureName = this.placementFixture.name;

      if (this.placementFixture.shelfType === 'ambient') {
        this.store.addShelf('ambient', pos, rotY);
      } else if (this.placementFixture.shelfType === 'chilled') {
        this.store.addShelf('chilled', pos, rotY);
      } else if (this.placementFixture.shelfType === 'register') {
        this.store.setRegister(pos, rotY);
      }

      soundManager.playPlaceItem();
      this.holdingBox = null;
      this.placementSourceBox = null;
      this.cancelPlacement(false);

      this.ui.showToast(`『${fixtureName}』を開封・設置しました！`);
    }

    cancelPlacement(dropBox = true) {
      this.placementMode = false;
      if (this.ghostMesh) {
        this.scene.remove(this.ghostMesh);
        this.ghostMesh = null;
      }
      this.placementFixture = null;

      if (dropBox && this.holdingBox && this.holdingBox.isFixtureBox) {
        this.dropHoldingBox();
      } else if (!this.holdingBox) {
        this.ui.showPrompt('');
      }
    }

    handleInteraction() {
      if (this.isAnyModalOpen()) return;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      const interactables = [];
      if (this.store.register) interactables.push(this.store.register.mesh);
      this.store.shelves.forEach(s => interactables.push(s.mesh));
      this.store.deliveryBoxes.forEach(b => interactables.push(b.mesh));
      if (this.officeDeskGroup) interactables.push(this.officeDeskGroup);
      if (this.openCloseSwitchGroup) interactables.push(this.openCloseSwitchGroup);

      const intersects = this.raycaster.intersectObjects(interactables, true);
      if (intersects.length === 0) return;

      let hitObj = intersects[0].object;
      while (hitObj.parent && !hitObj.userData.shelfInstance && !hitObj.userData.isRegister && hitObj.name !== 'delivery_box' && !hitObj.userData.isPC && !hitObj.userData.isOpenCloseSwitch) {
        hitObj = hitObj.parent;
      }

      const dist = intersects[0].distance;
      if (dist > 3.6) return;

      // 1. レジ
      if (hitObj.userData && hitObj.userData.isRegister) {
        this.registerSystem.open();
        return;
      }

      // 2. 配達ダンボール箱 (商品 または 備品)
      if (hitObj.name === 'delivery_box') {
        if (this.holdingBox) {
          this.ui.showToast('すでに箱を持っています。先に棚に陳列するか床に置いてください。');
          return;
        }
        const boxData = this.store.pickUpBox(hitObj);
        if (!boxData) return;

        this.holdingBox = boxData;

        if (boxData.isFixtureBox) {
          this.startPlacementMode(boxData.fixture, boxData);
        } else {
          this.ui.showPrompt('[左クリック] 棚を狙って陳列 / [右クリック] 床に置く');
        }
        return;
      }

      // 3. 棚
      if (hitObj.userData && hitObj.userData.shelfInstance) {
        const shelf = hitObj.userData.shelfInstance;
        if (this.holdingBox) {
          if (this.holdingBox.isFixtureBox) return;

          const item = this.holdingBox.item;
          if (!shelf.canAcceptItem(item)) {
            soundManager.playError();
            const targetShelfName = item.category === 'デイリー' ? '冷蔵棚(デイリー専用)' : '商品棚(非デイリー専用)';
            this.ui.showToast(`【陳列不可】『${item.name}』は${item.category}商品です。『${targetShelfName}』に陳列してください！`);
            return;
          }

          const added = shelf.addItem(item, this.holdingBox.count);
          if (added > 0) {
            this.holdingBox.count -= added;
            if (this.holdingBox.count <= 0) {
              this.holdingBox = null;
              this.ui.showPrompt('');
            }
          } else {
            this.ui.showToast('この棚は満杯です！ (18/18)');
          }
        } else {
          this.ui.showToast(`棚の在庫: ${shelf.getTotalItemCount()} / ${shelf.capacity}`);
        }
        return;
      }

      // 4. 管理PC
      if (hitObj.userData && hitObj.userData.isPC) {
        this.ui.openManagementPC();
        return;
      }

      // 5. 開店・閉店スイッチ (事務所内)
      if (hitObj.userData && hitObj.userData.isOpenCloseSwitch) {
        this.ui.toggleStoreClock();
        return;
      }
    }

    dropHoldingBox() {
      if (!this.holdingBox) return;

      const yaw = this.euler.y;
      const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)).multiplyScalar(1.2);
      const dropPos = this.camera.position.clone().add(forward);
      dropPos.y = 0;
      dropPos.x = THREE.MathUtils.clamp(dropPos.x, -12.0, 12.0);
      dropPos.z = THREE.MathUtils.clamp(dropPos.z, -11.5, 20.0);

      if (this.holdingBox.isFixtureBox) {
        const boxMesh = createDeliveryBoxMesh({ isFixture: true, fixture: this.holdingBox.fixture });
        this.store.placeBoxInDeliveryZone(boxMesh, dropPos);
        this.store.deliveryBoxes.push({
          isFixtureBox: true,
          fixture: this.holdingBox.fixture,
          mesh: boxMesh,
          itemName: `[備品] ${this.holdingBox.fixture.name}`
        });
      } else {
        const boxMesh = createDeliveryBoxMesh({ item: this.holdingBox.item, count: this.holdingBox.count });
        this.store.placeBoxInDeliveryZone(boxMesh, dropPos);
        this.store.deliveryBoxes.push({
          isFixtureBox: false,
          item: this.holdingBox.item,
          count: this.holdingBox.count,
          mesh: boxMesh,
          itemName: this.holdingBox.item.name
        });
      }

      this.holdingBox = null;
      if (this.placementMode) {
        if (this.ghostMesh) {
          this.scene.remove(this.ghostMesh);
          this.ghostMesh = null;
        }
        this.placementMode = false;
        this.placementFixture = null;
      }

      soundManager.playBox();
      this.ui.showPrompt('');
    }

    updateCrosshairPrompt() {
      if (this.placementMode || this.isAnyModalOpen()) return;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const interactables = [];
      if (this.store.register) interactables.push(this.store.register.mesh);
      this.store.shelves.forEach(s => interactables.push(s.mesh));
      this.store.deliveryBoxes.forEach(b => interactables.push(b.mesh));
      if (this.officeDeskGroup) interactables.push(this.officeDeskGroup);
      if (this.openCloseSwitchGroup) interactables.push(this.openCloseSwitchGroup);

      const intersects = this.raycaster.intersectObjects(interactables, true);
      if (intersects.length > 0 && intersects[0].distance <= 3.6) {
        let hit = intersects[0].object;
        while (hit.parent && !hit.userData.shelfInstance && !hit.userData.isRegister && hit.name !== 'delivery_box' && !hit.userData.isPC && !hit.userData.isOpenCloseSwitch) {
          hit = hit.parent;
        }

        if (hit.userData && hit.userData.isRegister) {
          const queueLen = this.store.registerQueue.length;
          this.ui.showPrompt(`[E] レジに入る (待機客: ${queueLen}人)`);
        } else if (hit.name === 'delivery_box') {
          if (hit.userData && hit.userData.isFixtureBox) {
            this.ui.showPrompt(`[E] ${hit.userData.itemName} を持ち上げて設置する`);
          } else {
            this.ui.showPrompt(`[E] 箱を持つ (${hit.userData.itemName} x${hit.userData.count})`);
          }
        } else if (hit.userData && hit.userData.shelfInstance) {
          const shelf = hit.userData.shelfInstance;
          if (this.holdingBox) {
            if (this.holdingBox.isFixtureBox) {
              this.ui.showPrompt('[左クリック] ここに設置 / [R] 90度回転 / [右クリック] 箱を床に置く');
            } else {
              this.ui.showPrompt(`[左クリック] ${this.holdingBox.item.name} を陳列する`);
            }
          } else {
            this.ui.showPrompt(`[E] ${shelf.mesh.name === 'shelf_ambient' ? '商品棚(非デイリー)' : '冷蔵棚(デイリー)'} (在庫: ${shelf.getTotalItemCount()}/18)`);
          }
        } else if (hit.userData && hit.userData.isPC) {
          this.ui.showPrompt('[E または TAB] 管理・発注PCを開く');
        } else if (hit.userData && hit.userData.isOpenCloseSwitch) {
          if (this.store.isTimeRunning) {
            this.ui.showPrompt('⏸ [E または 左クリック] 店舗営業を一時停止・閉店する');
          } else {
            this.ui.showPrompt('▶ [E または 左クリック] 店舗を開店する (時間を進める)');
          }
        }
      } else {
        if (!this.holdingBox) {
          this.ui.showPrompt('');
        } else if (this.holdingBox.isFixtureBox) {
          this.ui.showPrompt('[左クリック] ここに設置 / [R] 90度回転 / [右クリック] 箱を床に置く');
        } else {
          this.ui.showPrompt('[左クリック] 棚に補充 / [右クリック] 箱を床に置く');
        }
      }
    }

    animate() {
      requestAnimationFrame(this.animate);
      const delta = Math.min(this.clock.getDelta(), 0.1);

      this.updatePlayerMovement(delta);
      this.store.update(delta);
      this.customerManager.update(delta, this.store);

      if (this.placementMode) {
        this.updatePlacementGhost();
      } else {
        this.updateCrosshairPrompt();
      }

      this.ui.update();
      this.renderer.render(this.scene, this.camera);
    }

    checkWallCollision(x, z, radius = 0.35) {
      if (!this.wallColliders) return false;
      for (let i = 0; i < this.wallColliders.length; i++) {
        const box = this.wallColliders[i];
        if (x + radius > box.minX && x - radius < box.maxX &&
            z + radius > box.minZ && z - radius < box.maxZ) {
          return true;
        }
      }
      return false;
    }

    updatePlayerMovement(delta) {
      if (!this.isPointerLocked || this.isAnyModalOpen()) return;

      const moveVector = new THREE.Vector3();
      if (this.keys['KeyW']) moveVector.z -= 1;
      if (this.keys['KeyS']) moveVector.z += 1;
      if (this.keys['KeyA']) moveVector.x -= 1;
      if (this.keys['KeyD']) moveVector.x += 1;

      if (moveVector.lengthSq() > 0) {
        moveVector.normalize();
        const yaw = this.euler.y;
        const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
        const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));

        const displacement = new THREE.Vector3()
          .addScaledVector(forward, -moveVector.z)
          .addScaledVector(right, moveVector.x)
          .multiplyScalar(this.moveSpeed * delta);

        const curPos = this.camera.position;
        let nextX = curPos.x + displacement.x;
        let nextZ = curPos.z + displacement.z;

        // X軸移動の判定 (衝突があればX移動のみキャンセルしてZ軸へ滑らかにスライド)
        if (this.checkWallCollision(nextX, curPos.z, 0.35)) {
          nextX = curPos.x;
        }

        // Z軸移動の判定 (衝突があればZ移動のみキャンセルしてX軸へ滑らかにスライド)
        if (this.checkWallCollision(nextX, nextZ, 0.35)) {
          nextZ = curPos.z;
        }

        // 全体マップ範囲のクランプ (落下・マップ外貫通の安全防止)
        // 配達エリア (z < -6.85) への進入はバックヤード荷受口 (x: -12.3 〜 -5.7) から可能
        if (nextZ < -6.85) {
          if (curPos.x >= -12.3 && curPos.x <= -5.7) {
            // バックヤード荷受口から屋外配達受取エリアへシームレスに進入
            nextX = Math.max(-12.2, Math.min(-5.8, nextX));
            nextZ = Math.max(-11.7, nextZ);
          } else {
            // 売場や事務所の奥壁の外へは出られないよう保護
            nextZ = Math.max(-6.85, nextZ);
            nextX = Math.max(-23.5, Math.min(23.5, nextX));
          }
        } else {
          // 店内3部屋および手前駐車場 (x: -23.5〜23.5, z: -6.85〜24.5)
          nextX = Math.max(-23.5, Math.min(23.5, nextX));
          nextZ = Math.min(24.5, nextZ);
        }

        this.camera.position.x = nextX;
        this.camera.position.z = nextZ;
        this.camera.position.y = 1.65;
      }
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
  });
})();
