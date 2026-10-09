// ==========================================
// 客ロジック ＆ AIシステム
// 年代、職業、固定客/流動客、時間帯別ピーク、行動ステートマシン
// ==========================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { createHumanoidModel } from './models.js';
import { soundManager } from './audio.js';
import { ITEM_CATALOG } from './items.js';

// 客の属性定義
export const AGE_GROUPS = ['10代', '20代', '30代', '40代', '50代', '60代以上'];
export const OCCUPATIONS = {
  STUDENT: '学生',
  WORKER: '会社員',
  HOMEMAKER: '主婦',
  SENIOR: 'シニア'
};

export const CUSTOMER_TYPES = {
  REGULAR: '固定客',
  FLOATING: '流動客'
};

// 顧客クラス
export class Customer {
  constructor(options = {}) {
    this.id = 'cust_' + Math.random().toString(36).substr(2, 9);
    this.age = options.age || '20代';
    this.occupation = options.occupation || OCCUPATIONS.WORKER;
    this.customerType = options.customerType || CUSTOMER_TYPES.FLOATING;

    // 年代・職業に応じた予算とお買い物予定
    this.basket = []; // 買い物かごの中身 [{ item, count, price }]
    this.targetItemIds = [];
    this.targetItemCount = 1;
    this.state = 'ENTERING'; // ENTERING, SHOPPING, TO_REGISTER, QUEUEING, CHECKOUT, LEAVING

    // 移動制御
    this.targetPos = new THREE.Vector3(0, 0, 0);
    this.speed = 2.0;
    this.currentShelfTarget = null;
    this.waitTimer = 0;

    // 会計用
    this.givenCash = 0; // 客がレジで出すお金
    this.totalPrice = 0;

    // 属性に応じた好みとアイテム点数の決定
    this.setupPreferences();

    // 3Dモデル生成
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

    // 初期出現位置 (店外の道路・歩道)
    this.mesh.position.set((Math.random() - 0.5) * 4, 0, 8.5);
    this.targetPos.set(0, 0, 5.0); // 店内エントランスへ
  }

  // 好み・購買点数の初期化
  setupPreferences() {
    let desiredCount = 2;
    let preferredIds = [];

    switch (this.age) {
      case '10代':
        desiredCount = Math.floor(Math.random() * 3) + 1; // 1〜3個
        preferredIds = [
          'snack_chips_salt', 'snack_chips_consomme', 'snack_chocolate', 'snack_ebisen',
          'drink_cola', 'drink_cider', 'bread_hotdog', 'bread_anko', 'rice_tsunamayo'
        ];
        break;

      case '20代':
        desiredCount = Math.floor(Math.random() * 3) + 2; // 2〜4個
        preferredIds = [
          'bento_noriben', 'bento_salmon', 'bread_sandwich_egg', 'bread_sandwich_ham',
          'drink_water', 'drink_greentea', 'rice_tsunamayo', 'rice_salmon', 'drink_cola'
        ];
        break;

      case '30代':
      case '40代':
        if (this.occupation === OCCUPATIONS.HOMEMAKER) {
          desiredCount = Math.floor(Math.random() * 4) + 3; // 3〜6個 (家族分)
          preferredIds = [
            'bread_anko', 'bread_peanut', 'bread_anpan', 'bread_sandwich_ham',
            'snack_cookie', 'snack_imokenpi', 'snack_chips_salt', 'drink_barleytea',
            'drink_blacktea', 'rice_salmon', 'rice_konbu'
          ];
        } else {
          // 会社員
          desiredCount = Math.floor(Math.random() * 3) + 2; // 2〜4個
          preferredIds = [
            'bento_makunouchi', 'bento_salmon', 'bread_sandwich_ham',
            'drink_greentea', 'drink_water', 'rice_salmon', 'snack_chocolate'
          ];
        }
        break;

      case '50代':
      case '60代以上':
        desiredCount = Math.floor(Math.random() * 3) + 1; // 1〜3個
        preferredIds = [
          'bento_salmon', 'bento_makunouchi', 'rice_konbu', 'rice_salmon',
          'drink_greentea', 'drink_barleytea', 'snack_imokenpi', 'bread_anpan'
        ];
        break;
    }

    // 固定客なら購入意欲 +1
    if (this.customerType === CUSTOMER_TYPES.REGULAR) {
      desiredCount = Math.min(desiredCount + 1, 6);
    }

    this.targetItemCount = desiredCount;
    this.targetItemIds = preferredIds;
  }

  // フレーム更新 (AIロジック)
  update(delta, store) {
    // 待機時間がある場合
    if (this.waitTimer > 0) {
      this.waitTimer -= delta;
      this.animate(0); // 停止
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
        // レジ操作待ち。停止して待機
        this.animate(0);
        break;

      case 'LEAVING':
        this.updateLeaving(delta, store);
        break;
    }
  }

  // 店内へ進入
  updateEntering(delta, store) {
    const reached = this.moveTowards(this.targetPos, delta);
    if (reached) {
      // 入店チャイム再生
      soundManager.playDoorChime();
      this.state = 'SHOPPING';
      this.pickNextShelfTarget(store);
    }
  }

  // 棚を探して向かう
  pickNextShelfTarget(store) {
    if (this.basket.length >= this.targetItemCount) {
      // 買い物が終わったのでレジへ
      this.goToRegister(store);
      return;
    }

    // 商品がある棚を探す
    const availableShelves = store.shelves.filter(shelf => {
      return shelf.slots.some(slot => slot.count > 0);
    });

    if (availableShelves.length === 0) {
      // 店内に商品が何もない！
      if (this.basket.length > 0) {
        this.goToRegister(store);
      } else {
        // 何も買えずに残念そうに退店
        this.state = 'LEAVING';
        this.targetPos.set(0, 0, 9);
      }
      return;
    }

    // 好みの商品がある棚を優先探索
    let preferredShelves = availableShelves.filter(shelf => {
      return shelf.slots.some(slot => slot.count > 0 && this.targetItemIds.includes(slot.itemId));
    });

    const chosenShelf = preferredShelves.length > 0
      ? preferredShelves[Math.floor(Math.random() * preferredShelves.length)]
      : availableShelves[Math.floor(Math.random() * availableShelves.length)];

    this.currentShelfTarget = chosenShelf;
    // 棚の正面位置へ目標設定
    const forward = new THREE.Vector3(0, 0, 1).applyEuler(chosenShelf.mesh.rotation);
    const standPos = chosenShelf.mesh.position.clone().add(forward.multiplyScalar(0.9));
    this.targetPos.copy(standPos);
  }

  // 棚の前でお買い物
  updateShopping(delta, store) {
    const reached = this.moveTowards(this.targetPos, delta);
    if (reached) {
      // 棚を向く
      if (this.currentShelfTarget) {
        this.mesh.lookAt(this.currentShelfTarget.mesh.position.x, this.mesh.position.y, this.currentShelfTarget.mesh.position.z);

        // 棚から商品を1点ピッキング
        const slot = this.currentShelfTarget.slots.find(s => s.count > 0);
        if (slot) {
          slot.count--;
          this.currentShelfTarget.updateVisuals();
          const itemMaster = ITEM_CATALOG.find(i => i.id === slot.itemId);
          if (itemMaster) {
            this.basket.push({
              item: itemMaster,
              price: itemMaster.price
            });
            this.totalPrice += itemMaster.price;
          }
        }
      }

      // 1〜1.5秒商品を選んでから次の棚へ
      this.waitTimer = 1.0 + Math.random() * 0.5;
      this.pickNextShelfTarget(store);
    }
  }

  // レジへ向かう
  goToRegister(store) {
    const register = store.register;
    if (!register) {
      // レジがまだ置かれていない！
      this.state = 'LEAVING';
      this.targetPos.set(0, 0, 9);
      return;
    }

    this.state = 'TO_REGISTER';
    store.registerQueue.push(this);
    this.updateQueuePosition(store);
  }

  // 列の位置を更新
  updateQueuePosition(store) {
    if (!store.register) return;
    const queueIndex = store.registerQueue.indexOf(this);
    if (queueIndex === -1) return;

    // レジ正面の列 (index 0 がレジ前、1, 2, ... が後ろに並ぶ)
    const regPos = store.register.mesh.position;
    const regRot = store.register.mesh.rotation.y;

    // レジ前位置
    const offsetZ = 1.0 + queueIndex * 0.9;
    const queuePos = new THREE.Vector3(
      regPos.x - Math.sin(regRot) * offsetZ - 0.4,
      0,
      regPos.z - Math.cos(regRot) * offsetZ
    );

    this.targetPos.copy(queuePos);
  }

