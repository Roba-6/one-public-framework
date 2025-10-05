import { Skeleton } from '@/common/components/ui/skeleton'
import { TableCell, TableRow } from '@/common/components/ui/table'

export interface DataSkeletonProps {
  index?: number
}

const DataSkeleton = (props: DataSkeletonProps) => {
  return (
    <TableRow key={props.index}>
      <TableCell>
        <Skeleton className="my-2 h-4 w-[18px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[250px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[250px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[350px] float-end" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[30px]" />
      </TableCell>
    </TableRow>
  )
}

export default DataSkeleton
