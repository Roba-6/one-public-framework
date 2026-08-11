'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { CONSTANT } from '@/src/common/constants'
import type { Action, DataColumn } from '@/src/common/types/data'
import { CommonResponse } from '@/src/common/types/response'
import DataList from '@/src/components/organisms/data-list'
import { Feature } from '@/src/features/admin/features/feature'
import { getApi } from '@/src/lib/client-http'
import { getLocalMessage } from '@/src/lib/client-utils'

export const listColumns: DataColumn[] = [
  {
    key: 'name',
    name: getLocalMessage('labels.feature.name'),
    isSortable: true,
    align: 'left',
  },
  {
    key: 'key',
    name: getLocalMessage('labels.key'),
    isSortable: true,
    align: 'left',
  },
  {
    key: 'isEnabled',
    name: getLocalMessage('labels.enabled'),
    type: 'booleanIcon',
    values: ['CircleCheck', 'CircleX'],
    colors: ['text-[var(--color-ring)]', 'text-[var(--color-disabled-foreground)]'],
    align: 'center',
    isFilterable: true,
    filters: [
      { label: getLocalMessage('labels.enabled'), value: 'true' },
      { label: getLocalMessage('labels.disabled'), value: 'false' },
    ],
  },
  {
    key: 'requiresAuth',
    name: getLocalMessage('labels.requiresAuth'),
    type: 'booleanIcon',
    values: ['ShieldCheck', 'ShieldX'],
    colors: ['text-[var(--color-ring)]', 'text-[var(--color-disabled-foreground)]'],
    align: 'center',
    isFilterable: true,
    filters: [
      { label: getLocalMessage('labels.requiresAuth'), value: 'true' },
      { label: getLocalMessage('labels.noAuthRequired'), value: 'false' },
    ],
  },
  {
    key: 'createdAt',
    name: getLocalMessage('labels.createdAt'),
    type: 'datetime',
    isSortable: true,
  },
  {
    key: 'updatedAt',
    name: getLocalMessage('labels.updatedAt'),
    type: 'datetime',
    isSortable: true,
  },
  { key: 'id', name: getLocalMessage('labels.id'), type: 'badge', align: 'center' },
]

export const actions: Action[] = [
  {
    name: getLocalMessage('buttons.copyId'),
    events: {
      handleClick: 'copyToClipboard',
    },
  },
  {
    type: 'separator',
  },
  {
    name: getLocalMessage('buttons.details'),
    events: {
      handleClick: 'navToDetail',
    },
  },
  {
    name: getLocalMessage('buttons.edit'),
    events: {
      handleClick: 'navToUpdate',
    },
  },
  {
    name: getLocalMessage('buttons.delete'),
    events: {
      handleClick: 'deleteData',
    },
  },
]

const ListFeaturesScreen = () => {
  const [data, setData] = useState<Feature[]>([])
  const [total, setTotal] = useState<number>(0)
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<boolean>(true)

  const getData = () => {
    getApi<CommonResponse>(CONSTANT.API_URL.FEATURE_ADMIN, {
      limit: searchParams.get('size') || '10',
      offset:
        (parseInt(searchParams.get('page') || '1') - 1) *
        parseInt(searchParams.get('size') || '10'),
      orderBy: searchParams.getAll('orderBy'),
      keywords: searchParams.get('keywords') || '',
      filters: searchParams.getAll('filters') || [],
    }).then((res: CommonResponse) => {
      setData(res.results as Feature[])
      setTotal(res.count!)
      setLoading(false)
    })
  }

  useEffect(() => {
    getData()
  }, [])

  // useEffect(() => {
  //   setLoading(true)
  //   getData()
  // }, [searchParams])

  return (
    <div className="w-full">
      <DataList<Feature>
        columns={listColumns}
        data={data}
        total={total}
        actions={actions}
        loading={loading}
        selectable
        deleteUrl={CONSTANT.API_URL.FEATURE_ADMIN_ID}
      />
    </div>
  )
}

export default ListFeaturesScreen
