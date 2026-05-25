import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import DataList from '@/common/components/modules/data-list'
import { CONSTANT } from '@/common/constants'
import type { CommonResponse } from '@/common/types/response'
import { actions, listColumns } from '@/features/attachments/list-columns'
import type { Attachment } from '@/features/attachments/types/attachment'
import { getApi } from '@/lib/http'

const AttachmentListPage = (): React.JSX.Element => {
  const [data, setData] = useState<Attachment[]>([])
  const [total, setTotal] = useState<number>(0)
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    getData()
  }, [searchParams])

  const getData = () => {
    getApi<CommonResponse>(CONSTANT.API_URL.ATTACHMENT_ADMIN, {
      limit: searchParams.get('size') || '10',
      offset:
        (parseInt(searchParams.get('page') || '1') - 1) *
        parseInt(searchParams.get('size') || '10'),
      orderBy: searchParams.getAll('orderBy'),
      keywords: searchParams.get('keywords') || '',
      filters: searchParams.getAll('filters') || [],
    }).then((res: CommonResponse) => {
      setData(res.results as Attachment[])
      setTotal(res.count!)
      setLoading(false)
    })
  }

  return (
    <div className="w-full">
      <DataList<Attachment>
        columns={listColumns}
        data={data}
        total={total}
        actions={actions}
        loading={loading}
        selectable
        deleteUrl={CONSTANT.API_URL.ATTACHMENT_ADMIN_ID}
      />
    </div>
  )
}

export default AttachmentListPage
