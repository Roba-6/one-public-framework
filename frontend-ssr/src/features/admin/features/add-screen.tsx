'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { z } from 'zod/v4'

import { enqueueMessage } from '@/src/common/app-slice'
import { CONSTANT } from '@/src/common/constants'
import { useAppDispatch } from '@/src/common/hooks/use-store'
import type { FormFieldItem } from '@/src/common/types/data'
import type { CommonResponse } from '@/src/common/types/response'
import EditForm from '@/src/components/organisms/edit-form'
import { Card, CardContent } from '@/src/components/ui/card'
import type {
  CreateFeatureRequest,
  Feature,
} from '@/src/features/admin/features/feature'
import { postApi } from '@/src/lib/client-http'
import { getLocalMessage } from '@/src/lib/client-utils'
import { getAdminPath } from '@/src/lib/functions'

const newFeatureItems: FormFieldItem[] = [
  {
    name: 'name',
    label: getLocalMessage('labels.feature.name'),
    type: 'text',
    placeholder: getLocalMessage('placeholder.features.name'),
    defaultValue: '',
    validate: z
      .string()
      .max(1000, { message: getLocalMessage('messages.validations.max', [1000]) }),
  },
  {
    name: 'key',
    label: getLocalMessage('labels.key'),
    type: 'text',
    placeholder: getLocalMessage('placeholder.features.key'),
    defaultValue: '',
    validate: z
      .string()
      .length(13, { message: getLocalMessage('messages.validations.length', [13]) }),
  },
  {
    name: 'description',
    label: getLocalMessage('labels.feature.description'),
    type: 'textarea',
    placeholder: getLocalMessage('placeholder.description'),
    className: 'min-h-30',
  },
  {
    name: 'isEnabled',
    label: getLocalMessage('labels.enabled'),
    type: 'switch',
    defaultValue: true,
    validate: z.boolean(),
  },
  {
    name: 'requiresAuth',
    label: getLocalMessage('labels.requiresAuth'),
    type: 'switch',
    defaultValue: true,
    validate: z.boolean(),
  },
]

// const featureItems: FormFieldItem[] = newFeatureItems

const AddFeatureScreen = (): React.JSX.Element => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const submitForm = (data: Feature) => {
    console.debug('New Feature:', data)
    postApi<CommonResponse>(
      CONSTANT.API_URL.FEATURE_ADMIN,
      data as CreateFeatureRequest
    ).then((res: CommonResponse) => {
      console.debug('Add Feature:', res.results! as Feature)
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
      router.replace(getAdminPath() + CONSTANT.ROUTE_URL.ADMIN_FEATURE)
    })
  }

  return (
    <Card>
      <CardContent>
        <EditForm items={newFeatureItems} submitForm={submitForm} />
      </CardContent>
    </Card>
  )
}

export default AddFeatureScreen
