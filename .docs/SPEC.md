# COMANDO PARA O AGENTE ANTIGRAVITY

## CONTEXTO

A página principal está localizada na raiz do projeto.

As demais funcionalidades estão organizadas em pastas independentes:

```text
/
├── index.html
├── agenda_da_equipe_tecnica/
├── detalhes_do_chamado_1024/
├── painel_geral_modo_escuro_suporte_tecnico/
├── relatorios_e_analytics_suporte_tecnico/
└── technical_support_core/
```

## OBJETIVO

Transformar o conjunto de páginas em um **Portal Integrado de Suporte Técnico** com navegação unificada, experiência consistente e arquitetura preparada para crescimento futuro.

---

## 1. Página Principal (Raiz)

Transformar a página principal em um **Hub Central de Operações**.

### Adicionar

* Resumo executivo
* KPIs principais
* Atalhos rápidos
* Últimos chamados
* Chamados críticos
* Técnicos disponíveis
* Indicadores de SLA
* Navegação para todos os módulos

### Criar cards para acesso rápido

* Dashboard Geral
* Chamados
* Agenda Técnica
* Relatórios
* Administração

---

## 2. Navegação Global

Implementar menu lateral persistente em todas as páginas.

### Itens do menu

```text
Home
Dashboard
Chamados
Agenda Técnica
Relatórios
Administração
Configurações
```

O menu deve funcionar de forma consistente em todas as pastas do projeto.

---

## 3. Dashboard Operacional

### Pasta

```text
painel_geral_modo_escuro_suporte_tecnico
```

### Objetivos

Transformar em dashboard principal contendo:

* Total de chamados
* Chamados abertos
* Chamados em atendimento
* Chamados críticos
* SLA vencido
* Técnicos online

### Adicionar gráficos

* Chamados por categoria
* Chamados por prioridade
* Chamados por técnico
* Evolução mensal

Utilizar layout dark mode moderno.

---

## 4. Central de Chamados

### Pasta

```text
detalhes_do_chamado_1024
```

### Objetivos

Converter em módulo completo de gerenciamento de tickets.

### Implementar

* Listagem de chamados
* Busca
* Filtros
* Prioridade
* Status
* Responsável
* Comentários
* Histórico
* Anexos

Preparar estrutura para futura integração com banco de dados.

---

## 5. Agenda Técnica

### Pasta

```text
agenda_da_equipe_tecnica
```

### Implementar

* Calendário mensal
* Agenda semanal
* Escalas
* Visitas técnicas
* Plantões
* Férias
* Técnicos disponíveis

---

## 6. Relatórios e Analytics

### Pasta

```text
relatorios_e_analytics_suporte_tecnico
```

### Implementar

* Relatório de SLA
* Produtividade por técnico
* Tempo médio de resolução
* Chamados por cliente
* Chamados por categoria
* Indicadores operacionais

### Adicionar

* Gráficos interativos
* Filtros por período
* Exportação de dados

---

## 7. Núcleo Administrativo

### Pasta

```text
technical_support_core
```

### Transformar em área administrativa

#### Criar módulos

* Usuários
* Técnicos
* Perfis
* Permissões
* Configurações
* Integrações
* API
* Auditoria

---

## 8. Padronização Visual

Criar sistema visual único para todo o portal.

### Utilizar

* Tema Dark Corporativo
* Componentes reutilizáveis
* Cards padronizados
* Tabelas responsivas
* Sidebar fixa
* Layout adaptável para desktop e mobile

---

## 9. Estrutura Técnica

Criar organização:

```text
/assets
/assets/css
/assets/js
/assets/images
/assets/icons
/components
/data
/services
```

### Centralizar

* CSS global
* JavaScript global
* Componentes reutilizáveis
* Serviços de dados

---

## 10. Preparação para Evolução

Preparar a aplicação para futura integração com:

* Firebase
* Supabase
* API REST
* Banco SQL
* Autenticação
* Controle de acesso
* Dashboard em tempo real

---

# RESULTADO ESPERADO

Entregar um portal corporativo de suporte técnico semelhante a uma plataforma Service Desk moderna, com:

* Navegação integrada
* Arquitetura escalável
* Componentes reutilizáveis
* Visual profissional
* Alta usabilidade
* Responsividade completa
* Preparação para integração com banco de dados e APIs futuras

O projeto deve seguir boas práticas de organização, manutenibilidade, acessibilidade e experiência do usuário (UX/UI).
