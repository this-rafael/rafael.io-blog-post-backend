---
description: Executar uma análise não destrutiva de consistência e qualidade entre spec.md, plan.md e tasks.md após a geração de tarefas.
---

## Entrada do Usuário

```text
$ARGUMENTS
```

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Meta

Identificar inconsistências, duplicações, ambiguidades e itens subespecificados entre os três artefatos principais (`spec.md`, `plan.md`, `tasks.md`) antes da implementação. Este comando DEVE ser executado somente após `/speckit.tasks` produzir um `tasks.md` completo.

## Restrições Operacionais

**ESTRITAMENTE SOMENTE LEITURA**: **Não** modifique nenhum arquivo. Gere um relatório de análise estruturado. Ofereça um plano opcional de remediação (o usuário deve aprovar explicitamente antes de qualquer edição manual de acompanhamento).

**Autoridade da Constituição**: A constituição do projeto (`.specify/memory/constitution.md`) é **inegociável** neste escopo de análise. Conflitos com a constituição são automaticamente CRÍTICOS e exigem ajuste na spec, no plano ou nas tarefas — não diluição, reinterpretação ou ignorar silenciosamente o princípio. Se um princípio precisar mudar, isso deve ocorrer em uma atualização explícita e separada da constituição, fora do `/speckit.analyze`.

## Etapas de Execução

### 1. Inicializar o Contexto de Análise

Execute `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` uma vez na raiz do repositório e analise o JSON para FEATURE_DIR e AVAILABLE_DOCS. Derive caminhos absolutos:

- SPEC = FEATURE_DIR/spec.md
- PLAN = FEATURE_DIR/plan.md
- TASKS = FEATURE_DIR/tasks.md

Aborte com uma mensagem de erro se algum arquivo obrigatório estiver ausente (instrua o usuário a executar o comando pré-requisito ausente).
Para aspas simples em argumentos como "I'm Groot", use a sintaxe de escape: ex. 'I'\''m Groot' (ou aspas duplas, se possível: "I'm Groot").

### 2. Carregar Artefatos (Divulgação Progressiva)

Carregue somente o contexto mínimo necessário de cada artefato:

**De spec.md:**

- Visão geral/Contexto
- Requisitos Funcionais
- Requisitos Não Funcionais
- Histórias de Usuário
- Casos de Borda (se houver)

**De plan.md:**

- Escolhas de arquitetura/stack
- Referências do Modelo de Dados
- Fases
- Restrições técnicas

**De tasks.md:**

- IDs de tarefas
- Descrições
- Agrupamento por fase
- Marcadores de paralelismo [P]
- Caminhos de arquivos referenciados

**Da constituição:**

- Carregue `.specify/memory/constitution.md` para validação de princípios

### 3. Construir Modelos Semânticos

Crie representações internas (não inclua artefatos brutos na saída):

- **Inventário de requisitos**: cada requisito funcional + não funcional com uma chave estável (derivar slug a partir da frase imperativa; ex.: "Usuário pode enviar arquivo" → `usuario-pode-enviar-arquivo`)
- **Inventário de histórias/ações do usuário**: ações discretas do usuário com critérios de aceite
- **Mapeamento de cobertura de tarefas**: mapear cada tarefa para um ou mais requisitos ou histórias (inferência por palavra‑chave / padrões de referência explícitos como IDs ou frases‑chave)
- **Conjunto de regras da constituição**: extrair nomes de princípios e enunciados normativos MUST/SHOULD

### 4. Passes de Detecção (Análise Eficiente em Tokens)

Foque em achados de alto sinal. Limite a 50 achados no total; agregue o restante em um resumo de excedentes.

#### A. Detecção de Duplicação

- Identifique requisitos quase duplicados
- Marque a redação de menor qualidade para consolidação

#### B. Detecção de Ambiguidade

- Sinalize adjetivos vagos (rápido, escalável, seguro, intuitivo, robusto) sem critérios mensuráveis
- Sinalize placeholders não resolvidos (TODO, TKTK, ???, `<placeholder>`, etc.)

#### C. Subespecificação

- Requisitos com verbos mas sem objeto ou resultado mensurável
- Histórias de usuário sem alinhamento de critérios de aceite
- Tarefas referenciando arquivos ou componentes não definidos na spec/plan

