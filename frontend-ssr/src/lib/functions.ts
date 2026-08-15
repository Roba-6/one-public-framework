import { CONSTANT } from '@/src/common/constants'
import { getEnv } from '@/src/lib/utils'

export const getAdminPath = (): string => {
  return (getEnv('UI_ADMIN_PATH') as string) || CONSTANT.ROUTE_URL.ADMIN
}
