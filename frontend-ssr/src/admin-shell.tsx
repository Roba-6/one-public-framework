'use client'

import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { setAccessToken } from '@/src/common/app-slice'
import { CONSTANT } from '@/src/common/constants'
import { useAppDispatch } from '@/src/common/hooks/use-store'
import AppSidebar from '@/src/components/molecules/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/src/components/ui/sidebar'
import { getApi } from '@/src/lib/client-http'
import { getAdminPath } from '@/src/lib/utils'

export type AdminNavItem = {
  label?: string
  labelKey?: string
  href: string
  icon?: ReactNode
}

export function normalizeAdminBasePath(value = '/admin'): string {
  const trimmed = value.trim()
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.replace(/\/+$/, '') || '/admin'
}

export function resolveAdminHref(href: string, adminBasePath = '/admin'): string {
  const base = normalizeAdminBasePath(adminBasePath)
  return href === '/admin' || href.startsWith('/admin/')
    ? `${base}${href.slice('/admin'.length)}`
    : href
}

export type AdminShellProps = PropsWithChildren<{
  navItems?: AdminNavItem[]
  adminBasePath?: string
}>

export function AdminShell({ children }: AdminShellProps) {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const baseItems: AdminNavItem[] = [
    { labelKey: 'common.dashboard', href: '/admin/dashboard' },
    { labelKey: 'common.settings', href: '/admin/settings' },
  ]
  const accessToken: string = Cookies.get(CONSTANT.STORAGE_KEY.ACCESS_TOKEN) || ''
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  console.debug(t)
  console.debug(baseItems)
  console.debug(isAuthenticated)

  useEffect(() => {
    console.debug('ddd', getAdminPath())

    const fetch = async () => {
      try {
        if (accessToken) {
          // TODO: set current user info
          await getApi(CONSTANT.API_URL.ME)
          setIsAuthenticated(true)
          // router.replace(getAdminPath())
          // completed()
        } else {
          dispatch(setAccessToken(''))
          router.replace(getAdminPath() + CONSTANT.ROUTE_URL.LOGIN)
          console.debug('FFFFF', getAdminPath() + CONSTANT.ROUTE_URL.LOGIN)
        }
      } catch (error) {
        console.error(error)
        dispatch(setAccessToken(''))
        router.replace(getAdminPath() + CONSTANT.ROUTE_URL.LOGIN)
        console.debug('BBBBB', getAdminPath() + CONSTANT.ROUTE_URL.LOGIN)
      }
    }
    void fetch()
  }, [accessToken, dispatch, router])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-[calc(100vh-1rem)] overflow-hidden">
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            {/*<SidebarTrigger />*/}
            {/*<Separator*/}
            {/*  orientation="vertical"*/}
            {/*  className="mx-2 data-[orientation=vertical]:h-4"*/}
            {/*/>*/}
            {/*<BreadcrumbBar />*/}
          </div>
        </header>
        <main className="flex flex-1 flex-col overflow-auto">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4">
              {/*<Outlet />*/}
              <button
                className="opu-locale"
                onClick={() =>
                  void i18n.changeLanguage(i18n.resolvedLanguage === 'ja' ? 'en' : 'ja')
                }
              >
                {i18n.resolvedLanguage === 'ja' ? 'EN' : 'JA'}
              </button>
              {children}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
