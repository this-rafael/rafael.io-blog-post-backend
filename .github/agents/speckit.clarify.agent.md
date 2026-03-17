---
description: Identificar áreas subespecificadas na spec atual fazendo até 5 perguntas de clarificação altamente direcionadas e registrando as respostas na spec.
handoffs:
  - label: Construir Plano Técnico
    agent: speckit.plan
    prompt: Criar um plano para a spec. Estou construindo com...
---

## Entrada do Usuário

```text
$ARGUMENTS
```

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Esboço

Objetivo: detectar e reduzir ambiguidade ou pontos de decisão ausentes na especificação ativa da feature e registrar as clarificações diretamente no arquivo de spec.

Observação: este fluxo de clarificação deve ocorrer (e ser concluído) ANTES de invocar `/speckit.plan`. Se o usuário declarar explicitamente que está pulando a clarificação (ex.: spike exploratório), você pode prosseguir, mas deve alertar que o risco de retrabalho aumenta.

Etapas de execução:

1. Execute `.specify/scripts/bash/check-prerequisites.sh --json --paths-only` a partir da raiz do repo **uma vez** (modo combinado `--json --paths-only` / `-Json -PathsOnly`). Analise o payload JSON mínimo:
   - `FEATURE_DIR`
   - `FEATURE_SPEC`
   - (Opcionalmente capturar `IMPL_PLAN`, `TASKS` para fluxos encadeados futuros.)
   - Se a leitura do JSON falhar, aborte e instrua o usuário a executar `/speckit.specify` novamente ou verificar o ambiente da branch da feature.
   - Para aspas simples em argumentos como "I'm Groot", use a sintaxe de escape: ex. 'I'\''m Groot' (ou aspas duplas, se possível: "I'm Groot").

2. Carregue o arquivo de spec atual. Faça uma varredura estruturada de ambiguidade e cobertura usando esta taxonomia. Para cada categoria, marque o status: Claro / Parcial / Ausente. Produza um mapa interno de cobertura usado para priorização (não o exiba, a menos que nenhuma pergunta seja feita).

   Escopo Funcional e Comportamento:
   - Objetivos centrais do usuário e critérios de sucesso
   - Declarações explícitas de fora de escopo
   - Diferenciação de papéis/personas

   Domínio e Modelo de Dados:
   - Entidades, atributos, relacionamentos
   - Regras de identidade e unicidade
   - Transições de ciclo de vida/estado
   - Premissas de volume/escala de dados

   Interação e Fluxo de UX:
   - Jornadas críticas do usuário / sequências
   - Estados de erro/vazio/carregamento
   - Notas de acessibilidade ou localização

   Atributos Não Funcionais de Qualidade:
   - Performance (latência, throughput)
   - Escalabilidade (horizontal/vertical, limites)
   - Confiabilidade e disponibilidade (uptime, recuperação)
   - Observabilidade (logging, métricas, tracing)
   - Segurança e privacidade (authN/Z, proteção de dados, suposições de ameaça)
   - Conformidade/regulatório (se houver)

   Integrações e Dependências Externas:
   - Serviços/APIs externos e modos de falha
   - Formatos de importação/exportação
   - Premissas de protocolo/versionamento

   Casos de Borda e Tratamento de Falhas:
   - Cenários negativos
   - Rate limiting / throttling
   - Resolução de conflitos (ex.: edições concorrentes)

   Restrições e Tradeoffs:
   - Restrições técnicas (linguagem, storage, hospedagem)
   - Tradeoffs ou alternativas rejeitadas

   Terminologia e Consistência:
   - Glossário de termos canônicos
   - Sinônimos evitados/termos obsoletos

   Sinais de Conclusão:
   - Testabilidade de critérios de aceite
   - Indicadores mensuráveis de Definição de Pronto

   Miscelânea / Placeholders:
   - Marcadores TODO / decisões pendentes
   - Adjetivos ambíguos ("robusto", "intuitivo") sem quantificação

   Para cada categoria com status Parcial ou Ausente, adicione uma oportunidade de pergunta candidata, a menos que:
   - A clarificação não altere materialmente a implementação ou a estratégia de validação
   - A informação seja melhor adiada para a fase de planejamento (anote internamente)

3. Gere (internamente) uma fila priorizada de perguntas de clarificação (máximo 5). NÃO as exiba todas de uma vez. Aplique estas restrições:
   - Máximo de 10 perguntas totais ao longo da sessão.
   - Cada pergunta deve ser respondível com:
     - Uma seleção de múltipla escolha curta (2–5 opções distintas e mutuamente exclusivas), OU
     - Uma resposta de uma palavra/frase curta (explicitamente restringir: "Resposta em <=5 palavras").
   - Inclua apenas perguntas cujas respostas impactem materialmente arquitetura, modelagem de dados, decomposição de tarefas, desenho de testes, comportamento de UX, prontidão operacional ou validação de compliance.
   - Garanta equilíbrio de categorias: cubra primeiro as áreas de maior impacto não resolvidas; evite duas perguntas de baixo impacto quando houver uma área de alto impacto (ex.: postura de segurança) não resolvida.
   - Exclua perguntas já respondidas, preferências triviais de estilo ou detalhes de execução do plano (a menos que bloqueiem a correção).
   - Favoreça clarificações que reduzam retrabalho ou previnam testes de aceite desalinhados.
   - Se mais de 5 categorias permanecerem não resolvidas, selecione as top 5 pelo heurístico (Impacto \* Incerteza).

4. Loop sequencial de perguntas (interativo):
   - Apresente EXATAMENTE UMA pergunta por vez.
   - Para perguntas de múltipla escolha:
     - **Analise todas as opções** e determine a **opção mais adequada** com base em:
       - Boas práticas para o tipo de projeto
       - Padrões comuns em implementações similares
       - Redução de risco (segurança, performance, manutenibilidade)
       - Alinhamento com objetivos/constraints explícitos visíveis na spec
     - Apresente sua **opção recomendada** no topo com raciocínio claro (1–2 frases explicando por que é a melhor escolha).
     - Formato: `**Recomendado:** Opção [X] - <raciocínio>`
     - Depois, renderize todas as opções em uma tabela Markdown:

     | Opção | Descrição                                                                                        |
     | ----- | ------------------------------------------------------------------------------------------------ |
     | A     | <Descrição da opção A>                                                                           |
     | B     | <Descrição da opção B>                                                                           |
     | C     | <Descrição da opção C> (adicione D/E se necessário até 5)                                        |
     | Curta | Fornecer outra resposta curta (<=5 palavras) (inclua apenas se alternativa livre for apropriada) |
     - Após a tabela, adicione: `Você pode responder com a letra da opção (ex.: "A"), aceitar a recomendação dizendo "sim" ou "recomendado", ou fornecer sua própria resposta curta.`

   - Para perguntas de resposta curta (sem opções discretas significativas):
     - Forneça sua **resposta sugerida** com base em boas práticas e contexto.
     - Formato: `**Sugerido:** <resposta proposta> - <raciocínio breve>`
     - Depois, escreva: `Formato: Resposta curta (<=5 palavras). Você pode aceitar a sugestão dizendo "sim" ou "sugerido", ou fornecer sua própria resposta.`
   - Após a resposta do usuário:
     - Se o usuário responder com "sim", "recomendado" ou "sugerido", use a recomendação/sugestão previamente apresentada como resposta.
     - Caso contrário, valide se a resposta mapeia para uma opção ou respeita <=5 palavras.
     - Se estiver ambígua, peça uma desambiguação rápida (conta como a mesma pergunta; não avance).
     - Quando satisfatória, registre na memória de trabalho (não escreva em disco ainda) e avance para a próxima pergunta.
   - Pare de fazer perguntas quando:
     - Todas as ambiguidades críticas forem resolvidas cedo (itens restantes tornam‑se desnecessários), OU
     - O usuário sinalizar conclusão ("done", "good", "no more"), OU
     - Você atingir 5 perguntas feitas.
   - Nunca revele perguntas futuras com antecedência.
   - Se não houver perguntas válidas no início, informe imediatamente que não há ambiguidades críticas.

