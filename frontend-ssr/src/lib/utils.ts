import { type ClassValue, clsx } from 'clsx'
import dayjs from 'dayjs'
import Cookies from 'js-cookie'
import qs from 'qs'
import { twMerge } from 'tailwind-merge'

import { CONSTANT } from '@/src/common/constants'
import type { DatetimeType } from '@/src/common/types/data'
import { getLocalMessage } from '@/src/lib/client-utils'

/**
 * Combines multiple class name values into a single string, merging Tailwind CSS
 * classes where applicable to reduce redundancy and ensure proper application of
 * styles.
 *
 * @param {...ClassValue[]} inputs - A variadic list of class values which can be
 * strings, arrays, or objects representing conditionally applied class names.
 *
 * @returns {string} A single string of concatenated and merged class names.
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

/**
 * Retrieves the value of an environment variable and attempts to interpret its type.
 *
 * If the value is a numeric string, it will be converted to a number.
 * If the value is a case-sensitive string "True", it will be converted to a boolean
 * `true`.
 * If the value is a case-sensitive string "False", it will be converted to a boolean
 * `false`.
 * Otherwise, the raw string value or `undefined` will be returned as-is.
 *
 * @param {string} key - The name of the environment variable to retrieve.
 *
 * @returns {string | number | boolean | undefined} The parsed value of the environment
 * variable.
 */
export const getEnv = (key: string): string | number | boolean | undefined => {
  const value = process.env[key]

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
 * Retrieves the preferred language of the user's browser or environment.
 *
 * This function checks for the user's language preference in the following order:
 * 1. `navigator.language` - The primary language setting of the browser.
 * 2. `navigator.languages[0]` - The first language in the list of browser-supported
 *    languages (if available).
 * 3. A fallback environment variable `UI_LANGUAGE`, if explicitly provided.
 *
 * The language code returned is simplified to its base form,
 * extracting only the language subtag (e.g., "ja-JP" becomes "ja").
 *
 * @returns {string} The base language code as a string; for example, "ja", "en".
 */
export const getBrowserLanguage = (): string => {
  if (typeof navigator === 'undefined') {
    return (getEnv('UI_LANGUAGE') as string | undefined)?.split('-')[0] ?? 'en'
  }

  const lang =
    navigator.language || navigator.languages?.[0] || (getEnv('UI_LANGUAGE') as string)

  return lang.split('-')[0] // ja-JP → ja
}

export const getAdminPath = (): string => {
  return ((getEnv('UI_ADMIN_PATH') as string) || CONSTANT.ROUTE_URL.ADMIN) + '123'
}

export const formatDay = (
  datetimeStr: string,
  type: DatetimeType = 'datetime'
): string => dayjs(datetimeStr).format(getLocalMessage(`format.${type}`))

export const formatNumber = (
  num: string | number,
  locale = getBrowserLanguage()
): string => new Intl.NumberFormat(locale).format(parseFloat(num.toString()))

export const setDownloadUrl = (url: string): string => {
  return url + `?token=${Cookies.get(CONSTANT.STORAGE_KEY.ACCESS_TOKEN)}`
}

export const copyToClipboard = (text: string): void => {
  console.debug('Copying text to clipboard:', text)
  void navigator.clipboard.writeText(text)
}

export const setUrlParams = (
  url: string,
  id?: number | string,
  params?: object
): string => {
  let rst = url
  if (id) {
    rst = rst.replace(':id', id.toString())
  }
  if (params) {
    const queryParams = qs.stringify(params)
    rst = `${rst}?${queryParams}`
  }
  return rst
}

export const toCamelCase = (str: string): string =>
  str.replace(/_./g, (x) => x[1].toUpperCase())

export const toSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (x) => `_${x.toLowerCase()}`)

export const getValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}
