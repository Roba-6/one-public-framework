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
// import { MoreHorizontal } from 'lucide-react'
import React, { useEffect } from 'react'

// import { useNavigate } from 'react-router'
import DataPagination from '@/common/components/modules/data-pagination'
import DataSkeleton from '@/common/components/modules/data-skeleton'
import DataToolBar from '@/common/components/modules/data-tool-bar'
// import { Button } from '@/common/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/common/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/ui/table'
// import { CONSTANT } from '@/common/constants'
import type { DataListProps } from '@/common/types/props'
import { convertTableColumns, createSelectColumn } from '@/lib/functions'
// import { getAdminPath, getLocalMessage, setUrlParams } from '@/lib/utils'

const DataList = <T,>(props: DataListProps<T>) => {
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

  columns.push({
    id: 'actions',
    // header: () => <div className="text-end">Actions</div>,
    enableHiding: true,
    cell: ({ row }) => {
      const user = row.original
      console.log(user)
      return (
        <div className="text-end">
          {/*<DropdownMenu>*/}
          {/*  <DropdownMenuTrigger asChild>*/}
          {/*    <Button variant="ghost" className="h-8 w-8 p-0">*/}
          {/*      <span className="sr-only">Open menu</span>*/}
          {/*      <MoreHorizontal />*/}
          {/*    </Button>*/}
          {/*  </DropdownMenuTrigger>*/}
          {/*  <DropdownMenuContent align="end">*/}
          {/*    <DropdownMenuLabel>Actions</DropdownMenuLabel>*/}
          {/*    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id!)}>*/}
          {/*      Copy payment ID*/}
          {/*    </DropdownMenuItem>*/}
          {/*    <DropdownMenuSeparator />*/}
          {/*    <DropdownMenuItem>View customer</DropdownMenuItem>*/}
          {/*    <DropdownMenuItem>View payment details</DropdownMenuItem>*/}
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
          {/*  </DropdownMenuContent>*/}
          {/*</DropdownMenu>*/}
        </div>
      )
    },
  })

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
      <DataToolBar table={table} />
      <div className="overflow-hidden rounded-md border">
        <Table className="data-list">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
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
