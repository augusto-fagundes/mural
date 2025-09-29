import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MockStorage, simulateNetworkDelay, generateId } from '@/data/mockSupabaseData';
import { mockSuggestions } from '@/data/mockData';
import { USE_MOCK_DATA, SIMULATE_SUPABASE_ERROR } from '@/config/test.config';

export interface InternalComment {
  id: string;
  suggestion_id: string;
  author_name: string;
  author_email: string;
  author_role: 'admin' | 'dev';
  content: string;
  created_at: string;
  updated_at: string;
}

export interface InternalCommentInput {
  author_name: string;
  author_email: string;
  author_role: 'admin' | 'dev';
  content: string;
}

export interface SuggestionComment {
  id: string;
  suggestion_id: string;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface SuggestionCommentInput {
  author_name: string;
  author_email: string;
  content: string;
}

export interface CreateSuggestionInput {
  title: string;
  description: string;
  module_id: string;
  email: string;
  youtubeUrl?: string;
  isPublic?: boolean;
  status_id?: string;
  image_urls?: string[];
}

export interface UpdateSuggestionInput {
  title?: string;
  description?: string;
  module_id?: string;
  status_id?: string;
  admin_response?: string;
  is_pinned?: boolean;
  is_public?: boolean;
}

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'votes' | 'comments'>('recent');
  const { toast } = useToast();

  // Função para buscar sugestões
  const fetchSuggestions = async (includePrivate: boolean = false) => {
    try {
      setLoading(true);
      await simulateNetworkDelay(300);

      if (SIMULATE_SUPABASE_ERROR || USE_MOCK_DATA) {
        // Usar dados mockados do MockStorage (que agora está vazio)
        const mockStorage = MockStorage.getInstance();
        let mockSuggestionsList = mockStorage.getSuggestions();
        
        setSuggestions(mockSuggestionsList);
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as sugestões. Usando dados offline.",
        variant: "destructive",
      });
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para criar sugestão
  const createSuggestion = async (input: CreateSuggestionInput) => {
    try {
      await simulateNetworkDelay(500);

      if (SIMULATE_SUPABASE_ERROR || USE_MOCK_DATA) {
        const mockStorage = MockStorage.getInstance();
        const newSuggestion = mockStorage.addSuggestion({
          title: input.title,
          description: input.description,
          email: input.email,
          youtube_url: input.youtubeUrl || '',
          is_public: input.isPublic ?? true,
          admin_response: '',
          is_pinned: false,
          status_id: input.status_id || 'status-1',
          module_id: input.module_id,
          image_urls: input.image_urls || []
        });

        // Atualizar a lista local
        setSuggestions(prev => [newSuggestion, ...prev]);

        toast({
          title: "Sucesso!",
          description: "Sua sugestão foi criada com sucesso.",
        });

        return newSuggestion;
      }
    } catch (error) {
      console.error('Erro ao criar sugestão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a sugestão. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Função para votar em sugestão
  const voteSuggestion = async (suggestionId: string) => {
    try {
      await simulateNetworkDelay(200);

      if (SIMULATE_SUPABASE_ERROR || USE_MOCK_DATA) {
        setSuggestions(prev => prev.map(suggestion => {
          if (suggestion.id === suggestionId) {
            const hasVoted = suggestion.hasVoted || false;
            return {
              ...suggestion,
              votes: hasVoted ? suggestion.votes - 1 : suggestion.votes + 1,
              hasVoted: !hasVoted
            };
          }
          return suggestion;
        }));

        toast({
          title: "Voto registrado!",
          description: "Seu voto foi registrado com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro ao votar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar seu voto.",
        variant: "destructive",
      });
    }
  };

  // Função para atualizar sugestão
  const updateSuggestion = async (suggestionId: string, input: UpdateSuggestionInput) => {
    try {
      await simulateNetworkDelay(300);

      if (SIMULATE_SUPABASE_ERROR || USE_MOCK_DATA) {
        setSuggestions(prev => prev.map(suggestion => {
          if (suggestion.id === suggestionId) {
            return {
              ...suggestion,
              ...input,
              updated_at: new Date().toISOString()
            };
          }
          return suggestion;
        }));

        toast({
          title: "Sucesso!",
          description: "Sugestão atualizada com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar sugestão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a sugestão.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Função para atualizar status da sugestão
  const updateSuggestionStatus = async (suggestionId: string, statusId: string) => {
    try {
      await simulateNetworkDelay(300);

      if (SIMULATE_SUPABASE_ERROR || USE_MOCK_DATA) {
        setSuggestions(prev => prev.map(suggestion => {
          if (suggestion.id === suggestionId) {
            return {
              ...suggestion,
              status_id: statusId,
              updated_at: new Date().toISOString()
            };
          }
          return suggestion;
        }));

        toast({
          title: "Status atualizado!",
          description: "O status da sugestão foi atualizado.",
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive",
      });
    }
  };

  // Função para buscar comentários
  const fetchComments = async (suggestionId: string): Promise<SuggestionComment[]> => {
    try {
      await simulateNetworkDelay(200);
      return [];
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      return [];
    }
  };

  // Função para adicionar comentário
  const addComment = async (suggestionId: string, input: SuggestionCommentInput): Promise<SuggestionComment | null> => {
    try {
      await simulateNetworkDelay(300);
      
      const newComment: SuggestionComment = {
        id: generateId(),
        suggestion_id: suggestionId,
        author_name: input.author_name,
        author_email: input.author_email,
        content: input.content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Atualizar contador de comentários
      setSuggestions(prev => prev.map(suggestion => {
        if (suggestion.id === suggestionId) {
          return {
            ...suggestion,
            comments_count: (suggestion.comments_count || 0) + 1
          };
        }
        return suggestion;
      }));

      toast({
        title: "Comentário adicionado!",
        description: "Seu comentário foi adicionado com sucesso.",
      });

      return newComment;
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Função para buscar comentários internos
  const fetchInternalComments = async (suggestionId: string): Promise<InternalComment[]> => {
    try {
      await simulateNetworkDelay(200);
      return [];
    } catch (error) {
      console.error('Erro ao buscar comentários internos:', error);
      return [];
    }
  };

  // Função para adicionar comentário interno
  const addInternalComment = async (suggestionId: string, input: InternalCommentInput): Promise<InternalComment | null> => {
    try {
      await simulateNetworkDelay(300);
      
      const newComment: InternalComment = {
        id: generateId(),
        suggestion_id: suggestionId,
        author_name: input.author_name,
        author_email: input.author_email,
        author_role: input.author_role,
        content: input.content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      toast({
        title: "Comentário interno adicionado!",
        description: "O comentário interno foi adicionado com sucesso.",
      });

      return newComment;
    } catch (error) {
      console.error('Erro ao adicionar comentário interno:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário interno.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Função para filtrar sugestões
  const filterSuggestions = (searchTerm: string, moduleFilter: string, statusFilter: string) => {
    // Esta função pode ser implementada para filtrar as sugestões localmente
    // Por enquanto, não faz nada pois a filtragem é feita no componente
  };

  // Carregar sugestões na inicialização
  useEffect(() => {
    fetchSuggestions();
  }, []);

  return {
    suggestions,
    loading,
    sortBy,
    setSortBy,
    fetchSuggestions,
    createSuggestion,
    voteSuggestion,
    updateSuggestion,
    updateSuggestionStatus,
    fetchComments,
    addComment,
    fetchInternalComments,
    addInternalComment,
    filterSuggestions
  };
};
