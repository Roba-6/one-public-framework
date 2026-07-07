import React, { useEffect } from 'react'
import { NavLink } from 'react-router'

import logoDark from '@/assets/images/logo-dark.svg'
import logoLight from '@/assets/images/logo-light.svg'
import { selectAppSettings, type Setting } from '@/common/app-slice'
import { useAppSelector } from '@/common/hooks/use-store'
import { getEnv } from '@/lib/functions'
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
 * @returns {React.JSX.Element} A React node containing the logo and application name
 *                              styled with responsive design.
 */
const Logo = (props: { size?: LogoSize }): React.JSX.Element => {
  const appSettings: Setting = useAppSelector(selectAppSettings)

  /**
   * A variable or method responsible for applying or managing styles to a specific element or set of elements.
   * The `setStyles` functionality is typically used to dynamically assign, remove, or update CSS styles.
   * This may involve inline style manipulation, class assignment, or applying CSS rules programmatically.
   */
  const [styles, setStyles] = React.useState<string[]>([])

  const isCustomLogos: boolean = !!getEnv('UI_LOGO_PATH')
  let isDarkLogo: boolean = false
  let customizeLogos: string[] = []

  if (isCustomLogos) {
    customizeLogos = (getEnv('UI_LOGO_PATH') as string).split(',')
    if (customizeLogos.length > 1) {
      isDarkLogo = true
    }
  }

  useEffect(() => {
    switch (props.size) {
      case 'sm':
        setStyles(['', 'w-6', 'ps-2 pt-1 text-[11.7pt]'])
        break
      default:
        setStyles(['', 'w-[30px] max-w-[100vw]', 'px-3 pb-2 pt-2.5 pe-0 text-2xl'])
    }
  }, [props, appSettings])

  return (
    <NavLink
      to=""
      className={cn(
        'flex cursor-pointer select-none items-center whitespace-nowrap',
        'text-[var(--color-ash-900)] dark:text-[var(--color-ash-300)] hover:opacity-75',
        styles[0]
      )}
    >
      <div className={styles[1]}>
        <img
          src={isCustomLogos ? customizeLogos[0] : logoLight}
          alt={appSettings.name}
          className="block w-full dark:hidden"
        />
        <img
          src={isDarkLogo ? customizeLogos[1] : logoDark}
          alt={appSettings.name}
          className="hidden w-full dark:block"
        />
      </div>
      <h1 className={cn('flex font-[Sense] uppercase tracking-widest', styles[2])}>
        {appSettings.name}
      </h1>
    </NavLink>
  )
}

export default Logo
