import * as fs from 'fs';
import * as path from 'path';
import { sections } from '../src/data/sections.ts';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');
const BASE_URL = 'https://study-apps.com/beets-info';

console.log('--- beets-info SSG Pre-rendering ---');

if (!fs.existsSync(INDEX_HTML_PATH)) {
  console.error('Error: dist/index.html not found. Run "npm run build" first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

// ── ルート index.html に静的フォールバック + JSON-LD を注入 ──
const sectionListHtml = sections
  .map(
    (s) =>
      `<li style="margin-bottom:14px"><a href="/beets-info/${s.id}/" style="color:#8B1538;font-weight:600;text-decoration:none">${s.shortTitle}</a><br><span style="color:#555;font-size:0.9rem">${s.description}</span></li>`
  )
  .join('\n');

const rootStaticContent = `<div style="background:#fef5ec;border-bottom:1px solid #e7d8c8;padding:10px 16px;font-size:0.88rem;text-align:center;margin-bottom:16px;border-radius:6px;max-width:920px;margin-left:auto;margin-right:auto"><a href="https://study-apps.com/" style="color:#8B1538;text-decoration:none;font-weight:600">← study-apps.com トップへ</a></div><article id="static-fallback" style="font-family:sans-serif;line-height:1.7;max-width:920px;margin:0 auto;padding:24px 16px">
  <h1 style="font-size:1.8rem;font-weight:700;border-bottom:2px solid #8B1538;padding-bottom:8px;margin-bottom:16px;color:#8B1538">ビーツ完全ガイド</h1>
  <p style="color:#444;margin-bottom:24px">スーパーフードとして注目されるビーツ（テーブルビート）。栄養と健康効果、品種、産地、レシピ、保存方法、注意点まで、科学的根拠に基づいて分かりやすく解説します。</p>
  <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:12px">セクション一覧</h2>
  <ul style="list-style:none;padding:0">
${sectionListHtml}
  </ul>
  <nav style="margin-top:32px;border-top:1px solid #ddd;padding-top:16px;display:flex;gap:16px;flex-wrap:wrap">
    <a href="/beets-info/about/" style="color:#8B1538">サイトについて</a>
    <a href="/beets-info/privacy/" style="color:#8B1538">プライバシーポリシー</a>
  </nav>
  <p style="font-size:0.8rem;color:#888;margin-top:20px;border-top:1px solid #eee;padding-top:12px">※本サイトは一般的な情報を提供するもので、医学的助言ではありません。健康上の懸念がある方は医師にご相談ください。</p>
</article>`;

const homeJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ビーツ完全ガイド',
  url: `${BASE_URL}/`,
  description:
    'ビーツ（テーブルビート）の栄養、健康効果、品種、産地、レシピ、選び方、保存方法、注意点まで網羅した総合情報サイト。',
  inLanguage: 'ja',
});

let rootIndexHtml = templateHtml.replace('<div id="root"></div>', `<div id="root">${rootStaticContent}</div>`);
rootIndexHtml = rootIndexHtml.replace(
  '</head>',
  `<script type="application/ld+json">${homeJsonLd}</script>\n  </head>`
);
fs.writeFileSync(INDEX_HTML_PATH, rootIndexHtml);

