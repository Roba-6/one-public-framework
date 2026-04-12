import { z } from 'zod/v4'

import type { FormFieldItem } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const newUserItems: FormFieldItem[] = [
  {
    name: 'name',
    label: getLocalMessage('labels.user.name'),
    type: 'text',
    placeholder: getLocalMessage('placeholder.username'),
    autoComplete: 'username',
    defaultValue: '',
    validate: z
      .string()
      .min(3, { message: getLocalMessage('messages.validations.min', [3]) })
      .max(55, { message: getLocalMessage('messages.validations.max', [55]) }),
  },
  {
    name: 'password',
    label: getLocalMessage('labels.user.password'),
    type: 'password',
    autoComplete: 'new-password',
    defaultValue: '',
    validate: z
      .string()
      .min(1, { message: getLocalMessage('messages.validations.password.required') }),
  },
  {
    name: 'email',
    label: getLocalMessage('labels.user.email'),
    type: 'text',
    placeholder: getLocalMessage('placeholder.email'),
    defaultValue: '',
    validate: z
      .email({
        message: getLocalMessage('messages.validations.email.format'),
      })
      .max(128, { message: getLocalMessage('messages.validations.max', [128]) }),
  },
  {
    name: 'lastname',
    label: getLocalMessage('labels.user.lastname'),
    type: 'text',
    placeholder: getLocalMessage('placeholder.lastname'),
    defaultValue: '',
  },
  {
    name: 'firstname',
    label: getLocalMessage('labels.user.firstname'),
    type: 'text',
    placeholder: getLocalMessage('placeholder.firstname'),
    defaultValue: '',
  },
  {
    name: 'nickname',
    label: getLocalMessage('labels.user.nickname'),
    type: 'text',
    placeholder: getLocalMessage('placeholder.nickname'),
    defaultValue: '',
    // validate: z.string().min(1, { message: getLocalMessage('nickname is required') }),
  },
]

export const userItems: FormFieldItem[] = [
  {
    name: 'name',
    label: getLocalMessage('labels.user.name'),
    type: 'text',
    placeholder: 'yamada_taro',
    autoComplete: 'username',
    defaultValue: '',
    validate: z
      .string()
      .min(1, { message: getLocalMessage('messages.validations.username.required') }),
  },
  {
    name: 'password',
    label: getLocalMessage('labels.user.password'),
    type: 'password',
    autoComplete: 'new-password',
    defaultValue: '',
    validate: z
      .string()
      .min(1, { message: getLocalMessage('messages.validations.password.required') }),
  },
  {
    name: 'email',
    label: getLocalMessage('labels.user.email'),
    type: 'text',
    placeholder: 'test@test.com',
    defaultValue: '',
    validate: z
      .string()
      .min(1, { message: getLocalMessage('messages.validations.email.format') }),
  },
  {
    name: 'lastname',
    label: getLocalMessage('labels.user.lastname'),
    type: 'text',
    placeholder: 'Yamada',
    defaultValue: '',
    validate: z.string().max(1, { message: getLocalMessage('lastname is required') }),
  },
  {
    name: 'firstname',
    label: getLocalMessage('labels.user.firstname'),
    type: 'text',
    placeholder: 'Yamada',
    defaultValue: '',
  },
  {
    name: 'nickname',
    label: getLocalMessage('labels.user.nickname'),
    type: 'text',
    placeholder: 'Yamada',
    defaultValue: '',
  },
  {
    name: 'isEnabled',
    label: getLocalMessage('labels.enabled'),
    type: 'switch',
    defaultValue: true,
    validate: z.boolean(),
  },
  {
    name: 'isLocked',
    label: getLocalMessage('labels.user.lock'),
    type: 'switch',
    defaultValue: false,
    validate: z.boolean(),
  },
]
