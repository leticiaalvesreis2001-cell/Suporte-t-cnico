/* ============================================================
   TechSupport Ops — Mock Data
   Initial data structures for local database simulation
   ============================================================ */

const INITIAL_TICKETS = [
  { 
    id: 1024, 
    assunto: 'Manutenção de Ar-Condicionado', 
    categoria: 'predial', 
    prioridade: 'critica', 
    status: 'pendente', 
    abertura: '2h atrás', 
    local: 'Prédio Central - 4º Andar', 
    descricao: 'O sistema de climatização do Bloco C, Sala 402, está apresentando ruídos metálicos e perda de eficiência térmica desde as 08:30.', 
    sla: '02:14:00', 
    tecnico: 'Carlos Eduardo', 
    tecnicoEsp: 'Especialista em HVAC', 
    tecnicoImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDawS8uxlo1pAzWh5ADCjLrT-JC4NX8BwiLO5cs-yXoB69bon0tMV3jVZwolc8eLc6jRlH1g5lTGJgkRnU63R6fAf9dFhfOdM1ZWslLSAV1-ihkFtRo9JyjB1jsmXdt1dvLTF4LvKfc0GOSQjdTrR68icnXVxFbFXr0p09iOWHA8dKfO572DjKg83n40nWhKDplwipN2V-zGNBS90Su2BWSJsmN-R76mY-fY3PrCqDNnlU9XxPimEjEtS7TANkMYb_ZCYVdD4SP6t7U', 
    departamento: 'Infraestrutura', 
    catHardware: 'Hardware', 
    dataCriacao: '12/10 - 08:35',
    historico: [
      { titulo: 'Ticket Aberto', desc: 'Solicitante: Gerência Administrativa (Ana Paula)', hora: 'Hoje, 08:35', icone: 'check', cor: 'var(--color-primary-container)' },
      { titulo: 'Técnico Atribuído', desc: 'Carlos Eduardo (Equipe Manutenção)', hora: 'Hoje, 09:12', icone: 'person', cor: 'var(--color-secondary-container)' },
      { titulo: 'Status Alterado: Pendente → Em Progresso', desc: 'Iniciada análise presencial no local', hora: 'Hoje, 09:45', icone: 'edit', cor: 'var(--color-tertiary-container)' }
    ],
    chat: [
      { autor: 'Marcos Oliveira', hora: '10:15', texto: 'Verifiquei o compressor. Parece ser um problema no rolamento principal.', self: false },
      { autor: 'Você', hora: '10:22', texto: 'Vou solicitar a peça no almoxarifado. Alguma especificação técnica extra?', self: true }
    ],
    anexos: [
      { nome: 'evidencia_ruido.mp4', tamanho: '12.4 MB', tipo: 'Video', icone: 'movie' },
      { nome: 'manual_unidade_ext.pdf', tamanho: '2.1 MB', tipo: 'PDF Document', icone: 'description' },
      { nome: 'placa_identificacao.jpg', tamanho: '840 KB', tipo: 'Image', icone: 'image' }
    ]
  },
  { id: 1025, assunto: 'Atualização de Switch Core', categoria: 'ti', prioridade: 'alta', status: 'progresso', abertura: '4h atrás', local: 'Sala de Servidores - Térreo', descricao: 'Switch core necessita atualização de firmware urgente. Performance degradada detectada.', sla: '04:30:00', tecnico: 'André Martins', tecnicoEsp: 'Analista de Redes', tecnicoImg: '', departamento: 'TI', catHardware: 'Network', dataCriacao: '12/10 - 06:35', historico: [], chat: [], anexos: [] },
  { id: 1026, assunto: 'Reparo de Câmera PTZ Setor B', categoria: 'seguranca', prioridade: 'media', status: 'validando', abertura: '6h atrás', local: 'Setor B - Estacionamento', descricao: 'Câmera PTZ do estacionamento Setor B apresentando falha no motor de rotação.', sla: '08:00:00', tecnico: 'Juliana Santos', tecnicoEsp: 'Técnica em CFTV', tecnicoImg: '', departamento: 'Segurança', catHardware: 'CFTV', dataCriacao: '12/10 - 04:35', historico: [], chat: [], anexos: [] },
  { id: 1027, assunto: 'Instalação de Tomada Estabilizada', categoria: 'eletrica', prioridade: 'baixa', status: 'pendente', abertura: 'Ontem', local: 'Ala Norte - 2º Andar', descricao: 'Solicitação de instalação de tomada estabilizada para equipamento médico.', sla: '24:00:00', tecnico: '', tecnicoEsp: '', tecnicoImg: '', departamento: 'Elétrica', catHardware: 'Elétrica', dataCriacao: '11/10 - 14:20', historico: [], chat: [], anexos: [] },
  { id: 1028, assunto: 'Configuração de PABX', categoria: 'telecom', prioridade: 'media', status: 'progresso', abertura: '1 dia atrás', local: 'Recepção Central', descricao: 'Novo ramal precisa ser configurado no PABX para o departamento jurídico.', sla: '12:00:00', tecnico: 'André Martins', tecnicoEsp: 'Analista de Telecom', tecnicoImg: '', departamento: 'Telecomunicações', catHardware: 'Telecom', dataCriacao: '11/10 - 10:00', historico: [], chat: [], anexos: [] },
  { id: 1029, assunto: 'Troca de Lâmpadas LED - Corredor', categoria: 'predial', prioridade: 'baixa', status: 'resolvido', abertura: '2 dias atrás', local: 'Corredor Principal - Térreo', descricao: 'Substituição de lâmpadas fluorescentes por LED no corredor principal.', sla: '00:00:00', tecnico: 'Roberto Peres', tecnicoEsp: 'Manutenção Predial', tecnicoImg: '', departamento: 'Infraestrutura', catHardware: 'Iluminação', dataCriacao: '10/10 - 08:00', historico: [], chat: [], anexos: [] },
  { id: 1030, assunto: 'Backup de Servidor de Arquivos', categoria: 'ti', prioridade: 'alta', status: 'progresso', abertura: '3h atrás', local: 'Data Center', descricao: 'Backup incremental do servidor de arquivos falhando nas últimas 48h.', sla: '06:00:00', tecnico: 'André Martins', tecnicoEsp: 'Sysadmin', tecnicoImg: '', departamento: 'TI', catHardware: 'Servidor', dataCriacao: '12/10 - 07:00', historico: [], chat: [], anexos: [] },
  { id: 1031, assunto: 'Revisão de Cabeamento Estruturado', categoria: 'telecom', prioridade: 'baixa', status: 'pendente', abertura: '5 dias atrás', local: 'Bloco D - Todos os andares', descricao: 'Necessidade de revisão e certificação do cabeamento estruturado do Bloco D.', sla: '72:00:00', tecnico: '', tecnicoEsp: '', tecnicoImg: '', departamento: 'Telecomunicações', catHardware: 'Infra Rede', dataCriacao: '07/10 - 09:00', historico: [], chat: [], anexos: [] }
];

