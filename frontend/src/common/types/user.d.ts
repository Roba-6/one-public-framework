interface UserBase {
  id?: string
  fullname: string
  email: string
  failedAttempts: number
}

export type User = UserBase
