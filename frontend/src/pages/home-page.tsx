import React from 'react'
import { useTranslation } from 'react-i18next'

import Language from '@/components/atoms/language.tsx'
import Logo from '@/components/atoms/logo.tsx'
import GoHome from '@/components/modules/go-home.tsx'
import ModeToggle from '@/components/modules/mode-toggle.tsx'

const HomePage = (): React.ReactNode => {
  const { t } = useTranslation()

  return (
    <div className="single-page">
      <div className="container mx-auto min-h-[100vh]">
        <header className="header">
          <Logo />
          <div>
            <GoHome />
            <ModeToggle />
            <Language />
          </div>
        </header>
        <main className="main">
          <h1>{t('welcome')}</h1>
        </main>
      </div>
    </div>
  )
}

export default HomePage
