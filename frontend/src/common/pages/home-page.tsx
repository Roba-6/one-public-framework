import React, { useEffect } from 'react'
import { Outlet } from 'react-router'

import { selectAppName } from '@/common/app-slice'
import Logo from '@/common/components/atoms/logo'
import Footer from '@/common/components/modules/footer'
import { Separator } from '@/common/components/ui/separator'
import { useAppDispatch, useAppSelector } from '@/common/hooks/use-store'
import { completed } from '@/lib/functions'
import { getLocalMessage } from '@/lib/utils'

const HomePage = (): React.JSX.Element => {
  const appName: string = useAppSelector(selectAppName)
  const dispatch = useAppDispatch()

  useEffect(() => {
    completed()
  }, [dispatch])

  return (
    <div className="single-page md:px-4 relative">
      <div className="container mx-auto min-h-[100vh] relative">
        <header className="px-4 sm:px-0 py-2 w-full flex items-center">
          <Logo />
        </header>
        <Separator />
        <main className="pt-4 pb-36 px-4 sm:px-0">
          <Outlet />
          <h1>{getLocalMessage('messages.welcome')}</h1>
        </main>
        <Footer appName={appName} />
      </div>
    </div>
  )
}

export default HomePage
