import './index.css'
import '@/locales/configs'

import React, { useEffect } from 'react'

import { initState, selectIsLoading } from '@/common/app-slice'
import Spinner from '@/common/components/atoms/spinner'
import Router from '@/common/components/modules/router'
import { ThemeProvider } from '@/common/components/theme-provider'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch, useAppSelector } from '@/common/hooks/use-store'
import type { CommonResponse } from '@/common/types/response'
import { getApi } from '@/lib/http'

const App = (): React.ReactNode => {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectIsLoading)
  const [isFinished, setIsFinished] = React.useState<boolean>(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        console.debug('---------- .env var ----------')
        console.debug(import.meta.env)
        const res: CommonResponse = await getApi<CommonResponse>(
          CONSTANT.API_URL.CONFIGURATION
        )
        dispatch(initState(res.results!))
        setIsFinished(true)
      } catch (error) {
        console.error(error)
      }
    }
    void fetch()
  }, [dispatch])

  return (
    <ThemeProvider defaultTheme="dark" storageKey={CONSTANT.STORAGE_KEY.THEME}>
      {isFinished && <Router />}
      {isLoading && <Spinner className="z-50" />}
    </ThemeProvider>
  )
}

export default App
