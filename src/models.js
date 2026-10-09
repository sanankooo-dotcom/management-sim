// ==========================================
// 3Dモデル生成モジュール (Three.js プロシージャルモデリング)
// 低スペックPCでも高速に描画できる最適化ローポリモデル群
// ==========================================

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

// テクスチャキャッシュ
const textureCache = {};

// ラベルテクスチャ生成ヘルパー
export function createLabelTexture(text, bgColor = '#ffffff', textColor = '#111111', width = 256, height = 128) {
  const key = `${text}_${bgColor}_${textColor}_${width}_${height}`;
  if (textureCache[key]) return textureCache[key];

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 背景
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 枠線
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, width - 8, height - 8);

  // テキスト
  ctx.fillStyle = textColor;
  ctx.font = 'bold 36px "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache[key] = texture;
  return texture;
}

// 床のタイルテクスチャ生成
export function createFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f0f3f4';
  ctx.fillRect(0, 0, 512, 512);

  // グリッド線
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

// ----------------------------------------------------
// 商品3Dモデル生成
// ----------------------------------------------------
export function createProductMesh(item) {
  const group = new THREE.Group();
  group.userData = { itemId: item.id };

  const { modelType, color, label } = item;

  switch (modelType) {
    case 'onigiri': {
      // おにぎり: 三角柱 + 黒い海苔
      const shape = new THREE.Shape();
      shape.moveTo(0, 0.12);
      shape.lineTo(-0.11, -0.09);
      shape.lineTo(0.11, -0.09);
      shape.closePath();

      const extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0.015, bevelThickness: 0.015 };
      const riceGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const riceMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const rice = new THREE.Mesh(riceGeo, riceMat);
      rice.position.z = -0.04;
      group.add(rice);

      // 海苔
      const noriGeo = new THREE.BoxGeometry(0.13, 0.14, 0.115);
      const noriMat = new THREE.MeshLambertMaterial({ color: 0x1b1b1b });
      const nori = new THREE.Mesh(noriGeo, noriMat);
      nori.position.y = -0.03;
      group.add(nori);

      // 具材ラベルシール
      const stickerGeo = new THREE.PlaneGeometry(0.08, 0.04);
      const stickerMat = new THREE.MeshBasicMaterial({ map: createLabelTexture(label, color, '#ffffff', 128, 64) });
      const sticker = new THREE.Mesh(stickerGeo, stickerMat);
      sticker.position.set(0, 0.01, 0.065);
      group.add(sticker);
      break;
    }

    case 'bento': {
      // 弁当: 黒い容器 + 透明フタ + 中身
      const baseGeo = new THREE.BoxGeometry(0.36, 0.06, 0.26);
      const baseMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
      const base = new THREE.Mesh(baseGeo, baseMat);
      group.add(base);

      // ご飯エリア
      const riceGeo = new THREE.BoxGeometry(0.16, 0.03, 0.22);
      const riceMat = new THREE.MeshLambertMaterial({ color: 0xfcfcfc });
      const rice = new THREE.Mesh(riceGeo, riceMat);
      rice.position.set(-0.08, 0.035, 0);
      group.add(rice);

      // 梅干し
      const umeGeo = new THREE.SphereGeometry(0.018, 6, 6);
      const umeMat = new THREE.MeshLambertMaterial({ color: 0xc0392b });
      const ume = new THREE.Mesh(umeGeo, umeMat);
      ume.position.set(-0.08, 0.052, 0);
      group.add(ume);

      // おかずエリア (色や形状で区別)
      const sideGeo = new THREE.BoxGeometry(0.14, 0.04, 0.22);
      const sideMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(color) });
      const side = new THREE.Mesh(sideGeo, sideMat);
      side.position.set(0.08, 0.04, 0);
      group.add(side);

      // ラベル
      const labelGeo = new THREE.PlaneGeometry(0.18, 0.06);
      const labelMat = new THREE.MeshBasicMaterial({ map: createLabelTexture(label, '#ffffff', '#222222', 128, 48) });
      const labelMesh = new THREE.Mesh(labelGeo, labelMat);
      labelMesh.rotation.x = -Math.PI / 2;
      labelMesh.position.set(0, 0.062, 0);
      group.add(labelMesh);
      break;
    }

    case 'sandwich': {
      // サンドイッチ: 直角二等辺三角柱
      const shape = new THREE.Shape();
      shape.moveTo(-0.1, -0.1);
      shape.lineTo(0.1, -0.1);
      shape.lineTo(-0.1, 0.1);
      shape.closePath();

      const extrudeSettings = { depth: 0.12, bevelEnabled: true, bevelSegments: 1, bevelSize: 0.01, bevelThickness: 0.01 };
      const sandwichGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const sandwichMat = new THREE.MeshLambertMaterial({ color: 0xfdfefe });
      const sandwich = new THREE.Mesh(sandwichGeo, sandwichMat);
      sandwich.position.z = -0.06;
      group.add(sandwich);

      // 具材 (斜面に沿ったストライプ)
      const fillGeo = new THREE.PlaneGeometry(0.15, 0.11);
      const fillMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(color) });
      const fill = new THREE.Mesh(fillGeo, fillMat);
      fill.rotation.set(0, -Math.PI / 4, 0);
      fill.position.set(0.02, 0, 0);
      group.add(fill);
      break;
    }

    case 'hotdog': {
      // ホットドッグ: コッペパン風にソーセージ
      const bunGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.28, 8);
      bunGeo.rotateZ(Math.PI / 2);
      const bunMat = new THREE.MeshLambertMaterial({ color: 0xdeb887 });
      const bun = new THREE.Mesh(bunGeo, bunMat);
      group.add(bun);

      // ソーセージ
      const sausGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.30, 8);
      sausGeo.rotateZ(Math.PI / 2);
      const sausMat = new THREE.MeshLambertMaterial({ color: 0x922b21 });
      const saus = new THREE.Mesh(sausGeo, sausMat);
      saus.position.y = 0.02;
      group.add(saus);

      // マスタード
      const mustGeo = new THREE.BoxGeometry(0.24, 0.01, 0.015);
      const mustMat = new THREE.MeshLambertMaterial({ color: 0xf4d03f });
      const must = new THREE.Mesh(mustGeo, mustMat);
      must.position.y = 0.04;
      group.add(must);
      break;
    }

    case 'anpan': {
      // アンパン: まん丸の黄金色パン + ごま
      const panGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.06, 12);
      const panMat = new THREE.MeshLambertMaterial({ color: 0xd35400 });
      const pan = new THREE.Mesh(panGeo, panMat);
      group.add(pan);

      // ごま
      const sesGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.005, 8);
      const sesMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
      const ses = new THREE.Mesh(sesGeo, sesMat);
      ses.position.y = 0.032;
      group.add(ses);
      break;
    }

    case 'koppepan': {
      // コッペパン: 楕円柱
      const panGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.26, 8);
      panGeo.rotateZ(Math.PI / 2);
      const panMat = new THREE.MeshLambertMaterial({ color: 0xedbb99 });
      const pan = new THREE.Mesh(panGeo, panMat);
      group.add(pan);

      // スリットとクリーム
      const creamGeo = new THREE.BoxGeometry(0.22, 0.015, 0.03);
      const creamMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(color) });
      const cream = new THREE.Mesh(creamGeo, creamMat);
      cream.position.y = 0.04;
      group.add(cream);
      break;
    }

    case 'chipbag': {
      // ポテチ袋/スナック袋
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
      // 板チョコ
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
      // クッキー箱
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
      // ペットボトル/缶 (ドリンク)
      const bodyGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.22, 10);
      const bodyMat = new THREE.MeshLambertMaterial({
        color: new THREE.Color(color),
        map: createLabelTexture(label, color, '#ffffff', 128, 64)
      });
      const bottle = new THREE.Mesh(bodyGeo, bodyMat);
      group.add(bottle);

      // キャップ
      const capGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.03, 8);
      const capMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 0.125;
      group.add(cap);
      break;
    }
  }

  // 影の設定
  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return group;
}

