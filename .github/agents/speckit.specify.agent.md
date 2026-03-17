---
description: Criar ou atualizar a especificação da feature a partir de uma descrição em linguagem natural.
handoffs:
  - label: Construir Plano Técnico
    agent: speckit.plan
    prompt: Criar um plano para a spec. Estou construindo com...
  - label: Esclarecer Requisitos da Spec
    agent: speckit.clarify
    prompt: Clarificar requisitos da especificação
    send: true
---

## Entrada do Usuário

```text
$ARGUMENTS
```

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Esboço

O texto digitado após `/speckit.specify` é a descrição da feature. Assuma que ele está disponível nesta conversa mesmo que `$ARGUMENTS` apareça literalmente abaixo. Não peça para o usuário repetir, a menos que ele tenha enviado um comando vazio.

Dada a descrição da feature, faça o seguinte:

1. **Gerar um nome curto conciso** (2–4 palavras) para a branch:
   - Analise a descrição da feature e extraia as palavras‑chave mais significativas
   - Crie um nome curto de 2–4 palavras que capture a essência da feature
   - Use formato ação‑substantivo quando possível (ex.: "add-user-auth", "fix-payment-bug")
   - Preserve termos técnicos e siglas (OAuth2, API, JWT etc.)
   - Mantenha conciso, mas descritivo o suficiente
   - Exemplos:
     - "I want to add user authentication" → "user-auth"
     - "Implement OAuth2 integration for the API" → "oauth2-api-integration"
     - "Create a dashboard for analytics" → "analytics-dashboard"
     - "Fix payment processing timeout bug" → "fix-payment-timeout"

2. **Verificar branches existentes antes de criar uma nova**:

   a. Primeiro, busque todas as branches remotas:

   ```bash
   git fetch --all --prune
   ```

   b. Encontre o maior número de feature entre todas as fontes para o short‑name:
   - Remotas: `git ls-remote --heads origin | grep -E 'refs/heads/[0-9]+-<short-name>$'`
   - Locais: `git branch | grep -E '^[* ]*[0-9]+-<short-name>$'`
   - Diretórios de specs: `specs/[0-9]+-<short-name>`

   c. Determine o próximo número disponível:
   - Extraia todos os números das três fontes
   - Encontre o maior número N
   - Use N+1 para a nova branch

   d. Execute `.specify/scripts/bash/create-new-feature.sh --json "$ARGUMENTS"` com o número e short‑name calculados:
   - Passe `--number N+1` e `--short-name "seu-short-name"` junto com a descrição
   - Exemplo Bash: `.specify/scripts/bash/create-new-feature.sh --json "$ARGUMENTS" --json --number 5 --short-name "user-auth" "Add user authentication"`
   - Exemplo PowerShell: `.specify/scripts/bash/create-new-feature.sh --json "$ARGUMENTS" -Json -Number 5 -ShortName "user-auth" "Add user authentication"`

   **IMPORTANTE**:
   - Cheque as três fontes (remotas, locais, specs) para encontrar o maior número
   - Combine apenas branches/diretórios com padrão exato do short‑name
   - Se nada existir, comece em 1
   - Execute esse script apenas uma vez por feature
   - O JSON é fornecido no terminal — use-o para obter os caminhos reais
   - O JSON conterá BRANCH_NAME e SPEC_FILE
   - Para aspas simples em argumentos como "I'm Groot", use a sintaxe de escape: ex. 'I'\''m Groot' (ou aspas duplas, se possível: "I'm Groot")

3. Carregue `.specify/templates/spec-template.md` para entender as seções obrigatórias.

4. Siga este fluxo de execução:
   1. Parsear a descrição do usuário
      Se estiver vazia: ERRO "Nenhuma descrição de feature fornecida"
   2. Extrair conceitos‑chave da descrição
      Identificar: atores, ações, dados, restrições
   3. Para aspectos pouco claros:
      - Faça suposições informadas com base no contexto e padrões do setor
      - Use [NEEDS CLARIFICATION: pergunta específica] apenas se:
        - A escolha impacta significativamente escopo ou UX
        - Existem múltiplas interpretações razoáveis com implicações diferentes
        - Não há default razoável
      - **LIMITE: máximo de 3 marcadores [NEEDS CLARIFICATION]**
      - Priorize clarificações por impacto: escopo > segurança/privacidade > UX > detalhes técnicos
   4. Preencher a seção Cenários de Usuário e Testes
      Se não houver fluxo claro: ERRO "Não foi possível determinar cenários de usuário"
   5. Gerar Requisitos Funcionais
      Cada requisito deve ser testável
      Use defaults razoáveis para detalhes não especificados (documente premissas)
   6. Definir Critérios de Sucesso
      Criar resultados mensuráveis e agnósticos de tecnologia
      Incluir métricas quantitativas (tempo, volume, taxa) e qualitativas (satisfação)
      Cada critério deve ser verificável sem detalhes de implementação
   7. Identificar Entidades‑chave (se houver dados)
   8. Retornar: SUCESSO (spec pronta para planejamento)

