import '~/common/styles/components/atoms/logo.css'

import React from 'react'

import logoDark from '~/assets/logo-dark.svg'
import logoLight from '~/assets/logo-light.svg'

/**
 * Logo component that renders the application's logo.
 *
 * This component includes an image that dynamically switches between
 * a light mode and dark mode version depending on the user's theme preference.
 * It also includes a header displaying the name or description of the application.
 *
 * @returns {React.ReactNode} The rendered JSX for the logo component.
 */
const Logo = (): React.ReactNode => {
  return (
    <div className="logo">
      <div className="logo-img">
        <img src={logoLight} alt="React Router" className="block w-full dark:hidden" />
        <img src={logoDark} alt="React Router" className="hidden w-full dark:block" />
      </div>
      <h1>One Public Framework</h1>
    </div>
  )
}

export default Logo
