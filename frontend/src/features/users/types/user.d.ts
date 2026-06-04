interface UserBase {
  username: string
  email: string
  lastName?: string
  firstName?: string
  nickname?: string
}

export interface User extends UserBase {
  id?: string
  fullName?: string
  failedAttempts?: number
  isEnabled?: boolean
  isLocked?: boolean
}

export type CreateUserRequest = UserBase
export type UpdateUserRequest = UserBase
