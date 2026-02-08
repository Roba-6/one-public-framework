import type { DataColumn } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const detailColumns: DataColumn[] = [
  {
    key: 'fullname',
    name: getLocalMessage('labels.user.fullname'),
    type: 'title',
  },
  {
    key: 'name',
    name: getLocalMessage('labels.user.name'),
  },
  { key: 'email', name: getLocalMessage('labels.user.email') },
  { key: 'nickname', name: getLocalMessage('labels.user.nickname') },
  {
    key: 'createdAt',
    name: getLocalMessage('labels.createdAt'),
    type: 'datetime',
  },
  { key: 'updatedAt', name: getLocalMessage('labels.updatedAt'), type: 'datetime' },
  {
    key: 'isEnabled',
    name: getLocalMessage('labels.enabled'),
    type: 'booleanIcon',
    values: ['UserRoundCheck', 'UserRoundX'],
    colors: ['text-green-500 dark:text-yellow-500', 'text-orange-500'],
  },
  {
    key: 'isLocked',
    name: getLocalMessage('labels.user.lock'),
    type: 'booleanIcon',
    values: ['Lock', 'LockOpen'],
    colors: ['text-orange-500', 'text-green-500 dark:text-yellow-500'],
  },
  {
    key: 'failedAttempts',
    name: getLocalMessage('labels.user.failedAttempts'),
    type: 'number',
  },
]
