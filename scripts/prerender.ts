import * as fs from 'fs';
import * as path from 'path';
import { sections } from '../src/data/sections.ts';
import { FAQ_BY_SECTION } from '../src/data/faqs.ts';
import { glossary } from '../src/data/glossary.ts';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');
const BASE_URL = 'https://study-apps.com/beets-info';

console.log('--- beets-info SSG Pre-rendering ---');

if (!fs.existsSync(INDEX_HTML_PATH)) {
  console.error('Error: dist/index.html not found. Run "npm run build" first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

// ── Markdown → HTML 変換（クライアントの parseContent と同等の出力） ──
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugifyAscii(_text: string, index: number): string {
  return `section-${index}`;
}

function parseInlineToHtml(text: string): string {
  let result = '';
  let remaining = text;
  const patterns: { re: RegExp; render: (m: RegExpExecArray) => string }[] = [
    {
      re: /\[([^\]]+)\]\(([^)]+)\)/,
      render: (m) => {
        const label = escapeHtml(m[1]);
        const href = m[2];
        const isExternal = /^https?:\/\//.test(href);
        const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${escapeHtml(href)}"${attrs}>${label}</a>`;
      },
    },
    { re: /\*\*(.+?)\*\*/, render: (m) => `<strong>${escapeHtml(m[1])}</strong>` },
    { re: /`([^`]+)`/, render: (m) => `<code class="inline-code">${escapeHtml(m[1])}</code>` },
  ];

  while (remaining.length > 0) {
    let earliest: { idx: number; len: number; html: string } | null = null;
    for (const p of patterns) {
      const m = p.re.exec(remaining);
      if (m && (earliest === null || m.index < earliest.idx)) {
        earliest = { idx: m.index, len: m[0].length, html: p.render(m) };
      }
    }
    if (!earliest) {
      result += escapeHtml(remaining);
      break;
    }
    if (earliest.idx > 0) result += escapeHtml(remaining.slice(0, earliest.idx));
    result += earliest.html;
    remaining = remaining.slice(earliest.idx + earliest.len);
  }
  return result;
}

function markdownToHtml(content: string): string {
  const lines = content.split('\n');
  const out: string[] = [];
  let i = 0;
  let h2Index = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') { i++; continue; }

    if (trimmed.startsWith('## ')) {
      const text = trimmed.slice(3);
      const slug = slugifyAscii(text, h2Index++);
      out.push(`<h2 id="${slug}" class="content-h2">${parseInlineToHtml(text)}</h2>`);
      i++;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      const text = trimmed.slice(4);
      out.push(`<h3 class="content-h3">${parseInlineToHtml(text)}</h3>`);
      i++;
      continue;
    }

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const rows = tableLines.map((r) => r.split('|').slice(1, -1).map((c) => c.trim()));
        const isSep = (r: string[]) => r.every((c) => /^[-:]+$/.test(c));
        const header = rows[0];
        const data = rows.slice(1).filter((r) => !isSep(r));
        const headerHtml = header.map((c) => `<th>${parseInlineToHtml(c)}</th>`).join('');
        const bodyHtml = data
          .map((row) => `<tr>${row.map((c) => `<td>${parseInlineToHtml(c)}</td>`).join('')}</tr>`)
          .join('');
        out.push(
          `<div class="content-table-wrap"><table class="content-table"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`
        );
      }
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      out.push(`<ol class="content-ol">${items.map((it) => `<li>${parseInlineToHtml(it)}</li>`).join('')}</ol>`);
      continue;
    }

    if (trimmed.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      out.push(`<ul class="content-ul">${items.map((it) => `<li>${parseInlineToHtml(it)}</li>`).join('')}</ul>`);
      continue;
    }

    if (trimmed.startsWith('💡 ')) {
      out.push(`<p class="callout callout-tip">${parseInlineToHtml(trimmed.slice(2).trim())}</p>`);
      i++; continue;
    }
    if (trimmed.startsWith('⚠️ ')) {
      out.push(`<p class="callout callout-warning">${parseInlineToHtml(trimmed.slice(2).trim())}</p>`);
      i++; continue;
    }
    if (trimmed.startsWith('📖 ')) {
      out.push(`<p class="callout callout-info">${parseInlineToHtml(trimmed.slice(2).trim())}</p>`);
      i++; continue;
    }
    if (trimmed.startsWith('✅ ')) {
      out.push(`<p class="callout callout-success">${parseInlineToHtml(trimmed.slice(2).trim())}</p>`);
      i++; continue;
    }

    if (trimmed === '---') {
      out.push('<hr>');
      i++; continue;
    }

    out.push(`<p class="content-p">${parseInlineToHtml(trimmed)}</p>`);
    i++;
  }

  return out.join('\n');
}

function buildTocHtml(toc: string[]): string {
  if (!toc.length) return '';
  const items = toc
    .map((it, idx) => `<li><a href="#${slugifyAscii(it, idx)}">${escapeHtml(it)}</a></li>`)
    .join('');
  return `<nav class="toc"><div class="toc-title">目次</div><ol class="toc-list">${items}</ol></nav>`;
}

// ── ルート index.html に静的フォールバック + JSON-LD を注入 ──
const sectionListHtml = sections
  .map(
    (s) =>
      `<li style="margin-bottom:14px"><a href="/beets-info/${s.id}/" style="color:#8B1538;font-weight:600;text-decoration:none">${escapeHtml(s.shortTitle)}</a><br><span style="color:#555;font-size:0.9rem">${escapeHtml(s.description)}</span></li>`
  )
  .join('\n');

const rootStaticContent = `<article id="static-fallback" style="font-family:sans-serif;line-height:1.7;max-width:920px;margin:0 auto;padding:24px 16px">
  <h1 style="font-size:1.8rem;font-weight:700;border-bottom:2px solid #8B1538;padding-bottom:8px;margin-bottom:16px;color:#8B1538">ビーツの基本ガイド</h1>
  <p style="color:#444;margin-bottom:24px">スーパーフードとして注目されるビーツ（テーブルビート）。栄養と健康効果、品種、産地、レシピ、保存方法、注意点まで、家庭目線で分かりやすくまとめています。</p>
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
  name: 'ビーツの基本ガイド',
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

function buildFaqHtml(sectionId: string): string {
  const faqs = FAQ_BY_SECTION[sectionId];
  if (!faqs || faqs.length === 0) return '';
  const items = faqs
    .map(
      (qa) =>
        `<details style="background:#fff;border:1px solid #e7d8c8;border-radius:8px;margin-bottom:8px;padding:14px 18px"><summary style="cursor:pointer;font-weight:600;color:#1f2937">Q. ${escapeHtml(qa.question)}</summary><p style="margin:10px 0 0;color:#4b5563;line-height:1.85">A. ${escapeHtml(qa.answer)}</p></details>`
    )
    .join('');
  return `<section style="margin:40px 0;padding:24px;background:#fef5ec;border:1px solid #e7d8c8;border-radius:12px"><h3 style="margin:0 0 16px;color:#8B1538;font-size:1.05rem">❓ よくある質問</h3>${items}</section>`;
}

function formatDateJa(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${m[1]}年${parseInt(m[2], 10)}月${parseInt(m[3], 10)}日`;
}

function buildSectionFallback(s: (typeof sections)[number]): string {
  const tocHtml = buildTocHtml(s.toc);
  const contentHtml = markdownToHtml(s.content);
  const faqHtml = buildFaqHtml(s.id);
  const leadHtml = s.lead && s.lead !== '（準備中）'
    ? `<p class="lead" style="color:#555;font-size:1.05rem;margin:16px 0 24px">${escapeHtml(s.lead)}</p>`
    : '';
  const isYMYL = s.id === 'nutrition' || s.id === 'cautions';
  const disclaimerHtml = isYMYL
    ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-left:4px solid #dc2626;border-radius:6px;padding:14px 16px;margin:0 0 28px;font-size:0.92rem;color:#7f1d1d;line-height:1.75"><strong style="display:block;margin-bottom:4px">⚠️ 医学的助言ではありません</strong>本サイトは一般的な情報を提供するもので、医師の診断・治療・予防の代わりにはなりません。健康上の懸念がある方は医師にご相談ください。</div>`
    : '';

  return `<article style="font-family:'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',Meiryo,sans-serif;line-height:1.85;max-width:920px;margin:0 auto;padding:24px 16px;color:#1f2937">
  <nav style="font-size:0.85rem;color:#6b7280;margin:0 0 16px"><a href="/beets-info/" style="color:#8B1538;text-decoration:none">ビーツの基本ガイド</a> <span style="color:#9ca3af">›</span> <span style="color:#4b5563;font-weight:600">${escapeHtml(s.shortTitle)}</span></nav>
  <header style="margin-bottom:20px">
    <div style="font-size:2.4rem;line-height:1;margin-bottom:8px">${s.emoji}</div>
    <h1 style="font-size:1.7rem;color:#8B1538;border-bottom:2px solid #8B1538;padding-bottom:10px;margin:0 0 8px">${escapeHtml(s.title)}</h1>
    <div style="font-size:0.85rem;color:#9c8f80;margin-top:10px">最終更新: ${formatDateJa(s.updatedAt)}</div>
  </header>
  ${leadHtml}
  ${disclaimerHtml}
  ${tocHtml}
  <div class="section-content">
${contentHtml}
  </div>
  ${faqHtml}
  <p style="margin-top:32px"><a href="/beets-info/" style="color:#8B1538">← トップへ戻る</a></p>
</article>`;
}

function writeSectionPage(s: (typeof sections)[number]) {
  const dir = path.join(DIST_DIR, s.id);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let html = subDirTemplateHtml
    .replace(/<title>.*?<\/title>/, `<title>${s.title} | ビーツの基本ガイド</title>`)
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
      /<meta property="og:type" content="[^"]*"/,
      `<meta property="og:type" content="article"`
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
      { '@type': 'ListItem', position: 1, name: 'ビーツの基本ガイド', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: s.shortTitle, item: `${BASE_URL}/${s.id}/` },
    ],
  });

  const extraJsonLd: string[] = [];
  const faqList = FAQ_BY_SECTION[s.id];
  if (faqList && faqList.length) {
    const faqJsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqList.map((qa) => ({
        '@type': 'Question',
        name: qa.question,
        acceptedAnswer: { '@type': 'Answer', text: qa.answer },
      })),
    });
    extraJsonLd.push(`<script type="application/ld+json">${faqJsonLd}</script>`);
  }

  html = html.replace(
    '</head>',
    `<script type="application/ld+json">${articleJsonLd}</script>\n  <script type="application/ld+json">${breadcrumbJsonLd}</script>\n  ${extraJsonLd.join('\n  ')}\n  </head>`
  );

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  generatedCount++;
}

