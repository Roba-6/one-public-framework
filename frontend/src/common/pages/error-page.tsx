import React, { useEffect } from 'react'

import { Card, CardContent } from '@/common/components/ui/card'
import { ScrollArea, ScrollBar } from '@/common/components/ui/scroll-area'
import { useAppDispatch } from '@/common/hooks/use-store'
import { cn, completed } from '@/lib/utils'

const ErrorPage = ({ error }: { error?: any }): React.JSX.Element => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    completed()
  }, [dispatch])

  return (
    <div className="single-info-page">
      <main className="inner py-2 sm:py-8 w-full align-middle text-center">
        <h1 className="text-2xl font-bold">{error ? 'Oops!' : '404 Not Found'}</h1>
        {error ? <p>{error.message}</p> : <p>An unexpected error occurred.</p>}
        {error && (
          <Card className="p-0 mt-4">
            <CardContent className="p-0">
              <ScrollArea
                className={cn('p-4 text-[var(--color-descript-foreground)] text-start')}
              >
                <pre>
                  <code>{error.stack}</code>
                </pre>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

export default ErrorPage
