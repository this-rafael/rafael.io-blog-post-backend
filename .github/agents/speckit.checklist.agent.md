---
description: Gerar um checklist personalizado para a feature atual com base nos requisitos do usuário.
---

## Propósito do Checklist: "Testes Unitários para o Português"

**CONCEITO CRÍTICO**: Checklists são **TESTES UNITÁRIOS PARA ESCRITA DE REQUISITOS** — validam a qualidade, clareza e completude dos requisitos em um domínio.

**NÃO é para verificação/testes**:

- ❌ NÃO "Verificar se o botão clica corretamente"
- ❌ NÃO "Testar se o tratamento de erro funciona"
- ❌ NÃO "Confirmar que a API retorna 200"
- ❌ NÃO checar se o código/implementação corresponde à spec

**PARA validação da qualidade dos requisitos**:

- ✅ "Os requisitos de hierarquia visual estão definidos para todos os tipos de cards?" (completude)
- ✅ "'Exibição proeminente' foi quantificada com tamanho/posicionamento específico?" (clareza)
- ✅ "Os requisitos de estado hover são consistentes em todos os elementos interativos?" (consistência)
- ✅ "Os requisitos de acessibilidade estão definidos para navegação por teclado?" (cobertura)
- ✅ "A spec define o que acontece quando a imagem do logo falha ao carregar?" (casos de borda)

**Metáfora**: Se a sua spec é código escrito em português, o checklist é sua suíte de testes unitários. Você está testando se os requisitos estão bem escritos, completos, não ambíguos e prontos para implementação — NÃO se a implementação funciona.

## Entrada do Usuário

```text
$ARGUMENTS
```

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Etapas de Execução

1. **Setup**: Execute `.specify/scripts/bash/check-prerequisites.sh --json` a partir da raiz do repo e analise o JSON para FEATURE_DIR e a lista AVAILABLE_DOCS.
   - Todos os caminhos de arquivos devem ser absolutos.
   - Para aspas simples em argumentos como "I'm Groot", use a sintaxe de escape: ex. 'I'\''m Groot' (ou aspas duplas, se possível: "I'm Groot").

2. **Esclarecer intenção (dinâmico)**: Derive até TRÊS perguntas iniciais de clarificação contextual (sem catálogo pré-pronto). Elas DEVEM:
   - Ser geradas a partir da redação do usuário + sinais extraídos de spec/plan/tasks
   - Perguntar apenas sobre informações que alterem materialmente o conteúdo do checklist
   - Ser puladas individualmente se já estiverem inequívocas em `$ARGUMENTS`
   - Preferir precisão em vez de abrangência

   Algoritmo de geração:
   1. Extrair sinais: palavras‑chave do domínio (ex.: auth, latência, UX, API), indicadores de risco ("crítico", "deve", "compliance"), pistas de stakeholders ("QA", "review", "security team") e entregáveis explícitos ("a11y", "rollback", "contracts").
   2. Agrupar sinais em áreas de foco candidatas (máx. 4) ranqueadas por relevância.
   3. Identificar provável público e timing (autor, revisor, QA, release) se não explícito.
   4. Detectar dimensões faltantes: amplitude de escopo, profundidade/rigor, ênfase em risco, limites de exclusão, critérios de aceite mensuráveis.
   5. Formular perguntas a partir destes arquétipos:
      - Refinamento de escopo (ex.: "Isso deve incluir touchpoints de integração com X e Y ou ficar limitado à correção do módulo local?")
      - Priorização de risco (ex.: "Quais dessas áreas de risco devem receber checks obrigatórios?")
      - Calibragem de profundidade (ex.: "É uma lista leve pré‑commit ou um gate formal de release?")
      - Enquadramento de público (ex.: "Será usado apenas pelo autor ou por pares durante revisão de PR?")
      - Exclusão de limites (ex.: "Devemos excluir explicitamente itens de tuning de performance nesta rodada?")
      - Lacuna de classe de cenário (ex.: "Não foram detectados fluxos de recuperação — rollback/falhas parciais estão no escopo?")

   Regras de formatação de perguntas:
   - Se apresentar opções, gere uma tabela compacta com colunas: Opção | Candidato | Por que importa
   - Limite a, no máximo, opções A–E; omita a tabela se uma resposta livre for mais clara
   - Nunca peça ao usuário para repetir o que já disse
   - Evite categorias especulativas (não inventar). Se houver dúvida, pergunte explicitamente: "Confirme se X está no escopo."

   Padrões quando não há interação possível:
   - Profundidade: Padrão
   - Público: Revisor (PR) se for relacionado a código; caso contrário, Autor
   - Foco: 2 clusters de maior relevância

   Saída das perguntas (rotule Q1/Q2/Q3). Após as respostas: se ≥2 classes de cenário (Alternativo / Exceção / Recuperação / Domínio Não Funcional) permanecerem pouco claras, você PODE fazer até DUAS perguntas adicionais (Q4/Q5) com justificativa de uma linha (ex.: "Risco de caminho de recuperação não resolvido"). Não exceda cinco perguntas no total. Não escale se o usuário recusar explicitamente.

