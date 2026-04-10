import { ChevronDown, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import NaviButton from '@/common/components/atoms/navi-button'
import { Button } from '@/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu'
import { Input } from '@/common/components/ui/input'
import { getLocalMessage } from '@/lib/utils'

const DataToolBar = (props: any): React.JSX.Element => {
  const DEBOUNCE: number = 500

  const [searchParams, setSearchParams] = useSearchParams()

  const [keywords, setKeywords] = useState('')

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
  }, [keywords])

  const handleClearAll = () => {
    props.clearAll()
    setKeywords('')
  }

  const handleSearchChange = (value: string) => {
    const currentKeywords = searchParams.get('keywords') || ''
    if (currentKeywords !== value) {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set('keywords', value)
        params.set('page', '1')
      } else {
        params.delete('keywords')
      }
      setSearchParams(params)
    }
  }

  return (
    <div className="flex items-center py-4">
      <Input
        placeholder={getLocalMessage('placeholder.anyKeywords')}
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        className="me-2 max-w-sm"
      />
      <Button variant="outline" onClick={handleClearAll}>
        {getLocalMessage('buttons.clear')}
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
