import '~/common/styles/component.css'
import '~/common/styles/pages/welcome-page.css'

import React from 'react'
import { NavLink } from 'react-router'

import Logo from '~/common/components/atoms/logo'
import TextImage from '~/common/components/atoms/text-image'
import { Button } from '~/common/components/ui/button'

export const meta = () => {
  return [
    { title: 'WelcomePage to One Public Framework' },
    { name: 'description', content: 'WelcomePage to One Public Framework!' },
  ]
}

const WelcomePage = (): React.ReactNode => {
  // undefined()
  return (
    <div className="single-info-page">
      <header className="welcome-header">
        <Logo />
        <TextImage />
      </header>
      <main className="welcome">
        <div className="description">
          <h2 className="pb-2 text-xl">Welcome to One Public Framework</h2>
          <p>
            Thank you for choosing One Public Framework. This screen is displayed
            because the initial setup hasn't been completed yet. To proceed with the
            configuration, please edit the <strong>.env</strong> file. Alternatively,
            you can start by clicking one of the buttons below to explore the
            corresponding pages.
          </p>
        </div>
        <div className="nav">
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