3. **Entender a solicitação do usuário**: Combine `$ARGUMENTS` + respostas de clarificação:
   - Derivar o tema do checklist (ex.: segurança, revisão, deploy, ux)
   - Consolidar itens obrigatórios explícitos mencionados pelo usuário
   - Mapear seleções de foco para a estrutura de categorias
   - Inferir contexto ausente a partir de spec/plan/tasks (NÃO inventar)

4. **Carregar contexto da feature**: Ler a partir de FEATURE_DIR:
   - spec.md: Requisitos e escopo da feature
   - plan.md (se existir): Detalhes técnicos, dependências
   - tasks.md (se existir): Tarefas de implementação

   **Estratégia de carregamento de contexto**:
   - Carregar apenas partes necessárias relacionadas às áreas de foco ativas (evitar despejo do arquivo inteiro)
   - Preferir resumir seções longas em bullets concisos de cenário/requisito
   - Usar divulgação progressiva: buscar mais apenas se lacunas forem detectadas
   - Se os documentos forem grandes, gerar itens de resumo intermediário em vez de embutir texto bruto

5. **Gerar checklist** — Criar "Testes Unitários para Requisitos":
   - Criar o diretório `FEATURE_DIR/checklists/` se não existir
   - Gerar um nome de arquivo único:
     - Usar um nome curto e descritivo baseado no domínio (ex.: `ux.md`, `api.md`, `security.md`)
     - Formato: `[dominio].md`
     - Se o arquivo existir, acrescentar ao arquivo existente
   - Numerar itens sequencialmente a partir de CHK001
   - Cada execução de `/speckit.checklist` cria um NOVO arquivo (nunca sobrescreve checklists existentes)

   **PRINCÍPIO CENTRAL — Teste os Requisitos, não a Implementação**:
   Cada item do checklist DEVE avaliar OS PRÓPRIOS REQUISITOS quanto a:
   - **Completude**: Todos os requisitos necessários estão presentes?
   - **Clareza**: Os requisitos são específicos e sem ambiguidade?
   - **Consistência**: Os requisitos são coerentes entre si?
   - **Mensurabilidade**: Os requisitos podem ser verificados objetivamente?
   - **Cobertura**: Todos os cenários/casos de borda são tratados?

   **Estrutura de Categorias** — Agrupe itens por dimensões de qualidade de requisitos:
   - **Completude de Requisitos** (Todos os requisitos necessários estão documentados?)
   - **Clareza de Requisitos** (Requisitos são específicos e sem ambiguidade?)
   - **Consistência de Requisitos** (Requisitos alinhados sem conflitos?)
   - **Qualidade dos Critérios de Aceite** (Critérios de sucesso são mensuráveis?)
   - **Cobertura de Cenários** (Todos os fluxos/casos estão contemplados?)
   - **Cobertura de Casos de Borda** (Condições de fronteira definidas?)
   - **Requisitos Não Funcionais** (Performance, Segurança, Acessibilidade etc. estão especificados?)
   - **Dependências e Premissas** (Estão documentadas e validadas?)
   - **Ambiguidades e Conflitos** (O que precisa de esclarecimento?)

   **COMO ESCREVER ITENS DO CHECKLIST — "Testes Unitários para o Português"**:

   ❌ **ERRADO** (Testando implementação):
   - "Verifique se a landing page exibe 3 cards de episódios"
   - "Teste se os estados de hover funcionam no desktop"
   - "Confirme se o clique no logo navega para a home"

   ✅ **CORRETO** (Testando qualidade dos requisitos):
   - "O número exato e o layout de episódios em destaque estão especificados?" [Completude]
   - "'Exibição proeminente' foi quantificada com tamanho/posicionamento específico?" [Clareza]
   - "Os requisitos de estado hover são consistentes em todos os elementos interativos?" [Consistência]
   - "Os requisitos de navegação por teclado estão definidos para toda UI interativa?" [Cobertura]
   - "O comportamento de fallback está especificado quando a imagem do logo falha ao carregar?" [Casos de Borda]
   - "Os estados de carregamento estão definidos para dados assíncronos de episódios?" [Completude]
   - "A spec define hierarquia visual para elementos de UI concorrentes?" [Clareza]

   **ESTRUTURA DO ITEM**:
   Cada item deve seguir este padrão:
   - Formato de pergunta sobre a qualidade do requisito
   - Foco no que está ESCRITO (ou não está) na spec/plan
   - Incluir a dimensão de qualidade entre colchetes [Completude/Clareza/Consistência/etc.]
   - Referenciar seção da spec `[Spec §X.Y]` ao checar requisitos existentes
   - Usar o marcador `[Lacuna]` ao checar requisitos ausentes

   **EXEMPLOS POR DIMENSÃO DE QUALIDADE**:

   Completude:
   - "Requisitos de tratamento de erro estão definidos para todos os modos de falha da API? [Lacuna]"
   - "Requisitos de acessibilidade estão especificados para todos os elementos interativos? [Completude]"
   - "Requisitos de breakpoints móveis estão definidos para layouts responsivos? [Lacuna]"

   Clareza:
   - "'Carregamento rápido' foi quantificado com limiares de tempo específicos? [Clareza, Spec §NFR-2]"
   - "Os critérios de seleção de 'episódios relacionados' estão definidos explicitamente? [Clareza, Spec §FR-5]"
   - "'Proeminente' está definido com propriedades visuais mensuráveis? [Ambiguidade, Spec §FR-4]"

   Consistência:
   - "Os requisitos de navegação estão alinhados entre todas as páginas? [Consistência, Spec §FR-10]"
   - "Os requisitos de card são consistentes entre landing e página de detalhe? [Consistência]"

   Cobertura:
   - "Há requisitos definidos para cenários de estado zero (sem episódios)? [Cobertura, Caso de Borda]"
   - "Cenários de interação concorrente de usuário são abordados? [Cobertura, Lacuna]"
   - "Requisitos para falhas parciais de carregamento de dados estão especificados? [Cobertura, Fluxo de Exceção]"

   Mensurabilidade:
   - "Requisitos de hierarquia visual são mensuráveis/testáveis? [Critérios de Aceite, Spec §FR-1]"
   - "'Peso visual balanceado' pode ser verificado objetivamente? [Mensurabilidade, Spec §FR-2]"

   **Classificação e Cobertura de Cenários** (Foco em Qualidade de Requisitos):
   - Verificar se existem requisitos para: Primário, Alternativo, Exceção/Erro, Recuperação, Não Funcional
   - Para cada classe de cenário, perguntar: "Os requisitos de [tipo de cenário] estão completos, claros e consistentes?"
   - Se a classe de cenário estiver ausente: "Os requisitos de [tipo de cenário] foram excluídos intencionalmente ou estão faltando? [Lacuna]"
   - Incluir resiliência/rollback quando houver mutação de estado: "Existem requisitos de rollback para falhas de migração? [Lacuna]"

   **Requisitos de Rastreabilidade**:
   - MÍNIMO: ≥80% dos itens DEVEM incluir ao menos uma referência de rastreabilidade
   - Cada item deve referenciar: seção da spec `[Spec §X.Y]`, ou usar marcadores: `[Lacuna]`, `[Ambiguidade]`, `[Conflito]`, `[Premissa]`
   - Se não houver sistema de IDs: "Existe um esquema de IDs para requisito e critérios de aceite? [Rastreabilidade]"

   **Evidenciar e Resolver Problemas** (Qualidade de Requisitos):
   Faça perguntas sobre os próprios requisitos:
   - Ambiguidades: "O termo 'rápido' foi quantificado com métricas específicas? [Ambiguidade, Spec §NFR-1]"
   - Conflitos: "Os requisitos de navegação conflitam entre §FR-10 e §FR-10a? [Conflito]"
   - Premissas: "A premissa de 'API de podcast sempre disponível' foi validada? [Premissa]"
   - Dependências: "Os requisitos para a API externa de podcast estão documentados? [Dependência, Lacuna]"
   - Definições ausentes: "'Hierarquia visual' está definida com critérios mensuráveis? [Lacuna]"

   **Consolidação de Conteúdo**:
   - Limite flexível: se os itens candidatos brutos > 40, priorize por risco/impacto
   - Unir quase duplicados que verifiquem o mesmo aspecto do requisito
   - Se houver >5 casos de borda de baixo impacto, crie um item: "Os casos de borda X, Y, Z estão abordados nos requisitos? [Cobertura]"

   **🚫 ABSOLUTAMENTE PROIBIDO** — Isso vira teste de implementação, não de requisitos:
   - ❌ Qualquer item iniciando com "Verifique", "Teste", "Confirme", "Cheque" + comportamento de implementação
   - ❌ Referências a execução de código, ações do usuário, comportamento do sistema
   - ❌ "Exibe corretamente", "funciona bem", "funciona como esperado"
   - ❌ "Clique", "navegue", "renderize", "carregue", "execute"
   - ❌ Casos de teste, planos de teste, procedimentos de QA
   - ❌ Detalhes de implementação (frameworks, APIs, algoritmos)

   **✅ PADRÕES OBRIGATÓRIOS** — Isso testa a qualidade dos requisitos:
   - ✅ "Os requisitos de [tipo de requisito] estão definidos/especificados/documentados para [cenário]?"
   - ✅ "O termo vago [termo] foi quantificado/esclarecido com critérios específicos?"
   - ✅ "Os requisitos são consistentes entre [seção A] e [seção B]?"
   - ✅ "O requisito [requisito] pode ser medido/verificado objetivamente?"
   - ✅ "Os casos de borda/cenários [X] estão abordados nos requisitos?"
   - ✅ "A spec define [aspecto ausente]?"

