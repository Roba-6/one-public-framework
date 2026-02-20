import { CONSTANT } from '@/common/constants'
import type { Menu } from '@/common/types/data'
import { getAdminPath } from '@/lib/functions'

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
        name: 'menus.features',
        url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_FEATURE,
        icon: 'AppWindow',
      },
      {
        name: 'menus.users',
        url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_USER,
        icon: 'User2',
      },
      {
        name: 'menus.add',
        url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_USER_ADD,
        icon: 'User2',
        show: false,
      },
      {
        name: 'menus.update',
        url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_USER_UPDATE,
        icon: 'User2',
        show: false,
      },
      {
        name: 'menus.detail',
        url: getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_USER_DETAIL,
        show: false,
      },
    ],
  },
}

export default menu
