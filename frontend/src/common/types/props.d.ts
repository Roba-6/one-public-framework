import type { ColumnDef } from '@tanstack/react-table'

export interface DataProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
}
