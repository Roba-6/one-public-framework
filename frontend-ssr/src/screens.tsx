'use client'

import { useTranslation } from 'react-i18next'

const stats = [
  ['dashboard.totalUsers', '2,543'],
  ['dashboard.publishedContent', '186'],
  ['dashboard.monthlyViews', '48.2K'],
  ['dashboard.conversion', '3.8%'],
] as const

console.debug(stats)

export function DashboardScreen() {
  const { t } = useTranslation()
  return (
    <div className="opu-page">
      <div className="opu-page-head">
        <div>
          <h1>{t('dashboard.welcome', { name: 'Rina' })}</h1>
          <p>{t('dashboard.today')}</p>
        </div>
        <button className="opu-primary">＋ {t('common.new')}</button>
      </div>
    </div>
  )
}
