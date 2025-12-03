import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod/v4'

import { selectAccessToken, setAccessToken } from '@/common/app-slice'
import Password from '@/common/components/atoms/password'
import { Button } from '@/common/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/common/components/ui/card'
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
import { useAppDispatch, useAppSelector } from '@/common/hooks/use-store'
import type { Login, LoginRequest, Token } from '@/common/types/authenticate'
import { postApi } from '@/lib/http'
import { cn, getAdminPath } from '@/lib/utils'
import { getLocalMessage } from '@/lib/utils'

const LoginFormSchema = z.object({
  username: z.string().min(1, { message: getLocalMessage('Username is required') }),
  password: z.string().min(1, { message: getLocalMessage('Password is required') }),
})

const LoginForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const accessToken: string = useAppSelector(selectAccessToken)
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { username: '', password: '' },
  })
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const submitForm = (values: Login) => {
    postApi<Token>(CONSTANT.API_URL.LOGIN, values as LoginRequest).then(
      (res: Token) => {
        dispatch(setAccessToken(res.accessToken))
        nav(getAdminPath())
      }
    )
  }

  useEffect(() => {
    if (accessToken) {
      nav(getAdminPath())
    } else {
      setIsAuthenticated(!!accessToken)
    }
  }, [accessToken, nav])

  if (!accessToken && !isAuthenticated) {
    return (
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className={cn('leading')}>
              {getLocalMessage('title.login')}
            </CardTitle>
            <CardDescription>{getLocalMessage('messages.pleaseLogin')}</CardDescription>
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
                            <a
                              href="#"
                              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                            >
                              {getLocalMessage('labels.forgetPassword')}
                            </a>
                          </div>
                          <FormControl>
                            <Password field={field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full">
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