// ----------------------------------------------------
// 備品モデル生成 (商品棚・冷蔵棚・レジカウンター)
// ----------------------------------------------------

// 1. 商品棚(非デイリー専用) - 常温棚 3段
export function createAmbientShelfModel() {
  const group = new THREE.Group();
  group.name = 'shelf_ambient';

  const frameMat = new THREE.MeshLambertMaterial({ color: 0xecf0f1 });
  const shelfPlateMat = new THREE.MeshLambertMaterial({ color: 0xbdc3c7 });

  // 支柱フレーム (両サイド)
  const postGeo = new THREE.BoxGeometry(0.06, 1.8, 0.7);
  const leftPost = new THREE.Mesh(postGeo, frameMat);
  leftPost.position.set(-0.85, 0.9, 0);
  const rightPost = new THREE.Mesh(postGeo, frameMat);
  rightPost.position.set(0.85, 0.9, 0);
  group.add(leftPost, rightPost);

  // 背板
  const backGeo = new THREE.BoxGeometry(1.7, 1.8, 0.04);
  const back = new THREE.Mesh(backGeo, frameMat);
  back.position.set(0, 0.9, -0.33);
  group.add(back);

  // 棚板 3段 (y: 0.35, 0.85, 1.35)
  const shelfYLevels = [0.35, 0.85, 1.35];
  const shelfGeo = new THREE.BoxGeometry(1.66, 0.05, 0.65);

  shelfYLevels.forEach((y, idx) => {
    const shelf = new THREE.Mesh(shelfGeo, shelfPlateMat);
    shelf.position.set(0, y, 0);
    group.add(shelf);

    // 値札レール (前縁)
    const railGeo = new THREE.BoxGeometry(1.66, 0.04, 0.02);
    const railMat = new THREE.MeshLambertMaterial({ color: 0x34495e });
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.set(0, y, 0.33);
    group.add(rail);
  });

  // 棚上部看板
  const signGeo = new THREE.BoxGeometry(1.7, 0.22, 0.08);
  const signMat = new THREE.MeshBasicMaterial({
    map: createLabelTexture('常温商品・スナック・ドリンク', '#2c3e50', '#ffffff', 512, 64)
  });
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(0, 1.9, 0);
  group.add(sign);

  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return group;
}