6. **Referência de Estrutura**: Gere o checklist seguindo o template canônico em `.specify/templates/checklist-template.md` para título, seção meta, cabeçalhos de categoria e formatação de ID. Se o template não estiver disponível, use: título H1, linhas meta de propósito/criação, seções `##` com linhas `- [ ] CHK### <item de requisito>` e IDs incrementais iniciando em CHK001.

7. **Relatório**: Informe o caminho completo do checklist criado, a contagem de itens e lembre ao usuário que cada execução cria um novo arquivo. Resuma:
   - Áreas de foco selecionadas
   - Nível de profundidade
   - Ator/tempo
   - Itens obrigatórios explícitos do usuário incorporados

**Importante**: Cada invocação de `/speckit.checklist` cria um arquivo de checklist com nomes curtos e descritivos, a menos que o arquivo já exista. Isso permite:

- Múltiplos checklists de tipos diferentes (ex.: `ux.md`, `test.md`, `security.md`)
- Nomes simples e memoráveis que indicam o propósito do checklist
- Identificação e navegação fáceis na pasta `checklists/`

Para evitar bagunça, use tipos descritivos e remova checklists obsoletos quando finalizar.

## Tipos de Checklist e Itens de Exemplo

**Qualidade de Requisitos de UX:** `ux.md`

