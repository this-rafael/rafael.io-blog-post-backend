---
description: Executar o fluxo de planejamento de implementação usando o template de plano para gerar artefatos de design.
handoffs:
  - label: Criar Tarefas
    agent: speckit.tasks
    prompt: Quebre o plano em tarefas
    send: true
  - label: Criar Checklist
    agent: speckit.checklist
    prompt: Crie um checklist para o seguinte domínio...
---

## Entrada do Usuário

```text
$ARGUMENTS
```

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Esboço

1. **Setup**: Execute `.specify/scripts/bash/setup-plan.sh --json` a partir da raiz do repo e analise o JSON para FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH. Para aspas simples em argumentos como "I'm Groot", use a sintaxe de escape: ex. 'I'\''m Groot' (ou aspas duplas, se possível: "I'm Groot").

2. **Carregar contexto**: Leia FEATURE_SPEC e `.specify/memory/constitution.md`. Carregue o template IMPL_PLAN (já copiado).

3. **Executar o fluxo de plano**: Siga a estrutura do template IMPL_PLAN para:
   - Preencher Contexto Técnico (marcar desconhecidos como "NEEDS CLARIFICATION")
   - Preencher a seção de Verificação da Constituição com base na constituição
   - Avaliar gates (ERRO se violações não forem justificadas)
   - Fase 0: Gerar research.md (resolver todos os NEEDS CLARIFICATION)
   - Fase 1: Gerar data-model.md, contracts/, quickstart.md
   - Fase 1: Atualizar contexto do agente executando o script do agente
   - Reavaliar Verificação da Constituição após o design

4. **Parar e reportar**: O comando termina após o planejamento da Fase 2. Reporte a branch, o caminho de IMPL_PLAN e os artefatos gerados.

## Fases

### Fase 0: Esboço e Pesquisa

1. **Extrair desconhecidos do Contexto Técnico** acima:
   - Para cada NEEDS CLARIFICATION → tarefa de pesquisa
   - Para cada dependência → tarefa de melhores práticas
   - Para cada integração → tarefa de padrões

2. **Gerar e despachar agentes de pesquisa**:

   ```text
   Para cada desconhecido no Contexto Técnico:
     Tarefa: "Pesquisar {desconhecido} para {contexto da feature}"
   Para cada escolha tecnológica:
     Tarefa: "Encontrar melhores práticas para {tech} em {domínio}"
   ```

3. **Consolidar achados** em `research.md` com o formato:
   - Decisão: [o que foi escolhido]
   - Racional: [por que foi escolhido]
   - Alternativas consideradas: [o que foi avaliado]

**Saída**: research.md com todos os NEEDS CLARIFICATION resolvidos

### Fase 1: Design e Contratos

**Pré‑requisito:** `research.md` concluído

1. **Extrair entidades da spec** → `data-model.md`:
   - Nome da entidade, campos, relacionamentos
   - Regras de validação a partir dos requisitos
   - Transições de estado, se aplicável

2. **Gerar contratos de API** a partir dos requisitos funcionais:
   - Para cada ação do usuário → endpoint
   - Usar padrões REST/GraphQL
   - Gerar schema OpenAPI/GraphQL em `/contracts/`

3. **Atualização de contexto do agente**:
   - Execute `.specify/scripts/bash/update-agent-context.sh copilot`
   - Esses scripts detectam qual agente de IA está em uso
   - Atualize o arquivo de contexto específico do agente
   - Adicione apenas novas tecnologias do plano atual
   - Preserve adições manuais entre os marcadores

**Saída**: data-model.md, /contracts/\*, quickstart.md, arquivo específico do agente

## Regras‑chave

- Usar caminhos absolutos
- ERRO se houver falhas de gate ou clarificações não resolvidas

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.---
description: Execute the implementation planning workflow using the plan template to generate design artifacts.
handoffs:

- label: Create Tasks
  agent: speckit.tasks
  prompt: Break the plan into tasks
  send: true
- label: Create Checklist
  agent: speckit.checklist
  prompt: Create a checklist for the following domain...

---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. **Setup**: Run `.specify/scripts/bash/setup-plan.sh --json` from repo root and parse JSON for FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load context**: Read FEATURE_SPEC and `.specify/memory/constitution.md`. Load IMPL_PLAN template (already copied).

3. **Execute plan workflow**: Follow the structure in IMPL_PLAN template to:
   - Fill Technical Context (mark unknowns as "NEEDS CLARIFICATION")
   - Fill Constitution Check section from constitution
   - Evaluate gates (ERROR if violations unjustified)
   - Phase 0: Generate research.md (resolve all NEEDS CLARIFICATION)
   - Phase 1: Generate data-model.md, contracts/, quickstart.md
   - Phase 1: Update agent context by running the agent script
   - Re-evaluate Constitution Check post-design

4. **Stop and report**: Command ends after Phase 2 planning. Report branch, IMPL_PLAN path, and generated artifacts.

## Phases

### Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```text
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

### Phase 1: Design & Contracts

**Prerequisites:** `research.md` complete

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Agent context update**:
   - Run `.specify/scripts/bash/update-agent-context.sh copilot`
   - These scripts detect which AI agent is in use
   - Update the appropriate agent-specific context file
   - Add only new technology from current plan
   - Preserve manual additions between markers

**Output**: data-model.md, /contracts/\*, quickstart.md, agent-specific file

## Key rules

- Use absolute paths
- ERROR on gate failures or unresolved clarifications
