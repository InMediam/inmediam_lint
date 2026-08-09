// @ts-check

import prettierRecommended from 'eslint-plugin-prettier/recommended'

/**
 * Estilo padrão da Inmediam — o mesmo que o `@rocketseat/eslint-config`
 * aplicava, para que adotar este add-on não reformate o projeto inteiro.
 *
 * @type {import('prettier').Options}
 */
export const inmediamPrettierOptions = {
  printWidth: 80,
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'all',
  arrowParens: 'always',
  endOfLine: 'auto',
}

/**
 * Add-on de Prettier.
 *
 * Existe por um motivo específico: o `@stylistic/max-len` **reporta mas não
 * corrige** — nenhuma regra do ESLint sabe rewrapar uma linha, isso é trabalho
 * de formatter. Sem este add-on, uma linha de 88 colunas vira um aviso que o
 * `--fix` (e o `source.fixAll.eslint` do editor) não resolve.
 *
 * Ele roda o Prettier **por dentro do ESLint**, via `eslint-plugin-prettier`,
 * exatamente como o `@rocketseat/eslint-config` fazia. O resultado aparece
 * como a regra `prettier/prettier`, que é auto-corrigível — então o
 * `eslint --fix` volta a quebrar a linha sozinho e **não é preciso instalar a
 * extensão do Prettier no VS Code**.
 *
 * Como o `eslint-plugin-prettier/recommended` já embute o
 * `eslint-config-prettier`, todas as regras de formatação do `@stylistic`
 * (incluindo `max-len`) são desligadas — quem manda na largura passa a ser o
 * `printWidth`. Por isso o add-on **precisa vir por último**:
 *
 * ```js
 * import react from '@inmediam/lint/react'
 * import tailwind from '@inmediam/lint/tailwind'
 * import prettier from '@inmediam/lint/prettier'
 *
 * export default [
 *   ...react,
 *   ...tailwind({ tailwindConfig: 'tailwind.config.js' }),
 *   ...prettier(),
 * ]
 * ```
 *
 * Combina com o add-on de Tailwind sem conflito: o Prettier não mexe no
 * conteúdo da string de classes (isso fica com o `better-tailwindcss`), e o
 * `enforce-consistent-line-wrapping` — a única regra daquele add-on que
 * brigaria com isto — já fica desligada de propósito. **Não** adicione o
 * `prettier-plugin-tailwindcss` junto: seriam dois fixers ordenando a mesma
 * string.
 *
 * Sobre o `.prettierrc`: o `eslint-plugin-prettier` resolve o arquivo do
 * projeto, mas as opções passadas na regra têm precedência sobre ele. Ou seja,
 * as chaves de `inmediamPrettierOptions` **não** são sobrescritas por um
 * `.prettierrc` — para mudá-las, passe pelo argumento desta função. Chaves que
 * o padrão não define (`plugins`, `overrides`, …) continuam vindo do arquivo, e
 * o `.prettierignore` continua sendo respeitado.
 *
 * @param {import('prettier').Options} [options] Sobrescreve o estilo padrão.
 *   Ex.: `prettier({ printWidth: 100 })`.
 * @returns {import('eslint').Linter.Config[]}
 */
export default function prettier(options) {
  return [
    prettierRecommended,
    {
      name: '@inmediam/lint/prettier',
      rules: {
        'prettier/prettier': ['error', {
          ...inmediamPrettierOptions,
          ...options,
        }],
      },
    },
  ]
}
