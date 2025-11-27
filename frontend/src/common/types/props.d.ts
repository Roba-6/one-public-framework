import type { Action, DataColumn } from '@/common/types/data'

export interface DataListProps<T> {
  columns: DataColumn<T>[]
  data: T[]
  selectable?: boolean
  actions?: Action[]
}
