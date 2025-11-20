import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod/v4'

import { Button } from '@/common/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Skeleton } from '@/common/components/ui/skeleton'
import { arrayToObject, getLocalMessage } from '@/lib/utils'

const UserFormSchema = z.object({
  name: z.string().min(1, { message: getLocalMessage('Username is required') }),
  password: z.string().min(1, { message: getLocalMessage('Password is required') }),
  email: z.string().min(1, { message: getLocalMessage('Email is required') }),
  lastname: z.string().min(1, { message: getLocalMessage('lastname is required') }),
})

interface EditFormProps<T> {
  id?: string
  testData: any[]
  data: T
  loadingData: boolean
  submitForm: any
}

const EditForm = <T,>(props: EditFormProps<T>): React.ReactNode => {
  const nav = useNavigate()
  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: arrayToObject(props.testData, 'name', 'defaultValue'),
  })

  useEffect(() => {
    form.reset(props.data!)
  }, [])

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
            : props.testData.map((item, idx: number) => (
                <FormField
                  key={idx}
                  control={form.control}
                  name={item.name as TestType}
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-6 gap-3">
                        <FormLabel>{item.label as string}</FormLabel>
                        <FormControl className="col-span-3">
                          <Input
                            type={item.type as string}
                            placeholder={item?.placeholder as string}
                            {...field}
                            value={field.value as string}
                            autoComplete={item?.autoComplete as string}
                          />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              ))}
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
