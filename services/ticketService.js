/* ============================================================
   TechSupport Ops — Ticket Service & Persistência Local
   Uses LocalStorage to simulate DB persistent operations
   ============================================================ */

const TicketService = {
  // Inicializa a persistência local com dados iniciais se estiver vazio
  init() {
    if (!localStorage.getItem('TS_TICKETS')) {
      localStorage.setItem('TS_TICKETS', JSON.stringify(INITIAL_TICKETS));
    }
    if (!localStorage.getItem('TS_TECNICOS')) {
      localStorage.setItem('TS_TECNICOS', JSON.stringify(INITIAL_TECNICOS));
    }
    if (!localStorage.getItem('TS_SCHEDULE_TECHS')) {
      localStorage.setItem('TS_SCHEDULE_TECHS', JSON.stringify(INITIAL_SCHEDULE_TECHS));
    }
    if (!localStorage.getItem('TS_AVAILABLE_TECHS')) {
      localStorage.setItem('TS_AVAILABLE_TECHS', JSON.stringify(INITIAL_AVAILABLE_TECHS));
    }
    if (!localStorage.getItem('TS_LOGS')) {
      // Logs iniciais de auditoria
      const initialLogs = [
        { data: '12/10 - 09:45', usuario: 'Carlos Eduardo', acao: 'Alterou status do ticket #1024 para Em Progresso' },
        { data: '12/10 - 09:12', usuario: 'Ricardo Silva', acao: 'Atribuiu o ticket #1024 a Carlos Eduardo' },
        { data: '12/10 - 08:35', usuario: 'Ana Paula', acao: 'Abriu novo chamado: Manutenção de Ar-Condicionado' }
      ];
      localStorage.setItem('TS_LOGS', JSON.stringify(initialLogs));
    }
    if (!localStorage.getItem('TS_THEME')) {
      localStorage.setItem('TS_THEME', 'dark');
    }
  },

  // --- TICKETS ---
  getTickets() {
    this.init();
    return JSON.parse(localStorage.getItem('TS_TICKETS')) || [];
  },

  getTicketById(id) {
    const tickets = this.getTickets();
    return tickets.find(t => t.id === parseInt(id));
  },

  addTicket(ticketData) {
    const tickets = this.getTickets();
    const newId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1000;
    
    const newTicket = {
      id: newId,
      assunto: ticketData.assunto,
      categoria: ticketData.categoria,
      prioridade: ticketData.prioridade,
      status: 'pendente',
      abertura: 'Agora',
      local: ticketData.local || '',
      descricao: ticketData.descricao || '',
      sla: '24:00:00',
      tecnico: '',
      tecnicoEsp: '',
      tecnicoImg: '',
      departamento: ticketData.departamento || 'Geral',
      catHardware: ticketData.catHardware || 'Geral',
      dataCriacao: this.formatDateTime(new Date()),
      historico: [
        { titulo: 'Ticket Aberto', desc: 'Solicitante: Ricardo Silva (Admin)', hora: 'Agora', icone: 'check', cor: 'var(--color-primary-container)' }
      ],
      chat: [],
      anexos: []
    };

    tickets.unshift(newTicket);
    localStorage.setItem('TS_TICKETS', JSON.stringify(tickets));
    this.addLog(`Criou o ticket #${newId}: "${newTicket.assunto}"`, 'Ricardo Silva');
    return newTicket;
  },

  updateTicket(id, fields) {
    const tickets = this.getTickets();
    const idx = tickets.findIndex(t => t.id === parseInt(id));
    if (idx === -1) return null;

    const oldTicket = tickets[idx];
    const updatedTicket = { ...oldTicket, ...fields };

    // Adicionar ao histórico se o status mudou
    if (fields.status && fields.status !== oldTicket.status) {
      const statusLabels = {
        pendente: 'Pendente',
        progresso: 'Em Progresso',
        validando: 'Validando',
        resolvido: 'Resolvido'
      };
      const oldLbl = statusLabels[oldTicket.status] || oldTicket.status;
      const newLbl = statusLabels[fields.status] || fields.status;
      
      updatedTicket.historico.unshift({
        titulo: 'Status Alterado',
        desc: `Status alterado de ${oldLbl} para ${newLbl}`,
        hora: 'Agora',
        icone: 'edit',
        cor: 'var(--color-tertiary-container)'
      });
      this.addLog(`Alterou status do ticket #${id} para ${newLbl}`, 'Ricardo Silva');
    }

    tickets[idx] = updatedTicket;
    localStorage.setItem('TS_TICKETS', JSON.stringify(tickets));
    return updatedTicket;
  },

  addChatMessage(ticketId, message) {
    const tickets = this.getTickets();
    const idx = tickets.findIndex(t => t.id === parseInt(ticketId));
    if (idx === -1) return null;

    tickets[idx].chat.push(message);
    localStorage.setItem('TS_TICKETS', JSON.stringify(tickets));
    return tickets[idx];
  },

  // --- TÉCNICOS ---
  getTecnicos() {
    this.init();
    return JSON.parse(localStorage.getItem('TS_TECNICOS')) || [];
  },

  getScheduleTechs() {
    this.init();
    return JSON.parse(localStorage.getItem('TS_SCHEDULE_TECHS')) || [];
  },

  getAvailableTechs() {
    this.init();
    return JSON.parse(localStorage.getItem('TS_AVAILABLE_TECHS')) || [];
  },

  // --- LOGS DE AUDITORIA ---
  getLogs() {
    this.init();
    return JSON.parse(localStorage.getItem('TS_LOGS')) || [];
  },

  addLog(acao, usuario = 'Ricardo Silva') {
    const logs = JSON.parse(localStorage.getItem('TS_LOGS')) || [];
    logs.unshift({
      data: this.formatDateTime(new Date()),
      usuario: usuario,
      acao: acao
    });
    // Limita em 50 logs na auditoria local para economizar espaço
    if (logs.length > 50) logs.pop();
    localStorage.setItem('TS_LOGS', JSON.stringify(logs));
  },

  // --- CONFIGURAÇÃO DE TEMA ---
  getTheme() {
    this.init();
    return localStorage.getItem('TS_THEME') || 'dark';
  },

  setTheme(theme) {
    localStorage.setItem('TS_THEME', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.addLog(`Alterou preferência de tema para: ${theme}`, 'Ricardo Silva');
  },

  // --- HELPERS ---
  formatDateTime(date) {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${d}/${m} - ${h}:${min}`;
  }
};

// Inicializa o serviço imediatamente
TicketService.init();
// Aplica o tema salvo ao carregar o script
document.documentElement.setAttribute('data-theme', TicketService.getTheme());
