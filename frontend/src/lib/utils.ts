import { type ClassValue, clsx } from 'clsx'
import i18next from 'i18next'
import qs from 'qs'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod/v4'

import { CONSTANT } from '@/common/constants'

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

export const getAdminPath = (): string => {
  return (getEnv('UI_ADMIN_PATH') as string) || CONSTANT.ROUTE_URL.ADMIN
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

export const arrayToObject = (arr: any[], key: string, value: string): any => {
  return arr.reduce((result: Record<string, any>, item: Record<string, any>) => {
    result[item[key] as string] = item[value]
    return result
  }, {})
}

export const getValueFromObjectArray = (
  array: any[],
  value: string,
  key: string = 'id'
): any => array.filter((element) => element[key] === value)[0]

/**
 * Copies the provided text to the system clipboard.
 *
 * @param {string} text - The text string to be copied to the clipboard.
 * @returns {void}
 */
export const copyToClipboard = (text: string): void => {
  console.debug('Copying text to clipboard:', text)
  void navigator.clipboard.writeText(text)
}

/**
 * Generates a schema object for form validation based on the provided form items.
 *
 * @param {any[]} formItems - An array of form items where each item may optionally
 * include a `validate` property.
 * @returns {{ [key: string]: z.ZodString }} An object containing validation
 * schemas, where the keys are the names of the form items and the values are their
 * respective validation rules (Zod string validators).
 */
export const createFormSchema = (formItems: any[]): { [key: string]: z.ZodString } => {
  const rst: { [key: string]: z.ZodString } = {}
  formItems.forEach((item) => {
    if ('validate' in item) {
      rst[item.name] = item.validate
    }
  })

  return rst
}
