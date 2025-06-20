import React from 'react'
import { useTranslation } from 'react-i18next'

import Logo from '~/common/components/atoms/logo'
import GoHome from '~/common/components/modules/go-home'
import { ModeToggle } from '~/common/components/modules/mode-toggle'

const TopPage = () => {
  const { t } = useTranslation()
  return (
    <div className="single-page">
      <div className="container mx-auto min-h-[100vh]">
        <header className="header">
          <Logo />
          <div>
            <GoHome />
            <ModeToggle />
          </div>
        </header>
        <main className="main">
          <h1>{t('welcome')}</h1>
        </main>
      </div>
    </div>
  )
}

export default TopPage
