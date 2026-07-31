'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { type AdminNavItem, AdminShell } from './admin-shell'

type AdminScreenProps = {
  navItems?: AdminNavItem[]
  adminBasePath?: string
}

const stats = [
  ['dashboard.totalUsers', '2,543'],
  ['dashboard.publishedContent', '186'],
  ['dashboard.monthlyViews', '48.2K'],
  ['dashboard.conversion', '3.8%'],
] as const

export function DashboardScreen({
  navItems = [],
  adminBasePath = '/admin',
}: AdminScreenProps) {
  const { t } = useTranslation()
  return (
    <AdminShell navItems={navItems} adminBasePath={adminBasePath}>
      <div className="opu-page">
        <div className="opu-page-head">
          <div>
            <h1>{t('dashboard.welcome', { name: 'Rina' })}</h1>
            <p>{t('dashboard.today')}</p>
          </div>
          <button className="opu-primary">＋ {t('common.new')}</button>
        </div>
        <div className="opu-page-stats">
          {stats.map(([key, value]) => (
            <div className="opu-panel" key={key}>
              <span>{t(key)}</span>
              <b>{value}</b>
              <small style={{ color: '#4a9a5e' }}>
                ↗ 12.5% {t('dashboard.compared')}
              </small>
            </div>
          ))}
        </div>
        <div className="opu-panel" style={{ marginTop: 18, height: 330 }}>
          <h3>{t('dashboard.activity')}</h3>
          <p>{t('dashboard.lastSevenDays')}</p>
          <div className="opu-bars" style={{ height: 220 }}>
            {[40, 65, 48, 73, 55, 88, 68, 93, 72, 83, 64, 96].map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
