import React, { type PropsWithChildren } from 'react'

import Logo from '@/src/components/atoms/logo'

const Site = ({ children }: PropsWithChildren): React.JSX.Element => {
  return (
    <div className="single-page">
      <div className="container mx-auto min-h-screen relative">
        <header className="inner py-2 w-full flex items-center">
          <Logo appName={'One Public Framework'} />
        </header>
        {/*<Separator />*/}
        <main className="inner pt-4 pb-36">{children}</main>
        {/*<Footer appName={appName} />*/}
      </div>
    </div>
  )
}

export default Site
