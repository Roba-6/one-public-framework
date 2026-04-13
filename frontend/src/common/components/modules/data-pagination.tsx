import { Button } from '@/common/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select'
import { formatNumber, getLocalMessage } from '@/lib/utils'

const DataPagination = (props: any) => {
  const ITEM_NUMBER: number[] = [10, 25, 50, 100]
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="text-muted-foreground flex-1 text-sm">
        {getLocalMessage('labels.dataPagination.totalResults')}
        <span className="ps-2">{formatNumber(props.total)}</span>
        <span className="px-2">|</span>
        {getLocalMessage('labels.dataPagination.selectedResults')}
        <span className="ps-2">
          {formatNumber(Object.keys(props.table.getState().rowSelection).length)}
        </span>
      </div>
      <div className="text-sm">
        {getLocalMessage('labels.dataPagination.itemsPerPage')}
      </div>
      <div>
        <Select
          defaultValue={`${props.table.getState().pagination.pageSize}`}
          onValueChange={(value: string) => props.table.setPageSize(Number(value))}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ITEM_NUMBER.map((num: number, idx: number) => (
                <SelectItem key={idx} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => props.table.previousPage()}
          disabled={!props.table.getCanPreviousPage()}
        >
          {getLocalMessage('buttons.previousPage')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => props.table.nextPage()}
          disabled={!props.table.getCanNextPage()}
        >
          {getLocalMessage('buttons.nextPage')}
        </Button>
      </div>
    </div>
  )
}

export default DataPagination
