import { z } from 'zod/v4'

import { getLocalMessage } from '@/lib/utils'

export const LoginFormSchema = z.object({
  username: z.string().min(1, { message: getLocalMessage('Username is required') }),
  password: z.string().min(1, { message: getLocalMessage('Password is required') }),
})

export interface Login {
  username: string
  password: string
  rememberMe?: boolean
}

export type LoginRequest = Login

export interface Token {
  accessToken: string
  tokenType: string
}
