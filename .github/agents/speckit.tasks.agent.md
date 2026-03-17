---
description: Gerar um tasks.md acionável e ordenado por dependências com base nos artefatos de design disponíveis.
handoffs:
  - label: Analisar Consistência
    agent: speckit.analyze
    prompt: Executar análise de consistência do projeto
    send: true
  - label: Implementar Projeto
    agent: speckit.implement
    prompt: Iniciar implementação por fases
    send: true
---

## Entrada do Usuário

```text
$ARGUMENTS
```

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Esboço

1. **Setup**: Execute `.specify/scripts/bash/check-prerequisites.sh --json` a partir da raiz do repo e analise FEATURE_DIR e a lista AVAILABLE_DOCS. Todos os caminhos devem ser absolutos. Para aspas simples em argumentos como "I'm Groot", use a sintaxe de escape: ex. 'I'\''m Groot' (ou aspas duplas, se possível: "I'm Groot").

2. **Carregar documentos de design**: Ler a partir de FEATURE_DIR:
   - **Obrigatórios**: plan.md (stack, libs, estrutura), spec.md (histórias de usuário com prioridades)
   - **Opcionais**: data-model.md (entidades), contracts/ (endpoints), research.md (decisões), quickstart.md (cenários de teste)
   - Nota: nem todos os projetos têm todos os docs. Gere tarefas com base no que estiver disponível.

3. **Executar o fluxo de geração de tarefas**:
   - Ler plan.md e extrair stack, libs e estrutura do projeto
   - Ler spec.md e extrair histórias de usuário e prioridades (P1, P2, P3...)
   - Se data-model.md existir: extrair entidades e mapear para histórias
   - Se contracts/ existir: mapear endpoints para histórias
   - Se research.md existir: extrair decisões para tarefas de setup
   - Gerar tarefas organizadas por história (ver Regras de Geração)
   - Gerar grafo de dependências com ordem de conclusão de histórias
   - Criar exemplos de execução paralela por história
   - Validar completude (cada história com tarefas necessárias, testável de forma independente)

4. **Gerar tasks.md**: Usar `.specify/templates/tasks-template.md` como estrutura e preencher com:
   - Nome correto da feature a partir de plan.md
   - Fase 1: Setup (inicialização)
   - Fase 2: Fundacional (pré‑requisitos bloqueantes)
   - Fase 3+: Uma fase por história (ordem de prioridade da spec)
   - Cada fase inclui: objetivo da história, critérios de teste independentes, testes (se solicitados), tarefas de implementação
   - Fase final: Polimento e preocupações transversais
   - Todas as tarefas devem seguir o formato estrito (ver Regras)
   - Caminhos de arquivos claros para cada tarefa
   - Seção de dependências com ordem de conclusão de histórias
   - Exemplos de paralelismo por história
   - Seção de estratégia de implementação (MVP primeiro, entrega incremental)

5. **Relatório**: Informe o caminho do tasks.md gerado e um resumo:
   - Contagem total de tarefas
   - Contagem por história de usuário
   - Oportunidades de paralelismo identificadas
   - Critérios de teste independentes por história
   - Escopo MVP sugerido (geralmente apenas História 1)
   - Validação de formato: confirmar que TODAS as tarefas seguem o checklist (checkbox, ID, labels, caminhos)

Contexto para geração de tarefas: $ARGUMENTS

O tasks.md deve ser imediatamente executável — cada tarefa deve ser específica o suficiente para que um LLM conclua sem contexto adicional.

## Regras de Geração de Tarefas

**CRÍTICO**: Tarefas DEVEM ser organizadas por história de usuário para permitir implementação e testes independentes.

**Testes são OPCIONAIS**: Gere tarefas de teste apenas se explicitamente solicitado na spec ou se o usuário pedir abordagem TDD.

### Formato de Checklist (OBRIGATÓRIO)

Cada tarefa DEVE seguir estritamente este formato:

```text
- [ ] [TaskID] [P?] [Story?] Descrição com caminho do arquivo
```

**Componentes do formato**:

