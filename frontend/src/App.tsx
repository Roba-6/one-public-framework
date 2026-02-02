import './index.css'
import '@/locales/configs'

import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { initState } from '@/common/app-slice'
import Spinner from '@/common/components/atoms/spinner'
import Messenger from '@/common/components/modules/messenger'
import Router, { type RouterProps } from '@/common/components/modules/router'
import { ThemeProvider } from '@/common/components/theme-provider'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store'
import ErrorPage from '@/common/pages/error-page.tsx'
import type { Configuration } from '@/common/types/configuration'
import type { CommonResponse } from '@/common/types/response'
import { getApi } from '@/lib/http'

const App = ({ children, menu }: RouterProps): React.ReactNode => {
  const dispatch = useAppDispatch()
  const [isFinished, setIsFinished] = React.useState<boolean>(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res: CommonResponse = await getApi<CommonResponse>(
          CONSTANT.API_URL.CONFIGURATIONS
        )
        dispatch(initState(res.results! as Configuration[]))
        setIsFinished(true)
      } catch (error) {
        console.error(error)
      }
    }
    void fetch()
  }, [dispatch])

  return (
    <ThemeProvider storageKey={CONSTANT.STORAGE_KEY.THEME}>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        {isFinished && <Router children={children} menu={menu} />}
      </ErrorBoundary>
      <Spinner className="z-50" />
      <Messenger />
    </ThemeProvider>
  )
}

export default App
