import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import i18n from 'i18next'
import Cookies from 'js-cookie'

import { CONSTANT } from '@/src/common/constants'
// import type { WritableDraft } from 'immer'
// import type { Location } from 'react-router'
// import { getValueFromObjectArray } from '@/lib/utils'
import type { RootState } from '@/src/common/store'
import type { Configuration } from '@/src/common/types/configuration'
import type { Menu } from '@/src/common/types/data'
import type { Message } from '@/src/common/types/response'
import { getBrowserLanguage, getEnv } from '@/src/lib/utils'
// import menu from '@/templates/menu'

export type AppType = 'cms' | 'admin'

export interface Setting {
  name: string
  language: string
  url: string
  ga4Id: string
  api: string
  type: any
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

export interface Bread {
  url: string
  name: string
}

/**
 * Interface of Application Status.
 */
export interface AppState {
  settings: Setting
  menu: Menu
  accessToken: string
  breadcrumb: Bread[]
  messages: AppMessage[]
  isLoading: boolean
  // Current Page URL
  location: Location | null
}

const initialState: AppState = {
  settings: {
    type: getEnv('UI_TYPE') as AppType,
    name: getEnv('UI_NAME') as string,
    //   // language: (localStorage.getItem(CONSTANT.STORAGE_KEY.LANGUAGE) ||
    //   //   getBrowserLanguage()) as string,
    language: getBrowserLanguage() as string,
    url: getEnv('UI_URL') as string,
    api: getEnv('UI_API') as string,
    ga4Id: '',
  },
  menu: {},
  accessToken: '',
  breadcrumb: [],
  messages: [],
  isLoading: true,
  location: null,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppType: (state: AppState, action: PayloadAction<AppType>) => {
      state.settings.type = action.payload
    },
    /**
     * Initializes the application state by setting the language configuration.
     *
     * This function retrieves the language preference from local storage and
     * updates the application's state accordingly. It also triggers a change in the
     * language for the i18n instance to ensure proper localization.
     *
     * @param {AppState} state - The current application state object to be updated.
     * @param {PayloadAction<Configuration[]>} action - An action containing the configuration data to initialize the state.
     */
    initState: (state: AppState, action: PayloadAction<Configuration[]>) => {
      action.payload.forEach((item: Configuration) => {
        switch (item.key) {
          case 'app_name':
            if (item.value && item.value !== '') state.settings.name = item.value
            break
          case 'language':
            // if (localStorage.getItem(CONSTANT.STORAGE_KEY.LANGUAGE)) {
            //   state.settings.language = localStorage.getItem(
            //     CONSTANT.STORAGE_KEY.LANGUAGE
            //   ) as string
            // } else
            if (item.value && item.value !== '') {
              state.settings.language = item.value
            } else {
              state.settings.language = getBrowserLanguage()
            }
            if (i18n.isInitialized) {
              void i18n.changeLanguage(state.settings.language)
            }
            break
          case 'url':
            if (item.value && item.value !== '') state.settings.url = item.value
            break
          case 'ga4_id':
            if (item.value && item.value !== '') state.settings.ga4Id = item.value
            break
        }
      })
    },
    setMenu: (state: AppState, action: PayloadAction<Menu>) => {
      state.menu = { ...state.menu, ...action.payload }
    },
    toggleMenu: (state: AppState, action: PayloadAction<string>) => {
      console.log(!state.menu[action.payload].isOpened)
      state.menu[action.payload].isOpened = !state.menu[action.payload].isOpened
    },
    openMenu: (state: AppState, action: PayloadAction<string>) => {
      state.menu[action.payload].isOpened = true
    },
    changeLanguage: (state: AppState, action: PayloadAction<string>) => {
      // localStorage.setItem(CONSTANT.STORAGE_KEY.LANGUAGE, action.payload)
      void i18n.changeLanguage(action.payload)
      state.settings.language = action.payload
    },
    enqueueMessage(
      state: AppState,
      action: PayloadAction<Omit<AppMessage, 'id' | 'timestamp'>>
    ) {
      state.messages.push({ id: nanoid(), timestamp: Date.now(), ...action.payload })
    },
    dequeueMessage(state: AppState, action: PayloadAction<string>) {
      state.messages = state.messages.filter((x) => x.id !== action.payload)
    },
    clearMessages(state: AppState) {
      state.messages = []
    },
    // setAutoDismiss(state, action: PayloadAction<number>) {
    //   state.autoDismissMs = action.payload
    // },
    loading: (state: AppState) => {
      state.isLoading = true
    },
    loadComplete: (state: AppState) => {
      state.isLoading = false
    },
    setAccessToken: (state: AppState, action: PayloadAction<string>) => {
      if (action.payload === '') {
        Cookies.remove(CONSTANT.STORAGE_KEY.ACCESS_TOKEN)
      } else {
        Cookies.set(CONSTANT.STORAGE_KEY.ACCESS_TOKEN, action.payload)
      }
      state.accessToken = action.payload
    },
    // setLocation: (state: WritableDraft<AppState>, action: PayloadAction<Location>) => {
    //   let temp = action.payload.pathname
    //   const breadPath: string[] = []
    //   const bread: Bread[] = []
    //
    //   while (temp.lastIndexOf('/') >= 0) {
    //     breadPath.unshift(temp)
    //     temp = temp.substring(0, temp.lastIndexOf('/'))
    //   }
    //   breadPath.forEach((item: string) => {
    //     const menu = JSON.parse(JSON.stringify(state.menu))
    //     Object.entries(menu).forEach(([_, value]: [string, any]) => {
    //       const b = getValueFromObjectArray(value.items, item, 'url') as Bread
    //       if (b) {
    //         bread.push(b)
    //       }
    //     })
    //   })
    //
    //   state.breadcrumb = bread
    //   state.location = action.payload
    // },
  },
})

export const selectAppName = (state: RootState) => state.app.settings.name
export const selectAppSettings = (state: RootState) => state.app.settings
export const selectMenu = (state: RootState) => state.app.menu
export const selectLanguage = (state: RootState) => state.app.settings.language
export const selectBreadcrumb = (state: RootState) => state.app.breadcrumb
export const selectIsLoading = (state: RootState) => state.app.isLoading
export const selectAccessToken = (state: RootState) => state.app.accessToken
export const selectAppType = (state: RootState) => state.app.settings.type
export const selectMessages = (state: RootState) => state.app.messages
export const selectLocation = (state: RootState) => state.app.location
export const {
  setAppType,
  initState,
  setMenu,
  toggleMenu,
  openMenu,
  enqueueMessage,
  changeLanguage,
  dequeueMessage,
  loading,
  loadComplete,
  setAccessToken,
  // setLocation,
} = appSlice.actions
export default appSlice.reducer
