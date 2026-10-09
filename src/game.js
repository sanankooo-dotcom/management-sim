// ==========================================
// 3Dゲームエンジン ＆ FPS操作 ＆ レンダリングループ
// ==========================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { createFloorTexture, createAmbientShelfModel, createChilledShelfModel, createRegisterModel } from './models.js';
import { Store } from './store.js';
import { CustomerManager } from './customer.js';
import { RegisterSystem } from './register.js';
import { UIManager } from './ui.js';
import { soundManager } from './audio.js';

export class Game {
  constructor() {
    this.canvasContainer = document.getElementById('canvas-container');
    this.crosshair = document.getElementById('crosshair');

    // 1. Three.js シーン・カメラ・レンダラー (低スペックPC向け軽量設定)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd6eaf8); // 外の青空
    this.scene.fog = new THREE.Fog(0xd6eaf8, 15, 45);

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 1.65, 4); // プレイヤー初期視点 (身長 1.65m)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.canvasContainer.appendChild(this.renderer.domElement);

    // 2. システム初期化
    this.store = new Store(this.scene);
    this.customerManager = new CustomerManager(this.scene);
    this.registerSystem = new RegisterSystem(this.store);
    this.ui = new UIManager(this.store, this);

    // 3. 一人称視点 (FPS) 操作設定
    this.setupFPSControls();

    // 4. 店舗建物 ＆ ライティングの構築
    this.buildStoreEnvironment();

    // 5. レイキャスター (インタラクション用)
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(0, 0); // 画面中央

    // 6. 設置モード (備品配置) ＆ 手持ち箱
    this.placementMode = false;
    this.placementFixture = null;
    this.ghostMesh = null;
    this.ghostRotation = 0;
    this.holdingBox = null;

