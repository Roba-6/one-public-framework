import { DashboardScreen } from '@/src'

import { adminBasePath } from '../../admin-path'

export default function Dashboard() {
  return (
    <DashboardScreen
      adminBasePath={adminBasePath}
      navItems={[{ labelKey: 'common.posts', href: '/admin/posts' }]}
    />
  )
}
