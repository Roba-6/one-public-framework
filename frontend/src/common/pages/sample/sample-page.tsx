import React from 'react'
import { NavLink } from 'react-router'

import { Button } from '@/common/components/ui/button.tsx'
import Header from '@/features/sample/components/block/header.tsx'

const SamplePage = (): React.ReactNode => {
  return (
    <div className="page">
      <Header />
      <main className="inner">
        <h1 className="b-4 text-3xl">Pages</h1>
        <div className="flex items-center gap-4">
          <NavLink to="/not-found">
            <Button>Not Found Page</Button>
          </NavLink>
          <NavLink to="/sample/error">
            <Button>Error Page</Button>
          </NavLink>
        </div>
      </main>
    </div>
  )
}

export default SamplePage
