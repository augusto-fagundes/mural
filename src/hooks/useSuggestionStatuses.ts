import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MOCK_SUGGESTION_STATUSES, simulateNetworkDelay } from "@/data/mockSupabaseData";

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
        } else {
          throw error;
        }
      } catch (error) {
        console.warn("Supabase não disponível, usando dados mockados:", error);
        // Usar dados mockados quando Supabase não estiver disponível
        await simulateNetworkDelay(300);
        cachedStatuses = MOCK_SUGGESTION_STATUSES;
        setStatuses(MOCK_SUGGESTION_STATUSES);
      } finally {
        setLoading(false);
        isLoading = false;
      }
    }

    fetchStatuses();
  }, []);

  return { statuses, loading };
}