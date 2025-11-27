import * as Icon from 'lucide-react'
import React from 'react'

interface BaseType {
  id?: string
}

interface MenuItem {
  name: string
  url?: string
  icon?: keyof typeof Icon
  items?: MenuItem[]
  show?: boolean
}

interface Menu {
  [key: string]: {
    isOpened: boolean
    items?: MenuItem[]
  }
}

export type DatetimeType =
  | 'datetime'
  | 'shortDatetime'
  | 'date'
  | 'dateForApi'
  | 'time'
  | 'defaultDatetime'

export type ColumnType = 'badge' | 'label' | 'number' | 'datetime' | 'booleanIcon'

export type ColumnAlign = 'left' | 'center' | 'right'

export type EventType = 'handleClick'

interface DataColumn {
  key?: string
  name?: string
  type?: ColumnType
  values?: (keyof typeof Icon)[]
  colors?: string[]
  isSortable?: boolean
  align?: ColumnAlign
}

interface Action {
  name?: string
  type?: 'item' | 'separator'
  events?: Partial<Record<EventType, React.EventHandler<any>>> | null
}
