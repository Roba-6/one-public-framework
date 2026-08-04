'use client'

import Link from 'next/link'
import type { PropsWithChildren, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export type AdminNavItem = {
  label?: string
  labelKey?: string
  href: string
  icon?: ReactNode
}

export function normalizeAdminBasePath(value = '/admin'): string {
  const trimmed = value.trim()
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.replace(/\/+$/, '') || '/admin'
}

export function resolveAdminHref(href: string, adminBasePath = '/admin'): string {
  const base = normalizeAdminBasePath(adminBasePath)
  return href === '/admin' || href.startsWith('/admin/')
    ? `${base}${href.slice('/admin'.length)}`
    : href
}

export type AdminShellProps = PropsWithChildren<{
  navItems?: AdminNavItem[]
  adminBasePath?: string
}>

export function AdminShell({
  children,
  navItems = [],
  adminBasePath = '/admin',
}: AdminShellProps) {
  const { t, i18n } = useTranslation()
  const baseItems: AdminNavItem[] = [
    { labelKey: 'common.dashboard', href: '/admin/dashboard' },
    { labelKey: 'common.settings', href: '/admin/settings' },
  ]
  return (
    <div className="opu-admin">
      <aside className="opu-sidebar">
        <Link href="/" className="opu-brand">
          <span>one</span>
          <b>public ui</b>
        </Link>
        <p className="opu-side-label">{t('common.workspace')}</p>
        <nav>
          {[...baseItems, ...navItems].map((item, index) => (
            <Link
              key={item.href}
              href={resolveAdminHref(item.href, adminBasePath)}
              className={`opu-nav-item ${index === 0 ? 'active' : ''}`}
            >
              <span className="opu-nav-icon">
                {item.icon ?? (index === 0 ? '⌂' : '◇')}
              </span>
              {item.labelKey ? t(item.labelKey) : item.label}
            </Link>
          ))}
        </nav>
        <div className="opu-side-user">
          <span className="opu-avatar">RN</span>
          <span>
            <b>Rina Nakamura</b>
            <small>{t('common.administrator')}</small>
          </span>
          <span>•••</span>
        </div>
      </aside>
      <main className="opu-main">
        <header className="opu-admin-header">
          <span className="opu-mobile-brand">one public ui</span>
          <span className="opu-header-actions">
            <button
              className="opu-locale"
              onClick={() =>
                void i18n.changeLanguage(i18n.resolvedLanguage === 'ja' ? 'en' : 'ja')
              }
            >
              {i18n.resolvedLanguage === 'ja' ? 'EN' : 'JA'}
            </button>
            ⌕♢<span className="opu-mini-avatar">RN</span>
          </span>
        </header>
        {children}
      </main>
    </div>
  )
}