1. **Checkbox**: Sempre iniciar com `- [ ]`
2. **Task ID**: Sequencial (T001, T002, T003...) em ordem de execução
3. **Marcador [P]**: Incluir APENAS se a tarefa for paralelizável (arquivos diferentes, sem dependências pendentes)
4. **Label [Story]**: OBRIGATÓRIO para tarefas da fase de história
   - Formato: [US1], [US2], [US3] (mapeia para histórias da spec)
   - Fase de setup: SEM label
   - Fase fundacional: SEM label
   - Fases de histórias: DEVEM ter label
   - Fase de polimento: SEM label
5. **Descrição**: Ação clara com caminho exato do arquivo

**Exemplos**:

- ✅ CORRETO: `- [ ] T001 Criar estrutura do projeto conforme o plano`
- ✅ CORRETO: `- [ ] T005 [P] Implementar middleware de autenticação em src/middleware/auth.py`
- ✅ CORRETO: `- [ ] T012 [P] [US1] Criar modelo User em src/models/user.py`
- ✅ CORRETO: `- [ ] T014 [US1] Implementar UserService em src/services/user_service.py`
- ❌ ERRADO: `- [ ] Criar modelo User` (sem ID e label de história)
- ❌ ERRADO: `T001 [US1] Criar modelo` (sem checkbox)
- ❌ ERRADO: `- [ ] [US1] Criar modelo User` (sem Task ID)
- ❌ ERRADO: `- [ ] T001 [US1] Criar modelo` (sem caminho de arquivo)

### Organização das Tarefas

1. **A partir das histórias (spec.md)** — Organização primária:
   - Cada história (P1, P2, P3...) ganha sua própria fase
   - Mapear todos os componentes relacionados à história:
     - Modelos necessários
     - Serviços necessários
     - Endpoints/UI necessários
     - Se testes solicitados: testes específicos da história
   - Marcar dependências entre histórias (a maioria deve ser independente)

2. **A partir dos contratos**:
   - Mapear cada endpoint/contrato → história correspondente
   - Se testes solicitados: cada contrato → tarefa de teste do contrato [P] antes da implementação na fase da história

3. **A partir do modelo de dados**:
   - Mapear cada entidade para a(s) história(s) que a utilizam
   - Se entidade atende múltiplas histórias: colocar na história mais cedo ou fase de setup
   - Relacionamentos → tarefas na camada de serviços da fase apropriada

4. **A partir de setup/infraestrutura**:
   - Infra compartilhada → fase de Setup (Fase 1)
   - Tarefas fundacionais/bloqueantes → fase Fundacional (Fase 2)
   - Setup específico da história → dentro da fase da história

### Estrutura de Fases

- **Fase 1**: Setup (inicialização do projeto)
- **Fase 2**: Fundacional (pré‑requisitos bloqueantes — deve concluir antes das histórias)
- **Fase 3+**: Histórias em ordem de prioridade (P1, P2, P3...)
  - Dentro de cada história: Testes (se solicitados) → Modelos → Serviços → Endpoints → Integração
  - Cada fase deve ser um incremento completo e testável de forma independente
- **Fase Final**: Polimento e preocupações transversais

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.---
description: Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.
handoffs:

- label: Analyze For Consistency
  agent: speckit.analyze
  prompt: Run a project analysis for consistency
  send: true
- label: Implement Project
  agent: speckit.implement
  prompt: Start the implementation in phases
  send: true

---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. **Setup**: Run `.specify/scripts/bash/check-prerequisites.sh --json` from repo root and parse FEATURE_DIR and AVAILABLE_DOCS list. All paths must be absolute. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load design documents**: Read from FEATURE_DIR:
   - **Required**: plan.md (tech stack, libraries, structure), spec.md (user stories with priorities)
   - **Optional**: data-model.md (entities), contracts/ (API endpoints), research.md (decisions), quickstart.md (test scenarios)
   - Note: Not all projects have all documents. Generate tasks based on what's available.

3. **Execute task generation workflow**:
   - Load plan.md and extract tech stack, libraries, project structure
   - Load spec.md and extract user stories with their priorities (P1, P2, P3, etc.)
   - If data-model.md exists: Extract entities and map to user stories
   - If contracts/ exists: Map endpoints to user stories
   - If research.md exists: Extract decisions for setup tasks
   - Generate tasks organized by user story (see Task Generation Rules below)
   - Generate dependency graph showing user story completion order
   - Create parallel execution examples per user story
   - Validate task completeness (each user story has all needed tasks, independently testable)

