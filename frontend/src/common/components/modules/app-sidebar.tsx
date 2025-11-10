import { Collapsible, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { IconDashboard } from '@tabler/icons-react'
import {
  Calendar,
  ChevronDown,
  Inbox,
  Plus,
  Search,
  Settings,
  User2,
} from 'lucide-react'
import { useNavigate } from 'react-router'

import Logo from '@/common/components/atoms/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/common/components/ui/sidebar'
import { CONSTANT } from '@/common/constants'
import { getAdminPath, getLocalMessage } from '@/lib/utils'

import { NavUser } from './nav-user'

const items = [
  {
    title: getLocalMessage('menus.dashboard'),
    url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_DASHBOARD,
    icon: IconDashboard,
  },
  {
    title: getLocalMessage('menus.configurations'),
    url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_CONFIGURATION,
    icon: Settings,
  },
  {
    title: getLocalMessage('menus.users'),
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
]

const AppSidebar = () => {
  const nav = useNavigate()
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <Logo size="sm" />
      </SidebarHeader>
      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Application
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        className="cursor-pointer"
                        onClick={() => {
                          nav(item.url)
                        }}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </Collapsible>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent></SidebarGroupContent>
        </SidebarGroup>
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
