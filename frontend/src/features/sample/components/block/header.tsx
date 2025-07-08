import React from 'react'

import GoHome from '@/common/components/modules/go-home.tsx'
import ModeToggle from '@/common/components/modules/mode-toggle.tsx'

const Header = (): React.ReactNode => {
  return (
    <header className="p-2 sm:p-4 flex flex-row items-center justify-between">
      <GoHome />
      <h1 className="text-2xl font-bold">Sample Components</h1>
      <ModeToggle />
    </header>
  )
}

export default Header
