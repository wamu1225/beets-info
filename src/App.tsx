import { useEffect, useState } from 'react';
import { Sprout, Activity, Map, Utensils, Package, AlertTriangle, Sun, Moon, ArrowLeft } from 'lucide-react';
import { sections } from './data/sections';
import type { Section } from './data/sections';
import './App.css';

const BASE = '/beets-info';
const THEME_KEY = 'beets-info-theme';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sprout: Sprout,
  activity: Activity,
  map: Map,
  utensils: Utensils,
  package: Package,
  'alert-triangle': AlertTriangle,
};

function getCurrentPath(): string {
  if (typeof window === 'undefined') return '/';
  const p = window.location.pathname;
  if (p.startsWith(BASE)) return p.slice(BASE.length) || '/';
  return p;
}

function navigateTo(path: string) {
  const full = BASE + (path.startsWith('/') ? path : '/' + path);
  window.history.pushState({}, '', full);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document === 'undefined') return 'light';
    return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }, [theme]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label={theme === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え'}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a
          href={`${BASE}/`}
          className="site-brand"
          onClick={(e) => { e.preventDefault(); navigateTo('/'); }}
        >
          <svg className="brand-logo" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="bh" cx="50%" cy="55%" r="50%">
                <stop offset="0%" stopColor="#E76A8A"/>
                <stop offset="60%" stopColor="#D63F66"/>
                <stop offset="100%" stopColor="#8B1538"/>
              </radialGradient>
            </defs>
            <path d="M32 12 Q22 10 18 4 Q16 0 20 0 Q26 2 32 8 Q38 2 44 0 Q48 0 46 4 Q42 10 32 12 Z" fill="#9BBE8B"/>
            <ellipse cx="32" cy="38" rx="20" ry="22" fill="url(#bh)"/>
          </svg>
          <span>ビーツ完全ガイド</span>
        </a>
        <nav className="site-nav">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function Home() {
  return (
    <>
      <div className="portal-banner">
        <a href="https://study-apps.com/">← study-apps.com トップへ</a>
      </div>
      <div className="hero">
        <h1>ビーツ完全ガイド</h1>
        <p>
          スーパーフードとして注目されるビーツ（テーブルビート）。
          栄養と健康効果、品種、産地、レシピ、保存方法、注意点まで、
          科学的根拠に基づいて分かりやすく解説します。
        </p>
      </div>

      <div className="section-grid">
        {sections.map((s) => {
          const Icon = iconMap[s.icon] || Sprout;
          return (
            <a
              key={s.id}
              href={`${BASE}/${s.id}/`}
              className="section-card"
              onClick={(e) => { e.preventDefault(); navigateTo(`/${s.id}/`); }}
            >
              <Icon className="section-card-icon" />
              <h2 className="section-card-title">{s.shortTitle}</h2>
              <p className="section-card-desc">{s.description}</p>
            </a>
          );
        })}
      </div>
    </>
  );
}

function SectionPage({ section }: { section: Section }) {
  useEffect(() => {
    document.title = `${section.title} | ビーツ完全ガイド`;
    window.scrollTo(0, 0);
  }, [section.id, section.title]);

  return (
    <>
      <a
        href={`${BASE}/`}
        className="back-link"
        onClick={(e) => { e.preventDefault(); navigateTo('/'); }}
      >
        <ArrowLeft size={16} /> トップへ戻る
      </a>
      <article className="section-page">
        <h1>{section.title}</h1>
        <p className="lead">{section.description}</p>
        <div className="section-content">
          <p>{section.content}</p>
        </div>
      </article>
    </>
  );
}

function NotFound() {
  return (
    <div className="section-page">
      <h1>ページが見つかりません</h1>
      <p>お探しのページは存在しないか、移動した可能性があります。</p>
      <a
        href={`${BASE}/`}
        onClick={(e) => { e.preventDefault(); navigateTo('/'); }}
      >
        トップへ戻る
      </a>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <a
          href={`${BASE}/about/`}
          onClick={(e) => { e.preventDefault(); navigateTo('/about/'); }}
        >サイトについて</a>
        <a
          href={`${BASE}/privacy/`}
          onClick={(e) => { e.preventDefault(); navigateTo('/privacy/'); }}
        >プライバシーポリシー</a>
        <a href="https://study-apps.com/">study-apps.com</a>
      </div>
      <div style={{ marginTop: 8 }}>
        本サイトは一般的な情報を提供するもので、医学的助言ではありません。健康上の懸念がある方は医師にご相談ください。
      </div>
    </footer>
  );
}

function About() {
  return (
    <article className="section-page">
      <h1>サイトについて</h1>
      <p>
        本サイト「ビーツ完全ガイド」は、ビーツ（テーブルビート）に関する正確で信頼できる情報を一箇所にまとめたリファレンスサイトです。
        植物学的な分類、栄養学・薬理学的な作用機序、栽培・産地、調理科学、保存技術、臨床安全性まで、
        科学的根拠に基づいた情報を提供します。
      </p>
      <p>
        本サイトの内容は一般的な情報提供を目的としており、医学的診断・治療・予防のための助言を構成するものではありません。
        健康上の懸念がある方は医師または管理栄養士にご相談ください。
      </p>
    </article>
  );
}

function Privacy() {
  return (
    <article className="section-page">
      <h1>プライバシーポリシー</h1>
      <h2>アクセス解析</h2>
      <p>
        本サイトでは、サイトの利用状況把握のために Google Analytics を使用しています。
        Google Analytics はクッキーを利用して匿名のトラフィックデータを収集します。
        収集される情報は匿名で、個人を特定するものではありません。
      </p>
      <h2>広告について</h2>
      <p>
        本サイトでは Google AdSense などの第三者配信の広告サービスを利用することがあります。
        広告配信事業者は、ユーザーの興味に応じた広告を表示するためにクッキーを使用することがあります。
        Google が広告 Cookie を使用することにより、Google や提携サイトによる広告の配信が可能になります。
      </p>
      <h2>免責事項</h2>
      <p>
        本サイトの情報は可能な限り正確を期していますが、その完全性・正確性を保証するものではありません。
        本サイトの情報を利用したことにより生じた損害について、運営者は一切の責任を負いません。
      </p>
    </article>
  );
}

export default function App() {
  const [path, setPath] = useState<string>(getCurrentPath());

  useEffect(() => {
    const handler = () => setPath(getCurrentPath());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const normalized = path.replace(/\/$/, '') || '/';

  let content: React.ReactNode;
  if (normalized === '/' || normalized === '') {
    content = <Home />;
  } else if (normalized === '/about') {
    content = <About />;
  } else if (normalized === '/privacy') {
    content = <Privacy />;
  } else {
    const id = normalized.replace(/^\//, '');
    const section = sections.find((s) => s.id === id);
    content = section ? <SectionPage section={section} /> : <NotFound />;
  }

  return (
    <>
      <Header />
      <main className="site-shell">{content}</main>
      <Footer />
    </>
  );
}
