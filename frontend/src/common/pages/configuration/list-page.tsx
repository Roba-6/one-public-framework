import React, { useEffect } from 'react'

import { CONSTANT } from '@/common/constants.ts'
import { getApi } from '@/lib/http.ts'

const ConfigurationListPage = (): React.ReactNode => {
  useEffect(() => {
    getApi(CONSTANT.API_URL.USER).then((res) => {
      console.log(res)
    })
  }, [])

  return <>Configuration List Page</>
}

export default ConfigurationListPage