5. Escreva a especificação em SPEC_FILE usando a estrutura do template, substituindo placeholders por detalhes concretos da descrição e preservando ordem e headings.

6. **Validação de Qualidade da Spec**: após escrever a spec inicial, valide-a com critérios de qualidade:

   a. **Criar Checklist de Qualidade da Spec**: gere um arquivo em `FEATURE_DIR/checklists/requirements.md` usando o template, com estes itens:

   ```markdown
   # Checklist de Qualidade da Especificação: [NOME DA FEATURE]

   **Propósito**: Validar completude e qualidade antes do planejamento
   **Criado**: [DATA]
   **Feature**: [Link para spec.md]

   ## Qualidade de Conteúdo

   - [ ] Sem detalhes de implementação (linguagens, frameworks, APIs)
   - [ ] Focado em valor ao usuário e necessidades do negócio
   - [ ] Escrito para stakeholders não técnicos
   - [ ] Todas as seções obrigatórias preenchidas

   ## Completude de Requisitos

   - [ ] Nenhum marcador [NEEDS CLARIFICATION] restante
   - [ ] Requisitos testáveis e sem ambiguidade
   - [ ] Critérios de sucesso mensuráveis
   - [ ] Critérios de sucesso agnósticos de tecnologia (sem implementação)
   - [ ] Todos os cenários de aceite definidos
   - [ ] Casos de borda identificados
   - [ ] Escopo claramente delimitado
   - [ ] Dependências e premissas identificadas

   ## Prontidão da Feature

   - [ ] Todos os requisitos funcionais têm critérios de aceite claros
   - [ ] Cenários de usuário cobrem fluxos primários
   - [ ] A feature atende os resultados mensuráveis definidos em Critérios de Sucesso
   - [ ] Nenhum detalhe de implementação vazou na especificação

   ## Notas

   - Itens marcados incompletos exigem atualização da spec antes de `/speckit.clarify` ou `/speckit.plan`
   ```

   b. **Executar validação**: revise a spec contra cada item do checklist:
   - Para cada item, determine se passa ou falha
   - Documente issues específicas (cite trechos relevantes)

   c. **Tratar resultados da validação**:
   - **Se todos passarem**: marque checklist como completo e prossiga

   - **Se itens falharem (excluindo [NEEDS CLARIFICATION])**:
     1. Liste itens falhos e issues específicas
     2. Atualize a spec para corrigir cada issue
     3. Reexecute a validação até todos passarem (máx. 3 iterações)
     4. Se ainda falhar após 3 iterações, documente issues restantes nas notas e avise o usuário

   - **Se houver [NEEDS CLARIFICATION]**:
     1. Extraia todos os marcadores [NEEDS CLARIFICATION: ...] da spec
     2. **CHECK de LIMITE**: se houver mais de 3, mantenha apenas os 3 mais críticos (por impacto de escopo/segurança/UX) e assuma defaults para o restante
     3. Para cada clarificação (máx. 3), apresente opções ao usuário neste formato:

        ```markdown
        ## Pergunta [N]: [Tópico]

        **Contexto**: [Cite a seção relevante da spec]

        **O que precisamos saber**: [Pergunta específica do marcador]

        **Respostas sugeridas**:

        | Opção  | Resposta                     | Implicações                           |
        | ------ | ---------------------------- | ------------------------------------- |
        | A      | [Primeira resposta sugerida] | [O que isso significa para a feature] |
        | B      | [Segunda resposta sugerida]  | [O que isso significa para a feature] |
        | C      | [Terceira resposta sugerida] | [O que isso significa para a feature] |
        | Custom | Forneça sua própria resposta | [Como fornecer input custom]          |

        **Sua escolha**: _[Aguardar resposta do usuário]_
        ```

     4. **CRÍTICO — Formatação da tabela**: garanta Markdown válido
     5. Numere perguntas sequencialmente (Q1, Q2, Q3 — máx. 3)
     6. Apresente todas as perguntas juntas antes de aguardar respostas
     7. Aguarde o usuário responder com escolhas para todas as perguntas
     8. Atualize a spec substituindo cada marcador pela resposta selecionada
     9. Reexecute a validação após resolver todas as clarificações

   d. **Atualizar Checklist**: após cada iteração, atualize o checklist com status de aprovado/reprovado

