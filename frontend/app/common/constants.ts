import enTranslation from '~/locales/en.json'
import jaTranslation from '~/locales/ja.json'

/**
 * An immutable object containing constant values used across the application.
 */
export const CONSTANT = {
  DEFAULT_LANGUAGE: 'en',
  LANGUAGE_RESOURCES: {
    en: { translation: enTranslation },
    ja: { translation: jaTranslation },
  },
  COPYRIGHT: '© 2025 Roba All Rights Reserved',
} as const
