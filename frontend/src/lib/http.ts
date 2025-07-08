import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import qs from 'qs'

import { CONSTANT } from '@/common/constants'
import type { CommonResponse, ResponseData } from '@/common/types/response'
import { getEnv } from '@/lib/utils'
import { store } from '@/store'

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
    // エラーハンドラー
    console.error('[API RESPONSE ERROR]', error)

    const status: number | undefined = error.response?.status
    // const data: unknown = error.response?.data
    // const type: 'message' | 'notification' = 'message'

    switch (status) {
      case 401:
        // if (error.request.responseURL.includes(CONSTANT.URL_API_CMN_LGN_03)) {
        //   store.dispatch(clearAccessToken())
        // } else if (['E4010101', 'E4010005', 'E4010007'].indexOf(data.code) >= 0) {
        //   data.code = 'E4010101'
        //   store.dispatch(clearAccessToken())
        // } else if (data.code === 'E4010006') {
        //   await postApi(CONSTANT.URL_API_CMN_LGN_03).then((res) => {
        //     store.dispatch(setAccessToken(res.accessToken))
        //   })
        //   return axiosInstance.request(error.config)
        // } else {
        //   data.code = 'E0000000'
        // }
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

export const getApi = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<CommonResponse> =>
  axiosInstance.get(url, {
    params: data,
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    ...config,
  })

export const deleteApi = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<ResponseData> => axiosInstance.delete(url, { data, ...config })

export const postApi = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<ResponseData> => axiosInstance.post(url, data, config)

export const putApi = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<ResponseData> => axiosInstance.put(url, data, config)

export const patchApi = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<ResponseData> => axiosInstance.patch(url, data, config)
