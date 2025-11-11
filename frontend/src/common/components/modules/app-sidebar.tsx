import { Collapsible, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import {
  Calendar,
  ChevronDown,
  CircleGauge,
  Inbox,
  Search,
  Settings,
  User2,
} from 'lucide-react'
import { NavLink } from 'react-router'

import Logo from '@/common/components/atoms/logo'
import { CollapsibleContent } from '@/common/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/common/components/ui/sidebar'
import { CONSTANT } from '@/common/constants'
import type { MenuItem } from '@/common/types/data'
import { getAdminPath, getLocalMessage } from '@/lib/utils'

import { NavUser } from './nav-user'

const items: { [key: string]: MenuItem[] } = {
  system: [
    {
      title: 'menus.dashboard',
      url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_DASHBOARD,
      icon: CircleGauge,
    },
    {
      title: 'menus.configurations',
      url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_CONFIGURATION,
      icon: Settings,
    },
    {
      title: 'menus.users',
      url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_USER,
      icon: User2,
    },
    {
      title: 'Inbox',
      url: '#',
      icon: Inbox,
    },
    {
      title: 'Calendar',
      url: '#',
      icon: Calendar,
    },
    {
      title: 'Search',
      url: '#',
      icon: Search,
    },
  ],
}

const AppSidebar = () => {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <Logo size="sm" />
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(items).map(([key, value]) => {
          return (
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger>
                    {getLocalMessage(`menus.${key}`)}
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {value.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              className="cursor-pointer"
                              to={item.url!}
                              onClick={() => console.log('Clicked', item.title)}
                            >
                              <item.icon />
                              <span>{getLocalMessage(item.title)}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          )
        })}
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
