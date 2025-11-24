import React, { useEffect } from 'react'

// import { enqueueMessage } from '@/common/app-slice'
import DataList from '@/common/components/modules/data-list'
import { CONSTANT } from '@/common/constants'
// import { useAppDispatch } from '@/common/hooks/use-store'
import type { CommonResponse } from '@/common/types/response'
import type { User } from '@/common/types/user'
import { columns } from '@/features/users/columns.ts'
import { getApi } from '@/lib/http'
// import { setUrlParams } from '@/lib/utils'

const UserListPage = (): React.ReactNode => {
  // const dispatch = useAppDispatch()
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

  // const deleteData = (id: string): void => {
  //   deleteApi<CommonResponse>(setUrlParams(CONSTANT.API_URL.USER_ADMIN_ID, id)).then(
  //     (res: CommonResponse) => {
  //       console.debug(res)
  //       getData()
  //       dispatch(
  //         enqueueMessage({
  //           message: {
  //             code: 'S2000000',
  //             message: 'Deleted Successfully',
  //             detail: null,
  //           },
  //           status: 200,
  //           type: 'success',
  //         })
  //       )
  //     }
  //   )
  // }

  return (
    <div className="w-full">
      <DataList<User> columns={columns} data={data} selectable />
    </div>
  )
}

export default UserListPage
