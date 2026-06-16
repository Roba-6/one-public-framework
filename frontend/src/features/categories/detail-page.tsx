import React, { useEffect } from 'react'
import { useParams } from 'react-router'

import DataDetail from '@/common/components/modules/data-detail'
import { Card, CardContent } from '@/common/components/ui/card'
import { CONSTANT } from '@/common/constants'
import type { CommonResponse } from '@/common/types/response'
import { detailColumns } from '@/features/categories/detail-columns'
import type { Category } from '@/features/categories/types/category'
import { getApi } from '@/lib/http'
import { setUrlParams } from '@/lib/utils'

const DetailCategoryPage = (): React.JSX.Element => {
  const { id } = useParams()

  const [loadingData, setLoadingData] = React.useState<boolean>(true)
  const [data, setData] = React.useState<Category | null>(null)

  useEffect(() => {
    getApi<CommonResponse>(setUrlParams(CONSTANT.API_URL.CATEGORY_ADMIN_ID, id)).then(
      (res: CommonResponse) => {
        setData(res.results! as Category)
        setLoadingData(false)
        console.log('Detail Page:', res.results! as Category)
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

export default DetailCategoryPage