  updateToRegister(delta, store) {
    const reached = this.moveTowards(this.targetPos, delta);
    if (reached) {
      this.state = 'QUEUEING';
      const queueIndex = store.registerQueue.indexOf(this);
      if (queueIndex === 0) {
        this.startCheckout(store);
      }
    }
  }

  updateQueueing(delta, store) {
    this.updateQueuePosition(store);
    this.moveTowards(this.targetPos, delta);

    const queueIndex = store.registerQueue.indexOf(this);
    if (queueIndex === 0 && this.mesh.position.distanceTo(this.targetPos) < 0.2) {
      this.startCheckout(store);
    }
  }

  // 会計開始
  startCheckout(store) {
    this.state = 'CHECKOUT';
    // レジカウンターの方を向く
    if (store.register) {
      this.mesh.lookAt(store.register.mesh.position.x, this.mesh.position.y, store.register.mesh.position.z);
    }

    // お会計金額に応じた預り金（客が支払うお札・小銭）を決定
    this.calculateGivenCash();
    // UIやシステムに現在の会計顧客として登録
    store.currentRegisterCustomer = this;
  }

  // 預り金の決定 (例: ¥680に対し ¥1,000 や ¥1,180 や ¥5,000 を出す)
  calculateGivenCash() {
    const total = this.totalPrice;
    if (total <= 0) {
      this.givenCash = 0;
      return;
    }

    // ぴったり
    if (Math.random() < 0.25) {
      this.givenCash = total;
      return;
    }

    // 次のきりの良い金額 (千円札、5千円札、1万円札、端数小銭)
    const roundUps = [
      Math.ceil(total / 100) * 100,
      Math.ceil(total / 500) * 500,
      Math.ceil(total / 1000) * 1000,
      Math.ceil(total / 5000) * 5000,
      10000
    ].filter(v => v >= total);

    this.givenCash = roundUps[Math.floor(Math.random() * roundUps.length)] || total;
  }

  // 会計完了後の退店
  finishCheckoutAndLeave(store) {
    this.state = 'LEAVING';
    store.currentRegisterCustomer = null;
    const idx = store.registerQueue.indexOf(this);
    if (idx !== -1) {
      store.registerQueue.splice(idx, 1);
    }

    // 後続客の列を前進させる
    store.registerQueue.forEach(c => c.updateQueuePosition(store));

    // 出口へ向かう
    this.targetPos.set(0, 0, 9);
  }

  updateLeaving(delta, store) {
    const reached = this.moveTowards(this.targetPos, delta);
    if (reached) {
      // 画面外に消滅
      this.isFinished = true;
    }
  }

  // 目標座標へスムーズに移動 ＆ 歩行アニメーション
  moveTowards(target, delta) {
    const diff = target.clone().sub(this.mesh.position);
    diff.y = 0;
    const dist = diff.length();

    if (dist < 0.08) {
      this.mesh.position.x = target.x;
      this.mesh.position.z = target.z;
      this.animate(0);
      return true;
    }

    diff.normalize();
    const moveDist = Math.min(this.speed * delta, dist);
    this.mesh.position.add(diff.multiplyScalar(moveDist));

    // 進行方向へ向きを変える
    const targetAngle = Math.atan2(diff.x, diff.z);
    this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, targetAngle, 0.15);

