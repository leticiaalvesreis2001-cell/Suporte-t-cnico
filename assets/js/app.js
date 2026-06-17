/* ============================================================
   TechSupport Ops — Main Application Logic (SPA Router & Pages)
   Integrated with TicketService (LocalStorage)
   ============================================================ */

// ─── HELPER FUNCTIONS ───────────────────────────────────────

const CAT_MAP = {
  ti: { label: 'TI', css: 'cat-badge-ti', chipCss: 'chip-ti', icone: 'computer' },
  eletrica: { label: 'Elétrica', css: 'cat-badge-eletrica', chipCss: 'chip-eletrica', icone: 'bolt' },
  predial: { label: 'Predial', css: 'cat-badge-predial', chipCss: 'chip-predial', icone: 'apartment' },
  seguranca: { label: 'Segurança', css: 'cat-badge-seguranca', chipCss: 'chip-seguranca', icone: 'videocam' },
  telecom: { label: 'Telecom', css: 'cat-badge-telecom', chipCss: 'chip-telecom', icone: 'settings_phone' }
};

const STATUS_MAP = {
  pendente: { label: 'Pendente', css: 'badge-pendente' },
  progresso: { label: 'Em Progresso', css: 'badge-progresso' },
  validando: { label: 'Validando', css: 'badge-validando' },
  resolvido: { label: 'Resolvido', css: 'badge-resolvido' }
};

const PRIORIDADE_MAP = {
  critica: { label: 'Crítica', dots: 3, cor: 'var(--color-error-bright)' },
  alta: { label: 'Alta', dots: 2, cor: 'var(--cat-eletrica)' },
  media: { label: 'Média', dots: 1, cor: 'var(--cat-eletrica)' },
  baixa: { label: 'Baixa', dots: 1, cor: 'var(--color-outline)' }
};

function el(tag, attrs, children) {
  const node = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'className') node.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
      else if (k === 'style' && typeof v === 'string') node.setAttribute('style', v);
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
      else node.setAttribute(k, v);
    }
  }
  if (children !== undefined && children !== null) {
    if (Array.isArray(children)) {
      children.forEach(c => { 
        if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); 
      });
    } else if (typeof children === 'string') {
      node.textContent = children;
    } else {
      node.appendChild(children);
    }
  }
  return node;
}

function icon(name, extraClass) {
  const span = el('span', { className: 'material-symbols-outlined' + (extraClass ? ' ' + extraClass : '') });
  span.textContent = name;
  return span;
}

// ─── STATE ──────────────────────────────────────────────────

const state = {
  currentRoute: '',
  activeFilter: null,
  currentPage: 1,
  ticketsPerPage: 4,
  modalOpen: false,
  ticketSearchQuery: '',
  activeAdminTab: 'usuarios'
};

// ─── ROUTER ─────────────────────────────────────────────────

function navigate(hash) {
  window.location.hash = hash;
}

function getRoute() {
  const h = window.location.hash.slice(1) || '/home';
  return h;
}

function routeMatch(route, pattern) {
  const routeParts = route.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);
  if (routeParts.length !== patternParts.length) return null;
  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = routeParts[i];
    } else if (patternParts[i] !== routeParts[i]) {
      return null;
    }
  }
  return params;
}

function handleRoute() {
  const route = getRoute();
  state.currentRoute = route;
  const main = document.getElementById('main-content');
  if (!main) return;
  main.replaceChildren();

  updateActiveNav(route);

  let params;
  if (route === '/home' || route === '/') {
    main.appendChild(renderHome());
  } else if (route === '/dashboard') {
    main.appendChild(renderDashboard());
  } else if (route === '/chamados') {
    main.appendChild(renderChamados());
  } else if ((params = routeMatch(route, '/ticket/:id'))) {
    main.appendChild(renderTicketDetail(parseInt(params.id)));
  } else if (route === '/agenda') {
    main.appendChild(renderAgenda());
  } else if (route === '/relatorios') {
    main.appendChild(renderRelatorios());
  } else if (route === '/administracao') {
    main.appendChild(renderAdministracao());
  } else if (route === '/configuracoes') {
    main.appendChild(renderConfiguracoes());
  } else {
    main.appendChild(renderHome());
  }
}

function updateActiveNav(route) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('data-route');
    if (href === route || (route.startsWith('/ticket') && href === '/chamados')) {
      link.classList.add('active');
    }
  });
}

// ─── SIDEBAR COMPONENT ─────────────────────────────────────

