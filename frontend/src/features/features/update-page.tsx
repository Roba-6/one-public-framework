import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { enqueueMessage } from '@/common/app-slice'
import EditForm from '@/common/components/modules/edit-form'
import { Card, CardContent } from '@/common/components/ui/card'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store'
import type { CommonResponse } from '@/common/types/response'
import { featureItems } from '@/features/features/form-items'
import type { Feature, UpdateFeatureRequest } from '@/features/features/types/feature'
import { getAdminPath } from '@/lib/functions'
import { getApi, putApi } from '@/lib/http'
import { setUrlParams } from '@/lib/utils'

const UpdateFeaturePage = (): React.JSX.Element => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const { id } = useParams()

  const [loadingData, setLoadingData] = React.useState<boolean>(true)
  const [data, setData] = React.useState<Feature | null>(null)

  useEffect(() => {
    if (id) {
      getApi<CommonResponse>(setUrlParams(CONSTANT.API_URL.FEATURE_ADMIN_ID, id)).then(
        (res: CommonResponse) => {
          setData(res.results! as Feature)
          setLoadingData(false)
          console.log('Update Page:', res.results! as Feature)
        }
      )
    }
  }, [id])

  const submitForm = (values: Feature) => {
    console.debug('Update Feature:', values)
    if (id) {
      putApi<CommonResponse>(
        setUrlParams(CONSTANT.API_URL.FEATURE_ADMIN_ID, id),
        values as UpdateFeatureRequest
      ).then((res: CommonResponse) => {
        console.log(res.results! as Feature)
        dispatch(
          enqueueMessage({
            message: {
              code: 'S2000002',
              message: 'Updated Successfully',
              detail: null,
            },
            status: 200,
            type: 'success',
          })
        )
        nav(getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_FEATURE)
      })
    }
  }

  return (
    <Card>
      <CardContent>
        <EditForm<Feature>
          id={id as string}
          data={data!}
          loadingData={loadingData}
          items={featureItems}
          submitForm={submitForm}
        />
      </CardContent>
    </Card>
  )
}

export default UpdateFeaturePage