// ── サブディレクトリ用テンプレート（アセットパスを ../ に書き換え） ──
const subDirTemplateHtml = templateHtml
  .replace(/href="\.\/assets\//g, 'href="../assets/')
  .replace(/src="\.\/assets\//g, 'src="../assets/')
  .replace(/href="\.\/favicon.svg"/g, 'href="../favicon.svg"');

let generatedCount = 0;

function buildSectionFallback(s: (typeof sections)[number]): string {
  return `<div style="background:#fef5ec;border-bottom:1px solid #e7d8c8;padding:10px 16px;font-size:0.88rem;text-align:center;margin-bottom:16px;border-radius:6px;max-width:920px;margin-left:auto;margin-right:auto"><a href="/beets-info/" style="color:#8B1538;text-decoration:none;font-weight:600">← ビーツ完全ガイド トップへ</a></div><article style="font-family:sans-serif;line-height:1.8;max-width:920px;margin:0 auto;padding:24px 16px">
  <h1 style="font-size:1.6rem;color:#8B1538;border-bottom:2px solid #8B1538;padding-bottom:10px">${s.title}</h1>
  <p style="color:#555;margin:12px 0 24px">${s.description}</p>
  <div style="color:#333">${s.content.replace(/\n/g, '<br>')}</div>
  <p style="margin-top:32px"><a href="/beets-info/" style="color:#8B1538">← トップへ戻る</a></p>
</article>`;
}

function writeSectionPage(s: (typeof sections)[number]) {
  const dir = path.join(DIST_DIR, s.id);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let html = subDirTemplateHtml
    .replace(/<title>.*?<\/title>/, `<title>${s.title} | ビーツ完全ガイド</title>`)
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${s.description}"`
    )
    .replace(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${s.title}"`
    )
    .replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${s.description}"`
    )
    .replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${BASE_URL}/${s.id}/"`
    )
    .replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${BASE_URL}/${s.id}/"`
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"/,
      `<meta name="twitter:title" content="${s.title}"`
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"/,
      `<meta name="twitter:description" content="${s.description}"`
    )
    .replace('<div id="root"></div>', `<div id="root">${buildSectionFallback(s)}</div>`);

  const articleJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: s.title,
    description: s.description,
    url: `${BASE_URL}/${s.id}/`,
    inLanguage: 'ja',
    datePublished: s.updatedAt,
    dateModified: s.updatedAt,
    author: { '@type': 'Organization', name: 'study-apps.com' },
    publisher: {
      '@type': 'Organization',
      name: 'study-apps.com',
      url: 'https://study-apps.com/',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/${s.id}/` },
  });

  const breadcrumbJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ビーツ完全ガイド', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: s.shortTitle, item: `${BASE_URL}/${s.id}/` },
    ],
  });

  html = html.replace(
    '</head>',
    `<script type="application/ld+json">${articleJsonLd}</script>\n  <script type="application/ld+json">${breadcrumbJsonLd}</script>\n  </head>`
  );

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  generatedCount++;
}

for (const s of sections) writeSectionPage(s);

// ── About / Privacy 静的ページ ──
function writeStaticPage(id: string, title: string, description: string, bodyHtml: string) {
  const dir = path.join(DIST_DIR, id);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const fallback = `<div style="background:#fef5ec;border-bottom:1px solid #e7d8c8;padding:10px 16px;font-size:0.88rem;text-align:center;margin-bottom:16px;border-radius:6px;max-width:920px;margin-left:auto;margin-right:auto"><a href="/beets-info/" style="color:#8B1538;text-decoration:none;font-weight:600">← ビーツ完全ガイド トップへ</a></div><article style="font-family:sans-serif;line-height:1.8;max-width:920px;margin:0 auto;padding:24px 16px">
  <h1 style="font-size:1.6rem;color:#8B1538;border-bottom:2px solid #8B1538;padding-bottom:10px">${title}</h1>
  ${bodyHtml}
  <p style="margin-top:32px"><a href="/beets-info/" style="color:#8B1538">← トップへ戻る</a></p>
</article>`;

  const html = subDirTemplateHtml
    .replace(/<title>.*?<\/title>/, `<title>${title} | ビーツ完全ガイド</title>`)
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${description}"`
    )
    .replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${BASE_URL}/${id}/"`
    )
    .replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${BASE_URL}/${id}/"`
    )
    .replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  generatedCount++;
}

writeStaticPage(
  'about',
  'サイトについて',
  'ビーツ完全ガイドについて。本サイトの目的と情報源、免責事項を説明します。',
  `<p>本サイト「ビーツ完全ガイド」は、ビーツ（テーブルビート）に関する正確で信頼できる情報をまとめたリファレンスサイトです。</p><p>本サイトの内容は一般的な情報提供を目的としており、医学的助言を構成するものではありません。健康上の懸念がある方は医師にご相談ください。</p>`
);

writeStaticPage(
  'privacy',
  'プライバシーポリシー',
  'ビーツ完全ガイドのプライバシーポリシー。Cookie・アクセス解析・広告の使用について。',
  `<h2>アクセス解析</h2><p>本サイトでは Google Analytics を使用しています。Cookie を利用して匿名のトラフィックデータを収集します。</p><h2>広告について</h2><p>本サイトでは Google AdSense などの第三者配信の広告サービスを利用することがあります。広告配信事業者は、ユーザーの興味に応じた広告を表示するために Cookie を使用することがあります。</p><h2>免責事項</h2><p>本サイトの情報の利用により生じた損害について、運営者は一切の責任を負いません。</p>`
);

console.log(`✓ Generated ${generatedCount} static pages`);
console.log('--- Done ---');
