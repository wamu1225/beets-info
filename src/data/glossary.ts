export type GlossaryTerm = {
  term: string;
  reading?: string;
  description: string;
  relatedSectionId?: string;
};

export const glossary: GlossaryTerm[] = [
  {
    term: 'ベタレイン',
    reading: 'ベタレイン',
    description:
      'ビーツの鮮やかな赤紫色を作っている水溶性の天然色素。ベタシアニン（赤色系）とベタキサンチン（黄色系）の総称。サボテン科の植物にも含まれる、植物界では珍しい色素グループ。強力な抗酸化作用が報告されている。',
    relatedSectionId: 'nutrition',
  },
  {
    term: 'ベタシアニン',
    description:
      'ベタレインのうち赤紫色を担う色素。水溶性で熱・アルカリ・金属イオンに弱く、加熱や切断により流出しやすい。皮付き加熱が推奨される理由のひとつ。',
    relatedSectionId: 'recipes',
  },
  {
    term: 'ベタイン',
    description:
      'ビーツに豊富に含まれる含窒素化合物。肝臓での脂質蓄積を抑える、ホモシステインを低減するなどの作用が報告されている。化粧品では保湿成分としても利用される。',
    relatedSectionId: 'nutrition',
  },
  {
    term: '硝酸塩',
    reading: 'しょうさんえん',
    description:
      'ビーツに豊富に含まれる無機イオン（NO₃⁻）。経口摂取後、口腔内細菌や胃酸の働きで一酸化窒素（NO）に変換され、血管拡張・血圧低下・運動パフォーマンス向上などの作用をもたらす。',
    relatedSectionId: 'nutrition',
  },
  {
    term: '一酸化窒素（NO）',
    reading: 'いっさんかちっそ',
    description:
      '血管平滑筋に作用し血管を拡張させる生理活性物質。ビーツの硝酸塩から体内で生成される。血流改善・血圧低下・運動効率向上に関与する。',
    relatedSectionId: 'nutrition',
  },
  {
    term: 'シュウ酸',
    reading: 'しゅうさん',
    description:
      'ビーツやホウレンソウに含まれるカルボン酸の一種。尿中でカルシウムと結合して結晶（シュウ酸カルシウム）となり、尿路結石の原因になることがある。茹でこぼし・乳製品との同時摂取で吸収を抑えられる。',
    relatedSectionId: 'cautions',
  },
  {
    term: 'ビーツ尿',
    reading: 'ビーツにょう',
    description:
      'ビーツ摂取後に尿がピンク〜赤褐色に変色する生理的現象（医学用語：Beeturia）。ベタシアニンが分解されずに尿中へ排出されるために起こる。完全に無害で、1〜2日で元に戻る。',
    relatedSectionId: 'cautions',
  },
  {
    term: 'FODMAP',
    reading: 'フォドマップ',
    description:
      '小腸で吸収されにくく大腸で発酵を起こす糖質群の総称（Fermentable Oligo-, Di-, Mono-saccharides And Polyols）。過敏性腸症候群（IBS）患者では症状の原因になりうる。ビーツに含まれるフルクタンも該当する。',
    relatedSectionId: 'cautions',
  },
  {
    term: 'フルクタン',
    description:
      '果糖（フルクトース）が連なった多糖類。ヒトの小腸では消化できず大腸で発酵してガスを発生させる。FODMAPの一種で、IBSの方は注意が必要。',
    relatedSectionId: 'cautions',
  },
  {
    term: '高カリウム血症',
    reading: 'こうカリウムけっしょう',
    description:
      '血中カリウム濃度が異常に高くなる状態。腎機能低下時に発症リスクが高い。重症化すると不整脈や心停止につながる危険な状態。ビーツは100g中380〜460mgと高カリウムなため、腎臓病の方は摂取を控える。',
    relatedSectionId: 'cautions',
  },
  {
    term: 'テーブルビート',
    description:
      '食用ビーツの正式名称のひとつ。観賞用や砂糖原料用と区別するため、英語圏では「table beet」と呼ぶ。本サイトの「ビーツ」はテーブルビート（Beta vulgaris Garden Beet Group）を指す。',
    relatedSectionId: 'basics',
  },
  {
    term: 'テンサイ',
    reading: 'てんさい',
    description:
      'ビーツと同じ Beta vulgaris に属するが、根に砂糖（ショ糖）を蓄積するよう改良された品種群。日本では北海道で大規模栽培され、てん菜糖の原料となる。',
    relatedSectionId: 'basics',
  },
  {
    term: 'スイスチャード',
    description:
      'ビーツと同じ Beta vulgaris に属する葉菜用品種。葉と肉厚の葉柄を食用にする。カラフルな葉柄が彩り野菜として人気。和名は「フダンソウ」。',
    relatedSectionId: 'basics',
  },
  {
    term: '火焔菜',
    reading: 'かえんさい',
    description:
      'ビーツの和名。江戸時代に日本に伝わったとき、燃え盛る炎のような赤色から名付けられた。当初は観賞用として愛でられていた。',
    relatedSectionId: 'basics',
  },
  {
    term: 'ジオスミン',
    description:
      'ビーツの土特有の香りを生み出す有機化合物。土壌中の放線菌などが生成し、ビーツの根に蓄積する。雨上がりの土の匂いの正体でもある。',
    relatedSectionId: 'basics',
  },
  {
    term: 'エルゴジェニックエイド',
    description:
      '運動パフォーマンスを向上させる目的で使用される物質や手段の総称。ビーツの硝酸塩は天然のエルゴジェニックエイドとして、持久系競技者に活用されている。',
    relatedSectionId: 'nutrition',
  },
];
