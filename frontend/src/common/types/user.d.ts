interface UserBase {
  id?: string
  fullname: string
  email: string
  loginFailedTimes: number
}

export type User = UserBase
