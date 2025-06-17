import '~/features/sample/styles/pages/index-page.css'

import React from 'react'
import { NavLink } from 'react-router'

import { Button } from '~/common/components/ui/button'
import Header from '~/features/sample/components/block/header'

// import type { Route } from './+types/home'

// export function meta({}: Route.MetaArgs) {
export const meta = () => {
  return [
    { title: 'Sample Components' },
    { name: 'description', content: 'Sample Components' },
  ]
}

const IndexPage = (): React.ReactNode => {
  return (
    <div className="page">
      <Header />
      <main className="inner">
        <h1>Pages</h1>
        <div className="page-section">
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

export default IndexPage
