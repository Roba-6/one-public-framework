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
import { MoreHorizontal } from 'lucide-react'
import React, { useEffect } from 'react'

// import { useNavigate } from 'react-router'
import DataPagination from '@/common/components/modules/data-pagination'
import DataSkeleton from '@/common/components/modules/data-skeleton'
import DataToolBar from '@/common/components/modules/data-tool-bar'
import { Button } from '@/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/ui/table'
import type { Action, BaseType } from '@/common/types/data'
// import { CONSTANT } from '@/common/constants'
import type { DataListProps } from '@/common/types/props'
import { convertTableColumns, createSelectColumn } from '@/lib/functions'
import { getLocalMessage } from '@/lib/utils'
// import { getAdminPath, getLocalMessage, setUrlParams } from '@/lib/utils'

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
    columns.push({
      id: 'actions',
      // header: () => <div className="text-end">Actions</div>,
      cell: ({ row }) => {
        const data = row.original
        return (
          <div className="text-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{getLocalMessage('buttons.openMenu')}</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {getLocalMessage('labels.actions')}
                </DropdownMenuLabel>
                {props.actions!.map((act: Action, idx: number) => {
                  let properties = {}
                  if (act.events && 'handleClick' in act.events) {
                    console.log('DD ', act.events)
                    properties = {
                      ...properties,
                      onClick: () => act.events?.handleClick!(data.id!),
                    }
                  }
                  if (act.type === 'separator') {
                    return <DropdownMenuSeparator key={idx} />
                  } else {
                    return (
                      <DropdownMenuItem key={idx} {...properties}>
                        {act.name}
                      </DropdownMenuItem>
                    )
                  }
                })}
                {/*    <DropdownMenuItem*/}
                {/*      onClick={() => {*/}
                {/*        nav(*/}
                {/*          setUrlParams(*/}
                {/*            getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_USER_UPDATE,*/}
                {/*            undefined,*/}
                {/*            { id: user.id! }*/}
                {/*          )*/}
                {/*        )*/}
                {/*      }}*/}
                {/*    >*/}
                {/*      {getLocalMessage('buttons.edit')}*/}
                {/*    </DropdownMenuItem>*/}
                {/*    <DropdownMenuItem onClick={() => deleteData(user.id!)}>*/}
                {/*      {getLocalMessage('buttons.delete')}*/}
                {/*    </DropdownMenuItem>*/}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      enableHiding: false,
    })
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
    console.log('sorting: ', sorting)
    console.log('filters: ', columnFilters)
  }, [props, sorting, columnFilters])

  return (
    <React.Fragment>
      <DataToolBar table={table} columns={props.columns} />
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
