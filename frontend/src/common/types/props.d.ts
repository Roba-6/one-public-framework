import type { ColumnDef } from '@tanstack/react-table'
import type { Table } from '@tanstack/table-core'

export interface DataProps {
  table: Table<any>
  columns?: ColumnDef<any>[]
}