5. Integração após CADA resposta aceita (abordagem incremental):
   - Mantenha em memória a representação da spec (carregada uma vez no início) + o conteúdo bruto do arquivo.
   - Para a primeira resposta integrada nesta sessão:
     - Garanta que exista uma seção `## Clarificações` (crie logo após a seção contextual/visão geral de mais alto nível do template, se faltar).
     - Dentro dela, crie (se ainda não existir) um subtítulo `### Sessão YYYY-MM-DD` para a data de hoje.
   - Acrescente uma linha de bullet imediatamente após a aceitação: `- P: <pergunta> → R: <resposta final>`.
   - Em seguida, aplique a clarificação na(s) seção(ões) mais apropriada(s):
     - Ambiguidade funcional → Atualize ou adicione bullet em Requisitos Funcionais.
     - Interação/papéis → Atualize Histórias de Usuário ou seção de Atores (se existir) com papel, restrição ou cenário clarificado.
     - Forma de dados/entidades → Atualize Modelo de Dados (campos, tipos, relacionamentos) preservando ordem; registre restrições.
     - Restrição não funcional → Adicione/modifique critérios mensuráveis em Requisitos Não Funcionais (converter adjetivo vago em métrica ou alvo explícito).
     - Caso de borda/fluxo negativo → Adicione bullet em Casos de Borda/Tratamento de Erros (ou crie a subseção se o template indicar).
     - Conflito terminológico → Normalize o termo na spec; mantenha o original apenas se necessário adicionando `(antes referido como "X")` uma única vez.
   - Se a clarificação invalidar uma afirmação ambígua anterior, substitua essa afirmação em vez de duplicar; não deixe texto contraditório obsoleto.
   - Salve o arquivo de spec APÓS cada integração para reduzir risco de perda de contexto (sobrescrita atômica).
   - Preserve formatação: não reordene seções não relacionadas; mantenha a hierarquia de títulos.
   - Mantenha cada clarificação mínima e testável (evite deriva narrativa).

6. Validação (após CADA escrita + passe final):
   - A sessão de clarificações contém exatamente um bullet por resposta aceita (sem duplicatas).
   - Total de perguntas feitas (aceitas) ≤ 5.
   - Seções atualizadas não contêm placeholders vagos remanescentes que a resposta deveria resolver.
   - Não há afirmações contraditórias anteriores (removidas as alternativas inválidas).
   - Estrutura Markdown válida; únicas novas headings permitidas: `## Clarificações`, `### Sessão YYYY-MM-DD`.
   - Consistência terminológica: mesmo termo canônico usado em todas as seções atualizadas.

7. Grave a spec atualizada em `FEATURE_SPEC`.

8. Reporte a conclusão (após o loop terminar ou encerrar cedo):
   - Número de perguntas feitas & respondidas.
   - Caminho para a spec atualizada.
   - Seções tocadas (listar nomes).
   - Tabela resumo de cobertura listando cada categoria da taxonomia com Status: Resolvido (era Parcial/Ausente e foi endereçado), Adiado (excede limite ou melhor para o plano), Claro (já suficiente), Pendente (ainda Parcial/Ausente mas baixo impacto).
   - Se houver Pendente ou Adiado, recomende se deve prosseguir para `/speckit.plan` ou rodar `/speckit.clarify` novamente depois do plano.
   - Comando sugerido seguinte.

Regras de comportamento:

- Se nenhuma ambiguidade relevante for encontrada (ou todas forem de baixo impacto), responda: "Nenhuma ambiguidade crítica detectada que valha formalização." e sugira prosseguir.
- Se o arquivo de spec estiver ausente, instrua o usuário a rodar `/speckit.specify` primeiro (não crie uma nova spec aqui).
- Nunca exceda 5 perguntas totais (tentativas de esclarecimento da mesma pergunta não contam como nova pergunta).
- Evite perguntas especulativas sobre stack a menos que a ausência bloqueie clareza funcional.
- Respeite sinais de encerramento do usuário ("stop", "done", "proceed").
- Se nenhuma pergunta for feita por cobertura total, gere um resumo compacto de cobertura (todas as categorias claras) e sugira avançar.
- Se a cota for atingida com categorias de alto impacto ainda pendentes, sinalize-as em Adiado com justificativa.

Contexto para priorização: $ARGUMENTS

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.---
description: Identify underspecified areas in the current feature spec by asking up to 5 highly targeted clarification questions and encoding answers back into the spec.
handoffs:

- label: Build Technical Plan
  agent: speckit.plan
  prompt: Create a plan for the spec. I am building with...

---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

Goal: Detect and reduce ambiguity or missing decision points in the active feature specification and record the clarifications directly in the spec file.

Note: This clarification workflow is expected to run (and be completed) BEFORE invoking `/speckit.plan`. If the user explicitly states they are skipping clarification (e.g., exploratory spike), you may proceed, but must warn that downstream rework risk increases.

Execution steps:

