import type { DataColumn } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const detailColumns: DataColumn[] = [
  {
    key: 'fullName',
    name: getLocalMessage('labels.user.fullname'),
    type: 'title',
  },
  {
    key: 'username',
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
    colors: ['text-[var(--color-green-500)]', 'text-[var(--color-gray-700)]'],
  },
  {
    key: 'isLocked',
    name: getLocalMessage('labels.user.lock'),
    type: 'booleanIcon',
    values: ['Lock', 'LockOpen'],
    colors: ['text-[var(--color-gray-700)]', 'text-[var(--color-green-500)]'],
  },
  {
    key: 'failedAttempts',
    name: getLocalMessage('labels.user.failedAttempts'),
    type: 'number',
  },
]
