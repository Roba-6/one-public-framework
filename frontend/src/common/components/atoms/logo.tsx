import React, { useEffect } from 'react'
import { NavLink } from 'react-router'

import logoDark from '@/assets/logo-dark.svg'
import logoLight from '@/assets/logo-light.svg'
import { selectAppSettings, type Setting } from '@/common/app-slice'
import { useAppSelector } from '@/common/hooks/use-store'
import { cn } from '@/lib/utils'

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
  const appSettings: Setting = useAppSelector(selectAppSettings)

  /**
   * A variable or method responsible for applying or managing styles to a specific element or set of elements.
   * The `setStyles` functionality is typically used to dynamically assign, remove, or update CSS styles.
   * This may involve inline style manipulation, class assignment, or applying CSS rules programmatically.
   */
  const [styles, setStyles] = React.useState<string[]>([])

  useEffect(() => {
    switch (props.size) {
      case 'sm':
        setStyles(['', 'w-6', 'ps-2 pt-1 text-[11.7pt]'])
        break
      default:
        setStyles(['', 'w-[30px] max-w-[100vw]', 'px-3 pb-2 pt-2.5 text-2xl'])
    }
  }, [props, appSettings])

  return (
    <NavLink
      to=""
      className={cn(
        'flex items-center whitespace-nowrap cursor-pointer select-none',
        styles[0]
      )}
    >
      <div className={styles[1]}>
        <img
          src={logoLight}
          alt={appSettings.name}
          className="block w-full dark:hidden"
        />
        <img
          src={logoDark}
          alt={appSettings.name}
          className="hidden w-full dark:block"
        />
      </div>
      <h1
        className={cn(
          'logo-text text-black dark:text-white tracking-widest font-[Sense]',
          styles[2]
        )}
      >
        <div className="relative">
          <div className="autoTyping" data-text={appSettings.name}>
            {appSettings.name}
          </div>
          <div className="invisible">&nbsp;</div>
        </div>
      </h1>
    </NavLink>
  )
}

export default Logo
