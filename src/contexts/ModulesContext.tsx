import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
      const { data } = await supabase.from("modules").select("*").order("nome");
      setModules(data || []);
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