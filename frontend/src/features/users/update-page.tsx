import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { z } from 'zod/v4'

import { enqueueMessage } from '@/common/app-slice'
import EditForm from '@/common/components/modules/edit-form'
import { Card, CardContent } from '@/common/components/ui/card'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store'
import type { CommonResponse } from '@/common/types/response'
import type { User, UserRequest } from '@/common/types/user'
import { getApi, postApi, putApi } from '@/lib/http'
import { getAdminPath, getLocalMessage, setUrlParams } from '@/lib/utils'

const testData = [
  {
    name: 'name',
    label: getLocalMessage('labels.user.name'),
    type: 'text',
    placeholder: 'yamada_taro',
    autoComplete: 'username',
    defaultValue: '',
    validate: z.string().min(1, { message: getLocalMessage('Username is required') }),
  },
  {
    name: 'password',
    label: getLocalMessage('labels.user.password'),
    type: 'password',
    autoComplete: 'new-password',
    defaultValue: '',
    validate: z.string().min(1, { message: getLocalMessage('Password is required') }),
  },
  {
    name: 'email',
    label: getLocalMessage('labels.user.email'),
    type: 'text',
    placeholder: 'test@test.com',
    defaultValue: '',
    validate: z.string().min(1, { message: getLocalMessage('Email is required') }),
  },
  {
    name: 'lastname',
    label: getLocalMessage('labels.user.lastname'),
    type: 'text',
    placeholder: 'Yamada',
    defaultValue: '',
    validate: z.string().min(1, { message: getLocalMessage('lastname is required') }),
  },
]

// const UserFormSchema = z.object(arrayToObject(testData, 'name', 'validate'))

const UpdateUserPage = (): React.ReactNode => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()

  const { search } = useLocation()
  const id = new URLSearchParams(search).get('id')
  const [loadingData, setLoadingData] = React.useState<boolean>(true)
  const [data, setData] = React.useState<User | null>(null)

  useEffect(() => {
    if (id) {
      console.debug('edit mode')
      getApi<CommonResponse>(setUrlParams(CONSTANT.API_URL.USER_ADMIN_ID, id)).then(
        (res: CommonResponse) => {
          setData(res.results! as User)
          setLoadingData(false)
        }
      )
    } else {
      console.debug('add mode')
    }
  }, [id])

  const submitForm = (values: User) => {
    console.log(values)
    if (id) {
      putApi<CommonResponse>(
        setUrlParams(CONSTANT.API_URL.USER_ADMIN_ID, id),
        values
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
      })
    } else {
      postApi<CommonResponse>(CONSTANT.API_URL.USER_ADMIN, values as UserRequest).then(
        (res: CommonResponse) => {
          console.log(res.results! as User)
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
        }
      )
    }
  }

  return (
    <Card>
      <CardContent>
        <EditForm
          id={id as string}
          data={data!}
          loadingData={loadingData}
          testData={testData}
          submitForm={submitForm}
        />
      </CardContent>
    </Card>
  )
}

export default UpdateUserPage
