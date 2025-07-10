import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import type { ControllerRenderProps } from 'react-hook-form'

import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'

const Password = (props: {
  field: ControllerRenderProps<
    {
      username: string
      password: string
    },
    'password'
  >
}): React.ReactNode => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  return (
    <div className="relative">
      <Input
        {...props.field}
        type={showPassword ? 'text' : 'password'}
        value={props.field.value as string}
        autoComplete="current-password"
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-1 top-1/2 -translate-y-1/2 px-2"
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </Button>
    </div>
  )
}

export default Password
