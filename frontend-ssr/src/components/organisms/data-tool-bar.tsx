'use client'

import { ChevronDown, Plus } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import NaviButton from '@/src/components/atoms/navi-button'
import { Button } from '@/src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu'
import { Input } from '@/src/components/ui/input'
import { getLocalMessage } from '@/src/lib/client-utils'

const DataToolBar = (props: any): React.JSX.Element => {
  const DEBOUNCE: number = 500

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [keywords, setKeywords] = useState('')

  const handleSearchChange = useCallback(
    (value: string) => {
      const currentKeywords = searchParams.get('keywords') || ''

      if (currentKeywords !== value) {
        const params = new URLSearchParams(searchParams.toString())

        if (value) {
          params.set('keywords', value)
          params.set('page', '1')
        } else {
          params.delete('keywords')
          params.delete('page')
        }

        router.replace(`${pathname}?${params.toString()}`)
      }
    },
    [pathname, router, searchParams]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeywords(searchParams.get('keywords') || '')
    }, DEBOUNCE)

    return () => clearTimeout(timer)
  }, [searchParams])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearchChange(keywords)
    }, DEBOUNCE)

    return () => clearTimeout(timer)
  }, [handleSearchChange, keywords])

  const handleClearAll = () => {
    props.clearAll()
    setKeywords('')
  }

  return (
    <div className="flex items-center py-4">
      <Input
        placeholder={getLocalMessage('placeholder.anyKeywords')}
        name="search"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        className="me-2 max-w-sm"
      />
      <Button variant="outline" onClick={handleClearAll} className="me-2">
        {getLocalMessage('buttons.clear')}
      </Button>
      <Button variant="outline" onClick={props.unselectAll}>
        {getLocalMessage('buttons.unselectAll')}
      </Button>
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {getLocalMessage('buttons.column')}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {props.table
              .getAllColumns()
              .filter((column: any) => column.getCanHide())
              .map((column: any, idx: number) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(value) => column.toggleVisibility(value)}
                  >
                    {props.columns[idx]?.name}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <NaviButton messageId="add" icon={<Plus />} url={props.addUrl || './new'} />
      </div>
    </div>
  )
}

export default DataToolBar