#### D. Alinhamento com a Constituição

- Qualquer requisito ou elemento do plano em conflito com um princípio MUST
- Seções mandatórias ou gates de qualidade ausentes da constituição

#### E. Lacunas de Cobertura

- Requisitos sem tarefas associadas
- Tarefas sem requisito/história mapeados
- Requisitos não funcionais não refletidos nas tarefas (ex.: performance, segurança)

#### F. Inconsistência

- Deriva terminológica (mesmo conceito com nomes diferentes entre arquivos)
- Entidades de dados referenciadas no plano, mas ausentes na spec (ou vice‑versa)
- Contradições de ordenação de tarefas (ex.: integração antes da base sem nota de dependência)
- Requisitos conflitantes (ex.: um requer Next.js e outro especifica Vue)

### 5. Atribuição de Severidade

Use esta heurística para priorizar achados:

- **CRÍTICO**: viola MUST da constituição, falta artefato central da spec, ou requisito sem cobertura que bloqueia funcionalidade básica
- **ALTO**: requisito duplicado ou conflitante, atributo de segurança/performance ambíguo, critério de aceite não testável
- **MÉDIO**: deriva terminológica, falta de cobertura de requisitos não funcionais, caso de borda subespecificado
- **BAIXO**: melhorias de estilo/redação, redundância menor sem impacto na ordem de execução

### 6. Produzir Relatório de Análise Compacto

Gere um relatório em Markdown (sem escrita de arquivo) com a seguinte estrutura:

## Relatório de Análise da Especificação

| ID  | Categoria  | Severidade | Local(is)        | Resumo                        | Recomendação                                 |
| --- | ---------- | ---------- | ---------------- | ----------------------------- | -------------------------------------------- |
| A1  | Duplicação | ALTO       | spec.md:L120-134 | Dois requisitos similares ... | Unificar redação; manter a versão mais clara |

(Adicione uma linha por achado; gere IDs estáveis prefixados pela inicial da categoria.)

**Tabela de Resumo de Cobertura:**

| Chave do Requisito | Tem Tarefa? | IDs de Tarefa | Notas |
| ------------------ | ----------- | ------------- | ----- |

**Problemas de Alinhamento com a Constituição:** (se houver)

**Tarefas Não Mapeadas:** (se houver)

**Métricas:**

- Total de Requisitos
- Total de Tarefas
- % de Cobertura (requisitos com >=1 tarefa)
- Contagem de Ambiguidades
- Contagem de Duplicações
- Contagem de Itens Críticos

### 7. Fornecer Próximas Ações

Ao final do relatório, gere um bloco conciso de Próximas Ações:

- Se houver itens CRÍTICOS: recomendar resolver antes de `/speckit.implement`
- Se apenas BAIXO/MÉDIO: o usuário pode prosseguir, mas fornecer sugestões de melhoria
- Fornecer sugestões explícitas de comandos: ex.: "Execute /speckit.specify com refinamento", "Execute /speckit.plan para ajustar a arquitetura", "Edite manualmente tasks.md para adicionar cobertura para 'performance-metrics'"

### 8. Oferecer Remediação

Pergunte ao usuário: "Você quer que eu sugira edições de remediação concretas para os principais N problemas?" (NÃO aplicar automaticamente.)

## Princípios Operacionais

### Eficiência de Contexto

- **Mínimo de tokens de alto sinal**: foque em achados acionáveis, não em documentação exaustiva
- **Divulgação progressiva**: carregue artefatos incrementalmente; não despeje todo o conteúdo na análise
- **Saída eficiente em tokens**: limite a tabela a 50 linhas; resuma excedentes
- **Resultados determinísticos**: reexecuções sem mudanças devem produzir IDs e contagens consistentes

### Diretrizes de Análise

- **NUNCA modificar arquivos** (análise somente leitura)
- **NUNCA alucinar seções ausentes** (se ausentes, reporte corretamente)
- **Priorizar violações da constituição** (sempre CRÍTICAS)
- **Use exemplos em vez de regras exaustivas** (cite instâncias específicas, não padrões genéricos)
- **Reportar zero issues com elegância** (emitir relatório de sucesso com estatísticas de cobertura)

## Contexto

$ARGUMENTS

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.
