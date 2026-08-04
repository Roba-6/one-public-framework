import React, { PropsWithChildren } from 'react'

import Site from '@/src/components/templates/site'

const SiteLayout = ({ children }: PropsWithChildren): React.JSX.Element => {
  return <Site>{children}</Site>
}

export default SiteLayout
