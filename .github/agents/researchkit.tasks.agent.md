````chatagent
---
description: Quebrar o plano de busca em tarefas atômicas de pesquisa com IDs, dependências e marcadores de paralelismo.
handoffs:
  - label: Executar Pesquisa
    agent: researchkit.report
    prompt: Executar tarefas de busca e consolidar achados
    send: true
---

## Entrada do Usuário

```text
$ARGUMENTS
````

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Meta

Gerar uma lista de tarefas de pesquisa atômicas que:

- Sejam específicas o suficiente para execução sem contexto adicional
- Tenham IDs únicos para rastreabilidade
- Indiquem dependências e oportunidades de paralelismo
- Cubram todas as fases do plano de busca

## Etapas de Execução

### 1. Carregar Contexto

Execute o script de pré-requisitos:

```bash
.research/scripts/bash/check-prerequisites.sh --json --require-scope --require-plan
```

Parse o JSON e carregue:

- `scope.md`: Perguntas-guia e critérios
- `plan.md`: Fases, fontes e queries definidas

Se `STATUS` indica documentos ausentes, instrua o comando apropriado.

### 2. Extrair Elementos do Plano

Do plan.md, extraia:

- Fases e seus objetivos
- Fontes por fase com URLs/caminhos
- Queries e termos de busca
- Critérios de conclusão por fase
- Dependências entre fases

### 3. Gerar Tarefas por Fase

Para cada fase, gere tarefas atômicas seguindo o formato:

```markdown
- [ ] R### [TIPO] [P?] Descrição específica com fonte/caminho
```

**Componentes do formato**:

1. **Checkbox**: `- [ ]` sempre
2. **ID**: `R###` sequencial (R001, R002, R003...)
3. **Tipo de fonte**: `[DOC]`, `[CODE]`, `[ART]`, `[WEB]`, `[API]`
4. **Marcador [P]**: Apenas se paralelizável
5. **Descrição**: Ação clara + fonte específica + localização exata

**Tipos de fonte**:

- `[DOC]` — Documentação oficial
- `[CODE]` — Código-fonte, testes
- `[ART]` — Artigos técnicos, blog posts
- `[WEB]` — Páginas web gerais
- `[API]` — Documentação de API
- `[ISSUE]` — Issues, PRs, discussões

### 4. Regras de Geração de Tarefas

**Tarefas DEVEM ser atômicas**:

- ✅ "Ler seção 'Authentication' em docs/api.md e extrair métodos suportados"
- ✅ "Buscar por 'circuit.\*breaker' em src/resilience/ e listar implementações"
- ❌ "Pesquisar sobre autenticação" (vago)
- ❌ "Entender o sistema" (não atômico)

**Tarefas DEVEM ter fonte específica**:

- ✅ "Analisar src/providers/ebury/client.ts linhas 50-150"
- ✅ "Consultar https://docs.example.com/api/auth"
- ❌ "Verificar documentação" (qual?)

**Tarefas de busca DEVEM ter query definida**:

- ✅ "Executar `rg 'retry.*policy' src/` e catalogar ocorrências"
- ✅ "Buscar 'rate limit' em issues do repositório X"

### 5. Estrutura de Fases

#### Fase 1: Fundamentos

```markdown
## Fase 1: Fundamentos

**Objetivo**: [Do plano]
**Critério de Conclusão**: [Do plano]

- [ ] R001 [DOC] Ler [documento] e extrair [informação]
- [ ] R002 [DOC] Identificar terminologia-chave em [fonte]
- [ ] R003 [P] [CODE] Mapear estrutura de [módulo/diretório]
- [ ] R004 [P] [CODE] Buscar por [padrão] em [local]

**Checkpoint**: [O que marca fim da fase]
```

#### Fase 2: Aprofundamento

Organize por pergunta-guia:

```markdown
## Fase 2: Aprofundamento

### Pergunta-Guia 1: [Texto]

- [ ] R005 [DOC] [descrição]
- [ ] R006 [P] [CODE] [descrição]
- [ ] R007 [P] [ART] [descrição]

### Pergunta-Guia 2: [Texto]

- [ ] R008 [CODE] [descrição]
- [ ] R009 [P] [ISSUE] [descrição]
```

#### Fase 3: Validação

```markdown
## Fase 3: Validação

- [ ] R0XX [P] Cruzar achado preliminar de R005 com [fonte alternativa]
- [ ] R0XX [P] Verificar consistência entre R006 e R008
- [ ] R0XX Documentar contradições encontradas
- [ ] R0XX Atribuir grau de confiança a cada achado
```

#### Fase 4: Consolidação

```markdown
## Fase 4: Consolidação

- [ ] R0XX Organizar achados por pergunta-guia
- [ ] R0XX Identificar gaps não resolvidos
- [ ] R0XX Preparar citações e referências
- [ ] R0XX Redigir findings.md seguindo template
```

### 6. Mapear Dependências

Documente dependências explícitas:

```markdown
## Dependências

R001 ──► R002 (glossário depende da leitura inicial)
R002 ──► R005-R009 (aprofundamento usa terminologia)
R005-R009 ──► R0XX-R0XX (validação cruza achados)
```

### 7. Identificar Batches Paralelos

Agrupe tarefas que podem executar simultaneamente:

```markdown
## Execução Paralela

### Batch 1 (Fase 1)

R003, R004 — podem executar após R001

### Batch 2 (Fase 2)

R006, R007 — perguntas independentes
R008, R009 — perguntas independentes

### Batch 3 (Fase 3)

R0XX, R0XX — validações independentes
```

### 8. Criar Tabela de Progresso

```markdown
## Progresso

| Fase           | Total   | Concluídas | %      |
| -------------- | ------- | ---------- | ------ |
| Fundamentos    | [N]     | 0          | 0%     |
| Aprofundamento | [N]     | 0          | 0%     |
| Validação      | [N]     | 0          | 0%     |
| Consolidação   | [N]     | 0          | 0%     |
| **Total**      | **[N]** | **0**      | **0%** |
```

### 9. Validar Completude

Antes de finalizar, verifique:

- [ ] Cada pergunta-guia tem tarefas associadas
- [ ] Cada fonte do plano tem pelo menos uma tarefa
- [ ] Todas as queries do plano estão em tarefas
- [ ] Critérios de conclusão são cobertos pelas tarefas
- [ ] Não há tarefas órfãs (sem conexão com perguntas)

### 10. Gerar tasks.md

Use o template `.research/templates/tasks-template.md` e preencha.
Salve em `RESEARCH_DIR/tasks.md`.

### 11. Relatório

Informe ao usuário:

- Caminho do tasks.md criado
- Total de tarefas geradas
- Distribuição por fase
- Oportunidades de paralelismo identificadas
- Próximo passo: `/researchkit.report`

## Princípios Operacionais

- **Atomicidade**: Cada tarefa deve ser completável em uma sessão
- **Rastreabilidade**: IDs permitem referência em achados
- **Paralelismo explícito**: Marcar [P] apenas quando realmente paralelo
- **Cobertura total**: Nenhuma pergunta sem tarefas

## Formato de ID

- `R001` a `R999` — IDs sequenciais
- Nunca reutilizar IDs mesmo se tarefa for removida
- Manter ordem de execução lógica na numeração

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.

```

```
