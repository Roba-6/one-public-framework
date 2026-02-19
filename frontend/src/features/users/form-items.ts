import { z } from 'zod/v4'

import type { FormFieldItem } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const newUserItems: FormFieldItem[] = [
  {
    name: 'name',
    label: getLocalMessage('labels.user.name'),
    type: 'text',
    placeholder: 'yamada_taro',
    autoComplete: 'username',
    defaultValue: '',
    validate: z.string().min(1, { message: getLocalMessage('Username is required') }),
  },
  {
    name: 'password',
    label: getLocalMessage('labels.user.password'),
    type: 'password',
    autoComplete: 'new-password',
    defaultValue: '',
    validate: z.string().min(1, { message: getLocalMessage('Password is required') }),
  },
  {
    name: 'email',
    label: getLocalMessage('labels.user.email'),
    type: 'text',
    placeholder: 'test@test.com',
    defaultValue: '',
    validate: z.string().min(1, { message: getLocalMessage('Email is required') }),
  },
  {
    name: 'lastname',
    label: getLocalMessage('labels.user.lastname'),
    type: 'text',
    placeholder: 'Yamada',
    defaultValue: '',
    validate: z.string().min(1, { message: getLocalMessage('lastname is required') }),
  },
  {
    name: 'firstname',
    label: getLocalMessage('labels.user.firstname'),
    type: 'text',
    placeholder: 'Taro',
    defaultValue: '',
    validate: z.string().min(1, { message: getLocalMessage('firstname is required') }),
  },
  {
    name: 'nickname',
    label: getLocalMessage('labels.user.nickname'),
    type: 'text',
    placeholder: 'yama',
    defaultValue: '',
    validate: z.string().min(1, { message: getLocalMessage('nickname is required') }),
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
    validate: z.string().min(1, { message: getLocalMessage('Username is required') }),
  },
  {
    name: 'password',
    label: getLocalMessage('labels.user.password'),
    type: 'password',
    autoComplete: 'new-password',
    defaultValue: '',
    validate: z.string().min(1, { message: getLocalMessage('Password is required') }),
  },
  {
    name: 'email',
    label: getLocalMessage('labels.user.email'),
    type: 'text',
    placeholder: 'test@test.com',
    defaultValue: '',
    validate: z.string().min(1, { message: getLocalMessage('Email is required') }),
  },
  {
    name: 'lastname',
    label: getLocalMessage('labels.user.lastname'),
    type: 'text',
    placeholder: 'Yamada',
    defaultValue: '',
    validate: z.string().min(1, { message: getLocalMessage('lastname is required') }),
  },
  {
    name: 'firstname',
    label: getLocalMessage('labels.user.firstname'),
    type: 'text',
    placeholder: 'Yamada',
    defaultValue: '',
    validate: z.string().min(1, { message: getLocalMessage('firstname is required') }),
  },
  {
    name: 'nickname',
    label: getLocalMessage('labels.user.nickname'),
    type: 'text',
    placeholder: 'Yamada',
    defaultValue: '',
    validate: z.string().min(1, { message: getLocalMessage('nickname is required') }),
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
