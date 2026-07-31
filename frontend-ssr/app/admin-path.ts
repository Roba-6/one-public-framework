const segment = process.env.UI_ADMIN_PATH?.trim() || 'opu-console'

if (!/^[A-Za-z0-9_-]+$/.test(segment)) {
  throw new Error(
    'UI_ADMIN_PATH may only contain letters, numbers, underscores, and hyphens.'
  )
}

export const adminBasePath = `/${segment}`
