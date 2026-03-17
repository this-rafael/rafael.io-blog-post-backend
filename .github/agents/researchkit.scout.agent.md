````chatagent
---
description: Executar consulta norteadora rápida para validar viabilidade e identificar lacunas antes do planejamento detalhado.
handoffs:
  - label: Planejar Busca Detalhada
    agent: researchkit.plan
    prompt: Criar estratégia detalhada de busca com base na consulta norteadora
    send: true
---

## Entrada do Usuário

```text
$ARGUMENTS
````

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Meta

Realizar uma consulta rápida e exploratória para:

- Validar se o escopo definido é viável
- Identificar lacunas e ajustes necessários
- Mapear o terreno antes do planejamento detalhado
- Estimar esforço e complexidade da pesquisa

**IMPORTANTE**: Esta é uma etapa RÁPIDA (15-30 min máx). Não é para encontrar todas as respostas, mas para validar que as respostas PODEM ser encontradas.

## Etapas de Execução

### 1. Carregar Contexto

Execute o script de pré-requisitos:

```bash
.research/scripts/bash/check-prerequisites.sh --json --require-scope
```

Parse o JSON para obter:

- `RESEARCH_DIR`: Diretório da pesquisa ativa
- `SCOPE_FILE`: Caminho do scope.md

Se `STATUS` != "OK", instrua o usuário a executar `/researchkit.scope` primeiro.

### 2. Analisar Escopo

Carregue e extraia do scope.md:

- Objetivo principal
- Perguntas-guia (principal + secundárias)
- Fontes candidatas priorizadas
- Critérios de inclusão/exclusão

### 3. Consulta Norteadora Rápida

Para cada pergunta-guia, execute uma busca superficial (máx 5 min por pergunta):

**Estratégia de busca rápida**:

1. Verificar se fontes primárias existem e são acessíveis
2. Fazer 1-2 buscas exploratórias por pergunta
3. Anotar primeiros resultados relevantes encontrados
4. Identificar termos-chave que aparecem nas fontes

**Registrar para cada pergunta**:

- [ ] Fonte primária acessível? (Sim/Não/Parcial)
- [ ] Primeiros achados promissores? (Sim/Não)
- [ ] Terminologia específica identificada?
- [ ] Complexidade estimada (Baixa/Média/Alta)

### 4. Avaliar Viabilidade

Com base na consulta rápida, determine:

**Status de Viabilidade**:

- 🟢 **Viável**: Fontes existem, informação parece acessível
- 🟡 **Parcialmente Viável**: Algumas lacunas, mas contornáveis
- 🔴 **Requer Ajuste**: Escopo precisa ser revisado

**Critérios de avaliação**:

- Fontes primárias são acessíveis?
- A terminologia do escopo corresponde à das fontes?
- O volume de informação é tratável no prazo?
- Há sinais de que as perguntas têm resposta?

### 5. Identificar Lacunas

Documente lacunas encontradas:

**Tipos de lacuna**:

- **Fonte indisponível**: Documentação não existe ou não é pública
- **Terminologia divergente**: Escopo usa termos diferentes das fontes
- **Escopo muito amplo**: Informação dispersa demais
- **Escopo muito estreito**: Pouca informação disponível
- **Informação desatualizada**: Fontes existem mas são antigas

### 6. Propor Ajustes

Se viabilidade != 🟢, proponha ajustes:

**Ajustes de escopo**:

- Refinar perguntas-guia para maior especificidade
- Adicionar/remover fontes candidatas
- Ajustar critérios de inclusão/exclusão
- Redefinir critérios de saturação

**Ajustes de estratégia**:

- Sugerir fontes alternativas
- Recomendar abordagem diferente
- Propor divisão em pesquisas menores

### 7. Estimar Esforço

Com base na consulta, estime:

| Aspecto              | Estimativa       |
| -------------------- | ---------------- |
| Tarefas de busca     | [N] tarefas      |
| Tempo total          | [X] horas        |
| Complexidade         | Baixa/Média/Alta |
| Paralelismo possível | [%] das tarefas  |

### 8. Registrar Resultados

Atualize o scope.md com seção de consulta norteadora:

```markdown
## Consulta Norteadora

**Data**: [YYYY-MM-DD]
**Duração**: [X min]
**Viabilidade**: 🟢/🟡/🔴

### Achados Preliminares

- [Achado 1 da consulta rápida]
- [Achado 2]

### Lacunas Identificadas

- [Lacuna 1]
- [Lacuna 2]

### Ajustes Recomendados

- [Ajuste 1, se houver]

### Estimativa de Esforço

- Tarefas: ~[N]
- Tempo: ~[X]h
- Complexidade: [Nível]
```

### 9. Decisão de Continuidade

Pergunte ao usuário:

**Se 🟢 Viável**:

> "Consulta norteadora concluída. O escopo é viável. Deseja prosseguir para o planejamento detalhado com `/researchkit.plan`?"

**Se 🟡 Parcialmente Viável**:

> "Consulta norteadora identificou lacunas [listar]. Recomendo os ajustes [listar]. Deseja:
> A) Ajustar escopo e re-executar `/researchkit.scout`
> B) Prosseguir mesmo assim para `/researchkit.plan`"

**Se 🔴 Requer Ajuste**:

> "Consulta norteadora indica que o escopo atual não é viável. Problemas: [listar]. Recomendo revisar o escopo com `/researchkit.scope` antes de continuar."

## Princípios Operacionais

- **Velocidade sobre profundidade**: Esta etapa é exploratória, não exaustiva
- **Falhar rápido**: Melhor descobrir inviabilidade agora do que após horas de busca
- **Pragmatismo**: Ajustar escopo é normal, não é falha
- **Documentar tudo**: Mesmo achados negativos são valiosos

## Restrições

- Máximo de 30 minutos total
- Máximo de 5 minutos por pergunta-guia
- Não criar achados formais (F001...) — apenas notas preliminares
- Não modificar estrutura do scope.md além da seção de consulta norteadora

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.

```

```
