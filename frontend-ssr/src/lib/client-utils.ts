'use client'

import i18next, { i18n, type Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { z } from 'zod/v4'

import { CONSTANT } from '@/src/common/constants'

const mergeMessageTree = (
  base: Record<string, unknown>,
  custom: Record<string, unknown>
): Record<string, unknown> => {
  const merged = { ...base }
  for (const [key, value] of Object.entries(custom)) {
    const baseValue = merged[key]
    merged[key] =
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      baseValue &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue)
        ? mergeMessageTree(
            baseValue as Record<string, unknown>,
            value as Record<string, unknown>
          )
        : value
  }

  return merged
}

export const createOnePublicUII18n = (resources: Resource = {}): i18n => {
  const instance = i18next.createInstance()
  const customJa = (resources.ja?.translation ?? {}) as Record<string, unknown>
  const customEn = (resources.en?.translation ?? {}) as Record<string, unknown>
  instance.use(initReactI18next).init({
    lng: 'ja',
    fallbackLng: 'en',
    resources: {
      ...resources,
      en: { translation: mergeMessageTree(CONSTANT.LANGUAGE_RESOURCES.en, customEn) },
      ja: { translation: mergeMessageTree(CONSTANT.LANGUAGE_RESOURCES.ja, customJa) },
    },
    interpolation: { escapeValue: false },
  })

  return instance
}

export const getLocalMessage = (
  msgKey: string,
  args: string[] | number[] = []
): string => {
  let msg: string = createOnePublicUII18n().t(msgKey)

  args.forEach((arg: string | number) => {
    msg = msg.replace('{}', arg.toString())
  })

  return msg
}

export const arrayToObject = (arr: any[], key: string, value: string): any => {
  return arr.reduce((result: Record<string, any>, item: Record<string, any>) => {
    result[item[key] as string] = item[value]
    return result
  }, {})
}

export const createFormSchema = (
  formItems: any[]
): { [key: string]: z.ZodString | z.ZodAny } => {
  const rst: { [key: string]: z.ZodString | z.ZodAny } = {}
  formItems.forEach((item) => {
    if ('validate' in item) {
      rst[item.name] = item.validate
    } else {
      rst[item.name] = z.any()
    }
  })

  return rst
}
