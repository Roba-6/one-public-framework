'use client'

import {
  combineReducers,
  configureStore,
  createSlice,
  type Reducer,
  type UnknownAction,
} from '@reduxjs/toolkit'
import i18next, { type i18n, type Resource } from 'i18next'
import { type PropsWithChildren, useMemo } from 'react'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { Provider } from 'react-redux'

import enMessages from './locales/en.json'
import jaMessages from './locales/ja.json'

const uiSlice = createSlice({
  name: 'onePublicUI',
  initialState: { sidebarOpen: true, theme: 'light', locale: 'ja' },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setLocale: (state, action) => {
      state.locale = action.payload
    },
  },
})

export type ReducerMap = Record<string, Reducer<unknown, UnknownAction>>

export function createOnePublicUIStore(
  extraReducers: ReducerMap = {},
  preloadedState?: Record<string, unknown>
) {
  return configureStore({
    reducer: combineReducers({ onePublicUI: uiSlice.reducer, ...extraReducers }),
    preloadedState,
  })
}

export { enMessages, jaMessages }

export const defaultMessages: Resource = {
  ja: { translation: jaMessages },
  en: { translation: enMessages },
}

function mergeMessageTree(
  base: Record<string, unknown>,
  custom: Record<string, unknown>
): Record<string, unknown> {
  const merged = { ...base }
  for (const [key, value] of Object.entries(custom)) {
    const baseValue = merged[key]
    merged[key] =
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      baseValue &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue)
        ? mergeMessageTree(
            baseValue as Record<string, unknown>,
            value as Record<string, unknown>
          )
        : value
  }
  return merged
}

export function createOnePublicUII18n(resources: Resource = {}): i18n {
  const instance = i18next.createInstance()
  const customJa = (resources.ja?.translation ?? {}) as Record<string, unknown>
  const customEn = (resources.en?.translation ?? {}) as Record<string, unknown>
  instance.use(initReactI18next).init({
    lng: 'ja',
    fallbackLng: 'en',
    resources: {
      ...resources,
      ja: { translation: mergeMessageTree(jaMessages, customJa) },
      en: { translation: mergeMessageTree(enMessages, customEn) },
    },
    interpolation: { escapeValue: false },
  })
  return instance
}

export type OnePublicUIProviderProps = PropsWithChildren<{
  reducers?: ReducerMap
  messages?: Resource
  preloadedState?: Record<string, unknown>
  locale?: string
}>

export function OnePublicUIProvider({
  children,
  reducers = {},
  messages = {},
  preloadedState,
  locale = 'ja',
}: OnePublicUIProviderProps) {
  const store = useMemo(
    () => createOnePublicUIStore(reducers, preloadedState),
    [reducers, preloadedState]
  )
  const i18n = useMemo(() => {
    const instance = createOnePublicUII18n(messages)
    void instance.changeLanguage(locale)
    return instance
  }, [messages, locale])
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </Provider>
  )
}
