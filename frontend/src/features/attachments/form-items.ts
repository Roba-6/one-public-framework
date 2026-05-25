import { z } from 'zod/v4'

import type { FormFieldItem } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const newAttachmentItems: FormFieldItem[] = [
  {
    name: 'name',
    label: getLocalMessage('labels.feature.name'),
    type: 'text',
    placeholder: getLocalMessage('placeholder.name'),
    defaultValue: '',
  },
  {
    name: 'description',
    label: getLocalMessage('labels.feature.description'),
    type: 'textarea',
    placeholder: getLocalMessage('placeholder.description'),
    className: 'min-h-30',
  },
  {
    name: 'requiresAuth',
    label: getLocalMessage('labels.requiresAuth'),
    type: 'switch',
    defaultValue: true,
    validate: z.boolean(),
  },
]

export const attachmentItems: FormFieldItem[] = newAttachmentItems
