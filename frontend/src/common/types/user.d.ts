interface UserBase {
  name: string
  email: string
}

export interface User extends UserBase {
  id?: string
  fullname?: string
  failedAttempts?: number
}

export type UserRequest = UserBase
