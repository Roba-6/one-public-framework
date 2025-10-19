import React, { useEffect } from 'react'
import { NavLink } from 'react-router'

import Logo from '@/common/components/atoms/logo'
import TextImage from '@/common/components/atoms/text-image'
import { Button } from '@/common/components/ui/button'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store'
import { completed } from '@/lib/utils'

const WelcomePage = (): React.ReactNode => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    completed()
  }, [dispatch])

  return (
    <div className="single-info-page">
      <header className="w-full flex flex-col items-center gap-8">
        <Logo />
        <TextImage />
      </header>
      <main className="pt-8 pb-4 flex flex-col items-center justify-center">
        <div className="max-w-[800px] text-center">
          <h2 className="pb-2 text-xl">Welcome to One Public Framework</h2>
          <p>
            Thank you for choosing One Public Framework. This screen is displayed
            because the initial setup hasn't been completed yet. To proceed with the
            configuration, please edit the <b>.env</b> file. Alternatively, you can
            start by clicking one of the buttons below to explore the corresponding
            pages.
          </p>
        </div>
        <div className="pt-8 flex flex-row items-center gap-4">
          <Button asChild>
            <NavLink to={CONSTANT.ROUTE_URL.HOME}>Site Page</NavLink>
          </Button>
          <Button>
            <NavLink to={CONSTANT.ROUTE_URL.ADMIN}>Admin Page</NavLink>
          </Button>
          <Button>
            <NavLink to={CONSTANT.ROUTE_URL.SAMPLE}>Sample Page</NavLink>
          </Button>
        </div>
      </main>
    </div>
  )
}

export default WelcomePage
