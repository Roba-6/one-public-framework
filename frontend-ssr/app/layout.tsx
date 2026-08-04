import './globals.css'

import type { Metadata } from 'next'
import React from 'react'

import { OnePublicUI } from '@/src'

export const metadata: Metadata = {
  title: 'One Public Framework',
  description: 'A framework for building web applications.',
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <OnePublicUI>{children}</OnePublicUI>
      </body>
    </html>
  )
}

export default RootLayout
