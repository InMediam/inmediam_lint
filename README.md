# @inmediam/lint

Configuração de ESLint padrão da **Inmediam**, no formato **flat config** do
ESLint 9.

Substitui o uso do `@rocketseat/eslint-config` (descontinuado, preso ao ESLint 8
e a versões antigas do TypeScript). É baseada no que seria a v3 daquele pacote
(migração para ESLint 9 + `neostandard`), com os ajustes que a Inmediam já usava
reincorporados.

## O que inclui

- Regras recomendadas do **ESLint** (`@eslint/js`)
- Regras recomendadas do **typescript-eslint**
- Estilo `standard` modernizado via **neostandard** (substitui o antigo
  `eslint-config-standard` + Prettier) — sem ponto e vírgula, aspas simples,
  vírgula final em multilinha, largura de 80 colunas
- Ordenação de imports/exports (**simple-import-sort**)
- **React**: `eslint-plugin-react` (recommended + JSX runtime),
  `eslint-plugin-react-hooks` e regras de acessibilidade (`jsx-a11y`) em `warn`
- **Tailwind CSS** (opt-in): ordenação e limpeza de classes via
  **eslint-plugin-better-tailwindcss** — substitui o
  `prettier-plugin-tailwindcss`
- **Prettier** (opt-in): formatação auto-corrigível via
  **eslint-plugin-prettier**, para quem quer que o `--fix` também quebre linha
  (o `neostandard` sozinho não faz isso)

## Requisitos

- **ESLint 9** (peer dependency `^9.0.0`)
- **TypeScript >= 5** (opcional)
- **Node 20.19+** (`^20.19.0 || ^22.12.0 || >=23.0.0`)

> O ESLint 10 ainda não é suportado porque parte do ecossistema de plugins
> (ex.: `eslint-plugin-jsx-a11y`) ainda não o suporta. Use ESLint 9.

## Instalação

```bash
npm i -D eslint @inmediam/lint
```

Todos os plugins e parsers necessários já vêm como dependências de
`@inmediam/lint` — **não é preciso instalar plugin nenhum à parte.**

## Uso

Crie um `eslint.config.mjs` na raiz do projeto.

### React

```js
import config from '@inmediam/lint/react'

export default config
```

### Node.js

```js
import config from '@inmediam/lint/node'

export default config
```

### Base (sem React nem globals de Node)

```js
import config from '@inmediam/lint'
// ou
import config from '@inmediam/lint/base'

export default config
```

### Tailwind CSS

Assim como o de Prettier, este add-on **não** inclui a base e é uma **função** —
ele se combina com um dos presets acima:

```js
import react from '@inmediam/lint/react'
import tailwind from '@inmediam/lint/tailwind'

export default [...react, ...tailwind({ entryPoint: 'src/global.css' })]
```

O `entryPoint` é o CSS que faz `@import "tailwindcss"`, relativo à raiz do
projeto. Ele é **obrigatório** — é dele que o plugin lê o seu `@theme` para
saber ordenar as classes customizadas. Em projetos ainda no Tailwind v3, passe
`tailwindConfig: 'tailwind.config.js'` no lugar.

Ele ativa quatro regras, todas auto-corrigíveis com `eslint --fix`:

| Regra | O que faz |
| --- | --- |
| `enforce-consistent-class-order` | Ordena as classes na ordem canônica do Tailwind |
| `enforce-consistent-variant-order` | Ordena variantes dentro da classe (`hover:dark:` → `dark:hover:`) |
| `no-duplicate-classes` | Remove classes repetidas |
| `no-unnecessary-whitespace` | Remove espaço sobrando entre classes |

Opções aceitas pela função:

| Opção | Para que serve |
| --- | --- |
| `entryPoint` | CSS de entrada do Tailwind v4 (obrigatório no v4) |
| `tailwindConfig` | `tailwind.config.js`, para projetos no v3 |
| `cwd` | Raiz usada para resolver o `tailwindcss` — necessário em monorepo, quando o ESLint roda da raiz |
| `detectComponentClasses` | Reconhece classes criadas com `@utility` / `@apply` |
| `rootFontSize` | Font size do `<html>` em px, para avaliar valores arbitrários |

> **Saindo do `prettier-plugin-tailwindcss`:** a ordem aplicada é a mesma (os
> dois usam a própria API do Tailwind), então o diff da primeira execução é só
> o que o Prettier já fazia. Remova o `prettier-plugin-tailwindcss` ao adotar
> isto — deixar os dois ativos faz duas ferramentas formatarem a mesma string.

As regras de *correctness* (`no-unknown-classes`, `no-conflicting-classes`,
`enforce-canonical-classes`) ficam desligadas de propósito: elas acusam falso
positivo em classes de componente e utilitários criados com `@apply`. Ative por
projeto se quiser:

```js
export default [
  ...react,
  ...tailwind({
    entryPoint: 'src/global.css',
    detectComponentClasses: true,
  }),
  {
    rules: {
      'better-tailwindcss/no-unknown-classes': 'error',
    },
  },
]
```

### Prettier

Add-on opt-in para quem quer que o `eslint --fix` **conserte** a formatação, e
não só reclame dela.

O motivo de existir: o `@stylistic/max-len` do preset base reporta

```
This line has a length of 88. Maximum allowed is 80.
```

mas **não tem fixer** — nenhuma regra do ESLint sabe decidir onde quebrar uma
linha, isso é trabalho de formatter. Com este add-on o diagnóstico vira

```
Insert `⏎···`   prettier/prettier
```

que o `--fix` resolve sozinho. É o mesmo mecanismo do
`@rocketseat/eslint-config` (ele trazia o `eslint-plugin-prettier` embutido):
o Prettier roda **por dentro do ESLint**, então **não é preciso instalar a
extensão do Prettier no VS Code** — o `source.fixAll.eslint` já basta.

```js
import react from '@inmediam/lint/react'
import tailwind from '@inmediam/lint/tailwind'
import prettier from '@inmediam/lint/prettier'

export default [
  ...react,
  ...tailwind({ entryPoint: 'src/global.css' }),
  ...prettier(),
]
```

> **A ordem importa: o add-on tem que vir por último.** Ele embute o
> `eslint-config-prettier`, que desliga todas as regras de formatação do
> `@stylistic` (incluindo `max-len` e `curly`). Se vier antes de `react`/`base`,
> essas regras voltam a ligar e passam a brigar com o Prettier.

O estilo padrão é idêntico ao que o `@rocketseat/eslint-config` aplicava, de
propósito — adotar o add-on num projeto que veio de lá não reformata nada:

| Opção | Valor |
| --- | --- |
| `printWidth` | `80` |
| `tabWidth` | `2` |
| `semi` | `false` |
| `singleQuote` | `true` (`jsxSingleQuote: false` — aspas duplas no JSX) |
| `trailingComma` | `'all'` |
| `arrowParens` | `'always'` |
| `endOfLine` | `'auto'` |

Para ajustar, passe as opções na função:

```js
...prettier({ printWidth: 100 })
```

> **`.prettierrc` não sobrescreve esses padrões.** O `eslint-plugin-prettier` dá
> precedência às opções declaradas na regra sobre as do arquivo. Chaves que a
> tabela acima não define (`plugins`, `overrides`, …) continuam vindo do
> `.prettierrc`, e o `.prettierignore` continua valendo.

#### Junto com o add-on de Tailwind

Funciona sem conflito, e é a combinação recomendada. O Prettier não mexe no
conteúdo da string de classes — quem ordena continua sendo o
`better-tailwindcss`. A única regra daquele add-on que brigaria com isto
(`enforce-consistent-line-wrapping`) já fica desligada de propósito.

> **Não** instale o `prettier-plugin-tailwindcss` junto. Seriam dois fixers
> ordenando a mesma string, em ferramentas diferentes.

### Estendendo / sobrescrevendo

Como é flat config, basta espalhar o array e adicionar seus próprios objetos
depois (os de baixo têm prioridade):

```js
import config from '@inmediam/lint/react'

export default [
  ...config,
  {
    rules: {
      // ajustes específicos deste projeto
      'react/self-closing-comp': 'off',
    },
  },
  {
    // arquivos a ignorar além do .gitignore
    ignores: ['vite.config.ts'],
  },
]
```

> O `neostandard` já ignora automaticamente o que está no `.gitignore`.

## Script de lint sugerido

No `package.json` do projeto:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

> No flat config a flag `--ext` não existe mais — os arquivos analisados são
> definidos pelo próprio config.

## Migração a partir do `@rocketseat/eslint-config`

Veja o guia passo a passo em
[`MIGRATION.md`](https://github.com/InMediam/inmediam_lint/blob/main/MIGRATION.md).

## Contribuindo e publicação

O versionamento e a publicação no npm são automatizados com
[Changesets](https://github.com/changesets/changesets) e GitHub Actions: todo
PR que altera o pacote inclui um changeset, e o merge na `main` publica uma nova
versão automaticamente (via Trusted Publishing / OIDC, sem token).

Em resumo, no seu PR:

```bash
npx changeset   # descreve a mudança e o tipo de bump (patch/minor/major)
```

Consulte o
[`CONTRIBUTING.md`](https://github.com/InMediam/inmediam_lint/blob/main/CONTRIBUTING.md)
para o passo a passo completo do fluxo de contribuição e do processo de release.
