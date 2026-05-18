export type Section = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  content: string;
  updatedAt: string;
};

export const sections: Section[] = [
  {
    id: 'basics',
    title: 'ビーツの基礎知識｜植物としての特徴と代表品種',
    shortTitle: '基礎知識',
    description: 'ビーツ（テーブルビート）の学名・系統分類、歴史的背景、代表的な品種（デトロイト・ダークレッド、ゴルゴ、ゴールデンビーツなど）を解説します。',
    icon: 'sprout',
    content: '（コンテンツ準備中）',
    updatedAt: '2026-05-18',
  },
  {
    id: 'nutrition',
    title: 'ビーツの栄養と健康効果｜硝酸塩・ベタレイン・葉酸',
    shortTitle: '栄養と健康効果',
    description: '硝酸塩による血圧低下・運動パフォーマンス向上、ベタレインの抗酸化作用、葉酸・カリウム・鉄など、ビーツの主要栄養素と科学的根拠を解説します。',
    icon: 'activity',
    content: '（コンテンツ準備中）',
    updatedAt: '2026-05-18',
  },
  {
    id: 'cultivation',
    title: '日本国内のビーツ栽培｜主要産地と旬の時期',
    shortTitle: '栽培・産地・旬',
    description: '北海道・長野・熊本などビーツの主要産地、春まき・秋まきのサイクル、旬の時期、有機栽培の特性を解説します。',
    icon: 'map',
    content: '（コンテンツ準備中）',
    updatedAt: '2026-05-18',
  },
  {
    id: 'recipes',
    title: 'ビーツのレシピと下処理｜ボルシチ・サラダ・スムージー',
    shortTitle: '料理とレシピ',
    description: 'ビーツの代表料理（ボルシチ・サラダ・スムージー）と、茹で方・ロースト・電子レンジなど美味しく食べるための下処理のコツを解説します。',
    icon: 'utensils',
    content: '（コンテンツ準備中）',
    updatedAt: '2026-05-18',
  },
  {
    id: 'storage',
    title: 'ビーツの選び方と保存方法｜新鮮なものの見分け方',
    shortTitle: '選び方と保存',
    description: 'スーパーで新鮮で良質なビーツを選ぶ見分け方と、家庭での冷蔵・冷凍保存の正しいテクニックを解説します。',
    icon: 'package',
    content: '（コンテンツ準備中）',
    updatedAt: '2026-05-18',
  },
  {
    id: 'cautions',
    title: 'ビーツ摂取時の注意点と副作用｜尿の赤色化・シュウ酸',
    shortTitle: '注意点と副作用',
    description: 'ビーツ尿（尿や便の赤色化）、シュウ酸による尿路結石リスク、FODMAP、高カリウム血症など、安全に食べるための注意点を解説します。',
    icon: 'alert-triangle',
    content: '（コンテンツ準備中）',
    updatedAt: '2026-05-18',
  },
];
