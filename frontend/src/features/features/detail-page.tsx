import React, { useEffect } from 'react'
import { useParams } from 'react-router'

import DataDetail from '@/common/components/modules/data-detail'
import { Card, CardContent } from '@/common/components/ui/card'
import { CONSTANT } from '@/common/constants'
import type { CommonResponse } from '@/common/types/response'
import { detailColumns } from '@/features/features/detail-columns'
import type { Feature } from '@/features/features/types/feature'
import { getApi } from '@/lib/http'
import { setUrlParams } from '@/lib/utils'

const DetailFeaturePage = (): React.JSX.Element => {
  const { id } = useParams()

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

export default DetailFeaturePage
