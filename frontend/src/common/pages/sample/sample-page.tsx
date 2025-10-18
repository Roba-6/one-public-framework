import React, { useEffect } from 'react'
import { NavLink } from 'react-router'

import { Button } from '@/common/components/ui/button'
import { useAppDispatch } from '@/common/hooks/use-store'
import Header from '@/features/sample/components/block/header'
import { completed } from '@/lib/utils.ts'

const SamplePage = (): React.ReactNode => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    completed()
  }, [dispatch])

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