    // 7. アニメーションループ開始
    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    // ウィンドウリサイズ対応
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // ----------------------------------------------------
  // FPS操作セットアップ (WASD + マウス視点移動)
  // ----------------------------------------------------
  setupFPSControls() {
    this.keys = {};
    this.moveSpeed = 4.2;
    this.isPointerLocked = false;
    this.euler = new THREE.Euler(0, 0, 0, 'YXZ');

    // キー入力監視
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Eキーでインタラクト
      if (e.code === 'KeyE') {
        this.handleInteraction();
      }

      // Rキーで配置回転
      if (e.code === 'KeyR' && this.placementMode) {
        this.ghostRotation += Math.PI / 2;
        if (this.ghostMesh) {
          this.ghostMesh.rotation.y = this.ghostRotation;
        }
      }

      // ESCまたは右クリックで配置キャンセル
      if (e.code === 'Escape' && this.placementMode) {
        this.cancelPlacement();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // ポインターロックの要求 (画面クリックで視点ロック)
    this.canvasContainer.addEventListener('click', () => {
      // モーダルが開いていない場合のみロック
      const anyModalOpen = !document.getElementById('register-modal').classList.contains('hidden') ||
                           !document.getElementById('management-modal').classList.contains('hidden') ||
                           !document.getElementById('tutorial-modal').classList.contains('hidden') ||
                           !document.getElementById('day-end-modal').classList.contains('hidden');

      if (!anyModalOpen && !this.isPointerLocked) {
        this.canvasContainer.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.canvasContainer;
    });

    // マウス視点移動
    document.addEventListener('mousemove', (e) => {
      if (!this.isPointerLocked) return;

      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      this.euler.setFromQuaternion(this.camera.quaternion);
      this.euler.y -= movementX * 0.0022;
      this.euler.x -= movementY * 0.0022;

      // 上下の首振り角度制限 (-80度 〜 +80度)
      this.euler.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.euler.x));
      this.camera.quaternion.setFromEuler(this.euler);
    });

    // 左クリック操作
    window.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // 左クリック
        if (this.placementMode) {
          this.confirmPlacement();
        } else if (this.isPointerLocked) {
          this.handleInteraction();
        }
      } else if (e.button === 2) { // 右クリック
        if (this.placementMode) {
          this.cancelPlacement();
        } else if (this.holdingBox) {
          // 箱を床に置く
          this.dropHoldingBox();
        }
      }
    });

    // コンテキストメニュー抑止
    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  // ----------------------------------------------------
  // 店舗建物 ＆ 照明 (スーパーマーケット風)
  // ----------------------------------------------------
  buildStoreEnvironment() {
    // 環境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    // 太陽光 (店先)
    const dirLight = new THREE.DirectionalLight(0xfffaed, 0.8);
    dirLight.position.set(5, 12, 12);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 30;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    this.scene.add(dirLight);

    // 店舗内タイル床 (12m x 14m)
    const floorGeo = new THREE.PlaneGeometry(12, 14);
    const floorMat = new THREE.MeshLambertMaterial({
      map: createFloorTexture(),
      roughness: 0.2
    });
    this.floor = new THREE.Mesh(floorGeo, floorMat);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.set(0, 0, 0);
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    // 外の歩道・アスファルト
    const roadGeo = new THREE.PlaneGeometry(24, 10);
    const roadMat = new THREE.MeshLambertMaterial({ color: 0x566573 });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, -0.01, 11);
    road.receiveShadow = true;
    this.scene.add(road);

    // 歩道 (ブロックタイル)
    const sidewalkGeo = new THREE.PlaneGeometry(16, 3);
    const sidewalkMat = new THREE.MeshLambertMaterial({ color: 0xbdc3c7 });
    const sidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
    sidewalk.rotation.x = -Math.PI / 2;
    sidewalk.position.set(0, 0.01, 7.5);
    sidewalk.receiveShadow = true;
    this.scene.add(sidewalk);

    // 店の壁 (奥、左、右)
    const wallMat = new THREE.MeshLambertMaterial({ color: 0xf8f9f9 });

    // 奥壁
    const backWallGeo = new THREE.BoxGeometry(12, 3.5, 0.3);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 1.75, -7);
    this.scene.add(backWall);

    // 左壁
    const leftWallGeo = new THREE.BoxGeometry(0.3, 3.5, 14);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-6, 1.75, 0);
    this.scene.add(leftWall);

    // 右壁
    const rightWallGeo = new THREE.BoxGeometry(0.3, 3.5, 14);
    const rightWall = new THREE.Mesh(rightWallGeo, wallMat);
    rightWall.position.set(6, 1.75, 0);
    this.scene.add(rightWall);

    // 天井
    const ceilGeo = new THREE.PlaneGeometry(12, 14);
    const ceilMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const ceiling = new THREE.Mesh(ceilGeo, ceilMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 3.5, 0);
    this.scene.add(ceiling);

    // 蛍光灯ライト (天井LED)
    [-3, 0, 3].forEach(x => {
      [-3, 2].forEach(z => {
        const lightBoxGeo = new THREE.BoxGeometry(0.3, 0.08, 2.5);
        const lightBoxMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const lightBox = new THREE.Mesh(lightBoxGeo, lightBoxMat);
        lightBox.position.set(x, 3.45, z);
        this.scene.add(lightBox);

        const pLight = new THREE.PointLight(0xfff8ee, 0.5, 8);
        pLight.position.set(x, 3.3, z);
        this.scene.add(pLight);
      });
    });

    // 正面ガラスファサード ＆ 自動ドア
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x85c1e9,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1
    });

    const frontGlassLeft = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.2, 0.1), glassMat);
    frontGlassLeft.position.set(-3.7, 1.6, 7);
    this.scene.add(frontGlassLeft);

    const frontGlassRight = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.2, 0.1), glassMat);
    frontGlassRight.position.set(3.7, 1.6, 7);
    this.scene.add(frontGlassRight);

    // 正面自動ドア枠 (幅2.8mの中央エントランス)
    const doorFrameMat = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
    const doorTop = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.4, 0.2), doorFrameMat);
    doorTop.position.set(0, 3.3, 7);
    this.scene.add(doorTop);

    // 管理PCデスク (バックオフィス・角に常設)
    this.createOfficeDesk();
  }

  // 管理PCデスク (角に設置された管理端末)
  createOfficeDesk() {
    const group = new THREE.Group();
    group.position.set(-4.8, 0, -5.5);
    group.rotation.y = Math.PI / 4;

    // デスク
    const deskMat = new THREE.MeshLambertMaterial({ color: 0x7f8c8d });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.75, 0.8), deskMat);
    desk.position.y = 0.375;
    group.add(desk);

    // PCモニター
    const monMat = new THREE.MeshBasicMaterial({ color: 0x1a5276 });
    const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.05), monMat);
    monitor.position.set(0, 0.95, -0.15);
    group.add(monitor);

    // キーボード
    const kbMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const kb = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.15), kbMat);
    kb.position.set(0, 0.76, 0.1);
    group.add(kb);

    // 案内看板
    const signGeo = new THREE.BoxGeometry(1.2, 0.3, 0.05);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2980b9';
    ctx.fillRect(0, 0, 256, 64);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Meiryo, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💻 店舗管理PC [TAB]', 128, 32);
    const signMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 1.4, -0.2);
    group.add(sign);

    group.userData = { isPC: true };
    this.scene.add(group);
    this.officeDeskGroup = group;
  }

  // ----------------------------------------------------
  // 設置モード (棚・レジをプレイヤーが自由に配置)
  // ----------------------------------------------------
  startPlacementMode(fixture) {
    this.placementMode = true;
    this.placementFixture = fixture;
    this.ghostRotation = 0;

    // ゴーストメッシュ生成 (半透明グリーン)
    if (fixture.shelfType === 'ambient') {
      this.ghostMesh = createAmbientShelfModel();
    } else if (fixture.shelfType === 'chilled') {
      this.ghostMesh = createChilledShelfModel();
    } else {
      this.ghostMesh = createRegisterModel();
    }

    this.ghostMesh.traverse(child => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: 0x2ecc71,
          transparent: true,
          opacity: 0.5,
          wireframe: false
        });
      }
    });

    this.scene.add(this.ghostMesh);
    this.ui.showPrompt('[左クリック] ここに設置 / [R] 90度回転 / [右クリック] キャンセル');
  }

  updatePlacementGhost() {
    if (!this.placementMode || !this.ghostMesh) return;

    // 視線の先の床をレイキャスト
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.floor);

    if (intersects.length > 0) {
      const pt = intersects[0].point;
      // 0.5m単位のスナップ
      const snapX = Math.round(pt.x * 2) / 2;
      const snapZ = Math.round(pt.z * 2) / 2;

      // 店内境界内にクランプ
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

    if (this.placementFixture.shelfType === 'ambient') {
      this.store.addShelf('ambient', pos, rotY);
    } else if (this.placementFixture.shelfType === 'chilled') {
      this.store.addShelf('chilled', pos, rotY);
    } else if (this.placementFixture.shelfType === 'register') {
      this.store.setRegister(pos, rotY);
    }

    soundManager.playPlaceItem();
    this.cancelPlacement();

    const toast = document.createElement('div');
    toast.className = 'pos-toast';
    toast.textContent = `『${this.placementFixture.name}』を設置しました！`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  cancelPlacement() {
    this.placementMode = false;
    if (this.ghostMesh) {
      this.scene.remove(this.ghostMesh);
      this.ghostMesh = null;
    }
    this.placementFixture = null;
    this.ui.showPrompt('');
  }

  // ----------------------------------------------------
  // インタラクション (Raycastによる対象操作)
  // ----------------------------------------------------
  handleInteraction() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 判定対象
    const interactables = [];
    if (this.store.register) interactables.push(this.store.register.mesh);
    this.store.shelves.forEach(s => interactables.push(s.mesh));
    this.store.deliveryBoxes.forEach(b => interactables.push(b.mesh));
    if (this.officeDeskGroup) interactables.push(this.officeDeskGroup);

    const intersects = this.raycaster.intersectObjects(interactables, true);
    if (intersects.length === 0) return;

    // 一番近いオブジェクトのルートを探索
    let hitObj = intersects[0].object;
    while (hitObj.parent && !hitObj.userData.shelfInstance && !hitObj.userData.isRegister && hitObj.name !== 'delivery_box' && !hitObj.userData.isPC) {
      hitObj = hitObj.parent;
    }

    const dist = intersects[0].distance;
    if (dist > 3.5) return; // 遠すぎる場合は無効

    // 1. レジを操作
    if (hitObj.userData && hitObj.userData.isRegister) {
      this.registerSystem.open();
      return;
    }

    // 2. 配達箱を拾う
    if (hitObj.name === 'delivery_box') {
      if (this.holdingBox) {
        alert('すでに箱を持っています。先に棚に陳列するか床に置いてください。');
        return;
      }
      this.holdingBox = this.store.pickUpBox(hitObj);
      this.ui.showPrompt('[左クリック] 棚を狙って陳列 / [右クリック] 床に置く');
      return;
    }

    // 3. 棚に商品を補充
    if (hitObj.userData && hitObj.userData.shelfInstance) {
      const shelf = hitObj.userData.shelfInstance;
      if (this.holdingBox) {
        const item = this.holdingBox.item;

        // カテゴリ制限チェック
        if (!shelf.canAcceptItem(item)) {
          soundManager.playError();
          const targetShelfName = item.category === 'デイリー' ? '冷蔵棚(デイリー専用)' : '商品棚(非デイリー専用)';
          alert(`【陳列不可】『${item.name}』は${item.category}商品です。\n『${targetShelfName}』に陳列してください！`);
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
          alert('この棚は満杯です！');
        }
      } else {
        alert(`棚の現在の在庫: ${shelf.getTotalItemCount()} / ${shelf.capacity}`);
      }
      return;
    }

    // 4. 管理PCを開く
    if (hitObj.userData && hitObj.userData.isPC) {
      this.ui.openManagementPC();
      return;
    }
  }

  // 手に持っている箱を床に置く
  dropHoldingBox() {
    if (!this.holdingBox) return;

    this.store.spawnDeliveryBox(this.holdingBox.item, this.holdingBox.count);
    this.holdingBox = null;
    soundManager.playBox();
    this.ui.showPrompt('');
  }

  // 照準先のオブジェクトに対するHUDヒント更新
  updateCrosshairPrompt() {
    if (this.placementMode) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const interactables = [];
    if (this.store.register) interactables.push(this.store.register.mesh);
    this.store.shelves.forEach(s => interactables.push(s.mesh));
    this.store.deliveryBoxes.forEach(b => interactables.push(b.mesh));
    if (this.officeDeskGroup) interactables.push(this.officeDeskGroup);

    const intersects = this.raycaster.intersectObjects(interactables, true);
    if (intersects.length > 0 && intersects[0].distance <= 3.5) {
      let hit = intersects[0].object;
      while (hit.parent && !hit.userData.shelfInstance && !hit.userData.isRegister && hit.name !== 'delivery_box' && !hit.userData.isPC) {
        hit = hit.parent;
      }

      if (hit.userData && hit.userData.isRegister) {
        const queueLen = this.store.registerQueue.length;
        this.ui.showPrompt(`[E] レジに入る (待機客: ${queueLen}人)`);
      } else if (hit.name === 'delivery_box') {
        this.ui.showPrompt(`[E] 箱を持つ (${hit.userData.itemName} x${hit.userData.count})`);
      } else if (hit.userData && hit.userData.shelfInstance) {
        const shelf = hit.userData.shelfInstance;
        if (this.holdingBox) {
          this.ui.showPrompt(`[左クリック] ${this.holdingBox.item.name} を陳列する`);
        } else {
          this.ui.showPrompt(`[E] ${shelf.mesh.name === 'shelf_ambient' ? '商品棚(非デイリー)' : '冷蔵棚(デイリー)'} (在庫: ${shelf.getTotalItemCount()}/18)`);
        }
      } else if (hit.userData && hit.userData.isPC) {
        this.ui.showPrompt('[E または TAB] 管理・発注PCを開く');
      }
    } else {
      if (!this.holdingBox) {
        this.ui.showPrompt('');
      } else {
        this.ui.showPrompt('[左クリック] 棚に補充 / [右クリック] 箱を床に置く');
      }
    }
  }

  // ----------------------------------------------------
  // メインループ (アニメーション＆更新)
  // ----------------------------------------------------
  animate() {
    requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);

    // 1. プレイヤーのFPS移動更新 (WASD)
    this.updatePlayerMovement(delta);

    // 2. 店舗時間・在庫・売上更新
    this.store.update(delta);

    // 3. 客AIの更新
    this.customerManager.update(delta, this.store);

    // 4. 設置モードゴースト更新
    if (this.placementMode) {
      this.updatePlacementGhost();
    } else {
      this.updateCrosshairPrompt();
    }

    // 5. UI更新 (HUD)
    this.ui.update();

    // 6. レンダリング
    this.renderer.render(this.scene, this.camera);
  }

  // プレイヤー移動処理 (WASD)
  updatePlayerMovement(delta) {
    if (!this.isPointerLocked) return;

    const moveVector = new THREE.Vector3();

    if (this.keys['KeyW']) moveVector.z -= 1;
    if (this.keys['KeyS']) moveVector.z += 1;
    if (this.keys['KeyA']) moveVector.x -= 1;
    if (this.keys['KeyD']) moveVector.x += 1;

    if (moveVector.lengthSq() > 0) {
      moveVector.normalize();

      // カメラのヨー方向を取得
      const yaw = this.euler.y;
      const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
      const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));

      const displacement = new THREE.Vector3()
        .addScaledVector(forward, -moveVector.z)
        .addScaledVector(right, moveVector.x)
        .multiplyScalar(this.moveSpeed * delta);

      this.camera.position.add(displacement);

      // 店舗内壁の当たり判定 (外に出ないようにクランプ)
      this.camera.position.x = Math.max(-5.5, Math.min(5.5, this.camera.position.x));
      this.camera.position.z = Math.max(-6.5, Math.min(8.5, this.camera.position.z));
      this.camera.position.y = 1.65; // 一定の目線高さ
    }
  }
}

// ゲーム起動
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
