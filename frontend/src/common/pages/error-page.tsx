import React, { useEffect } from 'react'

import { ScrollArea, ScrollBar } from '@/common/components/ui/scroll-area'
import { useAppDispatch } from '@/common/hooks/use-store'
import { completed } from '@/lib/utils'

const ErrorPage = ({ error }: { error?: any }): React.JSX.Element => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    completed()
  }, [dispatch])

  return (
    <main className="single-info-page">
      <div className="p-2 sm:p-8 w-full align-middle text-center">
        <h1 className="text-2xl font-bold">{error ? 'Oops!' : '404 Not Found'}</h1>
        {error ? <p>{error.message}</p> : <p>An unexpected error occurred.</p>}
        {error && (
          <ScrollArea className="box mt-4 pe-2.5 pb-2.5 h-[400px] rounded-2xl overflow-hidden text-gray-500 text-start">
            <div className="p-2">
              <pre>
                <code>{error.stack}</code>
              </pre>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </div>
    </main>
  )
}

export default ErrorPage
