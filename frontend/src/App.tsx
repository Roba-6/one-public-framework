import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { loadComplete, selectIsLoading } from '@/common/app-slice'
import Spinner from '@/common/components/atoms/spinner'
import { ThemeProvider } from '@/common/components/theme-provider'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch, useAppSelector } from '@/common/hooks/use-store'
import { getApi } from '@/lib/http'
import AdminPage from '@/pages/admin/admin-page'
import LoginPage from '@/pages/admin/login-page'
import ErrorPage from '@/pages/error-page'
import HomePage from '@/pages/home-page'
import SamplePage from '@/pages/sample/sample-page.tsx'
import WelcomePage from '@/pages/welcome-page'
import type { Configuration } from '@/types/configuration'
import type { CommonResponse } from '@/types/response'

const App = (): React.ReactNode => {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectIsLoading)

  useEffect(() => {
    getApi(CONSTANT.API_URL_CONFIGURATION).then((res: CommonResponse) => {
      const configs: Configuration[] = res.results!
      console.debug(configs)
      dispatch(loadComplete())
    })
  }, [dispatch])

  return (
    <ThemeProvider defaultTheme="dark" storageKey={CONSTANT.KEY_UI_THEME}>
      {isLoading ? (
        <Spinner />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="welcome" element={<WelcomePage />} />
            <Route path="admin">
              <Route index element={<AdminPage />} />
              <Route path="login" element={<LoginPage />} />
            </Route>
            <Route path="sample">
              <Route index element={<SamplePage />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      )}
    </ThemeProvider>
  )
}

export default App
