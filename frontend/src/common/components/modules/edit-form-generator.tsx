import React from 'react'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { Switch } from '@/common/components/ui/switch'
import { Textarea } from '@/common/components/ui/textarea'
import type { FormFieldItem } from '@/common/types/data'
import type { TestType } from '@/features/users/types/user'

/**
 * Converts an array of form field items into corresponding JSX elements.
 *
 * @param {FormFieldItem[]} items - An array of form field items, where each item
 * defines the properties of a field such as type, name, label, placeholder, etc.
 * @param {any} form - The form object that provides methods and utilities such as
 * control, watch, and setValue for managing form state.
 * @returns {React.JSX.Element} A JSX fragment containing the rendered form fields
 * based on the provided array of items.
 *
 * Each field item is rendered as a `FormField` component, and its inner elements
 * are dynamically determined by the type property of the item. Supported field
 * types include "text", "password", "email", and "switch". If an unsupported
 * type is provided, it renders null for that field.
 */
export const convertFormItems = (
  items: FormFieldItem[],
  form: any
): React.JSX.Element => {
  return (
    <React.Fragment>
      {items.map((item: FormFieldItem, idx: number) => (
        <FormField
          key={idx}
          control={form.control}
          name={item.name as TestType}
          render={({ field }) => (
            <FormItem className="grid grid-cols-6 gap-3">
              <FormLabel>{item.label as string}</FormLabel>
              <FormControl className="col-span-3">
                {(() => {
                  switch (item.type) {
                    case 'text':
                    case 'password':
                    case 'email':
                      return (
                        <Input
                          type={item.type as string}
                          placeholder={item?.placeholder as string}
                          {...field}
                          value={field.value as string}
                          autoComplete={item?.autoComplete as string}
                          className={item.className}
                        />
                      )
                    case 'textarea':
                      return (
                        <Textarea
                          placeholder={item?.placeholder as string}
                          {...field}
                          value={field.value as string}
                          className={item.className}
                        />
                      )
                    case 'switch':
                      return (
                        <Switch
                          checked={form.watch(item.name) as boolean}
                          onCheckedChange={(checked) => {
                            form.setValue(item.name, checked, {
                              shouldValidate: true,
                            })
                          }}
                          className={item.className}
                        />
                      )
                    default:
                      return null
                  }
                })()}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </React.Fragment>
  )
}
