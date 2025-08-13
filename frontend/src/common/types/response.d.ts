import type { Token } from '@/common/types/authenticate'
import type { Configuration } from '@/common/types/configuration'
import type { User } from '@/common/types/user'

export interface FailedQueueItem {
  resolve: (value?: unknown) => void
  reject: (reason?: AxiosError) => void
}

export interface Message {
  code: string | null
  message: string
  detail: object | null
}

export type Results = Configuration[] | User[]

export interface ResponseError {
  detail: Message
}

export interface CommonResponse {
  results: Results | null
  count: number | null
  detail: Message[] | null
}

export type ResponseData = Token | CommonResponse
