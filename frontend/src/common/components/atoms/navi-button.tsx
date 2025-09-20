import React from 'react'
import { useNavigate } from 'react-router'

import { Button } from '@/common/components/ui/button.tsx'
import { getLocalMessage } from '@/lib/utils.ts'

export interface NaviButtonProps {
  messageId: string
  url?: string
  icon?: React.ReactNode
}

const NaviButton = (props: NaviButtonProps) => {
  const nav = useNavigate()

  return (
    <Button
      variant="outline"
      onClick={() => {
        nav(props.url!)
      }}
    >
      {props.icon}
      {getLocalMessage(`buttons.${props.messageId}`)}
    </Button>
  )
}

export default NaviButton
