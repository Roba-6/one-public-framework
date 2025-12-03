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
import { getAdminPath, getLocalMessage } from '@/lib/utils'

const DataToolBar = (props: any) => {
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
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {getLocalMessage('buttons.column')}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {props.table
              .getAllColumns()
              .filter((column: any) => column.getCanHide())
              .map((column: any, idx: number) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(value) => column.toggleVisibility(value)}
                  >
                    {props.columns[idx]?.name}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <NaviButton
          messageId="add"
          icon={<Plus />}
          url={getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_USER_ADD}
        />
      </div>
    </div>
  )
}

export default DataToolBar
