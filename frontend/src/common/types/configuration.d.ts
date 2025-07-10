export type ConfigurationType = 0 | 1 | 2 | 3

interface ConfigurationBase {
  name: string
  key: string
  value: string
  type: ConfigurationType
  description: string
}

export type Configuration = ConfigurationBase
