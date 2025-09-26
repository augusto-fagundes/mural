// Pontuação por Voto (NOVO)
export const PONTUACAO_POR_VOTO = 2; // Cada voto vale 2 pontos

// 1. Faixa de Clientes - Baseado na imagem fornecida
const PONTUACAO_FAIXA_CLIENTES: { [faixa: number]: number } = {
  5000: 10,
  10000: 20,
  15000: 30,
  20000: 40,
  30000: 50,
  50000: 60,
};

export const getPontuacaoPorFaixaClientes = (totalClientes: number): number => {
  // Ordena as faixas para garantir a lógica correta
  const sortedFaixas = Object.keys(PONTUACAO_FAIXA_CLIENTES)
    .map(Number)
    .sort((a, b) => a - b);

  for (const faixa of sortedFaixas) {
    if (totalClientes <= faixa) {
      return PONTUACAO_FAIXA_CLIENTES[faixa];
    }
  }
  return PONTUACAO_FAIXA_CLIENTES[50000];
};

// 2. Cliente Preventivo - Baseado na imagem fornecida
export const PONTUACAO_STATUS_PREVENTIVO: { [status: string]: number } = {
  "Preventivo Urgente": 50,
  "Preventivo Crítico": 40,
  "Preventivo Atenção": 30,
};

// 3. Clientes Enterprise
export const CLIENTES_ENTERPRISE: string[] = [
  "ALCANS TELECOM LTDA",
  "VETORIAL.NET INFORMATICA E SERVICOS DE INTERNET LTDA",
  "NETFACIL LOCACAO E SERVICOS LTDA",
  "BRASREDE TELECOMUNICACOES LTDA",
  "RAZAOINFO INTERNET LTDA",
  "BITCOM PROVEDOR DE SERVICOS DE INTERNET LTDA",
  "BRPHONIA PROVEDOR IP LTDA",
  "LINK SETE SERVICOS DE INTERNET E REDES LTDA",
  "NAVE NET SERVICOS DE INTERNET LTDA",
  "ADYL.NET ACESSO A INTERNET LTDA",
  "PRO-SERVICOS DE INTERNET LTDA",
  "DIRECT WIFI INFORMATICA LTDA",
  "SEA TELECOM LTDA",
  "ONLINE TELECOMUNICACOES LTDA",
  "AONET SERVICOS DE COMUNICACAO LTDA",
  "ONNET TELECOMUNICACOES LTDA",
].map((name) => name.toUpperCase());

export const PONTUACAO_CLIENTE_ENTERPRISE = 100;

// 4. Data de Criação (Tempo) - Baseado na imagem fornecida
export const getPontuacaoPorDataCriacao = (data: string): number => {
  const dataCriacao = new Date(data);
  const hoje = new Date();
  const meses =
    (hoje.getFullYear() - dataCriacao.getFullYear()) * 12 +
    (hoje.getMonth() - dataCriacao.getMonth());

  if (meses <= 1) return 1; // 1 Mês
  if (meses <= 3) return 3; // 3 Meses
  if (meses <= 6) return 6; // 6 meses
  if (meses <= 12) return 15; // 12 ou mais
  return 15;
};

// 5. NPS - Baseado na imagem fornecida
export const PONTUACAO_NPS: { [nota: number]: number } = {
  0: 50,
  1: 90,
  2: 80,
  3: 70,
  4: 60,
  5: 50,
  6: 40,
  7: 30,
  8: 20,
  9: 20,
  10: 20,
};

// 6. Fidelidade
export const PONTUACAO_FIDELIDADE: { [status: string]: number } = {
  Total: 50,
  Parcial: 10,
  "Sem fidelidade": 30,
};

// 7. Quantidade de Sugestões - Baseado na imagem fornecida
export const getPontuacaoPorQuantidadeSugestoes = (
  quantidade: number
): number => {
  if (quantidade >= 1 && quantidade <= 3) return 75;
  if (quantidade >= 4 && quantidade <= 10) return 50;
  if (quantidade >= 10 && quantidade <= 25) return 30;
  if (quantidade >= 26) return 10;
  return 75; // Default para 1-3
};