for (const s of sections) writeSectionPage(s);

// ── About / Privacy 静的ページ ──
function writeStaticPage(id: string, title: string, description: string, bodyHtml: string) {
  const dir = path.join(DIST_DIR, id);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const fallback = `<article style="font-family:'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',Meiryo,sans-serif;line-height:1.85;max-width:920px;margin:0 auto;padding:24px 16px;color:#1f2937">
  <nav style="font-size:0.85rem;color:#6b7280;margin:0 0 16px"><a href="/beets-info/" style="color:#8B1538;text-decoration:none">ビーツの基本ガイド</a> <span style="color:#9ca3af">›</span> <span style="color:#4b5563;font-weight:600">${escapeHtml(title)}</span></nav>
  <h1 style="font-size:1.7rem;color:#8B1538;border-bottom:2px solid #8B1538;padding-bottom:10px">${title}</h1>
  ${bodyHtml}
  <p style="margin-top:32px"><a href="/beets-info/" style="color:#8B1538">← トップへ戻る</a></p>
</article>`;

  const pageJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${BASE_URL}/${id}/`,
    inLanguage: 'ja',
    isPartOf: { '@type': 'WebSite', name: 'ビーツの基本ガイド', url: `${BASE_URL}/` },
  });

  const breadcrumbJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ビーツの基本ガイド', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: title, item: `${BASE_URL}/${id}/` },
    ],
  });

  let html = subDirTemplateHtml
    .replace(/<title>.*?<\/title>/, `<title>${title} | ビーツの基本ガイド</title>`)
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${description}"`
    )
    .replace(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${title}"`
    )
    .replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${description}"`
    )
    .replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${BASE_URL}/${id}/"`
    )
    .replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${BASE_URL}/${id}/"`
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"/,
      `<meta name="twitter:title" content="${title}"`
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"/,
      `<meta name="twitter:description" content="${description}"`
    )
    .replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);

  html = html.replace(
    '</head>',
    `<script type="application/ld+json">${pageJsonLd}</script>\n  <script type="application/ld+json">${breadcrumbJsonLd}</script>\n  </head>`
  );

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  generatedCount++;
}

