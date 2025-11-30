import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { enqueueMessage } from '@/common/app-slice'
import DataList from '@/common/components/modules/data-list'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store'
import type { Action } from '@/common/types/data'
import type { CommonResponse } from '@/common/types/response'
import { listColumns } from '@/features/users/list-columns'
import type { User } from '@/features/users/types/user'
import { deleteApi, getApi } from '@/lib/http'
import {
  copyToClipboard,
  getAdminPath,
  getLocalMessage,
  setUrlParams,
} from '@/lib/utils'
// import { setUrlParams } from '@/lib/utils'

const UserListPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const [data, setData] = React.useState<User[]>([])

  const navToDetail = (id: string): void => {
    nav(setUrlParams(getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_USER_DETAIL, id))
  }

  /**
   * Updates the navigation path to the specified user update page.
   *
   * This function constructs a URL for the user update page in the admin section
   * using the specified user ID. It appends the ID as a query parameter to the path,
   * and navigates to the constructed URL.
   *
   * @param {string} id - The unique identifier of the user to be updated.
   */
  const navToUpdate = (id: string): void => {
    nav(
      setUrlParams(getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_USER_UPDATE, undefined, {
        id: id,
      })
    )
  }

  const deleteData = (id: string): void => {
    deleteApi<CommonResponse>(setUrlParams(CONSTANT.API_URL.USER_ADMIN_ID, id))
      .then((res: CommonResponse) => {
        const user: User = res.results as User
        console.debug(res.results as User)
        dispatch(
          enqueueMessage({
            message: {
              code: 'I00100001',
              message: getLocalMessage('messages.notices.I00100001', [user.name]),
              detail: null,
            },
            status: 200,
            type: 'success',
          })
        )

        // getData()
      })
      .catch((err: CommonResponse) => {
        console.error(err)
      })
  }

  const actions: Action[] = [
    {
      name: getLocalMessage('buttons.copyId'),
      events: {
        handleClick: copyToClipboard,
      },
    },
    {
      type: 'separator',
    },
    {
      name: getLocalMessage('buttons.details'),
      events: {
        handleClick: navToDetail,
      },
    },
    {
      name: getLocalMessage('buttons.edit'),
      events: {
        handleClick: navToUpdate,
      },
    },
    {
      name: getLocalMessage('buttons.delete'),
      events: {
        handleClick: deleteData,
      },
    },
  ]

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
      <DataList<User> columns={listColumns} data={data} actions={actions} selectable />
    </div>
  )
}

export default UserListPage
