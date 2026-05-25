import React, { useEffect } from 'react'
import { useParams } from 'react-router'

import DataDetail from '@/common/components/modules/data-detail'
import { Card, CardContent } from '@/common/components/ui/card'
import { CONSTANT } from '@/common/constants'
import type { CommonResponse } from '@/common/types/response'
import { detailColumns } from '@/features/attachments/detail-columns'
import type { Attachment } from '@/features/attachments/types/attachment'
import { getApi } from '@/lib/http'
import { setUrlParams } from '@/lib/utils'

const DetailAttachmentPage = (): React.JSX.Element => {
  const { id } = useParams()

  const [loadingData, setLoadingData] = React.useState<boolean>(true)
  const [data, setData] = React.useState<Attachment | null>(null)

  useEffect(() => {
    getApi<CommonResponse>(setUrlParams(CONSTANT.API_URL.ATTACHMENT_ADMIN_ID, id)).then(
      (res: CommonResponse) => {
        setData(res.results! as Attachment)
        setLoadingData(false)
        console.log('Detail Page:', res.results! as Attachment)
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

export default DetailAttachmentPage
