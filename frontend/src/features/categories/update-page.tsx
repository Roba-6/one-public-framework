import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { enqueueMessage } from '@/common/app-slice'
import EditForm from '@/common/components/modules/edit-form'
import { Card, CardContent } from '@/common/components/ui/card'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store'
import type { CommonResponse } from '@/common/types/response'
import { categoryItems } from '@/features/categories/form-items'
import type {
  Category,
  UpdateCategoryRequest,
} from '@/features/categories/types/category'
import { getAdminPath } from '@/lib/functions'
import { getApi, putApi } from '@/lib/http'
import { setUrlParams } from '@/lib/utils'

const toCategoryRequest = (data: Category): UpdateCategoryRequest => ({
  name: data.name,
  value: data.value || undefined,
  alias: data.alias || undefined,
  description: data.description || undefined,
  categoryId: data.categoryId || null,
  isEnabled: data.isEnabled,
  options: data.options ? JSON.parse(data.options) : undefined,
})

const UpdateCategoryPage = (): React.JSX.Element => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()
  const { id } = useParams()

  const [loadingData, setLoadingData] = React.useState<boolean>(true)
  const [data, setData] = React.useState<Category | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parents: Category[] = (
          await getApi<CommonResponse>(CONSTANT.API_URL.CATEGORY_ADMIN)
        ).results

        const category: Category = (
          await getApi<CommonResponse>(
            setUrlParams(CONSTANT.API_URL.CATEGORY_ADMIN_ID, id)
          )
        ).results

        if (parents) {
          categoryItems[3].options = [{ label: '--', value: null }]
          parents.forEach((parent) => {
            if (parent.id !== category.id) {
              categoryItems[3].options!.push({ label: parent.name, value: parent.id! })
            }
          })
        }

        category.categoryId = category.parent?.id
        category.options = JSON.stringify(category.options)
        setData(category)
        setLoadingData(false)
        console.log('Update Page:', category)
      } catch (error) {
        console.error('', error)
      }
    }

    if (id) void fetchData()
  }, [id])

  const submitForm = (values: Category) => {
    console.debug('Update Category:', values)
    if (id) {
      putApi<CommonResponse>(
        setUrlParams(CONSTANT.API_URL.CATEGORY_ADMIN_ID, id),
        toCategoryRequest(values)
      ).then((res: CommonResponse) => {
        console.log(res.results! as Category)
        dispatch(
          enqueueMessage({
            message: {
              code: 'S2000002',
              message: 'Updated Successfully',
              detail: null,
            },
            status: 200,
            type: 'success',
          })
        )
        nav(getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_CATEGORY)
      })
    }
  }

  return (
    <Card>
      <CardContent>
        <EditForm<Category>
          id={id as string}
          data={data!}
          loadingData={loadingData}
          items={categoryItems}
          submitForm={submitForm}
        />
      </CardContent>
    </Card>
  )
}

export default UpdateCategoryPage
