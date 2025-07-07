import type { Token } from '@/types/authenticate'
import type { Configuration } from '@/types/configuration'

export interface Message {
  code: string | null
  message: string
  detail: object | null
}

export type Results = Configuration[]

export interface CommonResponse {
  results: Results | null
  count: number | null
  detail: Message[] | null
}

export type ResponseData = Token
