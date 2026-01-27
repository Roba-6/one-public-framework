import * as Icon from 'lucide-react'
import React from 'react'
import { z } from 'zod/v4'

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

export type ColumnType =
  | 'title'
  | 'badge'
  | 'label'
  | 'number'
  | 'datetime'
  | 'booleanIcon'

export type ColumnAlign = 'left' | 'center' | 'right'

export type FormType =
  | 'text'
  | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'switch'

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

interface FormFieldItem {
  name: string
  label?: string
  type: FormType
  placeholder?: string
  autoComplete?: string
  options?: { label: string; value: string }[]
  defaultValue?: string | boolean
  validate?: z.ZodString | z.ZodBoolean
}
