import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { loadComplete, selectIsLoading } from '@/common/app-slice'
import { CONSTANT } from '@/common/constants'
import Spinner from '@/components/atoms/spinner.tsx'
import { ThemeProvider } from '@/components/theme-provider'
import { useAppDispatch, useAppSelector } from '@/hooks/use-store'
import { getApi } from '@/lib/http'
import WelcomePage from '@/pages/welcome-page.tsx'
import type { Configuration } from '@/types/configuration'
import type { CommonResponse } from '@/types/response'

function App() {
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {isLoading ? (
        <Spinner />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route index element={<div>Hello</div>} />
            <Route path="welcome" element={<WelcomePage />} />
            <Route path="admin">
              <Route index element={<>Admin</>} />
              <Route path="login" element={<>Login</>} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </ThemeProvider>
  )
}

export default App
