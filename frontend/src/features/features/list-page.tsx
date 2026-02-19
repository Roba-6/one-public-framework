import React, { useEffect } from 'react'

import DataList from '@/common/components/modules/data-list'
import { CONSTANT } from '@/common/constants'
import type { CommonResponse } from '@/common/types/response'
import { actions, listColumns } from '@/features/features/list-columns'
import type { Feature } from '@/features/features/types/feature'
import { getApi } from '@/lib/http'

const FeatureListPage = (): React.JSX.Element => {
  const [data, setData] = React.useState<Feature[]>([])

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    getApi<CommonResponse>(CONSTANT.API_URL.FEATURE_ADMIN, {
      orderBy: 'created_at_desc',
    }).then((res: CommonResponse) => {
      setData(res.results as Feature[])
    })
  }

  return (
    <div className="w-full">
      <DataList<Feature>
        columns={listColumns}
        data={data}
        actions={actions}
        selectable
        deleteUrl={CONSTANT.API_URL.FEATURE_ADMIN_ID}
      />
    </div>
  )
}

export default FeatureListPage
