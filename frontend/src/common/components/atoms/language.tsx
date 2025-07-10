import { Select, type SelectItemProps } from '@radix-ui/react-select'
import React, { useEffect } from 'react'

import { changeLanguage, selectLanguage } from '@/common/app-slice.ts'
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select.tsx'
import { CONSTANT } from '@/common/constants.ts'
import { useAppDispatch, useAppSelector } from '@/common/hooks/use-store.ts'
import { getLocalMessage } from '@/lib/utils.ts'

const Language = (): React.ReactNode => {
  const LANGUAGES: SelectItemProps[] = Object.keys(CONSTANT.LANGUAGE_RESOURCES).map(
    (v) => {
      return {
        value: v,
        textValue: getLocalMessage(`languages.${v}`),
      } as SelectItemProps
    }
  )
  const languageFromStore: string = useAppSelector(selectLanguage)
  const dispatch = useAppDispatch()
  const [currentLang, setCurrentLang] = React.useState<string>(languageFromStore)

  const changeCurrentLanguage = (lang: string): void => {
    dispatch(changeLanguage(lang))
    setCurrentLang(lang)
  }

  useEffect(() => {
    console.log('Current language: ', languageFromStore)
    // setCurrentLang(languageFromStore)
  }, [languageFromStore])

  return (
    <Select defaultValue={currentLang} onValueChange={changeCurrentLanguage}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang: SelectItemProps) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.textValue}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default Language