Itens de exemplo (testando os requisitos, NÃO a implementação):

- "Os requisitos de hierarquia visual estão definidos com critérios mensuráveis? [Clareza, Spec §FR-1]"
- "O número e o posicionamento de elementos de UI estão explicitamente especificados? [Completude, Spec §FR-1]"
- "Os requisitos de estados de interação (hover, foco, ativo) estão definidos de forma consistente? [Consistência]"
- "Os requisitos de acessibilidade estão especificados para todos os elementos interativos? [Cobertura, Lacuna]"
- "O comportamento de fallback está definido quando imagens falham ao carregar? [Caso de Borda, Lacuna]"
- "'Exibição proeminente' pode ser medida objetivamente? [Mensurabilidade, Spec §FR-4]"

**Qualidade de Requisitos de API:** `api.md`

Itens de exemplo:

- "Formatos de resposta de erro estão especificados para todos os cenários de falha? [Completude]"
- "Requisitos de rate limiting foram quantificados com limiares específicos? [Clareza]"
- "Requisitos de autenticação são consistentes em todos os endpoints? [Consistência]"
- "Requisitos de retry/timeout estão definidos para dependências externas? [Cobertura, Lacuna]"
- "A estratégia de versionamento está documentada nos requisitos? [Lacuna]"

**Qualidade de Requisitos de Performance:** `performance.md`

Itens de exemplo:

- "Requisitos de performance foram quantificados com métricas específicas? [Clareza]"
- "Metas de performance estão definidas para todas as jornadas críticas do usuário? [Cobertura]"
- "Requisitos de performance sob diferentes cargas estão especificados? [Completude]"
- "Requisitos de performance podem ser medidos objetivamente? [Mensurabilidade]"
- "Requisitos de degradação para cenários de alta carga estão definidos? [Caso de Borda, Lacuna]"

**Qualidade de Requisitos de Segurança:** `security.md`

Itens de exemplo:

- "Requisitos de autenticação estão especificados para todos os recursos protegidos? [Cobertura]"
- "Requisitos de proteção de dados estão definidos para informações sensíveis? [Completude]"
- "O modelo de ameaças está documentado e os requisitos estão alinhados a ele? [Rastreabilidade]"
- "Requisitos de segurança são consistentes com obrigações de conformidade? [Consistência]"
- "Requisitos de resposta a falhas/violação de segurança estão definidos? [Lacuna, Fluxo de Exceção]"

## Anti‑exemplos: O que NÃO Fazer

**❌ ERRADO — Testa implementação, não requisitos:**

```markdown
- [ ] CHK001 - Verifique se a landing page exibe 3 cards de episódios [Spec §FR-001]
- [ ] CHK002 - Teste se os estados de hover funcionam corretamente no desktop [Spec §FR-003]
- [ ] CHK003 - Confirme se o clique no logo navega para a home [Spec §FR-010]
- [ ] CHK004 - Cheque se a seção de episódios relacionados mostra 3–5 itens [Spec §FR-005]
```

**✅ CORRETO — Testa qualidade dos requisitos:**

```markdown
- [ ] CHK001 - O número e o layout de episódios em destaque estão explicitamente especificados? [Completude, Spec §FR-001]
- [ ] CHK002 - Requisitos de hover estão definidos de forma consistente para todos os elementos interativos? [Consistência, Spec §FR-003]
- [ ] CHK003 - Requisitos de navegação estão claros para todos os elementos clicáveis da marca? [Clareza, Spec §FR-010]
- [ ] CHK004 - Os critérios de seleção de episódios relacionados estão documentados? [Lacuna, Spec §FR-005]
- [ ] CHK005 - Existem requisitos de estado de carregamento para dados assíncronos de episódios? [Lacuna]
- [ ] CHK006 - "Hierarquia visual" pode ser medida objetivamente? [Mensurabilidade, Spec §FR-001]
```

## Diferenças‑chave:

- Errado: testa se o sistema funciona corretamente
- Correto: testa se os requisitos estão escritos corretamente
- Errado: verificação de comportamento
- Correto: validação da qualidade do requisito
- Errado: "Ele faz X?"
- Correto: "X está claramente especificado?"

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.---
description: Generate a custom checklist for the current feature based on user requirements.

---

## Checklist Purpose: "Unit Tests for English"

**CRITICAL CONCEPT**: Checklists are **UNIT TESTS FOR REQUIREMENTS WRITING** - they validate the quality, clarity, and completeness of requirements in a given domain.

**NOT for verification/testing**:

- ❌ NOT "Verify the button clicks correctly"
- ❌ NOT "Test error handling works"
- ❌ NOT "Confirm the API returns 200"
- ❌ NOT checking if code/implementation matches the spec

**FOR requirements quality validation**:

- ✅ "Are visual hierarchy requirements defined for all card types?" (completeness)
- ✅ "Is 'prominent display' quantified with specific sizing/positioning?" (clarity)
- ✅ "Are hover state requirements consistent across all interactive elements?" (consistency)
- ✅ "Are accessibility requirements defined for keyboard navigation?" (coverage)
- ✅ "Does the spec define what happens when logo image fails to load?" (edge cases)

**Metaphor**: If your spec is code written in English, the checklist is its unit test suite. You're testing whether the requirements are well-written, complete, unambiguous, and ready for implementation - NOT whether the implementation works.

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Execution Steps