7. Reporte a conclusão com nome da branch, caminho da spec, resultados do checklist e prontidão para a próxima fase (`/speckit.clarify` ou `/speckit.plan`).

**NOTA**: O script cria e faz checkout da nova branch e inicializa o arquivo de spec antes de escrever.

## Diretrizes Gerais

## Diretrizes Rápidas

- Foque no **O QUÊ** os usuários precisam e **POR QUÊ**.
- Evite COMO implementar (sem stack, APIs, estrutura de código).
- Escrito para stakeholders de negócio, não desenvolvedores.
- NÃO crie checklists embutidos na spec. Isso é um comando separado.

### Requisitos de Seção

- **Seções obrigatórias**: devem ser completadas em toda feature
- **Seções opcionais**: inclua apenas quando relevantes
- Quando uma seção não se aplica, remova-a (não deixe "N/A")

### Para Geração por IA

Ao criar esta spec a partir do prompt do usuário:

1. **Faça suposições informadas**: use contexto, padrões do setor e práticas comuns
2. **Documente premissas**: registre defaults razoáveis na seção de Premissas
3. **Limite clarificações**: máximo de 3 marcadores [NEEDS CLARIFICATION]
4. **Priorize clarificações**: escopo > segurança/privacidade > UX > detalhes técnicos
5. **Pense como tester**: todo requisito vago deve falhar o item "testável e sem ambiguidade"
6. **Áreas comuns que precisam de clarificação** (apenas se não houver default razoável):
   - Escopo e limites (incluir/excluir casos)
   - Tipos de usuário e permissões
   - Requisitos de segurança/compliance

**Exemplos de defaults razoáveis** (não pergunte sobre isso):

- Retenção de dados: práticas padrão do setor
- Alvos de performance: expectativas padrão web/mobile
- Tratamento de erros: mensagens amigáveis com fallback adequado
- Autenticação: sessão padrão ou OAuth2 para web
- Integrações: APIs RESTful

### Diretrizes de Critérios de Sucesso

Critérios de sucesso devem ser:

1. **Mensuráveis**: incluir métricas específicas (tempo, %, contagem, taxa)
2. **Agnósticos de tecnologia**: sem frameworks/linguagens/bancos/ ferramentas
3. **Focados no usuário**: descrevem resultado percebido
4. **Verificáveis**: podem ser validados sem detalhes de implementação

**Bons exemplos**:

- "Usuários conseguem concluir o checkout em menos de 3 minutos"
- "Sistema suporta 10.000 usuários simultâneos"
- "95% das buscas retornam em menos de 1 segundo"
- "Taxa de conclusão de tarefas melhora em 40%"

**Exemplos ruins** (focados em implementação):

- "Tempo de resposta da API abaixo de 200ms"
- "Banco aguenta 1000 TPS"
- "Componentes React renderizam eficientemente"
- "Cache Redis com hit rate acima de 80%"

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.---
description: Create or update the feature specification from a natural language feature description.
handoffs:

- label: Build Technical Plan
  agent: speckit.plan
  prompt: Create a plan for the spec. I am building with...
- label: Clarify Spec Requirements
  agent: speckit.clarify
  prompt: Clarify specification requirements
  send: true

---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

The text the user typed after `/speckit.specify` in the triggering message **is** the feature description. Assume you always have it available in this conversation even if `$ARGUMENTS` appears literally below. Do not ask the user to repeat it unless they provided an empty command.

Given that feature description, do this:

1. **Generate a concise short name** (2-4 words) for the branch:
   - Analyze the feature description and extract the most meaningful keywords
   - Create a 2-4 word short name that captures the essence of the feature
   - Use action-noun format when possible (e.g., "add-user-auth", "fix-payment-bug")
   - Preserve technical terms and acronyms (OAuth2, API, JWT, etc.)
   - Keep it concise but descriptive enough to understand the feature at a glance
   - Examples:
     - "I want to add user authentication" → "user-auth"
     - "Implement OAuth2 integration for the API" → "oauth2-api-integration"
     - "Create a dashboard for analytics" → "analytics-dashboard"
     - "Fix payment processing timeout bug" → "fix-payment-timeout"

