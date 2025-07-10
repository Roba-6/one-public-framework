import { Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'

/**
 * Spinner functional component.
 * Renders a loading spinner using a div container and an animated icon.
 * Uses a side effect to log a message when the component is rendered.
 *
 * @returns {React.ReactNode} React node containing the animated loading spinner.
 */
const Spinner = (props: { className?: string }): React.ReactNode => {
  useEffect(() => {
    console.log('Spinner')
  }, [])

  return (
    <div
      className={`w-full h-full absolute top-0 left-0 bg-white dark:bg-gray-950 ${props.className}`}
    >
      <div className="w-5 h-5 text-center absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      </div>
    </div>
  )
}

export default Spinner
