import { z } from 'zod/v4'

import type { FormFieldItem } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const newFeatureItems: FormFieldItem[] = [
  {
    name: 'name',
    label: getLocalMessage('labels.feature.name'),
    type: 'text',
    placeholder: 'ABC-MNO-P-XYZ',
    defaultValue: '',
    validate: z
      .string()
      .min(1, { message: getLocalMessage('Feature name is required') }),
  },
  {
    name: 'description',
    label: getLocalMessage('labels.feature.description'),
    type: 'textarea',
    defaultValue: '',
    validate: z
      .string()
      .min(1, { message: getLocalMessage('Description is required') }),
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
