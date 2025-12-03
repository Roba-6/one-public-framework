import React from 'react'
import { NavLink } from 'react-router'

import { type Bread, selectBreadcrumb } from '@/common/app-slice'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/common/components/ui/breadcrumb'
import { useAppSelector } from '@/common/hooks/use-store'
import { getLocalMessage } from '@/lib/utils'

const BreadcrumbBar = () => {
  const breadcrumb: Bread[] = useAppSelector(selectBreadcrumb)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumb.map((item: Bread, idx: number) => (
          <React.Fragment key={idx}>
            <BreadcrumbItem key={idx}>
              <BreadcrumbLink asChild>
                {idx === breadcrumb.length - 1 ? (
                  <BreadcrumbPage>{getLocalMessage(item.name)}</BreadcrumbPage>
                ) : (
                  <NavLink to={item.url}>{getLocalMessage(item.name)}</NavLink>
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {idx !== breadcrumb.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default BreadcrumbBar
