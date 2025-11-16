import { Collapsible, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import * as Icon from 'lucide-react'
import React, { useEffect } from 'react'
import { type Location, NavLink } from 'react-router'

import { openMenu, selectLocation, selectMenu, toggleMenu } from '@/common/app-slice'
import { CollapsibleContent } from '@/common/components/ui/collapsible'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/common/components/ui/sidebar'
import { useAppDispatch, useAppSelector } from '@/common/hooks/use-store'
import type { Menu, MenuItem } from '@/common/types/data'
import { getLocalMessage } from '@/lib/utils'

/**
 * Side Menu Component
 *
 * @constructor
 */
const SideMenu = (): React.ReactNode => {
  const dispatch = useAppDispatch()
  const menu: Menu = useAppSelector(selectMenu)
  const currentLocation: Location | null = useAppSelector(selectLocation)

  useEffect(() => {
    Object.entries(menu).forEach(([key, value]) => {
      value.items?.forEach((v) => {
        if (v.url === currentLocation?.pathname) {
          dispatch(openMenu(key))
        }
      })
    })
  }, [])

  return (
    <SidebarContent>
      {Object.entries(menu).map(([key, value]) => (
        <Collapsible open={value.isOpened} className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger onClick={() => dispatch(toggleMenu(key))}>
                {getLocalMessage(`menus.${key}`)}
                <Icon.ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {value.items?.map((item: MenuItem) => {
                    const ItemIcon = Icon[item.icon!] as React.FC<any>

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          isActive={item.url! === currentLocation!.pathname}
                          asChild
                        >
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
  )
}

export default SideMenu