1. **Setup**: Run `.specify/scripts/bash/check-prerequisites.sh --json` from repo root and parse JSON for FEATURE_DIR and AVAILABLE_DOCS list.
   - All file paths must be absolute.
   - For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Clarify intent (dynamic)**: Derive up to THREE initial contextual clarifying questions (no pre-baked catalog). They MUST:
   - Be generated from the user's phrasing + extracted signals from spec/plan/tasks
   - Only ask about information that materially changes checklist content
   - Be skipped individually if already unambiguous in `$ARGUMENTS`
   - Prefer precision over breadth

   Generation algorithm:
   1. Extract signals: feature domain keywords (e.g., auth, latency, UX, API), risk indicators ("critical", "must", "compliance"), stakeholder hints ("QA", "review", "security team"), and explicit deliverables ("a11y", "rollback", "contracts").
   2. Cluster signals into candidate focus areas (max 4) ranked by relevance.
   3. Identify probable audience & timing (author, reviewer, QA, release) if not explicit.
   4. Detect missing dimensions: scope breadth, depth/rigor, risk emphasis, exclusion boundaries, measurable acceptance criteria.
   5. Formulate questions chosen from these archetypes:
      - Scope refinement (e.g., "Should this include integration touchpoints with X and Y or stay limited to local module correctness?")
      - Risk prioritization (e.g., "Which of these potential risk areas should receive mandatory gating checks?")
      - Depth calibration (e.g., "Is this a lightweight pre-commit sanity list or a formal release gate?")
      - Audience framing (e.g., "Will this be used by the author only or peers during PR review?")
      - Boundary exclusion (e.g., "Should we explicitly exclude performance tuning items this round?")
      - Scenario class gap (e.g., "No recovery flows detected—are rollback / partial failure paths in scope?")

   Question formatting rules:
   - If presenting options, generate a compact table with columns: Option | Candidate | Why It Matters
   - Limit to A–E options maximum; omit table if a free-form answer is clearer
   - Never ask the user to restate what they already said
   - Avoid speculative categories (no hallucination). If uncertain, ask explicitly: "Confirm whether X belongs in scope."

   Defaults when interaction impossible:
   - Depth: Standard
   - Audience: Reviewer (PR) if code-related; Author otherwise
   - Focus: Top 2 relevance clusters

   Output the questions (label Q1/Q2/Q3). After answers: if ≥2 scenario classes (Alternate / Exception / Recovery / Non-Functional domain) remain unclear, you MAY ask up to TWO more targeted follow‑ups (Q4/Q5) with a one-line justification each (e.g., "Unresolved recovery path risk"). Do not exceed five total questions. Skip escalation if user explicitly declines more.

3. **Understand user request**: Combine `$ARGUMENTS` + clarifying answers:
   - Derive checklist theme (e.g., security, review, deploy, ux)
   - Consolidate explicit must-have items mentioned by user
   - Map focus selections to category scaffolding
   - Infer any missing context from spec/plan/tasks (do NOT hallucinate)

4. **Load feature context**: Read from FEATURE_DIR:
   - spec.md: Feature requirements and scope
   - plan.md (if exists): Technical details, dependencies
   - tasks.md (if exists): Implementation tasks

   **Context Loading Strategy**:
   - Load only necessary portions relevant to active focus areas (avoid full-file dumping)
   - Prefer summarizing long sections into concise scenario/requirement bullets
   - Use progressive disclosure: add follow-on retrieval only if gaps detected
   - If source docs are large, generate interim summary items instead of embedding raw text

