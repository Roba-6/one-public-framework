import { CONSTANT } from '@/common/constants'
import type { Menu } from '@/common/types/data'
import { getAdminPath } from '@/lib/utils'

const menu: Menu = {
  system: {
    isOpened: false,
    items: [
      {
        title: 'menus.dashboard',
        url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_DASHBOARD,
        icon: 'CircleGauge',
      },
      {
        title: 'menus.configurations',
        url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_CONFIGURATION,
        icon: 'Settings',
      },
      {
        title: 'menus.users',
        url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_USER,
        icon: 'User2',
      },
      {
        title: 'Inbox',
        url: '#',
        icon: 'Inbox',
      },
      {
        title: 'Calendar',
        url: '#',
        icon: 'Calendar',
      },
      {
        title: 'Search',
        url: '#',
        icon: 'Search',
      },
    ],
  },
}

export default menu
