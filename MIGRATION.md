# Guia de migração — `@rocketseat/eslint-config` → `@inmediam/lint`

Passo a passo para atualizar um projeto que usa o antigo
`@rocketseat/eslint-config` (ESLint 8, formato `.eslintrc.json`) para o
`@inmediam/lint` (ESLint 9, **flat config**).

Os exemplos usam o `inmediam_front` como referência; adapte caminhos/versões ao
projeto que estiver migrando.

---

## Visão geral do que muda

| Antes (`@rocketseat/eslint-config`) | Depois (`@inmediam/lint`) |
| --- | --- |
| ESLint **8** | ESLint **9** |
| `.eslintrc.json` (eslintrc) | `eslint.config.mjs` (flat config) |
| `eslint-config-standard` + **Prettier** para estilo | **neostandard** (`@stylistic`) faz o estilo |
| Plugins instalados no projeto | Plugins vêm dentro do `@inmediam/lint` |
| `eslint . --ext ts,tsx` | `eslint .` (sem `--ext`) |
| Warning de versão de TypeScript não suportada | TS atual (5.x) suportado |

O estilo de código continua o mesmo de antes (sem ponto e vírgula, aspas
simples, vírgula final, 80 colunas), só que agora aplicado pelo `neostandard`
em vez do Prettier.

---

## 1. Pré-requisitos

- Node **20.19+** (`^20.19.0 || ^22.12.0 || >=23.0.0`).
- Atualizar o ESLint para a **versão 9** (o `@inmediam/lint` exige `eslint@^9`):

```bash
npm i -D eslint@^9
```

---

## 2. Remover os pacotes antigos

Desinstale o config antigo e os plugins/parsers que agora já vêm dentro do
`@inmediam/lint`:

```bash
npm uninstall \
  @rocketseat/eslint-config \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  eslint-plugin-simple-import-sort
```

> `eslint-plugin-react-refresh` é específico do template Vite. Se o projeto
> realmente usa a regra `react-refresh/only-export-components`, mantenha o
> plugin e adicione a regra manualmente no `eslint.config.mjs` (ver passo 4).

---

## 3. Instalar o `@inmediam/lint`

```bash
npm i -D @inmediam/lint
```

---

## 4. Criar o `eslint.config.mjs` e remover o `.eslintrc.json`

Apague o `.eslintrc.json` (e qualquer `.eslintignore`) e crie na raiz um
`eslint.config.mjs`.

Projeto **React** (caso do `inmediam_front`):

```js
import config from '@inmediam/lint/react'

export default config
```

Projeto **Node**:

```js
import config from '@inmediam/lint/node'

export default config
```

### Se você precisava de regras extras

Tudo que o `.eslintrc.json` antigo adicionava deve virar um objeto extra no
array. Exemplo equivalente ao que o `inmediam_front` tinha, caso queira manter
o `react-refresh`:

```js
import reactRefresh from 'eslint-plugin-react-refresh'

import config from '@inmediam/lint/react'

export default [
  ...config,
  {
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
```

> O `simple-import-sort/imports` que estava no `.eslintrc.json` **já vem
> habilitado** no `@inmediam/lint`, então não precisa ser repetido.

### Ignorar arquivos

No flat config o `.eslintignore` não é lido. O `@inmediam/lint` já ignora
automaticamente tudo que está no `.gitignore`. Para ignorar algo a mais:

```js
export default [
  ...config,
  { ignores: ['vite.config.ts', 'tailwind.config.js', 'dist'] },
]
```

---

## 5. Ajustar os scripts do `package.json`

A flag `--ext` não existe mais no flat config. Troque:

```diff
- "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
- "lint:fix": "eslint src --ext .tsx,.ts --fix",
- "lint:all": "eslint src --ext .tsx,.ts --max-warnings=0",
+ "lint": "eslint . --report-unused-disable-directives --max-warnings 0",
+ "lint:fix": "eslint . --fix",
```

---

## 6. Ajustar o `lint-staged` / Husky (se houver)

O comando em si normalmente continua válido (`eslint --fix`), mas confira se
não há `--ext` embutido. No `inmediam_front` está assim e segue funcionando:

```json
"lint-staged": {
  "*.{js,ts,jsx,tsx}": ["eslint --fix"]
}
```

---

## 7. Prettier (atenção)

O `@inmediam/lint` faz a formatação de estilo pelo `neostandard`. Se o projeto
ainda tiver um Prettier configurado para o **mesmo** estilo (semi, aspas), eles
podem brigar. Opções:

- **Recomendado:** deixar o `@inmediam/lint` cuidar do estilo e remover o
  Prettier do fluxo de lint.
- Se o Prettier era mantido **apenas** para ordenar classes do Tailwind
  (`prettier-plugin-tailwindcss`, caso do `inmediam_front`), agora dá para
  remover o Prettier por completo — use o add-on de Tailwind (passo 7.1).

### 7.1. Tailwind: do Prettier para o ESLint

```bash
npm uninstall prettier prettier-plugin-tailwindcss
```

E no `eslint.config.mjs`:

```js
import react from '@inmediam/lint/react'
import tailwind from '@inmediam/lint/tailwind'

export default [...react, ...tailwind({ entryPoint: 'src/global.css' })]
```

Aponte o `entryPoint` para o CSS que faz `@import "tailwindcss"` (no
`inmediam_front`, confira o caminho real — costuma ser `src/index.css`). Em
projeto ainda no Tailwind v3, troque por `tailwindConfig: 'tailwind.config.js'`.

A ordem das classes é idêntica à do `prettier-plugin-tailwindcss` — os dois
usam a API do próprio Tailwind. Na prática o `lint:fix` produz o mesmo
resultado que o Prettier produzia.

> Não deixe os dois ativos ao mesmo tempo. Eles concordam na ordem, mas
> formatam a mesma string em ferramentas diferentes, o que gera ruído no
> `lint-staged` (um roda depois do outro e o arquivo muda duas vezes).

---

## 8. Rodar e revisar

```bash
npm run lint:fix   # aplica o que for auto-corrigível
npm run lint       # confere o que sobrou
```

Diferenças de comportamento esperadas vindas da v2 do Rocketseat:

- `no-unused-vars` agora é reportado só pelo `@typescript-eslint` (sem
  duplicidade).
- `simple-import-sort/exports` passa a ser verificado também (antes só
  `imports`).
- Vírgula final em multilinha (`comma-dangle: always-multiline`) é garantida
  pelo `@stylistic` em vez do Prettier.

Reveja o diff do `lint:fix` antes de commitar — costuma ser só reordenação de
imports e ajustes de estilo.

---

## 9. VS Code (opcional, recomendado)

Para o ESLint da IDE entender o flat config, garanta a extensão atualizada e
adicione em `.vscode/settings.json`:

```json
{
  "eslint.useFlatConfig": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

---

## Problemas comuns

### `npm warn deprecated @humanwhocodes/config-array` / `object-schema`

```
npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
```

Esses dois pacotes são dependências do **ESLint 8** — não vêm do
`@inmediam/lint`. Se o warning aparece, sobrou ESLint 8 na árvore do projeto,
normalmente porque o `@rocketseat/eslint-config` (que fixa `eslint@^8`) não foi
desinstalado no passo 2. Para descobrir quem puxa:

```bash
npm ls @humanwhocodes/config-array
```

Remova o pacote apontado e regenere o lock:

```bash
npm uninstall @rocketseat/eslint-config
rm -rf node_modules package-lock.json && npm install
```

---

## Checklist rápido

- [ ] ESLint atualizado para a v9
- [ ] Pacotes antigos removidos (`@rocketseat/eslint-config` + plugins)
- [ ] `@inmediam/lint` instalado
- [ ] `.eslintrc.json` / `.eslintignore` apagados
- [ ] `eslint.config.mjs` criado
- [ ] Scripts de lint sem `--ext`
- [ ] Prettier ajustado para não conflitar
- [ ] Tailwind: `prettier-plugin-tailwindcss` trocado pelo add-on (passo 7.1)
- [ ] `npm ls @humanwhocodes/config-array` vazio (sem ESLint 8 na árvore)
- [ ] `npm run lint` passando