// 用語集ページ
const glossarySorted = [...glossary].sort((a, b) =>
  (a.reading || a.term).localeCompare(b.reading || b.term, 'ja')
);
const glossaryHtml = glossarySorted
  .map((g) => {
    const related = g.relatedSectionId ? sections.find((s) => s.id === g.relatedSectionId) : null;
    const relatedLink = related
      ? `<a href="/beets-info/${related.id}/" style="display:inline-block;font-size:0.88rem;color:#8B1538;margin-top:4px">関連ページ：${escapeHtml(related.shortTitle)} →</a>`
      : '';
    const readingSpan = g.reading && g.reading !== g.term
      ? `<span style="color:#9c8f80;font-size:0.9rem;font-weight:400">（${escapeHtml(g.reading)}）</span>`
      : '';
    return `<div style="border-bottom:1px solid #e7d8c8;padding:20px 0"><dt style="font-weight:700;color:#8B1538;font-size:1.1rem;margin-bottom:8px"><span style="margin-right:4px">${escapeHtml(g.term)}</span>${readingSpan}</dt><dd style="margin:0"><p style="margin:0 0 8px;line-height:1.85;color:#1f2937">${escapeHtml(g.description)}</p>${relatedLink}</dd></div>`;
  })
  .join('');

writeStaticPage(
  'glossary',
  '用語集',
  'ビーツに関する専門用語（ベタレイン、ベタシアニン、シュウ酸、FODMAP、ビーツ尿など）の解説。',
  `<p style="color:#555;font-size:1.05rem;margin:16px 0 24px">本サイトに登場する専門用語をまとめました。ベタレイン、シュウ酸、FODMAP など、健康効果や注意点の理解に役立ててください。</p><dl style="margin:0;padding:0">${glossaryHtml}</dl>`
);

