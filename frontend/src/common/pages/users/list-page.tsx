import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { enqueueMessage } from '@/common/app-slice'
import DataList from '@/common/components/modules/data-list'
import DataPagination from '@/common/components/modules/data-pagination'
import DataToolBar from '@/common/components/modules/data-tool-bar'
import { Button } from '@/common/components/ui/button'
import { Checkbox } from '@/common/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store'
import type { CommonResponse } from '@/common/types/response'
import type { User } from '@/common/types/user'
import { deleteApi, getApi } from '@/lib/http'
import { getAdminPath, getLocalMessage, setUrlParams } from '@/lib/utils'

const UserListPage = (): React.ReactNode => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<User[]>([])

  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'fullname',
      header: 'Name',
      cell: ({ row }) => <div className="capitalize">{row.getValue('fullname')}</div>,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
    },
    {
      accessorKey: 'failedAttempts',
      header: () => <div className="text-right">Failed Attempts</div>,
      cell: ({ row }) => {
        const failedAttempts = parseFloat(row.getValue('failedAttempts'))
        const formatted = new Intl.NumberFormat('en-US').format(failedAttempts)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id!)}>
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  nav(
                    setUrlParams(
                      getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_USER_EDIT,
                      undefined,
                      { id: user.id! }
                    )
                  )
                }}
              >
                {getLocalMessage('buttons.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteData(user.id!)}>
                {getLocalMessage('buttons.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
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
    getData()
  }, [])

  const getData = () => {
    getApi<CommonResponse>(CONSTANT.API_URL.USER_ADMIN, {}).then(
      (res: CommonResponse) => {
        setData(res.results as User[])
      }
    )
  }

  const deleteData = (id: string) => {
    deleteApi<CommonResponse>(setUrlParams(CONSTANT.API_URL.USER_ADMIN_ID, id)).then(
      (res: CommonResponse) => {
        console.debug(res)
        getData()
        dispatch(
          enqueueMessage({
            message: {
              code: 'S2000000',
              message: 'Deleted Successfully',
              detail: null,
            },
            status: 200,
            type: 'success',
          })
        )
      }
    )
  }

  return (
    <div className="w-full">
      <DataToolBar table={table} />
      <DataList table={table} columns={columns} />
      <DataPagination table={table} />
    </div>
  )
}

export default UserListPage