// 8. Tempo de Casa (em anos) - Baseado na imagem fornecida
export const getPontuacaoPorTempoDeCasa = (anos: number): number => {
  if (anos >= 0 && anos <= 5) return 10; // "2016-2020"
  if (anos >= 6 && anos <= 9) return 20; // "2021-2025"
  if (anos >= 10) return 30; // "26 ou mais"
  return 10;
};

// Níveis de Prioridade - Baseado na imagem fornecida
export const getNivelPrioridade = (
  score: number
): { nivel: number | string; cor: string } => {
  if (score <= 100) return { nivel: 5, cor: "bg-green-500" };
  if (score <= 150) return { nivel: 4, cor: "bg-lime-500" };
  if (score <= 250) return { nivel: 3, cor: "bg-yellow-500" };
  if (score <= 300) return { nivel: 2, cor: "bg-orange-500" };
  if (score <= 400) return { nivel: 1, cor: "bg-red-500" };
  if (score >= 500) return { nivel: "Urgente", cor: "bg-red-700" };
  return { nivel: 1, cor: "bg-red-500" };
};

// Exportar dados das tabelas para visualização
export const TABELA_FAIXA_CLIENTES = [
  { faixa: "5000", pontuacao: 10 },
  { faixa: "10000", pontuacao: 20 },
  { faixa: "15000", pontuacao: 30 },
  { faixa: "20000", pontuacao: 40 },
  { faixa: "30000", pontuacao: 50 },
  { faixa: "50000", pontuacao: 60 },
];

export const TABELA_STATUS_PREVENTIVO = [
  { status: "Preventivo Urgente", pontuacao: 50 },
  { status: "Preventivo Crítico", pontuacao: 40 },
  { status: "Preventivo Atenção", pontuacao: 30 },
];

export const TABELA_TEMPO_CRIACAO = [
  { tempo: "1 Mês", pontuacao: 1 },
  { tempo: "3 Meses", pontuacao: 3 },
  { tempo: "6 meses", pontuacao: 6 },
  { tempo: "12 ou mais", pontuacao: 15 },
];

export const TABELA_NPS = [
  { nota: "0", pontuacao: 50 },
  { nota: "1", pontuacao: 90 },
  { nota: "2", pontuacao: 80 },
  { nota: "3", pontuacao: 70 },
  { nota: "4", pontuacao: 60 },
  { nota: "5", pontuacao: 50 },
  { nota: "6", pontuacao: 40 },
  { nota: "7", pontuacao: 30 },
  { nota: "8", pontuacao: 20 },
  { nota: "9", pontuacao: 20 },
  { nota: "10", pontuacao: 20 },
];

export const TABELA_FIDELIDADE = [
  { fidelidade: "Total", pontuacao: 50 },
  { fidelidade: "Parcial", pontuacao: 10 },
  { fidelidade: "Sem fidelidade", pontuacao: 30 },
];

export const TABELA_QUANTIDADE_SUGESTOES = [
  { quantidade: "1 a 3", pontuacao: 75 },
  { quantidade: "4 a 10", pontuacao: 50 },
  { quantidade: "10 a 25", pontuacao: 30 },
  { quantidade: "26 ou mais", pontuacao: 10 },
];

export const TABELA_NIVEIS_PRIORIDADE = [
  { scoreAte: "100", nivel: 5, cor: "bg-green-500" },
  { scoreAte: "150", nivel: 4, cor: "bg-lime-500" },
  { scoreAte: "250", nivel: 3, cor: "bg-yellow-500" },
  { scoreAte: "300", nivel: 2, cor: "bg-orange-500" },
  { scoreAte: "400", nivel: 1, cor: "bg-red-500" },
  { scoreAte: "500", nivel: "Urgente", cor: "bg-red-700" },
];
