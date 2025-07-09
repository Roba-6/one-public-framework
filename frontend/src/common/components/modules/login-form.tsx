import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod/v4'

import { selectAccessToken, setAccessToken } from '@/common/app-slice.ts'
import { Button } from '@/common/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/common/components/ui/card.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/common/components/ui/form.tsx'
import { Input } from '@/common/components/ui/input.tsx'
import { CONSTANT } from '@/common/constants.ts'
import { useAppDispatch, useAppSelector } from '@/common/hooks/use-store.ts'
import type { Login, LoginRequest, Token } from '@/common/types/authenticate'
import { postApi } from '@/lib/http.ts'
import { cn } from '@/lib/utils.ts'
import { getLocalMessage } from '@/lib/utils.ts'

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
        nav('/admin')
      }
    )
  }

  useEffect(() => {
    if (accessToken) {
      nav('/admin')
    } else {
      setIsAuthenticated(!!accessToken)
    }
  }, [accessToken, nav])

  if (!accessToken && !isAuthenticated) {
    return (
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
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
                          <FormLabel>{getLocalMessage('labels.username')}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="example"
                              {...field}
                              value={field.value as string}
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
                            <FormLabel>{getLocalMessage('labels.password')}</FormLabel>
                            <a
                              href="#"
                              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                            >
                              Forgot your password?
                            </a>
                          </div>
                          <FormControl>
                            <Input {...field} value={field.value as string} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                    <Button variant="outline" className="w-full">
                      Login with Google
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <a href="#" className="underline underline-offset-4">
                    Sign up
                  </a>
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
