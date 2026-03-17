---
description: Criar ou atualizar a constituição do projeto a partir de entradas de princípios, garantindo que templates dependentes fiquem sincronizados.
handoffs:
  - label: Construir Especificação
    agent: speckit.specify
    prompt: Implementar a especificação da feature com base na constituição atualizada. Quero construir...
---

## Entrada do Usuário

```text
$ARGUMENTS
```

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Esboço

Você está atualizando a constituição do projeto em `.specify/memory/constitution.md`. Este arquivo é um TEMPLATE contendo tokens de placeholder entre colchetes (ex.: `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`). Sua tarefa é (a) coletar/derivar valores concretos, (b) preencher o template com precisão e (c) propagar alterações para artefatos dependentes.

Siga este fluxo de execução:

1. Carregue o template existente da constituição em `.specify/memory/constitution.md`.
   - Identifique todos os tokens placeholder no formato `[ALL_CAPS_IDENTIFIER]`.
     **IMPORTANTE**: O usuário pode exigir menos ou mais princípios do que os usados no template. Se um número for especificado, respeite-o — siga o template geral e ajuste conforme necessário.

2. Coletar/derivar valores para placeholders:
   - Se a conversa fornecer um valor, use-o.
   - Caso contrário, inferir do contexto do repo (README, docs, versões anteriores se embutidas).
   - Para datas de governança: `RATIFICATION_DATE` é a data de adoção original (se desconhecida, perguntar ou marcar TODO), `LAST_AMENDED_DATE` é hoje se houver mudanças; caso contrário, manter a anterior.
   - `CONSTITUTION_VERSION` deve incrementar seguindo versionamento semântico:
     - MAJOR: mudanças incompatíveis de governança/remoção ou redefinição de princípios.
     - MINOR: novo princípio/seção adicionada ou orientação materialmente expandida.
     - PATCH: esclarecimentos, ajustes de redação, correções semânticas menores.
   - Se o tipo de bump for ambíguo, proponha o raciocínio antes de finalizar.

3. Redigir o conteúdo atualizado da constituição:
   - Substituir cada placeholder por texto concreto (nenhum token entre colchetes deve permanecer, exceto placeholders intencionalmente mantidos — justificar explicitamente).
   - Preservar a hierarquia de headings; comentários podem ser removidos após substituição, a menos que ainda ajudem na orientação.
   - Garantir que cada seção de Princípio tenha: linha de nome sucinta, parágrafo (ou bullets) com regras inegociáveis, e justificativa explícita se não for óbvia.
   - Garantir que a seção de Governança liste procedimento de emenda, política de versionamento e expectativas de revisão de conformidade.

4. Checklist de propagação de consistência (converter checklist anterior em validações ativas):
   - Ler `.specify/templates/plan-template.md` e garantir que qualquer "Constitution Check" ou regra alinhe com os princípios atualizados.
   - Ler `.specify/templates/spec-template.md` para alinhamento de escopo/requisitos — atualizar se a constituição adicionar/remover seções obrigatórias ou restrições.
   - Ler `.specify/templates/tasks-template.md` e garantir que a categorização de tarefas reflita novos tipos orientados por princípios (ex.: observabilidade, versionamento, disciplina de testes).
   - Ler cada arquivo de comando em `.specify/templates/commands/*.md` (incluindo este) para verificar referências desatualizadas (ex.: nomes de agentes específicos como CLAUDE quando for necessário guidance genérica).
   - Ler docs de execução/runtime (ex.: `README.md`, `docs/quickstart.md`, ou orientações específicas de agente, se presentes). Atualize referências a princípios alterados.

5. Produzir um Relatório de Impacto de Sincronia (prepend como comentário HTML no topo da constituição após atualização):
   - Mudança de versão: antiga → nova
   - Lista de princípios modificados (título antigo → novo, se renomeados)
   - Seções adicionadas
   - Seções removidas
   - Templates que exigiram atualização (✅ atualizados / ⚠ pendentes) com caminhos
   - TODOs de acompanhamento se houver placeholders intencionalmente adiados.

6. Validação antes da saída final:
   - Nenhum token entre colchetes sem explicação restante.
   - Linha de versão corresponde ao relatório.
   - Datas no formato ISO YYYY-MM-DD.
   - Princípios declarativos, testáveis e sem linguagem vaga (substituir "should" por MUST/SHOULD com justificativa quando apropriado).

7. Grave a constituição concluída de volta em `.specify/memory/constitution.md` (sobrescrever).

8. Saída final ao usuário com:
   - Nova versão e justificativa do bump.
   - Quaisquer arquivos marcados para follow‑up manual.
   - Mensagem de commit sugerida (ex.: `docs: atualizar constituição para vX.Y.Z (adições de princípios + governança)`).

Requisitos de Formatação e Estilo:

- Use headings Markdown exatamente como no template (não rebaixar/promover níveis).
- Quebre linhas longas para manter legibilidade (<100 caracteres idealmente), sem forçar quebras estranhas.
- Mantenha uma linha em branco entre seções.
- Evite espaços em branco finais.