2. **Check for existing branches before creating new one**:

   a. First, fetch all remote branches to ensure we have the latest information:

   ```bash
   git fetch --all --prune
   ```

   b. Find the highest feature number across all sources for the short-name:
   - Remote branches: `git ls-remote --heads origin | grep -E 'refs/heads/[0-9]+-<short-name>$'`
   - Local branches: `git branch | grep -E '^[* ]*[0-9]+-<short-name>$'`
   - Specs directories: Check for directories matching `specs/[0-9]+-<short-name>`

   c. Determine the next available number:
   - Extract all numbers from all three sources
   - Find the highest number N
   - Use N+1 for the new branch number

   d. Run the script `.specify/scripts/bash/create-new-feature.sh --json "$ARGUMENTS"` with the calculated number and short-name:
   - Pass `--number N+1` and `--short-name "your-short-name"` along with the feature description
   - Bash example: `.specify/scripts/bash/create-new-feature.sh --json "$ARGUMENTS" --json --number 5 --short-name "user-auth" "Add user authentication"`
   - PowerShell example: `.specify/scripts/bash/create-new-feature.sh --json "$ARGUMENTS" -Json -Number 5 -ShortName "user-auth" "Add user authentication"`

   **IMPORTANT**:
   - Check all three sources (remote branches, local branches, specs directories) to find the highest number
   - Only match branches/directories with the exact short-name pattern
   - If no existing branches/directories found with this short-name, start with number 1
   - You must only ever run this script once per feature
   - The JSON is provided in the terminal as output - always refer to it to get the actual content you're looking for
   - The JSON output will contain BRANCH_NAME and SPEC_FILE paths
   - For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot")

3. Load `.specify/templates/spec-template.md` to understand required sections.

4. Follow this execution flow:
   1. Parse user description from Input
      If empty: ERROR "No feature description provided"
   2. Extract key concepts from description
      Identify: actors, actions, data, constraints
   3. For unclear aspects:
      - Make informed guesses based on context and industry standards
      - Only mark with [NEEDS CLARIFICATION: specific question] if:
        - The choice significantly impacts feature scope or user experience
        - Multiple reasonable interpretations exist with different implications
        - No reasonable default exists
      - **LIMIT: Maximum 3 [NEEDS CLARIFICATION] markers total**
      - Prioritize clarifications by impact: scope > security/privacy > user experience > technical details
   4. Fill User Scenarios & Testing section
      If no clear user flow: ERROR "Cannot determine user scenarios"
   5. Generate Functional Requirements
      Each requirement must be testable
      Use reasonable defaults for unspecified details (document assumptions in Assumptions section)
   6. Define Success Criteria
      Create measurable, technology-agnostic outcomes
      Include both quantitative metrics (time, performance, volume) and qualitative measures (user satisfaction, task completion)
      Each criterion must be verifiable without implementation details
   7. Identify Key Entities (if data involved)
   8. Return: SUCCESS (spec ready for planning)

5. Write the specification to SPEC_FILE using the template structure, replacing placeholders with concrete details derived from the feature description (arguments) while preserving section order and headings.

