import { useRouter } from 'next/navigation'
import React from 'react'

import { Button } from '@/src/components/ui/button'
import { getLocalMessage } from '@/src/lib/client-utils'

export interface NaviButtonProps {
  messageId: string
  url?: string
  icon?: React.ReactNode
}

const NaviButton = (props: NaviButtonProps): React.JSX.Element => {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      onClick={() => {
        router.replace(props.url!)
      }}
    >
      {props.icon}
      {getLocalMessage(`buttons.${props.messageId}`)}
    </Button>
  )
}

export default NaviButton
