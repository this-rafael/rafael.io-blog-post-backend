---
description: Converter tasks existentes em issues do GitHub ordenadas por dependências, com base nos artefatos de design disponíveis.
tools: ["github/github-mcp-server/issue_write"]
---

## Entrada do Usuário

```text
$ARGUMENTS
```

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Esboço

1. Execute `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` a partir da raiz do repo e analise FEATURE_DIR e a lista AVAILABLE_DOCS. Todos os caminhos devem ser absolutos. Para aspas simples em argumentos como "I'm Groot", use a sintaxe de escape: ex. 'I'\''m Groot' (ou aspas duplas, se possível: "I'm Groot").
1. A partir do script executado, extraia o caminho para **tasks**.
1. Obtenha o remoto do Git com:

```bash
git config --get remote.origin.url
```

> [!CAUTION]
> SÓ PROSSIGA SE O REMOTO FOR UMA URL DO GITHUB

1. Para cada tarefa na lista, use o servidor MCP do GitHub para criar uma issue no repositório correspondente ao remoto do Git.

> [!CAUTION]
> SOB NENHUMA CIRCUNSTÂNCIA CRIE ISSUES EM REPOSITÓRIOS QUE NÃO CORRESPONDAM À URL REMOTA

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.---
description: Convert existing tasks into actionable, dependency-ordered GitHub issues for the feature based on available design artifacts.
tools: ['github/github-mcp-server/issue_write']

---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. Run `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` from repo root and parse FEATURE_DIR and AVAILABLE_DOCS list. All paths must be absolute. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").
1. From the executed script, extract the path to **tasks**.
1. Get the Git remote by running:

```bash
git config --get remote.origin.url
```

> [!CAUTION]
> ONLY PROCEED TO NEXT STEPS IF THE REMOTE IS A GITHUB URL

1. For each task in the list, use the GitHub MCP server to create a new issue in the repository that is representative of the Git remote.

> [!CAUTION]
> UNDER NO CIRCUMSTANCES EVER CREATE ISSUES IN REPOSITORIES THAT DO NOT MATCH THE REMOTE URL
