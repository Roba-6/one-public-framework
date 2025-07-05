import type { Token } from '~/common/types/authenticate'

export interface Message {
  code: string | null
  message: string
  detail: object | null
}

export interface CommonResponse {
  results: object[] | null
  count: number | null
  detail: Message[] | null
}

export type ResponseData = Token