// 2. 冷蔵棚(デイリー専用) - 青色LED冷気付きショーケース
export function createChilledShelfModel() {
  const group = new THREE.Group();
  group.name = 'shelf_chilled';

  const bodyMat = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
  const innerMat = new THREE.MeshLambertMaterial({ color: 0xebf5fb });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x85c1e9,
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
    metalness: 0.2
  });

  // 本体外枠
  const baseGeo = new THREE.BoxGeometry(1.8, 0.3, 0.8);
  const base = new THREE.Mesh(baseGeo, bodyMat);
  base.position.set(0, 0.15, 0);
  group.add(base);

  // 背板
  const backGeo = new THREE.BoxGeometry(1.8, 1.7, 0.08);
  const back = new THREE.Mesh(backGeo, bodyMat);
  back.position.set(0, 1.15, -0.36);
  group.add(back);

  // 左右側板 (ガラス窓付き)
  const sideGeo = new THREE.BoxGeometry(0.08, 1.7, 0.76);
  const leftSide = new THREE.Mesh(sideGeo, bodyMat);
  leftSide.position.set(-0.86, 1.15, 0.02);
  const rightSide = new THREE.Mesh(sideGeo, bodyMat);
  rightSide.position.set(0.86, 1.15, 0.02);
  group.add(leftSide, rightSide);

  // 天板
  const topGeo = new THREE.BoxGeometry(1.8, 0.15, 0.8);
  const top = new THREE.Mesh(topGeo, bodyMat);
  top.position.set(0, 2.05, 0);
  group.add(top);

  // 棚板 3段 (y: 0.55, 1.05, 1.55)
  const shelfYLevels = [0.55, 1.05, 1.55];
  const shelfGeo = new THREE.BoxGeometry(1.64, 0.04, 0.68);
  const shelfMat = new THREE.MeshLambertMaterial({ color: 0xd6eaf8 });

  shelfYLevels.forEach(y => {
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(0, y, 0.04);
    group.add(shelf);
  });

  // 冷蔵ショーケースのネオン看板
  const signGeo = new THREE.BoxGeometry(1.7, 0.2, 0.08);
  const signMat = new THREE.MeshBasicMaterial({
    map: createLabelTexture('❄️ 要冷蔵 デイリー(米飯・パン) ❄️', '#1b4f72', '#5dade2', 512, 64)
  });
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(0, 2.15, 0);
  group.add(sign);

  // 冷気エフェクト用の青色ポイントライト
  const coldLight = new THREE.PointLight(0x5dade2, 0.6, 2.5);
  coldLight.position.set(0, 1.6, 0.2);
  group.add(coldLight);

  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return group;
}

