import { useEffect } from 'react'
import ReactGA from 'react-ga4'
import { useLocation } from 'react-router'

import { selectAppSettings, type Setting } from '@/common/app-slice'
import { useAppSelector } from '@/common/hooks/use-store'

export const useGoogleAnalytics4 = () => {
  const location = useLocation()
  const appSettings: Setting = useAppSelector(selectAppSettings)

  if (appSettings.ga4Id) ReactGA.initialize(appSettings.ga4Id)

  useEffect(() => {
    if (appSettings.ga4Id) {
      ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search })
    }
  }, [location])
}
