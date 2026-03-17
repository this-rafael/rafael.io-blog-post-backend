---
description: Executar o plano de implementação processando e executando todas as tarefas definidas em tasks.md
---

## Entrada do Usuário

```text
$ARGUMENTS
```

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Esboço

1. Execute `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` a partir da raiz do repo e analise FEATURE_DIR e a lista AVAILABLE_DOCS. Todos os caminhos devem ser absolutos. Para aspas simples em argumentos como "I'm Groot", use a sintaxe de escape: ex. 'I'\''m Groot' (ou aspas duplas, se possível: "I'm Groot").

2. **Verificar status dos checklists** (se FEATURE_DIR/checklists/ existir):
   - Varra todos os arquivos de checklist no diretório checklists/
   - Para cada checklist, conte:
     - Total de itens: linhas com `- [ ]` ou `- [X]` ou `- [x]`
     - Itens concluídos: linhas com `- [X]` ou `- [x]`
     - Itens incompletos: linhas com `- [ ]`
   - Crie uma tabela de status:

     ```text
     | Checklist | Total | Concluídos | Incompletos | Status |
     |-----------|-------|------------|-------------|--------|
     | ux.md     | 12    | 12         | 0           | ✓ PASS |
     | test.md   | 8     | 5          | 3           | ✗ FAIL |
     | security.md | 6   | 6          | 0           | ✓ PASS |
     ```

   - Calcule o status geral:
     - **PASS**: todos os checklists com 0 itens incompletos
     - **FAIL**: um ou mais checklists com itens incompletos

   - **Se algum checklist estiver incompleto**:
     - Exiba a tabela com contagens de itens incompletos
     - **PARE** e pergunte: "Alguns checklists estão incompletos. Deseja prosseguir com a implementação mesmo assim? (sim/não)"
     - Aguarde a resposta do usuário antes de continuar
     - Se o usuário responder "não" ou "aguardar" ou "parar", interrompa a execução
     - Se o usuário responder "sim" ou "prosseguir" ou "continuar", siga para a etapa 3

   - **Se todos os checklists estiverem completos**:
     - Exiba a tabela mostrando todos os checklists aprovados
     - Prossiga automaticamente para a etapa 3

3. Carregar e analisar o contexto de implementação:
   - **OBRIGATÓRIO**: Ler tasks.md para a lista completa de tarefas e plano de execução
   - **OBRIGATÓRIO**: Ler plan.md para stack, arquitetura e estrutura de arquivos
   - **SE EXISTIR**: Ler data-model.md para entidades e relacionamentos
   - **SE EXISTIR**: Ler contracts/ para especificações de API e requisitos de teste
   - **SE EXISTIR**: Ler research.md para decisões técnicas e restrições
   - **SE EXISTIR**: Ler quickstart.md para cenários de integração

