---
'@inmediam/lint': patch
---

Corrige os links do README que quebravam na página do npm.

O npm reescreve links relativos usando o campo `repository` do pacote
publicado, que ainda apontava para `github.com/inmediam/lint`. Na prática,
`[CONTRIBUTING.md](./CONTRIBUTING.md)` levava para
`github.com/inmediam/lint/blob/HEAD/CONTRIBUTING.md` — repositório inexistente.

O `repository` já havia sido corrigido no repo (mas não publicado). Os dois
links relativos do README (`MIGRATION.md` e `CONTRIBUTING.md`) passam a usar
URL absoluta, o que resolve independentemente desse campo. Vale também porque o
`CONTRIBUTING.md` não está no array `files` e portanto não vai no tarball — o
link só pode apontar para o GitHub mesmo.
