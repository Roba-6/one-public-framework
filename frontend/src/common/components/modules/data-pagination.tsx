import { Button } from '@/common/components/ui/button'
import { getLocalMessage } from '@/lib/utils'

const DataPagination = (props: any) => {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="text-muted-foreground flex-1 text-sm">
        {props.table.getFilteredSelectedRowModel().rows.length} of{' '}
        {props.table.getFilteredRowModel().rows.length} row(s) selected.
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
