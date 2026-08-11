import * as Icon from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'

import {
  openMenu,
  selectLocation,
  selectMenu,
  toggleMenu,
} from '@/src/common/app-slice'
import { useAppDispatch, useAppSelector } from '@/src/common/hooks/use-store'
import type { Menu, MenuItem } from '@/src/common/types/data'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/src/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/src/components/ui/sidebar'
import { getLocalMessage } from '@/src/lib/client-utils'

/**
 * Side Menu Component
 *
 * @constructor
 */
const SideMenu = (): React.JSX.Element => {
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
    <React.Fragment>
      {Object.entries(menu).map(([key, value]) => (
        <Collapsible key={key} open={value.isOpened} className="group/collapsible">
          <SidebarGroup className="p-1">
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger
                className="cursor-pointer"
                onClick={() => dispatch(toggleMenu(key))}
              >
                {getLocalMessage(`menus.${key}`)}
                <Icon.ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {value.items
                    ?.filter((item) => item.show !== false)
                    .map((item: MenuItem) => {
                      const ItemIcon = Icon[item.icon!] as React.FC<any>

                      return (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton
                            isActive={item.url! === currentLocation!.pathname}
                            asChild
                          >
                            <Link
                              className="cursor-pointer"
                              href={item.url!}
                              onClick={() => console.log('Clicked', item.name)}
                            >
                              {ItemIcon && <ItemIcon />}
                              <span>{getLocalMessage(item.name)}</span>
                            </Link>
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
    </React.Fragment>
  )
}

export default SideMenu