4. **Verificação de Setup do Projeto**:
   - **OBRIGATÓRIO**: Criar/verificar arquivos de ignore com base na configuração real do projeto:

   **Lógica de Detecção & Criação**:
   - Verificar se o comando abaixo é bem-sucedido para determinar se o repo é git (criar/verificar .gitignore se for):

     ```sh
     git rev-parse --git-dir 2>/dev/null
     ```

   - Verificar se Dockerfile\* existe ou se Docker está em plan.md → criar/verificar .dockerignore
   - Verificar se .eslintrc\* existe → criar/verificar .eslintignore
   - Verificar se eslint.config.\* existe → garantir que o config tenha `ignores` cobrindo padrões exigidos
   - Verificar se .prettierrc\* existe → criar/verificar .prettierignore
   - Verificar se .npmrc ou package.json existe → criar/verificar .npmignore (se publicar)
   - Verificar se arquivos terraform (\*.tf) existem → criar/verificar .terraformignore
   - Verificar necessidade de .helmignore (charts helm presentes) → criar/verificar .helmignore

   **Se o ignore já existe**: Verificar se contém padrões essenciais, acrescentar apenas os críticos faltantes
   **Se o ignore não existir**: Criar com o conjunto completo de padrões para a tecnologia detectada

   **Padrões comuns por tecnologia** (a partir da stack em plan.md):
   - **Node.js/JavaScript/TypeScript**: `node_modules/`, `dist/`, `build/`, `*.log`, `.env*`
   - **Python**: `__pycache__/`, `*.pyc`, `.venv/`, `venv/`, `dist/`, `*.egg-info/`
   - **Java**: `target/`, `*.class`, `*.jar`, `.gradle/`, `build/`
   - **C#/.NET**: `bin/`, `obj/`, `*.user`, `*.suo`, `packages/`
   - **Go**: `*.exe`, `*.test`, `vendor/`, `*.out`
   - **Ruby**: `.bundle/`, `log/`, `tmp/`, `*.gem`, `vendor/bundle/`
   - **PHP**: `vendor/`, `*.log`, `*.cache`, `*.env`
   - **Rust**: `target/`, `debug/`, `release/`, `*.rs.bk`, `*.rlib`, `*.prof*`, `.idea/`, `*.log`, `.env*`
   - **Kotlin**: `build/`, `out/`, `.gradle/`, `.idea/`, `*.class`, `*.jar`, `*.iml`, `*.log`, `.env*`
   - **C++**: `build/`, `bin/`, `obj/`, `out/`, `*.o`, `*.so`, `*.a`, `*.exe`, `*.dll`, `.idea/`, `*.log`, `.env*`
   - **C**: `build/`, `bin/`, `obj/`, `out/`, `*.o`, `*.a`, `*.so`, `*.exe`, `Makefile`, `config.log`, `.idea/`, `*.log`, `.env*`
   - **Swift**: `.build/`, `DerivedData/`, `*.swiftpm/`, `Packages/`
   - **R**: `.Rproj.user/`, `.Rhistory`, `.RData`, `.Ruserdata`, `*.Rproj`, `packrat/`, `renv/`
   - **Universal**: `.DS_Store`, `Thumbs.db`, `*.tmp`, `*.swp`, `.vscode/`, `.idea/`

   **Padrões específicos por ferramenta**:
   - **Docker**: `node_modules/`, `.git/`, `Dockerfile*`, `.dockerignore`, `*.log*`, `.env*`, `coverage/`
   - **ESLint**: `node_modules/`, `dist/`, `build/`, `coverage/`, `*.min.js`
   - **Prettier**: `node_modules/`, `dist/`, `build/`, `coverage/`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
   - **Terraform**: `.terraform/`, `*.tfstate*`, `*.tfvars`, `.terraform.lock.hcl`
   - **Kubernetes/k8s**: `*.secret.yaml`, `secrets/`, `.kube/`, `kubeconfig*`, `*.key`, `*.crt`

5. Analisar a estrutura de tasks.md e extrair:
   - **Fases de tarefa**: Setup, Testes, Core, Integração, Polimento
   - **Dependências**: Sequencial vs. paralela
   - **Detalhes da tarefa**: ID, descrição, caminhos de arquivos, marcadores [P]
   - **Fluxo de execução**: ordem e requisitos de dependência

6. Executar a implementação seguindo o plano de tarefas:
   - **Execução por fase**: completar cada fase antes de passar para a próxima
   - **Respeitar dependências**: tarefas sequenciais em ordem; tarefas [P] podem rodar em paralelo
   - **Seguir TDD**: executar tarefas de teste antes das tarefas de implementação correspondentes
   - **Coordenação por arquivo**: tarefas que afetam os mesmos arquivos devem ser sequenciais
   - **Checkpoints de validação**: verificar conclusão de cada fase antes de prosseguir

7. Regras de execução da implementação:
   - **Setup primeiro**: inicializar estrutura do projeto, dependências, configuração
   - **Testes antes do código**: se for necessário escrever testes para contratos, entidades e integrações
   - **Desenvolvimento core**: implementar modelos, serviços, comandos CLI, endpoints
   - **Integração**: conexões de banco, middleware, logging, serviços externos
   - **Polimento e validação**: testes unitários, otimização de performance, documentação

