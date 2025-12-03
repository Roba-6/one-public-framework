type TestType = 'name' | 'email' | 'password'

interface UserBase {
  name: string
  email: string
  lastname?: string
  firstname?: string
  nickname?: string
}

export interface User extends UserBase {
  id?: string
  fullname?: string
  failedAttempts?: number
  isDisabled?: boolean
  isLocked?: boolean
}

export type CreateUserRequest = UserBase

export type UpdateUserRequest = UserBase
