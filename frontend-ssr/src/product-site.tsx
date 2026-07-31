'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const code = `import {
  OnePublicUIProvider,
  AdminShell
} from "one-public-ui";

const postsReducer = createSlice({
  name: "posts",
  initialState: []
}).reducer;

export default function Layout({ children }) {
  return (
    <OnePublicUIProvider
      reducers={{ posts: postsReducer }}
      messages={customMessages}
    >
      <AdminShell navItems={[
        { label: "投稿管理", href: "/admin/posts" }
      ]}>
        {children}
      </AdminShell>
    </OnePublicUIProvider>
  );
}`

export function ProductSite() {
  const { t, i18n } = useTranslation()
  const [copied, setCopied] = useState(false)
  const copyInstall = async () => {
    await navigator.clipboard?.writeText('npm install one-public-ui')
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="opu-site">
      <nav className="opu-topnav">
        <Link href="/" className="opu-brand">
          <span>one</span>
          <b>public ui</b>
        </Link>
        <div className="opu-navlinks">
          <a href="#features">{t('nav.features')}</a>
          <a href="#start">{t('nav.start')}</a>
          <a href="#extend">{t('nav.extend')}</a>
          <a href="#docs">{t('nav.docs')}</a>
        </div>
        <button
          className="opu-locale"
          onClick={() =>
            void i18n.changeLanguage(i18n.resolvedLanguage === 'ja' ? 'en' : 'ja')
          }
        >
          {i18n.resolvedLanguage === 'ja' ? 'EN' : 'JA'}
        </button>
        <Link className="opu-nav-cta" href="/admin/dashboard">
          {t('nav.demo')} <span>↗</span>
        </Link>
      </nav>

      <main>
        <section className="opu-hero">
          <div className="opu-eyebrow">
            <span>●</span> {t('hero.badge')}
          </div>
          <h1>
            {t('hero.before')}
            <br />
            <em>{t('hero.product')}</em>
            {t('hero.after')}
          </h1>
          <p>{t('hero.description')}</p>
          <div className="opu-hero-actions">
            <button onClick={copyInstall} className="opu-install">
              <code>$ npm install one-public-ui</code>
              <span>{copied ? '✓' : '⧉'}</span>
            </button>
            <a href="#start" className="opu-start">
              {t('hero.quickStart')} <span>→</span>
            </a>
          </div>
          <div className="opu-proof">
            <span className="opu-avatars">
              <i>YU</i>
              <i>KM</i>
              <i>AN</i>
              <i>+</i>
            </span>
            <b>{t('hero.proofStrong')}</b>
            <span>{t('hero.proof')}</span>
          </div>
        </section>

        <section className="opu-preview-wrap">
          <div className="opu-browser">
            <div className="opu-browserbar">
              <span className="opu-dots">● ● ●</span>
              <span className="opu-url">▣　localhost:3000/admin/dashboard</span>
              <span>⌄</span>
            </div>
            <div className="opu-browserbody">
              <aside className="opu-demo-side">
                <b>one public ui</b>
                <small>{t('common.workspace')}</small>
                <span className="sel">⌂　{t('common.dashboard')}</span>
                <span>▤　{t('common.users')}</span>
                <span>□　{t('common.content')}</span>
                <span>◇　{t('common.settings')}</span>
                <span>◉　{t('common.help')}</span>
                <div className="opu-demo-user">
                  <i>RN</i>
                  <b>
                    Rina Nakamura<small>{t('common.administrator')}</small>
                  </b>
                </div>
              </aside>
              <div className="opu-demo-main">
                <div className="opu-demo-top">
                  ⌕　♢　<span>RN</span>
                </div>
                <div className="opu-demo-content">
                  <div className="opu-demo-title">
                    <div>
                      <h3>{t('dashboard.welcome', { name: 'Rina' })}</h3>
                      <p>{t('dashboard.today')}</p>
                    </div>
                    <button>＋ {t('common.new')}</button>
                  </div>
                  <div className="opu-stats">
                    <article>
                      <span>{t('dashboard.totalUsers')}　↗</span>
                      <b>2,543</b>
                      <small>+12.5%　{t('dashboard.compared')}</small>
                    </article>
                    <article>
                      <span>{t('dashboard.publishedContent')}　◫</span>
                      <b>186</b>
                      <small>+8.2%　{t('dashboard.compared')}</small>
                    </article>
                    <article>
                      <span>{t('dashboard.monthlyViews')}　⌁</span>
                      <b>48.2K</b>
                      <small>+24.3%　{t('dashboard.compared')}</small>
                    </article>
                    <article>
                      <span>{t('dashboard.conversion')}　↗</span>
                      <b>3.8%</b>
                      <small>+0.4%　{t('dashboard.compared')}</small>
                    </article>
                  </div>
                  <div className="opu-chart">
                    <div>
                      <b>{t('dashboard.activity')}</b>
                      <small>{t('dashboard.lastSevenDays')}</small>
                    </div>
                    <div className="opu-bars">
                      {[45, 59, 47, 72, 62, 88, 78, 94, 65, 80, 75, 96].map((h, i) => (
                        <i key={i} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opu-floating-card">
            <span>✓</span>
            <div>
              <b>{t('dashboard.setupComplete')}</b>
              <small>{t('dashboard.setupReady')}</small>
            </div>
          </div>
        </section>

        <section id="features" className="opu-feature-intro">
          <span className="opu-section-kicker">{t('features.kicker')}</span>
          <h2>{t('features.title')}</h2>
          <p>{t('features.description')}</p>
          <div className="opu-feature-grid">
            <article>
              <span>⚡</span>
              <h3>{t('features.zeroTitle')}</h3>
              <p>{t('features.zeroText')}</p>
            </article>
            <article>
              <span>▦</span>
              <h3>{t('features.adminTitle')}</h3>
              <p>{t('features.adminText')}</p>
            </article>
            <article>
              <span>＋</span>
              <h3>{t('features.extendTitle')}</h3>
              <p>{t('features.extendText')}</p>
            </article>
          </div>
        </section>

        <section id="extend" className="opu-code-section">
          <div>
            <span className="opu-section-kicker">{t('extend.kicker')}</span>
            <h2>{t('extend.title')}</h2>
            <p>{t('extend.description')}</p>
            <ul>
              <li>
                <b>✓</b> {t('extend.reducer')}
              </li>
              <li>
                <b>✓</b> {t('extend.messages')}
              </li>
              <li>
                <b>✓</b> {t('extend.nav')}
              </li>
            </ul>
          </div>
          <div className="opu-code-card">
            <div>
              <span>app/layout.tsx</span>
              <span>● ● ●</span>
            </div>
            <pre>
              <code>{code}</code>
            </pre>
          </div>
        </section>

        <section id="start" className="opu-cta">
          <span className="opu-section-kicker">{t('cta.kicker')}</span>
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.description')}</p>
          <button onClick={copyInstall} className="opu-install light">
            <code>$ npm install one-public-ui</code>
            <span>{copied ? '✓' : '⧉'}</span>
          </button>
          <Link href="/admin/login">{t('cta.login')} →</Link>
        </section>
      </main>
      <footer>
        <Link href="/" className="opu-brand">
          <span>one</span>
          <b>public ui</b>
        </Link>
        <span>MIT License · Built for product teams.</span>
      </footer>
    </div>
  )
}