8. Acompanhamento de progresso e tratamento de erros:
   - Reportar progresso após cada tarefa concluída
   - Parar execução se qualquer tarefa não paralela falhar
   - Para tarefas [P], continuar as bem‑sucedidas e reportar falhas
   - Fornecer mensagens de erro claras com contexto
   - Sugerir próximos passos se a implementação não puder prosseguir
   - **IMPORTANTE**: Para tarefas concluídas, marque como [X] no arquivo de tarefas

9. Validação de conclusão:
   - Verificar se todas as tarefas obrigatórias foram concluídas
   - Checar se as funcionalidades implementadas correspondem à especificação original
   - Validar se os testes passam e a cobertura atende aos requisitos
   - Confirmar que a implementação segue o plano técnico
   - Reportar status final com resumo do trabalho concluído

Nota: Este comando assume um detalhamento completo de tarefas em tasks.md. Se as tarefas estiverem incompletas ou ausentes, sugira executar `/speckit.tasks` primeiro para regenerar a lista.

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.---
description: Execute the implementation plan by processing and executing all tasks defined in tasks.md

---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. Run `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` from repo root and parse FEATURE_DIR and AVAILABLE_DOCS list. All paths must be absolute. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Check checklists status** (if FEATURE_DIR/checklists/ exists):
   - Scan all checklist files in the checklists/ directory
   - For each checklist, count:
     - Total items: All lines matching `- [ ]` or `- [X]` or `- [x]`
     - Completed items: Lines matching `- [X]` or `- [x]`
     - Incomplete items: Lines matching `- [ ]`
   - Create a status table:

     ```text
     | Checklist | Total | Completed | Incomplete | Status |
     |-----------|-------|-----------|------------|--------|
     | ux.md     | 12    | 12        | 0          | ✓ PASS |
     | test.md   | 8     | 5         | 3          | ✗ FAIL |
     | security.md | 6   | 6         | 0          | ✓ PASS |
     ```

   - Calculate overall status:
     - **PASS**: All checklists have 0 incomplete items
     - **FAIL**: One or more checklists have incomplete items

   - **If any checklist is incomplete**:
     - Display the table with incomplete item counts
     - **STOP** and ask: "Some checklists are incomplete. Do you want to proceed with implementation anyway? (yes/no)"
     - Wait for user response before continuing
     - If user says "no" or "wait" or "stop", halt execution
     - If user says "yes" or "proceed" or "continue", proceed to step 3

   - **If all checklists are complete**:
     - Display the table showing all checklists passed
     - Automatically proceed to step 3

3. Load and analyze the implementation context:
   - **REQUIRED**: Read tasks.md for the complete task list and execution plan
   - **REQUIRED**: Read plan.md for tech stack, architecture, and file structure
   - **IF EXISTS**: Read data-model.md for entities and relationships
   - **IF EXISTS**: Read contracts/ for API specifications and test requirements
   - **IF EXISTS**: Read research.md for technical decisions and constraints
   - **IF EXISTS**: Read quickstart.md for integration scenarios