    // 歩行アニメーション
    this.animate(1);
    return false;
  }

  // 歩行アニメーション (手足の振り)
  animate(movingSpeedFactor) {
    const data = this.mesh.userData;
    if (!data.leftLeg) return;

    if (movingSpeedFactor > 0) {
      data.animTime += 0.18;
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

// ----------------------------------------------------
// 客生成マネージャー (時間帯別ピーク・出現率コントロール)
// ----------------------------------------------------
export class CustomerManager {
  constructor(scene) {
    this.scene = scene;
    this.customers = [];
    this.spawnTimer = 0;
    this.employees = []; // 従業員リスト
  }

  update(delta, store) {
    // 営業時間外または時計停止中なら新規来客スポーンは停止
    if (store.isTimeRunning && store.hour < 22) {
      this.spawnTimer -= delta;

      // 現在時刻に応じたスポーン間隔の計算
      const interval = this.calculateSpawnInterval(store.hour);

      if (this.spawnTimer <= 0) {
        this.spawnTimer = interval;
        this.spawnCustomer(store);
      }
    }

    // 既存顧客の更新
    for (let i = this.customers.length - 1; i >= 0; i--) {
      const c = this.customers[i];
      c.update(delta, store);

      if (c.isFinished) {
        this.scene.remove(c.mesh);
        this.customers.splice(i, 1);
      }
    }

    // 従業員の更新 (可視化)
    this.employees.forEach(emp => {
      emp.update(delta, store);
    });
  }

  // 時間帯別来客ピークロジック
  // 開店～9時: 出勤ピーク / 11時～13時: 昼ピーク / 17時～19時: 夕方ピーク
  calculateSpawnInterval(hour) {
    if (hour >= 8 && hour < 9) {
      // 出勤ピーク (高密度: 5〜8秒に1人)
      return 5 + Math.random() * 3;
    } else if (hour >= 11 && hour < 13) {
      // 昼ピーク (超高密度: 4〜7秒に1人)
      return 4 + Math.random() * 3;
    } else if (hour >= 17 && hour < 19) {
      // 夕方ピーク (高密度: 5〜8秒に1人)
      return 5 + Math.random() * 3;
    } else if (hour >= 9 && hour < 11) {
      // 午前閑散期 (12〜16秒に1人)
      return 12 + Math.random() * 4;
    } else {
      // 午後・夜間 (8〜12秒に1人)
      return 8 + Math.random() * 4;
    }
  }

  // 客の出現
  spawnCustomer(store) {
    // 最大滞在人数制限 (低スペックPCでも快適に動くよう最大10名まで)
    if (this.customers.length >= 10) return;

    // 時間帯による年齢層・職業の偏り
    const hour = store.hour;
    let age = '20代';
    let occupation = OCCUPATIONS.WORKER;

    const rand = Math.random();
    if (hour >= 8 && hour < 9) {
      // 出勤ピーク: 会社員 60%, 学生 30%, その他 10%
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
      // 午前: 主婦 50%, シニア 40%, その他 10%
      if (rand < 0.5) {
        occupation = OCCUPATIONS.HOMEMAKER;
        age = Math.random() < 0.5 ? '30代' : '40代';
      } else {
        occupation = OCCUPATIONS.SENIOR;
        age = Math.random() < 0.5 ? '50代' : '60代以上';
      }
    } else if (hour >= 11 && hour < 13) {
      // 昼ピーク: 会社員 70%, 学生 20%, 主婦 10%
      if (rand < 0.7) {
        occupation = OCCUPATIONS.WORKER;
        age = Math.random() < 0.4 ? '20代' : (Math.random() < 0.7 ? '30代' : '40代');
      } else {
        occupation = OCCUPATIONS.STUDENT;
        age = '10代';
      }
    } else if (hour >= 17 && hour < 19) {
      // 夕方ピーク: 会社員 50%, 学生 30%, 主婦 20%
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
      // 夜間
      occupation = rand < 0.6 ? OCCUPATIONS.WORKER : (rand < 0.85 ? OCCUPATIONS.STUDENT : OCCUPATIONS.SENIOR);
      age = rand < 0.4 ? '20代' : (rand < 0.7 ? '30代' : '50代');
    }

    const customerType = Math.random() < 0.35 ? CUSTOMER_TYPES.REGULAR : CUSTOMER_TYPES.FLOATING;

    const customer = new Customer({
      age,
      occupation,
      customerType
    });

    this.customers.push(customer);
    this.scene.add(customer.mesh);
  }

  // 従業員を追加
  addEmployee(name = '店員 田中') {
    const empMesh = createHumanoidModel({
      isEmployee: true,
      badgeText: `スタッフ: ${name}`
    });
    empMesh.position.set(-2.5, 0, 2);

    const emp = {
      mesh: empMesh,
      name: name,
      update: (delta, store) => {
        // バックルーム待機やレジサポートの可視化アニメーション
        empMesh.userData.animTime = (empMesh.userData.animTime || 0) + delta;
      }
    };

    this.employees.push(emp);
    this.scene.add(empMesh);
  }
}
