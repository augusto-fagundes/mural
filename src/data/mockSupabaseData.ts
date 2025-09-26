// src/data/mockSupabaseData.ts
// Dados mockados para substituir o Supabase quando não estiver disponível

export interface MockModule {
  id: string;
  nome: string;
  color: string;
}

export interface MockSuggestionStatus {
  id: string;
  nome: string;
  color: string;
}

export interface MockSuggestion {
  id: string;
  title: string;
  description: string;
  email: string;
  youtube_url?: string;
  is_public: boolean;
  votes: number;
  comments_count: number;
  admin_response?: string;
  is_pinned: boolean;
  status_id: string;
  module_id: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

export const MOCK_MODULES: MockModule[] = [
  {
    id: "module-1",
    nome: "Financeiro",
    color: "#f59e42"
  },
  {
    id: "module-2", 
    nome: "Workspace",
    color: "#84cc16"
  },
  {
    id: "module-3",
    nome: "Bot",
    color: "#a21caf"
  },
  {
    id: "module-4",
    nome: "Mapa",
    color: "#06b6d4"
  },
  {
    id: "module-5",
    nome: "Integrações",
    color: "#8b5cf6"
  }
];

export const MOCK_SUGGESTION_STATUSES: MockSuggestionStatus[] = [
  {
    id: "status-1",
    nome: "Recebido",
    color: "#38bdf8"
  },
  {
    id: "status-2",
    nome: "Em análise", 
    color: "#fbbf24"
  },
  {
    id: "status-3",
    nome: "Aprovada",
    color: "#10b981"
  },
  {
    id: "status-4",
    nome: "Rejeitada",
    color: "#f43f5e"
  },
  {
    id: "status-5",
    nome: "Implementada",
    color: "#8b5cf6"
  }
];

export const MOCK_SUGGESTIONS: MockSuggestion[] = [
  {
    id: "suggestion-1",
    title: "Implementar Dashboard de Vendas em Tempo Real",
    description: "Criar um dashboard que mostre vendas em tempo real com gráficos interativos, métricas de performance e alertas automáticos para metas não atingidas. O dashboard deve incluir filtros por período, vendedor, produto e região. Esta funcionalidade seria muito útil para acompanhar o desempenho das vendas e tomar decisões mais rápidas baseadas em dados atualizados.",
    email: "carlos@empresa.com",
    youtube_url: "",
    is_public: true,
    votes: 15,
    comments_count: 8,
    admin_response: "",
    is_pinned: false,
    status_id: "status-2", // Em análise
    module_id: "module-1", // Financeiro
    image_urls: [],
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    id: "suggestion-2",
    title: "Integração com WhatsApp Business API",
    description: "Integrar o sistema com WhatsApp Business para envio automático de notificações de pedidos, cobranças e suporte ao cliente. Incluir templates de mensagens personalizáveis e histórico de conversas. Esta integração permitiria uma comunicação mais eficiente com os clientes e automatizaria muitos processos de atendimento.",
    email: "lucia@empresa.com",
    youtube_url: "",
    is_public: true,
    votes: 31,
    comments_count: 18,
    status_id: "status-1", // Recebido
    module_id: "module-5", // Integrações
    image_urls: [],
    created_at: "2024-01-08T09:15:00Z",
    updated_at: "2024-01-08T09:15:00Z"
  },
  {
    id: "suggestion-3",
    title: "Melhorias no Bot de Atendimento",
    description: "Aprimorar o bot de atendimento com inteligência artificial mais avançada, incluindo processamento de linguagem natural melhorado, integração com base de conhecimento e capacidade de escalonamento automático para atendentes humanos quando necessário. O bot atual é muito básico e não consegue resolver questões mais complexas dos usuários.",
    email: "ana@empresa.com",
    youtube_url: "",
    is_public: true,
    votes: 22,
    comments_count: 12,
    status_id: "status-3", // Aprovada
    module_id: "module-3", // Bot
    image_urls: [],
    created_at: "2024-01-10T14:20:00Z",
    updated_at: "2024-01-10T14:20:00Z"
  }
];

// Função para simular delay de rede
export const simulateNetworkDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Função para gerar IDs únicos
export const generateId = (): string => {
  return `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Storage local para persistir dados durante a sessão
class MockStorage {
  private static instance: MockStorage;
  private suggestions: MockSuggestion[] = [...MOCK_SUGGESTIONS];

  static getInstance(): MockStorage {
    if (!MockStorage.instance) {
      MockStorage.instance = new MockStorage();
    }
    return MockStorage.instance;
  }

  getSuggestions(): MockSuggestion[] {
    return this.suggestions;
  }

  addSuggestion(suggestion: Omit<MockSuggestion, 'id' | 'created_at' | 'updated_at' | 'votes' | 'comments_count' | 'is_pinned'>): MockSuggestion {
    const newSuggestion: MockSuggestion = {
      ...suggestion,
      id: generateId(),
      votes: 0,
      comments_count: 0,
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.suggestions.unshift(newSuggestion);
    return newSuggestion;
  }

  updateSuggestion(id: string, updates: Partial<MockSuggestion>): MockSuggestion | null {
    const index = this.suggestions.findIndex(s => s.id === id);
    if (index === -1) return null;

    this.suggestions[index] = {
      ...this.suggestions[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    return this.suggestions[index];
  }

  deleteSuggestion(id: string): boolean {
    const index = this.suggestions.findIndex(s => s.id === id);
    if (index === -1) return false;

    this.suggestions.splice(index, 1);
    return true;
  }
}

export const mockStorage = MockStorage.getInstance();