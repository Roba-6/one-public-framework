import type { Action, DataColumn } from '@/common/types/data'
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
    values: ['CircleCheck', 'CircleX'],
    colors: ['text-orange-500', 'text-red-700'],
    align: 'center',
    isFilterable: true,
    filters: [
      { label: getLocalMessage('labels.enabled'), value: 'true' },
      { label: getLocalMessage('labels.disabled'), value: 'false' },
    ],
  },
  {
    key: 'requiresAuth',
    name: getLocalMessage('labels.requiresAuth'),
    type: 'booleanIcon',
    values: ['ShieldCheck', 'ShieldX'],
    colors: ['text-orange-500', 'text-red-700'],
    align: 'center',
    isFilterable: true,
    filters: [
      { label: getLocalMessage('labels.requiresAuth'), value: 'true' },
      { label: getLocalMessage('labels.noAuthRequired'), value: 'false' },
    ],
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
