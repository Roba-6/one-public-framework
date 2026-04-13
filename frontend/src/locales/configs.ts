import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { CONSTANT } from '@/common/constants'
import { getEnv } from '@/lib/functions'
import { store } from '@/store'

void i18n.use(initReactI18next).init({
  // Logs info level to console output
  debug: getEnv('UI_DEBUG') as boolean,
  // Language to use
  lng: store.getState().app.settings.language,
  // Default Language
  fallbackLng: (getEnv('UI_LANGUAGE') as string).slice(0, 2),
  interpolation: {
    // already react safes from xss
    escapeValue: false,
  },
  resources: CONSTANT.LANGUAGE_RESOURCES,
})

export default i18n
