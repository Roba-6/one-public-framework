import '~/common/styles/components/atoms/spinner.css'

import { Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'

/**
 * Spinner functional component.
 * Renders a loading spinner using a div container and an animated icon.
 * Uses a side effect to log a message when the component is rendered.
 *
 * @returns {React.ReactNode} React node containing the animated loading spinner.
 */
const Spinner = (): React.ReactNode => {
  useEffect(() => {
    console.log('Spinner')
  }, [])

  return (
    <div className="loader">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    </div>
  )
}

export default Spinner
