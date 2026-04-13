import React from 'react'
import { useNavigate } from 'react-router'

import { enqueueMessage } from '@/common/app-slice'
import EditForm from '@/common/components/modules/edit-form'
import { Card, CardContent } from '@/common/components/ui/card'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store'
import type { CommonResponse } from '@/common/types/response'
import { newFeatureItems } from '@/features/features/form-items'
import type { CreateFeatureRequest, Feature } from '@/features/features/types/feature'
import { getAdminPath } from '@/lib/functions'
import { postApi } from '@/lib/http'

const AddFeaturePage = (): React.JSX.Element => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()

  const submitForm = (data: Feature) => {
    console.debug('New Feature:', data)
    postApi<CommonResponse>(
      CONSTANT.API_URL.FEATURE_ADMIN,
      data as CreateFeatureRequest
    ).then((res: CommonResponse) => {
      console.debug('Add Feature:', res.results! as Feature)
      dispatch(
        enqueueMessage({
          message: {
            code: 'S2000001',
            message: 'Added Successfully',
            detail: null,
          },
          status: 200,
          type: 'success',
        })
      )
      nav(getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_FEATURE)
    })
  }

  return (
    <Card>
      <CardContent>
        <EditForm items={newFeatureItems} submitForm={submitForm} />
      </CardContent>
    </Card>
  )
}

export default AddFeaturePage
