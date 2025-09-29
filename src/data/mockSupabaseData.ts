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

export const MOCK_SUGGESTIONS: MockSuggestion[] = [];

// Função para simular delay de rede
export const simulateNetworkDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Função para gerar IDs únicos
export const generateId = (): string => {
  return `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Storage local para persistir dados durante a sessão
export class MockStorage {
  private static instance: MockStorage;
  private suggestions: MockSuggestion[] = [];

  static getInstance(): MockStorage {
    if (!MockStorage.instance) {
      MockStorage.instance = new MockStorage();
      MockStorage.instance.initializeWithMockData();
    }
    return MockStorage.instance;
  }

  private initializeWithMockData(): void {
    this.suggestions = [...MOCK_SUGGESTIONS];
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