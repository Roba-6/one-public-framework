'use client'

// import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import Footer from '@/src/components/molecules/footer'

export const TopScreen = () => {
  const { t, i18n } = useTranslation()

  console.debug('==:', t)

  return (
    <div className="opu-site">
      <nav className="opu-topnav">
        <button
          className="opu-locale"
          onClick={() =>
            void i18n.changeLanguage(i18n.resolvedLanguage === 'ja' ? 'en' : 'ja')
          }
        >
          {i18n.resolvedLanguage === 'ja' ? 'EN' : 'JA'}
        </button>
      </nav>
      <Footer appName="One Public Framework" />
    </div>
  )
}
