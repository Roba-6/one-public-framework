import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router'

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
  const [searchParams, setSearchParams] = useSearchParams()
  const nav = useNavigate()
  const [loadingData, setLoadingData] = useState<boolean>(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [pagination, setPagination] = useState({
    pageIndex: searchParams.get('page') ? Number(searchParams.get('page')) - 1 : 0,
    pageSize: searchParams.get('size') ? Number(searchParams.get('size')) : 10,
  })

  const columns: ColumnDef<T>[] = convertTableColumns(props.columns)

  const navToDetail = (id: string): void => {
    nav(setUrlParams(props.detailUrl || './:id', id))
  }

  const navToUpdate = (id: string): void => {
    nav(setUrlParams(props.updateUrl || './:id/edit', id))
  }

  useEffect(() => {
    const orderBy = searchParams.get('orderBy')
    const orderByName = orderBy?.split('_desc')[0] || ''

    if (orderBy) {
      const isDesc = orderBy.endsWith('_desc')
      const id = orderByName.replace(/_([a-z])/g, (_, c) => c.toUpperCase())

      setSorting([{ id, desc: isDesc }])
    }

    const filters = searchParams.getAll('filters')

    if (!filters.length) {
      setColumnFilters([])
      return
    }

    const parsed = filters.map((f) => {
      const [id, value] = f.split(':')
      const camelId = id.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
      return { id: camelId, value }
    })

    setColumnFilters(parsed)
  }, [])

  useEffect(() => {
    const page = Number(searchParams.get('page') || 1) - 1
    const size = Number(searchParams.get('size') || 10)

    setPagination((prev) => {
      if (prev.pageIndex === page && prev.pageSize === size) {
        return prev
      }

      return { pageIndex: page, pageSize: size }
    })
  }, [searchParams])

  useEffect(() => {
    const currentPage = Number(searchParams.get('page') || 1)
    const currentSize = Number(searchParams.get('size') || 10)

    const isSame =
      currentPage === pagination.pageIndex + 1 && currentSize === pagination.pageSize
    if (!isSame) {
      setParams({
        page: String(pagination.pageIndex + 1),
        size: String(pagination.pageSize),
        // orderBy: searchParams.getAll('orderBy') || ['created_at_desc'],
      })
    }
  }, [pagination])

  useEffect(() => {
    const nextSort =
      sorting[0]?.id.replace(
        /[A-Z]/g,
        (letter: string) => `_${letter.toLowerCase()}`
      ) || ''
    const nextOrder = sorting[0]?.desc ? 'desc' : 'asc'

    // Current URL sort (no suffix for ascending)
    // TODO: Support multi-column sorting: get() → getAll()
    const orderBy = searchParams.get('orderBy') || ''

    let currentSort = ''
    let currentOrder: 'asc' | 'desc' = 'asc'

    if (orderBy.endsWith('_desc')) {
      currentSort = orderBy.replace('_desc', '')
      currentOrder = 'desc'
    } else {
      currentSort = orderBy
      currentOrder = 'asc'
    }

    const isSame = currentSort === nextSort && currentOrder === nextOrder

    if (sorting.length > 0 && !isSame) {
      const nextOrderBy = nextOrder === 'desc' ? `${nextSort}_desc` : nextSort

      setParams({ orderBy: nextOrderBy })
    }
  }, [sorting])

  useEffect(() => {
    const t = setTimeout(() => {
      const nextFilters = columnFilters.map((f: any) => {
        const id = f.id.replace(
          /[A-Z]/g,
          (letter: string) => `_${letter.toLowerCase()}`
        )
        return `${id}:${f.value}`
      })

      const currentFilters = searchParams.getAll('filters')

      const isSame =
        currentFilters.length === nextFilters.length &&
        currentFilters.every((val, idx) => val === nextFilters[idx])
      if (nextFilters.length > 0 && !isSame) {
        setParams({ page: '1', filters: nextFilters })
      }
      return () => clearTimeout(t)
    }, 200)
  }, [columnFilters])

  const setParams = (params: any) => {
    const paramsObj: any = {
      page: searchParams.get('page') || '1',
      size: searchParams.get('size') || '10',
    }

    const orderBy = searchParams.getAll('orderBy')
    const filters = searchParams.getAll('filters')

    if (orderBy.length) paramsObj.orderBy = orderBy
    if (filters.length) paramsObj.filters = filters

    setSearchParams({ ...paramsObj, ...params })
  }

  const handlePaginationChange = (updater: any) => {
    setPagination((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }

  const handleSortingChange = (updater: any) => {
    setSorting((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }

  const handleColumnFiltersChange = (updater: any) => {
    setColumnFilters((prev) =>
      typeof updater === 'function' ? updater(prev) : updater
    )
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
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    pageCount: Math.ceil(props.total! / pagination.pageSize),
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  })

  useEffect(() => {
    if (table.getRowModel().rows?.length >= 0) {
      setLoadingData(false)
    } else {
      setLoadingData(true)
    }
  }, [props, sorting, columnFilters])

  return (
    <React.Fragment>
      <DataToolBar
        table={table}
        columns={props.columns}
        searchKey={'name'}
        addUrl={props.addUrl}
      />
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
