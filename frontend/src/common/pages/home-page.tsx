import React, { useEffect } from 'react'

import { selectAppName } from '@/common/app-slice.ts'
import Language from '@/common/components/atoms/language'
import Logo from '@/common/components/atoms/logo'
import ModeToggle from '@/common/components/modules/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar'
import { Separator } from '@/common/components/ui/separator'
import { useAppDispatch, useAppSelector } from '@/common/hooks/use-store'
import { completed } from '@/lib/functions'
import { getLocalMessage } from '@/lib/utils'

const HomePage = (): React.ReactNode => {
  const appName: string = useAppSelector(selectAppName)
  const dispatch = useAppDispatch()

  useEffect(() => {
    completed()
  }, [dispatch])

  return (
    <div className="single-page sm:px-4 relative">
      <div className="container mx-auto min-h-[100vh] relative">
        <header className="px-4 sm:px-0 py-2 w-full flex items-center">
          <Logo />
        </header>
        <Separator />
        <main className="pt-4 pb-36">
          <h1>{getLocalMessage('messages.welcome')}</h1>
        </main>
        <footer className="sm:py-4 w-full absolute bottom-0 left-0">
          <div className="container mx-auto p-4 text-center flex justify-between sm:rounded-2xl bg-[var(--card)]">
            <div className="w-[25%] md:w-[50%] transition-all">
              <Avatar>
                <AvatarImage src="/assets/roba-small.png" alt="Roba" />
                <AvatarFallback>OPF</AvatarFallback>
              </Avatar>
            </div>
            <div className="w-[75%] md:w-[50%] transition-all">
              <div className="ms-auto flex mb-4 items-center gap-2">
                <Language />
                <ModeToggle />
              </div>
              <div className="text-sm text-start text-neutral-400">
                &copy; {new Date().getFullYear()} {appName}. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default HomePage
