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
