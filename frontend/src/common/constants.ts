import enTranslation from '@/locales/en.json'
import jaTranslation from '@/locales/ja.json'

/**
 * An immutable object containing constant values used across the application.
 */
export const CONSTANT = {
  // Default language setting for application
  DEFAULT_LANGUAGE: 'en',
  LANGUAGE_RESOURCES: {
    en: { translation: enTranslation },
    ja: { translation: jaTranslation },
  },

  // HTTP header key for specifying the content type of request or response
  HTTP_CONTENT_TYPE_KEY: 'Content-Type',
  // HTTP header type for request or response
  HTTP_CONTENT_TYPE_JSON: 'application/json',
  // API request timeout (in milliseconds)
  HTTP_TIMEOUT: 30 * 1000,
  // Display duration for system messages
  MESSENGER_DURATION: 1000,
  // Copyright notice for the App
  COPYRIGHT: '© 2025 Roba All Rights Reserved',
  // Key name for data stored in Web Storage
  STORAGE_KEY: { THEME: 'theme', LANGUAGE: 'language', ACCESS_TOKEN: 'accessToken' },

  ENUM_CONFIGURATION_TYPE: { OTHER: 0, SYS: 1, API: 2, UI: 3 },

  ROUTE_URL: {
    ADMIN: '/admin',
    ADMIN_CONFIGURATION: '/configurations',
    ADMIN_USER: '/users',
    ADMIN_ROLE: '/roles',
    ADMIN_PERMISSION: '/permissions',
    HOME: '/home',
    LOGIN: '/login',
    SAMPLE: '/sample',
    ADMIN_DASHBOARD: '/dashboard',
    SETTINGS: '/settings',
  },

  API_URL: {
    CONFIGURATIONS: '/configurations',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    USER: '/users',
    USER_ADMIN: '/users/admin',
    USER_ADMIN_ID: '/users/admin/:id',
  },
} as const
