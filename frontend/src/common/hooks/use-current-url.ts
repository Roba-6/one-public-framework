import { useEffect } from 'react'
import { useLocation } from 'react-router'

import { setLocation } from '@/common/app-slice.ts'
import { useAppDispatch } from '@/common/hooks/use-store.ts'

export const useUrlChange = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()

  useEffect(() => {
    dispatch(setLocation(location))
  }, [dispatch, location])
}
