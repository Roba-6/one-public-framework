import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { type AppType, selectAppType, setMenu } from '@/common/app-slice'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch, useAppSelector } from '@/common/hooks/use-store'
import AdminPage from '@/common/pages/admin/admin-page'
import LoginPage from '@/common/pages/admin/login-page'
import ConfigurationEditPage from '@/common/pages/configurations/edit-page'
import DashboardPage from '@/common/pages/dashboard-page'
import ErrorPage from '@/common/pages/error-page'
import HomePage from '@/common/pages/home-page'
import SamplePage from '@/common/pages/sample/sample-page'
import WelcomePage from '@/common/pages/welcome-page'
import type { Menu } from '@/common/types/data'
import AddUserPage from '@/features/users/add-page'
import DetailUserPage from '@/features/users/detail-page'
import UserListPage from '@/features/users/list-page'
import UpdateUserPage from '@/features/users/update-page'
import { getAdminPath } from '@/lib/utils'

export type RouterProps = {
  children: {
    default?: React.ReactNode
    adminRouter?: React.ReactNode
    publicRouter?: React.ReactNode
    publicOutlet?: React.ReactNode
  }
  menu?: Menu
}

const Router = ({ children, menu }: RouterProps): React.ReactNode => {
  const dispatch = useAppDispatch()
  const appType: AppType = useAppSelector(selectAppType)

  const [defaultRoute, setDefaultRoute] = React.useState<React.ReactNode>(null)

  useEffect(() => {
    if (children.default) {
      setDefaultRoute(children.default)
    } else {
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
    }
    dispatch(setMenu(menu!))
  }, [children, menu, appType, dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path={CONSTANT.ROUTE_URL.INDEX} element={defaultRoute}>
          {children.publicOutlet}
        </Route>
        {!appType && <Route path={CONSTANT.ROUTE_URL.HOME} element={<HomePage />} />}
        <Route path={getAdminPath()}>
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
            <Route
              path={CONSTANT.ROUTE_URL.ADMIN_USER.slice(1)}
              element={<UserListPage />}
            />
            <Route
              path={CONSTANT.ROUTE_URL.ADMIN_USER_ADD.slice(1)}
              element={<AddUserPage />}
            />
            <Route
              path={CONSTANT.ROUTE_URL.ADMIN_USER_UPDATE.slice(1)}
              element={<UpdateUserPage />}
            />
            <Route
              path={CONSTANT.ROUTE_URL.ADMIN_USER_DETAIL.slice(1)}
              element={<DetailUserPage />}
            />
            {children.adminRouter}
          </Route>
          <Route path={CONSTANT.ROUTE_URL.LOGIN.slice(1)} element={<LoginPage />} />
        </Route>
        <Route path={CONSTANT.ROUTE_URL.SAMPLE}>
          <Route index element={<SamplePage />} />
        </Route>
        {children.publicRouter}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
