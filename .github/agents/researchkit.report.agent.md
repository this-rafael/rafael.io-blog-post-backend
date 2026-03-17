````chatagent
---
description: Executar tarefas de busca e consolidar achados em findings.md com citações e grau de confiança.
handoffs:
  - label: Gerar Sumário
    agent: researchkit.summary
    prompt: Criar sumário com insights e recomendações
    send: true
---

## Entrada do Usuário

```text
$ARGUMENTS
````

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Meta

Executar as tarefas de busca definidas em tasks.md e consolidar achados em findings.md:

- Executar tarefas em ordem, respeitando dependências
- Registrar cada achado com ID único e citação
- Atribuir grau de confiança baseado em evidências
- Identificar contradições e gaps

## Etapas de Execução

### 1. Carregar Contexto

Execute o script de pré-requisitos:

```bash
.research/scripts/bash/check-prerequisites.sh --json --require-scope --require-plan --require-tasks
```

Parse o JSON e carregue:

- `scope.md`: Perguntas-guia e critérios de qualidade
- `plan.md`: Estratégia e critérios de saturação
- `tasks.md`: Lista de tarefas a executar

### 2. Inicializar findings.md

Se findings.md não existir, crie a partir do template:

```bash
cp .research/templates/findings-template.md RESEARCH_DIR/findings.md
```

Substitua placeholders iniciais (ID, título, data).

### 3. Executar Tarefas por Fase

Para cada fase em tasks.md:

#### 3.1 Verificar Pré-requisitos da Fase

- Confirmar que fases anteriores estão concluídas (se dependentes)
- Verificar se checkpoint anterior foi atingido

#### 3.2 Executar Tarefas da Fase

Para cada tarefa não concluída:

1. **Identificar a tarefa**: Ler descrição e fonte
2. **Executar a busca**:
   - Para `[DOC]`: Ler documento, extrair informação relevante
   - Para `[CODE]`: Analisar código, identificar padrões
   - Para `[ART]`: Ler artigo, extrair pontos-chave
   - Para `[WEB]`: Consultar página, filtrar informação
   - Para `[ISSUE]`: Ler discussão, extrair conclusões
3. **Registrar achado** (se encontrado): Ver seção 4
4. **Marcar tarefa como concluída**: Atualizar `- [ ]` para `- [x]` em tasks.md
5. **Atualizar progresso**: Incrementar contadores

#### 3.3 Executar Tarefas Paralelas

Para tarefas marcadas com `[P]` na mesma fase:

- Podem ser executadas em qualquer ordem
- Resultados devem ser consolidados antes da próxima fase

### 4. Registrar Achados

Para cada descoberta relevante, crie uma entrada em findings.md:

```markdown
#### F### - [Título descritivo]

**Confiança**: 🟢 Alto / 🟡 Médio / 🟠 Baixo / 🔴 Incerto

**Achado**:

> [Descrição objetiva do que foi descoberto]

**Fonte(s)**:

- [1] [Nome] - [URL/caminho] - Acessado em [data]

**Citação relevante**:

> "[Trecho literal que suporta o achado]"
> — Fonte [1], [localização]

**Notas**:

- [Observações, limitações, ressalvas]

**Tarefas relacionadas**: R###, R###
```

### 5. Atribuir Grau de Confiança

Use estes critérios:

| Grau        | Símbolo | Critério                                                              |
| ----------- | ------- | --------------------------------------------------------------------- |
| **Alto**    | 🟢      | Fonte primária + verificável + consenso entre fontes                  |
| **Médio**   | 🟡      | Fonte secundária OU parcialmente verificável OU fonte única confiável |
| **Baixo**   | 🟠      | Inferência lógica OU fonte não oficial OU informação incompleta       |
| **Incerto** | 🔴      | Informação conflitante OU fonte desconhecida OU requer validação      |

### 6. Identificar Contradições

Quando encontrar informações conflitantes:

1. **Documentar o conflito** na seção "Contradições e Conflitos":

```markdown
### Conflito [N]: [Título]

**Achados em conflito**: F### vs F###

**Natureza do conflito**:

> [O que exatamente é contraditório]

**Análise**:

> [Possíveis explicações - versões? contextos? erros?]

**Resolução**:

- [ ] Pendente
- [ ] Resolvido: [Qual prevalece e por quê]
```

2. **Priorizar resolução**: Usar fontes primárias para desempate

### 7. Identificar Gaps

Ao final de cada fase, verificar:

- Perguntas-guia sem achados suficientes
- Aspectos mencionados no escopo não cobertos
- Informações parciais que precisam complemento

Documentar em "Gaps Identificados":

```markdown
| ID   | Descrição     | Impacto          | Ação Sugerida |
| ---- | ------------- | ---------------- | ------------- |
| G### | [O que falta] | Alto/Médio/Baixo | [Sugestão]    |
```

### 8. Verificar Critérios de Saturação

Após cada fase, verificar se critérios de saturação do scope.md foram atingidos:

- Todas as perguntas têm resposta com confiança >= mínimo?
- N fontes consecutivas sem nova informação?
- Critérios específicos atendidos?

Se saturação atingida antes do fim das tarefas, pode encerrar antecipadamente.

### 9. Atualizar Estatísticas

Manter atualizado no findings.md:

```markdown
## Estatísticas

| Métrica            | Valor |
| ------------------ | ----- |
| Total de achados   | [N]   |
| Confiança Alta     | [N]   |
| Confiança Média    | [N]   |
| Confiança Baixa    | [N]   |
| Incertos           | [N]   |
| Conflitos          | [N]   |
| Gaps               | [N]   |
| Fontes consultadas | [N]   |
```

### 10. Checkpoint por Fase

Ao concluir cada fase:

1. Verificar se checkpoint foi atingido
2. Atualizar tasks.md com tarefas concluídas
3. Atualizar progresso percentual
4. Decidir se prosseguir ou parar (saturação)

### 11. Consolidação Final

Após todas as fases (ou saturação):

1. Revisar todos os achados
2. Verificar se há achados duplicados (consolidar)
3. Organizar achados por pergunta-guia
4. Garantir que índice está atualizado
5. Salvar findings.md finalizado

### 12. Relatório

Informe ao usuário:

- Tarefas executadas: [N] de [Total]
- Achados registrados: [N]
- Distribuição de confiança
- Gaps identificados: [N]
- Conflitos pendentes: [N]
- Próximo passo: `/researchkit.summary`

## Princípios Operacionais

- **Citação obrigatória**: Todo achado DEVE ter fonte citada
- **Objetividade**: Registrar fatos, não interpretações (interpretação vem no summary)
- **Rastreabilidade**: Cada achado vinculado a tarefas que o geraram
- **Honestidade epistêmica**: Grau de confiança deve refletir evidência real

## Formato de IDs

- Achados: `F001` a `F999`
- Gaps: `G001` a `G999`
- Conflitos: numeração sequencial por ordem de descoberta

## Restrições

- Não inventar informação não encontrada nas fontes
- Não atribuir confiança Alta sem fonte primária verificável
- Não ignorar contradições — sempre documentar

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.

```

```
