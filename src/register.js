// ==========================================
// レジシステム ＆ POS会計インターフェース
// 仕様: スキャン → かご内商品が1つずつ減る＆合計金額に加算 →
//       0になったら「会計する」ボタンが押せる → 押す → 預り金受取 →
//       おつりを渡す → 売上に反映 ＆ 客退店
// ==========================================

import { soundManager } from './audio.js';

export class RegisterSystem {
  constructor(store) {
    this.store = store;
    this.currentCustomer = null;
    this.scannedItems = [];
    this.unscannedBasket = [];
    this.subtotal = 0;
    this.givenCash = 0;
    this.enteredChange = 0;
    this.stage = 'CLOSED'; // 'CLOSED', 'SCANNING', 'PAYMENT', 'CHANGE_GIVEN'

    // DOM要素のバインド
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
    // スキャンボタン
    if (this.btnScanNext) {
      this.btnScanNext.addEventListener('click', () => {
        this.scanNextItem();
      });
    }

    // 会計するボタン
    if (this.btnCheckout) {
      this.btnCheckout.addEventListener('click', () => {
        this.startPayment();
      });
    }

    // おつりを渡すボタン
    if (this.btnGiveChange) {
      this.btnGiveChange.addEventListener('click', () => {
        this.giveChangeAndComplete();
      });
    }

    // レジ画面を閉じる
    if (this.btnCloseRegister) {
      this.btnCloseRegister.addEventListener('click', () => {
        this.close();
      });
    }

    // おつりトレイのコイン/お札ボタン
    document.querySelectorAll('.money-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const value = parseInt(e.target.dataset.value, 10);
        if (!isNaN(value)) {
          this.addChangeMoney(value);
        }
      });
    });

    const btnClearChange = document.getElementById('btn-pos-clear-change');
    if (btnClearChange) {
      btnClearChange.addEventListener('click', () => {
        this.enteredChange = 0;
        this.updatePaymentUI();
      });
    }

    const btnExactChange = document.getElementById('btn-pos-exact-change');
    if (btnExactChange) {
      btnExactChange.addEventListener('click', () => {
        const due = Math.max(0, this.givenCash - this.subtotal);
        this.enteredChange = due;
        this.updatePaymentUI();
      });
    }
  }

  // レジ画面を開く
  open(customer) {
    if (!customer) {
      // レジ前に客がいない場合
      if (this.store.currentRegisterCustomer) {
        customer = this.store.currentRegisterCustomer;
      } else if (this.store.registerQueue.length > 0) {
        customer = this.store.registerQueue[0];
      }
    }

    if (!customer || customer.basket.length === 0) {
      alert('レジに会計待ちのお客様がいません。');
      return;
    }

    this.currentCustomer = customer;
    this.unscannedBasket = [...customer.basket];
    this.scannedItems = [];
    this.subtotal = 0;
    this.givenCash = 0;
    this.enteredChange = 0;
    this.stage = 'SCANNING';

    // 顧客情報表示
    this.customerInfoEl.textContent = `${customer.occupation} (${customer.age})・${customer.customerType}`;

    this.paymentSection.classList.add('hidden');
    this.btnCheckout.disabled = true; // バスケットが0になるまで無効
    this.btnCheckout.classList.remove('btn-ready');

    this.modal.classList.remove('hidden');
    this.updateScanUI();

    // マウスカーソルを解放して操作可能に
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
  }

  close() {
    this.modal.classList.add('hidden');
    this.stage = 'CLOSED';
    this.currentCustomer = null;
  }

  // 1点スキャン処理
  // 仕様: スキャン→かご内商品数が一つずつ減る＆合計金額に加算されていく→0になったら会計するボタンが押せるようになる
  scanNextItem() {
    if (this.unscannedBasket.length === 0) return;

    const basketItem = this.unscannedBasket.shift();
    this.scannedItems.push(basketItem);
    this.subtotal += basketItem.price;

    soundManager.playScan();
    this.updateScanUI();

    // 0になったら会計するボタンが押せるようになる
    if (this.unscannedBasket.length === 0) {
      this.btnCheckout.disabled = false;
      this.btnCheckout.classList.add('btn-ready');
      if (this.btnScanNext) {
        this.btnScanNext.disabled = true;
      }
    }
  }

  // スキャン画面UI更新
  updateScanUI() {
    this.basketCountEl.textContent = this.unscannedBasket.length;
    this.subtotalEl.textContent = `¥${this.subtotal.toLocaleString()}`;

    // レシートリスト更新
    this.receiptListEl.innerHTML = '';
    this.scannedItems.forEach(item => {
      const row = document.createElement('div');
      row.className = 'receipt-row';
      row.innerHTML = `<span>${item.item.name}</span><span>¥${item.price.toLocaleString()}</span>`;
      this.receiptListEl.appendChild(row);
    });

    // カゴ内商品リスト更新
    this.basketListEl.innerHTML = '';
    this.unscannedBasket.forEach((item, index) => {
      const badge = document.createElement('div');
      badge.className = 'basket-item-badge';
      badge.textContent = item.item.name;
      badge.title = 'クリックでスキャン';
      badge.addEventListener('click', () => {
        this.scanNextItem();
      });
      this.basketListEl.appendChild(badge);
    });

    if (this.unscannedBasket.length === 0) {
      this.basketListEl.innerHTML = '<div class="empty-basket-msg">かごが空になりました！「お会計する」を押してください</div>';
    }
  }

  // 会計するボタン押下処理
  // 仕様: 押す→預り金受け取る
  startPayment() {
    if (this.unscannedBasket.length > 0) return;

    this.stage = 'PAYMENT';
    this.givenCash = this.currentCustomer.givenCash || this.subtotal;
    if (this.givenCash < this.subtotal) {
      this.givenCash = this.subtotal;
    }

    const dueChange = this.givenCash - this.subtotal;
    this.enteredChange = 0;

    this.paymentSection.classList.remove('hidden');
    this.btnCheckout.disabled = true;

    this.givenCashEl.textContent = `¥${this.givenCash.toLocaleString()}`;
    this.dueChangeEl.textContent = `¥${dueChange.toLocaleString()}`;
    this.updatePaymentUI();

    soundManager.playCoin();
  }

  addChangeMoney(val) {
    this.enteredChange += val;
    soundManager.playCoin();
    this.updatePaymentUI();
  }

  updatePaymentUI() {
    const dueChange = this.givenCash - this.subtotal;
    this.currentChangeEl.textContent = `¥${this.enteredChange.toLocaleString()}`;

    // お釣りがぴったり合っているか確認
    if (this.enteredChange === dueChange) {
      this.btnGiveChange.disabled = false;
      this.btnGiveChange.classList.add('btn-ready');
      this.currentChangeEl.style.color = '#27ae60';
    } else {
      this.btnGiveChange.disabled = false; // プレイヤーの判断でも渡せるようにする
      this.currentChangeEl.style.color = '#e74c3c';
    }
  }

  // おつりを渡す → 売上に反映＆客退店
  giveChangeAndComplete() {
    const dueChange = this.givenCash - this.subtotal;

    if (this.enteredChange !== dueChange) {
      const ok = confirm(`おつりの金額が異なります。\n必要おつり: ¥${dueChange} / 現在: ¥${this.enteredChange}\nこのまま会計を完了しますか？`);
      if (!ok) return;
    }

    // 売上に反映
    this.store.cash += this.subtotal;
    this.store.dailyRevenue += this.subtotal;
    this.store.dailyCustomersServed++;

    // レジ音
    soundManager.playRegisterDing();

    // 客退店
    if (this.currentCustomer) {
      this.currentCustomer.finishCheckoutAndLeave(this.store);
    }

    // 完了メッセージを表示
    const toast = document.createElement('div');
    toast.className = 'pos-toast';
    toast.textContent = `お会計完了！ 売上 +¥${this.subtotal.toLocaleString()}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);

    // 画面を閉じる、または次の客がいるなら継続
    if (this.store.registerQueue.length > 0) {
      setTimeout(() => {
        this.open(this.store.registerQueue[0]);
      }, 600);
    } else {
      this.close();
    }
  }
}
