'use client'

import React, { useEffect } from 'react'

import { CONSTANT } from '@/src/common/constants'
import type { DataColumn } from '@/src/common/types/data'
import { CommonResponse } from '@/src/common/types/response'
import DataDetail from '@/src/components/organisms/data-detail'
import { Card, CardContent } from '@/src/components/ui/card'
import { Feature } from '@/src/features/admin/features/feature'
import { getApi } from '@/src/lib/client-http'
import { getLocalMessage } from '@/src/lib/client-utils'
import { setUrlParams } from '@/src/lib/utils'

export const detailColumns: DataColumn[] = [
  {
    key: 'name',
    name: getLocalMessage('labels.feature.name'),
    type: 'title',
  },
  {
    key: 'description',
    name: getLocalMessage('labels.feature.description'),
    type: 'markdown',
  },
  {
    key: 'key',
    name: getLocalMessage('labels.key'),
  },
  {
    key: 'isEnabled',
    name: getLocalMessage('labels.enabled'),
    type: 'booleanIcon',
    values: ['CircleCheck', 'Ban'],
    colors: ['text-[var(--color-ring)]', 'text-[var(--color-disabled-foreground)]'],
  },
  {
    key: 'requiresAuth',
    name: getLocalMessage('labels.requiresAuth'),
    type: 'booleanIcon',
    values: ['CircleCheck', 'Ban'],
    colors: ['text-[var(--color-ring)]', 'text-[var(--color-disabled-foreground)]'],
  },
  {
    key: 'createdAt',
    name: getLocalMessage('labels.createdAt'),
    type: 'datetime',
  },
  { key: 'updatedAt', name: getLocalMessage('labels.updatedAt'), type: 'datetime' },
]

const DetailFeaturesScreen = ({ id }: { id: string }) => {
  const [loadingData, setLoadingData] = React.useState<boolean>(true)
  const [data, setData] = React.useState<Feature | null>(null)

  useEffect(() => {
    getApi<CommonResponse>(setUrlParams(CONSTANT.API_URL.FEATURE_ADMIN_ID, id)).then(
      (res: CommonResponse) => {
        setData(res.results! as Feature)
        setLoadingData(false)
        console.log('Detail Page:', res.results! as Feature)
      }
    )
  }, [id])

  return (
    <Card>
      <CardContent>
        <DataDetail columns={detailColumns} data={data} loadingData={loadingData} />
      </CardContent>
    </Card>
  )
}

export default DetailFeaturesScreen
