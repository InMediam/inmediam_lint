// @ts-check

import eslint from '@eslint/js'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'
import tseslint from 'typescript-eslint'

/**
 * Configuração base do @inmediam/lint (flat config / ESLint 9+).
 *
 * Combina:
 *  - regras recomendadas do ESLint (`@eslint/js`)
 *  - regras recomendadas do typescript-eslint
 *  - estilo `standard` modernizado via `neostandard` (substitui o antigo
 *    `eslint-config-standard` + Prettier do @rocketseat/eslint-config)
 *  - ordenação de imports/exports (`simple-import-sort`)
 *  - ajustes de estilo da Inmediam (largura, espaçamento, vírgula final)
 */
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...neostandard({
    ignores: resolveIgnoresFromGitignore(),
  }),
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // O typescript-eslint cobre variáveis não usadas com reconhecimento de
      // tipos; o neostandard reativa a regra core, então desligamos a core
      // para evitar diagnósticos duplicados (mesmo comportamento da v2).
      'no-unused-vars': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@stylistic/max-len': ['warn', {
        code: 80,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreComments: false,
      }],
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'always',
        asyncArrow: 'always',
        named: 'never',
      }],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
    },
  },
]
