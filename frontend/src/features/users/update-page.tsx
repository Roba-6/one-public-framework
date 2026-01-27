import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { enqueueMessage } from '@/common/app-slice'
import EditForm from '@/common/components/modules/edit-form'
import { Card, CardContent } from '@/common/components/ui/card'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store'
import type { CommonResponse } from '@/common/types/response'
import { userItems } from '@/features/users/form-items'
import type { UpdateUserRequest, User } from '@/features/users/types/user'
import { getApi, putApi } from '@/lib/http'
import { getAdminPath, setUrlParams } from '@/lib/utils'

// const UserFormSchema = z.object(arrayToObject(testData, 'name', 'validate'))

const UpdateUserPage = (): React.JSX.Element => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const { id } = useParams()

  const [loadingData, setLoadingData] = React.useState<boolean>(true)
  const [data, setData] = React.useState<User | null>(null)

  useEffect(() => {
    if (id) {
      getApi<CommonResponse>(setUrlParams(CONSTANT.API_URL.USER_ADMIN_ID, id)).then(
        (res: CommonResponse) => {
          setData(res.results! as User)
          setLoadingData(false)
          console.log('Update Page:', res.results! as User)
        }
      )
    }
  }, [id])

  const submitForm = (values: User) => {
    console.debug('Update User:', values)
    if (id) {
      putApi<CommonResponse>(
        setUrlParams(CONSTANT.API_URL.USER_ADMIN_ID, id),
        values as UpdateUserRequest
      ).then((res: CommonResponse) => {
        console.log(res.results! as User)
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
        nav(getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_USER)
      })
    }
  }

  return (
    <Card>
      <CardContent>
        <EditForm<User>
          id={id as string}
          data={data!}
          loadingData={loadingData}
          items={userItems}
          submitForm={submitForm}
        />
      </CardContent>
    </Card>
  )
}

export default UpdateUserPage
