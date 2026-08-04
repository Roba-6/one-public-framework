import { enqueueMessage, setAccessToken } from '@/src/common/app-slice'
import { CONSTANT } from '@/src/common/constants'
import { store } from '@/src/common/store'
import type { Token } from '@/src/common/types/authenticate'
import type { Message, ResponseData, ResponseError } from '@/src/common/types/response'
// import { getEnv } from '@/src/lib/utils'

export type ApiRequestConfig = Omit<RequestInit, 'method' | 'body' | 'headers'> & {
  headers?: HeadersInit
  timeout?: number
  skipAuth?: boolean
  skipAuthRefresh?: boolean
  skipErrorMessage?: boolean
}

export class ApiError<T = ResponseError> extends Error {
  readonly status: number
  readonly data?: T
  readonly response: Response

  constructor(message: string, response: Response, data?: T) {
    super(message)
    this.name = 'ApiError'
    this.status = response.status
    this.response = response
    this.data = data
  }
}

let refreshPromise: Promise<string> | null = null

function createQueryString(data?: object): string {
  if (!data) {
    return ''
  }

  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) {
      continue
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, String(item))
      }
    } else {
      params.append(key, String(value))
    }
  }

  const query = params.toString()

  return query ? `?${query}` : ''
}

function createUrl(url: string): string {
  if (/^https?:\/\//.test(url)) {
    return url
  }

  // const baseUrl = String(getEnv('UI_API')).replace(/\/$/, '')
  const path = url.startsWith('/') ? url : `/${url}`

  console.debug('+++++:', `http://localhost:8000${path}`)
  // return `${baseUrl}${path}`
  return `http://localhost:8000${path}`
}

function createHeaders(config: ApiRequestConfig, hasBody: boolean): Headers {
  const headers = new Headers(config.headers)

  if (hasBody && !headers.has(CONSTANT.HTTP_CONTENT_TYPE_KEY)) {
    headers.set(CONSTANT.HTTP_CONTENT_TYPE_KEY, CONSTANT.HTTP_CONTENT_TYPE_JSON)
  }

  if (!config.skipAuth) {
    const state = store.getState()
    const accessToken = state.app.accessToken
    const language = state.app.settings.language

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }

    if (language) {
      headers.set(CONSTANT.HTTP_HEADER_LANGUAGE, language)
    }
  }

  return headers
}

function createSignal(
  signal: AbortSignal | null | undefined,
  timeout: number
): AbortSignal {
  const timeoutSignal = AbortSignal.timeout(timeout)

  if (!signal) {
    return timeoutSignal
  }

  return AbortSignal.any([signal, timeoutSignal])
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>
  }

  return response.text() as Promise<T>
}

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      console.debug('[1] Refreshing token...')

      const token = await requestApi<Token>(CONSTANT.API_URL.REFRESH, {
        method: 'GET',
        skipAuthRefresh: true,
        skipErrorMessage: true,
      })

      store.dispatch(setAccessToken(token.accessToken))

      console.debug('[2] Access token refreshed')

      return token.accessToken
    })().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

function enqueueApiError(status: number, errorInfo: Message): void {
  store.dispatch(
    enqueueMessage({
      message: errorInfo,
      status,
      type: 'error',
      sticky: true,
    })
  )
}

async function requestApi<T>(
  url: string,
  options: ApiRequestConfig & {
    method: string
    body?: unknown
  }
): Promise<T> {
  const {
    method,
    body,
    timeout = CONSTANT.HTTP_TIMEOUT,
    skipAuthRefresh = false,
    skipErrorMessage = false,
    ...config
  } = options

  const hasBody =
    body !== undefined && body !== null && method !== 'GET' && method !== 'HEAD'

  try {
    const response = await fetch(createUrl(url), {
      ...config,
      method,
      headers: createHeaders(config, hasBody),
      body: hasBody ? JSON.stringify(body) : undefined,
      credentials: config.credentials ?? 'include',
      signal: createSignal(config.signal, timeout),
    })

    if (response.ok) {
      return parseResponse<T>(response)
    }

    const errorData = await parseResponse<ResponseError>(response)

    const errorInfo = errorData?.detail

    if (response.status === 401 && errorInfo?.code === 'E4010004' && !skipAuthRefresh) {
      await refreshAccessToken()

      // 新しいTokenをReduxから取得して再リクエストする
      return requestApi<T>(url, {
        ...options,
        skipAuthRefresh: true,
      })
    }

    if (!skipErrorMessage && errorInfo) {
      enqueueApiError(response.status, errorInfo)
    }

    throw new ApiError(`API request failed: ${response.status}`, response, errorData)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof DOMException && error.name === 'TimeoutError') {
      console.error('[API TIMEOUT]', error)
      throw new Error('API request timed out', { cause: error })
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('[API ABORTED]', error)
      throw error
    }

    console.error('[API REQUEST ERROR]', error)
    throw error
  }
}

export function getApi<T = ResponseData>(
  url: string,
  data?: object,
  config: ApiRequestConfig = {}
): Promise<T> {
  return requestApi<T>(`${url}${createQueryString(data)}`, {
    ...config,
    method: 'GET',
  })
}

export function deleteApi<T = ResponseData>(
  url: string,
  data?: object,
  config: ApiRequestConfig = {}
): Promise<T> {
  return requestApi<T>(url, {
    ...config,
    method: 'DELETE',
    body: data,
  })
}

export function postApi<T = ResponseData>(
  url: string,
  data?: object,
  config: ApiRequestConfig = {}
): Promise<T> {
  return requestApi<T>(url, {
    ...config,
    method: 'POST',
    body: data,
  })
}

export function putApi<T = ResponseData>(
  url: string,
  data?: object,
  config: ApiRequestConfig = {}
): Promise<T> {
  return requestApi<T>(url, {
    ...config,
    method: 'PUT',
    body: data,
  })
}

export function patchApi<T = ResponseData>(
  url: string,
  data?: object,
  config: ApiRequestConfig = {}
): Promise<T> {
  return requestApi<T>(url, {
    ...config,
    method: 'PATCH',
    body: data,
  })
}
