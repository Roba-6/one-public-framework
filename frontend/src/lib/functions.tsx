import { CONSTANT } from '@/common/constants'

/**
 * Retrieves the value of an environment variable.
 *
 * @param {string} key - The name of the environment variable to retrieve.
 * @returns {string|number} The value of the specified environment variable.
 */
export const getEnv = (key: string): string | number | boolean => {
  return import.meta.env[key]
}

export const getAdminPath = (): string => {
  return (getEnv('UI_ADMIN_PATH') as string) || CONSTANT.ROUTE_URL.ADMIN
}
