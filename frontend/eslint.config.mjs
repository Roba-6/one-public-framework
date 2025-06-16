// @ts-check

import eslint from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import reactPlugin from 'eslint-plugin-react'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,
  {
    plugins: {
      'eslint-plugin-react': reactPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'eslint-plugin-react/jsx-uses-react': 'error',
      'eslint-plugin-react/jsx-uses-vars': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    ignores: ['**/.react-router/', '**/node_modules/'],
  }
)