Se o usuário fornecer atualizações parciais (ex.: apenas uma revisão de princípio), ainda assim faça validação e decisão de versão.

Se informações críticas estiverem faltando (ex.: data de ratificação realmente desconhecida), insira `TODO(<FIELD_NAME>): explicação` e inclua no Relatório de Impacto de Sincronia como itens adiados.

Não crie um novo template; sempre opere sobre o arquivo existente `.specify/memory/constitution.md`.

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.---
description: Create or update the project constitution from interactive or provided principle inputs, ensuring all dependent templates stay in sync.
handoffs:

- label: Build Specification
  agent: speckit.specify
  prompt: Implement the feature specification based on the updated constitution. I want to build...

---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are updating the project constitution at `.specify/memory/constitution.md`. This file is a TEMPLATE containing placeholder tokens in square brackets (e.g. `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`). Your job is to (a) collect/derive concrete values, (b) fill the template precisely, and (c) propagate any amendments across dependent artifacts.

Follow this execution flow:

1. Load the existing constitution template at `.specify/memory/constitution.md`.
   - Identify every placeholder token of the form `[ALL_CAPS_IDENTIFIER]`.
     **IMPORTANT**: The user might require less or more principles than the ones used in the template. If a number is specified, respect that - follow the general template. You will update the doc accordingly.

2. Collect/derive values for placeholders:
   - If user input (conversation) supplies a value, use it.
   - Otherwise infer from existing repo context (README, docs, prior constitution versions if embedded).
   - For governance dates: `RATIFICATION_DATE` is the original adoption date (if unknown ask or mark TODO), `LAST_AMENDED_DATE` is today if changes are made, otherwise keep previous.
   - `CONSTITUTION_VERSION` must increment according to semantic versioning rules:
     - MAJOR: Backward incompatible governance/principle removals or redefinitions.
     - MINOR: New principle/section added or materially expanded guidance.
     - PATCH: Clarifications, wording, typo fixes, non-semantic refinements.
   - If version bump type ambiguous, propose reasoning before finalizing.

3. Draft the updated constitution content:
   - Replace every placeholder with concrete text (no bracketed tokens left except intentionally retained template slots that the project has chosen not to define yet—explicitly justify any left).
   - Preserve heading hierarchy and comments can be removed once replaced unless they still add clarifying guidance.
   - Ensure each Principle section: succinct name line, paragraph (or bullet list) capturing non‑negotiable rules, explicit rationale if not obvious.
   - Ensure Governance section lists amendment procedure, versioning policy, and compliance review expectations.

4. Consistency propagation checklist (convert prior checklist into active validations):
   - Read `.specify/templates/plan-template.md` and ensure any "Constitution Check" or rules align with updated principles.
   - Read `.specify/templates/spec-template.md` for scope/requirements alignment—update if constitution adds/removes mandatory sections or constraints.
   - Read `.specify/templates/tasks-template.md` and ensure task categorization reflects new or removed principle-driven task types (e.g., observability, versioning, testing discipline).
   - Read each command file in `.specify/templates/commands/*.md` (including this one) to verify no outdated references (agent-specific names like CLAUDE only) remain when generic guidance is required.
   - Read any runtime guidance docs (e.g., `README.md`, `docs/quickstart.md`, or agent-specific guidance files if present). Update references to principles changed.

5. Produce a Sync Impact Report (prepend as an HTML comment at top of the constitution file after update):
   - Version change: old → new
   - List of modified principles (old title → new title if renamed)
   - Added sections
   - Removed sections
   - Templates requiring updates (✅ updated / ⚠ pending) with file paths
   - Follow-up TODOs if any placeholders intentionally deferred.

6. Validation before final output:
   - No remaining unexplained bracket tokens.
   - Version line matches report.
   - Dates ISO format YYYY-MM-DD.
   - Principles are declarative, testable, and free of vague language ("should" → replace with MUST/SHOULD rationale where appropriate).

7. Write the completed constitution back to `.specify/memory/constitution.md` (overwrite).

8. Output a final summary to the user with:
   - New version and bump rationale.
   - Any files flagged for manual follow-up.
   - Suggested commit message (e.g., `docs: amend constitution to vX.Y.Z (principle additions + governance update)`).

Formatting & Style Requirements:

- Use Markdown headings exactly as in the template (do not demote/promote levels).
- Wrap long rationale lines to keep readability (<100 chars ideally) but do not hard enforce with awkward breaks.
- Keep a single blank line between sections.
- Avoid trailing whitespace.

If the user supplies partial updates (e.g., only one principle revision), still perform validation and version decision steps.

If critical info missing (e.g., ratification date truly unknown), insert `TODO(<FIELD_NAME>): explanation` and include in the Sync Impact Report under deferred items.

Do not create a new template; always operate on the existing `.specify/memory/constitution.md` file.
