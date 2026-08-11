'use client'

import { Skeleton } from '@/src/components/ui/skeleton'
import { TableCell, TableRow } from '@/src/components/ui/table'

export interface DataSkeletonProps {
  num?: number
}

const DataSkeleton = (props: DataSkeletonProps) => {
  return (
    <TableRow>
      {Array(props.num)
        .fill(null)
        .map((_, idx: number) => (
          <TableCell key={idx}>
            <Skeleton className="h-4 my-2" />
          </TableCell>
        ))}
    </TableRow>
  )
}

export default DataSkeleton
