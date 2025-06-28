import '~/app.css'
import '~/common/styles/component.css'
import '~/common/styles/error-boundary.css'
import '~/locales/configs'

import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import { initState, loadComplete, selectIsLoading } from '~/common/app-slice'
import Spinner from '~/common/components/atoms/spinner'
import { ThemeProvider } from '~/common/components/theme-provider'
import { ScrollArea, ScrollBar } from '~/common/components/ui/scroll-area'
import { CONSTANT } from '~/common/constants'
import type { Configuration } from '~/common/types/configuration'
import { getApi } from '~/common/utils/http'
import { useAppDispatch, useAppSelector } from '~/hooks/use-store'
import { store } from '~/store'

import type { Route } from './+types/root'

/**
 * Global Layout
 *
 * @param children child node
 * @constructor
 */
export const Layout = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title></title>
        <Meta />
        <Links />
      </head>
      <body>
        <Provider store={store}>
          {children}
          <ScrollRestoration />
        </Provider>
        <Scripts />
      </body>
    </html>
  )
}

/**
 * Error Boundary
 *
 * @param error
 * @constructor
 */
export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps): React.ReactNode => {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="single-info-page">
      <div className="error-panel">
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
          <ScrollArea className="error-detail box">
            <div className="error-code">
              <pre>
                <code>{stack}</code>
              </pre>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </div>
    </main>
  )
}

export const loader = async () => {
  try {
    return await getApi(CONSTANT.API_URL_CONFIGURATION)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Application Component
 *
 * @constructor
 */
const App = ({ loaderData }: Route.ComponentProps): React.ReactNode => {
  const isLoading = useAppSelector(selectIsLoading)
  const dispatch = useAppDispatch()

  useEffect(() => {
    console.log('loaderData: ', loaderData)
    dispatch(initState(loaderData?.results as Configuration[]))
    dispatch(loadComplete())
  }, [])

  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      {isLoading ? <Spinner /> : <Outlet />}
    </ThemeProvider>
  )
}

export default App
