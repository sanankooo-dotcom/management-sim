// ==========================================
// UIコントローラー ＆ 発注・管理PC ＆ チュートリアル
// ==========================================

import { ITEM_CATALOG, FIXTURE_CATALOG, CATEGORIES, SUBCATEGORIES } from './items.js';

export class UIManager {
  constructor(store, game) {
    this.store = store;
    this.game = game;

    // HUD要素
    this.hudTime = document.getElementById('hud-time');
    this.hudDay = document.getElementById('hud-day');
    this.hudCash = document.getElementById('hud-cash');
    this.hudRevenue = document.getElementById('hud-revenue');
    this.hudStatus = document.getElementById('hud-status');
    this.hudPrompt = document.getElementById('hud-prompt');
    this.hudHand = document.getElementById('hud-hand-info');
    this.btnToggleClock = document.getElementById('btn-toggle-clock');

    // モーダル要素
    this.tutorialModal = document.getElementById('tutorial-modal');
    this.managementModal = document.getElementById('management-modal');
    this.dayEndModal = document.getElementById('day-end-modal');

    this.initEventListeners();
    this.initCatalogUI();
  }

  initEventListeners() {
    // チュートリアル閉じるボタン
    const btnCloseTutorial = document.getElementById('btn-close-tutorial');
    if (btnCloseTutorial) {
      btnCloseTutorial.addEventListener('click', () => {
        this.tutorialModal.classList.add('hidden');
      });
    }

    // 時計の開始/一時停止ボタン
    if (this.btnToggleClock) {
      this.btnToggleClock.addEventListener('click', () => {
        if (this.store.isTimeRunning) {
          this.store.pauseDay();
          this.btnToggleClock.textContent = '▶ 開店 (時間を進める)';
          this.btnToggleClock.classList.remove('running');
        } else {
          // レジと棚が置かれているか確認
          if (!this.store.register) {
            alert('【確認】まだレジが配置されていません！\n管理PC [TAB] で備品を購入し、レジを配置してください。');
          }
          this.store.startDay();
          this.btnToggleClock.textContent = '⏸ 一時停止';
          this.btnToggleClock.classList.add('running');
        }
      });
    }

    // 管理PC開閉
    const btnOpenPc = document.getElementById('btn-open-pc');
    if (btnOpenPc) {
      btnOpenPc.addEventListener('click', () => {
        this.openManagementPC();
      });
    }

    const btnClosePc = document.getElementById('btn-close-pc');
    if (btnClosePc) {
      btnClosePc.addEventListener('click', () => {
        this.closeManagementPC();
      });
    }

    // チュートリアルボタン (いつでも見返せる)
    const btnShowTutorial = document.getElementById('btn-show-tutorial');
    if (btnShowTutorial) {
      btnShowTutorial.addEventListener('click', () => {
        this.tutorialModal.classList.remove('hidden');
        if (document.exitPointerLock) document.exitPointerLock();
      });
    }

    // 翌日へボタン
    const btnNextDay = document.getElementById('btn-next-day');
    if (btnNextDay) {
      btnNextDay.addEventListener('click', () => {
        this.store.advanceToNextDay();
        this.dayEndModal.classList.add('hidden');
        this.btnToggleClock.textContent = '▶ 開店 (時間を進める)';
        this.btnToggleClock.classList.remove('running');
      });
    }

    // 日次終了イベント監視
    window.addEventListener('store-day-ended', (e) => {
      this.showDayEndModal(e.detail);
    });

    // キーボードショートカット
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        if (this.managementModal.classList.contains('hidden')) {
          this.openManagementPC();
        } else {
          this.closeManagementPC();
        }
      }
    });

    // タブ切り替え
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const tabTarget = document.getElementById(btn.dataset.tab);
        if (tabTarget) tabTarget.classList.add('active');
      });
    });
  }

  // 発注画面カタログの構築
  initCatalogUI() {
    const fixtureList = document.getElementById('pc-fixture-list');
    const dailyList = document.getElementById('pc-daily-list');
    const nonDailyList = document.getElementById('pc-nondaily-list');
    const employeeList = document.getElementById('pc-employee-list');

    // 1. 備品リスト (棚・レジ)
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
          <button class="btn btn-buy" data-fixture-id="${fixture.id}">購入して設置</button>
        </div>
      `;

      card.querySelector('.btn-buy').addEventListener('click', () => {
        this.buyFixture(fixture.id);
      });
      fixtureList.appendChild(card);
    });

    // 2. デイリー商品 (米飯・パン)
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

      card.querySelector('.btn-buy').addEventListener('click', () => {
        this.buyItem(item.id, 12);
      });
      dailyList.appendChild(card);
    });

    // 3. 非デイリー商品 (お菓子・ドリンク)
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

      card.querySelector('.btn-buy').addEventListener('click', () => {
        this.buyItem(item.id, 12);
      });
      nonDailyList.appendChild(card);
    });

    // 4. 従業員雇用
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
      btnHire.addEventListener('click', () => {
        if (this.store.cash < 8000) {
          alert('資金が不足しています。');
          return;
        }
        this.store.cash -= 8000;
        this.store.dailyCost += 8000;
        this.game.customerManager.addEmployee('田中さん');
        btnHire.disabled = true;
        btnHire.textContent = '雇用済み';
        alert('田中さんを雇用しました！店舗内にスタッフが配置されました。');
      });
    }
  }

  // 備品購入
  buyFixture(fixtureId) {
    const res = this.store.purchaseFixture(fixtureId);
    if (!res.success) {
      alert(res.msg);
      return;
    }

    this.closeManagementPC();
    // 設置モード起動
    this.game.startPlacementMode(res.fixture);
  }

  // 商品発注
  buyItem(itemId, count = 12) {
    const res = this.store.purchaseItem(itemId, count);
    if (!res.success) {
      alert(res.msg);
      return;
    }

    const toast = document.createElement('div');
    toast.className = 'pos-toast';
    toast.textContent = `【配達完了】店先に『${res.item.name}』の段ボールが届きました！`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  openManagementPC() {
    this.managementModal.classList.remove('hidden');
    if (document.exitPointerLock) document.exitPointerLock();
  }

  closeManagementPC() {
    this.managementModal.classList.add('hidden');
  }

  // 毎フレームのHUD更新
  update() {
    // 時間表示 (8:00 ～ 22:00)
    const h = String(Math.floor(this.store.hour)).padStart(2, '0');
    const m = String(Math.floor(this.store.minute)).padStart(2, '0');
    this.hudTime.textContent = `${h}:${m}`;
    this.hudDay.textContent = `Day ${this.store.dayNumber}`;
    this.hudCash.textContent = `所持金: ¥${this.store.cash.toLocaleString()}`;
    this.hudRevenue.textContent = `本日売上: ¥${this.store.dailyRevenue.toLocaleString()}`;

    // 時間帯ピークステータス
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

    // 手持ちアイテム表示
    if (this.game.holdingBox) {
      this.hudHand.textContent = `📦 所持中: ${this.game.holdingBox.item.name} (残り ${this.game.holdingBox.count}個)`;
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

  showDayEndModal(stats) {
    document.getElementById('end-day-number').textContent = stats.day;
    document.getElementById('end-revenue').textContent = `¥${stats.revenue.toLocaleString()}`;
    document.getElementById('end-cost').textContent = `¥${stats.cost.toLocaleString()}`;
    document.getElementById('end-profit').textContent = `¥${stats.profit.toLocaleString()}`;
    document.getElementById('end-customers').textContent = `${stats.customersServed} 人`;

    this.dayEndModal.classList.remove('hidden');
    if (document.exitPointerLock) document.exitPointerLock();
  }
}
