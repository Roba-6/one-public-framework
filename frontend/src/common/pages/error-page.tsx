import React, { useEffect } from 'react'

import { ScrollArea, ScrollBar } from '@/common/components/ui/scroll-area'
import { useAppDispatch } from '@/common/hooks/use-store'
import { completed } from '@/lib/functions'

const ErrorPage = (): React.ReactNode => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    completed()
  }, [dispatch])

  return (
    <main className="single-info-page">
      <div className="p-2 sm:p-8 w-full align-middle text-center">
        <h1 className="text-2xl font-bold">Oops!</h1>
        <p>An unexpected error occurred.</p>
        <ScrollArea className="box mt-4 pe-2.5 pb-2.5 h-[400px] rounded-2xl overflow-hidden text-gray-500 text-start">
          <div className="p-2">
            <pre>
              <code>abc</code>
            </pre>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </main>
  )
}

export default ErrorPage
