---
"@inmediam/lint": major
---

Proíbe ternários aninhados no config base (`no-nested-ternary` em `error`).

Um ternário cujo branch contém outro ternário é uma decisão de três ou mais
vias, e uma decisão dessas precisa de um nome — não de mais um nível de
indentação. O `@stylistic/multiline-ternary` e o Prettier deixavam o
aninhamento *bonito*, mas continuava ilegível: quem lê tem que segurar duas
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