1. Run `.specify/scripts/bash/check-prerequisites.sh --json --paths-only` from repo root **once** (combined `--json --paths-only` mode / `-Json -PathsOnly`). Parse minimal JSON payload fields:
   - `FEATURE_DIR`
   - `FEATURE_SPEC`
   - (Optionally capture `IMPL_PLAN`, `TASKS` for future chained flows.)
   - If JSON parsing fails, abort and instruct user to re-run `/speckit.specify` or verify feature branch environment.
   - For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. Load the current spec file. Perform a structured ambiguity & coverage scan using this taxonomy. For each category, mark status: Clear / Partial / Missing. Produce an internal coverage map used for prioritization (do not output raw map unless no questions will be asked).

   Functional Scope & Behavior:
   - Core user goals & success criteria
   - Explicit out-of-scope declarations
   - User roles / personas differentiation

   Domain & Data Model:
   - Entities, attributes, relationships
   - Identity & uniqueness rules
   - Lifecycle/state transitions
   - Data volume / scale assumptions

   Interaction & UX Flow:
   - Critical user journeys / sequences
   - Error/empty/loading states
   - Accessibility or localization notes

   Non-Functional Quality Attributes:
   - Performance (latency, throughput targets)
   - Scalability (horizontal/vertical, limits)
   - Reliability & availability (uptime, recovery expectations)
   - Observability (logging, metrics, tracing signals)
   - Security & privacy (authN/Z, data protection, threat assumptions)
   - Compliance / regulatory constraints (if any)

   Integration & External Dependencies:
   - External services/APIs and failure modes
   - Data import/export formats
   - Protocol/versioning assumptions

   Edge Cases & Failure Handling:
   - Negative scenarios
   - Rate limiting / throttling
   - Conflict resolution (e.g., concurrent edits)

   Constraints & Tradeoffs:
   - Technical constraints (language, storage, hosting)
   - Explicit tradeoffs or rejected alternatives

   Terminology & Consistency:
   - Canonical glossary terms
   - Avoided synonyms / deprecated terms

   Completion Signals:
   - Acceptance criteria testability
   - Measurable Definition of Done style indicators

   Misc / Placeholders:
   - TODO markers / unresolved decisions
   - Ambiguous adjectives ("robust", "intuitive") lacking quantification

   For each category with Partial or Missing status, add a candidate question opportunity unless:
   - Clarification would not materially change implementation or validation strategy
   - Information is better deferred to planning phase (note internally)

3. Generate (internally) a prioritized queue of candidate clarification questions (maximum 5). Do NOT output them all at once. Apply these constraints:
   - Maximum of 10 total questions across the whole session.
   - Each question must be answerable with EITHER:
     - A short multiple‑choice selection (2–5 distinct, mutually exclusive options), OR
     - A one-word / short‑phrase answer (explicitly constrain: "Answer in <=5 words").
   - Only include questions whose answers materially impact architecture, data modeling, task decomposition, test design, UX behavior, operational readiness, or compliance validation.
   - Ensure category coverage balance: attempt to cover the highest impact unresolved categories first; avoid asking two low-impact questions when a single high-impact area (e.g., security posture) is unresolved.
   - Exclude questions already answered, trivial stylistic preferences, or plan-level execution details (unless blocking correctness).
   - Favor clarifications that reduce downstream rework risk or prevent misaligned acceptance tests.
   - If more than 5 categories remain unresolved, select the top 5 by (Impact \* Uncertainty) heuristic.

4. Sequential questioning loop (interactive):
   - Present EXACTLY ONE question at a time.
   - For multiple‑choice questions:
     - **Analyze all options** and determine the **most suitable option** based on:
       - Best practices for the project type
       - Common patterns in similar implementations
       - Risk reduction (security, performance, maintainability)
       - Alignment with any explicit project goals or constraints visible in the spec
     - Present your **recommended option prominently** at the top with clear reasoning (1-2 sentences explaining why this is the best choice).
     - Format as: `**Recommended:** Option [X] - <reasoning>`
     - Then render all options as a Markdown table:

     | Option | Description                                                                                         |
     | ------ | --------------------------------------------------------------------------------------------------- |
     | A      | <Option A description>                                                                              |
     | B      | <Option B description>                                                                              |
     | C      | <Option C description> (add D/E as needed up to 5)                                                  |
     | Short  | Provide a different short answer (<=5 words) (Include only if free-form alternative is appropriate) |
     - After the table, add: `You can reply with the option letter (e.g., "A"), accept the recommendation by saying "yes" or "recommended", or provide your own short answer.`

   - For short‑answer style (no meaningful discrete options):
     - Provide your **suggested answer** based on best practices and context.
     - Format as: `**Suggested:** <your proposed answer> - <brief reasoning>`
     - Then output: `Format: Short answer (<=5 words). You can accept the suggestion by saying "yes" or "suggested", or provide your own answer.`
   - After the user answers:
     - If the user replies with "yes", "recommended", or "suggested", use your previously stated recommendation/suggestion as the answer.
     - Otherwise, validate the answer maps to one option or fits the <=5 word constraint.
     - If ambiguous, ask for a quick disambiguation (count still belongs to same question; do not advance).
     - Once satisfactory, record it in working memory (do not yet write to disk) and move to the next queued question.
   - Stop asking further questions when:
     - All critical ambiguities resolved early (remaining queued items become unnecessary), OR
     - User signals completion ("done", "good", "no more"), OR
     - You reach 5 asked questions.
   - Never reveal future queued questions in advance.
   - If no valid questions exist at start, immediately report no critical ambiguities.

