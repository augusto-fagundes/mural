import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SuggestionStatus {
  id: string;
  nome: string;
  color: string;
}

// Cache global para evitar requisições desnecessárias
let cachedStatuses: SuggestionStatus[] | null = null;
let isLoading = false;

export function useSuggestionStatuses() {
  const [statuses, setStatuses] = useState<SuggestionStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatuses() {
      // Se já temos dados em cache, use-os
      if (cachedStatuses) {
        setStatuses(cachedStatuses);
        setLoading(false);
        return;
      }

      // Se já está carregando, aguarde
      if (isLoading) {
        return;
      }

      isLoading = true;
      setLoading(true);

      try {
        const { data, error } = await supabase.from("suggestion_statuses").select("*").order("nome");
        if (!error && data) {
          cachedStatuses = data;
          setStatuses(data);
        }
      } catch (error) {
        console.error("Erro ao carregar status de sugestões:", error);
      } finally {
        setLoading(false);
        isLoading = false;
      }
    }

    fetchStatuses();
  }, []);

  return { statuses, loading };
} 