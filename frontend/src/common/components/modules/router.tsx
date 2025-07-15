import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { type AppType, selectAppType } from '@/common/app-slice'
import { CONSTANT } from '@/common/constants'
import { useAppSelector } from '@/common/hooks/use-store'
import AdminPage from '@/common/pages/admin/admin-page'
import LoginPage from '@/common/pages/admin/login-page'
import ErrorPage from '@/common/pages/error-page'
import HomePage from '@/common/pages/home-page'
import SamplePage from '@/common/pages/sample/sample-page'
import WelcomePage from '@/common/pages/welcome-page'

const Router = (): React.ReactNode => {
  const appType: AppType = useAppSelector(selectAppType)
  const [defaultRoute, setDefaultRoute] = React.useState<React.ReactNode>(null)

  useEffect(() => {
    switch (appType) {
      case 'cms':
        setDefaultRoute(<HomePage />)
        break
      case 'admin':
        setDefaultRoute(<AdminPage />)
        break
      default:
        setDefaultRoute(<WelcomePage />)
    }
  }, [appType])

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={defaultRoute} />
        {!appType && <Route path={CONSTANT.ROUTE_URL.HOME} element={<HomePage />} />}
        <Route path={CONSTANT.ROUTE_URL.ADMIN}>
          <Route index element={<AdminPage />} />
          <Route path={CONSTANT.ROUTE_URL.LOGIN.slice(1)} element={<LoginPage />} />
        </Route>
        <Route path={CONSTANT.ROUTE_URL.SAMPLE}>
          <Route index element={<SamplePage />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
