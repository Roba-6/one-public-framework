import React from 'react'

import Logo from '@/common/components/atoms/logo'
import SideMenu from '@/common/components/atoms/side-menu'
import { Sidebar, SidebarFooter, SidebarHeader } from '@/common/components/ui/sidebar'

import { NavUser } from './nav-user'

const AppSidebar = (): React.ReactNode => {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <Logo size="sm" />
      </SidebarHeader>
      <SideMenu />
      <SidebarFooter>
        <NavUser
          user={{
            name: 'shadcn',
            email: 'm@example.com',
            avatar: '/avatars/shadcn.jpg',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
