import { ChevronDown, Plus } from 'lucide-react'

import NaviButton from '@/common/components/atoms/navi-button'
import { Button } from '@/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu'
import { Input } from '@/common/components/ui/input'
import { CONSTANT } from '@/common/constants'
import type { DataProps } from '@/common/types/props'
import { getLocalMessage } from '@/lib/utils'

const DataToolBar = (props: DataProps) => {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Filter emails..."
        value={(props.table.getColumn('email')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          props.table.getColumn('email')?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {getLocalMessage('buttons.column')}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {props.table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <NaviButton
          messageId="add"
          icon={<Plus />}
          url={CONSTANT.ROUTE_URL.ADMIN + CONSTANT.ROUTE_URL.ADMIN_USER_EDIT}
        />
      </div>
    </div>
  )
}

export default DataToolBar