// 3. レジカウンターモデル
export function createRegisterModel() {
  const group = new THREE.Group();
  group.name = 'fixture_register';

  // カウンター本体デスク
  const deskMat = new THREE.MeshLambertMaterial({ color: 0x34495e });
  const topMat = new THREE.MeshLambertMaterial({ color: 0xecf0f1 });

  const deskGeo = new THREE.BoxGeometry(1.8, 0.85, 0.9);
  const desk = new THREE.Mesh(deskGeo, deskMat);
  desk.position.set(0, 0.425, 0);
  group.add(desk);

  // カウンター天板
  const topGeo = new THREE.BoxGeometry(1.86, 0.05, 0.96);
  const top = new THREE.Mesh(topGeo, topMat);
  top.position.set(0, 0.875, 0);
  group.add(top);

  // POSレジ本体 (画面＆キーボード)
  const posBaseGeo = new THREE.BoxGeometry(0.35, 0.12, 0.35);
  const posBaseMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const posBase = new THREE.Mesh(posBaseGeo, posBaseMat);
  posBase.position.set(0.35, 0.96, 0);
  group.add(posBase);

  // POSモニター
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

  // バーコードスキャナ
  const scanBaseGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.15, 8);
  const scanGunGeo = new THREE.BoxGeometry(0.06, 0.14, 0.08);
  const scanGunMat = new THREE.MeshLambertMaterial({ color: 0x2ecc71 });
  const scanGun = new THREE.Mesh(scanGunGeo, scanGunMat);
  scanGun.position.set(0.05, 0.97, 0.2);
  scanGun.rotation.z = Math.PI / 6;
  group.add(scanGun);

  // カゴ置きスペースマーカー
  const basketZoneGeo = new THREE.PlaneGeometry(0.45, 0.4);
  const basketZoneMat = new THREE.MeshBasicMaterial({
    map: createLabelTexture('かご置き場', '#f1c40f', '#222222', 256, 128)
  });
  const basketZone = new THREE.Mesh(basketZoneGeo, basketZoneMat);
  basketZone.rotation.x = -Math.PI / 2;
  basketZone.position.set(-0.45, 0.902, 0);
  group.add(basketZone);

  // レジの看板ポール
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

  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return group;
}

// 4. 配達ダンボール箱
export function createDeliveryBoxMesh(item, count) {
  const group = new THREE.Group();
  group.name = 'delivery_box';
  group.userData = {
    itemId: item.id,
    count: count,
    itemName: item.name
  };

  const boxGeo = new THREE.BoxGeometry(0.5, 0.38, 0.4);
  const boxMat = new THREE.MeshLambertMaterial({
    color: 0xc89d6c,
    map: createLabelTexture(`${item.name}\nx${count}`, '#c89d6c', '#3e2723', 256, 128)
  });
  const box = new THREE.Mesh(boxGeo, boxMat);
  box.position.y = 0.19;
  group.add(box);

  // テープ
  const tapeGeo = new THREE.BoxGeometry(0.51, 0.06, 0.08);
  const tapeMat = new THREE.MeshLambertMaterial({ color: 0x935116 });
  const tape = new THREE.Mesh(tapeGeo, tapeMat);
  tape.position.y = 0.385;
  group.add(tape);

  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return group;
}

