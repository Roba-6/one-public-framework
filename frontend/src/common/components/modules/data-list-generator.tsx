import type { CellContext, ColumnDef, HeaderContext } from '@tanstack/react-table'
import * as Icon from 'lucide-react'
import { MoreHorizontal } from 'lucide-react'
import React from 'react'

import { Badge } from '@/common/components/ui/badge'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/common/components/ui/tooltip'
import { CONSTANT } from '@/common/constants'
import type { Action, BaseType } from '@/common/types/data'
import type { DataColumn } from '@/common/types/data'
import { formatDay, getLocalMessage } from '@/lib/utils'
import { store } from '@/store'

/**
 * Converts a list of `DataColumn` objects into a list of `ColumnDef` objects,
 * which define the structure and behavior of columns in a data table. Handles
 * column alignment, sorting, and rendering options based on the properties of
 * the input `DataColumn` objects.
 *
 * @template T - The type of the data row associated with the table columns.
 * @param {DataColumn[]} objColumns - An array of objects representing the column
 * definitions for a data table, including
 * properties for alignment, type, sortability, and other rendering details.
 * @returns {ColumnDef<T>[]} An array of objects defining the transformed table
 * columns, including custom rendering
 * for column headers and cells based on the `DataColumn` properties.
 */
export const convertTableColumns = <T,>(objColumns: DataColumn[]): ColumnDef<T>[] => {
  const columns: ColumnDef<T>[] = []

  objColumns.forEach((dataColumn: DataColumn) => {
    let align: string = ''
    let m: string = ''
    switch (dataColumn.align) {
      case 'center':
        align = 'text-center'
        m = 'mx-auto'
        break
      case 'right':
        align = 'text-end'
        m = 'ms-auto'
        break
      default:
        align = 'text-start'
    }

    let cell: any
    let header: any

    if (dataColumn.isSortable) {
      header = ({ column }: HeaderContext<T, any>) => {
        return (
          <div className={align}>
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {dataColumn.name}
              <Icon.ArrowUpDown />
            </Button>
          </div>
        )
      }
    } else {
      header = <div className={align}>{dataColumn.name}</div>
    }

    switch (dataColumn.type) {
      case 'badge':
        cell = ({ row }: CellContext<T, any>) => {
          const value: string = row.getValue(dataColumn.key!)
          return (
            <div className={align}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline">
                    {value.substring(0, CONSTANT.UUID_DISPLAY_LENGTH)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>{value}</TooltipContent>
              </Tooltip>
            </div>
          )
        }
        break
      case 'datetime':
        cell = ({ row }: CellContext<T, any>) => {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={align}>
                  {formatDay(row.getValue(dataColumn.key!), 'shortDatetime')}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {formatDay(row.getValue(dataColumn.key!))}
              </TooltipContent>
            </Tooltip>
          )
        }
        break
      case 'number':
        cell = ({ row }: CellContext<T, any>) => {
          const failedAttempts = parseFloat(row.getValue(dataColumn.key!))
          const formatted = new Intl.NumberFormat(
            store.getState().app.settings.language
          ).format(failedAttempts)
          return <div className={align}>{formatted}</div>
        }
        break
      case 'booleanIcon':
        cell = ({ row }: CellContext<T, any>) => {
          const value: boolean = row.getValue(dataColumn.key!)

          let iconName: keyof typeof Icon = 'Check'
          if (dataColumn.values && dataColumn.values.length == 2) {
            iconName = value ? dataColumn.values[0] : dataColumn.values[1]
          }

          let color: string = ''
          if (dataColumn.colors && dataColumn.colors.length == 2) {
            color = dataColumn.colors[value ? 0 : 1]
          }

          const ItemIcon = Icon[iconName] as React.FC<any>

          return (
            <div className={align}>
              {ItemIcon && <ItemIcon size={16} className={`${m} ${color}`} />}
            </div>
          )
        }
        break
      default:
        cell = ({ row }: CellContext<T, any>) => (
          <div className={align}>{row.getValue(dataColumn.key!)}</div>
        )
    }
    const c: ColumnDef<T> = {
      accessorKey: dataColumn.key!,
      header: header,
      // displayName: dataColumn.name,
      cell: cell,
    }
    columns.push(c)
  })

  return columns
}

/**
 * A utility function for creating a select column definition.
 *
 * This function generates a column definition for selecting rows in a table. It
 * includes a header cell with a checkbox that allows selecting or deselecting all
 * rows, and individual checkboxes in each cell for selecting or deselecting
 * specific rows.
 *
 * @template T - The type of row data for the table.
 *
 * @returns {ColumnDef<T>} A column definition object for handling row selection.
 *
 * The returned column has the following characteristics:
 * - `id`: A unique identifier for the column, set to 'select'.
 * - `header`: A checkbox element used for selecting or deselecting all rows on the
 * page.
 *   It reflects the selection state of rows (all selected, some selected, or none).
 * - `cell`: A checkbox element rendered for each row, allowing selection or deselection
 *   of the individual row. The checkbox reflects the row’s selection state.
 * - `enableSorting`: Sorting is disabled for this column.
 * - `enableHiding`: Hiding the column is disabled.
 */
export const createSelectColumn = <T,>(): ColumnDef<T> => {
  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        role="checkdata"
      />
    ),
    cell: ({ row }: CellContext<T, any>) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        role="checkdata"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }
}

export const createActionColumn = <T extends BaseType>(
  actions: Action[]
): ColumnDef<T> => {
  return {
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
              <DropdownMenuLabel>{getLocalMessage('labels.actions')}</DropdownMenuLabel>
              {actions.map((act: Action, idx: number) => {
                const properties: { [key: string]: any } = {}
                if (act.events && 'handleClick' in act.events) {
                  properties.onClick = () => act.events?.handleClick!(data.id!)
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    enableHiding: false,
  }
}