5. **Generate checklist** - Create "Unit Tests for Requirements":
   - Create `FEATURE_DIR/checklists/` directory if it doesn't exist
   - Generate unique checklist filename:
     - Use short, descriptive name based on domain (e.g., `ux.md`, `api.md`, `security.md`)
     - Format: `[domain].md`
     - If file exists, append to existing file
   - Number items sequentially starting from CHK001
   - Each `/speckit.checklist` run creates a NEW file (never overwrites existing checklists)

   **CORE PRINCIPLE - Test the Requirements, Not the Implementation**:
   Every checklist item MUST evaluate the REQUIREMENTS THEMSELVES for:
   - **Completeness**: Are all necessary requirements present?
   - **Clarity**: Are requirements unambiguous and specific?
   - **Consistency**: Do requirements align with each other?
   - **Measurability**: Can requirements be objectively verified?
   - **Coverage**: Are all scenarios/edge cases addressed?

   **Category Structure** - Group items by requirement quality dimensions:
   - **Requirement Completeness** (Are all necessary requirements documented?)
   - **Requirement Clarity** (Are requirements specific and unambiguous?)
   - **Requirement Consistency** (Do requirements align without conflicts?)
   - **Acceptance Criteria Quality** (Are success criteria measurable?)
   - **Scenario Coverage** (Are all flows/cases addressed?)
   - **Edge Case Coverage** (Are boundary conditions defined?)
   - **Non-Functional Requirements** (Performance, Security, Accessibility, etc. - are they specified?)
   - **Dependencies & Assumptions** (Are they documented and validated?)
   - **Ambiguities & Conflicts** (What needs clarification?)

   **HOW TO WRITE CHECKLIST ITEMS - "Unit Tests for English"**:

   ❌ **WRONG** (Testing implementation):
   - "Verify landing page displays 3 episode cards"
   - "Test hover states work on desktop"
   - "Confirm logo click navigates home"

   ✅ **CORRECT** (Testing requirements quality):
   - "Are the exact number and layout of featured episodes specified?" [Completeness]
   - "Is 'prominent display' quantified with specific sizing/positioning?" [Clarity]
   - "Are hover state requirements consistent across all interactive elements?" [Consistency]
   - "Are keyboard navigation requirements defined for all interactive UI?" [Coverage]
   - "Is the fallback behavior specified when logo image fails to load?" [Edge Cases]
   - "Are loading states defined for asynchronous episode data?" [Completeness]
   - "Does the spec define visual hierarchy for competing UI elements?" [Clarity]

   **ITEM STRUCTURE**:
   Each item should follow this pattern:
   - Question format asking about requirement quality
   - Focus on what's WRITTEN (or not written) in the spec/plan
   - Include quality dimension in brackets [Completeness/Clarity/Consistency/etc.]
   - Reference spec section `[Spec §X.Y]` when checking existing requirements
   - Use `[Gap]` marker when checking for missing requirements

   **EXAMPLES BY QUALITY DIMENSION**:

   Completeness:
   - "Are error handling requirements defined for all API failure modes? [Gap]"
   - "Are accessibility requirements specified for all interactive elements? [Completeness]"
   - "Are mobile breakpoint requirements defined for responsive layouts? [Gap]"

   Clarity:
   - "Is 'fast loading' quantified with specific timing thresholds? [Clarity, Spec §NFR-2]"
   - "Are 'related episodes' selection criteria explicitly defined? [Clarity, Spec §FR-5]"
   - "Is 'prominent' defined with measurable visual properties? [Ambiguity, Spec §FR-4]"

   Consistency:
   - "Do navigation requirements align across all pages? [Consistency, Spec §FR-10]"
   - "Are card component requirements consistent between landing and detail pages? [Consistency]"

   Coverage:
   - "Are requirements defined for zero-state scenarios (no episodes)? [Coverage, Edge Case]"
   - "Are concurrent user interaction scenarios addressed? [Coverage, Gap]"
   - "Are requirements specified for partial data loading failures? [Coverage, Exception Flow]"

   Measurability:
   - "Are visual hierarchy requirements measurable/testable? [Acceptance Criteria, Spec §FR-1]"
   - "Can 'balanced visual weight' be objectively verified? [Measurability, Spec §FR-2]"

   **Scenario Classification & Coverage** (Requirements Quality Focus):
   - Check if requirements exist for: Primary, Alternate, Exception/Error, Recovery, Non-Functional scenarios
   - For each scenario class, ask: "Are [scenario type] requirements complete, clear, and consistent?"
   - If scenario class missing: "Are [scenario type] requirements intentionally excluded or missing? [Gap]"
   - Include resilience/rollback when state mutation occurs: "Are rollback requirements defined for migration failures? [Gap]"

   **Traceability Requirements**:
   - MINIMUM: ≥80% of items MUST include at least one traceability reference
   - Each item should reference: spec section `[Spec §X.Y]`, or use markers: `[Gap]`, `[Ambiguity]`, `[Conflict]`, `[Assumption]`
   - If no ID system exists: "Is a requirement & acceptance criteria ID scheme established? [Traceability]"

   **Surface & Resolve Issues** (Requirements Quality Problems):
   Ask questions about the requirements themselves:
   - Ambiguities: "Is the term 'fast' quantified with specific metrics? [Ambiguity, Spec §NFR-1]"
   - Conflicts: "Do navigation requirements conflict between §FR-10 and §FR-10a? [Conflict]"
   - Assumptions: "Is the assumption of 'always available podcast API' validated? [Assumption]"
   - Dependencies: "Are external podcast API requirements documented? [Dependency, Gap]"
   - Missing definitions: "Is 'visual hierarchy' defined with measurable criteria? [Gap]"

   **Content Consolidation**:
   - Soft cap: If raw candidate items > 40, prioritize by risk/impact
   - Merge near-duplicates checking the same requirement aspect
   - If >5 low-impact edge cases, create one item: "Are edge cases X, Y, Z addressed in requirements? [Coverage]"

   **🚫 ABSOLUTELY PROHIBITED** - These make it an implementation test, not a requirements test:
   - ❌ Any item starting with "Verify", "Test", "Confirm", "Check" + implementation behavior
   - ❌ References to code execution, user actions, system behavior
   - ❌ "Displays correctly", "works properly", "functions as expected"
   - ❌ "Click", "navigate", "render", "load", "execute"
   - ❌ Test cases, test plans, QA procedures
   - ❌ Implementation details (frameworks, APIs, algorithms)

   **✅ REQUIRED PATTERNS** - These test requirements quality:
   - ✅ "Are [requirement type] defined/specified/documented for [scenario]?"
   - ✅ "Is [vague term] quantified/clarified with specific criteria?"
   - ✅ "Are requirements consistent between [section A] and [section B]?"
   - ✅ "Can [requirement] be objectively measured/verified?"
   - ✅ "Are [edge cases/scenarios] addressed in requirements?"
   - ✅ "Does the spec define [missing aspect]?"

