import '~/common/styles/component.css'

import React from 'react'

import GoHome from '~/common/components/modules/go-home'
import { ModeToggle } from '~/common/components/modules/mode-toggle'

const Header = (): React.ReactNode => {
  return (
    <header className="header">
      <GoHome />
      <h1>Sample Components</h1>
      <ModeToggle />
    </header>
  )
}

export default Header
