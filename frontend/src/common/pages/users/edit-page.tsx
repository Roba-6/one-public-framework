import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import { z } from 'zod/v4'

import { enqueueMessage } from '@/common/app-slice'
import { Button } from '@/common/components/ui/button'
import { Card, CardContent } from '@/common/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Skeleton } from '@/common/components/ui/skeleton'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store'
import type { CommonResponse } from '@/common/types/response'
import type { User, UserRequest } from '@/common/types/user'
import { getApi, postApi, putApi } from '@/lib/http'
import { arrayToObject, getLocalMessage, setUrlParams } from '@/lib/utils'

type TestType = 'name' | 'email' | 'password'

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
const UserFormSchema = z.object({
  name: z.string().min(1, { message: getLocalMessage('Username is required') }),
  password: z.string().min(1, { message: getLocalMessage('Password is required') }),
  email: z.string().min(1, { message: getLocalMessage('Email is required') }),
  lastname: z.string().min(1, { message: getLocalMessage('lastname is required') }),
})

const UserEditPage = (): React.ReactNode => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: arrayToObject(testData, 'name', 'defaultValue'),
  })
  const { search } = useLocation()
  const id = new URLSearchParams(search).get('id')
  const [loadingData, setLoadingData] = React.useState<boolean>(true)

  useEffect(() => {
    console.debug('form: ', form)
    if (id) {
      console.debug('edit mode')
      getApi<CommonResponse>(setUrlParams(CONSTANT.API_URL.USER_ADMIN_ID, id)).then(
        (res: CommonResponse) => {
          form.reset(res.results! as User)
          setLoadingData(false)
        }
      )
    } else {
      console.debug('add mode')
    }
  }, [form, id])

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
          nav(CONSTANT.ROUTE_URL.ADMIN + CONSTANT.ROUTE_URL.ADMIN_USER)
        }
      )
    }
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitForm)}>
            <div className="flex flex-col gap-6">
              {loadingData && id
                ? Array(3)
                    .fill(null)
                    .map((_, idx: number) => (
                      <div key={idx} className="grid grid-cols-6 gap-3">
                        <Skeleton className="my-2 h-4 w-auto" />
                        <Skeleton className="my-2 h-4 w-auto col-span-3" />
                      </div>
                    ))
                : testData.map((item, idx: number) => (
                    <FormField
                      key={idx}
                      control={form.control}
                      name={item.name as TestType}
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid grid-cols-6 gap-3">
                            <FormLabel>{item.label as string}</FormLabel>
                            <FormControl className="col-span-3">
                              <Input
                                type={item.type as string}
                                placeholder={item?.placeholder as string}
                                {...field}
                                value={field.value as string}
                                autoComplete={item?.autoComplete as string}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
              <div className="grid grid-cols-6 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="col-start-3"
                  onClick={() => {
                    nav(-1)
                  }}
                >
                  {getLocalMessage('buttons.cancel')}
                </Button>
                <Button type="submit">{getLocalMessage('buttons.create')}</Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default UserEditPage