// ----------------------------------------------------
// キャラクター3Dモデル (客 & 従業員)
// ----------------------------------------------------
export function createHumanoidModel(options = {}) {
  const {
    isEmployee = false,
    outfitColor = 0x3498db,
    skinColor = 0xffe0bd,
    hairColor = 0x2c3e50,
    hasBasket = false,
    badgeText = ''
  } = options;

  const group = new THREE.Group();

  // 頭部
  const headGeo = new THREE.BoxGeometry(0.26, 0.28, 0.26);
  const skinMat = new THREE.MeshLambertMaterial({ color: skinColor });
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 1.55;
  group.add(head);

  // 髪の毛 / 帽子
  const hairGeo = new THREE.BoxGeometry(0.28, 0.12, 0.28);
  const hairMat = new THREE.MeshLambertMaterial({ color: hairColor });
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.set(0, 1.7, 0);
  group.add(hair);

  // 胴体
  const bodyGeo = new THREE.BoxGeometry(0.38, 0.55, 0.26);
  let bodyMat;
  if (isEmployee) {
    // 店員制服 (エプロン風グリーンまたはブルー)
    bodyMat = new THREE.MeshLambertMaterial({ color: 0x27ae60 });
  } else {
    bodyMat = new THREE.MeshLambertMaterial({ color: outfitColor });
  }
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 1.12;
  group.add(body);

  // 従業員名札
  if (isEmployee) {
    const badgeGeo = new THREE.PlaneGeometry(0.12, 0.06);
    const badgeMat = new THREE.MeshBasicMaterial({
      map: createLabelTexture('STAFF', '#ffffff', '#222222', 128, 64)
    });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.set(0.1, 1.25, 0.135);
    group.add(badge);
  }

  // 脚 (左・右)
  const legGeo = new THREE.BoxGeometry(0.14, 0.75, 0.18);
  const pantsMat = new THREE.MeshLambertMaterial({ color: isEmployee ? 0x2c3e50 : 0x34495e });

  const leftLeg = new THREE.Mesh(legGeo, pantsMat);
  leftLeg.position.set(-0.11, 0.38, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, pantsMat);
  rightLeg.position.set(0.11, 0.38, 0);
  group.add(rightLeg);

  // 腕 (左・右)
  const armGeo = new THREE.BoxGeometry(0.11, 0.55, 0.14);
  const armMat = new THREE.MeshLambertMaterial({ color: isEmployee ? 0x27ae60 : outfitColor });

  const leftArm = new THREE.Mesh(armGeo, armMat);
  leftArm.position.set(-0.25, 1.1, 0);
  group.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, armMat);
  rightArm.position.set(0.25, 1.1, 0);
  group.add(rightArm);

  // 買い物カゴ (顧客用)
  let basket = null;
  if (hasBasket) {
    const basketGeo = new THREE.BoxGeometry(0.28, 0.18, 0.22);
    const basketMat = new THREE.MeshLambertMaterial({ color: 0xe74c3c });
    basket = new THREE.Mesh(basketGeo, basketMat);
    basket.position.set(0.3, 0.85, 0.15);
    group.add(basket);
  }

  // 頭上の属性タグ看板 (3Dスプライト)
  if (badgeText) {
    const tagCanvas = document.createElement('canvas');
    tagCanvas.width = 300;
    tagCanvas.height = 70;
    const tagCtx = tagCanvas.getContext('2d');
    tagCtx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    tagCtx.roundRect ? tagCtx.roundRect(0, 0, 300, 70, 12) : tagCtx.fillRect(0, 0, 300, 70);
    tagCtx.fill();
    tagCtx.strokeStyle = isEmployee ? '#2ecc71' : '#f39c12';
    tagCtx.lineWidth = 4;
    tagCtx.stroke();

    tagCtx.fillStyle = '#ffffff';
    tagCtx.font = 'bold 26px "Hiragino Kaku Gothic ProN", Meiryo, sans-serif';
    tagCtx.textAlign = 'center';
    tagCtx.textBaseline = 'middle';
    tagCtx.fillText(badgeText, 150, 35);

    const tagTexture = new THREE.CanvasTexture(tagCanvas);
    const spriteMat = new THREE.SpriteMaterial({ map: tagTexture, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.2, 0.3, 1);
    sprite.position.set(0, 1.95, 0);
    group.add(sprite);
    group.userData.tagSprite = sprite;
  }

  // アニメーション用参照
  group.userData.leftLeg = leftLeg;
  group.userData.rightLeg = rightLeg;
  group.userData.leftArm = leftArm;
  group.userData.rightArm = rightArm;
  group.userData.basket = basket;
  group.userData.animTime = Math.random() * 10;

  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return group;
}
