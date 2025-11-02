import '@/common/styles/atoms/spinner.css'

import React, { useEffect } from 'react'

import LoginForm from '@/common/components/modules/login-form'
import { useAppDispatch } from '@/common/hooks/use-store'
import { completed } from '@/lib/functions'

const LoginPage = (): React.ReactNode => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    completed()
  }, [dispatch])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
