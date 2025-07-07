import React from 'react'
import { useTranslation } from 'react-i18next'

import { ModeToggle } from '~/common/components/modules/mode-toggle'

import Language from '../../../../frontend/src/components/atoms/language'
import Logo from '../../../../frontend/src/components/atoms/logo'
import GoHome from '../../../../frontend/src/components/modules/go-home'

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

export default TopPage
