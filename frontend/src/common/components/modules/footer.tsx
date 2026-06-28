import React from 'react'

import Language from '@/common/components/atoms/language'
import ModeToggle from '@/common/components/modules/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar'
import { Card, CardContent } from '@/common/components/ui/card.tsx'
import { cn } from '@/lib/utils.ts'

const Footer = (props: { appName: string }): React.ReactNode => {
  return (
    <footer className="sm:py-4 w-full absolute bottom-0 left-0">
      <Card
        className={cn(
          'py-4 sm:py-6 border-0 border-t-[1px] rounded-none',
          'sm:border-[1px] sm:rounded-xl'
        )}
      >
        <CardContent className={cn('flex px-4 sm:px-6 justify-between')}>
          <div className="w-[20%] md:w-[50%] transition-all">
            <Avatar>
              <AvatarImage src="/assets/images/author.png" alt="Roba" />
              <AvatarFallback>OPF</AvatarFallback>
            </Avatar>
          </div>
          <div className="w-[80%] md:w-[50%] transition-all">
            <div className="ms-auto flex mb-4 items-center gap-2">
              <Language />
              <ModeToggle />
            </div>
            <div className="text-sm text-start text-[var(--color-descript-foreground)]">
              &copy; {new Date().getFullYear()} {props.appName}. All rights reserved.
            </div>
          </div>
        </CardContent>
      </Card>
    </footer>
  )
}
export default Footer
