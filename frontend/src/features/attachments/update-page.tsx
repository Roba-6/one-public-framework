import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { enqueueMessage } from '@/common/app-slice'
import EditForm from '@/common/components/modules/edit-form'
import { Card, CardContent } from '@/common/components/ui/card'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store'
import type { CommonResponse } from '@/common/types/response'
import { attachmentItems } from '@/features/attachments/form-items'
import type {
  Attachment,
  UpdateAttachmentRequest,
} from '@/features/attachments/types/attachment'
import { getAdminPath } from '@/lib/functions'
import { getApi, putApi } from '@/lib/http'
import { setUrlParams } from '@/lib/utils'

const UpdateAttachmentPage = (): React.JSX.Element => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const { id } = useParams()

  const [loadingData, setLoadingData] = React.useState<boolean>(true)
  const [data, setData] = React.useState<Attachment | null>(null)

  useEffect(() => {
    if (id) {
      getApi<CommonResponse>(
        setUrlParams(CONSTANT.API_URL.ATTACHMENT_ADMIN_ID, id)
      ).then((res: CommonResponse) => {
        setData(res.results! as Attachment)
        setLoadingData(false)
        console.log('Update Page:', res.results! as Attachment)
      })
    }
  }, [id])

  const submitForm = (values: Attachment) => {
    console.debug('Update Attachment:', values)
    if (id) {
      putApi<CommonResponse>(
        setUrlParams(CONSTANT.API_URL.ATTACHMENT_ADMIN_ID, id),
        values as UpdateAttachmentRequest
      ).then((res: CommonResponse) => {
        console.log(res.results! as Attachment)
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
        nav(getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_ATTACHMENT)
      })
    }
  }

  return (
    <Card>
      <CardContent>
        <EditForm<Attachment>
          id={id as string}
          data={data!}
          loadingData={loadingData}
          items={attachmentItems}
          submitForm={submitForm}
        />
      </CardContent>
    </Card>
  )
}

export default UpdateAttachmentPage
