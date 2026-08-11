'use client'

import {
  combineReducers,
  configureStore,
  type Reducer,
  type UnknownAction,
} from '@reduxjs/toolkit'
import { type Resource } from 'i18next'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import React, { type PropsWithChildren, useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'

import { createOnePublicUII18n } from '@/src/lib/client-utils'

import { appSlice } from './common/app-slice'

export type ReducerMap = Record<string, Reducer<unknown, UnknownAction>>

export function createOnePublicUIStore(
  extraReducers: ReducerMap = {},
  preloadedState?: Record<string, unknown>
) {
  return configureStore({
    reducer: combineReducers({ app: appSlice.reducer, ...extraReducers }),
    preloadedState,
  })
}

export type OPUProviderProps = PropsWithChildren<{
  reducers?: ReducerMap
  messages?: Resource
  preloadedState?: Record<string, unknown>
  locale?: string
}>

export const OPUProvider = ({
  children,
  reducers = {},
  messages = {},
  preloadedState,
  locale = 'ja',
}: OPUProviderProps): React.JSX.Element => {
  const store = useMemo(() => {
    return createOnePublicUIStore(reducers, preloadedState)
  }, [reducers, preloadedState])
  const i18n = useMemo(() => {
    const instance = createOnePublicUII18n(messages)
    void instance.changeLanguage(locale)
    return instance
  }, [messages, locale])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </Provider>
    </NextThemesProvider>
  )
}
