import { createSlice } from '@reduxjs/toolkit'

import { getEnv } from '~/common/utils/env'
import type { RootState } from '~/store'

export interface Configuration {
  name: string
  url: string
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
    name: getEnv('APP_NAME') as string,
    url: getEnv('APP_UI_URL') as string,
    api: getEnv('APP_API_URL') as string,
  },
  isLoading: true,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    loading: (state) => {
      state.isLoading = true
    },
    loadComplete: (state) => {
      state.isLoading = false
    },
  },
})

export const selectIsLoading = (state: RootState) => state.app.isLoading

export const { loading, loadComplete } = appSlice.actions

export default appSlice.reducer
