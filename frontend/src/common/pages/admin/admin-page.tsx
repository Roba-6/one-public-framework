import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'

import { selectAccessToken, setAccessToken } from '@/common/app-slice'
import AppSidebar from '@/common/components/modules/app-sidebar'
import BreadcrumbBar from '@/common/components/modules/breadcrumb-bar'
import { Separator } from '@/common/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/common/components/ui/sidebar'
import { CONSTANT } from '@/common/constants'
import { useUrlChange } from '@/common/hooks/use-current-url'
import { useAppDispatch, useAppSelector } from '@/common/hooks/use-store'
import { getAdminPath } from '@/lib/functions'
import { getApi } from '@/lib/http'
import { completed } from '@/lib/utils'

const AdminPage = (): React.JSX.Element => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const accessToken: string = useAppSelector(selectAccessToken)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useUrlChange()

  useEffect(() => {
    const fetch = async () => {
      try {
        if (accessToken) {
          // TODO: set current user info
          await getApi(CONSTANT.API_URL.ME)
          setIsAuthenticated(true)
          completed()
        } else {
          dispatch(setAccessToken(''))
          nav(getAdminPath() + CONSTANT.ROUTE_URL.LOGIN)
        }
      } catch (error) {
        console.error(error)
        dispatch(setAccessToken(''))
        nav(getAdminPath() + CONSTANT.ROUTE_URL.LOGIN)
      }
    }
    void fetch()
  }, [accessToken, dispatch, nav])

  return (
    <React.Fragment>
      {accessToken && isAuthenticated && (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
              <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger />
                <Separator
                  orientation="vertical"
                  className="mx-2 data-[orientation=vertical]:h-4"
                />
                <BreadcrumbBar />
              </div>
            </header>
            <main className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 md:gap-6 md:py-6">
                  <Outlet />
                </div>
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      )}
    </React.Fragment>
  )
}

export default AdminPage
