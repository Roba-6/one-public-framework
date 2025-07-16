import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'

import { loadComplete, selectAccessToken, setAccessToken } from '@/common/app-slice'
import AppSidebar from '@/common/components/modules/app-sidebar'
import { Separator } from '@/common/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/common/components/ui/sidebar'
import { CONSTANT } from '@/common/constants.ts'
import { useAppDispatch, useAppSelector } from '@/common/hooks/use-store'
import { getApi } from '@/lib/http'

const AdminPage = (): React.ReactNode => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const accessToken: string = useAppSelector(selectAccessToken)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        if (accessToken) {
          // TODO: set current user info
          await getApi(CONSTANT.API_URL.ME)
          setIsAuthenticated(true)
          dispatch(loadComplete())
        } else {
          dispatch(setAccessToken(''))
          nav(CONSTANT.ROUTE_URL.ADMIN + CONSTANT.ROUTE_URL.LOGIN)
        }
      } catch (error) {
        console.error(error)
        dispatch(setAccessToken(''))
        nav(CONSTANT.ROUTE_URL.ADMIN + CONSTANT.ROUTE_URL.LOGIN)
      }
    }
    void fetch()
  }, [accessToken, dispatch, nav])

  if (accessToken && isAuthenticated) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
              />
              <h1 className="text-base font-medium">Documents</h1>
            </div>
          </header>
          <main className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 md:gap-6 md:py-6">
                111232
                <br />
                111232
                <br />
                111232
                <br />
                <Outlet />
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    )
  }
}

export default AdminPage
