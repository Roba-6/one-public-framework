import React from 'react'

import Logo from '@/src/components/atoms/logo'
import SideMenu from '@/src/components/atoms/side-menu'
import { NavUser } from '@/src/components/molecules/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/src/components/ui/sidebar'

const AppSidebar = (): React.ReactNode => {
  return (
    <Sidebar variant="inset" className="select-none">
      <SidebarHeader className="py-2.5">
        <Logo size="sm" appName="OPF" />
      </SidebarHeader>
      <SidebarContent className="py-3">
        <SideMenu />
      </SidebarContent>
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