writeStaticPage(
  'about',
  'サイトについて',
  'ビーツの基本ガイドについて。本サイトの目的と情報源、免責事項を説明します。',
  `<p>本サイト「ビーツの基本ガイド」は、ビーツ（テーブルビート）に関する情報を家庭の読者向けにまとめたリファレンスサイトです。植物としての特徴、栄養、産地、調理、保存、注意点までを網羅しています。</p><p>本サイトの内容は一般的な情報提供を目的としており、医学的診断・治療・予防のための助言を構成するものではありません。健康上の懸念がある方は医師または管理栄養士にご相談ください。</p><h2 class="content-h2" style="font-size:1.35rem;color:#8B1538;border-left:4px solid #8B1538;background:#fef5ec;padding:8px 14px;margin:32px 0 16px">編集・制作方針</h2><p>本サイトのコンテンツは、一般に入手できる書籍や公開されている情報を参照しつつ、運営者が内容を再構成し、家庭の読者に分かりやすい形で独自に解説しています。他サイトの文章をそのまま転載することはありません。栄養や健康に関わる記述は特定の効果を保証するものではなく、誤りや古くなった情報に気づいた場合は随時見直し・修正します。</p><h2 class="content-h2" style="font-size:1.35rem;color:#8B1538;border-left:4px solid #8B1538;background:#fef5ec;padding:8px 14px;margin:32px 0 16px">お問い合わせ</h2><p>ご質問・誤りのご指摘は<a href="https://forms.gle/ccMv7oKwz6ysDHBe6" target="_blank" rel="noopener noreferrer" style="color:#8B1538">こちらのGoogleフォーム</a>からお願いします。</p>`
);

writeStaticPage(
  'privacy',
  'プライバシーポリシー',
  'ビーツの基本ガイドのプライバシーポリシー。Cookie・アクセス解析・広告の使用について。',
  `<h2 class="content-h2" style="font-size:1.35rem;color:#8B1538;border-left:4px solid #8B1538;background:#fef5ec;padding:8px 14px;margin:32px 0 16px">アクセス解析</h2><p>本サイトでは Google Analytics を使用しています。Cookie を利用して匿名のトラフィックデータを収集します。</p><h2 class="content-h2" style="font-size:1.35rem;color:#8B1538;border-left:4px solid #8B1538;background:#fef5ec;padding:8px 14px;margin:32px 0 16px">広告について</h2><p>本サイトでは Google AdSense などの第三者配信の広告サービスを利用することがあります。広告配信事業者は、ユーザーの興味に応じた広告を表示するために Cookie を使用することがあります。</p><h2 class="content-h2" style="font-size:1.35rem;color:#8B1538;border-left:4px solid #8B1538;background:#fef5ec;padding:8px 14px;margin:32px 0 16px">免責事項</h2><p>本サイトの情報の利用により生じた損害について、運営者は一切の責任を負いません。</p>`
);

console.log(`✓ Generated ${generatedCount} static pages`);
console.log('--- Done ---');
