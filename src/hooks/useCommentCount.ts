import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCommentRefresh } from "@/contexts/CommentRefreshContext";

// Cache para contagens de comentários
const commentCountCache = new Map<string, number>();
const loadingCounts = new Set<string>();

export function useCommentCount(suggestionId: string) {
  const [count, setCount] = useState<number>(0);
  const { refresh } = useCommentRefresh();

  useEffect(() => {
    if (!suggestionId) return;
    let isMounted = true;

    async function fetchCount() {
      // Se já temos o valor em cache e não está sendo atualizado, use-o
      if (commentCountCache.has(suggestionId) && !refresh) {
        setCount(commentCountCache.get(suggestionId)!);
        return;
      }

      // Se já está carregando, aguarde
      if (loadingCounts.has(suggestionId)) {
        return;
      }

      loadingCounts.add(suggestionId);

      try {
        const { count } = await supabase
          .from("suggestion_comments")
          .select("*", { count: "exact", head: true })
          .eq("suggestion_id", suggestionId);

        const countValue = count || 0;
        
        if (isMounted) {
          setCount(countValue);
          commentCountCache.set(suggestionId, countValue);
        }
      } catch (error) {
        console.error("Erro ao carregar contagem de comentários:", error);
      } finally {
        loadingCounts.delete(suggestionId);
      }
    }

    fetchCount();

    return () => { isMounted = false; };
  }, [suggestionId, refresh]);

  return count;
} 