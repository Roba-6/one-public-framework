import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import qs from 'qs'

import { setAccessToken } from '@/common/app-slice.ts'
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
  failedQueue.forEach((prom) => {
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
          if (!isRefreshing) {
            isRefreshing = true
            try {
              const res: Token = await getApi<Token>('/auth/refresh')
              store.dispatch(setAccessToken(res.accessToken))
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

          // Add to pending queue (to be retried after refresh completes)
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: () => {
                if (error.config) {
                  resolve(axiosInstance.request(error.config))
                }
              },
              reject: (err) => reject(err),
            })
          })
        }
        break
      case 500:
        // data.code = 'E5000000'
        break
    }

    // if (type === 'message') {
    //   popMessage(data.code)
    // } else {
    //   // TODO: system notification
    // }

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
