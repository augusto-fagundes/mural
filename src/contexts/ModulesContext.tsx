import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MOCK_MODULES, simulateNetworkDelay } from "@/data/mockSupabaseData";

interface Module {
  id: string;
  nome: string;
  color: string;
}

const ModulesContext = createContext<{ modules: Module[]; loading: boolean }>({ modules: [], loading: true });

export const ModulesProvider = ({ children }: { children: React.ReactNode }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModules() {
      try {
        const { data, error } = await supabase.from("modules").select("*").order("nome");
        if (error) {
          throw error;
        } else {
          setModules(data || MOCK_MODULES);
        }
      } catch (error) {
        console.warn("Supabase não disponível, usando dados mockados:", error);
        await simulateNetworkDelay(300);
        setModules(MOCK_MODULES);
      }
      setLoading(false);
    }
    fetchModules();
  }, []);

  return (
    <ModulesContext.Provider value={{ modules, loading }}>
      {children}
    </ModulesContext.Provider>
  );
};

export const useModules = () => useContext(ModulesContext);