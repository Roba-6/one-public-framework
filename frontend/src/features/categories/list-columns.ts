import type { Action, DataColumn } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const listColumns: DataColumn[] = [
  {
    key: 'name',
    name: getLocalMessage('labels.category.name'),
    isSortable: true,
    align: 'left',
  },
  {
    key: 'value',
    name: getLocalMessage('labels.category.value'),
    isSortable: true,
    align: 'left',
  },
  {
    key: 'alias',
    name: getLocalMessage('labels.category.alias'),
    isSortable: true,
    align: 'left',
  },
  {
    key: 'isEnabled',
    name: getLocalMessage('labels.enabled'),
    type: 'booleanIcon',
    values: ['CircleCheck', 'CircleX'],
    colors: ['text-[var(--color-ring)]', 'text-[var(--color-disabled-foreground)]'],
    align: 'center',
    isFilterable: true,
    filters: [
      { label: getLocalMessage('labels.enabled'), value: 'true' },
      { label: getLocalMessage('labels.disabled'), value: 'false' },
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
