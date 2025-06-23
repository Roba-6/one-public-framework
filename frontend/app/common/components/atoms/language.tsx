import { Select, type SelectItemProps } from '@radix-ui/react-select'
import React, { useEffect } from 'react'

import { changeLanguage } from '~/common/app-slice'
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/common/components/ui/select'
import { CONSTANT } from '~/common/constants'
import { getLocalMessage } from '~/common/utils/env'
import { useAppDispatch, useAppSelector } from '~/hooks/use-store'
import type { RootState } from '~/store'

const Language = (): React.ReactNode => {
  const LANGUAGES: SelectItemProps[] = Object.keys(CONSTANT.LANGUAGE_RESOURCES).map(
    (v) => {
      return {
        value: v,
        textValue: getLocalMessage(`languages.${v}`),
      } as SelectItemProps
    }
  )
  const languageFromRedux: string = useAppSelector(
    (state: RootState): string => state.app.conf.language
  )
  const dispatch = useAppDispatch()
  const [currentLang, setCurrentLang] = React.useState<string>(languageFromRedux)

  const changeCurrentLanguage = (lang: string): void => {
    dispatch(changeLanguage(lang))
    setCurrentLang(lang)
  }

  useEffect(() => {
    console.log('Current language: ', languageFromRedux)
    // setCurrentLang(languageFromRedux)
  }, [languageFromRedux])

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