6. **Structure Reference**: Generate the checklist following the canonical template in `.specify/templates/checklist-template.md` for title, meta section, category headings, and ID formatting. If template is unavailable, use: H1 title, purpose/created meta lines, `##` category sections containing `- [ ] CHK### <requirement item>` lines with globally incrementing IDs starting at CHK001.

7. **Report**: Output full path to created checklist, item count, and remind user that each run creates a new file. Summarize:
   - Focus areas selected
   - Depth level
   - Actor/timing
   - Any explicit user-specified must-have items incorporated

**Important**: Each `/speckit.checklist` command invocation creates a checklist file using short, descriptive names unless file already exists. This allows:

- Multiple checklists of different types (e.g., `ux.md`, `test.md`, `security.md`)
- Simple, memorable filenames that indicate checklist purpose
- Easy identification and navigation in the `checklists/` folder

To avoid clutter, use descriptive types and clean up obsolete checklists when done.

## Example Checklist Types & Sample Items

**UX Requirements Quality:** `ux.md`

Sample items (testing the requirements, NOT the implementation):

- "Are visual hierarchy requirements defined with measurable criteria? [Clarity, Spec §FR-1]"
- "Is the number and positioning of UI elements explicitly specified? [Completeness, Spec §FR-1]"
- "Are interaction state requirements (hover, focus, active) consistently defined? [Consistency]"
- "Are accessibility requirements specified for all interactive elements? [Coverage, Gap]"
- "Is fallback behavior defined when images fail to load? [Edge Case, Gap]"
- "Can 'prominent display' be objectively measured? [Measurability, Spec §FR-4]"

**API Requirements Quality:** `api.md`

Sample items:

- "Are error response formats specified for all failure scenarios? [Completeness]"
- "Are rate limiting requirements quantified with specific thresholds? [Clarity]"
- "Are authentication requirements consistent across all endpoints? [Consistency]"
- "Are retry/timeout requirements defined for external dependencies? [Coverage, Gap]"
- "Is versioning strategy documented in requirements? [Gap]"

**Performance Requirements Quality:** `performance.md`

Sample items:

- "Are performance requirements quantified with specific metrics? [Clarity]"
- "Are performance targets defined for all critical user journeys? [Coverage]"
- "Are performance requirements under different load conditions specified? [Completeness]"
- "Can performance requirements be objectively measured? [Measurability]"
- "Are degradation requirements defined for high-load scenarios? [Edge Case, Gap]"

**Security Requirements Quality:** `security.md`

Sample items:

- "Are authentication requirements specified for all protected resources? [Coverage]"
- "Are data protection requirements defined for sensitive information? [Completeness]"
- "Is the threat model documented and requirements aligned to it? [Traceability]"
- "Are security requirements consistent with compliance obligations? [Consistency]"
- "Are security failure/breach response requirements defined? [Gap, Exception Flow]"

## Anti-Examples: What NOT To Do

**❌ WRONG - These test implementation, not requirements:**

```markdown
- [ ] CHK001 - Verify landing page displays 3 episode cards [Spec §FR-001]
- [ ] CHK002 - Test hover states work correctly on desktop [Spec §FR-003]
- [ ] CHK003 - Confirm logo click navigates to home page [Spec §FR-010]
- [ ] CHK004 - Check that related episodes section shows 3-5 items [Spec §FR-005]
```

**✅ CORRECT - These test requirements quality:**

```markdown
- [ ] CHK001 - Are the number and layout of featured episodes explicitly specified? [Completeness, Spec §FR-001]
- [ ] CHK002 - Are hover state requirements consistently defined for all interactive elements? [Consistency, Spec §FR-003]
- [ ] CHK003 - Are navigation requirements clear for all clickable brand elements? [Clarity, Spec §FR-010]
- [ ] CHK004 - Is the selection criteria for related episodes documented? [Gap, Spec §FR-005]
- [ ] CHK005 - Are loading state requirements defined for asynchronous episode data? [Gap]
- [ ] CHK006 - Can "visual hierarchy" requirements be objectively measured? [Measurability, Spec §FR-001]
```

**Key Differences:**

- Wrong: Tests if the system works correctly
- Correct: Tests if the requirements are written correctly
- Wrong: Verification of behavior
- Correct: Validation of requirement quality
- Wrong: "Does it do X?"
- Correct: "Is X clearly specified?"
