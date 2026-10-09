// ==========================================
// カテゴリマスター ＆ アイテム定義
// ==========================================

export const CATEGORIES = {
  DAILY: 'デイリー',
  NON_DAILY: '非デイリー',
  EQUIPMENT: '備品'
};

export const SUBCATEGORIES = {
  RICE: '米飯',
  BREAD: 'パン',
  SNACK: 'お菓子',
  DRINK: 'ドリンク',
  SHELF: '棚',
  REGISTER: 'レジ'
};

// 商品マスターデータ
export const ITEM_CATALOG = [
  // ---------------- デイリー：米飯 ----------------
  {
    id: 'rice_tsunamayo',
    name: 'おにぎり(ツナマヨ)',
    category: CATEGORIES.DAILY,
    subCategory: SUBCATEGORIES.RICE,
    cost: 80,
    price: 140,
    shelfType: 'chilled', // 冷蔵棚(デイリー専用)
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
    description: '香ばしく焼き上げた紅鮭をたっぷり包んだおにぎり'
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
    description: '大きな銀鮭の塩焼きが入った定番の人気弁当'
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
    description: '白身魚フライとちくわ天がのったボリューム満点のり弁当'
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
    description: 'ふんわりパンに上品な粒あんとマーガリンをサンド'
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
    description: '粒入りピーナッツクリームの香ばしさがたまらないコッペパン'
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
    description: 'コクのある特製たまごサラダを贅沢に挟んだサンドイッチ'
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
    description: 'シャキシャキのレタスとポークハムの新鮮サンドイッチ'
  },

  // ---------------- 非デイリー：お菓子 ----------------
  {
    id: 'snack_chips_salt',
    name: 'ポテトチップス(うすしお)',
    category: CATEGORIES.NON_DAILY,
    subCategory: SUBCATEGORIES.SNACK,
    cost: 85,
    price: 150,
    shelfType: 'ambient', // 商品棚(非デイリー専用)
    modelType: 'chipbag',
    color: '#f39c12',
    label: 'うすしお',
    description: '国産じゃがいもの風味を引き立てるまろやかな塩味ポテチ'
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
    description: 'お肉と香味野菜の旨味を凝縮した濃厚コンソメパンチ'
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
    description: '香ばしいえびの風味とサクサク食感、やめられない止まらない'
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
    description: 'カカオの芳醇なアロマが広がるミルク板チョコレート'
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
    description: '国産さつまいもをカリッと揚げて糖蜜を絡めた昔ながらの銘菓'
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
    description: '大自然に育まれた清冽なミネラルウォーター'
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
    description: '爽快な刺激とコクがクセになる強炭酸コーラ'
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
    description: '一番茶の旨味と爽やかな渋みが調和した本格緑茶'
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
    description: '焙煎大麦の香ばしさとミネラル豊富なすっきり麦茶'
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
    description: 'ディンブラ茶葉の華やかな香りとスッキリとした後味'
  }
];

// 備品マスターデータ (棚 ＆ レジ)
export const FIXTURE_CATALOG = [
  {
    id: 'shelf_ambient',
    name: '商品棚(非デイリー専用)',
    category: CATEGORIES.EQUIPMENT,
    subCategory: SUBCATEGORIES.SHELF,
    cost: 8000,
    price: 8000,
    shelfType: 'ambient',
    capacity: 18, // 3段 × 6個
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
    capacity: 18, // 3段 × 6個
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

// 商品IDから情報取得
export function getItemById(id) {
  return ITEM_CATALOG.find(item => item.id === id) || FIXTURE_CATALOG.find(item => item.id === id);
}
