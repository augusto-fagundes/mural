import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAnonymousEmail } from "@/hooks/useAnonymousEmail";
import type { Database } from "@/integrations/supabase/types";

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

interface SuggestionComment {
  id: string;
  suggestion_id: string;
  author_name: string;
  author_email: string;
  content: string;
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

interface CommentInput {
  suggestion_id: string;
  author_name: string;
  author_email: string;
  content: string;
}

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  console.log("🚀 ~ useSuggestions ~ suggestions:", suggestions);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { anonymousEmail } = useAnonymousEmail();

  const fetchSuggestions = useCallback(
    async (includePrivate = false) => {
      try {
        let query = supabase.from("suggestions").select("*").order("created_at", { ascending: false });

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
        console.error("Error fetching suggestions:", error);
        toast({
          title: "Erro ao carregar sugestões",
          description: "Não foi possível carregar as sugestões.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [anonymousEmail, toast]
  );

  const filterSuggestions = async (moduleId: string, statusId: string, searchTerm: string) => {
    let query = supabase.from("suggestions").select("*") as any;

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
        console.error("Error creating suggestion:", error);
        throw error;
      }

      setSuggestions((prev) => [data, ...prev]);

      toast({
        title: "Sugestão criada com sucesso!",
        description: "Sua sugestão foi enviada e está sendo analisada.",
      });

      return data;
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
        title: "Erro ao votar",
        description: "Email anônimo não encontrado. Tente recarregar a página.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Voting on suggestion:", suggestionId, anonymousEmail);
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from("suggestion_votes")
        .select("id")
        .eq("suggestion_id", suggestionId)
        .eq("user_email", anonymousEmail)
        .maybeSingle();

      if (existingVote) {
        // Remove vote
        await supabase.from("suggestion_votes").delete().eq("suggestion_id", suggestionId).eq("user_email", anonymousEmail);

        // Update vote count using database function
        const { error: updateError } = await supabase.rpc("decrement_suggestion_votes", {
          suggestion_id: suggestionId,
        });

        if (updateError) {
          console.error("Error decrementing votes:", updateError);
        }
      } else {
        // Add vote
        await supabase.from("suggestion_votes").insert([
          {
            suggestion_id: suggestionId,
            user_email: anonymousEmail,
          },
        ]);

        // Update vote count using database function
        const { error: updateError } = await supabase.rpc("increment_suggestion_votes", {
          suggestion_id: suggestionId,
        });

        if (updateError) {
          console.error("Error incrementing votes:", updateError);
        }
      }

      // Refresh suggestions to get updated vote count
      await fetchSuggestions();
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
      const { data, error } = await supabase
        .from("suggestion_comments")
        .select("*")
        .eq("suggestion_id", suggestionId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error);
        throw error;
      }

      return data || [];
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
      const { data, error } = await supabase.from("suggestion_comments").insert([commentData]).select().single();

      if (error) {
        console.error("Error adding comment:", error);
        throw error;
      }

      toast({
        title: "Comentário adicionado!",
        description: "Seu comentário foi publicado com sucesso.",
      });

      return data;
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
    filterSuggestions,
  };
};
