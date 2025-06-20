import { createSlice } from '@reduxjs/toolkit'
import i18n from 'i18next'

import { getEnv } from '~/common/utils/env'
import type { RootState } from '~/store'

export interface Configuration {
  name: string
  url: string
  language: string
  api: string
}

/**
 * Interface of Application Status.
 */
export interface AppState {
  conf: Configuration
  isLoading: boolean
}

const initialState: AppState = {
  conf: {
    name: getEnv('UI_NAME') as string,
    url: getEnv('UI_URL') as string,
    language: getEnv('UI_LANGUAGE') as string,
    api: getEnv('UI_API') as string,
  },
  isLoading: true,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    /**
     * Initializes the application state by setting the language configuration.
     *
     * This function retrieves the language preference from local storage and
     * updates the application's state accordingly. It also triggers a change in the
     * language for the i18n instance to ensure proper localization.
     *
     * @param {Object} state - The current application state object to be updated.
     */
    initState: (state) => {
      const lang = localStorage.getItem('language') as string
      state.conf.language = lang
      void i18n.changeLanguage(lang)
    },
    loading: (state) => {
      state.isLoading = true
    },
    loadComplete: (state) => {
      state.isLoading = false
    },
  },
})

export const selectIsLoading = (state: RootState) => state.app.isLoading

export const { initState, loading, loadComplete } = appSlice.actions

export default appSlice.reducer
