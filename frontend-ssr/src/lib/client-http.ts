'use client'

import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import Cookies from 'js-cookie'
import qs from 'qs'

import { enqueueMessage, setAccessToken } from '@/src/common/app-slice'
import { CONSTANT } from '@/src/common/constants'
import { store } from '@/src/common/store'
import type { Token } from '@/src/common/types/authenticate'
import type {
  CommonResponse,
  FailedQueueItem,
  Message,
  ResponseData,
  ResponseError,
} from '@/src/common/types/response'
import { getEnv } from '@/src/lib/utils'

// Track whether a refresh operation is in progress
let isRefreshing: boolean = false
// Queue of pending requests
let failedQueue: Array<FailedQueueItem> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom: FailedQueueItem): void => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: (getEnv('UI_API') as string) || 'http://localhost:8000',
  headers: {
    [CONSTANT.HTTP_CONTENT_TYPE_KEY]: CONSTANT.HTTP_CONTENT_TYPE_JSON,
  },
  timeout: CONSTANT.HTTP_TIMEOUT,
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach access tokens
    console.debug('AAA', store.getState().app.accessToken)
    // config.headers.authorization = `Bearer ${store.getState().app.accessToken}`
    config.headers.authorization = `Bearer ${Cookies.get(CONSTANT.STORAGE_KEY.ACCESS_TOKEN)}`
    config.headers[CONSTANT.HTTP_HEADER_LANGUAGE] =
      store.getState().app.settings.language

    return config
  },
  (error): Promise<never> => {
    console.error('[API REQUEST ERROR]', error)

    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse<CommonResponse> => response.data,
  async (error: AxiosError): Promise<never> => {
    console.error('[API RESPONSE ERROR]', error)

    const status: number | undefined = error.response?.status
    const data: ResponseError = error.response?.data as ResponseError
    const errorInfo: Message = data.detail

    switch (status) {
      case 401:
        if (errorInfo.code === 'E4010004') {
          // Add to the pending queue (to be retried after refresh completed)
          const retryOriginalRequest = new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: () => {
                if (error.config) {
                  resolve(axiosInstance.request(error.config))
                } else {
                  reject(error)
                }
              },
              reject: (err) => reject(err),
            })
          })

          if (!isRefreshing) {
            // Refresh token
            isRefreshing = true
            console.debug('[1]Refreshing token...')
            try {
              console.debug('[2]Get Token...')

              const res: Token = await getApi<Token>(CONSTANT.API_URL.REFRESH)
              store.dispatch(setAccessToken(res.accessToken))
              console.debug('[3]New Token:', res.accessToken)
              // Retry pending requests
              processQueue(null, res.accessToken)
            } catch (refreshError) {
              // Reject pending requests
              processQueue(refreshError as AxiosError, null)
              return Promise.reject(refreshError)
            } finally {
              isRefreshing = false
            }
          }

          return retryOriginalRequest as never
        }
        break
      case 500:
        break
    }

    store.dispatch(
      enqueueMessage({
        message: errorInfo,
        status: status || 500,
        type: 'error',
        sticky: true,
      })
    )

    return Promise.reject(error)
  }
)

export const getApi = <T = ResponseData>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<T> =>
  axiosInstance.get(url, {
    params: data,
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    ...config,
  }) as Promise<T>

export const deleteApi = <T = ResponseData>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<T> => axiosInstance.delete(url, { data, ...config }) as Promise<T>

export const postApi = <T = ResponseData>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<T> => axiosInstance.post(url, data, config) as Promise<T>

export const putApi = <T = ResponseData>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<T> => axiosInstance.put(url, data, config) as Promise<T>

export const patchApi = <T = ResponseData>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<T> => axiosInstance.patch(url, data, config) as Promise<T>

export const getNativeDownload = (url: string) => {
  const a = document.createElement('a')
  a.href = getEnv('UI_API') + url + `?token=${store.getState().app.accessToken}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
