---
'@inmediam/lint': patch
---

Corrige falso positivo de `no-undef` em arquivos TypeScript.

O `neostandard` entra depois do preset do `typescript-eslint` no array e acaba
reativando regras core que o próprio TypeScript já cobre. Na prática o
`no-undef` passava a acusar tipos globais (`React`, `JSX`) e os globals de test
runners (`describe`, `it`, `expect`, `vi`) — só no `inmediam_front` eram 939
erros.

O `tseslint.configs.eslintRecommended` agora é reaplicado depois do
`neostandard`. Como esse preset é escopado em `**/*.{ts,tsx,mts,cts}`, os
arquivos `.js` continuam com as regras core ligadas.
