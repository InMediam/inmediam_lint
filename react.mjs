// @ts-check

import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

import config from './base.mjs'

/**
 * Configuração para projetos React.
 *
 * Base + React (recommended + JSX runtime), React Hooks e um conjunto de
 * regras de acessibilidade (jsx-a11y) em modo `warn`, mantendo paridade com
 * o que era usado no `@rocketseat/eslint-config/react`.
 */
export default [
  ...config,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/self-closing-comp': 'error',
      'react/prop-types': 'off',
      'react/no-unknown-property': 'error',
      'jsx-a11y/alt-text': ['warn', {
        elements: ['img'],
        img: ['Image'],
      }],
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
    },
  },
]
