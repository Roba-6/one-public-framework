import * as Icon from 'lucide-react'

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

interface DataColumn {
  key?: string
  name?: string
  type?: ColumnType
  values?: (keyof typeof Icon)[]
  colors?: string[]
  isSortable?: boolean
  align?: ColumnAlign
}

export interface DataColumnDef<T> extends ColumnDef<T> {
  displayName?: string
}
