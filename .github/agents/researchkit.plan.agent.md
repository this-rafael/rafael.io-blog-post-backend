````chatagent
---
description: Gerar estratégia detalhada de busca com fases, fontes, filtros e critérios de saturação.
handoffs:
  - label: Criar Tarefas de Busca
    agent: researchkit.tasks
    prompt: Quebrar o plano em tarefas atômicas de pesquisa
    send: true
---

## Entrada do Usuário

```text
$ARGUMENTS
````

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Meta

Criar um plano de busca detalhado e estruturado que:

- Organize a pesquisa em fases lógicas
- Defina fontes específicas por fase
- Estabeleça queries e termos de busca
- Determine critérios de conclusão por fase
- Estime esforço e identifique oportunidades de paralelismo

## Etapas de Execução

### 1. Carregar Contexto

Execute o script de pré-requisitos:

```bash
.research/scripts/bash/check-prerequisites.sh --json --require-scope
```

Parse o JSON e carregue:

- `scope.md`: Escopo completo da pesquisa
- Seção de consulta norteadora (se existir)

Se `STATUS` indica escopo ausente, instrua: `/researchkit.scope` primeiro.

### 2. Analisar Escopo e Consulta Norteadora

Extraia:

- Perguntas-guia e suas prioridades
- Fontes candidatas já validadas (se scout foi executado)
- Lacunas identificadas
- Estimativas preliminares de esforço
- Critérios de saturação definidos

### 3. Estruturar Fases de Busca

Organize a pesquisa em fases sequenciais:

#### Fase 1: Fundamentos

**Objetivo**: Estabelecer base conceitual e terminologia

- Fontes: Documentação oficial, README, glossários
- Entregável: Glossário local + conceitos base mapeados
- Critério de conclusão: Terminologia clara para próximas fases

#### Fase 2: Aprofundamento

**Objetivo**: Investigar cada pergunta-guia em profundidade

- Fontes: Código-fonte, artigos técnicos, discussões
- Entregável: Achados preliminares por pergunta
- Critério de conclusão: Resposta preliminar para cada pergunta

#### Fase 3: Validação

**Objetivo**: Confirmar achados e resolver contradições

- Fontes: Fontes alternativas para cruzamento
- Entregável: Achados validados com grau de confiança
- Critério de conclusão: Confiança >= critério definido no escopo

#### Fase 4: Consolidação (implícita)

**Objetivo**: Preparar achados para relatório

- Executada automaticamente após Fase 3

### 4. Mapear Fontes por Fase

Para cada fase, especifique:

| Fase | Fonte  | Tipo       | URL/Caminho | Prioridade | Tempo Est. |
| ---- | ------ | ---------- | ----------- | ---------- | ---------- |
| 1    | [Nome] | Primária   | [link]      | Alta       | [X min]    |
| 2    | [Nome] | Secundária | [link]      | Média      | [X min]    |

**Regras de mapeamento**:

- Fase 1: Apenas fontes primárias (documentação, código)
- Fase 2: Primárias + secundárias conforme necessidade
- Fase 3: Fontes alternativas para validação cruzada

### 5. Definir Queries e Termos de Busca

Para cada fase/fonte, especifique:

```markdown
### Fase [N]: [Nome]

**Queries para [Fonte]**:

- `[termo exato ou regex]`
- `[termo alternativo]`

**Filtros**:

- Data: >= [YYYY-MM-DD]
- Tipo: [doc/code/issue]
- Idioma: [pt/en]
```

**Estratégias de busca**:

- Grep/ripgrep para código: `rg "pattern" --type [ext]`
- Busca em docs: Ctrl+F com termos-chave
- GitHub: `repo:owner/repo [termo] in:file`
- Web: `site:dominio.com [termo]`

### 6. Estabelecer Critérios de Conclusão

Para cada fase, defina critérios objetivos:

**Fase 1 - Fundamentos**:

- [ ] Glossário com >= [N] termos definidos
- [ ] Mapa conceitual básico documentado
- [ ] Nenhum termo do escopo sem definição

**Fase 2 - Aprofundamento**:

- [ ] Cada pergunta-guia tem >= [N] achados preliminares
- [ ] Fontes primárias consultadas para cada pergunta
- [ ] Gaps explicitamente documentados

**Fase 3 - Validação**:

- [ ] Cada achado crítico validado por >= 2 fontes
- [ ] Contradições identificadas e analisadas
- [ ] Grau de confiança atribuído a cada achado

### 7. Definir Dependências e Paralelismo

Mapeie dependências entre fases:

```
Fase 1 (Fundamentos) ─────────────────────────────┐
    │                                              │
    ├──► Fase 2a (Pergunta 1) ──┐                  │
    │                           │                  │
    ├──► Fase 2b (Pergunta 2) ──┼──► Fase 3 ──► Consolidação
    │                           │
    └──► Fase 2c (Pergunta 3) ──┘
```

**Oportunidades de paralelismo**:

- Perguntas independentes na Fase 2 podem ser paralelas
- Validações de achados independentes podem ser paralelas

### 8. Estimar Esforço Total

| Fase           | Tarefas | Tempo    | Paralelizável |
| -------------- | ------- | -------- | ------------- |
| Fundamentos    | [N]     | [X]h     | Não           |
| Aprofundamento | [N]     | [X]h     | [Y]%          |
| Validação      | [N]     | [X]h     | [Y]%          |
| **Total**      | **[N]** | **[X]h** | -             |

### 9. Identificar Riscos e Mitigações

| Risco                   | Prob. | Impacto | Mitigação                         |
| ----------------------- | ----- | ------- | --------------------------------- |
| Documentação incompleta | [%]   | Alto    | Usar código como fonte de verdade |
| Informação conflitante  | [%]   | Médio   | Priorizar fontes primárias        |
| Escopo creep            | [%]   | Alto    | Revisitar critérios de exclusão   |

### 10. Gerar plan.md

Use o template `.research/templates/plan-template.md` e preencha:

- Resumo da consulta norteadora
- Fases com fontes e queries
- Dependências e paralelismo
- Estimativas e riscos

Salve em `RESEARCH_DIR/plan.md`.

### 11. Relatório

Informe ao usuário:

- Caminho do plan.md criado
- Número de fases e tarefas estimadas
- Tempo total estimado
- Próximo passo: `/researchkit.tasks`

## Princípios Operacionais

- **Fases incrementais**: Cada fase deve ter valor independente
- **Critérios objetivos**: Conclusão de fase deve ser verificável
- **Paralelismo consciente**: Identificar o que pode rodar em paralelo
- **Riscos antecipados**: Melhor planejar mitigação agora

## Restrições

- Máximo de 4 fases principais (+ consolidação implícita)
- Cada fase deve ter critério de conclusão verificável
- Tempo total não deve exceder 3x a estimativa da consulta norteadora

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.

```

```
