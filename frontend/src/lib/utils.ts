import { type ClassValue, clsx } from 'clsx'
import i18next from 'i18next'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Retrieves the value of an environment variable.
 *
 * @param {string} key - The name of the environment variable to retrieve.
 * @returns {string|number} The value of the specified environment variable.
 */
export const getEnv = (key: string): string | number | boolean => {
  return import.meta.env[key]
}

/**
 * Retrieves a localized message based on the provided message key and optional
 * arguments.
 *
 * This function uses the i18next library to fetch a translated string corresponding
 * to the given message key. If the translated message contains placeholders, they can
 * be dynamically replaced with the provided arguments.
 *
 * @param {string} msgKey - The key used to fetch the localized message.
 * @param {string[] | number[]} [args=[]] - An optional array of arguments to
 * replace placeholders in the localized message.
 * @returns {string} The localized message with arguments replaced if provided.
 */
export const getLocalMessage = (
  msgKey: string,
  args: string[] | number[] = []
): string => {
  let msg: string = i18next.t(msgKey)

  args.forEach((arg: string | number) => {
    msg = msg.replace('{}', arg.toString())
  })

  return msg
}

export const setUrlId = (
  url: string,
  id: number | string,
  param?: number | string
): string => {
  if (param) {
    return url.replace(':id', `${id}/?${param}`)
  }
  return url.replace(':id', id.toString())
}