4. **Generate tasks.md**: Use `.specify/templates/tasks-template.md` as structure, fill with:
   - Correct feature name from plan.md
   - Phase 1: Setup tasks (project initialization)
   - Phase 2: Foundational tasks (blocking prerequisites for all user stories)
   - Phase 3+: One phase per user story (in priority order from spec.md)
   - Each phase includes: story goal, independent test criteria, tests (if requested), implementation tasks
   - Final Phase: Polish & cross-cutting concerns
   - All tasks must follow the strict checklist format (see Task Generation Rules below)
   - Clear file paths for each task
   - Dependencies section showing story completion order
   - Parallel execution examples per story
   - Implementation strategy section (MVP first, incremental delivery)

5. **Report**: Output path to generated tasks.md and summary:
   - Total task count
   - Task count per user story
   - Parallel opportunities identified
   - Independent test criteria for each story
   - Suggested MVP scope (typically just User Story 1)
   - Format validation: Confirm ALL tasks follow the checklist format (checkbox, ID, labels, file paths)

Context for task generation: $ARGUMENTS

The tasks.md should be immediately executable - each task must be specific enough that an LLM can complete it without additional context.

## Task Generation Rules

**CRITICAL**: Tasks MUST be organized by user story to enable independent implementation and testing.

**Tests are OPTIONAL**: Only generate test tasks if explicitly requested in the feature specification or if user requests TDD approach.

### Checklist Format (REQUIRED)

Every task MUST strictly follow this format:

```text
- [ ] [TaskID] [P?] [Story?] Description with file path
```

**Format Components**:

1. **Checkbox**: ALWAYS start with `- [ ]` (markdown checkbox)
2. **Task ID**: Sequential number (T001, T002, T003...) in execution order
3. **[P] marker**: Include ONLY if task is parallelizable (different files, no dependencies on incomplete tasks)
4. **[Story] label**: REQUIRED for user story phase tasks only
   - Format: [US1], [US2], [US3], etc. (maps to user stories from spec.md)
   - Setup phase: NO story label
   - Foundational phase: NO story label
   - User Story phases: MUST have story label
   - Polish phase: NO story label
5. **Description**: Clear action with exact file path

**Examples**:

- ✅ CORRECT: `- [ ] T001 Create project structure per implementation plan`
- ✅ CORRECT: `- [ ] T005 [P] Implement authentication middleware in src/middleware/auth.py`
- ✅ CORRECT: `- [ ] T012 [P] [US1] Create User model in src/models/user.py`
- ✅ CORRECT: `- [ ] T014 [US1] Implement UserService in src/services/user_service.py`
- ❌ WRONG: `- [ ] Create User model` (missing ID and Story label)
- ❌ WRONG: `T001 [US1] Create model` (missing checkbox)
- ❌ WRONG: `- [ ] [US1] Create User model` (missing Task ID)
- ❌ WRONG: `- [ ] T001 [US1] Create model` (missing file path)

### Task Organization

1. **From User Stories (spec.md)** - PRIMARY ORGANIZATION:
   - Each user story (P1, P2, P3...) gets its own phase
   - Map all related components to their story:
     - Models needed for that story
     - Services needed for that story
     - Endpoints/UI needed for that story
     - If tests requested: Tests specific to that story
   - Mark story dependencies (most stories should be independent)

2. **From Contracts**:
   - Map each contract/endpoint → to the user story it serves
   - If tests requested: Each contract → contract test task [P] before implementation in that story's phase

3. **From Data Model**:
   - Map each entity to the user story(ies) that need it
   - If entity serves multiple stories: Put in earliest story or Setup phase
   - Relationships → service layer tasks in appropriate story phase

4. **From Setup/Infrastructure**:
   - Shared infrastructure → Setup phase (Phase 1)
   - Foundational/blocking tasks → Foundational phase (Phase 2)
   - Story-specific setup → within that story's phase

### Phase Structure

- **Phase 1**: Setup (project initialization)
- **Phase 2**: Foundational (blocking prerequisites - MUST complete before user stories)
- **Phase 3+**: User Stories in priority order (P1, P2, P3...)
  - Within each story: Tests (if requested) → Models → Services → Endpoints → Integration
  - Each phase should be a complete, independently testable increment
- **Final Phase**: Polish & Cross-Cutting Concerns