function renderSidebar() {
  const aside = el('aside', { className: 'sidebar', id: 'sidebar' }, [
    el('div', { className: 'sidebar-brand' }, [
      el('h1', {}, 'TechSupport'),
      el('p', {}, 'Enterprise Admin')
    ]),
    el('button', { className: 'sidebar-cta', onClick: () => openModal() }, [
      icon('add'),
      el('span', {}, 'Novo Chamado')
    ]),
    el('nav', { className: 'sidebar-nav' }, [
      navLink('home', 'Home', '/home'),
      navLink('analytics', 'Dashboard', '/dashboard'),
      navLink('confirmation_number', 'Chamados', '/chamados'),
      navLink('calendar_month', 'Agenda Técnica', '/agenda'),
      navLink('assessment', 'Relatórios', '/relatorios'),
      navLink('shield', 'Administração', '/administracao'),
      navLink('settings', 'Configurações', '/configuracoes')
    ]),
    el('div', { className: 'sidebar-footer' }, [
      el('img', { className: 'sidebar-avatar', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoHcrv9CtvMKdRlfD8Qds-jD2ZS7WBFeT-yNwVJ2VC5b31FhqWpu8zopKU3yDEueABj7xQjG3VJ_QFi1DSDWDX-dtmidw4TdD9GhznVn4t6eYZ8jM1__t9Crjb3LN4eR7SVqrXoLlcbKwdrFZruw1Vj_L4QhuauKVdntwJamDDUI6LSg_XHVNABNRlN2DrJ3djvwM3P38x2Xut0ca64ckXSrcZPaIvRT8-uPEcO9Utr-qYXKUtzCe6siKgnzMs0DPKBayJQxxqBlLr', alt: 'Avatar do Usuário' }),
      el('div', { className: 'sidebar-user-info' }, [
        el('p', { className: 'sidebar-user-name' }, 'Ricardo Silva'),
        el('p', { className: 'sidebar-user-role' }, 'Admin Nível 3')
      ])
    ])
  ]);
  return aside;
}

function navLink(iconName, label, route) {
  const isSelected = getRoute() === route || (route === '/home' && getRoute() === '/');
  const link = el('a', {
    className: 'nav-link' + (isSelected ? ' active' : ''),
    href: '#' + route,
    'data-route': route,
    onClick: (e) => {
      e.preventDefault();
      navigate(route);
    }
  }, [
    icon(iconName),
    el('span', {}, label)
  ]);
  return link;
}

// ─── TOPBAR COMPONENT ───────────────────────────────────────

function renderTopbar() {
  return el('header', { className: 'topbar', id: 'topbar' }, [
    el('div', { className: 'topbar-search' }, [
      icon('search'),
      el('input', { 
        type: 'text', 
        placeholder: 'Buscar chamados ou técnicos...',
        onKeyup: (e) => {
          if (e.key === 'Enter') {
            state.ticketSearchQuery = e.target.value.trim();
            navigate('/chamados');
            const searchInput = document.getElementById('ticket-search-input');
            if (searchInput) searchInput.value = state.ticketSearchQuery;
            handleRoute();
          }
        }
      })
    ]),
    el('div', { className: 'topbar-actions' }, [
      el('button', { className: 'topbar-btn', onClick: () => openModal() }, '+ Novo Chamado'),
      el('div', { className: 'topbar-divider' }),
      el('button', { className: 'topbar-icon-btn' }, [
        icon('notifications'),
        el('span', { className: 'notification-badge' })
      ]),
      el('button', { className: 'topbar-icon-btn', onClick: () => navigate('/configuracoes') }, [icon('settings')])
    ])
  ]);
}

// ─── PAGE 1: HOME (HUB CENTRAL) ─────────────────────────────

function renderHome() {
  const page = el('div', { className: 'page-enter' });
  const tickets = TicketService.getTickets();
  const tecnicos = TicketService.getTecnicos();
  const activeTechs = tecnicos.filter(t => t.status === 'online' || t.status === 'busy');

  // Cabeçalho
  page.appendChild(el('div', { className: 'mb-lg' }, [
    el('h2', { className: 'text-headline-lg color-surface' }, 'Hub Central de Operações'),
    el('p', { className: 'color-muted', style: { marginTop: '4px' } }, 'Seja bem-vindo, Ricardo. Veja o status geral do suporte técnico corporativo hoje.')
  ]));

  // KPIs Rápidos
  const criticosCount = tickets.filter(t => t.prioridade === 'critica' && t.status !== 'resolvido').length;
  const pendentesCount = tickets.filter(t => t.status === 'pendente').length;
  
  const stats = el('div', { className: 'stat-grid' }, [
    statCard('warning', 'Chamados Críticos', String(criticosCount), 'Ação imediata requerida', criticosCount > 0 ? 'up-bad' : '', 'var(--color-error-bright)', 'var(--color-error-bright)'),
    statCard('assignment_late', 'Fila Pendente', String(pendentesCount), 'Aguardando atribuição', '', 'var(--color-tertiary)', 'var(--color-tertiary)'),
    statCard('engineering', 'Técnicos Online', `${activeTechs.length}/${tecnicos.length}`, 'Em atendimento ou plantão', 'up-good', 'var(--cat-predial)', 'var(--cat-predial)'),
    statCard('timelapse', 'Violações de SLA', '0', 'Nenhum chamado expirado', '', 'var(--color-primary)', 'var(--color-primary)')
  ]);
  page.appendChild(stats);

  // Atalhos Rápidos (Cards grandes)
  page.appendChild(el('h3', { className: 'section-title mb-md' }, 'Acesso Rápido aos Módulos'));
  const shortcuts = el('div', { className: 'shortcuts-grid' }, [
    shortcutCard('analytics', 'Dashboard Geral', 'Visão estatística e evolução de tickets', '/dashboard'),
    shortcutCard('confirmation_number', 'Central de Chamados', 'Buscar, filtrar e gerenciar tickets', '/chamados'),
    shortcutCard('calendar_month', 'Agenda Técnica', 'Timeline de escalas e técnicos livres', '/agenda'),
    shortcutCard('assessment', 'Relatórios & SLA', 'Métricas de CSAT e produtividade', '/relatorios'),
    shortcutCard('shield', 'Administração', 'Perfis de usuários e logs de auditoria', '/administracao')
  ]);
  page.appendChild(shortcuts);

  // Bento de dados: Últimos chamados + Técnicos online
  const bento = el('div', { className: 'bento-grid bento-8-4', style: { marginTop: 'var(--space-xl)' } }, [
    // Últimos chamados críticos ou recentes
    el('div', { className: 'card flex flex-col' }, [
      el('div', { className: 'flex justify-between items-center mb-md' }, [
        el('h4', { className: 'font-bold color-surface' }, 'Chamados Críticos e Recentes'),
        el('button', { className: 'btn-ghost', onClick: () => navigate('/chamados') }, 'Ver Todos')
      ]),
      el('div', { className: 'overflow-x-auto' }, [
        el('table', { className: 'data-table', style: { background: 'transparent' } }, [
          el('thead', {}, [
            el('tr', {}, [
              el('th', {}, 'ID'),
              el('th', {}, 'Assunto'),
              el('th', {}, 'Prioridade'),
              el('th', {}, 'Status'),
              el('th', { className: 'text-right' }, 'Ação')
            ])
          ]),
          el('tbody', {}, tickets.slice(0, 4).map(ticket => {
            const pri = PRIORIDADE_MAP[ticket.prioridade];
            const st = STATUS_MAP[ticket.status];
            return el('tr', {}, [
              el('td', { className: 'text-mono-sm color-muted' }, '#' + ticket.id),
              el('td', {}, [
                el('p', { className: 'font-semibold color-surface' }, ticket.assunto),
                el('span', { className: 'text-label-md color-muted', style: { fontSize: '10px' } }, ticket.local)
              ]),
              el('td', {}, [
                el('span', { style: `color: ${pri.cor}; font-weight: 700;` }, pri.label)
              ]),
              el('td', {}, [
                el('span', { className: 'badge ' + st.css }, st.label)
              ]),
              el('td', { className: 'text-right' }, [
                el('button', { className: 'btn-ghost', onClick: () => navigate('/ticket/' + ticket.id) }, 'Visualizar')
              ])
            ]);
          }))
        ])
      ])
    ]),
    
    // Técnicos Online
    renderTechList()
  ]);
  page.appendChild(bento);

  return page;
}

function shortcutCard(iconName, title, desc, route) {
  return el('div', { className: 'shortcut-card', onClick: () => navigate(route) }, [
    icon(iconName),
    el('p', { className: 'shortcut-card-title' }, title),
    el('p', { className: 'shortcut-card-desc' }, desc)
  ]);
}

// ─── PAGE 2: DASHBOARD OPERACIONAL ──────────────────────────

function renderDashboard() {
  const page = el('div', { className: 'page-enter' });
  const tickets = TicketService.getTickets();
  const total = tickets.length;
  const abertos = tickets.filter(t => t.status === 'pendente').length;
  const atendimento = tickets.filter(t => t.status === 'progresso').length;
  const resolvidos = tickets.filter(t => t.status === 'resolvido').length;
  const criticos = tickets.filter(t => t.prioridade === 'critica' && t.status !== 'resolvido').length;

  // Cabeçalho
  page.appendChild(el('div', { className: 'mb-lg' }, [
    el('h2', { className: 'text-headline-lg color-surface' }, 'Dashboard Operacional'),
    el('p', { className: 'color-muted', style: { marginTop: '4px' } }, 'Análise de métricas, distribuição e evolução semanal dos chamados.')
  ]));

  // Cards resumo
  const stats = el('div', { className: 'stat-grid' }, [
    statCard('confirmation_number', 'Total Geral', String(total), 'Acumulado no sistema', '', 'var(--color-primary-fixed)', 'var(--color-primary-fixed)'),
    statCard('assignment_late', 'Em Aberto', String(abertos), 'Aguardando ação', '', 'var(--color-tertiary)', 'var(--color-tertiary)'),
    statCard('autorenew', 'Em Atendimento', String(atendimento), 'Com técnicos alocados', '', 'var(--cat-ti)', 'var(--cat-ti)'),
    statCard('check_circle', 'Resolvidos', String(resolvidos), 'Concluídos com sucesso', 'up-good', 'var(--cat-predial)', 'var(--cat-predial)')
  ]);
  page.appendChild(stats);

  // Bento Grid de Gráficos
  const grid = el('div', { className: 'bento-grid bento-8-4 mb-lg' }, [
    renderWeeklyChart(),
    
    // Distribuição por Prioridade
    el('div', { className: 'card flex flex-col justify-between' }, [
      el('h4', { className: 'font-semibold color-surface mb-md' }, 'Distribuição por Prioridade'),
      el('div', { className: 'flex flex-col gap-md' }, ['critica', 'alta', 'media', 'baixa'].map(prioKey => {
        const prioTickets = tickets.filter(t => t.prioridade === prioKey).length;
        const pct = total > 0 ? Math.round((prioTickets / total) * 100) : 0;
        const details = PRIORIDADE_MAP[prioKey];
        return el('div', { className: 'progress-bar-container' }, [
          el('div', { className: 'progress-bar-header' }, [
            el('span', { style: `color: ${details.cor}; font-weight: 700;` }, details.label),
            el('span', {}, `${prioTickets} (${pct}%)`)
          ]),
          el('div', { className: 'progress-bar-track' }, [
            el('div', { className: 'progress-bar-fill', style: `width: ${pct}%; background: ${details.cor};` })
          ])
        ]);
      }))
    ])
  ]);
  page.appendChild(grid);

  // Gráficos inferiores: Categorias + Técnicos
  const bottomGrid = el('div', { className: 'bento-grid bento-2col' }, [
    // Chamados por Categoria
    el('div', { className: 'card' }, [
      el('h4', { className: 'font-semibold color-surface mb-md' }, 'Chamados por Categoria'),
      el('div', { className: 'flex flex-col gap-md' }, Object.keys(CAT_MAP).map(catKey => {
        const catTickets = tickets.filter(t => t.categoria === catKey).length;
        const pct = total > 0 ? Math.round((catTickets / total) * 100) : 0;
        const details = CAT_MAP[catKey];
        return el('div', { className: 'progress-bar-container' }, [
          el('div', { className: 'progress-bar-header' }, [
            el('span', {}, details.label),
            el('span', {}, `${catTickets} chamados`)
          ]),
          el('div', { className: 'progress-bar-track' }, [
            el('div', { className: 'progress-bar-fill', style: `width: ${pct}%; background: var(--cat-${catKey});` })
          ])
        ]);
      }))
    ]),

    // Evolução de volumetria mensal (SVG Simples)
    el('div', { className: 'card flex flex-col justify-between' }, [
      el('h4', { className: 'font-semibold color-surface mb-md' }, 'Evolução Mensal (Tendência)'),
      el('div', { style: 'height: 180px; display:flex; align-items:flex-end; padding-bottom: 24px; position:relative;' }, [
        // Grid lines
        el('div', { style: 'position:absolute; inset:0; display:flex; flex-direction:column; justify-content:space-between; opacity:0.1; pointer-events:none;' }, [
          el('hr', { style: 'border:0; border-top:1px solid var(--color-outline); margin:0;' }),
          el('hr', { style: 'border:0; border-top:1px solid var(--color-outline); margin:0;' }),
          el('hr', { style: 'border:0; border-top:1px solid var(--color-outline); margin:0;' }),
          el('hr', { style: 'border:0; border-top:1px solid var(--color-outline); margin:0;' })
        ]),
        // Linhas de evolução estilizadas
        el('div', { style: 'width:100%; height:140px; display:flex; justify-content:space-between; align-items:flex-end; position:relative; z-index:1;' }, [
          // Criaremos pontos visuais
          renderMonthPoint('Jul', 40, '40'),
          renderMonthPoint('Ago', 55, '55'),
          renderMonthPoint('Set', 85, '85'),
          renderMonthPoint('Out', 92, '92 (Máx)'),
          renderMonthPoint('Nov', 70, '70'),
          renderMonthPoint('Dez', 60, '60')
        ])
      ])
    ])
  ]);
  page.appendChild(bottomGrid);

  return page;
}

function renderMonthPoint(label, valPct, textVal) {
  return el('div', { style: 'flex:1; display:flex; flex-col:true; align-items:center; justify-content:flex-end; height:100%;' }, [
    el('div', { className: 'color-primary font-bold', style: 'font-size:10px; margin-bottom:4px;' }, textVal),
    el('div', { style: `width:10px; height:10px; border-radius:50%; background:var(--color-primary); box-shadow:0 0 10px var(--color-primary);` }),
    el('div', { style: `width:4px; height:${valPct}%; background:linear-gradient(to top, rgba(183,200,222,0.05), rgba(183,200,222,0.3)); border-radius:999px;` }),
    el('span', { className: 'color-muted', style: 'font-size:11px; margin-top:8px;' }, label)
  ]);
}

// ─── PAGE 3: CENTRAL DE CHAMADOS ────────────────────────────

function renderChamados() {
  const page = el('div', { className: 'page-enter' });
  const allTickets = TicketService.getTickets();

  // Filtragem e busca
  let filtered = allTickets;

  if (state.ticketSearchQuery) {
    const q = state.ticketSearchQuery.toLowerCase();
    filtered = filtered.filter(t => 
      t.id.toString().includes(q) || 
      t.assunto.toLowerCase().includes(q) || 
      t.local.toLowerCase().includes(q) ||
      (t.tecnico && t.tecnico.toLowerCase().includes(q))
    );
  }

  if (state.activeFilter) {
    filtered = filtered.filter(t => t.categoria === state.activeFilter);
  }

  // Paginação
  const total = filtered.length;
  const start = (state.currentPage - 1) * state.ticketsPerPage;
  const pageTickets = filtered.slice(start, start + state.ticketsPerPage);
  const totalPages = Math.ceil(total / state.ticketsPerPage) || 1;

  // Cabeçalho
  page.appendChild(el('div', { className: 'flex justify-between items-center mb-lg', style: { flexWrap: 'wrap', gap: '16px' } }, [
    el('div', {}, [
      el('h2', { className: 'text-headline-lg color-surface' }, 'Central de Chamados'),
      el('p', { className: 'color-muted', style: { marginTop: '4px' } }, 'Pesquise, filtre e acompanhe o andamento dos chamados técnicos abertos.')
    ]),
    el('button', { className: 'btn btn-primary', onClick: () => openModal() }, [icon('add', 'icon-sm'), document.createTextNode(' Novo Chamado')])
  ]));

  // Barra de Busca e Filtros
  const searchFilterRow = el('div', { className: 'flex justify-between items-center gap-md mb-lg', style: { flexWrap: 'wrap' } });
  
  const searchBar = el('div', { className: 'topbar-search', style: { maxWidth: '360px', flex: '1' } }, [
    icon('search'),
    el('input', { 
      id: 'ticket-search-input',
      type: 'text', 
      placeholder: 'Buscar por ID, assunto, local...',
      value: state.ticketSearchQuery,
      onInput: (e) => {
        state.ticketSearchQuery = e.target.value.trim();
        state.currentPage = 1;
        // Debounce simples/re-render
        clearTimeout(state.searchTimeout);
        state.searchTimeout = setTimeout(() => handleRoute(), 300);
      }
    })
  ]);
  searchFilterRow.appendChild(searchBar);

  // Filtros rápidos
  searchFilterRow.appendChild(renderFilterChips());
  page.appendChild(searchFilterRow);

  // Tabela de Tickets
  const tableContainer = el('div', { className: 'data-table-container' });

  // Table header meta
  tableContainer.appendChild(el('div', { className: 'data-table-header' }, [
    el('div', { className: 'data-table-title' }, [
      el('span', { className: 'font-bold color-surface' }, 'Resultados da Busca'),
      el('span', { className: 'data-table-count' }, `${total} chamados`)
    ]),
    el('div', { className: 'flex gap-sm' }, [
      el('button', { className: 'topbar-icon-btn', onClick: () => {
        // Simular exportar csv
        alert('Dados exportados com sucesso!');
        TicketService.addLog('Exportou lista de chamados em CSV', 'Ricardo Silva');
      } }, [icon('download')])
    ])
  ]));

  // Table element
  const table = el('table', { className: 'data-table' });
  const thead = el('thead', {}, [
    el('tr', {}, [
      el('th', {}, 'ID/Ticket'),
      el('th', {}, 'Assunto / Local'),
      el('th', {}, 'Categoria'),
      el('th', {}, 'Prioridade'),
      el('th', {}, 'Status'),
      el('th', {}, 'Técnico'),
      el('th', { className: 'text-right' }, 'Ações')
    ])
  ]);
  table.appendChild(thead);

  const tbody = el('tbody');
  pageTickets.forEach(ticket => {
    const cat = CAT_MAP[ticket.categoria] || { label: ticket.categoria, css: '' };
    const pri = PRIORIDADE_MAP[ticket.prioridade] || { label: ticket.prioridade, dots: 1, cor: 'var(--color-outline)' };
    const st = STATUS_MAP[ticket.status] || { label: ticket.status, css: '' };

    const row = el('tr', {}, [
      el('td', { className: 'text-mono-sm color-muted' }, '#' + ticket.id),
      el('td', {}, [
        el('p', { className: 'font-semibold color-surface' }, ticket.assunto),
        el('p', { className: 'text-label-md color-muted', style: { fontSize: '11px', marginTop: '2px' } }, [icon('pin_drop', 'icon-xs'), document.createTextNode(' ' + ticket.local)])
      ]),
      el('td', {}, [
        el('span', { className: 'cat-badge ' + cat.css }, cat.label)
      ]),
      el('td', {}, [
        el('div', { className: 'flex items-center gap-sm' }, [
          el('span', { className: 'priority-dot', style: `background: ${pri.cor}` }),
          el('span', { className: 'font-semibold color-surface' }, pri.label)
        ])
      ]),
      el('td', {}, [
        el('span', { className: 'badge ' + st.css }, st.label)
      ]),
      el('td', { className: 'color-surface font-semibold' }, ticket.tecnico || 'Não atribuído'),
      el('td', { className: 'text-right' }, [
        el('div', { className: 'flex justify-end gap-sm' }, [
          el('button', { className: 'btn-ghost', onClick: () => navigate('/ticket/' + ticket.id) }, 'Gerenciar')
        ])
      ])
    ]);
    tbody.appendChild(row);
  });

  if (pageTickets.length === 0) {
    tbody.appendChild(el('tr', {}, [
      el('td', { colSpan: '7', className: 'text-center color-muted', style: 'padding: 40px; font-style: italic;' }, 'Nenhum chamado encontrado.')
    ]));
  }

  table.appendChild(tbody);
  tableContainer.appendChild(el('div', { className: 'overflow-x-auto' }, [table]));

  // Footer / Pagination
  const footer = el('div', { className: 'data-table-footer' });
  footer.appendChild(el('span', { className: 'text-label-md color-muted' }, `Mostrando ${pageTickets.length} de ${total} chamados`));
  
  const pag = el('div', { className: 'pagination' });

  const prevBtn = el('button', { 
    className: 'page-btn', 
    onClick: () => { if (state.currentPage > 1) { state.currentPage--; handleRoute(); } } 
  });
  if (state.currentPage <= 1) prevBtn.setAttribute('disabled', '');
  prevBtn.appendChild(icon('chevron_left', 'icon-sm'));
  pag.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    pag.appendChild(el('button', {
      className: 'page-btn' + (i === state.currentPage ? ' active' : ''),
      onClick: () => { state.currentPage = i; handleRoute(); }
    }, String(i)));
  }

  const nextBtn = el('button', { 
    className: 'page-btn', 
    onClick: () => { if (state.currentPage < totalPages) { state.currentPage++; handleRoute(); } } 
  });
  if (state.currentPage >= totalPages) nextBtn.setAttribute('disabled', '');
  nextBtn.appendChild(icon('chevron_right', 'icon-sm'));
  pag.appendChild(nextBtn);

  footer.appendChild(pag);
  tableContainer.appendChild(footer);
  page.appendChild(tableContainer);

  return page;
}

// ─── PAGE 4: DETALHES DO CHAMADO ────────────────────────────

function renderTicketDetail(ticketId) {
  const ticket = TicketService.getTicketById(ticketId);
  if (!ticket) {
    return el('div', { className: 'page-enter p-lg' }, [
      el('h2', { className: 'text-headline-lg' }, 'Ticket não encontrado'),
      el('button', { className: 'btn btn-primary', style: { marginTop: '16px' }, onClick: () => navigate('/chamados') }, 'Voltar à Lista')
    ]);
  }

  const page = el('div', { className: 'page-enter' });

  // Header section
  const header = el('div', { className: 'flex justify-between items-start mb-lg', style: { flexWrap: 'wrap', gap: '16px' } });

  const headerLeft = el('div');
  const crumbs = el('div', { className: 'breadcrumbs' }, [
    el('a', { href: '#/chamados', onClick: (e) => { e.preventDefault(); navigate('/chamados'); } }, 'Tickets'),
    icon('chevron_right', 'icon-xs'),
    el('span', {}, ticket.departamento),
    icon('chevron_right', 'icon-xs'),
    el('span', { className: 'active' }, '#' + ticket.id)
  ]);
  headerLeft.appendChild(crumbs);
  headerLeft.appendChild(el('h1', { className: 'text-headline-xl color-surface' }, ticket.assunto));
  header.appendChild(headerLeft);

  const headerRight = el('div', { className: 'flex items-center gap-md' });
  const statusBox = el('div', { className: 'flex flex-col items-end', style: { marginRight: '16px' } });
  statusBox.appendChild(el('span', { className: 'text-label-md color-muted', style: { textTransform: 'uppercase', letterSpacing: '0.1em' } }, 'Status Atual'));
  
  const statusSelect = el('select', { 
    className: 'input-field select-field', 
    style: { 
      background: 'var(--color-tertiary-container)', 
      color: 'var(--color-tertiary-fixed-dim)', 
      border: 'none', 
      fontWeight: '700', 
      borderRadius: 'var(--radius-lg)', 
      textAlign: 'right', 
      padding: '6px 36px 6px 12px',
      cursor: 'pointer'
    },
    onChange: (e) => {
      const newStatus = e.target.value;
      TicketService.updateTicket(ticket.id, { status: newStatus });
      handleRoute();
    }
  });

  [['pendente', 'PENDENTE'], ['progresso', 'EM PROGRESSO'], ['validando', 'VALIDANDO'], ['resolvido', 'RESOLVIDO']].forEach(([val, lbl]) => {
    const option = el('option', { value: val }, lbl);
    if (ticket.status === val) option.setAttribute('selected', '');
    statusSelect.appendChild(option);
  });
  statusBox.appendChild(statusSelect);
  headerRight.appendChild(statusBox);
  
  headerRight.appendChild(el('button', { 
    className: 'btn btn-primary',
    onClick: () => {
      alert('Chamado atualizado com sucesso!');
      navigate('/chamados');
    }
  }, [icon('save'), document.createTextNode(' Concluir')]));
  
  header.appendChild(headerRight);
  page.appendChild(header);

  // Main grid: 8 col + 4 col
  const grid = el('div', { style: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)' } });

  // Left column
  const leftCol = el('div', { className: 'flex flex-col gap-lg' });

  // Context + Chat bento
  const bentoRow = el('div', { className: 'bento-grid bento-2col' });

  // Context card
  const contextCard = el('div', { className: 'card card-accent-left', style: { borderLeftColor: 'var(--color-error-bright)' } });
  const urgBadge = el('div', { className: 'flex justify-between items-start mb-md' }, [
    el('span', { className: 'badge badge-urgencia' }, `URGÊNCIA ${ticket.prioridade.toUpperCase()}`),
    el('span', { className: 'text-mono-sm color-muted' }, 'SLA: ' + ticket.sla)
  ]);
  contextCard.appendChild(urgBadge);
  contextCard.appendChild(el('p', { className: 'color-muted mb-md', style: { lineHeight: '1.6' } }, 'Relato do problema: ' + ticket.descricao));
  contextCard.appendChild(el('div', {}, [
    el('span', { className: 'text-label-md color-muted' }, 'Localização'),
    el('span', { className: 'text-body-md color-surface', style: { display: 'block', fontWeight: '700' } }, ticket.local)
  ]));
  bentoRow.appendChild(contextCard);

  // Chat card
  const chatCard = el('div', { className: 'card chat-container', style: { minHeight: '320px' } });
  chatCard.appendChild(el('div', { className: 'chat-header' }, [
    el('h3', { className: 'text-headline-md flex items-center gap-sm' }, [icon('forum', 'color-primary'), document.createTextNode(' Chat de Técnicos')]),
    el('span', { className: 'badge badge-pendente' }, 'Interno')
  ]));

  const messagesDiv = el('div', { className: 'chat-messages', id: 'chat-messages' });
  ticket.chat.forEach(msg => {
    messagesDiv.appendChild(renderChatMessage(msg));
  });
  chatCard.appendChild(messagesDiv);

  const chatInputArea = el('div', { className: 'chat-input-area' });
  const chatInput = el('input', { type: 'text', placeholder: 'Escreva uma nota técnica...', className: 'input-field', style: { paddingRight: '40px', borderRadius: 'var(--radius-lg)' } });
  
  const sendBtn = el('button', { className: 'chat-send-btn', onClick: () => {
    const text = chatInput.value.trim();
    if (text) {
      const newMsg = { autor: 'Ricardo Silva', hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), texto: text, self: true };
      TicketService.addChatMessage(ticket.id, newMsg);
      const container = document.getElementById('chat-messages');
      if (container) {
        container.appendChild(renderChatMessage(newMsg));
        container.scrollTop = container.scrollHeight;
      }
      chatInput.value = '';
    }
  }});
  sendBtn.appendChild(icon('send'));
  chatInputArea.appendChild(chatInput);
  chatInputArea.appendChild(sendBtn);

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendBtn.click();
  });

  chatCard.appendChild(chatInputArea);
  bentoRow.appendChild(chatCard);
  leftCol.appendChild(bentoRow);

  // Timeline
  const timelineCard = el('div', { className: 'card p-lg' });
  timelineCard.appendChild(el('h3', { className: 'text-headline-md mb-lg flex items-center gap-sm' }, [icon('history'), document.createTextNode(' Histórico do Atendimento')]));
  const timeline = el('div', { className: 'timeline' });
  const dotColors = ['var(--color-primary-container)', 'var(--color-secondary-container)', 'var(--color-tertiary-container)'];
  const dotTextColors = ['var(--color-on-primary)', 'var(--color-on-secondary)', 'var(--color-on-tertiary)'];
  
  ticket.historico.forEach((item, i) => {
    const timeItem = el('div', { className: 'timeline-item' });
    const dot = el('div', { className: 'timeline-dot', style: { background: dotColors[i % 3] } });
    const dotIcon = icon(item.icone || 'history', 'icon-xs');
    dotIcon.style.color = dotTextColors[i % 3];
    dot.appendChild(dotIcon);
    timeItem.appendChild(dot);
    timeItem.appendChild(el('div', { className: 'timeline-content' }, [
      el('div', {}, [
        el('p', { className: 'font-bold color-surface' }, item.titulo),
        el('p', { className: 'text-body-md color-muted', style: { fontSize: '13px', marginTop: '2px' } }, item.desc)
      ]),
      el('span', { className: 'text-mono-sm color-muted' }, item.hora)
    ]));
    timeline.appendChild(timeItem);
  });
  
  timelineCard.appendChild(timeline);
  leftCol.appendChild(timelineCard);
  grid.appendChild(leftCol);

  // Right column
  const rightCol = el('div', { className: 'flex flex-col gap-lg' });

  // Technician card
  const techCard = el('div', { className: 'card' });
  techCard.appendChild(el('h4', { className: 'text-label-md color-muted mb-md', style: { textTransform: 'uppercase', letterSpacing: '0.1em' } }, 'Responsável'));
  
  if (ticket.tecnico) {
    const techInfo = el('div', { className: 'flex items-center gap-md' });
    const techImgWrap = el('div', { className: 'relative' });
    if (ticket.tecnicoImg) {
      techImgWrap.appendChild(el('img', { className: 'tech-card-avatar', style: { width: '64px', height: '64px', borderRadius: 'var(--radius-xl)', border: '2px solid var(--color-primary)' }, src: ticket.tecnicoImg, alt: ticket.tecnico }));
    } else {
      const placeholder = el('div', { style: { width: '64px', height: '64px', borderRadius: 'var(--radius-xl)', background: 'var(--color-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', color: 'var(--color-primary-fixed)', border: '2px solid var(--color-primary)' } }, ticket.tecnico.split(' ').map(n => n[0]).join(''));
      techImgWrap.appendChild(placeholder);
    }
    const statusDot = el('span', { style: { position: 'absolute', bottom: '-2px', right: '-2px', width: '16px', height: '16px', background: 'var(--status-online)', borderRadius: '50%', border: '2px solid var(--color-surface-container)' } });
    techImgWrap.appendChild(statusDot);
    techInfo.appendChild(techImgWrap);
    
    const techDetails = el('div');
    techDetails.appendChild(el('p', { className: 'font-bold', style: { fontSize: '16px' } }, ticket.tecnico));
    techDetails.appendChild(el('p', { className: 'color-muted', style: { fontSize: '13px' } }, ticket.tecnicoEsp || 'Especialista'));
    
    const contactBtns = el('div', { className: 'flex gap-sm', style: { marginTop: '8px' } });
    contactBtns.appendChild(el('button', { className: 'btn btn-secondary', style: { padding: '6px' }, onClick: () => alert('Ligando para ' + ticket.tecnico) }, [icon('call', 'icon-sm')]));
    contactBtns.appendChild(el('button', { className: 'btn btn-secondary', style: { padding: '6px' }, onClick: () => alert('E-mail enviado para o técnico.') }, [icon('mail', 'icon-sm')]));
    techDetails.appendChild(contactBtns);
    
    techInfo.appendChild(techDetails);
    techCard.appendChild(techInfo);
  } else {
    techCard.appendChild(el('div', { className: 'text-center py-md' }, [
      el('p', { className: 'color-muted mb-md', style: 'font-style: italic;' }, 'Sem técnico atribuído.'),
      el('button', { 
        className: 'btn btn-outline w-full',
        onClick: () => {
          const techs = TicketService.getTecnicos();
          if (techs.length > 0) {
            TicketService.updateTicket(ticket.id, { 
              tecnico: techs[0].nome, 
              tecnicoEsp: techs[0].area,
              tecnicoImg: ''
            });
            handleRoute();
          }
        }
      }, 'Atribuir Técnico de Plantão')
    ]));
  }
  rightCol.appendChild(techCard);

  // Attachments
  const attachCard = el('div', { className: 'card' });
  attachCard.appendChild(el('div', { className: 'flex items-center justify-between mb-md' }, [
    el('h4', { className: 'text-label-md color-muted', style: { textTransform: 'uppercase', letterSpacing: '0.1em' } }, `Anexos (${ticket.anexos.length})`),
    el('button', { className: 'btn-ghost flex items-center gap-xs', onClick: () => alert('Upload simulado.') }, [icon('add', 'icon-sm'), document.createTextNode(' Adicionar')])
  ]));
  
  const attachList = el('div', { className: 'flex flex-col gap-sm' });
  ticket.anexos.forEach(a => {
    attachList.appendChild(el('div', { className: 'attachment-item' }, [
      icon(a.icone || 'description'),
      el('div', { className: 'attachment-info' }, [
        el('p', { className: 'attachment-name' }, a.nome),
        el('p', { className: 'attachment-meta' }, a.tamanho + ' • ' + a.tipo)
      ]),
      icon('download')
    ]));
  });
  if (ticket.anexos.length === 0) {
    attachList.appendChild(el('p', { className: 'color-muted', style: { fontStyle: 'italic', fontSize: '13px' } }, 'Nenhum anexo adicionado.'));
  }
  attachCard.appendChild(attachList);
  rightCol.appendChild(attachCard);

  // Properties
  const propsCard = el('div', { className: 'card' });
  propsCard.appendChild(el('h4', { className: 'text-label-md color-muted mb-md', style: { textTransform: 'uppercase', letterSpacing: '0.1em' } }, 'Propriedades'));
  
  const propsGrid = el('div', { className: 'props-grid' });
  const props = [
    ['Departamento', ticket.departamento],
    ['Prioridade', PRIORIDADE_MAP[ticket.prioridade].label],
    ['Criado em', ticket.dataCriacao],
    ['Categoria', ticket.catHardware]
  ];
  props.forEach(([lbl, val]) => {
    const item = el('div', { className: 'prop-item' });
    item.appendChild(el('span', { className: 'prop-label' }, lbl));
    const vEl = el('span', { className: 'prop-value' }, val);
    if (lbl === 'Prioridade' && ticket.prioridade === 'critica') vEl.style.color = 'var(--color-error-bright)';
    item.appendChild(vEl);
    propsGrid.appendChild(item);
  });
  propsCard.appendChild(propsGrid);
  rightCol.appendChild(propsCard);

  grid.appendChild(rightCol);
  page.appendChild(grid);
  
  // Rolar chat para o final
  setTimeout(() => {
    const container = document.getElementById('chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
  }, 100);

  return page;
}

