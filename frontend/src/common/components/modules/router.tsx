import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { type AppType, selectAppType } from '@/common/app-slice'
import { CONSTANT } from '@/common/constants'
import { useAppSelector } from '@/common/hooks/use-store'
import AdminPage from '@/common/pages/admin/admin-page'
import LoginPage from '@/common/pages/admin/login-page'
import ConfigurationEditPage from '@/common/pages/configurations/edit-page'
import DashboardPage from '@/common/pages/dashboard-page'
import ErrorPage from '@/common/pages/error-page'
import HomePage from '@/common/pages/home-page'
import SamplePage from '@/common/pages/sample/sample-page'
import WelcomePage from '@/common/pages/welcome-page'

const Router = ({ children }: { children: React.ReactNode }): React.ReactNode => {
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
          <Route element={<AdminPage />}>
            <Route index element={<DashboardPage />} />
            <Route
              path={CONSTANT.ROUTE_URL.ADMIN_DASHBOARD.slice(1)}
              element={<DashboardPage />}
            />
            <Route
              path={CONSTANT.ROUTE_URL.ADMIN_CONFIGURATION.slice(1)}
              element={<ConfigurationEditPage />}
            />
          </Route>
          <Route path={CONSTANT.ROUTE_URL.LOGIN.slice(1)} element={<LoginPage />} />
        </Route>
        <Route path={CONSTANT.ROUTE_URL.SAMPLE}>
          <Route index element={<SamplePage />} />
        </Route>
        {children}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
