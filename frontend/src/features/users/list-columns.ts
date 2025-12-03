import type { DataColumn } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const listColumns: DataColumn[] = [
  {
    key: 'name',
    name: getLocalMessage('labels.user.name'),
    isSortable: true,
    align: 'left',
  },
  { key: 'nickname', name: getLocalMessage('labels.user.nickname') },
  { key: 'fullname', name: getLocalMessage('labels.user.fullname') },
  { key: 'email', name: getLocalMessage('labels.user.email') },
  {
    key: 'isDisabled',
    name: getLocalMessage('labels.user.enabled'),
    type: 'booleanIcon',
    values: ['UserRoundX', 'UserRoundCheck'],
    colors: ['text-orange-500', 'text-green-500 dark:text-yellow-500'],
    align: 'center',
  },
  {
    key: 'isLocked',
    name: getLocalMessage('labels.user.lock'),
    type: 'booleanIcon',
    values: ['Lock', 'LockOpen'],
    colors: ['text-orange-500', 'text-green-500 dark:text-yellow-500'],
    align: 'center',
  },
  {
    key: 'failedAttempts',
    name: getLocalMessage('labels.user.failedAttempts'),
    type: 'number',
    align: 'right',
  },
  {
    key: 'createdAt',
    name: getLocalMessage('labels.createdAt'),
    type: 'datetime',
  },
  { key: 'updatedAt', name: getLocalMessage('labels.updatedAt'), type: 'datetime' },

  { key: 'id', name: getLocalMessage('labels.id'), type: 'badge', align: 'center' },
]
