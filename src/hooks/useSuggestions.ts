import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TEST_SUGGESTIONS } from "@/data/testSuggestions";
import { useAnonymousEmail } from "@/hooks/useAnonymousEmail";
import type { Database } from "@/integrations/supabase/types";
import { mockStorage, generateId, simulateNetworkDelay } from "@/data/mockSupabaseData";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  module_id: string;
  email: string;
  youtube_url?: string;
  is_public: boolean;
  status: "recebido" | "em-analise" | "aprovada" | "rejeitada" | "implementada";
  priority: Database["public"]["Enums"]["priority_level"];
  votes: number;
  comments_count: number;
  admin_response?: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  hasVoted?: boolean;
  moduleColor?: string;
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

export interface InternalComment {
  id: string;
  suggestion_id: string;
  author_name: string;
  author_email: string;
  content: string;
  author_role: 'admin' | 'dev';
  created_at: string;
  updated_at: string;
}

export interface SuggestionInput {
  title: string;
  description: string;
  module_id: string;
  status_id: string;
  email: string;
  youtubeUrl?: string;
  isPublic: boolean;
}

export interface CommentInput {
  suggestion_id: string;
  author_name: string;
  author_email: string;
  content: string;
}

export interface InternalCommentInput {
  suggestion_id: string;
  author_name: string;
  author_email: string;
  content: string;
  author_role: 'admin' | 'dev';
}

