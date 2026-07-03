import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { enqueueMessage } from '@/common/app-slice'
import EditForm from '@/common/components/modules/edit-form'
import { Card, CardContent } from '@/common/components/ui/card'
import { CONSTANT } from '@/common/constants'
import { useAppDispatch } from '@/common/hooks/use-store'
import type { CommonResponse } from '@/common/types/response'
import { categoryItems, newCategoryItems } from '@/features/categories/form-items'
import type {
  Category,
  CreateCategoryRequest,
} from '@/features/categories/types/category'
import { getAdminPath } from '@/lib/functions'
import { getApi, postApi } from '@/lib/http'

const toCategoryRequest = (data: Category): CreateCategoryRequest => ({
  name: data.name,
  value: data.value || undefined,
  alias: data.alias || undefined,
  description: data.description || undefined,
  categoryId: data.categoryId || undefined,
  isEnabled: data.isEnabled,
  options: data.options ? JSON.parse(data.options) : undefined,
})

const AddCategoryPage = (): React.JSX.Element => {
  const nav = useNavigate()
  const dispatch = useAppDispatch()

  const [loadingData, setLoadingData] = React.useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parents: Category[] = (
          await getApi<CommonResponse>(CONSTANT.API_URL.CATEGORY_ADMIN)
        ).results

        if (parents) {
          categoryItems[3].options = [{ label: '--', value: null }]
          parents.forEach((parent) => {
            console.log('Parent:', parent)
            categoryItems[3].options!.push({ label: parent.name, value: parent.id! })
          })
        }
        setLoadingData(false)
      } catch (error) {
        console.error('', error)
      }
    }

    void fetchData()
  }, [])

  const submitForm = (data: Category) => {
    console.debug('New Category:', data)
    postApi<CommonResponse>(
      CONSTANT.API_URL.CATEGORY_ADMIN,
      toCategoryRequest(data)
    ).then((res: CommonResponse) => {
      console.debug('Add Category:', res.results! as Category)
      dispatch(
        enqueueMessage({
          message: {
            code: 'S2000001',
            message: 'Added Successfully',
            detail: null,
          },
          status: 200,
          type: 'success',
        })
      )
      nav(getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_CATEGORY)
    })
  }

  return (
    <Card>
      <CardContent>
        <EditForm<Category>
          items={newCategoryItems}
          loadingData={loadingData}
          submitForm={submitForm}
        />
      </CardContent>
    </Card>
  )
}

export default AddCategoryPage
