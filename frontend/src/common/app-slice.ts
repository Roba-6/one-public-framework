import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import i18n from 'i18next'
import type { WritableDraft } from 'immer'

import { CONSTANT } from '@/common/constants'
import type { Configuration } from '@/common/types/configuration'
import type { MenuItem } from '@/common/types/data'
import type { Message } from '@/common/types/response'
import { getEnv } from '@/lib/utils'
import type { RootState } from '@/store'
import menu from '@/templates/menu'

export type AppType = 'cms' | 'admin'

export interface Setting {
  name: string
  language: string
  url: string
  api: string
  type: AppType
}

export type MessageType = 'success' | 'error' | 'info' | 'warning'

export interface AppMessage {
  id: string
  status: number
  type?: MessageType
  message?: Message
  timestamp?: number
  sticky?: boolean
}

/**
 * Interface of Application Status.
 */
export interface AppState {
  settings: Setting
  menu: { [key: string]: MenuItem[] }
  accessToken: string
  messages: AppMessage[]
  isLoading: boolean
}

const initialState: AppState = {
  settings: {
    name: getEnv('UI_NAME') as string,
    language: (localStorage.getItem(CONSTANT.STORAGE_KEY.LANGUAGE) ||
      getEnv('UI_LANGUAGE')) as string,
    url: getEnv('UI_URL') as string,
    api: getEnv('UI_API') as string,
    type: getEnv('UI_TYPE') as AppType,
  },
  menu: menu,
  accessToken: localStorage.getItem(CONSTANT.STORAGE_KEY.ACCESS_TOKEN) as string,
  messages: [],
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
            if (item.value && item.value !== '') state.settings.name = item.value
            break
          case 'language':
            if (localStorage.getItem(CONSTANT.STORAGE_KEY.LANGUAGE)) {
              state.settings.language = localStorage.getItem(
                CONSTANT.STORAGE_KEY.LANGUAGE
              ) as string
            } else if (item.value && item.value !== '') {
              state.settings.language = item.value
            }
            if (i18n.isInitialized) {
              void i18n.changeLanguage(state.settings.language)
            }
            break
          case 'url':
            if (item.value && item.value !== '') state.settings.url = item.value
            break
        }
      })
    },
    setMenu: (
      state: WritableDraft<AppState>,
      action: PayloadAction<{ [key: string]: MenuItem[] }>
    ) => {
      state.menu = { ...state.menu, ...action.payload }
    },
    changeLanguage: (state: WritableDraft<AppState>, action: PayloadAction<string>) => {
      localStorage.setItem(CONSTANT.STORAGE_KEY.LANGUAGE, action.payload)
      void i18n.changeLanguage(action.payload)
      state.settings.language = action.payload
    },
    enqueueMessage(
      state: WritableDraft<AppState>,
      action: PayloadAction<Omit<AppMessage, 'id' | 'timestamp'>>
    ) {
      state.messages.push({ id: nanoid(), timestamp: Date.now(), ...action.payload })
    },
    dequeueMessage(state: WritableDraft<AppState>, action: PayloadAction<string>) {
      state.messages = state.messages.filter((x) => x.id !== action.payload)
    },
    clearMessages(state: WritableDraft<AppState>) {
      state.messages = []
    },
    // setAutoDismiss(state, action: PayloadAction<number>) {
    //   state.autoDismissMs = action.payload
    // },
    loading: (state: WritableDraft<AppState>) => {
      state.isLoading = true
    },
    loadComplete: (state: WritableDraft<AppState>) => {
      state.isLoading = false
    },
    setAccessToken: (state: WritableDraft<AppState>, action: PayloadAction<string>) => {
      if (action.payload === '') {
        localStorage.removeItem(CONSTANT.STORAGE_KEY.ACCESS_TOKEN)
      } else {
        localStorage.setItem(CONSTANT.STORAGE_KEY.ACCESS_TOKEN, action.payload)
      }
      state.accessToken = action.payload
    },
  },
})

export const selectAppName = (state: RootState) => state.app.settings.name
export const selectAppSettings = (state: RootState) => state.app.settings
export const selectMenu = (state: RootState) => state.app.menu
export const selectLanguage = (state: RootState) => state.app.settings.language
export const selectIsLoading = (state: RootState) => state.app.isLoading
export const selectAccessToken = (state: RootState) => state.app.accessToken
export const selectAppType = (state: RootState) => state.app.settings.type
export const selectMessages = (state: RootState) => state.app.messages
export const {
  initState,
  setMenu,
  enqueueMessage,
  changeLanguage,
  dequeueMessage,
  loading,
  loadComplete,
  setAccessToken,
} = appSlice.actions
export default appSlice.reducer
