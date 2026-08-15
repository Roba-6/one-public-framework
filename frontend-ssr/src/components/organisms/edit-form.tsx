'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'

import type { EditFormProps } from '@/src/common/types/props'
import { convertFormItems } from '@/src/components/organisms/edit-form-generator'
import { Button } from '@/src/components/ui/button'
import { Form } from '@/src/components/ui/form'
import { Skeleton } from '@/src/components/ui/skeleton'
import {
  arrayToObject,
  createFormSchema,
  getLocalMessage,
} from '@/src/lib/client-utils'

const normalizeFormData = <T extends Record<string, any>>(items: any[], data: T): T => {
  return items.reduce(
    (result: Record<string, any>, item: Record<string, any>) => {
      if (result[item.name] === null || result[item.name] === undefined) {
        result[item.name] = item.defaultValue ?? ''
      }
      return result
    },
    { ...data }
  ) as T
}

const EditForm = <T extends Record<string, any>>(
  props: EditFormProps<T>
): React.ReactNode => {
  const formSchema = z.object(createFormSchema(props.items))

  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: arrayToObject(props.items, 'name', 'defaultValue'),
  })

  useEffect(() => {
    if (props.data) {
      form.reset(normalizeFormData(props.items, props.data))
    }
  }, [form, props.data, props.items])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.submitForm)}>
        <div className="flex flex-col gap-6">
          {props.loadingData && props.id
            ? Array(3)
                .fill(null)
                .map((_, idx: number) => (
                  <div key={idx} className="grid grid-cols-6 gap-3">
                    <Skeleton className="my-2 h-4 w-auto" />
                    <Skeleton className="my-2 h-4 w-auto col-span-3" />
                  </div>
                ))
            : convertFormItems(props.items, form)}
          <div className="grid grid-cols-6 gap-3">
            <Button
              type="button"
              variant="outline"
              className="col-start-3"
              onClick={() => {
                router.back()
              }}
            >
              {getLocalMessage('buttons.cancel')}
            </Button>
            <Button type="submit">{getLocalMessage('buttons.create')}</Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default EditForm
