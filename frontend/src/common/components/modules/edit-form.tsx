import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod/v4'

import { convertFormItems } from '@/common/components/modules/edit-form-generator'
import { Button } from '@/common/components/ui/button'
import { Form } from '@/common/components/ui/form'
import { Skeleton } from '@/common/components/ui/skeleton'
import type { EditFormProps } from '@/common/types/props'
import { arrayToObject, createFormSchema, getLocalMessage } from '@/lib/utils'

const EditForm = <T extends Record<string, any>>(
  props: EditFormProps<T>
): React.ReactNode => {
  const UserFormSchema = z.object(createFormSchema(props.items))

  const nav = useNavigate()
  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: arrayToObject(props.items, 'name', 'defaultValue'),
  })

  useEffect(() => {
    console.debug('Edit Form Data:', props.data!)
    form.reset(props.data!)
  }, [props])

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
                nav(-1)
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
