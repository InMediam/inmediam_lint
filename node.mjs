// @ts-check

import globals from 'globals'

import config from './base.mjs'

/**
 * Configuração para projetos Node.js.
 * Base + globals do Node.
 */
export default [
  ...config,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
