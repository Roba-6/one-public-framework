import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import qs from 'qs'

const axiosInstance: AxiosInstance = axios.create()

// axiosInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     // Attach tokens as needed (e.g., set Authorization headers)
//     const token = store.getState().app.accessToken
//     if (token) {
//       config.headers.authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error: any): Promise<never> => {
//     console.error('[API REQUEST ERROR]', error)
//     return Promise.reject(error)
//   }
// )

export const getApi = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<object> =>
  axiosInstance.get(url, {
    params: data,
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    ...config,
  })

export const deleteApi = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<object> => axiosInstance.delete(url, { data, ...config })

export const postApi = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<object> => axiosInstance.post(url, data, config)

export const putApi = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<object> => axiosInstance.put(url, data, config)

export const patchApi = (
  url: string,
  data?: object,
  config?: AxiosRequestConfig
): Promise<object> => axiosInstance.patch(url, data, config)
