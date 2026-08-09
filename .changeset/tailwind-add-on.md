---
'@inmediam/lint': minor
---

Adiciona o add-on de Tailwind CSS (`@inmediam/lint/tailwind`) e passa a exigir
Node 20.19+.

Novo entrypoint com o `eslint-plugin-better-tailwindcss`, para substituir o
`prettier-plugin-tailwindcss` nos projetos. Diferente dos outros presets, é uma
função e não inclui a base — ele se combina com `react`, `node` ou `base`:

```js
import react from '@inmediam/lint/react'
import tailwind from '@inmediam/lint/tailwind'

export default [...react, ...tailwind({ entryPoint: 'src/global.css' })]
```

Ativa quatro regras, todas auto-corrigíveis: `enforce-consistent-class-order`,
`enforce-consistent-variant-order`, `no-duplicate-classes` e
`no-unnecessary-whitespace`. A ordem é a canônica do Tailwind (o plugin usa a
API dele), então o resultado é o mesmo que o Prettier já produzia — ao adotar,
remova o `prettier-plugin-tailwindcss` para não ter duas ferramentas
formatando a mesma string.

Ficam desligadas as regras de correção (`no-unknown-classes`,
`no-conflicting-classes`, `enforce-canonical-classes`), que dão falso positivo
em classes de componente e utilitários criados via `@apply`, e a
`enforce-consistent-line-wrapping`, que reformata a lista de classes em várias
linhas.

O `entryPoint` é obrigatório porque a auto-detecção prometida pelo plugin não
funciona na versão 4.7.0: sem ele o Tailwind cai no tema padrão e classes
vindas do `@theme` do projeto são ordenadas errado. A função lança um erro
explicativo em vez de deixar passar silenciosamente.

**Atenção ao requisito de Node.** O plugin exige
`^20.19.0 || ^22.12.0 || >=23.0.0` e entra como dependência normal, então o
requisito vale para todo consumidor do pacote — antes a documentação dizia
Node 18+. O campo `engines` foi adicionado ao `package.json` para o npm avisar
em vez de quebrar no meio do lint.

Como o `tailwindcss` é peer obrigatório do plugin, o npm passa a instalá-lo na
árvore de todos os consumidores (~770 KB), inclusive nos projetos Node que não
usam Tailwind. Foi o custo escolhido para manter o pacote zero-config.
