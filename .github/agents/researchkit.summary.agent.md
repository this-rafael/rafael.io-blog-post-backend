````chatagent
---
description: Gerar sumário com insights principais, gaps restantes e recomendações baseadas nos achados.
handoffs:
  - label: Integrar na Base
    agent: researchkit.integrate
    prompt: Atualizar knowledgebase com os resultados desta pesquisa
    send: true
---

## Entrada do Usuário

```text
$ARGUMENTS
````

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Meta

Sintetizar os achados de findings.md em um sumário executivo que:

- Responda diretamente às perguntas-guia
- Extraia insights que emergem dos achados
- Formule recomendações acionáveis
- Identifique gaps e limitações
- Defina próximos passos

## Etapas de Execução

### 1. Carregar Contexto

Execute o script de pré-requisitos:

```bash
.research/scripts/bash/check-prerequisites.sh --json --require-scope --require-findings
```

Parse o JSON e carregue:

- `scope.md`: Perguntas-guia originais
- `findings.md`: Achados consolidados

Se findings.md não existir, instrua: `/researchkit.report` primeiro.

### 2. Analisar Achados

#### 2.1 Mapear Achados por Pergunta

Para cada pergunta-guia:

- Listar achados relacionados (por tag ou inferência)
- Calcular confiança agregada
- Identificar se há resposta completa, parcial ou ausente

#### 2.2 Identificar Padrões

Buscar padrões que emergem dos achados:

- Temas recorrentes
- Relações não explícitas no escopo
- Contradições sistemáticas
- Gaps consistentes

### 3. Gerar Respostas às Perguntas-Guia

Para cada pergunta:

```markdown
### Pergunta Principal

> **[Texto da pergunta]**

**Resposta**: [Resposta direta, 1-2 parágrafos. Não hedge desnecessariamente, mas seja honesto sobre incertezas]

**Confiança**: 🟢/🟡/🟠/🔴 [Baseada nos achados de suporte]

**Achados de suporte**: F###, F###, F###
```

**Regras para respostas**:

- Responder diretamente à pergunta
- Basear apenas em achados documentados
- Indicar confiança agregada
- Referenciar achados específicos

### 4. Extrair Insights

Insights são descobertas que vão além dos achados individuais:

```markdown
### Insight [N]: [Título]

> [Descrição do insight — algo que emerge da combinação de achados]

**Implicações**:

- [Implicação 1 para o projeto/decisão]
- [Implicação 2]

**Achados relacionados**: F###, F###
```

**Tipos de insight**:

- **Síntese**: Combinação de achados que revela padrão maior
- **Implicação**: Consequência não explícita dos achados
- **Oportunidade**: Possibilidade identificada pela pesquisa
- **Risco**: Ameaça ou problema revelado

### 5. Formular Recomendações

Transformar insights em ações:

```markdown
### Recomendação [N]: [Ação recomendada]

**Prioridade**: Alta / Média / Baixa

**Justificativa**: [Por que esta ação é recomendada, com base em achados]

**Achados de suporte**: F###, F###

**Esforço estimado**: Baixo / Médio / Alto

**Dependências**: [Se houver]
```

**Critérios de priorização**:

- Alta: Resolve problema crítico ou desbloqueia decisão importante
- Média: Melhoria significativa ou prevenção de risco
- Baixa: Otimização ou melhoria incremental

### 6. Documentar Gaps e Limitações

#### 6.1 Gaps de Conhecimento

```markdown
### Gaps de Conhecimento

| Gap  | Descrição                  | Impacto   | Pesquisa Futura? |
| ---- | -------------------------- | --------- | ---------------- |
| G### | [O que não foi encontrado] | [Impacto] | Sim/Não          |
```

#### 6.2 Limitações da Pesquisa

```markdown
### Limitações desta Pesquisa

1. **[Limitação 1]**: [Descrição]
2. **[Limitação 2]**: [Descrição]
```

**Tipos de limitação**:

- Fontes indisponíveis
- Escopo de tempo limitado
- Idiomas não cobertos
- Viés de amostragem

### 7. Definir Próximos Passos

Organizar por horizonte temporal:

```markdown
## Próximos Passos

### Imediatos (Esta Sprint/Semana)

- [ ] [Ação baseada em recomendação prioritária]
- [ ] [Decisão a tomar com base nos achados]

### Curto Prazo (Este Mês)

- [ ] [Ação de médio prazo]
- [ ] [Pesquisa de follow-up para Gap G###]

### Backlog

- [ ] [Ação de menor prioridade]
- [ ] [Revisão periódica em [data]]
```

### 8. Calcular Métricas

```markdown
## Métricas da Pesquisa

| Métrica               | Valor          |
| --------------------- | -------------- |
| Perguntas respondidas | [N] de [Total] |
| Achados totais        | [N]            |
| Confiança média       | [calculada]    |
| Fontes utilizadas     | [N]            |
| Tempo total           | [se conhecido] |
| Gaps identificados    | [N]            |
```

### 9. Gerar TL;DR

Resumo executivo em 2-3 frases:

```markdown
## TL;DR

> [Resumo que responde à pergunta principal e indica confiança. Máximo 3 frases.]
```

**Estrutura sugerida**:

1. Resposta à pergunta principal
2. Insight mais importante
3. Recomendação principal ou limitação crítica

### 10. Gerar summary.md

Use o template `.research/templates/summary-template.md`:

1. Preencher TL;DR
2. Inserir respostas às perguntas
3. Adicionar insights
4. Listar recomendações
5. Documentar gaps e limitações
6. Definir próximos passos
7. Incluir métricas
8. Adicionar links para outros artefatos

Salve em `RESEARCH_DIR/summary.md`.

### 11. Validação Final

Antes de finalizar, verificar:

- [ ] Todas as perguntas-guia têm resposta ou justificativa de gap
- [ ] Todos os achados relevantes foram considerados
- [ ] Insights são baseados em achados (não especulação)
- [ ] Recomendações são acionáveis e priorizadas
- [ ] TL;DR responde a pergunta principal
- [ ] Links para artefatos estão corretos

### 12. Relatório

Informe ao usuário:

- Caminho do summary.md criado
- Perguntas respondidas vs gaps
- Número de insights e recomendações
- Próximo passo: `/researchkit.integrate`

## Princípios Operacionais

- **Síntese > Compilação**: Sumário não é lista de achados, é análise
- **Acionabilidade**: Recomendações devem ser executáveis
- **Honestidade**: Gaps e limitações são tão importantes quanto achados
- **Rastreabilidade**: Toda afirmação deve ter achado de suporte

## Restrições

- Não adicionar informação que não está em findings.md
- Não fazer recomendações sem achados que as suportem
- Não ocultar gaps ou limitações significativas
- Não exagerar confiança além do que os achados permitem

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.

```

```