const filterFields = {
  recent: {
    field: "created_at",
    ascending: true,
  },
  votes: {
    field: "votes",
    ascending: false,
  },
  comments: {
    field: "comments_count",
    ascending: false,
  },
};

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { anonymousEmail } = useAnonymousEmail();

  // Adiciona o estado e persistência de sortBy
  const getInitialSortBy = () => (typeof window !== "undefined" && localStorage.getItem("suggestions_sortBy")) || "votes";
  const [sortBy, setSortBy] = useState<string>(getInitialSortBy);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("suggestions_sortBy", sortBy);
    }
  }, [sortBy]);

  const fetchSuggestions = useCallback(
    async (includePrivate = false) => {
      try {
        let query: any = supabase.from("suggestions").select("*");
        query = query.order(filterFields[sortBy].field as string, { ascending: filterFields[sortBy].ascending });

        if (!includePrivate) {
          query = query.eq("is_public", true);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        // Se temos um email anônimo, verificar votos do usuário
        if (anonymousEmail && data) {
          const suggestionsWithVotes = await Promise.all(
            data.map(async (suggestion) => {
              const { data: voteData } = await supabase
                .from("suggestion_votes")
                .select("id")
                .eq("suggestion_id", suggestion.id)
                .eq("user_email", anonymousEmail)
                .maybeSingle();

              return {
                ...suggestion,
                hasVoted: !!voteData,
              };
            })
          );

          setSuggestions(suggestionsWithVotes);
        } else {
          setSuggestions(data || []);
        }
      } catch (error) {
        console.error("Supabase error:", error);
        
        // Usar dados de teste quando Supabase não estiver disponível
        console.log("Usando dados de teste devido a erro de conexão");
        setSuggestions(TEST_SUGGESTIONS);
        
        toast({
          title: "Modo de demonstração",
          description: "Usando dados de teste para demonstração das funcionalidades.",
          variant: "default",
        });
      } finally {
        setLoading(false);
      }
    },
    [anonymousEmail, toast]
  );

  const filterSuggestions = async (moduleId: string, statusId: string, searchTerm: string, includePrivate = false, customSortBy: string) => {
    let query: any = supabase.from("suggestions").select("*");
    query = query.order(filterFields[customSortBy || sortBy].field as string, { ascending: filterFields[customSortBy || sortBy].ascending });
    if (!includePrivate) {
      query = query.eq("is_public", true);
    }
    if (moduleId && moduleId !== "all") {
      query = query.eq("module_id", moduleId);
    }
    if (statusId && statusId !== "all") {
      query = query.eq("status_id", statusId);
    }

    if (searchTerm && searchTerm.trim() !== "") {
      query = query.ilike("title", `%${searchTerm}%`);
    }

    const { data, error } = await query;
    if (error) {
      toast({
        title: "Erro ao filtrar sugestões",
        description: "Não foi possível filtrar as sugestões.",
        variant: "destructive",
      });
      return [];
    }

    if (anonymousEmail && data) {
      const suggestionsWithVotes = await Promise.all(
        data.map(async (suggestion: Suggestion) => {
          const { data: voteData } = await supabase
            .from("suggestion_votes")
            .select("id")
            .eq("suggestion_id", suggestion.id)
            .eq("user_email", anonymousEmail)
            .maybeSingle();
          return {
            ...suggestion,
            hasVoted: !!voteData,
          };
        })
      );
      setSuggestions(suggestionsWithVotes);
    } else {
      setSuggestions(data as Suggestion[]);
    }
  };

  const createSuggestion = async (suggestionData: SuggestionInput & { image_urls?: string[] }) => {
    try {
      console.log("Creating suggestion:", suggestionData);
      
      try {
        const { data, error } = await supabase
          .from("suggestions")
          .insert([
            {
              title: suggestionData.title,
              description: suggestionData.description,
              module_id: suggestionData.module_id,
              status_id: suggestionData.status_id,
              email: suggestionData.email,
              youtube_url: suggestionData.youtubeUrl,
              is_public: suggestionData.isPublic,
              image_urls: suggestionData.image_urls || [],
            },
          ])
          .select()
          .single();

        if (error) {
          throw error;
        }

        setSuggestions((prev) => [data, ...prev]);

        toast({
          title: "Sugestão criada com sucesso!",
          description: "Sua sugestão foi enviada e está sendo analisada.",
        });

        return data;
      } catch (supabaseError) {
        console.warn("Supabase não disponível, salvando localmente:", supabaseError);
        
        // Simular delay de rede
        await simulateNetworkDelay(500);
        
        // Criar sugestão mockada
        const newSuggestion = {
          id: generateId(),
          title: suggestionData.title,
          description: suggestionData.description,
          module_id: suggestionData.module_id,
          status_id: suggestionData.status_id,
          email: suggestionData.email,
          youtube_url: suggestionData.youtubeUrl,
          is_public: suggestionData.isPublic,
          image_urls: suggestionData.image_urls || [],
          votes: 0,
          comments_count: 0,
          is_pinned: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "recebido" as const,
          priority: "medium" as Database["public"]["Enums"]["priority_level"],
        };

        // Salvar no storage local
        const suggestions = mockStorage.getSuggestions();
        suggestions.unshift(newSuggestion);
        mockStorage.setSuggestions(suggestions);

        setSuggestions((prev) => [newSuggestion as Suggestion, ...prev]);

        toast({
          title: "Sugestão criada com sucesso!",
          description: "Sua sugestão foi salva localmente e será sincronizada quando possível.",
        });

        return newSuggestion;
      }
    } catch (error) {
      console.error("Error creating suggestion:", error);
      toast({
        title: "Erro ao criar sugestão",
        description: "Não foi possível enviar sua sugestão.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSuggestion = async (suggestionId: string, updates: Partial<Suggestion>) => {
    try {
      console.log("Updating suggestion:", suggestionId, updates);
      const { data, error } = await supabase.from("suggestions").update(updates).eq("id", suggestionId).select().single();

      if (error) {
        console.error("Error updating suggestion:", error);
        throw error;
      }

      setSuggestions((prev) => prev.map((suggestion) => (suggestion.id === suggestionId ? { ...suggestion, ...data } : suggestion)));

      toast({
        title: "Sugestão atualizada",
        description: "A sugestão foi atualizada com sucesso.",
      });

      return data;
    } catch (error) {
      console.error("Error updating suggestion:", error);
      toast({
        title: "Erro ao atualizar sugestão",
        description: "Não foi possível atualizar a sugestão.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSuggestionStatus = async (suggestionId: string, newStatus: "recebido" | "em-analise" | "aprovada" | "rejeitada" | "implementada") => {
    try {
      console.log("Updating suggestion status:", suggestionId, newStatus);
      const { data, error } = await supabase.from("suggestions").update({ status: newStatus }).eq("id", suggestionId).select().single();

      if (error) {
        console.error("Error updating suggestion status:", error);
        throw error;
      }

      setSuggestions((prev) => prev.map((suggestion) => (suggestion.id === suggestionId ? { ...suggestion, status: newStatus } : suggestion)));

      toast({
        title: "Status atualizado",
        description: "O status da sugestão foi atualizado com sucesso.",
      });

      return data;
    } catch (error) {
      console.error("Error updating suggestion status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da sugestão.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const voteSuggestion = async (suggestionId: string) => {
    if (!anonymousEmail) {
      toast({
        title: "Email necessário",
        description: "Por favor, forneça seu email para votar.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Voting on suggestion:", suggestionId, anonymousEmail);
      
      // Simular sistema de votação mock
      const suggestionIndex = suggestions.findIndex(s => s.id === suggestionId);
      if (suggestionIndex !== -1) {
        const updatedSuggestions = [...suggestions];
        const suggestion = updatedSuggestions[suggestionIndex];
        
        if (suggestion.hasVoted) {
          // Remove vote
          suggestion.votes = Math.max(0, suggestion.votes - 1);
          suggestion.hasVoted = false;
          toast({
            title: "Voto removido",
            description: "Seu voto foi removido com sucesso.",
          });
        } else {
          // Add vote
          suggestion.votes += 1;
          suggestion.hasVoted = true;
          toast({
            title: "Voto registrado!",
            description: "Seu voto foi registrado com sucesso.",
          });
        }
        
        setSuggestions(updatedSuggestions);
      }
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error("Error voting suggestion:", error);
      toast({
        title: "Erro ao votar",
        description: "Não foi possível registrar seu voto.",
        variant: "destructive",
      });
    }
  };

  const fetchComments = async (suggestionId: string): Promise<SuggestionComment[]> => {
    try {
      console.log("Fetching comments for suggestion:", suggestionId);
      
      // Obter a quantidade de comentários esperada
      const mockCounts: { [key: string]: number } = {
        'test-1': 5,
        'test-2': 3,
        'test-3': 8,
        'test-4': 2,
        'test-5': 12,
        'test-6': 1,
        'test-7': 7,
        'test-8': 4,
        'test-9': 9,
        'test-10': 6,
        'test-11': 3,
        'test-12': 11,
        'test-13': 2,
        'test-14': 5,
        'test-15': 8,
      };
      
      const expectedCount = mockCounts[suggestionId] || 2;
      
      // Gerar comentários dinâmicos baseados na quantidade esperada
      const authors = [
        { name: "João Silva", email: "joao@empresa.com" },
        { name: "Maria Santos", email: "maria@empresa.com" },
        { name: "Carlos Oliveira", email: "carlos@empresa.com" },
        { name: "Ana Costa", email: "ana@empresa.com" },
        { name: "Pedro Almeida", email: "pedro@empresa.com" },
        { name: "Lucia Ferreira", email: "lucia@empresa.com" },
        { name: "Roberto Lima", email: "roberto@empresa.com" },
        { name: "Fernanda Rocha", email: "fernanda@empresa.com" },
        { name: "Marcos Pereira", email: "marcos@empresa.com" },
        { name: "Juliana Souza", email: "juliana@empresa.com" },
        { name: "Ricardo Mendes", email: "ricardo@empresa.com" },
        { name: "Camila Barbosa", email: "camila@empresa.com" },
      ];
      
      const commentTemplates = [
        "Excelente ideia! Isso realmente ajudaria muito no nosso dia a dia.",
        "Concordo! Já tive essa necessidade várias vezes. Seria ótimo ter essa funcionalidade implementada.",
        "Muito interessante! Poderia economizar bastante tempo da equipe.",
        "Apoio totalmente essa sugestão. Facilitaria muito nosso trabalho.",
        "Ótima proposta! Isso resolveria vários problemas que enfrentamos.",
        "Perfeito! Essa funcionalidade faz muito sentido para nosso contexto.",
        "Adorei a ideia! Seria uma grande melhoria para o sistema.",
        "Muito útil! Isso aumentaria nossa produtividade significativamente.",
        "Excelente sugestão! Já estava pensando em algo parecido.",
        "Fantástico! Isso tornaria o processo muito mais eficiente.",
        "Boa ideia! Seria uma adição valiosa ao sistema.",
        "Interessante! Poderia ser implementado em fases para testar.",
      ];
      
      const mockComments: SuggestionComment[] = [];
      
      for (let i = 0; i < expectedCount; i++) {
        const author = authors[i % authors.length];
        const content = commentTemplates[i % commentTemplates.length];
        const daysAgo = Math.floor(Math.random() * 10) + 1;
        
        mockComments.push({
          id: `comment-${i + 1}-${suggestionId}`,
          suggestion_id: suggestionId,
          author_name: author.name,
          author_email: author.email,
          content: content,
          created_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
      
      // Ordenar por data (mais recentes primeiro)
      mockComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockComments;
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Erro ao carregar comentários",
        description: "Não foi possível carregar os comentários.",
        variant: "destructive",
      });
      return [];
    }
  };

  const addComment = async (commentData: CommentInput) => {
    try {
      console.log("Adding comment:", commentData);
      
      // Simular adição de comentário mock
      const newComment: SuggestionComment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        suggestion_id: commentData.suggestion_id,
        author_name: commentData.author_name,
        author_email: commentData.author_email,
        content: commentData.content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));

      toast({
        title: "Comentário adicionado!",
        description: "Seu comentário foi publicado com sucesso.",
      });

      return newComment;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Erro ao adicionar comentário",
        description: "Não foi possível publicar seu comentário.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const fetchInternalComments = async (suggestionId: string): Promise<InternalComment[]> => {
    try {
      console.log("Fetching internal comments for suggestion:", suggestionId);
      
      // Simular comentários internos mock
      const mockInternalComments: InternalComment[] = [
        {
          id: `internal-1-${suggestionId}`,
          suggestion_id: suggestionId,
          author_name: "Admin Sistema",
          author_email: "admin@empresa.com",
          content: "Esta sugestão está sendo analisada pela equipe técnica. Vamos avaliar a viabilidade e impacto.",
          author_role: "admin",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: `internal-2-${suggestionId}`,
          suggestion_id: suggestionId,
          author_name: "Dev Lead",
          author_email: "dev.lead@empresa.com",
          content: "Implementação estimada em 2 sprints. Precisa de aprovação do PO para priorização.",
          author_role: "dev",
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return mockInternalComments;
    } catch (error) {
      console.error("Error fetching internal comments:", error);
      toast({
        title: "Erro ao carregar comentários internos",
        description: "Não foi possível carregar os comentários internos.",
        variant: "destructive",
      });
      return [];
    }
  };

  const addInternalComment = async (commentData: InternalCommentInput) => {
    try {
      console.log("Adding internal comment:", commentData);
      
      // Simular adição de comentário interno mock
      const newInternalComment: InternalComment = {
        id: `internal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        suggestion_id: commentData.suggestion_id,
        author_name: commentData.author_name,
        author_email: commentData.author_email,
        content: commentData.content,
        author_role: commentData.author_role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 600));

      toast({
        title: "Comentário interno adicionado!",
        description: "Seu comentário interno foi publicado com sucesso.",
      });

      return newInternalComment;
    } catch (error) {
      console.error("Error adding internal comment:", error);
      toast({
        title: "Erro ao adicionar comentário interno",
        description: "Não foi possível publicar seu comentário interno.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (anonymousEmail) {
      console.log("🚀 ~ anonymousEmail:", anonymousEmail);
      fetchSuggestions();
    }
  }, [anonymousEmail]);

  return {
    suggestions,
    loading,
    fetchSuggestions,
    createSuggestion,
    updateSuggestion,
    updateSuggestionStatus,
    voteSuggestion,
    fetchComments,
    addComment,
    fetchInternalComments,
    addInternalComment,
    filterSuggestions,
    sortBy,
    setSortBy,
  };
};
