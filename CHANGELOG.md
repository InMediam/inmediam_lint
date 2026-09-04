# @inmediam/lint

## 2.0.0

### Major Changes

- 24208a8: Proíbe ternários aninhados no config base (`no-nested-ternary` em `error`).

  Um ternário cujo branch contém outro ternário é uma decisão de três ou mais
  vias, e uma decisão dessas precisa de um nome — não de mais um nível de
  indentação. O `@stylistic/multiline-ternary` e o Prettier deixavam o
  aninhamento _bonito_, mas continuava ilegível: quem lê tem que segurar duas
  condições na cabeça para saber qual branch produz qual valor.

  **Isto é breaking**: a regra é nova e nasce em `error`, então projetos que já
  tinham aninhamento passam a falhar o `eslint .` — e a regra **não tem fixer**
  (nenhuma regra do ESLint sabe inventar o nome da função ou do mapa), então o
  `--fix` não resolve. Ao atualizar, rode `npx eslint .` e corrija os casos
  apontados. Levantamento nos projetos da Inmediam na época deste release:
  30 ocorrências em 19 arquivos no `inmediam_front` (8 só no
  `importar-vistoria-dialog.tsx`) e 9 em 5 arquivos no `inmediam_clientes`.

  Três formas de corrigir, em ordem de preferência:

  ```ts
  // 1. Função nomeada com early returns — o caso geral
  function getLabel({ hasAditivo, isTermoSigned }: LabelParams) {
    if (!hasAditivo) return 'o termo de vistoria'
    if (isTermoSigned) return 'o aditivo ao termo'
    return 'o termo e o aditivo'
  }

  // 2. Record indexado pelo discriminante — quando mapeia 1:1 para um enum
  const STATUS_LABEL: Record<Status, string> = {
    [Status.PENDENTE]: 'Pendente',
    [Status.ATIVA]: 'Ativa',
  }

  // 3. Condições independentes — quando o ternário escolhe JSX
  {isPending && <Skeleton />}
  {isEmpty && <Empty />}
  ```

  Um ternário único e plano (`isAtiva ? 'Ativa' : 'Inativa'`) continua permitido.

  Se um projeto precisar de mais tempo, rebaixe a regra para `warn` no próprio
  `eslint.config.mjs` — é reversível num lugar só — em vez de espalhar
  `eslint-disable` pelo código.

## 1.2.0

### Minor Changes

- 4163599: Adiciona o add-on opt-in `@inmediam/lint/prettier`.

  O preset base formata via `neostandard`/`@stylistic`, e o `@stylistic/max-len`
  **reporta mas não corrige** — nenhuma regra do ESLint sabe rewrapar uma linha,
  isso é trabalho de formatter. Na prática, quem vinha do
  `@rocketseat/eslint-config` perdia a quebra de linha automática no
  `eslint --fix` / `source.fixAll.eslint`: `Insert ⏎···` (auto-corrigível) virava
  `This line has a length of 88` (não auto-corrigível).

  O add-on roda o Prettier por dentro do ESLint (`eslint-plugin-prettier`),
  restaurando esse comportamento sem exigir a extensão do Prettier no editor.
  Como embute o `eslint-config-prettier`, precisa vir por último no array.

  Os padrões de estilo são os mesmos que o `@rocketseat/eslint-config` aplicava
  (`printWidth: 80`, `semi: false`, `singleQuote: true`, `trailingComma: 'all'`,
  `arrowParens: 'always'`), então adotá-lo não reformata projetos vindos de lá.

  Nada muda para quem não importar o novo subcaminho.

## 1.1.0

### Minor Changes

- d633c33: Adiciona o add-on de Tailwind CSS (`@inmediam/lint/tailwind`) e passa a exigir Node 20.19+.

  Novo entrypoint com o `eslint-plugin-better-tailwindcss`, para substituir o `prettier-plugin-tailwindcss`
  nos projetos. Diferente dos outros presets, é uma função e não inclui a base — ele se combina com `react`,
  `node` ou `base`:

  ```js
  import react from "@inmediam/lint/react";
  import tailwind from "@inmediam/lint/tailwind";

  export default [...react, ...tailwind({ entryPoint: "src/global.css" })];
  ```

  Ativa quatro regras, todas auto-corrigíveis: `enforce-consistent-class-order`,
  `enforce-consistent-variant-order`, `no-duplicate-classes` e `no-unnecessary-whitespace`. A ordem é a
  canônica do Tailwind (o plugin usa a API dele), então o resultado é o mesmo que o Prettier já produzia — ao
  adotar, remova o `prettier-plugin-tailwindcss` para não ter duas ferramentas formatando a mesma string.

  Ficam desligadas as regras de correção (`no-unknown-classes`, `no-conflicting-classes`,
  `enforce-canonical-classes`), que dão falso positivo em classes de componente e utilitários criados via
  `@apply`, e a `enforce-consistent-line-wrapping`, que reformata a lista de classes em várias linhas.

  O `entryPoint` é obrigatório porque a auto-detecção prometida pelo plugin não funciona na versão 4.7.0: sem
  ele o Tailwind cai no tema padrão e classes vindas do `@theme` do projeto são ordenadas errado. A função
  lança um erro explicativo em vez de deixar passar silenciosamente.

  **Atenção ao requisito de Node.** O plugin exige `^20.19.0 || ^22.12.0 || >=23.0.0` e entra como dependência
  normal, então o requisito vale para todo consumidor do pacote — antes a documentação dizia Node 18+. O campo
  `engines` foi adicionado ao `package.json` para o npm avisar em vez de quebrar no meio do lint.

  Como o `tailwindcss` é peer obrigatório do plugin, o npm passa a instalá-lo na árvore de todos os
  consumidores (~770 KB), inclusive nos projetos Node que não usam Tailwind. Foi o custo escolhido para manter
  o pacote zero-config.

### Patch Changes

- 63f7d96: Corrige os links do README que quebravam na página do npm.

  O npm reescreve links relativos usando o campo `repository` do pacote publicado, que ainda apontava para
  `github.com/inmediam/lint`. Na prática, `[CONTRIBUTING.md](./CONTRIBUTING.md)` levava para
  `github.com/inmediam/lint/blob/HEAD/CONTRIBUTING.md` — repositório inexistente.

  O `repository` já havia sido corrigido no repo (mas não publicado). Os dois links relativos do README
  (`MIGRATION.md` e `CONTRIBUTING.md`) passam a usar URL absoluta, o que resolve independentemente desse
  campo. Vale também porque o `CONTRIBUTING.md` não está no array `files` e portanto não vai no tarball — o
  link só pode apontar para o GitHub mesmo.

- 6531f34: Corrige falso positivo de `no-undef` em arquivos TypeScript.

  O `neostandard` entra depois do preset do `typescript-eslint` no array e acaba reativando regras core que o
  próprio TypeScript já cobre. Na prática o `no-undef` passava a acusar tipos globais (`React`, `JSX`) e os
  globals de test runners (`describe`, `it`, `expect`, `vi`) — só no `inmediam_front` eram 939 erros.

  O `tseslint.configs.eslintRecommended` agora é reaplicado depois do `neostandard`. Como esse preset é
  escopado em `**/*.{ts,tsx,mts,cts}`, os arquivos `.js` continuam com as regras core ligadas.
