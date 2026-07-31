import { existsSync, readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'

import type { NextConfig } from 'next'

const customEnvFile = process.env.UI_ENV_FILE ?? '../.env'

if (existsSync(customEnvFile)) {
  const values = parseEnv(readFileSync(customEnvFile, 'utf8'))

  for (const [key, value] of Object.entries(values)) {
    if (key.startsWith('UI_') && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
}

export default nextConfig
