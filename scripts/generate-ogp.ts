import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef5ec"/>
      <stop offset="100%" stop-color="#fceede"/>
    </linearGradient>
    <radialGradient id="beet" cx="50%" cy="55%" r="50%">
      <stop offset="0%" stop-color="#B82149"/>
      <stop offset="60%" stop-color="#8B1538"/>
      <stop offset="100%" stop-color="#5C0F28"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="12" height="630" fill="#8B1538"/>

  <g transform="translate(820, 200)">
    <path d="M120 80 Q70 70 50 30 Q40 0 70 0 Q110 10 120 50 Q130 10 170 0 Q200 0 190 30 Q170 70 120 80 Z" fill="#4A6741"/>
    <ellipse cx="120" cy="220" rx="130" ry="150" fill="url(#beet)"/>
  </g>

  <text x="80" y="200" font-family="'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',Meiryo,sans-serif" font-size="76" font-weight="700" fill="#8B1538">ビーツの基本ガイド</text>
  <text x="80" y="280" font-family="'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',Meiryo,sans-serif" font-size="34" font-weight="600" fill="#5C0F28">栄養・効能・レシピ・保存方法</text>

  <text x="80" y="380" font-family="'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',Meiryo,sans-serif" font-size="22" fill="#4b5563">スーパーフードとして注目される</text>
  <text x="80" y="412" font-family="'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',Meiryo,sans-serif" font-size="22" fill="#4b5563">ビーツ（テーブルビート）の総合情報サイト</text>

  <line x1="80" y1="500" x2="700" y2="500" stroke="#d4b896" stroke-width="2"/>

  <text x="80" y="550" font-family="'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',Meiryo,sans-serif" font-size="22" fill="#8B1538" font-weight="600">study-apps.com/beets-info/</text>
</svg>`;

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const outPath = path.join(PUBLIC_DIR, 'ogp.png');
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log(`✓ Generated ogp.png (1200x630) at ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
