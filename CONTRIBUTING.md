# Contribuindo para o `@inmediam/lint`

Obrigado pelo interesse em contribuir! Este documento explica tudo o que você
precisa para colocar suas mudanças no projeto — desde a configuração do ambiente
até o merge do PR e a publicação no npm.

## Índice

- [Visão geral do repositório](#visão-geral-do-repositório)
- [Configurando localmente](#configurando-localmente)
- [Estratégia de branches](#estratégia-de-branches)
- [Fazendo mudanças](#fazendo-mudanças)
- [Escrevendo um changeset](#escrevendo-um-changeset)
- [Abrindo um Pull Request](#abrindo-um-pull-request)
- [Processo de revisão](#processo-de-revisão)
- [Processo de release](#processo-de-release)
- [Convenções de commit](#convenções-de-commit)
- [Reportando bugs](#reportando-bugs)
- [Sugerindo melhorias](#sugerindo-melhorias)

---

## Visão geral do repositório

Este é um **pacote único** (não é monorepo) que distribui a configuração de
ESLint padrão da Inmediam (flat config, ESLint 9+). Os arquivos de config são
`.mjs` publicados diretamente — não há etapa de build.

```
inmediam_lint/
├── base.mjs              # Config base (export padrão e ./base)
├── node.mjs              # Config para Node.js (./node)
├── react.mjs             # Config para React (./react)
├── eslint.config.mjs     # Config usada para lintar este próprio repositório
├── .changeset/           # Changesets pendentes (criados por quem contribui, consumidos pela CI)
├── .github/
│   └── workflows/
│       └── release.yml   # Versiona e publica no npm a cada merge na main
├── README.md
└── package.json
```

---

## Configurando localmente

**Requisitos:** Node.js 18+ e npm 9+ (recomendado npm 11.5.1+ para publicar
localmente via Trusted Publishing).

1. Faça fork e clone o repositório

```bash
git clone https://github.com/<seu-usuario>/lint.git
cd lint
```

2. Instale as dependências

```bash
npm install
```

3. Rode o lint do próprio projeto

```bash
npm run lint
```

---

## Estratégia de branches

Sempre crie uma branch a partir da `main` atualizada:

```bash
git checkout main
git pull origin main
git checkout -b feat/minha-mudanca
```

Use os seguintes prefixos para nomear branches:

| Prefixo | Use para |
|---------|----------|
| `feat/` | Novas regras ou configurações |
| `fix/` | Correções de bugs |
| `refactor/` | Refatoração sem mudança de comportamento |
| `docs/` | Mudanças apenas de documentação |
| `chore/` | Manutenção, dependências, config |

Exemplos: `feat/regra-import-sort`, `fix/react-hooks-override`, `docs/atualiza-readme`.

---

## Fazendo mudanças

As configurações ficam nos arquivos `.mjs` da raiz:

- **Base:** `base.mjs` — regras compartilhadas por todos os ambientes
- **Node:** `node.mjs` — regras específicas de Node.js
- **React:** `react.mjs` — regras específicas de React

Ao alterar qualquer config, rode `npm run lint` para garantir que o próprio
repositório continua passando, e teste o efeito da mudança em um projeto real
sempre que possível.

---

## Escrevendo um changeset

Todo PR que altera o pacote publicado deve incluir um changeset. Um changeset é
um arquivo curto que descreve o que mudou e qual tipo de bump de versão ele
exige. É isso que dispara o processo automatizado de release.

Rode a partir da raiz do repositório:

```bash
npm run changeset
```

Siga os prompts interativos:

1. **Selecione o pacote afetado** — `@inmediam/lint`
2. **Escolha o tipo de bump:**
   - `patch` — correções de bug, ajustes internos, sem mudança de regras visível
   - `minor` — novas regras ou configs, retrocompatível
   - `major` — mudanças que quebram configs existentes (ex.: regra que passa de
     `warn` para `error`, ou remoção de um export)
3. **Escreva um resumo curto** — ele aparecerá no `CHANGELOG.md`. Descreva o que
   mudou da perspectiva de quem consome a config.

**Bons resumos de changeset:**
```
Adiciona ordenação de imports com simple-import-sort no config base
Corrige override de react-hooks que não aplicava em arquivos .tsx
Eleva no-unused-vars de warn para error (breaking)
```

**Evite:**
```
mudanças
arruma coisas
update
```

Commite o arquivo gerado em `.changeset/` junto com as suas mudanças de código.

> PRs sem changeset não disparam um release. Isso é aceitável para mudanças
> `docs/` ou `chore/`, mas é obrigatório para qualquer alteração que afete o
> pacote publicado `@inmediam/lint`.

---

## Abrindo um Pull Request

1. Faça push da sua branch para o GitHub

```bash
git push origin feat/minha-mudanca
```

2. Abra um Pull Request contra a `main` no GitHub.

3. Preencha a descrição do PR com:
   - **O que mudou** e por quê
   - O número da **issue** relacionada, se houver (ex.: `Closes #42`)

4. Garanta que o arquivo de changeset está incluído no diff do PR (`.changeset/*.md`).

---

## Processo de revisão

- Um mantenedor revisará seu PR e pode solicitar mudanças.
- A CI roda automaticamente e deve passar antes do merge.
- Após aprovado, um mantenedor faz o merge na `main`.
- O processo de release roda automaticamente após o merge (veja abaixo).

---

## Processo de release

Os releases são totalmente automatizados. Depois que um PR é mergeado na `main`:

1. A **GitHub Action de Release** detecta os changesets em `.changeset/` e abre
   (ou atualiza) um PR automático chamado **"Version Packages"**, que sobe a
   versão no `package.json` e atualiza o `CHANGELOG.md`.
2. Quando esse PR **"Version Packages"** é mergeado, a Action roda novamente,
   não há mais changesets pendentes, e ela executa `changeset publish` —
   **publicando a nova versão no npm via Trusted Publishing (OIDC)**, com
   provenance e sem token armazenado.

Você não precisa subir versões manualmente, editar o changelog ou rodar
nenhum passo de publicação.

> **Primeira configuração (uma única vez, feita por mantenedor):** a primeira
> versão precisa ser publicada manualmente (`npm publish`) para o pacote existir
> no registry; em seguida, habilita-se o *Trusted Publisher* em
> `npmjs.com → @inmediam/lint → Settings → Trusted Publishing` (provider GitHub
> Actions, repositório `inmediam/lint`, workflow `release.yml`) e marca-se
> "Allow GitHub Actions to create and approve pull requests" nas configurações
> de Actions do repositório. A partir daí, tudo é automático.

---

## Convenções de commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/). Cada
mensagem de commit deve seguir o formato:

```
<tipo>(<escopo>): <descrição curta>
```

**Tipos:**

| Tipo | Quando usar |
|------|-------------|
| `feat` | Nova regra ou configuração |
| `fix` | Correção de bug |
| `refactor` | Mudança de código sem alterar comportamento |
| `docs` | Apenas documentação |
| `chore` | Build, tooling, config ou dependências |

**Exemplos:**

```
feat(base): adiciona simple-import-sort ao config base
fix(react): corrige override de react-hooks em arquivos .tsx
docs(readme): atualiza instruções de instalação
chore(deps): atualiza typescript-eslint para v8
```

Mantenha a linha de assunto com menos de 72 caracteres.

---

## Reportando bugs

Abra uma [Issue no GitHub](https://github.com/inmediam/lint/issues/new) e inclua:

- Um título claro descrevendo o problema
- A versão de `@inmediam/lint` e do `eslint` que você está usando
- Passos para reproduzir
- Comportamento esperado vs. comportamento atual
- Uma reprodução mínima, se possível

---

## Sugerindo melhorias

Abra uma [Issue no GitHub](https://github.com/inmediam/lint/issues/new) com a
label `enhancement` e inclua:

- A descrição do problema que você quer resolver
- Como seria a solução proposta
- Quaisquer alternativas que você considerou
