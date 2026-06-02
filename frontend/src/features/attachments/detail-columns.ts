import type { DataColumn } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const detailColumns: DataColumn[] = [
  {
    key: 'name',
    name: getLocalMessage('labels.feature.name'),
    type: 'title',
  },
  { key: 'preview', name: 'Previewer', type: 'previewer' },
  {
    key: 'description',
    name: getLocalMessage('labels.feature.description'),
    type: 'markdown',
  },
  {
    key: 'requiresAuth',
    name: getLocalMessage('labels.requiresAuth'),
    type: 'booleanIcon',
    values: ['CircleCheck', 'Ban'],
    colors: ['text-[var(--color-green-500)]', 'text-[var(--color-gray-700)]'],
  },
  {
    key: 'createdAt',
    name: getLocalMessage('labels.createdAt'),
    type: 'datetime',
  },
  { key: 'updatedAt', name: getLocalMessage('labels.updatedAt'), type: 'datetime' },
]
