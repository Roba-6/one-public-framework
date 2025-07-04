// import CONSTANT from '@common/constants'
// import store from '@renderer/store/store'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { CONSTANT } from '~/common/constants'
import { getEnv } from '~/common/utils/env'
import { store } from '~/store'

// React 多言語設定初期化
void i18n.use(initReactI18next).init({
  // Logs info level to console output
  debug: getEnv('APP_DEBUG') as boolean,
  // Language to use
  lng: store.getState().app.conf.language,
  // Default Language
  fallbackLng: (getEnv('UI_LANGUAGE') as string).slice(0, 2),
  interpolation: {
    // already react safes from xss
    escapeValue: false,
  },
  resources: CONSTANT.LANGUAGE_RESOURCES,
})

export default i18n