6. **Specification Quality Validation**: After writing the initial spec, validate it against quality criteria:

   a. **Create Spec Quality Checklist**: Generate a checklist file at `FEATURE_DIR/checklists/requirements.md` using the checklist template structure with these validation items:

   ```markdown
   # Specification Quality Checklist: [FEATURE NAME]

   **Purpose**: Validate specification completeness and quality before proceeding to planning
   **Created**: [DATE]
   **Feature**: [Link to spec.md]

   ## Content Quality

   - [ ] No implementation details (languages, frameworks, APIs)
   - [ ] Focused on user value and business needs
   - [ ] Written for non-technical stakeholders
   - [ ] All mandatory sections completed

   ## Requirement Completeness

   - [ ] No [NEEDS CLARIFICATION] markers remain
   - [ ] Requirements are testable and unambiguous
   - [ ] Success criteria are measurable
   - [ ] Success criteria are technology-agnostic (no implementation details)
   - [ ] All acceptance scenarios are defined
   - [ ] Edge cases are identified
   - [ ] Scope is clearly bounded
   - [ ] Dependencies and assumptions identified

   ## Feature Readiness

   - [ ] All functional requirements have clear acceptance criteria
   - [ ] User scenarios cover primary flows
   - [ ] Feature meets measurable outcomes defined in Success Criteria
   - [ ] No implementation details leak into specification

   ## Notes

   - Items marked incomplete require spec updates before `/speckit.clarify` or `/speckit.plan`
   ```

   b. **Run Validation Check**: Review the spec against each checklist item:
   - For each item, determine if it passes or fails
   - Document specific issues found (quote relevant spec sections)

   c. **Handle Validation Results**:
   - **If all items pass**: Mark checklist complete and proceed to step 6

   - **If items fail (excluding [NEEDS CLARIFICATION])**:
     1. List the failing items and specific issues
     2. Update the spec to address each issue
     3. Re-run validation until all items pass (max 3 iterations)
     4. If still failing after 3 iterations, document remaining issues in checklist notes and warn user

   - **If [NEEDS CLARIFICATION] markers remain**:
     1. Extract all [NEEDS CLARIFICATION: ...] markers from the spec
     2. **LIMIT CHECK**: If more than 3 markers exist, keep only the 3 most critical (by scope/security/UX impact) and make informed guesses for the rest
     3. For each clarification needed (max 3), present options to user in this format:

        ```markdown
        ## Question [N]: [Topic]

        **Context**: [Quote relevant spec section]

        **What we need to know**: [Specific question from NEEDS CLARIFICATION marker]

        **Suggested Answers**:

        | Option | Answer                    | Implications                          |
        | ------ | ------------------------- | ------------------------------------- |
        | A      | [First suggested answer]  | [What this means for the feature]     |
        | B      | [Second suggested answer] | [What this means for the feature]     |
        | C      | [Third suggested answer]  | [What this means for the feature]     |
        | Custom | Provide your own answer   | [Explain how to provide custom input] |

        **Your choice**: _[Wait for user response]_
        ```

     4. **CRITICAL - Table Formatting**: Ensure markdown tables are properly formatted:
        - Use consistent spacing with pipes aligned
        - Each cell should have spaces around content: `| Content |` not `|Content|`
        - Header separator must have at least 3 dashes: `|--------|`
        - Test that the table renders correctly in markdown preview
     5. Number questions sequentially (Q1, Q2, Q3 - max 3 total)
     6. Present all questions together before waiting for responses
     7. Wait for user to respond with their choices for all questions (e.g., "Q1: A, Q2: Custom - [details], Q3: B")
     8. Update the spec by replacing each [NEEDS CLARIFICATION] marker with the user's selected or provided answer
     9. Re-run validation after all clarifications are resolved

   d. **Update Checklist**: After each validation iteration, update the checklist file with current pass/fail status

7. Report completion with branch name, spec file path, checklist results, and readiness for the next phase (`/speckit.clarify` or `/speckit.plan`).

**NOTE:** The script creates and checks out the new branch and initializes the spec file before writing.

## General Guidelines

## Quick Guidelines

- Focus on **WHAT** users need and **WHY**.
- Avoid HOW to implement (no tech stack, APIs, code structure).
- Written for business stakeholders, not developers.
- DO NOT create any checklists that are embedded in the spec. That will be a separate command.

### Section Requirements

- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation

When creating this spec from a user prompt:

1. **Make informed guesses**: Use context, industry standards, and common patterns to fill gaps
2. **Document assumptions**: Record reasonable defaults in the Assumptions section
3. **Limit clarifications**: Maximum 3 [NEEDS CLARIFICATION] markers - use only for critical decisions that:
   - Significantly impact feature scope or user experience
   - Have multiple reasonable interpretations with different implications
   - Lack any reasonable default
4. **Prioritize clarifications**: scope > security/privacy > user experience > technical details
5. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
6. **Common areas needing clarification** (only if no reasonable default exists):
   - Feature scope and boundaries (include/exclude specific use cases)
   - User types and permissions (if multiple conflicting interpretations possible)
   - Security/compliance requirements (when legally/financially significant)

**Examples of reasonable defaults** (don't ask about these):

- Data retention: Industry-standard practices for the domain
- Performance targets: Standard web/mobile app expectations unless specified
- Error handling: User-friendly messages with appropriate fallbacks
- Authentication method: Standard session-based or OAuth2 for web apps
- Integration patterns: RESTful APIs unless specified otherwise

### Success Criteria Guidelines

Success criteria must be:

1. **Measurable**: Include specific metrics (time, percentage, count, rate)
2. **Technology-agnostic**: No mention of frameworks, languages, databases, or tools
3. **User-focused**: Describe outcomes from user/business perspective, not system internals
4. **Verifiable**: Can be tested/validated without knowing implementation details

**Good examples**:

- "Users can complete checkout in under 3 minutes"
- "System supports 10,000 concurrent users"
- "95% of searches return results in under 1 second"
- "Task completion rate improves by 40%"

**Bad examples** (implementation-focused):

- "API response time is under 200ms" (too technical, use "Users see results instantly")
- "Database can handle 1000 TPS" (implementation detail, use user-facing metric)
- "React components render efficiently" (framework-specific)
- "Redis cache hit rate above 80%" (technology-specific)
