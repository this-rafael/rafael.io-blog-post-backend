````chatagent
---
description: Definir escopo, perguntas-guia, critérios de qualidade e fontes candidatas para uma nova pesquisa.
handoffs:
  - label: Consulta Norteadora
    agent: researchkit.scout
    prompt: Executar consulta norteadora rápida para validar viabilidade
    send: true
---

## Entrada do Usuário

```text
$ARGUMENTS
````

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Meta

Criar uma definição de escopo rigorosa para uma nova pesquisa, garantindo que:

- O objetivo seja claro e alcançável
- As perguntas-guia sejam específicas e respondíveis
- Os critérios de inclusão/exclusão eliminem ambiguidade
- As fontes candidatas sejam apropriadas ao tema
- Os critérios de saturação definam quando parar

## Etapas de Execução

### 1. Inicialização

a. **Gerar um nome curto** (2-4 palavras) para a pesquisa:

- Analise a descrição e extraia palavras-chave significativas
- Use formato substantivo-tema (ex.: "circuit-breaker-patterns", "ebury-api-auth")
- Preserve termos técnicos e siglas

b. **Verificar pesquisas existentes**:

```bash
ls -la $(git rev-parse --show-toplevel 2>/dev/null || pwd)/knowledgebase/
```

- Encontre o maior número N entre as pastas existentes
- Use N+1 para a nova pesquisa

c. **Criar estrutura**:

```bash
.research/scripts/bash/create-new-research.sh --json --short-name "[short-name]" --number [N+1] "[Descrição]"
```

- Parse o JSON de saída para obter RESEARCH_DIR e SCOPE_FILE
- Para aspas simples em argumentos, use escape: `'I'\''m'` ou aspas duplas

### 2. Análise da Solicitação

Extraia da entrada do usuário:

- **Tema central**: O que está sendo pesquisado
- **Motivação**: Por que esta pesquisa é necessária agora
- **Contexto**: Qual problema ou decisão depende dos achados
- **Restrições implícitas**: Prazo, escopo, fontes mencionadas

Se a entrada for vaga, faça até 3 perguntas de clarificação:

1. Qual é o objetivo principal desta pesquisa?
2. Que decisão ou ação depende dos resultados?
3. Há restrições de tempo ou escopo?

### 3. Formular Perguntas-Guia

Gere perguntas seguindo esta hierarquia:

**Pergunta Principal** (obrigatória):

- DEVE ser respondível com os recursos disponíveis
- DEVE ser específica o suficiente para ter resposta objetiva
- DEVE ser relevante para a motivação declarada

**Perguntas Secundárias** (2-4):

- Aprofundam ou contextualizam a principal
- Cobrem aspectos específicos do tema
- Exploram implicações ou aplicações

**Critérios de boa pergunta**:

- ✅ "Como o módulo X implementa circuit breaker?"
- ✅ "Quais são os modos de falha documentados da API Y?"
- ❌ "O sistema é bom?" (vago)
- ❌ "Tudo sobre Z" (escopo infinito)

### 4. Definir Critérios de Inclusão/Exclusão

**Inclusão** — O que DEVE ser considerado:

- Versões específicas (>= X.Y.Z)
- Tipos de fonte (oficial, código, artigos)
- Período temporal (publicado após YYYY-MM-DD)
- Idiomas aceitos

**Exclusão** — O que NÃO deve ser considerado:

- Versões obsoletas
- Fontes não confiáveis
- Tópicos adjacentes mas fora de escopo
- Conteúdo especulativo sem base

### 5. Mapear Fontes Candidatas

Classifique fontes por prioridade:

**Primárias** (preferidas):

- Documentação oficial do projeto
- Código-fonte
- RFCs, ADRs, specs existentes
- Testes como especificação

**Secundárias**:

- Artigos técnicos de mantenedores
- Tutoriais reconhecidos
- Issues/PRs com discussão técnica

**Terciárias** (usar com cautela):

- Stack Overflow, fóruns
- Vídeos, podcasts
- Inferência comportamental

### 6. Estabelecer Critérios de Qualidade

Defina os requisitos mínimos:

- **Confiabilidade**: Alto / Médio / Baixo aceito
- **Múltiplas fontes**: Obrigatório para afirmações críticas? (Sim/Não)
- **Recência**: Máximo de X meses/anos
- **Idiomas**: Quais são aceitos

### 7. Definir Critérios de Saturação

A pesquisa será considerada completa quando:

- [ ] Todas as perguntas-guia tiverem resposta com confiança >= [nível]
- [ ] [Critério específico do tema]
- [ ] Nenhuma nova informação relevante em [N] fontes consecutivas

### 8. Escrever scope.md

Preencha o template em SCOPE_FILE com todos os elementos definidos:

- Use o template de `.research/templates/scope-template.md`
- Substitua todos os placeholders
- Mantenha formatação Markdown válida

### 9. Validação

Antes de finalizar, verifique:

- [ ] Objetivo é claro e alcançável
- [ ] Pergunta principal é específica e respondível
- [ ] Perguntas secundárias complementam a principal
- [ ] Critérios de inclusão/exclusão são objetivos
- [ ] Fontes candidatas são apropriadas
- [ ] Critérios de saturação são mensuráveis

### 10. Relatório

Informe ao usuário:

- Caminho do scope.md criado
- Resumo do escopo definido
- Próximo passo recomendado: `/researchkit.scout`

## Princípios Operacionais

- **Especificidade > Abrangência**: Melhor escopo estreito bem definido do que amplo e vago
- **Perguntas respondíveis**: Cada pergunta deve ter resposta possível com recursos disponíveis
- **Fontes realistas**: Não listar fontes que não existem ou não são acessíveis
- **Critérios objetivos**: Inclusão/exclusão devem ser verificáveis sem julgamento subjetivo

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.

```

```
