// ==========================================
// 店舗状態管理 ＆ 棚・商品・陳列・配達システム
// ==========================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import {
  createAmbientShelfModel,
  createChilledShelfModel,
  createRegisterModel,
  createProductMesh,
  createDeliveryBoxMesh
} from './models.js';
import { ITEM_CATALOG, FIXTURE_CATALOG, getItemById, CATEGORIES } from './items.js';
import { soundManager } from './audio.js';

// 棚クラス
export class ShelfInstance {
  constructor(type, position, rotationY = 0) {
    this.id = 'shelf_' + Math.random().toString(36).substr(2, 9);
    this.type = type; // 'ambient' または 'chilled'
    this.capacity = 18; // 3段 × 6個
    this.slots = []; // [{ itemId, count, meshGroup }]

    // 3Dモデル生成
    if (this.type === 'ambient') {
      this.mesh = createAmbientShelfModel();
    } else {
      this.mesh = createChilledShelfModel();
    }

    this.mesh.position.copy(position);
    this.mesh.rotation.y = rotationY;
    this.mesh.userData = { shelfInstance: this, isInteractable: true };

    // 商品表示用3Dコンテナ
    this.itemContainer = new THREE.Group();
    this.mesh.add(this.itemContainer);
  }

  // 指定商品を受け入れ可能かチェック
  canAcceptItem(item) {
    if (this.type === 'ambient') {
      return item.category === CATEGORIES.NON_DAILY;
    } else if (this.type === 'chilled') {
      return item.category === CATEGORIES.DAILY;
    }
    return false;
  }

  // 商品の陳列
  addItem(item, count = 1) {
    if (!this.canAcceptItem(item)) {
      return 0; // カテゴリ不一致
    }

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
    return this.slots.reduce((sum, s) => sum + s.count, 0);
  }

  // 3D商品ビジュアルの再描画
  updateVisuals() {
    // 既存の陳列メッシュをクリア
    while (this.itemContainer.children.length > 0) {
      const child = this.itemContainer.children[0];
      this.itemContainer.remove(child);
    }

    // 3段の棚板高さ設定
    const yLevels = this.type === 'ambient'
      ? [0.42, 0.92, 1.42]
      : [0.62, 1.12, 1.62];

    let currentSlotIndex = 0;
    const maxPerShelf = 6;

    this.slots.forEach(slot => {
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

// レジカウンタークラス
export class RegisterInstance {
  constructor(position, rotationY = 0) {
    this.mesh = createRegisterModel();
    this.mesh.position.copy(position);
    this.mesh.rotation.y = rotationY;
    this.mesh.userData = { isRegister: true, registerInstance: this };
  }
}

// 店舗管理メインクラス
export class Store {
  constructor(scene) {
    this.scene = scene;

    // 資金
    this.cash = 60000; // 初期所持金 6万円
    this.dailyRevenue = 0;
    this.dailyCost = 0;
    this.dailyCustomersServed = 0;

    // 時間システム (8:00 ～ 22:00)
    this.hour = 8;
    this.minute = 0;
    this.timeScale = 6.0; // 1分 = 0.5〜1秒
    this.isTimeRunning = false; // "開始時に時計が停止している状態にする"

    // 設置済みの設備
    this.shelves = [];
    this.register = null;

    // 配達ダンボール箱リスト
    this.deliveryBoxes = [];

    // プレイヤーが手に持っているもの
    // { type: 'box', itemId, count, mesh } または { type: 'fixture', fixtureId, mesh }
    this.holdingItem = null;

    // レジ待機列
    this.registerQueue = [];
    this.currentRegisterCustomer = null;

    // 日次集計データ
    this.dayNumber = 1;
    this.history = [];
  }

  // 時間進行更新
  update(delta) {
    if (!this.isTimeRunning) return;

    this.minute += delta * this.timeScale;
    if (this.minute >= 60) {
      this.hour += Math.floor(this.minute / 60);
      this.minute = this.minute % 60;

      // 閉店時間 (22:00)
      if (this.hour >= 22) {
        this.hour = 22;
        this.minute = 0;
        this.handleStoreClose();
      }
    }
  }

  // 開店 / 時間再開
  startDay() {
    this.isTimeRunning = true;
  }

  // 一時停止
  pauseDay() {
    this.isTimeRunning = false;
  }

  // 閉店処理
  handleStoreClose() {
    // 閉店時間になったら新規来客は停止するが、すでに並んでいる客の会計は続けられる
    if (this.registerQueue.length === 0 && !this.currentRegisterCustomer) {
      this.isTimeRunning = false;
      // 日次決算イベント発火
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

  // 次の日へ
  advanceToNextDay() {
    this.dayNumber++;
    this.hour = 8;
    this.minute = 0;
    this.isTimeRunning = false; // 翌朝も時計停止からスタート
    this.dailyRevenue = 0;
    this.dailyCost = 0;
    this.dailyCustomersServed = 0;
  }

  // 備品・商品購入処理
  purchaseFixture(fixtureId) {
    const fixture = FIXTURE_CATALOG.find(f => f.id === fixtureId);
    if (!fixture) return { success: false, msg: '該当の備品が見つかりません' };
    if (this.cash < fixture.cost) return { success: false, msg: '資金が不足しています' };

    this.cash -= fixture.cost;
    this.dailyCost += fixture.cost;
    soundManager.playRegisterDing();

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

    // 店外・エントランス付近にダンボール箱を配送
    this.spawnDeliveryBox(item, count);
    return { success: true, item, count };
  }

  // 配達箱の生成
  spawnDeliveryBox(item, count) {
    const boxMesh = createDeliveryBoxMesh(item, count);
    // 店先 (正面ドアの少し外側) に並べる
    const offset = this.deliveryBoxes.length * 0.65;
    boxMesh.position.set(-2.0 + (offset % 4) * 0.65, 0, 5.8 + Math.floor(offset / 4) * 0.5);

    this.scene.add(boxMesh);
    this.deliveryBoxes.push({
      item,
      count,
      mesh: boxMesh
    });
  }

  // 箱を拾う
  pickUpBox(boxMesh) {
    const idx = this.deliveryBoxes.findIndex(b => b.mesh === boxMesh);
    if (idx === -1) return null;

    const boxData = this.deliveryBoxes.splice(idx, 1)[0];
    this.scene.remove(boxMesh);
    soundManager.playBox();
    return boxData;
  }

  // 棚の追加
  addShelf(type, position, rotationY = 0) {
    const shelf = new ShelfInstance(type, position, rotationY);
    this.shelves.push(shelf);
    this.scene.add(shelf.mesh);
    return shelf;
  }

  // レジの追加
  setRegister(position, rotationY = 0) {
    if (this.register) {
      this.scene.remove(this.register.mesh);
    }
    this.register = new RegisterInstance(position, rotationY);
    this.scene.add(this.register.mesh);
    return this.register;
  }
}
