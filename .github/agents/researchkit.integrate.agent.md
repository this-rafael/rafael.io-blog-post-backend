````chatagent
---
description: Atualizar knowledgebase/index.md e arquivos temáticos com os resultados da pesquisa, versionando alterações.
---

## Entrada do Usuário

```text
$ARGUMENTS
````

Você **DEVE** considerar a entrada do usuário antes de prosseguir (se não estiver vazia).

## Meta

Integrar os resultados da pesquisa na base de conhecimento permanente:

- Atualizar index.md com nova entrada
- Adicionar termos ao glossário global
- Categorizar a pesquisa por tema
- Versionar a atualização
- Preservar conhecimento existente

## Etapas de Execução

### 1. Carregar Contexto

Execute o script de pré-requisitos:

```bash
.research/scripts/bash/check-prerequisites.sh --json --require-scope --require-findings
```

Parse o JSON e carregue:

- `scope.md`: Metadados da pesquisa
- `summary.md`: Resultados consolidados
- `findings.md`: Achados com termos para glossário
- `knowledgebase/index.md`: Índice atual

### 2. Extrair Metadados da Pesquisa

Do scope.md e summary.md, extrair:

- ID da pesquisa (ex: 001-circuit-breaker)
- Título/Tema
- Data de conclusão
- Confiança geral (média ou predominante)
- Status (Completo / Parcial / Em revisão)
- Categoria temática

### 3. Determinar Categoria

Classificar a pesquisa em uma das categorias do index.md:

- Arquitetura e Design
- Integrações e APIs
- Processos e Fluxos
- Ferramentas e Tecnologias
- Domínio de Negócio
- [Nova categoria se necessário]

### 4. Atualizar Tabela de Pesquisas

Adicionar linha na tabela "Pesquisas Catalogadas":

```markdown
| [ID] | [Tema] | [Status] | [Data] | [Confiança] | [summary](./[ID]/summary.md) |
```

**Exemplo**:

```markdown
| 001-circuit-breaker | Padrões de Circuit Breaker | Completo | 2026-01-29 | 🟢 Alto | [summary](./001-circuit-breaker/summary.md) |
```

### 5. Atualizar Seção de Categoria

Na seção da categoria apropriada, adicionar entrada:

```markdown
### [Categoria]

- **[ID]**: [Título] — [TL;DR resumido em 1 linha] ([summary](./[ID]/summary.md))
```

### 6. Atualizar Glossário Global

Extrair termos relevantes de findings.md e summary.md:

Para cada termo técnico importante:

```markdown
| [Termo] | [Definição concisa] | [ID da pesquisa de origem] |
```

**Regras do glossário**:

- Não duplicar termos existentes
- Atualizar definição se pesquisa trouxer versão mais precisa
- Manter referência à pesquisa de origem

### 7. Verificar Conflitos com Conhecimento Existente

Se a pesquisa contradiz conhecimento anterior:

1. **Identificar conflito**: Comparar achados com pesquisas anteriores da mesma categoria
2. **Documentar**: Adicionar nota em ambas as pesquisas
3. **Resolver ou marcar**:
   - Se resolução clara: Atualizar pesquisa antiga como "superseded"
   - Se incerto: Marcar ambas para revisão

```markdown
### Conflitos com Conhecimento Anterior

| Pesquisa Atual | Pesquisa Anterior | Natureza    | Resolução |
| -------------- | ----------------- | ----------- | --------- |
| [ID atual]     | [ID anterior]     | [Descrição] | [Decisão] |
```

### 8. Atualizar Estatísticas

Recalcular métricas do index.md:

```markdown
## Estatísticas

| Métrica                    | Valor          |
| -------------------------- | -------------- |
| **Total de Pesquisas**     | [N+1]          |
| **Pesquisas Completas**    | [atualizado]   |
| **Pesquisas em Andamento** | [atualizado]   |
| **Achados Catalogados**    | [somar novos]  |
| **Gaps Identificados**     | [somar novos]  |
| **Última Atualização**     | [data de hoje] |
```

### 9. Atualizar Histórico

Adicionar entrada no histórico de atualizações:

```markdown
| [Data] | [Nova versão] | [ID] | Integração | [Descrição breve] |
```

### 10. Versionar Index

Incrementar versão do index.md:

- **PATCH**: Adição de uma pesquisa sem conflitos
- **MINOR**: Adição de categoria ou mudança estrutural
- **MAJOR**: Resolução de conflito que invalida conhecimento anterior

Atualizar cabeçalho:

```markdown
**Versão**: [X.Y.Z]  
**Última Atualização**: [data]
```

### 11. Verificar Pesquisas para Revisão

Se alguma pesquisa existente tiver > 6 meses desde última atualização:

Adicionar na seção "Pesquisas Pendentes de Revisão":

```markdown
| [ID] | [Tema] | [Última Atualização] | Revisar relevância |
```

### 12. Validação Final

Antes de salvar:

- [ ] Tabela de pesquisas ordenada por ID
- [ ] Categoria correta atribuída
- [ ] Links para artefatos funcionando
- [ ] Glossário sem duplicatas
- [ ] Estatísticas recalculadas
- [ ] Versão incrementada
- [ ] Histórico atualizado

### 13. Salvar Alterações

Salvar index.md atualizado.

### 14. Relatório

Informe ao usuário:

- Pesquisa integrada: [ID]
- Categoria: [nome]
- Termos adicionados ao glossário: [N]
- Conflitos identificados: [N]
- Nova versão do index: [X.Y.Z]
- Status: Integração completa

## Princípios Operacionais

- **Preservação**: Não apagar conhecimento existente sem justificativa
- **Versionamento**: Toda mudança gera incremento de versão
- **Rastreabilidade**: Links bidirecionais entre index e pesquisas
- **Consistência**: Mesmo formato para todas as entradas

## Tratamento de Conflitos

Quando nova pesquisa contradiz anterior:

1. **Regra de recência**: Pesquisa mais recente tem precedência se confiança igual
2. **Regra de confiança**: Confiança maior prevalece independente de data
3. **Regra de especificidade**: Pesquisa mais específica prevalece sobre genérica
4. **Se empate**: Marcar ambas para revisão humana

## Restrições

- Nunca remover pesquisa anterior (apenas marcar como superseded)
- Nunca modificar conteúdo de pesquisas anteriores (apenas adicionar notas)
- Sempre manter links funcionando
- Sempre incrementar versão em mudanças

## Idioma

Sempre se comunique em português do Brasil, a menos que o usuário solicite outra linguagem.

```

```
