import type { CellContext, ColumnDef, HeaderContext } from '@tanstack/react-table'
import dayjs from 'dayjs'
import * as Icon from 'lucide-react'
import { MoreHorizontal } from 'lucide-react'
import React from 'react'

import { loadComplete } from '@/common/app-slice'
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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Switch } from '@/common/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/common/components/ui/tooltip'
import { CONSTANT } from '@/common/constants'
import type { Action, BaseType, FormFieldItem } from '@/common/types/data'
import type { DataColumn, DatetimeType } from '@/common/types/data'
import type { TestType } from '@/features/users/types/user'
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

export const convertFormItems = (
  items: FormFieldItem[],
  form: any
): React.JSX.Element => {
  return (
    <React.Fragment>
      {items.map((item: FormFieldItem, idx: number) => (
        <FormField
          key={idx}
          control={form.control}
          name={item.name as TestType}
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-6 gap-3">
                <FormLabel>{item.label as string}</FormLabel>
                <FormControl className="col-span-3">
                  {(() => {
                    switch (item.type) {
                      case 'text':
                      case 'password':
                      case 'email':
                        return (
                          <Input
                            type={item.type as string}
                            placeholder={item?.placeholder as string}
                            {...field}
                            value={field.value as string}
                            autoComplete={item?.autoComplete as string}
                          />
                        )
                      case 'switch':
                        return (
                          <Switch
                            checked={form.watch(item.name) as boolean}
                            onCheckedChange={(checked) => {
                              form.setValue(item.name, checked, {
                                shouldValidate: true,
                              })
                            }}
                          />
                        )
                      default:
                        return null
                    }
                  })()}
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      ))}
    </React.Fragment>
  )
}
