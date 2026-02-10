import React, { useEffect } from 'react'

import DataList from '@/common/components/modules/data-list'
import { CONSTANT } from '@/common/constants'
import type { CommonResponse } from '@/common/types/response'
import { listColumns } from '@/features/features/list-columns'
import { actions } from '@/features/features/list-columns.ts'
import type { Feature } from '@/features/features/types/feature'
import { getApi } from '@/lib/http'

const FeatureListPage = (): React.JSX.Element => {
  const [data, setData] = React.useState<Feature[]>([])

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    getApi<CommonResponse>(CONSTANT.API_URL.FEATURE_ADMIN, {}).then(
      (res: CommonResponse) => {
        setData(res.results as Feature[])
      }
    )
  }

  return (
    <div className="w-full">
      <DataList<Feature>
        columns={listColumns}
        data={data}
        actions={actions}
        selectable
      />
    </div>
  )
}

export default FeatureListPage
