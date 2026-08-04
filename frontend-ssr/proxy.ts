import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const FALLBACK_ADMIN_SEGMENT = 'opu-console'

function getAdminSegment(): string {
  const value = process.env.UI_ADMIN_PATH?.trim() || FALLBACK_ADMIN_SEGMENT
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new Error(
      'UI_ADMIN_PATH may only contain letters, numbers, underscores, and hyphens.'
    )
  }
  return value
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const adminSegment = getAdminSegment()
  const publicAdminPrefix = `/${adminSegment}`
  const isInternalAdminRewrite =
    request.headers.get('x-one-public-ui-admin-rewrite') === '1'

  if (
    !isInternalAdminRewrite &&
    (pathname === '/admin' || pathname.startsWith('/admin/'))
  ) {
    return new NextResponse('Not Found', { status: 404 })
  }

  if (pathname === publicAdminPrefix || pathname.startsWith(`${publicAdminPrefix}/`)) {
    const destination = request.nextUrl.clone()
    const requestHeaders = new Headers(request.headers)

    destination.pathname = `/admin${pathname.slice(publicAdminPrefix.length)}`
    requestHeaders.set('x-one-public-ui-admin-rewrite', '1')

    return NextResponse.rewrite(destination, {
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
