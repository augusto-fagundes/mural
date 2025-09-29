import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// TEMPORÁRIO: Forçar uso de dados mock para testes
const FORCE_MOCK_DATA = true;

let supabaseClient: any;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY || FORCE_MOCK_DATA) {
  console.log("🧪 MODO DE TESTE: Usando dados mock");
  // Criar um cliente mock que sempre falha para forçar o uso de dados de teste
  supabaseClient = {
    from: () => ({
      select: () => ({
        order: () => ({
          eq: () => Promise.reject(new Error("Mock: Forçando uso de dados de teste")),
          ilike: () => Promise.reject(new Error("Mock: Forçando uso de dados de teste"))
        }),
        eq: () => Promise.reject(new Error("Mock: Forçando uso de dados de teste")),
        ilike: () => Promise.reject(new Error("Mock: Forçando uso de dados de teste"))
      }),
      insert: () => Promise.reject(new Error("Mock: Forçando uso de dados de teste")),
      update: () => Promise.reject(new Error("Mock: Forçando uso de dados de teste")),
      delete: () => Promise.reject(new Error("Mock: Forçando uso de dados de teste"))
    })
  };
} else {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set."
    );
  }

  supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = supabaseClient;
