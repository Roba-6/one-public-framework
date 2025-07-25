import eslint from '@eslint/js'
import { globalIgnores } from 'eslint/config'
import prettierConfig from 'eslint-config-prettier'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config([
  globalIgnores(['dist', '**/node_modules', '**/build']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      prettierConfig,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'eslint-plugin-react': reactPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'eslint-plugin-react/jsx-uses-react': 'error',
      'eslint-plugin-react/jsx-uses-vars': 'error',
      'react-refresh/only-export-components': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
])
