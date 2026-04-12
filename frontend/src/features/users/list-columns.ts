import type { Action, DataColumn } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const listColumns: DataColumn[] = [
  {
    key: 'name',
    name: getLocalMessage('labels.user.name'),
    isSortable: true,
    align: 'left',
  },
  { key: 'nickname', name: getLocalMessage('labels.user.nickname'), isSortable: true },
  { key: 'fullname', name: getLocalMessage('labels.user.fullname') },
  { key: 'email', name: getLocalMessage('labels.user.email'), isSortable: true },
  {
    key: 'isEnabled',
    name: getLocalMessage('labels.enabled'),
    type: 'booleanIcon',
    values: ['UserRoundCheck', 'UserRoundX'],
    colors: ['text-orange-500', 'text-red-700'],
    align: 'center',
    isFilterable: true,
    filters: [
      { label: getLocalMessage('labels.enabled'), value: 'true' },
      { label: getLocalMessage('labels.disabled'), value: 'false' },
    ],
  },
  {
    key: 'isLocked',
    name: getLocalMessage('labels.user.lock'),
    type: 'booleanIcon',
    values: ['Lock', 'LockOpen'],
    colors: ['text-red-700', 'text-orange-500'],
    align: 'center',
    isFilterable: true,
    filters: [
      { label: getLocalMessage('labels.user.unlock'), value: 'false' },
      { label: getLocalMessage('labels.user.lock'), value: 'true' },
    ],
  },
  {
    key: 'failedAttempts',
    name: getLocalMessage('labels.user.failedAttempts'),
    type: 'number',
    align: 'right',
    isSortable: true,
  },
  {
    key: 'createdAt',
    name: getLocalMessage('labels.createdAt'),
    type: 'datetime',
    isSortable: true,
  },
  {
    key: 'updatedAt',
    name: getLocalMessage('labels.updatedAt'),
    type: 'datetime',
    isSortable: true,
  },
  { key: 'id', name: getLocalMessage('labels.id'), type: 'badge', align: 'center' },
]

export const actions: Action[] = [
  {
    name: getLocalMessage('buttons.copyId'),
    events: {
      handleClick: 'copyToClipboard',
    },
  },
  {
    type: 'separator',
  },
  {
    name: getLocalMessage('buttons.details'),
    events: {
      handleClick: 'navToDetail',
    },
  },
  {
    name: getLocalMessage('buttons.edit'),
    events: {
      handleClick: 'navToUpdate',
    },
  },
  {
    name: getLocalMessage('buttons.delete'),
    events: {
      handleClick: 'deleteData',
    },
  },
]
