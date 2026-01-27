import * as Icon from 'lucide-react'
import React from 'react'

import { Skeleton } from '@/common/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/common/components/ui/tooltip'
import type { DataDetailProps } from '@/common/types/props'
import { formatDay, formatNumber } from '@/lib/utils'

const DataDetail = <T,>(props: DataDetailProps<T>): React.ReactNode => {
  console.log('data', props.data)

  const renderItems = () => {
    return (
      <React.Fragment>
        {props.data &&
          props.columns.map((item, idx: number) => {
            console.log('item', item)
            if (item.type === 'title') {
              return (
                <div key={idx} className="mb-8 col-span-3 text-2xl">
                  {(props.data as any)[item.key]}
                  <small className="ps-2 text-sm text-neutral-500">
                    {(props.data as any).id}
                  </small>
                </div>
              )
            } else if (item.type === 'datetime') {
              return (
                <React.Fragment key={idx}>
                  <div className="">{item.name}</div>
                  <div className="col-span-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          {formatDay((props.data as any)[item.key], 'shortDatetime')}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {formatDay((props.data as any)[item.key])}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </React.Fragment>
              )
            } else if (item.type === 'number') {
              return (
                <React.Fragment key={idx}>
                  <div className="">{item.name}</div>
                  <div className="col-span-2">
                    {formatNumber((props.data as any)[item.key])}
                  </div>
                </React.Fragment>
              )
            } else if (item.type === 'booleanIcon') {
              const value: boolean = (props.data as any)[item.key]

              let iconName: keyof typeof Icon = 'Check'
              if (item.values && item.values.length == 2) {
                iconName = value ? item.values[0] : item.values[1]
              }

              let color: string = ''
              if (item.colors && item.colors.length == 2) {
                color = item.colors[value ? 0 : 1]
              }
              const ItemIcon = Icon[iconName] as React.FC<any>
              return (
                <React.Fragment key={idx}>
                  <div className="">{item.name}</div>
                  <div className="col-span-2">
                    {ItemIcon && <ItemIcon size={16} className={color} />}
                  </div>
                </React.Fragment>
              )
            } else {
              return (
                <React.Fragment key={idx}>
                  <div className="">{item.name}</div>
                  <div className="col-span-2">{(props.data as any)[item.key]}</div>
                </React.Fragment>
              )
            }
          })}
      </React.Fragment>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {props.loadingData
        ? Array(3)
            .fill(null)
            .map((_, idx: number) => (
              <React.Fragment key={idx}>
                <div className="">
                  <Skeleton className="my-2 h-4 w-auto" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="my-2 h-4 w-auto col-span-3" />
                </div>
              </React.Fragment>
            ))
        : renderItems()}
    </div>
  )
}

export default DataDetail
