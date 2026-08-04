'use client'

import React, { useEffect } from 'react'

import { loadComplete } from '@/src/common/app-slice'
import { CONSTANT } from '@/src/common/constants'
import { useAppDispatch } from '@/src/common/hooks/use-store'
import LoginForm from '@/src/components/molecules/login-form'

const LoginScreen = (): React.JSX.Element => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(loadComplete())
    }, CONSTANT.LOADING_DURATION)

    return () => clearTimeout(timeoutId)
  }, [dispatch])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginScreen
