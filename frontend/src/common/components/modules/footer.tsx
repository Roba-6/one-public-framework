import React from 'react'

import Language from '@/common/components/atoms/language'
import ModeToggle from '@/common/components/modules/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar'

const Footer = (props: { appName: string }): React.ReactNode => {
  return (
    <footer className="sm:py-4 w-full absolute bottom-0 left-0">
      <div className="opf-container text-center">
        <div className="w-[25%] md:w-[50%] transition-all">
          <Avatar>
            <AvatarImage src="/assets/images/roba-small.png" alt="Roba" />
            <AvatarFallback>OPF</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-[75%] md:w-[50%] transition-all">
          <div className="ms-auto flex mb-4 items-center gap-2">
            <Language />
            <ModeToggle />
          </div>
          <div className="text-sm text-start text-neutral-400">
            &copy; {new Date().getFullYear()} {props.appName}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
