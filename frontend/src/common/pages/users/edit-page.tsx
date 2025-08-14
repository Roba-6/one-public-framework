import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import { z } from 'zod/v4'

import { enqueueMessage } from '@/common/app-slice.ts'
import { Button } from '@/common/components/ui/button.tsx'
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
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store.ts'
import type { CommonResponse } from '@/common/types/response'
import type { User, UserRequest } from '@/common/types/user'
import { getApi, postApi, putApi } from '@/lib/http'
import { getLocalMessage, setUrlParams } from '@/lib/utils'

const UserFormSchema = z.object({
  name: z.string().min(1, { message: getLocalMessage('Username is required') }),
  password: z.string().min(1, { message: getLocalMessage('Password is required') }),
  email: z.string().min(1, { message: getLocalMessage('Email is required') }),
})

const UserEditPage = (): React.ReactNode => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: { name: '', password: '', email: '' },
  })
  const { search } = useLocation()
  const id = new URLSearchParams(search).get('id')

  useEffect(() => {
    if (id) {
      console.debug('edit mode')
      getApi<CommonResponse>(setUrlParams(CONSTANT.API_URL.USER_ADMIN_ID, id)).then(
        (res: CommonResponse) => {
          form.reset(res.results! as User)
        }
      )
    } else {
      console.debug('add mode')
    }
  }, [])

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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 gap-3">
                      <FormLabel>{getLocalMessage('labels.user.name')}</FormLabel>
                      <FormControl className="col-span-3">
                        <Input
                          placeholder="yamada_taro"
                          {...field}
                          value={field.value as string}
                          autoComplete="username"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 gap-3">
                      <FormLabel>{getLocalMessage('labels.user.password')}</FormLabel>
                      <FormControl className="col-span-3">
                        <Input
                          type="password"
                          {...field}
                          value={field.value as string}
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-6 gap-3">
                      <FormLabel>{getLocalMessage('labels.user.email')}</FormLabel>
                      <FormControl className="col-span-3">
                        <Input
                          placeholder="test@test.com"
                          {...field}
                          value={field.value as string}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
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
