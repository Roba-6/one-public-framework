import type { Resource } from 'i18next'
import React, { type PropsWithChildren } from 'react'

import { appSlice } from '@/src/common/app-slice'
import type { Configuration } from '@/src/common/types/configuration'
import { getApi } from '@/src/lib/http'

import { OPUProvider, type ReducerMap } from './providers'

export type OnePublicUIProps = PropsWithChildren<{
  reducers?: ReducerMap
  messages?: Resource
  preloadedState?: Record<string, unknown>
  locale?: string
}>

export const OnePublicUI = async ({
  children,
  reducers = {},
  messages = {},
  locale = 'ja',
}: OnePublicUIProps): Promise<React.JSX.Element> => {
  const response = await getApi<{ results: Configuration[] | null }>(
    '/configurations',
    undefined,
    { skipAuth: true }
  )
  console.debug('===', response)
  const appState = appSlice.reducer(
    appSlice.getInitialState(),
    appSlice.actions.initState(response.results as Configuration[])
  )
  const preloadedState = { app: appState }

  return (
    <OPUProvider
      reducers={reducers}
      preloadedState={preloadedState}
      messages={messages}
      locale={locale}
    >
      {children}
    </OPUProvider>
  )
}
