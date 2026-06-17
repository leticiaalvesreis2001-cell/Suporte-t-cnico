# 🛠️ TechSupport Ops — Dashboard de Suporte Técnico

> Portal corporativo de suporte técnico com gerenciamento de chamados, agenda técnica, relatórios e administração — construído como SPA (Single Page Application) com HTML, CSS e JavaScript puro.

---

## 📸 Preview

![TechSupport Ops Dashboard](./assets/images/preview.png)

---

## ✨ Funcionalidades

| Módulo | Descrição |
|---|---|
| 🏠 **Hub Central** | Visão geral com KPIs, chamados críticos e técnicos online |
| 📊 **Dashboard Operacional** | Métricas, gráficos de prioridade, categoria e evolução mensal |
| 🎫 **Central de Chamados** | Listagem, busca, filtros, paginação e gerenciamento de tickets |
| 📋 **Detalhes do Chamado** | Chat técnico interno, timeline de histórico e gestão de status |
| 📅 **Agenda Técnica** | Escala de técnicos, plantões e visitas técnicas |
| 📈 **Relatórios & Analytics** | SLA, produtividade por técnico e exportação de dados |
| 🔐 **Administração** | Gestão de usuários, perfis, permissões e logs de auditoria |
| ⚙️ **Configurações** | Preferências do sistema, tema dark/light e integrações |

---

## 🏗️ Arquitetura

```
08 Suporte tecnico/
├── index.html              # Ponto de entrada da SPA
├── assets/
│   ├── css/
│   │   └── styles.css      # Design system completo (dark mode)
│   └── js/
│       └── app.js          # Lógica da SPA, roteamento e componentes
├── data/
│   └── mockData.js         # Dados iniciais simulados (mock database)
├── services/
│   └── ticketService.js    # Camada de serviço com persistência via LocalStorage
└── .docs/
    └── SPEC.md             # Especificação técnica do projeto
```

---

## 🚀 Como Executar

### Pré-requisitos

- Navegador moderno (Chrome, Firefox, Edge ou Safari)
- Nenhuma instalação de dependência necessária

### Execução Local

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/leticiaalvesreis2001-cell/Suporte-t-cnico.git
   cd Suporte-t-cnico
   ```

2. **Abra no navegador:**
   - Abra o arquivo `index.html` diretamente no navegador, **ou**
   - Use a extensão **Live Server** no VS Code para melhor experiência

3. **Acesse a aplicação:**
   ```
   http://127.0.0.1:5500/index.html
   ```

---

## 🔧 Stack Tecnológica

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura semântica da aplicação |
| **CSS3 Vanilla** | Design system, animações e responsividade |
| **JavaScript ES6+** | Lógica SPA, roteamento hash e manipulação DOM |
| **LocalStorage API** | Persistência de dados no lado do cliente |
| **Google Fonts** | Tipografia (Inter + JetBrains Mono) |
| **Material Symbols** | Ícones da interface |

---

## 🔒 Segurança

- ✅ **Sem hardcoded secrets** — nenhuma chave de API ou senha no código-fonte
- ✅ **DOM seguro** — uso de `textContent` e `createElement` (sem `innerHTML` com dados externos)
- ✅ **Dados em LocalStorage** — adequado para protótipo; para produção, migrar para backend autenticado
- ✅ **`.env.example`** — template preparado para futuras integrações com APIs externas
- ⚠️ **TODO(security):** Implementar autenticação (OAuth 2.0 / Firebase Auth) antes de ir a produção
- ⚠️ **TODO(security):** Migrar dados do LocalStorage para backend com banco de dados real
- ⚠️ **TODO(security):** Adicionar CSP (Content Security Policy) no servidor de hospedagem

---

## 🗺️ Roadmap

- [ ] Integração com Firebase / Supabase
- [ ] Autenticação e controle de acesso (RBAC)
- [ ] Notificações em tempo real (WebSockets)
- [ ] API REST com backend Node.js ou Python
- [ ] Aplicativo mobile (React Native / PWA)
- [ ] Relatórios em PDF
- [ ] Dashboard em tempo real

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👩‍💻 Autora

**Letícia Alves Reis**
- GitHub: [@leticiaalvesreis2001-cell](https://github.com/leticiaalvesreis2001-cell)

---

*Desenvolvido como projeto de portfólio — Google ATG 2606*
