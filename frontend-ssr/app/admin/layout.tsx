'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

import { AdminShell } from '@/src/admin-shell'

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  const isLoginScreen = pathname === '/admin123/login'

  if (isLoginScreen) {
    return <React.Fragment>{children}</React.Fragment>
  } else {
    return <AdminShell adminBasePath="/admin">{children}</AdminShell>
  }
}

export default AdminLayout
