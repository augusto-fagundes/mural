// Configuração temporária para testes
// Este arquivo força o uso de dados mock para testar todas as funcionalidades

export const USE_MOCK_DATA = true;
export const SIMULATE_SUPABASE_ERROR = true;

// Configuração para simular diferentes cenários de teste
export const TEST_CONFIG = {
  // Simular erro de conexão com Supabase
  simulateSupabaseError: true,
  
  // Usar dados mock mesmo com Supabase disponível
  forceMockData: true,
  
  // Delay para simular latência de rede
  networkDelay: 300,
  
  // Habilitar logs detalhados para debug
  enableDebugLogs: true
};