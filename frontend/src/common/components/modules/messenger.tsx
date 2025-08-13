import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { type AppMessage, dequeueMessage, selectMessages } from '@/common/app-slice'
import { Toaster } from '@/common/components/ui/sonner'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch, useAppSelector } from '@/common/hooks/use-store'
import type { Message } from '@/common/types/response'
import { getLocalMessage } from '@/lib/utils'

const Messenger = (): React.ReactNode => {
  const dispatch = useAppDispatch()
  const appMessages: AppMessage[] = useAppSelector(selectMessages)
  const shown = useRef(new Set<string>())

  useEffect(() => {
    appMessages.forEach((msg: AppMessage) => {
      if (shown.current.has(msg.id)) return
      shown.current.add(msg.id)

      const message: Message = msg.message!
      const title = message.message ? message.message : ''
      const data = {
        id: msg.id,
        description: (
          <>
            <pre className="text-justify text-wrap">{String(message.detail || '')}</pre>
            <code className="text-neutral-400">{message.code}</code>
          </>
        ),
        duration: msg.sticky ? Infinity : 0,
        action: msg.sticky
          ? {
              label: getLocalMessage('buttons.close'),
              onClick: () => {
                toast.dismiss(msg.id)
                dispatch(dequeueMessage(msg.id))
              },
            }
          : undefined,
      }

      if (msg.type === 'error') {
        toast.error(title ?? getLocalMessage('title.error'), data)
      } else if (msg.type === getLocalMessage('title.success')) {
        toast.success(title ?? 'Success', data)
      } else if (msg.type === getLocalMessage('title.info')) {
        toast.info(title ?? 'Info', data)
      } else if (msg.type === getLocalMessage('title.warning')) {
        toast.warning(title ?? 'Warning', data)
      } else {
        toast(message.message ?? 'Unknown', data)
      }

      //
      if (!msg.sticky) {
        const t = setTimeout(() => {
          dispatch(dequeueMessage(msg.id))
          shown.current.delete(msg.id)
        }, CONSTANT.MESSENGER_DURATION)
        return () => clearTimeout(t)
      }
    })

    shown.current.forEach((id) => {
      if (!appMessages.some((x) => x.id === id)) {
        toast.dismiss(id)
        shown.current.delete(id)
      }
    })
  }, [appMessages, dispatch])

  return <Toaster position="top-center" />
}

export default Messenger
