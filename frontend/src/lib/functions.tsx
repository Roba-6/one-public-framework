import type { CellContext, ColumnDef, HeaderContext } from '@tanstack/react-table'
import dayjs from 'dayjs'
import * as Icon from 'lucide-react'
import React from 'react'

import { loadComplete } from '@/common/app-slice'
import { Badge } from '@/common/components/ui/badge'
import { Button } from '@/common/components/ui/button.tsx'
import { Checkbox } from '@/common/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/common/components/ui/tooltip'
import { CONSTANT } from '@/common/constants'
import type { DataColumn, DatetimeType } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'
import { store } from '@/store'

/**
 * Complete the loading process
 */
export const completed = (): void => {
  setTimeout(() => {
    store.dispatch(loadComplete())
  }, CONSTANT.LOADING_DURATION)
}

export const formatDay = (
  datetimeStr: string,
  type: DatetimeType = 'datetime'
): string => dayjs(datetimeStr).format(getLocalMessage(`format.${type}`))

/**
 * Convert column metadata into the @tanstack/react-table format
 *
 * @param objColumns
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

    let cell: any = null
    let header: any = null
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
            color = value
              ? `text-${dataColumn.colors[0]}-500`
              : `text-${dataColumn.colors[1]}-500`
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
      />
    ),
    cell: ({ row }: CellContext<T, any>) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }
}

// export const createActionColumn = <T,>(): ColumnDef<T> => {
//   return {}
// }
