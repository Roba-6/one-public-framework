import { z } from 'zod/v4'

import { getLocalMessage } from '@/lib/utils'

export const formItems = [
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
]
