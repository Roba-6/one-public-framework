import React from 'react'
import { NavLink } from 'react-router'

import Logo from '@/components/atoms/logo'
import TextImage from '@/components/atoms/text-image'
import { Button } from '@/components/ui/button'

const WelcomePage = (): React.ReactNode => {
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
            configuration, please edit the <strong>.env</strong> file. Alternatively,
            you can start by clicking one of the buttons below to explore the
            corresponding pages.
          </p>
        </div>
        <div className="pt-8 flex flex-row items-center gap-4">
          <Button asChild>
            <NavLink to="/">Site Page</NavLink>
          </Button>
          <Button>
            <NavLink to="/admin">Admin Page</NavLink>
          </Button>
          <Button>
            <NavLink to="/sample">Sample Page</NavLink>
          </Button>
        </div>
      </main>
    </div>
  )
}

export default WelcomePage
