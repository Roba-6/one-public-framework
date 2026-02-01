import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { enqueueMessage } from '@/common/app-slice'
import DataList from '@/common/components/modules/data-list'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store'
import type { Action } from '@/common/types/data'
import type { CommonResponse } from '@/common/types/response'
import { listColumns } from '@/features/features/list-columns'
import type { Feature } from '@/features/features/types/feature'
import { getAdminPath } from '@/lib/functions'
import { deleteApi, getApi } from '@/lib/http'
import { copyToClipboard, getLocalMessage, setUrlParams } from '@/lib/utils'

const FeatureListPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch()
  const nav = useNavigate()
  const [data, setData] = React.useState<Feature[]>([])

  const navToDetail = (id: string): void => {
    nav(setUrlParams(getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_FEATURE_DETAIL, id))
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
    nav(setUrlParams(getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_FEATURE_UPDATE, id))
  }

  const deleteData = (id: string): void => {
    deleteApi<CommonResponse>(setUrlParams(CONSTANT.API_URL.FEATURE_ADMIN_ID, id))
      .then((res: CommonResponse) => {
        const feature: Feature = res.results as Feature
        console.debug(res.results as Feature)
        dispatch(
          enqueueMessage({
            message: {
              code: 'I00100002',
              message: getLocalMessage('messages.notices.I00100002', [feature.name]),
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
    getApi<CommonResponse>(CONSTANT.API_URL.FEATURE_ADMIN, {}).then(
      (res: CommonResponse) => {
        setData(res.results as Feature[])
      }
    )
  }

  return (
    <div className="w-full">
      <DataList<Feature>
        columns={listColumns}
        data={data}
        actions={actions}
        selectable
      />
    </div>
  )
}

export default FeatureListPage