function renderChatMessage(msg) {
  return el('div', { className: 'chat-msg' + (msg.self ? ' self' : '') }, [
    el('span', { className: 'chat-msg-author' }, msg.autor + ' • ' + msg.hora),
    el('div', { className: 'chat-msg-bubble' }, msg.texto)
  ]);
}

// ─── PAGE 5: AGENDA TÉCNICA ─────────────────────────────────

function renderAgenda() {
  const page = el('div', { className: 'page-enter' });
  const scheduleTechs = TicketService.getScheduleTechs();
  const availableTechs = TicketService.getAvailableTechs();

  // Header
  const header = el('div', { className: 'flex items-center justify-between mb-lg', style: { flexWrap: 'wrap', gap: '16px' } });

  const headerLeft = el('div');
  headerLeft.appendChild(el('h3', { className: 'text-headline-lg color-surface mb-xs' }, 'Agenda da Equipe Técnica'));
  
  const dateRow = el('div', { className: 'flex items-center gap-sm' });
  dateRow.appendChild(el('span', { className: 'text-label-md color-muted' }, new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })));
  
  const viewToggle = el('div', { className: 'flex', style: { background: 'var(--color-surface-container)', borderRadius: 'var(--radius-lg)', padding: '2px', border: '1px solid var(--color-outline-variant)' } });
  ['Dia', 'Semana', 'Mês'].forEach((v, i) => {
    viewToggle.appendChild(el('button', { className: 'btn', style: i === 0 ? 'background:var(--color-primary-container);color:var(--color-primary-fixed);padding:4px 12px;border-radius:var(--radius-md);' : 'padding:4px 12px;color:var(--color-on-surface-variant);' }, v));
  });
  dateRow.appendChild(viewToggle);
  headerLeft.appendChild(dateRow);
  header.appendChild(headerLeft);

  const headerRight = el('div', { className: 'flex items-center gap-md' });
  const legendDiv = el('div', { className: 'flex items-center gap-lg', style: { paddingRight: '16px', borderRight: '1px solid rgba(68,71,76,0.3)' } });
  [
    { color: 'var(--color-tertiary)', label: 'Viagem' },
    { color: 'var(--color-primary)', label: 'Em Andamento' },
    { color: 'var(--color-secondary)', label: 'Concluído' }
  ].forEach(l => {
    legendDiv.appendChild(el('div', { className: 'flex items-center gap-sm' }, [
      el('span', { style: 'width:12px;height:12px;border-radius:50%;background:' + l.color + ';display:inline-block;' }),
      el('span', { className: 'text-label-md color-muted', style: 'text-transform:uppercase; font-size:10px;' }, l.label)
    ]));
  });
  headerRight.appendChild(legendDiv);
  headerRight.appendChild(el('button', { className: 'btn btn-secondary', onClick: () => alert('Filtro de agenda.') }, [icon('filter_list', 'icon-sm'), document.createTextNode(' Filtros')]));
  header.appendChild(headerRight);
  page.appendChild(header);

  // Main grid: 9col timeline + 3col sidebar
  const mainGrid = el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-lg)', minHeight: 'calc(100vh - 240px)' } });

  // Timeline
  const timelineCard = el('div', { className: 'card', style: { padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' } });

  // Hours header
  const hoursHeader = el('div', { style: { display: 'grid', gridTemplateColumns: '180px 1fr', borderBottom: '1px solid var(--color-outline-variant)', background: 'var(--color-surface-container-low)', position: 'sticky', top: '0', zIndex: '5' } });
  hoursHeader.appendChild(el('div', { className: 'text-label-md color-muted', style: { padding: '12px 16px', borderRight: '1px solid var(--color-outline-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, 'TÉCNICO'));

  const hoursScroll = el('div', { className: 'flex overflow-x-auto' });
  for (let h = 8; h <= 20; h++) {
    hoursScroll.appendChild(el('div', { className: 'schedule-hour-mark' }, String(h).padStart(2, '0') + ':00'));
  }
  hoursHeader.appendChild(hoursScroll);
  timelineCard.appendChild(hoursHeader);

  // Rows
  const rowsContainer = el('div', { className: 'flex-1 overflow-y-auto', style: { position: 'relative' } });

  scheduleTechs.forEach(tech => {
    const row = el('div', { style: { display: 'grid', gridTemplateColumns: '180px 1fr', borderBottom: '1px solid rgba(68,71,76,0.3)' } });

    // Tech info
    const techCell = el('div', { className: 'flex items-center gap-sm', style: { padding: '16px', borderRight: '1px solid var(--color-outline-variant)' } });
    techCell.appendChild(el('img', { className: 'schedule-tech-avatar', src: tech.img, alt: tech.nome }));
    const techInfo = el('div', { style: { minWidth: '0' } });
    techInfo.appendChild(el('p', { className: 'text-label-md color-surface truncate' }, tech.nome));
    techInfo.appendChild(el('p', { className: 'text-mono-sm color-muted', style: { fontSize: '10px', textTransform: 'uppercase' } }, tech.nivel));
    techCell.appendChild(techInfo);
    row.appendChild(techCell);

    // Tasks
    const taskArea = el('div', { style: { position: 'relative', height: '64px', minWidth: (13 * 100) + 'px' } });
    tech.tasks.forEach(task => {
      const typeMap = { ongoing: 'ongoing', completed: 'completed', travel: 'travel' };
      const block = el('div', { className: 'schedule-task-block ' + (typeMap[task.tipo] || 'ongoing'), style: { left: task.left, width: task.width } });
      const titleColor = task.tipo === 'ongoing' ? 'var(--color-primary-fixed)' : task.tipo === 'travel' ? 'var(--color-tertiary-fixed)' : 'var(--color-on-surface)';
      block.appendChild(el('p', { className: 'schedule-task-title', style: { color: titleColor } }, task.titulo));
      if (task.sub) block.appendChild(el('p', { className: 'schedule-task-sub' }, task.sub));
      taskArea.appendChild(block);
    });

    if (tech.tasks.length === 0) {
      taskArea.appendChild(el('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: '0.2' } },
        el('span', { style: { fontSize: '10px', fontStyle: 'italic', color: 'var(--color-outline)' } }, 'Sem tarefas agendadas para hoje')
      ));
    }

    row.appendChild(taskArea);
    rowsContainer.appendChild(row);
  });

  // Current time line indicator
  const now = new Date();
  const hrs = now.getHours();
  const mins = now.getMinutes();
  if (hrs >= 8 && hrs <= 20) {
    const offset = (hrs - 8) * 100 + (mins / 60) * 100 + 180;
    const timeLine = el('div', { className: 'time-indicator', style: { left: offset + 'px' } });
    timeLine.appendChild(el('div', { className: 'time-indicator-dot' }));
    rowsContainer.appendChild(timeLine);
  }

  timelineCard.appendChild(rowsContainer);
  mainGrid.appendChild(timelineCard);

  // Right sidebar: Disponíveis
  const rightSidebar = el('div', { className: 'flex flex-col gap-lg' });
  const availCard = el('div', { className: 'card flex flex-col', style: { flex: '1', overflow: 'hidden' } });
  
  availCard.appendChild(el('div', { className: 'flex items-center justify-between mb-md' }, [
    el('h4', { className: 'text-headline-md color-surface' }, 'Disponíveis'),
    el('span', { className: 'text-mono-sm', style: { background: 'rgba(183,200,222,0.2)', color: 'var(--color-primary-fixed)', padding: '2px 8px', borderRadius: 'var(--radius-default)' } }, `${availableTechs.length} Online`)
  ]));

  const techList = el('div', { className: 'flex flex-col gap-md overflow-y-auto', style: { flex: '1', paddingRight: '4px' } });
  
  availableTechs.forEach(tech => {
    const tCard = el('div', { className: 'tech-card' });
    tCard.appendChild(el('div', { className: 'tech-card-header' }, [
      el('img', { className: 'tech-card-avatar', src: tech.img, alt: tech.nome }),
      el('div', {}, [
        el('p', { className: 'text-label-md color-surface' }, tech.nome),
        el('span', { style: 'font-size:10px; padding:2px 6px; background:var(--color-secondary-container); color:var(--color-on-secondary-container); border-radius:var(--radius-default); text-transform:uppercase;' }, tech.nivel)
      ])
    ]));

    const skills = el('div', { className: 'tech-card-skills' });
    tech.skills.forEach(s => skills.appendChild(el('span', { className: 'tech-skill-tag' }, s)));
    tCard.appendChild(skills);

    tCard.appendChild(el('div', { className: 'tech-card-footer' }, [
      el('span', { className: 'flex items-center gap-xs', style: { fontSize: '11px', color: 'var(--color-on-surface-variant)' } }, [icon('distance', 'icon-xs'), document.createTextNode(' ' + tech.distancia)]),
      el('button', { 
        className: 'topbar-icon-btn', 
        style: { color: 'var(--color-primary)' },
        onClick: () => {
          alert(`Técnico ${tech.nome} alocado para despacho.`);
          TicketService.addLog(`Despachou o técnico ${tech.nome}`, 'Ricardo Silva');
        }
      }, [icon('add_task')])
    ]));

    techList.appendChild(tCard);
  });
  availCard.appendChild(techList);
  rightSidebar.appendChild(availCard);

  // Drop zone
  const dropZone = el('div', { className: 'card', style: { borderStyle: 'dashed', borderColor: 'var(--color-outline)', textAlign: 'center' } }, [
    el('p', { className: 'text-label-md color-muted mb-sm' }, 'Arraste um ticket não atribuído aqui'),
    el('div', { className: 'flex items-center justify-center', style: { height: '64px', background: 'var(--color-surface-container)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-outline-variant)' } }, [
      icon('move_to_inbox', 'color-muted')
    ])
  ]);
  rightSidebar.appendChild(dropZone);

  mainGrid.appendChild(rightSidebar);
  page.appendChild(mainGrid);
  return page;
}

// ─── PAGE 6: RELATÓRIOS & ANALYTICS ─────────────────────────

function renderRelatorios() {
  const page = el('div', { className: 'page-enter' });

  // Header
  page.appendChild(el('div', { className: 'flex justify-between items-end mb-lg', style: { flexWrap: 'wrap', gap: '16px' } }, [
    el('div', {}, [
      el('h3', { className: 'text-headline-lg color-surface' }, 'Relatórios & Analytics'),
      el('p', { className: 'color-muted', style: { marginTop: '4px' } }, 'Métricas de desempenho em tempo real para o suporte enterprise.')
    ]),
    el('div', { className: 'flex gap-sm' }, [
      el('button', { className: 'btn btn-secondary', onClick: () => alert('Filtro por período.') }, [icon('calendar_today', 'icon-sm'), document.createTextNode(' Últimos 30 dias')]),
      el('button', { className: 'btn btn-primary', onClick: () => {
        alert('Relatório gerado em PDF com sucesso!');
        TicketService.addLog('Exportou relatório operacional em PDF', 'Ricardo Silva');
      } }, [icon('download', 'icon-sm'), document.createTextNode(' Exportar PDF')])
    ])
  ]));

  // KPI cards
  const kpis = el('div', { className: 'stat-grid' }, [
    statCard('confirmation_number', 'Total de Tickets', '1.284', '12.5% vs mês anterior', 'up-good', 'var(--color-primary-fixed)', 'var(--color-primary-fixed)'),
    statCard('timer', 'Tempo Médio Resolução', '4h 12m', '8% de melhoria', 'down-good', 'var(--color-secondary)', 'var(--color-secondary)'),
    statCard('warning', 'Violações de SLA', '14', '2 a mais que ontem', 'up-bad', 'var(--color-error-bright)', 'var(--color-error-bright)'),
    statCard('sentiment_very_satisfied', 'Score CSAT', '4.8/5', 'Baseado em 452 pesquisas', '', 'var(--color-tertiary-fixed-dim)', 'var(--color-tertiary-fixed-dim)')
  ]);
  page.appendChild(kpis);

  // Charts row
  const chartsRow = el('div', { className: 'bento-grid bento-8-4 mb-lg' });

  // Monthly trends
  const trendsCard = el('div', { className: 'card card-glass p-lg flex flex-col' });
  trendsCard.appendChild(el('div', { className: 'flex justify-between items-center mb-lg' }, [
    el('h4', { className: 'text-headline-md color-surface' }, 'Tendências Mensais de Tickets'),
    el('div', { className: 'flex items-center gap-md' }, [
      el('div', { className: 'flex items-center gap-sm' }, [
        el('div', { style: { width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-primary-fixed)' } }),
        el('span', { style: { fontSize: '12px', color: 'var(--color-on-surface-variant)' } }, 'Recebidos')
      ]),
      el('div', { className: 'flex items-center gap-sm' }, [
        el('div', { style: { width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-secondary)' } }),
        el('span', { style: { fontSize: '12px', color: 'var(--color-on-surface-variant)' } }, 'Resolvidos')
      ])
    ])
  ]));

  const monthData = [
    { label: 'JAN', v1: 60, v2: 50 }, { label: 'FEV', v1: 75, v2: 65 },
    { label: 'MAR', v1: 90, v2: 85 }, { label: 'ABR', v1: 70, v2: 72 },
    { label: 'MAI', v1: 55, v2: 50 }, { label: 'JUN', v1: 82, v2: 78 }
  ];

  const trendBars = el('div', { className: 'bar-chart', style: { flex: '1', minHeight: '250px' } });
  monthData.forEach(d => {
    const col = el('div', { className: 'bar-chart-column' });
    const wrapper = el('div', { className: 'bar-wrapper', style: { height: '100%', alignItems: 'flex-end' } });
    wrapper.appendChild(el('div', { className: 'bar', style: { background: 'rgba(210,228,251,0.4)', height: d.v1 + '%' } }));
    wrapper.appendChild(el('div', { className: 'bar', style: { background: 'rgba(183,200,225,0.4)', height: d.v2 + '%' } }));
    col.appendChild(wrapper);
    col.appendChild(el('span', { className: 'bar-label' }, d.label));
    trendBars.appendChild(col);
  });
  trendsCard.appendChild(trendBars);
  chartsRow.appendChild(trendsCard);

  // SLA Donut
  const slaCard = el('div', { className: 'card card-glass p-lg flex flex-col' });
  slaCard.appendChild(el('h4', { className: 'text-headline-md color-surface mb-lg' }, 'Performance de SLA'));

  const donutWrap = el('div', { className: 'donut-chart', style: { flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' } });
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '192');
  svg.setAttribute('height', '192');
  svg.setAttribute('style', 'transform: rotate(-90deg)');

  const bgCircle = document.createElementNS(svgNS, 'circle');
  bgCircle.setAttribute('cx', '96'); bgCircle.setAttribute('cy', '96'); bgCircle.setAttribute('r', '80');
  bgCircle.setAttribute('fill', 'transparent'); bgCircle.setAttribute('stroke', 'rgba(26,43,60,0.3)'); bgCircle.setAttribute('stroke-width', '20');
  svg.appendChild(bgCircle);

  const mainCircle = document.createElementNS(svgNS, 'circle');
  mainCircle.setAttribute('cx', '96'); mainCircle.setAttribute('cy', '96'); mainCircle.setAttribute('r', '80');
  mainCircle.setAttribute('fill', 'transparent'); mainCircle.setAttribute('stroke', 'var(--color-primary-fixed)');
  mainCircle.setAttribute('stroke-width', '20'); mainCircle.setAttribute('stroke-dasharray', '502'); mainCircle.setAttribute('stroke-dashoffset', '100');
  mainCircle.setAttribute('stroke-linecap', 'round');
  svg.appendChild(mainCircle);

  const errCircle = document.createElementNS(svgNS, 'circle');
  errCircle.setAttribute('cx', '96'); errCircle.setAttribute('cy', '96'); errCircle.setAttribute('r', '80');
  errCircle.setAttribute('fill', 'transparent'); errCircle.setAttribute('stroke', 'var(--color-error-bright)');
  errCircle.setAttribute('stroke-width', '20'); errCircle.setAttribute('stroke-dasharray', '502'); errCircle.setAttribute('stroke-dashoffset', '462');
  svg.appendChild(errCircle);

  donutWrap.appendChild(svg);
  donutWrap.appendChild(el('div', { className: 'donut-center' }, [
    el('div', { className: 'donut-value' }, '92%'),
    el('div', { className: 'donut-label' }, 'Dentro do SLA')
  ]));
  slaCard.appendChild(donutWrap);

  const legend = el('div', { className: 'flex flex-col gap-sm', style: { marginTop: '16px' } });
  legend.appendChild(el('div', { className: 'flex justify-between items-center text-body-md' }, [
    el('div', { className: 'flex items-center gap-sm' }, [el('span', { className: 'status-dot online' }), el('span', { className: 'color-surface' }, 'Dentro do SLA')]),
    el('span', { className: 'color-muted' }, '1.180')
  ]));
  legend.appendChild(el('div', { className: 'flex justify-between items-center text-body-md' }, [
    el('div', { className: 'flex items-center gap-sm' }, [el('span', { className: 'status-dot busy' }), el('span', { className: 'color-surface' }, 'Fora do SLA')]),
    el('span', { className: 'color-muted' }, '104')
  ]));
  slaCard.appendChild(legend);
  chartsRow.appendChild(slaCard);
  page.appendChild(chartsRow);

  // Lower row: Categories + Productivity
  const lowerRow = el('div', { className: 'bento-grid bento-1-2' });

  // Categories
  const catCard = el('div', { className: 'card card-glass p-lg' });
  catCard.appendChild(el('h4', { className: 'text-headline-md color-surface mb-lg' }, 'Tickets por Categoria'));
  const catData = [
    { label: 'Falha de Hardware', pct: 42, color: 'var(--color-primary-fixed)' },
    { label: 'Software & Cloud', pct: 31, color: 'var(--color-secondary)' },
    { label: 'Segurança/Acesso', pct: 18, color: 'var(--color-tertiary-fixed-dim)' },
    { label: 'Conectividade de Rede', pct: 9, color: 'var(--color-outline)' }
  ];
  const catBars = el('div', { className: 'flex flex-col gap-md' });
  catData.forEach(c => {
    const bar = el('div', { className: 'progress-bar-container' });
    bar.appendChild(el('div', { className: 'progress-bar-header' }, [el('span', {}, c.label), el('span', {}, c.pct + '%')]));
    const track = el('div', { className: 'progress-bar-track' });
    track.appendChild(el('div', { className: 'progress-bar-fill', style: { width: c.pct + '%', background: c.color } }));
    bar.appendChild(track);
    catBars.appendChild(bar);
  });
  catCard.appendChild(catBars);
  lowerRow.appendChild(catCard);

  // Productivity table
  const prodCard = el('div', { className: 'card card-glass p-lg' });
  prodCard.appendChild(el('div', { className: 'flex justify-between items-center mb-lg' }, [
    el('h4', { className: 'text-headline-md color-surface' }, 'Produtividade dos Técnicos'),
    el('button', { className: 'btn-ghost', onClick: () => alert('Lista completa de produtividade.') }, 'Ver Todos')
  ]));

  const prodTable = el('table', { className: 'data-table', style: { background: 'transparent' } });
  const prodHead = el('thead');
  const prodHeadRow = el('tr', { style: { borderBottom: '1px solid rgba(68,71,76,0.3)' } });
  ['Técnico', 'Fechados', 'Tempo Médio', 'CSAT', 'Status'].forEach((h, i) => {
    prodHeadRow.appendChild(el('th', { className: i === 4 ? 'text-right' : '', style: { padding: '0 0 16px 0' } }, h));
  });
  prodHead.appendChild(prodHeadRow);
  prodTable.appendChild(prodHead);

  const prodBody = el('tbody');
  const techProd = [
    { iniciais: 'AK', nome: 'Alex Kim', fechados: '142', tempo: '2h 45m', csat: '4.9/5', status: 'TOP PERFORMER', statusCss: 'background: rgba(16,185,129,0.15); color: #6ee7b7;' },
    { iniciais: 'SR', nome: 'Sarah Russo', fechados: '128', tempo: '3h 10m', csat: '4.7/5', status: 'ATIVO', statusCss: 'background: var(--color-primary-container); color: var(--color-primary-fixed);' },
    { iniciais: 'MJ', nome: 'Marcus Johnson', fechados: '96', tempo: '4h 50m', csat: '4.5/5', status: 'ATIVO', statusCss: 'background: var(--color-primary-container); color: var(--color-primary-fixed);' },
    { iniciais: 'EL', nome: 'Elena Lopez', fechados: '114', tempo: '3h 55m', csat: '4.8/5', status: 'ATIVO', statusCss: 'background: var(--color-primary-container); color: var(--color-primary-fixed);' }
  ];
  techProd.forEach(t => {
    const row = el('tr', { style: { borderBottom: '1px solid rgba(68,71,76,0.1)' } });
    const nameCell = el('td', { className: 'flex items-center gap-sm', style: { padding: '16px 0' } });
    nameCell.appendChild(el('div', { style: { width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--color-primary-fixed)' } }, t.iniciais));
    nameCell.appendChild(el('span', { className: 'color-surface' }, t.nome));
    row.appendChild(nameCell);
    row.appendChild(el('td', { className: 'color-muted', style: { padding: '16px 0' } }, t.fechados));
    row.appendChild(el('td', { className: 'color-muted', style: { padding: '16px 0' } }, t.tempo));
    row.appendChild(el('td', { className: 'color-muted', style: { padding: '16px 0' } }, t.csat));
    const statusCell = el('td', { className: 'text-right', style: { padding: '16px 0' } });
    statusCell.appendChild(el('span', { style: 'display:inline-block; padding:4px 8px; border-radius:9999px; font-size:11px; font-weight:700; text-transform:uppercase; ' + t.statusCss }, t.status));
    row.appendChild(statusCell);
    prodBody.appendChild(row);
  });
  prodTable.appendChild(prodBody);
  prodCard.appendChild(el('div', { className: 'overflow-x-auto' }, [prodTable]));
  lowerRow.appendChild(prodCard);
  page.appendChild(lowerRow);

  return page;
}

// ─── PAGE 7: NÚCLEO ADMINISTRATIVO ──────────────────────────

function renderAdministracao() {
  const page = el('div', { className: 'page-enter' });
  const logs = TicketService.getLogs();
  const tecnicos = TicketService.getTecnicos();

  // Header
  page.appendChild(el('div', { className: 'mb-lg' }, [
    el('h2', { className: 'text-headline-lg color-surface' }, 'Núcleo Administrativo'),
    el('p', { className: 'color-muted', style: { marginTop: '4px' } }, 'Gerenciamento de usuários, escala de técnicos e log de auditoria de segurança.')
  ]));

  // Abas Administrativas
  const tabs = el('div', { className: 'flex mb-lg', style: { borderBottom: '1px solid var(--color-outline-variant)', gap: '24px' } });
  
  const tabBtn = (id, label, iconName) => {
    const isActive = state.activeAdminTab === id;
    return el('button', {
      style: `padding: 12px 4px; font-weight: 600; display:flex; align-items:center; gap:8px; border-bottom: 2px solid ${isActive ? 'var(--color-primary)' : 'transparent'}; color: ${isActive ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)'}; cursor:pointer;`,
      onClick: () => {
        state.activeAdminTab = id;
        handleRoute();
      }
    }, [icon(iconName, 'icon-sm'), document.createTextNode(label)]);
  };

  tabs.appendChild(tabBtn('usuarios', 'Usuários e Perfis', 'group'));
  tabs.appendChild(tabBtn('tecnicos', 'Equipe Técnica', 'engineering'));
  tabs.appendChild(tabBtn('auditoria', 'Auditoria de Ações', 'receipt_long'));
  page.appendChild(tabs);

  // Render do conteúdo dinâmico conforme a aba
  const container = el('div', { className: 'card p-lg' });

  if (state.activeAdminTab === 'usuarios') {
    container.appendChild(el('h3', { className: 'text-headline-md mb-md' }, 'Usuários Cadastrados'));
    
    const usersTable = el('table', { className: 'data-table', style: { background: 'transparent' } }, [
      el('thead', {}, [
        el('tr', {}, [
          el('th', {}, 'Nome'),
          el('th', {}, 'Email'),
          el('th', {}, 'Perfil de Acesso'),
          el('th', {}, 'Status'),
          el('th', { className: 'text-right' }, 'Ação')
        ])
      ]),
      el('tbody', {}, [
        renderUserRow('Ricardo Silva', 'ricardo.silva@empresa.com', 'Administrador Nível 3', 'Ativo'),
        renderUserRow('Ana Paula', 'ana.paula@empresa.com', 'Solicitante Geral', 'Ativo'),
        renderUserRow('Carlos Eduardo', 'carlos.eduardo@empresa.com', 'Técnico Residente L2', 'Em campo'),
        renderUserRow('Juliana Santos', 'juliana.santos@empresa.com', 'Técnico Nível 1', 'Offline')
      ])
    ]);
    container.appendChild(el('div', { className: 'overflow-x-auto' }, [usersTable]));
  } 
  
  else if (state.activeAdminTab === 'tecnicos') {
    container.appendChild(el('h3', { className: 'text-headline-md mb-md' }, 'Status da Equipe de Plantão'));
    
    const techsTable = el('table', { className: 'data-table', style: { background: 'transparent' } }, [
      el('thead', {}, [
        el('tr', {}, [
          el('th', {}, 'Nome'),
          el('th', {}, 'Área de Atuação'),
          el('th', {}, 'Status de Plantão'),
          el('th', { className: 'text-right' }, 'Ação')
        ])
      ]),
      el('tbody', {}, tecnicos.map(tech => {
        const statusColors = {
          online: 'background: rgba(16,185,129,0.15); color: #6ee7b7;',
          busy: 'background: rgba(239,68,68,0.15); color: var(--color-error-bright);',
          offline: 'background: var(--color-surface-container-high); color: var(--color-outline);'
        };
        return el('tr', {}, [
          el('td', { className: 'font-semibold color-surface' }, tech.nome),
          el('td', { className: 'color-muted' }, tech.area),
          el('td', {}, [
            el('span', { style: 'display:inline-block; padding:4px 8px; border-radius:9999px; font-size:11px; font-weight:700; text-transform:uppercase; ' + (statusColors[tech.status] || '') }, tech.status)
          ]),
          el('td', { className: 'text-right' }, [
            el('button', { className: 'btn btn-secondary', onClick: () => alert(`Gerenciamento do técnico ${tech.nome}`) }, 'Editar Skills')
          ])
        ]);
      }))
    ]);
    container.appendChild(el('div', { className: 'overflow-x-auto' }, [techsTable]));
  } 
  
  else if (state.activeAdminTab === 'auditoria') {
    container.appendChild(el('h3', { className: 'text-headline-md mb-md' }, 'Logs de Segurança e Ações'));
    
    const logsList = el('div', { className: 'flex flex-col gap-sm', style: { maxHeight: '450px', overflowY: 'auto' } });
    
    logs.forEach(log => {
      logsList.appendChild(el('div', { 
        style: 'padding: 12px; border: 1px solid var(--color-outline-variant); border-radius: var(--radius-lg); display:flex; justify-content:space-between; align-items:center; background: var(--color-surface-container-low);' 
      }, [
        el('div', {}, [
          el('span', { className: 'font-semibold color-surface', style: 'font-size: 13px;' }, log.usuario),
          el('p', { className: 'color-muted', style: 'font-size:13px; margin-top:2px;' }, log.acao)
        ]),
        el('span', { className: 'text-mono-sm color-muted', style: 'font-size:11px;' }, log.data)
      ]));
    });

    if (logs.length === 0) {
      logsList.appendChild(el('p', { className: 'color-muted', style: 'font-style:italic; padding:20px; text-align:center;' }, 'Nenhum log gravado.'));
    }

    container.appendChild(logsList);
  }

  page.appendChild(container);
  return page;
}

function renderUserRow(nome, email, perfil, status) {
  const statusColors = status === 'Ativo' || status === 'Em campo' 
    ? 'background: rgba(16,185,129,0.15); color: #6ee7b7;' 
    : 'background: var(--color-surface-container-high); color: var(--color-outline);';
  return el('tr', {}, [
    el('td', { className: 'font-semibold color-surface' }, nome),
    el('td', { className: 'color-muted' }, email),
    el('td', { className: 'color-surface font-semibold' }, perfil),
    el('td', {}, [
      el('span', { style: 'display:inline-block; padding:4px 8px; border-radius:9999px; font-size:11px; font-weight:700; text-transform:uppercase; ' + statusColors }, status)
    ]),
    el('td', { className: 'text-right' }, [
      el('button', { className: 'btn btn-secondary', onClick: () => alert(`Permissões de ${nome}`) }, 'Configurar')
    ])
  ]);
}

// ─── PAGE 8: CONFIGURAÇÕES ──────────────────────────────────

function renderConfiguracoes() {
  const page = el('div', { className: 'page-enter' });
  const currentTheme = TicketService.getTheme();

  // Header
  page.appendChild(el('div', { className: 'mb-lg' }, [
    el('h2', { className: 'text-headline-lg color-surface' }, 'Configurações do Portal'),
    el('p', { className: 'color-muted', style: { marginTop: '4px' } }, 'Gerencie as preferências visuais, notificações e conexões da plataforma.')
  ]));

  const configBox = el('div', { className: 'card p-lg flex flex-col gap-lg' });

  // Seção de Tema
  configBox.appendChild(el('div', { style: 'border-bottom: 1px solid var(--color-outline-variant); padding-bottom: 16px;' }, [
    el('h4', { className: 'text-headline-md color-surface mb-xs' }, 'Tema da Interface'),
    el('p', { className: 'color-muted mb-md', style: 'font-size:13px;' }, 'Selecione a paleta visual de sua preferência para as telas do portal.'),
    el('div', { className: 'flex gap-md' }, [
      el('button', {
        className: 'btn ' + (currentTheme === 'dark' ? 'btn-primary' : 'btn-secondary'),
        style: 'flex:1; justify-content:center; padding: 12px;',
        onClick: () => {
          TicketService.setTheme('dark');
          handleRoute();
        }
      }, [icon('dark_mode'), document.createTextNode(' Modo Escuro (Padrão)')]),
      el('button', {
        className: 'btn ' + (currentTheme === 'light' ? 'btn-primary' : 'btn-secondary'),
        style: 'flex:1; justify-content:center; padding: 12px;',
        onClick: () => {
          TicketService.setTheme('light');
          handleRoute();
        }
      }, [icon('light_mode'), document.createTextNode(' Modo Claro')])
    ])
  ]));

  // Preferências
  configBox.appendChild(el('div', { style: 'border-bottom: 1px solid var(--color-outline-variant); padding-bottom: 16px;' }, [
    el('h4', { className: 'text-headline-md color-surface mb-xs' }, 'Preferências Operacionais'),
    el('div', { className: 'flex flex-col gap-md', style: 'margin-top: 16px;' }, [
      renderPreferenceItem('Notificações no Navegador', 'Receber notificações push instantâneas sobre novos chamados críticos.', true),
      renderPreferenceItem('Som de Alerta SLA', 'Tocar alerta sonoro discreto ao aproximar do vencimento de SLA.', false),
      renderPreferenceItem('E-mail Diário', 'Enviar boletim diário consolidado das ações executadas.', true)
    ])
  ]));

  // Detalhes técnicos
  configBox.appendChild(el('div', {}, [
    el('h4', { className: 'text-headline-md color-surface mb-xs' }, 'Conexões & Integrações'),
    el('p', { className: 'color-muted mb-md', style: 'font-size:13px;' }, 'Status de conexões com APIs corporativas (simulado).'),
    el('div', { style: 'padding:12px; background:var(--color-surface-container-low); border: 1px solid var(--color-outline-variant); border-radius: var(--radius-lg); display:flex; justify-content:space-between; align-items:center;' }, [
      el('div', { className: 'flex items-center gap-sm' }, [
        el('span', { className: 'status-dot online' }),
        el('span', { className: 'font-semibold color-surface', style: 'font-size: 13px;' }, 'Conexão Supabase / API')
      ]),
      el('span', { className: 'text-label-md', style: 'color: var(--status-online);' }, 'ONLINE (MOCK)')
    ])
  ]));

  page.appendChild(configBox);
  return page;
}

function renderPreferenceItem(title, desc, isChecked) {
  const toggleBtn = el('button', {
    style: `width: 48px; height: 26px; border-radius: 999px; background: ${isChecked ? 'var(--color-primary)' : 'var(--color-outline-variant)'}; position: relative; cursor:pointer;`,
    onClick: function() {
      const active = this.style.background.includes('primary');
      this.style.background = active ? 'var(--color-outline-variant)' : 'var(--color-primary)';
      const dot = this.querySelector('div');
      dot.style.left = active ? '2px' : '24px';
      TicketService.addLog(`Alterou preferência: "${title}"`, 'Ricardo Silva');
    }
  }, [
    el('div', { 
      style: `position: absolute; top: 2px; left: ${isChecked ? '24px' : '2px'}; width: 22px; height: 22px; border-radius: 50%; background: #ffffff; transition: left 0.15s ease;` 
    })
  ]);

  return el('div', { className: 'flex justify-between items-center py-sm' }, [
    el('div', { style: 'padding-right: 16px;' }, [
      el('p', { className: 'font-semibold color-surface', style: 'font-size: 14px;' }, title),
      el('p', { className: 'color-muted', style: 'font-size: 12px; margin-top:2px;' }, desc)
    ]),
    toggleBtn
  ]);
}

// ─── DASHBOARD HELPERS ──────────────────────────────────────

function statCard(iconName, label, value, trend, trendType, iconColor, borderColor) {
  return el('div', { className: 'card stat-card card-accent-left animate-fadein-up', style: `border-left-color: ${borderColor}` }, [
    el('div', { className: 'stat-card-header' }, [
      (() => { const i = icon(iconName); i.style.color = iconColor; return i; })(),
      el('span', { className: 'stat-card-label' }, label)
    ]),
    el('p', { className: 'stat-card-value' }, value),
    el('p', { className: 'stat-card-trend' + (trendType ? ' ' + trendType : ' color-muted') }, [
      trendType === 'up-bad' ? icon('trending_up', 'icon-xs') :
        trendType === 'up-good' ? icon('task_alt', 'icon-xs') :
        trendType === 'down-good' ? icon('trending_down', 'icon-xs') : null,
      document.createTextNode(' ' + trend)
    ])
  ]);
}

function renderFilterChips() {
  const categories = [
    { key: 'ti', label: 'TI', icone: 'computer', chipCss: 'chip-ti' },
    { key: 'eletrica', label: 'Elétrica', icone: 'bolt', chipCss: 'chip-eletrica' },
    { key: 'predial', label: 'Predial', icone: 'apartment', chipCss: 'chip-predial' },
    { key: 'seguranca', label: 'Segurança', icone: 'videocam', chipCss: 'chip-seguranca' },
    { key: 'telecom', label: 'Telecom', icone: 'settings_phone', chipCss: 'chip-telecom' }
  ];

  const group = el('div', { className: 'chip-group' });
  categories.forEach(cat => {
    const chip = el('button', {
      className: 'chip ' + cat.chipCss + (state.activeFilter === cat.key ? ' active' : ''),
      onClick: () => {
        state.activeFilter = state.activeFilter === cat.key ? null : cat.key;
        state.currentPage = 1;
        handleRoute();
      }
    }, [icon(cat.icone, 'icon-sm'), document.createTextNode(' ' + cat.label)]);
    group.appendChild(chip);
  });

  group.appendChild(el('button', {
    className: 'chip chip-neutral',
    onClick: () => { state.activeFilter = null; state.currentPage = 1; handleRoute(); }
  }, [icon('filter_list', 'icon-sm'), document.createTextNode(' Todos')]));

  return group;
}

function renderWeeklyChart() {
  const chartData = [
    { label: 'SEG', h1: 68, h2: 55 }, { label: 'TER', h1: 45, h2: 30 },
    { label: 'QUA', h1: 60, h2: 48 }, { label: 'QUI', h1: 82, h2: 70 },
    { label: 'SEX', h1: 50, h2: 38 }, { label: 'SÁB', h1: 72, h2: 55 },
    { label: 'DOM', h1: 58, h2: 40 }
  ];

  const card = el('div', { className: 'card', style: { height: '320px', position: 'relative', overflow: 'hidden' } });
  card.appendChild(el('div', { className: 'flex justify-between items-center mb-lg' }, [
    el('h3', { className: 'font-bold color-surface' }, 'Volume Semanal de Chamados'),
    el('span', { className: 'text-label-md color-primary font-bold' }, 'Últimos 7 dias')
  ]));

  const bars = el('div', { className: 'bar-chart', style: { height: '200px' } });
  chartData.forEach(d => {
    const col = el('div', { className: 'bar-chart-column' });
    const wrapper = el('div', { className: 'bar-wrapper', style: { height: '100%', alignItems: 'flex-end' } });

    const bar1 = el('div', { className: 'bar', style: { background: 'rgba(183,200,222,0.6)', height: d.h1 + '%', animation: 'barGrow 0.7s ease' } });
    const bar2 = el('div', { className: 'bar', style: { background: 'rgba(183,200,222,0.2)', height: d.h2 + '%', animation: 'barGrow 0.7s ease 0.1s' } });
    wrapper.appendChild(bar1);
    wrapper.appendChild(bar2);
    col.appendChild(wrapper);
    col.appendChild(el('span', { className: 'bar-label' }, d.label));
    bars.appendChild(col);
  });
  card.appendChild(bars);

  return card;
}

function renderTechList() {
  const card = el('div', { className: 'card flex flex-col' });
  card.appendChild(el('h3', { className: 'font-bold color-surface mb-md' }, 'Técnicos de Plantão'));

  const list = el('div', { className: 'flex flex-col gap-md' });
  const bgColors = ['var(--color-secondary-container)', 'var(--color-tertiary-container)', 'var(--color-surface-container-high)', 'var(--color-surface-container-high)'];
  const textColors = ['var(--color-on-secondary-container)', 'var(--color-on-tertiary-container)', 'var(--color-on-surface-variant)', 'var(--color-on-surface-variant)'];

  const tecnicos = TicketService.getTecnicos();

  tecnicos.forEach((tech, i) => {
    const row = el('div', { className: 'flex items-center justify-between' }, [
      el('div', { className: 'flex items-center gap-sm' }, [
        el('div', {
          className: 'flex items-center justify-center font-bold',
          style: { width: '32px', height: '32px', borderRadius: '50%', background: bgColors[i % 4], color: textColors[i % 4], fontSize: '12px' }
        }, tech.iniciais),
        el('div', {}, [
          el('p', { className: 'font-semibold', style: { fontSize: '12px' } }, tech.nome),
          el('p', { style: { fontSize: '10px', color: 'var(--color-on-surface-variant)' } }, tech.area)
        ])
      ]),
      el('span', { className: 'status-dot ' + tech.status })
    ]);
    list.appendChild(row);
  });
  card.appendChild(list);

  card.appendChild(el('button', {
    className: 'btn btn-outline w-full',
    style: { marginTop: 'auto', padding: '8px', justifyContent: 'center' },
    onClick: () => navigate('/agenda')
  }, 'Ver Agenda Completa'));

  return card;
}

// ─── MODAL — NOVO CHAMADO ───────────────────────────────────

function openModal() {
  state.modalOpen = true;
  const overlay = el('div', { className: 'modal-overlay', id: 'modal-overlay', onClick: (e) => { if (e.target.id === 'modal-overlay') closeModal(); } });

  const modal = el('div', { className: 'modal' });

  modal.appendChild(el('div', { className: 'modal-header' }, [
    el('h3', { className: 'text-headline-md' }, 'Novo Chamado'),
    el('button', { onClick: closeModal }, [icon('close')])
  ]));

  const body = el('div', { className: 'modal-body' });

  body.appendChild(formGroup('Título / Assunto', el('input', { type: 'text', className: 'input-field', id: 'new-titulo', placeholder: 'Ex: Manutenção de elevador...' })));

  const catSelect = el('select', { className: 'input-field select-field', id: 'new-categoria' });
  [['', 'Selecione uma categoria'], ['ti', 'Informática / TI'], ['eletrica', 'Elétrica'], ['predial', 'Predial / Civil'], ['seguranca', 'Segurança Eletrônica'], ['telecom', 'Telecomunicações']].forEach(([v, l]) => {
    catSelect.appendChild(el('option', { value: v }, l));
  });
  body.appendChild(formGroup('Categoria', catSelect));

  const priSelect = el('select', { className: 'input-field select-field', id: 'new-prioridade' });
  [['', 'Selecione a prioridade'], ['baixa', 'Baixa'], ['media', 'Média'], ['alta', 'Alta'], ['critica', 'Crítica']].forEach(([v, l]) => {
    priSelect.appendChild(el('option', { value: v }, l));
  });
  body.appendChild(formGroup('Prioridade', priSelect));

  body.appendChild(formGroup('Localização', el('input', { type: 'text', className: 'input-field', id: 'new-local', placeholder: 'Ex: Prédio Central - 3º Andar' })));

  body.appendChild(formGroup('Descrição', el('textarea', { className: 'input-field', id: 'new-descricao', placeholder: 'Descreva o problema em detalhes...', rows: '3' })));

  modal.appendChild(body);

  modal.appendChild(el('div', { className: 'modal-footer' }, [
    el('button', { className: 'btn btn-secondary', onClick: closeModal }, 'Cancelar'),
    el('button', { className: 'btn btn-primary', onClick: submitNewTicket }, [icon('add', 'icon-sm'), document.createTextNode(' Criar Chamado')])
  ]));

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function formGroup(label, input) {
  return el('div', { className: 'form-group' }, [
    el('label', { className: 'form-label' }, label),
    input
  ]);
}

function closeModal() {
  state.modalOpen = false;
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.remove();
}

function submitNewTicket() {
  const titulo = document.getElementById('new-titulo');
  const categoria = document.getElementById('new-categoria');
  const prioridade = document.getElementById('new-prioridade');
  const local = document.getElementById('new-local');
  const descricao = document.getElementById('new-descricao');

  if (!titulo || !titulo.value.trim()) return;
  if (!categoria || !categoria.value) return;
  if (!prioridade || !prioridade.value) return;

  const newTicket = TicketService.addTicket({
    assunto: titulo.value.trim(),
    categoria: categoria.value,
    prioridade: prioridade.value,
    local: local ? local.value.trim() : '',
    descricao: descricao ? descricao.value.trim() : '',
    departamento: CAT_MAP[categoria.value] ? CAT_MAP[categoria.value].label : 'Geral',
    catHardware: CAT_MAP[categoria.value] ? CAT_MAP[categoria.value].label : 'Geral'
  });

  closeModal();
  state.currentPage = 1;
  state.activeFilter = null;
  state.ticketSearchQuery = '';
  
  navigate('/chamados');
}

// ─── INITIALIZATION ─────────────────────────────────────────

function init() {
  const root = document.getElementById('app');
  if (!root) return;

  root.replaceChildren();

  const layout = el('div', { className: 'app-layout' });
  layout.appendChild(renderSidebar());
  layout.appendChild(renderTopbar());
  layout.appendChild(el('div', { className: 'main-content', id: 'main-content' }));
  root.appendChild(layout);

  handleRoute();
  window.addEventListener('hashchange', handleRoute);
}

document.addEventListener('DOMContentLoaded', init);
