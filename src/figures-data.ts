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
