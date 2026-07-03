import type { DataColumn } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

export const detailColumns: DataColumn[] = [
  {
    key: 'name',
    name: getLocalMessage('labels.attachment.name'),
    type: 'title',
  },
  { key: 'preview', name: 'Previewer', type: 'previewer' },
  {
    key: 'description',
    name: getLocalMessage('labels.attachment.description'),
    type: 'markdown',
  },
  {
    key: 'requiresAuth',
    name: getLocalMessage('labels.requiresAuth'),
    type: 'booleanIcon',
    values: ['CircleCheck', 'Ban'],
    colors: ['text-[var(--color-ring)]', 'text-[var(--color-disabled-foreground)]'],
  },
  {
    key: 'url',
    name: getLocalMessage('labels.attachment.downloadUrl'),
    type: 'label',
  },
  {
    key: 'preview',
    name: getLocalMessage('labels.attachment.previewUrl'),
    type: 'label',
  },
  {
    key: 'publicUrl',
    name: getLocalMessage('labels.attachment.publicDownloadUrl'),
    type: 'label',
  },
  {
    key: 'publicPreview',
    name: getLocalMessage('labels.attachment.publicPreviewUrl'),
    type: 'label',
  },
  {
    key: 'createdAt',
    name: getLocalMessage('labels.createdAt'),
    type: 'datetime',
  },
  { key: 'updatedAt', name: getLocalMessage('labels.updatedAt'), type: 'datetime' },
]
