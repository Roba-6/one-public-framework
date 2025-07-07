import '~/common/styles/component.css'

import React from 'react'

import { ModeToggle } from '~/common/components/modules/mode-toggle'

import GoHome from '../../../../../../frontend/src/components/modules/go-home'

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
