import { z } from 'zod/v4'

import type { FormFieldItem } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const newCategoryItems: FormFieldItem[] = [
  {
    name: 'name',
    label: getLocalMessage('labels.category.name'),
    type: 'text',
    placeholder: getLocalMessage('placeholder.categories.name'),
    defaultValue: '',
    validate: z
      .string()
      .min(1, { message: getLocalMessage('messages.validations.category.name') })
      .max(100, { message: getLocalMessage('messages.validations.max', [100]) }),
  },
  {
    name: 'value',
    label: getLocalMessage('labels.category.value'),
    type: 'text',
    placeholder: getLocalMessage('placeholder.categories.value'),
    defaultValue: '',
    validate: z
      .string()
      .max(100, { message: getLocalMessage('messages.validations.max', [100]) }),
  },
  {
    name: 'alias',
    label: getLocalMessage('labels.category.alias'),
    type: 'text',
    placeholder: getLocalMessage('placeholder.categories.alias'),
    defaultValue: '',
    validate: z
      .string()
      .max(100, { message: getLocalMessage('messages.validations.max', [100]) }),
  },
  {
    name: 'categoryId',
    label: getLocalMessage('labels.category.parentCategory'),
    type: 'select',
    placeholder: getLocalMessage('placeholder.categories.parentCategoryId'),
    defaultValue: '',
    options: [],
  },
  {
    name: 'description',
    label: getLocalMessage('labels.category.description'),
    type: 'textarea',
    placeholder: getLocalMessage('placeholder.description'),
    className: 'min-h-30',
    defaultValue: '',
    validate: z
      .string()
      .max(1000, { message: getLocalMessage('messages.validations.max', [1000]) }),
  },
  {
    name: 'options',
    label: getLocalMessage('labels.options'),
    type: 'textarea',
    placeholder: getLocalMessage('placeholder.options'),
    className: 'min-h-30',
    defaultValue: '',
    validate: z
      .string()
      .max(1000, { message: getLocalMessage('messages.validations.max', [1000]) }),
  },
  {
    name: 'isEnabled',
    label: getLocalMessage('labels.enabled'),
    type: 'switch',
    defaultValue: true,
    validate: z.boolean(),
  },
]

export const categoryItems: FormFieldItem[] = newCategoryItems
