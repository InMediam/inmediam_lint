---
'@inmediam/lint': minor
---

Adiciona o add-on opt-in `@inmediam/lint/prettier`.

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
