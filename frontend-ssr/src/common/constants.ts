import enTranslation from '@/src/locales/en.json'
import jaTranslation from '@/src/locales/ja.json'
// import zhTranslation from '@/src/locales/zh.json'

/**
 * An immutable object containing constant values used across the application.
 */
export const CONSTANT = {
  // Default language setting for application
  DEFAULT_LANGUAGE: 'en',

  LANGUAGE_RESOURCES: {
    en: enTranslation,
    ja: jaTranslation,
    // zh: { translation: zhTranslation },
  },

  // HTTP header key for specifying the content type of request or response
  HTTP_CONTENT_TYPE_KEY: 'Content-Type',
  // HTTP header key for specifying the language of request or response
  HTTP_HEADER_LANGUAGE: 'Accept-Language',
  // HTTP header type for request or response
  HTTP_CONTENT_TYPE_JSON: 'application/json',
  // API request timeout (in milliseconds)
  HTTP_TIMEOUT: 30 * 1000,
  // Display duration for system messages
  MESSENGER_DURATION: 1000,
  // The delay duration before the loading screen is hidden
  LOADING_DURATION: 1000,
  // Copyright notice for the App
  COPYRIGHT: '© 2025 Roba All Rights Reserved',
  // Key name for data stored in Web Storage
  STORAGE_KEY: { THEME: 'theme', LANGUAGE: 'language', ACCESS_TOKEN: 'accessToken' },
  // The display length of the UUID
  UUID_DISPLAY_LENGTH: 4,

  ENUM_CONFIGURATION_TYPE: { OTHER: 0, SYS: 1, API: 2, UI: 3 },

  ROUTE_URL: {
    ADMIN: '/admin',
    ADMIN_CONFIGURATION: '/configurations',
    ADMIN_ATTACHMENT: '/attachments',
    ADMIN_ATTACHMENT_ADD: '/attachments/new',
    ADMIN_ATTACHMENT_UPDATE: '/attachments/:id/edit',
    ADMIN_ATTACHMENT_DETAIL: '/attachments/:id',
    ADMIN_USER: '/users',
    ADMIN_USER_ADD: '/users/new',
    ADMIN_USER_UPDATE: '/users/:id/edit',
    ADMIN_USER_DETAIL: '/users/:id',
    ADMIN_FEATURE: '/features',
    ADMIN_FEATURE_ADD: '/features/new',
    ADMIN_FEATURE_UPDATE: '/features/:id/edit',
    ADMIN_FEATURE_DETAIL: '/features/:id',
    ADMIN_CATEGORY: '/categories',
    ADMIN_CATEGORY_ADD: '/categories/new',
    ADMIN_CATEGORY_UPDATE: '/categories/:id/edit',
    ADMIN_CATEGORY_DETAIL: '/categories/:id',
    ADMIN_ROLE: '/roles',
    ADMIN_PERMISSION: '/permissions',
    HOME: '/home',
    INDEX: '',
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
    ATTACHMENT: '/attachments',
    ATTACHMENT_ADMIN: '/attachments/admin',
    ATTACHMENT_ADMIN_ID: '/attachments/admin/:id',
    ATTACHMENT_ADMIN_UPLOAD: '/attachments/admin/upload',
    ATTACHMENT_ADMIN_DOWNLOAD: '/attachments/admin/:id/download',
    USER: '/users',
    USER_ADMIN: '/users/admin',
    USER_ADMIN_ID: '/users/admin/:id',
    FEATURE: '/features',
    FEATURE_ID: '/admin123/features/:id',
    FEATURE_ADMIN: '/features/admin',
    FEATURE_ADMIN_ID: '/features/admin/:id',
    CATEGORY: '/categories',
    CATEGORY_ADMIN: '/categories/admin',
    CATEGORY_ADMIN_ID: '/categories/admin/:id',
  },
} as const
