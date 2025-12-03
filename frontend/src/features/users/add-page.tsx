import React from 'react'
import { useNavigate } from 'react-router'

import { enqueueMessage } from '@/common/app-slice'
import EditForm from '@/common/components/modules/edit-form'
import { Card, CardContent } from '@/common/components/ui/card'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store'
import type { CommonResponse } from '@/common/types/response'
import { newUserItems } from '@/features/users/form-items'
import type { CreateUserRequest, User } from '@/features/users/types/user'
import { postApi } from '@/lib/http'
import { getAdminPath } from '@/lib/utils'

// const UserFormSchema = z.object(arrayToObject(testData, 'name', 'validate'))

const AddUserPage = (): React.JSX.Element => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()

  const submitForm = (data: User) => {
    console.debug('New User:', data)
    postApi<CommonResponse>(
      CONSTANT.API_URL.USER_ADMIN,
      data as CreateUserRequest
    ).then((res: CommonResponse) => {
      console.debug('Add User:', res.results! as User)
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
      nav(getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_USER)
    })
  }

  return (
    <Card>
      <CardContent>
        <EditForm items={newUserItems} submitForm={submitForm} />
      </CardContent>
    </Card>
  )
}

export default AddUserPage