const INITIAL_TECNICOS = [
  { nome: 'André Martins', iniciais: 'AM', area: 'TI / Rede', status: 'online' },
  { nome: 'Luciana Costa', iniciais: 'LC', area: 'Elétrica', status: 'online' },
  { nome: 'Roberto Peres', iniciais: 'RP', area: 'Predial', status: 'busy' },
  { nome: 'Juliana Santos', iniciais: 'JS', area: 'Segurança', status: 'offline' }
];

const INITIAL_SCHEDULE_TECHS = [
  { nome: 'Marcus Chen', nivel: 'L3 Senior', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnhfII54ps-VaQXNgl4AT38_-fJC2VkOxK4JwScYmHe1gFzCeG7SyR82sOoZSF2eYkaWusQSi32kW2-ne1b9bI_wlkgEx7ON8YiX5OjHs6ZKtI5kXj6FlXrmKof7Ru8n6vjLPAioJgaxM_rDlMEIh839EmrEDviNnrXSE-gpJbN5tg_fCBHAIdsxaPQip_9URQtlwOrbsFKxjfIeliTkHPTThz3mrxWInJL0SI89_MsV6lj16GbU7bjki-Tnc-WGOdZeoW9wIBYkHp', tasks: [{ titulo: 'Server Maintenance - DC04', sub: 'Em Andamento • Ticket #8842', tipo: 'ongoing', left: '15%', width: '40%' }, { titulo: 'Firewall Patching', sub: 'Concluído • Ticket #8812', tipo: 'completed', left: '62%', width: '22%' }] },
  { nome: 'Sarah Jenkins', nivel: 'L2 Network', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABjjhpLeNIIg_FvJL7mLW3N0M1lirNzVYP5ilvGKKsrLdseSosummnmuebil7FWRzbQEzIpyfBnNjPUtFZuz9nCIht4cgsKxE2jNnGrSUj00ETORCryx-C5fdE7EQJ3-IQ5pMKlia_gz9QaPzVoamQUouosFjGEpABABSOch3QvWN6HLqvVF-unsqOE-sGwcYhqBU2QOvVEQpZle4WpTba2GUutpSMABGdJvqYtToBNIP-mi6CjGc7QBx1CKeWAwJM5gL5KEmnbWNP', tasks: [{ titulo: 'Onboarding Setup', sub: 'Concluído', tipo: 'completed', left: '0%', width: '12%' }, { titulo: 'Deslocamento Site B', sub: 'Em trânsito', tipo: 'travel', left: '16%', width: '14%' }, { titulo: 'Auditoria de Latência', sub: 'Em Andamento', tipo: 'ongoing', left: '40%', width: '35%' }] },
  { nome: 'Elena Rodriguez', nivel: 'L1 Support', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaFy0dJZhaWhhaMPR-za9USi9dNeSg4-XOG9I82w8p9N8LocwcJoYcRk97zasQg5fJqlvEgXi47k2sZa8NeRgPGGFTgqHZC2qTtbnvZJpAquQ7P3Cx922fSOOvDyrGEZwWyBDxyk6WvBPv4l3cEF1FiqKdMGE4NZvsc3R0JAX0FTU0_nO_ZvhfIttS2pWL59dBT6LAH-RYV14UNq4U2KYWm8pzOtUa_lQfUkPwGI2We0OOoJMHMXKxULEivkjJayfOraZwakMMNOyC', tasks: [{ titulo: 'Asset Tagging Fase 2', sub: 'Em Andamento', tipo: 'ongoing', left: '12%', width: '50%' }] },
  { nome: 'David Kim', nivel: 'L3 Security', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv7eNFJnvrPSnUm081Dw2eKNaZmRcGM4OuDay1yIrUW9sy0BSrKaCJDMr0PVjQtDwuFRsQZnOLLYIDrZkBTaNJI1pEq7QQkICZzF2zQC1h510fmFjmPWOywV11xs9p1xgpwLD4zfH0boUiFnNpzrcxU7rm1ZlulnU9aHPLZHi_kRxRVbFq_Bxzw4_DkyT08frXYReabwokDfAFKYgtTQ7I7K0XIu8o-0H_K1d7vg6wPVuPi1Gul1SWh2WYo_TxGLxgjOqOjkgjS44L', tasks: [] },
  { nome: 'Aria Vance', nivel: 'L2 Cloud', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB165d7qow4ucsbbcOcBXjUR76GL5bMr1kkVidHbl-cVufd4FxzGlyzm3E6nPWAQk_dufLbYmlyrfGiQeKM48y2fJp9AUiHtkvh9TKlgykIh4CprUD5sffLc-vInVRRoYq8Ql3KU1pFG-Bj6sVH3yTbkT6RR3qC6-lzaTv-4jp3uCkHNx0lHX7LBOXeQs9LJSNTn5uZrULM-il_uklFXoFp4KN2f9XKnYYksnTSyoTkzWbyKq2XxAcMZ7U20kcznDLYxGrxHQTrZqpk', tasks: [{ titulo: 'IAM Review', sub: 'Concluído', tipo: 'completed', left: '4%', width: '20%' }, { titulo: 'Hardware Refresh', sub: 'Em Andamento', tipo: 'travel', left: '38%', width: '35%' }] }
];

const INITIAL_AVAILABLE_TECHS = [
  { nome: 'Riley Cooper', nivel: 'L1 Support', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmtAEJoHJaPQqDXRX3qh0AlEVKBUX9DaVTxTDRDq8amReb1Polg9Tj25zeeTMMYhhMIWXb5izaoWDO4Yih7KP67j_DyTSvhOLLlpPgINiYjKY_p3iapOfIFUlG0s9QfNbvj3OgYemZl4fBTdXQYDkS9ZWRCklgmTZmyfDdNnS45_oTisKZNyzEuH5WXgBeRH54WiQJrB1YkZ83slrGtnhosAzJP0VWyVMDqGBkJrd6DC60k-nkcrtNRNVAhGXvAFwoN3u8V925w8Fj', skills: ['Desktops', 'OS Patching'], distancia: '2.4 km' },
  { nome: 'Sam Winston', nivel: 'L2 Storage', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBabtaqlRzvrG1H93EXHNM4D__Z1HmMEkYwObx5VpfxE18txCbe8DwTqFJktyUkG9KL4hqRa-sLjCHmdWN0ZGkoWkwFn9JPgNslgSbK94O3JvRduVKpzm89uYqG6kW72537SiB6q3o_j9VvdsNeBteqX0O0TdwephHIoYeJZs025qk_rYpI6aDmHlmeTLHS1yH06_faAdyFJx7jwa8tSV9cXMCX0UJENrX2v9CTb8qculD7YcRvhA7Ok1eeK2t1DujwvjbckB7CMqCx', skills: ['SAN', 'Backups'], distancia: '0.8 km' },
  { nome: 'Jordan Lee', nivel: 'L3 Expert', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOcqUT_OarVByELnV9xah8WcG9Hn8E0psxq8LoMdU7f_xGNPMQEvlabdLrAvQEaLFfemgMOckeyhN7klPRTTLYCsS1NuaPdrCXISeyW5Sbb33kssUcKzKuvrD5ocpdx5Bp3FXFzWSL90dylLkqSnWuxOfTG0ePnms4xr-B9ysEdhjxElje8887GVcY6OysoWaFSilSa8ZvjfgG0Q8cM-iXDwi2h25q0JXMGi8kdXOn6ylBmEYwY_GqPwNBYLODor34lg8-YYV-Neq9', skills: ['Azure', 'DevOps'], distancia: '12.1 km' }
];
