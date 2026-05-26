import React from 'react'
import { useNavigate } from 'react-router'

import { enqueueMessage } from '@/common/app-slice'
import EditForm from '@/common/components/modules/edit-form'
import { Card, CardContent } from '@/common/components/ui/card'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store'
import type { CommonResponse } from '@/common/types/response'
import { newAttachmentItems } from '@/features/attachments/form-items'
import type {
  Attachment,
  CreateAttachmentRequest,
} from '@/features/attachments/types/attachment'
import { getAdminPath } from '@/lib/functions'
import { postApi } from '@/lib/http'

const AddAttachmentPage = (): React.JSX.Element => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()

  const submitForm = (data: Attachment) => {
    postApi<CommonResponse>(
      CONSTANT.API_URL.ATTACHMENT_ADMIN,
      data as CreateAttachmentRequest
    ).then((res: CommonResponse) => {
      console.debug('Add Attachment:', res.results! as Attachment)
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
      nav(getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_ATTACHMENT)
    })
  }

  return (
    <Card>
      <CardContent>
        <EditForm items={newAttachmentItems} submitForm={submitForm} />
      </CardContent>
    </Card>
  )
}

export default AddAttachmentPage
