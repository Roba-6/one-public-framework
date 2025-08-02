import React, { useEffect } from 'react'

import { loadComplete } from '@/common/app-slice'
import Language from '@/common/components/atoms/language'
import Logo from '@/common/components/atoms/logo'
import GoHome from '@/common/components/modules/go-home'
import ModeToggle from '@/common/components/modules/mode-toggle'
import { useAppDispatch } from '@/common/hooks/use-store'
import { getLocalMessage } from '@/lib/utils'

const HomePage = (): React.ReactNode => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadComplete())
  }, [dispatch])

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
          <h1>{getLocalMessage('messages.welcome')}</h1>
        </main>
      </div>
    </div>
  )
}

export default HomePage