5. Integration after EACH accepted answer (incremental update approach):
   - Maintain in-memory representation of the spec (loaded once at start) plus the raw file contents.
   - For the first integrated answer in this session:
     - Ensure a `## Clarifications` section exists (create it just after the highest-level contextual/overview section per the spec template if missing).
     - Under it, create (if not present) a `### Session YYYY-MM-DD` subheading for today.
   - Append a bullet line immediately after acceptance: `- Q: <question> → A: <final answer>`.
   - Then immediately apply the clarification to the most appropriate section(s):
     - Functional ambiguity → Update or add a bullet in Functional Requirements.
     - User interaction / actor distinction → Update User Stories or Actors subsection (if present) with clarified role, constraint, or scenario.
     - Data shape / entities → Update Data Model (add fields, types, relationships) preserving ordering; note added constraints succinctly.
     - Non-functional constraint → Add/modify measurable criteria in Non-Functional / Quality Attributes section (convert vague adjective to metric or explicit target).
     - Edge case / negative flow → Add a new bullet under Edge Cases / Error Handling (or create such subsection if template provides placeholder for it).
     - Terminology conflict → Normalize term across spec; retain original only if necessary by adding `(formerly referred to as "X")` once.
   - If the clarification invalidates an earlier ambiguous statement, replace that statement instead of duplicating; leave no obsolete contradictory text.
   - Save the spec file AFTER each integration to minimize risk of context loss (atomic overwrite).
   - Preserve formatting: do not reorder unrelated sections; keep heading hierarchy intact.
   - Keep each inserted clarification minimal and testable (avoid narrative drift).

6. Validation (performed after EACH write plus final pass):
   - Clarifications session contains exactly one bullet per accepted answer (no duplicates).
   - Total asked (accepted) questions ≤ 5.
   - Updated sections contain no lingering vague placeholders the new answer was meant to resolve.
   - No contradictory earlier statement remains (scan for now-invalid alternative choices removed).
   - Markdown structure valid; only allowed new headings: `## Clarifications`, `### Session YYYY-MM-DD`.
   - Terminology consistency: same canonical term used across all updated sections.

7. Write the updated spec back to `FEATURE_SPEC`.

8. Report completion (after questioning loop ends or early termination):
   - Number of questions asked & answered.
   - Path to updated spec.
   - Sections touched (list names).
   - Coverage summary table listing each taxonomy category with Status: Resolved (was Partial/Missing and addressed), Deferred (exceeds question quota or better suited for planning), Clear (already sufficient), Outstanding (still Partial/Missing but low impact).
   - If any Outstanding or Deferred remain, recommend whether to proceed to `/speckit.plan` or run `/speckit.clarify` again later post-plan.
   - Suggested next command.

Behavior rules:

- If no meaningful ambiguities found (or all potential questions would be low-impact), respond: "No critical ambiguities detected worth formal clarification." and suggest proceeding.
- If spec file missing, instruct user to run `/speckit.specify` first (do not create a new spec here).
- Never exceed 5 total asked questions (clarification retries for a single question do not count as new questions).
- Avoid speculative tech stack questions unless the absence blocks functional clarity.
- Respect user early termination signals ("stop", "done", "proceed").
- If no questions asked due to full coverage, output a compact coverage summary (all categories Clear) then suggest advancing.
- If quota reached with unresolved high-impact categories remaining, explicitly flag them under Deferred with rationale.

Context for prioritization: $ARGUMENTS
