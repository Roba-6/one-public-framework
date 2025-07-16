import React, { useEffect } from 'react'

import logoDark from '@/assets/logo-dark.svg'
import logoLight from '@/assets/logo-light.svg'
import { selectAppName } from '@/common/app-slice'
import { useAppSelector } from '@/common/hooks/use-store'

export type LogoSize = 'sm' | 'md' | 'lg'

/**
 * Renders the logo of the application along with the application name.
 *
 * The appearance and size of the logo can be adjusted dynamically based on the
 * provided `props.size` value.
 * The component also adapts to light and dark themes by conditionally rendering
 * appropriate assets.
 *
 * @param {Object} props - The property object.
 * @param {LogoSize} [props.size] - An optional size specification for the logo.
 *                                  Supports `'sm'` for a smaller logo size.
 *                                  Defaults to a standard size if not provided.
 * @returns {React.ReactNode} A React node containing the logo and application name
 *                            styled with responsive design.
 */
const Logo = (props: { size?: LogoSize }): React.ReactNode => {
  const appName: string = useAppSelector(selectAppName)

  /**
   * A variable or method responsible for applying or managing styles to a specific element or set of elements.
   * The `setStyles` functionality is typically used to dynamically assign, remove, or update CSS styles.
   * This may involve inline style manipulation, class assignment, or applying CSS rules programmatically.
   */
  const [styles, setStyles] = React.useState<string[]>([])

  useEffect(() => {
    switch (props.size) {
      case 'sm':
        setStyles(['w-8', 'p-2 text-md font-bold'])
        break
      default:
        setStyles([
          'w-[12vw] sm:w-[60px] max-w-[100vw]',
          'p-2 text-[6vw] sm:text-3xl font-bold',
        ])
    }
  }, [props])

  return (
    <div className="flex items-center whitespace-nowrap">
      <div className={`sm:p-1 ${styles[0]}`}>
        <img src={logoLight} alt="React Router" className="block w-full dark:hidden" />
        <img src={logoDark} alt="React Router" className="hidden w-full dark:block" />
      </div>
      <h1 className={`text-black dark:text-white ${styles[1]}`}>{appName}</h1>
    </div>
  )
}

export default Logo
