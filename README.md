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

## Requisitos

- **ESLint 9** (peer dependency `^9.0.0`)
- **TypeScript >= 5** (opcional)
- Node 18+

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

Veja o guia passo a passo em [`MIGRATION.md`](./MIGRATION.md).

## Publicação (mantenedores)

```bash
npm version <patch|minor|major>
npm publish        # publishConfig.access já está como "public"
git push --follow-tags
```