4. **Project Setup Verification**:
   - **REQUIRED**: Create/verify ignore files based on actual project setup:

   **Detection & Creation Logic**:
   - Check if the following command succeeds to determine if the repository is a git repo (create/verify .gitignore if so):

     ```sh
     git rev-parse --git-dir 2>/dev/null
     ```

   - Check if Dockerfile\* exists or Docker in plan.md → create/verify .dockerignore
   - Check if .eslintrc\* exists → create/verify .eslintignore
   - Check if eslint.config.\* exists → ensure the config's `ignores` entries cover required patterns
   - Check if .prettierrc\* exists → create/verify .prettierignore
   - Check if .npmrc or package.json exists → create/verify .npmignore (if publishing)
   - Check if terraform files (\*.tf) exist → create/verify .terraformignore
   - Check if .helmignore needed (helm charts present) → create/verify .helmignore

   **If ignore file already exists**: Verify it contains essential patterns, append missing critical patterns only
   **If ignore file missing**: Create with full pattern set for detected technology

   **Common Patterns by Technology** (from plan.md tech stack):
   - **Node.js/JavaScript/TypeScript**: `node_modules/`, `dist/`, `build/`, `*.log`, `.env*`
   - **Python**: `__pycache__/`, `*.pyc`, `.venv/`, `venv/`, `dist/`, `*.egg-info/`
   - **Java**: `target/`, `*.class`, `*.jar`, `.gradle/`, `build/`
   - **C#/.NET**: `bin/`, `obj/`, `*.user`, `*.suo`, `packages/`
   - **Go**: `*.exe`, `*.test`, `vendor/`, `*.out`
   - **Ruby**: `.bundle/`, `log/`, `tmp/`, `*.gem`, `vendor/bundle/`
   - **PHP**: `vendor/`, `*.log`, `*.cache`, `*.env`
   - **Rust**: `target/`, `debug/`, `release/`, `*.rs.bk`, `*.rlib`, `*.prof*`, `.idea/`, `*.log`, `.env*`
   - **Kotlin**: `build/`, `out/`, `.gradle/`, `.idea/`, `*.class`, `*.jar`, `*.iml`, `*.log`, `.env*`
   - **C++**: `build/`, `bin/`, `obj/`, `out/`, `*.o`, `*.so`, `*.a`, `*.exe`, `*.dll`, `.idea/`, `*.log`, `.env*`
   - **C**: `build/`, `bin/`, `obj/`, `out/`, `*.o`, `*.a`, `*.so`, `*.exe`, `Makefile`, `config.log`, `.idea/`, `*.log`, `.env*`
   - **Swift**: `.build/`, `DerivedData/`, `*.swiftpm/`, `Packages/`
   - **R**: `.Rproj.user/`, `.Rhistory`, `.RData`, `.Ruserdata`, `*.Rproj`, `packrat/`, `renv/`
   - **Universal**: `.DS_Store`, `Thumbs.db`, `*.tmp`, `*.swp`, `.vscode/`, `.idea/`

   **Tool-Specific Patterns**:
   - **Docker**: `node_modules/`, `.git/`, `Dockerfile*`, `.dockerignore`, `*.log*`, `.env*`, `coverage/`
   - **ESLint**: `node_modules/`, `dist/`, `build/`, `coverage/`, `*.min.js`
   - **Prettier**: `node_modules/`, `dist/`, `build/`, `coverage/`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`
   - **Terraform**: `.terraform/`, `*.tfstate*`, `*.tfvars`, `.terraform.lock.hcl`
   - **Kubernetes/k8s**: `*.secret.yaml`, `secrets/`, `.kube/`, `kubeconfig*`, `*.key`, `*.crt`

5. Parse tasks.md structure and extract:
   - **Task phases**: Setup, Tests, Core, Integration, Polish
   - **Task dependencies**: Sequential vs parallel execution rules
   - **Task details**: ID, description, file paths, parallel markers [P]
   - **Execution flow**: Order and dependency requirements

6. Execute implementation following the task plan:
   - **Phase-by-phase execution**: Complete each phase before moving to the next
   - **Respect dependencies**: Run sequential tasks in order, parallel tasks [P] can run together
   - **Follow TDD approach**: Execute test tasks before their corresponding implementation tasks
   - **File-based coordination**: Tasks affecting the same files must run sequentially
   - **Validation checkpoints**: Verify each phase completion before proceeding

7. Implementation execution rules:
   - **Setup first**: Initialize project structure, dependencies, configuration
   - **Tests before code**: If you need to write tests for contracts, entities, and integration scenarios
   - **Core development**: Implement models, services, CLI commands, endpoints
   - **Integration work**: Database connections, middleware, logging, external services
   - **Polish and validation**: Unit tests, performance optimization, documentation

8. Progress tracking and error handling:
   - Report progress after each completed task
   - Halt execution if any non-parallel task fails
   - For parallel tasks [P], continue with successful tasks, report failed ones
   - Provide clear error messages with context for debugging
   - Suggest next steps if implementation cannot proceed
   - **IMPORTANT** For completed tasks, make sure to mark the task off as [X] in the tasks file.

9. Completion validation:
   - Verify all required tasks are completed
   - Check that implemented features match the original specification
   - Validate that tests pass and coverage meets requirements
   - Confirm the implementation follows the technical plan
   - Report final status with summary of completed work

Note: This command assumes a complete task breakdown exists in tasks.md. If tasks are incomplete or missing, suggest running `/speckit.tasks` first to regenerate the task list.
