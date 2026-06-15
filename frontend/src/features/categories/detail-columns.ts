import type { DataColumn } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const detailColumns: DataColumn[] = [
  {
    key: 'name',
    name: getLocalMessage('labels.category.name'),
    type: 'title',
  },
  {
    key: 'description',
    name: getLocalMessage('labels.category.description'),
    type: 'markdown',
  },
  {
    key: 'options',
    name: getLocalMessage('labels.options'),
    type: 'json',
  },
  {
    key: 'value',
    name: getLocalMessage('labels.category.value'),
  },
  {
    key: 'alias',
    name: getLocalMessage('labels.category.alias'),
  },
  {
    key: 'parent.name',
    name: getLocalMessage('labels.category.parent'),
  },
  {
    key: 'isEnabled',
    name: getLocalMessage('labels.enabled'),
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
