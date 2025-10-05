import { flexRender } from '@tanstack/react-table'
import React, { useEffect } from 'react'

import DataSkeleton from '@/common/components/modules/data-skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/ui/table'
import type { DataProps } from '@/common/types/props'

const DataList = (props: DataProps) => {
  const [loadingData, setLoadingData] = React.useState<boolean>(true)

  useEffect(() => {
    if (props.table.getRowModel().rows?.length) {
      setLoadingData(false)
    } else {
      setLoadingData(true)
    }
  }, [props])

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {props.table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loadingData ? (
            Array(3)
              .fill(null)
              .map((_, idx: number) => <DataSkeleton index={idx} />)
          ) : props.table.getRowModel().rows?.length ? (
            props.table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={props.columns?.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default DataList
