import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import React, { useEffect } from 'react'

import {
  convertTableColumns,
  createActionColumn,
  createSelectColumn,
} from '@/common/components/modules/data-list-generator'
import DataPagination from '@/common/components/modules/data-pagination'
import DataSkeleton from '@/common/components/modules/data-skeleton'
import DataToolBar from '@/common/components/modules/data-tool-bar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/ui/table'
import type { BaseType } from '@/common/types/data'
import type { DataListProps } from '@/common/types/props'

const DataList = <T extends BaseType>(props: DataListProps<T>): React.ReactNode => {
  // const nav = useNavigate()
  const [loadingData, setLoadingData] = React.useState<boolean>(true)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns: ColumnDef<T>[] = convertTableColumns(props.columns)

  if (props.selectable) {
    columns.unshift(createSelectColumn<T>())
  }
  if (props.actions) {
    columns.push(createActionColumn(props.actions))
  }

  const table = useReactTable({
    data: props.data,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  useEffect(() => {
    if (table.getRowModel().rows?.length) {
      setLoadingData(false)
    } else {
      setLoadingData(true)
    }
    console.debug('sorting:', sorting)
    console.debug('filters:', columnFilters)
  }, [props, sorting, columnFilters])

  return (
    <React.Fragment>
      <DataToolBar table={table} columns={props.columns} addUrl={props.addUrl} />
      <div className="overflow-hidden rounded-md border">
        <Table className="data-list">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  let className = ''
                  if (header.id === 'select') {
                    className = 'sticky-start'
                  } else if (header.id === 'actions') {
                    className = 'sticky-end'
                  }
                  return (
                    <TableHead key={header.id} className={className}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loadingData ? (
              Array(3)
                .fill(null)
                .map((_, idx: number) => <DataSkeleton key={idx} index={idx} />)
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => {
                    let className = ''
                    if (cell.column.id === 'select') {
                      className = 'sticky-start'
                    } else if (cell.column.id === 'actions') {
                      className = 'sticky-end'
                    }
                    return (
                      <TableCell key={cell.id} className={className}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataPagination table={table} />
    </React.Fragment>
  )
}

export default DataList
