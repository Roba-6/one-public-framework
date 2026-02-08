import type { DataColumn } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const listColumns: DataColumn[] = [
  {
    key: 'name',
    name: getLocalMessage('labels.feature.name'),
    isSortable: true,
    align: 'left',
  },
  {
    key: 'isEnabled',
    name: getLocalMessage('labels.enabled'),
    type: 'booleanIcon',
    values: ['CircleCheck', 'Ban'],
    colors: ['text-green-500 dark:text-yellow-500', 'text-orange-500'],
    align: 'center',
  },
  {
    key: 'createdAt',
    name: getLocalMessage('labels.createdAt'),
    type: 'datetime',
  },
  { key: 'updatedAt', name: getLocalMessage('labels.updatedAt'), type: 'datetime' },
  { key: 'id', name: getLocalMessage('labels.id'), type: 'badge', align: 'center' },
]
