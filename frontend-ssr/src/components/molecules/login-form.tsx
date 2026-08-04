'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'

import { selectAccessToken, setAccessToken } from '@/src/common/app-slice'
import { CONSTANT } from '@/src/common/constants'
import { useAppDispatch, useAppSelector } from '@/src/common/hooks/use-store'
import type { Login, LoginRequest, Token } from '@/src/common/types/authenticate'
import Password from '@/src/components/atoms/password'
import { Button } from '@/src/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { postApi } from '@/src/lib/http'
import { cn, getAdminPath, getLocalMessage } from '@/src/lib/utils'

const LoginFormSchema = z.object({
  username: z
    .string()
    .min(1, { message: getLocalMessage('messages.validations.username.required') }),
  password: z
    .string()
    .min(1, { message: getLocalMessage('messages.validations.password.required') }),
})

const LoginForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const accessToken: string = useAppSelector(selectAccessToken)
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { username: '', password: '' },
  })
  const submitForm = (values: Login) => {
    postApi<Token>(CONSTANT.API_URL.LOGIN, values as LoginRequest).then(
      (res: Token) => {
        dispatch(setAccessToken(res.accessToken))
        router.replace(getAdminPath())
      }
    )
  }

  useEffect(() => {
    if (accessToken) {
      router.replace(getAdminPath())
    }
  }, [accessToken, router])

  if (!accessToken) {
    return (
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card className="select-none">
          <CardHeader>
            <CardTitle className={cn('leading')}>
              {getLocalMessage('title.login')}
            </CardTitle>
            <CardDescription className="auto-typing">
              {getLocalMessage('messages.pleaseLogin')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitForm)}>
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <FormItem>
                          <FormLabel>{getLocalMessage('labels.user.name')}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="example"
                              {...field}
                              value={field.value as string}
                              autoComplete="username"
                              tabIndex={0}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <div className="grid gap-3">
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel>
                              {getLocalMessage('labels.user.password')}
                            </FormLabel>
                            <Link
                              href="#"
                              className={cn('link ms-auto text-sm')}
                              tabIndex={1}
                            >
                              {getLocalMessage('labels.forgetPassword')}
                            </Link>
                          </div>
                          <FormControl>
                            <Password field={field} tabIndex={0} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />
                  <div className="flex flex-col gap-3">
                    <Button type="submit" variant="default" className="button w-full">
                      {getLocalMessage('buttons.login')}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default LoginForm
