// 記事本文に {{figure:KEY}} で差し込む自作SVG模式図のSSOT。
// React版（App.tsx）と prerender が同じHTML文字列を共用する（references.ts と同じ方式）。
// 写真は使わず、著作権フリーな自作の模式図で「テキストだけでは伝わらない要素」を補う方針。

export type Figure = { title: string; caption: string; svg: string };

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const figures: Record<string, Figure> = {
  // 品種別の断面の模式図（デトロイト=濃赤ほぼ均一 / ゴルゴ=赤白の渦巻き / ゴールデン=黄・年輪）
  'variety-cross-sections': {
    title: 'ビーツの品種別の断面の模式図',
    caption:
      'ビーツは品種によって断面の模様が大きく異なります。デトロイト系は濃い赤でほぼ均一、ゴルゴ（キオッジャ）は赤と白の渦巻き、ゴールデンは黄色で年輪状です。ゴルゴの渦巻きは加熱すると薄れるため、模様を活かすなら生のうす切りがおすすめです。（写真ではなく模式図です）',
    svg: `<svg viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:560px;height:auto;display:block;margin:0 auto">
  <g>
    <circle cx="110" cy="100" r="78" fill="#5e0f26"/>
    <circle cx="110" cy="100" r="71" fill="#8B1538"/>
    <circle cx="110" cy="100" r="54" fill="none" stroke="#6d1230" stroke-width="2" opacity="0.5"/>
    <circle cx="110" cy="100" r="36" fill="none" stroke="#6d1230" stroke-width="2" opacity="0.5"/>
    <circle cx="110" cy="100" r="18" fill="none" stroke="#6d1230" stroke-width="2" opacity="0.5"/>
    <circle cx="110" cy="100" r="78" fill="none" stroke="#00000022" stroke-width="1"/>
    <text x="110" y="205" text-anchor="middle" font-size="15" font-weight="700" fill="#333">デトロイト</text>
    <text x="110" y="225" text-anchor="middle" font-size="12" fill="#555">濃い赤・ほぼ均一</text>
  </g>
  <g>
    <circle cx="300" cy="100" r="78" fill="#a3284a"/>
    <circle cx="300" cy="100" r="70" fill="#c33a5e"/>
    <circle cx="300" cy="100" r="58" fill="#fce8ee"/>
    <circle cx="300" cy="100" r="46" fill="#c33a5e"/>
    <circle cx="300" cy="100" r="34" fill="#fce8ee"/>
    <circle cx="300" cy="100" r="22" fill="#c33a5e"/>
    <circle cx="300" cy="100" r="10" fill="#fce8ee"/>
    <circle cx="300" cy="100" r="78" fill="none" stroke="#00000022" stroke-width="1"/>
    <text x="300" y="205" text-anchor="middle" font-size="15" font-weight="700" fill="#333">ゴルゴ</text>
    <text x="300" y="225" text-anchor="middle" font-size="12" fill="#555">赤白の渦巻き</text>
  </g>
  <g>
    <circle cx="490" cy="100" r="78" fill="#cf7a1f"/>
    <circle cx="490" cy="100" r="70" fill="#f1c44d"/>
    <circle cx="490" cy="100" r="54" fill="none" stroke="#d9a93b" stroke-width="2" opacity="0.6"/>
    <circle cx="490" cy="100" r="36" fill="none" stroke="#d9a93b" stroke-width="2" opacity="0.6"/>
    <circle cx="490" cy="100" r="18" fill="none" stroke="#d9a93b" stroke-width="2" opacity="0.6"/>
    <circle cx="490" cy="100" r="78" fill="none" stroke="#00000022" stroke-width="1"/>
    <text x="490" y="205" text-anchor="middle" font-size="15" font-weight="700" fill="#333">ゴールデン</text>
    <text x="490" y="225" text-anchor="middle" font-size="12" fill="#555">黄色・年輪</text>
  </g>
</svg>`,
  },
  // 硝酸塩→一酸化窒素(NO)→血管拡張 の流れ図（nutrition の中心的な機序）
  'nitrate-no-flow': {
    title: 'ビーツの硝酸塩が一酸化窒素になり血管を広げるまでの流れ図',
    caption:
      'ビーツに多い硝酸塩は、口の中の細菌や体内のはたらきで一酸化窒素（NO）に変わります。NOには血管をゆるめて広げる作用があり、血圧の低下などが報告されています。（写真ではなく模式図です）',
    svg: `<svg viewBox="0 0 440 360" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:420px;height:auto;display:block;margin:0 auto">
  <rect x="20" y="8" width="400" height="64" rx="10" fill="#fbeef2" stroke="#d59bac" stroke-width="1.5"/>
  <text x="220" y="46" text-anchor="middle" font-size="16" font-weight="700" fill="#5e0f26">ビーツの硝酸塩（NO₃⁻）</text>
  <path d="M220 74 L220 90" stroke="#a01744" stroke-width="2"/>
  <path d="M220 96 l-6 -9 h12 z" fill="#a01744"/>
  <rect x="20" y="98" width="400" height="64" rx="10" fill="#fbeef2" stroke="#d59bac" stroke-width="1.5"/>
  <text x="220" y="136" text-anchor="middle" font-size="15" font-weight="600" fill="#5e0f26">口の中の細菌が亜硝酸塩（NO₂⁻）に変える</text>
  <path d="M220 164 L220 180" stroke="#a01744" stroke-width="2"/>
  <path d="M220 186 l-6 -9 h12 z" fill="#a01744"/>
  <rect x="20" y="188" width="400" height="64" rx="10" fill="#fbeef2" stroke="#d59bac" stroke-width="1.5"/>
  <text x="220" y="226" text-anchor="middle" font-size="16" font-weight="700" fill="#5e0f26">体内で一酸化窒素（NO）になる</text>
  <path d="M220 254 L220 270" stroke="#a01744" stroke-width="2"/>
  <path d="M220 276 l-6 -9 h12 z" fill="#a01744"/>
  <rect x="20" y="278" width="400" height="70" rx="10" fill="#8B1538"/>
  <text x="220" y="310" text-anchor="middle" font-size="16" font-weight="700" fill="#ffffff">血管が広がる</text>
  <text x="220" y="332" text-anchor="middle" font-size="14" fill="#ffd9e3">血圧の低下・血流のサポート</text>
</svg>`,
  },
  // 保存方法ごとの日持ちの目安（storage の検証済み数値をバーで可視化）
  'storage-duration': {
    title: 'ビーツの保存方法ごとの日持ちの目安の棒グラフ',
    caption:
      'ビーツの保存方法ごとの日持ちのおおよその目安です（保存状態により前後します）。冷凍がもっとも長く約3か月、生のままの冷蔵は2〜3週間、加熱後は約1週間が目安です。（模式図）',
    svg: `<svg viewBox="0 0 600 215" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:560px;height:auto;display:block;margin:0 auto">
  <line x1="150" y1="8" x2="150" y2="195" stroke="#e7d6da" stroke-width="1"/>
  <text x="8" y="38" font-size="14" font-weight="600" fill="#333">加熱後・冷蔵</text>
  <rect x="150" y="20" width="28" height="30" rx="3" fill="#c98aa0"/>
  <text x="186" y="40" font-size="13" fill="#555">約1週間</text>
  <text x="8" y="86" font-size="14" font-weight="600" fill="#333">生・冷蔵</text>
  <rect x="150" y="68" width="69" height="30" rx="3" fill="#b25c79"/>
  <text x="227" y="88" font-size="13" fill="#555">2〜3週間</text>
  <text x="8" y="134" font-size="14" font-weight="600" fill="#333">ピクルス</text>
  <rect x="150" y="116" width="118" height="30" rx="3" fill="#9c3358"/>
  <text x="276" y="136" font-size="13" fill="#555">1ヶ月以上</text>
  <text x="8" y="182" font-size="14" font-weight="600" fill="#333">冷凍</text>
  <rect x="150" y="164" width="330" height="30" rx="3" fill="#8B1538"/>
  <text x="488" y="184" font-size="13" fill="#555">約3ヶ月</text>
</svg>`,
  },
};

export function figureHtml(key: string): string | null {
  const f = figures[key];
  if (!f) return null;
  return (
    `<figure class="content-figure">` +
    `<div class="figure-svg" role="img" aria-label="${esc(f.title)}">${f.svg}</div>` +
    `<figcaption class="figure-caption">${esc(f.caption)}</figcaption>` +
    `</figure>`
  );
}

export function figureKeys(): string[] {
  return Object.keys(figures);
}
