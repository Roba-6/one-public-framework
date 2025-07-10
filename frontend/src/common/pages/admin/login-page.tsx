import React, { useEffect } from 'react'

import { loadComplete } from '@/common/app-slice.ts'
import LoginForm from '@/common/components/modules/login-form.tsx'
import { useAppDispatch } from '@/common/hooks/use-store.ts'

const LoginPage = (): React.ReactNode => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadComplete())
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
