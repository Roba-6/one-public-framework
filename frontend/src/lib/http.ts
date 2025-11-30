import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import qs from 'qs'

import { enqueueMessage, setAccessToken } from '@/common/app-slice'
import { CONSTANT } from '@/common/constants'
import type { Token } from '@/common/types/authenticate'
import type {
  CommonResponse,
  FailedQueueItem,
  Message,
  ResponseData,
  ResponseError,
} from '@/common/types/response'
import { getEnv } from '@/lib/utils'
import { store } from '@/store'

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
  baseURL: getEnv('UI_API') as string,
  headers: {
    [CONSTANT.HTTP_CONTENT_TYPE_KEY]: CONSTANT.HTTP_CONTENT_TYPE_JSON,
  },
  timeout: CONSTANT.HTTP_TIMEOUT,
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach access tokens
    config.headers.authorization = `Bearer ${store.getState().app.accessToken}`
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
        if (errorInfo.code === 'E40100004') {
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
  })

export const deleteApi = <T = ResponseData>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<T> => axiosInstance.delete(url, { data, ...config })

export const postApi = <T = ResponseData>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<T> => axiosInstance.post(url, data, config)

export const putApi = <T = ResponseData>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<T> => axiosInstance.put(url, data, config)

export const patchApi = <T = ResponseData>(
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<T> => axiosInstance.patch(url, data, config)
