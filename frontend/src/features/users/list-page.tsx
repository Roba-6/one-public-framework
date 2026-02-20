import React, { useEffect } from 'react'

import DataList from '@/common/components/modules/data-list'
import { CONSTANT } from '@/common/constants'
import type { CommonResponse } from '@/common/types/response'
import { actions, listColumns } from '@/features/users/list-columns'
import type { User } from '@/features/users/types/user'
import { getApi } from '@/lib/http'

const UserListPage = (): React.JSX.Element => {
  const [data, setData] = React.useState<User[]>([])

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    getApi<CommonResponse>(CONSTANT.API_URL.USER_ADMIN, {}).then(
      (res: CommonResponse) => {
        setData(res.results as User[])
      }
    )
  }

  return (
    <div className="w-full">
      <DataList<User>
        columns={listColumns}
        data={data}
        actions={actions}
        selectable
        deleteUrl={CONSTANT.API_URL.USER_ADMIN_ID}
      />
    </div>
  )
}

export default UserListPage
