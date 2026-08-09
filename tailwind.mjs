// @ts-check

import betterTailwindcss from 'eslint-plugin-better-tailwindcss'

/**
 * @typedef {object} TailwindOptions
 * @property {string} [entryPoint] Caminho do CSS que importa o Tailwind (v4),
 *   relativo à raiz do projeto — ex.: `'src/global.css'`. Obrigatório no v4.
 * @property {string} [tailwindConfig] Caminho do `tailwind.config.js` (v3).
 *   Use no lugar do `entryPoint`.
 * @property {string} [cwd] Diretório usado para resolver o `tailwindcss` e os
 *   arquivos acima. Necessário em monorepo, quando o ESLint roda da raiz.
 * @property {boolean} [detectComponentClasses] Reconhece classes de componente
 *   do Tailwind v4 (`@utility`, `@apply`).
 * @property {number} [rootFontSize] Font size do `<html>` em px, usado para
 *   avaliar se valores arbitrários batem com a escala do tema.
 */

/**
 * Add-on de Tailwind CSS.
 *
 * Diferente dos outros presets, este **não** inclui a base e é uma função —
 * ele se combina com `react`, `node` ou `base`:
 *
 * ```js
 * import react from '@inmediam/lint/react'
 * import tailwind from '@inmediam/lint/tailwind'
 *
 * export default [...react, ...tailwind({ entryPoint: 'src/global.css' })]
 * ```
 *
 * O `entryPoint` é obrigatório (ou `tailwindConfig`, em projetos no Tailwind
 * v3). Apesar do que a documentação do plugin diz, a versão 4.7.0 **não**
 * detecta o CSS de entrada sozinha: sem ele, o plugin cai no tema padrão do
 * Tailwind e emite um aviso em cada atributo de classe — classes vindas do
 * `@theme` do projeto ficariam ordenadas errado. Por isso a função exige o
 * caminho em vez de aceitar a omissão silenciosamente.
 *
 * Cobre apenas ordenação e limpeza de classes — o mesmo escopo que o
 * `prettier-plugin-tailwindcss` resolvia, agora dentro do ESLint. A ordem é a
 * canônica do próprio Tailwind (o plugin usa a API dele), então o resultado é
 * o mesmo de antes; as quatro regras são auto-corrigíveis com `eslint --fix`.
 *
 * Ficam de fora de propósito:
 *
 * - as regras de correção (`no-unknown-classes`, `no-conflicting-classes`,
 *   `enforce-canonical-classes`), que acusam falso positivo em classes de
 *   componente e utilitários criados via `@apply`;
 * - `enforce-consistent-line-wrapping`, que reformata a lista de classes em
 *   várias linhas e briga com qualquer Prettier que ainda formate JSX.
 *
 * @param {TailwindOptions} options
 * @returns {import('eslint').Linter.Config[]}
 */
export default function tailwind(options) {
  if (!options?.entryPoint && !options?.tailwindConfig) {
    throw new Error(
      '[@inmediam/lint/tailwind] informe `entryPoint` (Tailwind v4) ou ' +
      '`tailwindConfig` (v3).\n' +
      "  Ex.: ...tailwind({ entryPoint: 'src/global.css' })\n" +
      '  Sem isso o plugin usa o tema padrão do Tailwind e ordena classes ' +
      'customizadas de forma errada.',
    )
  }

  return [
    {
      plugins: {
        'better-tailwindcss': betterTailwindcss,
      },
      settings: {
        'better-tailwindcss': { ...options },
      },
      rules: {
        'better-tailwindcss/enforce-consistent-class-order': 'error',
        'better-tailwindcss/enforce-consistent-variant-order': 'error',
        'better-tailwindcss/no-duplicate-classes': 'error',
        'better-tailwindcss/no-unnecessary-whitespace': 'error',
      },
    },
  ]
}
