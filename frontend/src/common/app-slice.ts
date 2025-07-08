import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import i18n from 'i18next'
import type { WritableDraft } from 'immer'

import { getEnv } from '@/lib/utils'
import type { RootState } from '@/store'
import type { Configuration } from '@/types/configuration'

export interface Setting {
  name: string
  language: string
}

/**
 * Interface of Application Status.
 */
export interface AppState {
  settings: Setting
  accessToken: string
  isLoading: boolean
}

const initialState: AppState = {
  settings: {
    name: getEnv('UI_NAME') as string,
    language: (localStorage.getItem('language') || getEnv('UI_LANGUAGE')) as string,
  },
  accessToken: localStorage.getItem('accessToken') as string,
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
     * @param {WritableDraft<AppState>} state - The current application state object to be updated.
     * @param {PayloadAction<Configuration[]>} action - An action containing the configuration data to initialize the state.
     */
    initState: (
      state: WritableDraft<AppState>,
      action: PayloadAction<Configuration[]>
    ) => {
      action.payload.forEach((item: Configuration) => {
        switch (item.key) {
          case 'app_name':
            state.settings.name = item.value
            break
          case 'app_language':
            state.settings.language = item.value
            void i18n.changeLanguage(item.value)
            break
        }
      })
    },
    changeLanguage: (state: WritableDraft<AppState>, action: PayloadAction<string>) => {
      localStorage.setItem('language', action.payload)
      void i18n.changeLanguage(action.payload)
      state.settings.language = action.payload
    },
    loading: (state: WritableDraft<AppState>) => {
      state.isLoading = true
    },
    loadComplete: (state: WritableDraft<AppState>) => {
      state.isLoading = false
    },
    setAccessToken: (state: WritableDraft<AppState>, action: PayloadAction<string>) => {
      if (action.payload === '') {
        localStorage.removeItem('accessToken')
      } else {
        localStorage.setItem('accessToken', action.payload)
      }
      state.accessToken = action.payload
    },
  },
})

export const selectLanguage = (state: RootState) => state.app.settings.language
export const selectIsLoading = (state: RootState) => state.app.isLoading
export const selectAccessToken = (state: RootState) => state.app.accessToken
export const { initState, changeLanguage, loading, loadComplete, setAccessToken } =
  appSlice.actions
export default appSlice.reducer
