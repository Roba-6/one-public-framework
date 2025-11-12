import { Collapsible, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import * as Icon from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router'

import { selectMenu } from '@/common/app-slice'
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
import { useAppSelector } from '@/common/hooks/use-store'
import type { MenuItem } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

import { NavUser } from './nav-user'

const AppSidebar = () => {
  const menu: { [key: string]: MenuItem[] } = useAppSelector(selectMenu)

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <Logo size="sm" />
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(menu).map(([key, value]) => (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  {getLocalMessage(`menus.${key}`)}
                  <Icon.ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {value.map((item: MenuItem) => {
                      const ItemIcon = Icon[item.icon!] as React.FC<any>

                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              className="cursor-pointer"
                              to={item.url!}
                              onClick={() => console.log('Clicked', item.title)}
                            >
                              {ItemIcon && <ItemIcon />}
                              <span>{getLocalMessage(item.title)}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
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
