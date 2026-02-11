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
import { useNavigate } from 'react-router'

import { enqueueMessage } from '@/common/app-slice'
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
import { useAppDispatch } from '@/common/hooks/use-store'
import type { Action, BaseType } from '@/common/types/data'
import type { DataListProps } from '@/common/types/props'
import type { CommonResponse } from '@/common/types/response'
import { deleteApi } from '@/lib/http'
import { copyToClipboard, getLocalMessage, setUrlParams } from '@/lib/utils'

const DataList = <T extends BaseType>(props: DataListProps<T>): React.JSX.Element => {
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const [loadingData, setLoadingData] = React.useState<boolean>(true)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const columns: ColumnDef<T>[] = convertTableColumns(props.columns)

  const navToDetail = (id: string): void => {
    nav(setUrlParams(props.detailUrl || './:id', id))
  }

  const navToUpdate = (id: string): void => {
    nav(setUrlParams(props.updateUrl || './:id/edit', id))
  }

  const deleteData = (id: string): void => {
    deleteApi<CommonResponse>(setUrlParams(props.deleteUrl!, id))
      .then((res: CommonResponse) => {
        const data: T = res.results as T
        console.debug(res.results as T)
        dispatch(
          enqueueMessage({
            message: {
              code: 'I00100001',
              message: getLocalMessage('messages.notices.I00100001', [data.name!]),
              detail: null,
            },
            status: 200,
            type: 'success',
          })
        )

        // getData()
      })
      .catch((err: CommonResponse) => {
        console.error(err)
      })
  }

  if (props.selectable) {
    columns.unshift(createSelectColumn<T>())
  }
  if (props.actions) {
    const actions: Action[] = props.actions.map((action) => {
      if (action.events?.handleClick === 'copyToClipboard') {
        return { ...action, events: { handleClick: copyToClipboard } }
      } else if (action.events?.handleClick === 'navToDetail') {
        return { ...action, events: { handleClick: navToDetail } }
      } else if (action.events?.handleClick === 'navToUpdate') {
        return { ...action, events: { handleClick: navToUpdate } }
      } else if (action.events?.handleClick === 'deleteData') {
        return { ...action, events: { handleClick: deleteData } }
      } else {
        return action
      }
    })
    columns.push(createActionColumn(actions))
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
                .map((_, idx: number) => (
                  <DataSkeleton
                    key={idx}
                    num={table.getHeaderGroups()[0].headers.length}
                  />
                ))
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
