import { CONSTANT } from '@/common/constants'

/**
 * Retrieves the value of an environment variable.
 *
 * @param {string} key - The name of the environment variable to retrieve.
 * @returns {string|number|boolean} The value of the specified environment variable.
 */
export const getEnv = (key: string): string | number | boolean => {
  const value = import.meta.env[key]

  if (typeof value === 'string' && /^\d+$/.test(value)) {
    return Number(value)
  } else if (value === 'True') {
    return true
  } else if (value === 'False') {
    return false
  } else {
    return value
  }
}

/**
 * Retrieves the admin path for the application.
 *
 * This function determines the admin path by first attempting to fetch the value
 * from the environment variable `UI_ADMIN_PATH`. If the environment variable is not set,
 * it falls back to a predefined constant value `CONSTANT.ROUTE_URL.ADMIN`.
 *
 * @returns {string} The admin path derived either from the environment variable or the fallback constant.
 */
export const getAdminPath = (): string => {
  return (getEnv('UI_ADMIN_PATH') as string) || CONSTANT.ROUTE_URL.ADMIN
}

/**
 * Retrieves the primary language code of the user's browser or UI settings.
 *
 * This function attempts to determine the user's preferred language by:
 * 1. Using the `navigator.language` property.
 * 2. Falling back to the first element in the `navigator.languages` array if available.
 * 3. Attempting to retrieve the language from an environment variable called `UI_LANGUAGE` as a last resort.
 *
 * The returned value is the main language code (e.g., "en" for English or "ja" for Japanese), excluding any regional or country-specific subtags.
 *
 * @returns {string} The primary language code of the user's browser or UI settings.
 */
export const getBrowserLanguage = (): string => {
  const lang =
    navigator.language || navigator.languages?.[0] || (getEnv('UI_LANGUAGE') as string)

  return lang.split('-')[0] // ja-JP → ja
}

export const toCamelCase = (str: string): string =>
  str.replace(/_./g, (x) => x[1].toUpperCase())

export const toSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (x) => `_${x.toLowerCase()}`)

export const getValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}
