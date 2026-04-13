import { z } from 'zod/v4'

import type { FormFieldItem } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const newFeatureItems: FormFieldItem[] = [
  {
    name: 'name',
    label: getLocalMessage('labels.feature.name'),
    type: 'text',
    placeholder: getLocalMessage('placeholder.features.name'),
    defaultValue: '',
    validate: z
      .string()
      .length(13, { message: getLocalMessage('messages.validations.length', [13]) }),
  },
  {
    name: 'description',
    label: getLocalMessage('labels.feature.description'),
    type: 'textarea',
    placeholder: getLocalMessage('placeholder.description'),
  },
  {
    name: 'isEnabled',
    label: getLocalMessage('labels.enabled'),
    type: 'switch',
    defaultValue: true,
    validate: z.boolean(),
  },
  {
    name: 'requiresAuth',
    label: getLocalMessage('labels.requiresAuth'),
    type: 'switch',
    defaultValue: true,
    validate: z.boolean(),
  },
]

export const featureItems: FormFieldItem[] = newFeatureItems
