import { CONSTANT } from '@/common/constants'
import type { Menu } from '@/common/types/data'
import { getAdminPath } from '@/lib/utils'

const menu: Menu = {
  system: {
    isOpened: false,
    items: [
      {
        name: 'menus.dashboard',
        url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_DASHBOARD,
        icon: 'CircleGauge',
      },
      {
        name: 'menus.configurations',
        url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_CONFIGURATION,
        icon: 'Settings',
      },
      {
        name: 'menus.users',
        url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_USER,
        icon: 'User2',
      },
      {
        name: 'menus.add',
        url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_USER_EDIT,
        icon: 'User2',
        show: false,
      },
    ],
  },
}

export default menu
