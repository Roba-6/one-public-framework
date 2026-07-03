import type { DataColumn } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const detailColumns: DataColumn[] = [
  {
    key: 'name',
    name: getLocalMessage('labels.feature.name'),
    type: 'title',
  },
  {
    key: 'description',
    name: getLocalMessage('labels.feature.description'),
    type: 'markdown',
  },
  {
    key: 'key',
    name: getLocalMessage('labels.key'),
  },
  {
    key: 'isEnabled',
    name: getLocalMessage('labels.enabled'),
    type: 'booleanIcon',
    values: ['CircleCheck', 'Ban'],
    colors: ['text-[var(--color-ring)]', 'text-[var(--color-disabled-foreground)]'],
  },
  {
    key: 'requiresAuth',
    name: getLocalMessage('labels.requiresAuth'),
    type: 'booleanIcon',
    values: ['CircleCheck', 'Ban'],
    colors: ['text-[var(--color-ring)]', 'text-[var(--color-disabled-foreground)]'],
  },
  {
    key: 'createdAt',
    name: getLocalMessage('labels.createdAt'),
    type: 'datetime',
  },
  { key: 'updatedAt', name: getLocalMessage('labels.updatedAt'), type: 'datetime' },
]
