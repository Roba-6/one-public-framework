import React, { useEffect } from 'react'

import { Card, CardContent } from '@/common/components/ui/card'
import { Input } from '@/common/components/ui/input'
import { Label } from '@/common/components/ui/label'
import { CONSTANT } from '@/common/constants'
import type { Configuration } from '@/common/types/configuration'
import type { CommonResponse } from '@/common/types/response'
import { getApi } from '@/lib/http'

/**
 * ConfigurationEditPage is a React functional component responsible for rendering
 * the configuration editing form. It fetches configuration data from an API, allows
 * users to view and edit key-value pairs, and organizes the form in a grid layout.
 *
 * The component initializes the state to store the list of configurations, fetches
 * configuration data on component mount using the useEffect hook, and dynamically
 * renders input fields for each configuration.
 *
 * Dependencies:
 * - React useState and useEffect hooks for state management and side effects.
 * - External API call to fetch configuration data.
 *
 * Returns:
 * A ReactNode representing a grid layout wrapped in a Card, where each configuration
 * is rendered as an editable row with a label and input field.
 *
 * Note:
 * Each input field is initialized with the corresponding configuration's default value.
 */
const ConfigurationEditPage = (): React.JSX.Element => {
  const [configurations, setConfigurations] = React.useState<Configuration[]>([])

  useEffect(() => {
    getApi<CommonResponse>(CONSTANT.API_URL.CONFIGURATIONS).then(
      (res: CommonResponse) => {
        setConfigurations(res.results! as Configuration[])
      }
    )
  }, [])

  return (
    <Card>
      <CardContent>
        <div className="grid gap-4">
          {configurations.map((configuration: Configuration, idx: number) => (
            <div key={idx} className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor={configuration.id}>{configuration.name}</Label>
              <Input id={configuration.id} defaultValue={configuration.value} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ConfigurationEditPage
