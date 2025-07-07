import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from '@react-router/dev/routes'

export default [
  index('common/pages/home-page.tsx'),
  route('welcome', 'common/pages/welcome-page.tsx'),
  route('login', 'common/pages/login-page.tsx'),
  layout('common/pages/admin-page.tsx', [
    ...prefix('admin', [
      index('common/pages/dashboard-page.tsx'),
      // route('dashboard', 'common/pages/dashboard-page.tsx'),
    ]),
  ]),
  ...prefix('sample', [
    index('features/sample/pages/index-page.tsx'),
    route('error', 'features/sample/pages/error-page.tsx'),
  ]),
] satisfies RouteConfig
