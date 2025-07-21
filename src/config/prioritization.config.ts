// src/config/prioritization.config.ts

// Pontuação por Voto (NOVO)
export const PONTUACAO_POR_VOTO = 2; // Cada voto vale 2 pontos

// 1. Faixa de Clientes
const PONTUACAO_FAIXA_CLIENTES: { [faixa: number]: number } = {
  5000: 10,
  10000: 20,
  15000: 30,
  20000: 40,
  30000: 50,
  50000: 60,
  60000: 80,
};

export const getPontuacaoPorFaixaClientes = (totalClientes: number): number => {
  let pontuacao = 0;
  // Ordena as faixas para garantir a lógica correta
  const sortedFaixas = Object.keys(PONTUACAO_FAIXA_CLIENTES)
    .map(Number)
    .sort((a, b) => a - b);

  for (const faixa of sortedFaixas) {
    if (totalClientes <= faixa) {
      return PONTUACAO_FAIXA_CLIENTES[faixa];
    }
  }
  return PONTUACAO_FAIXA_CLIENTES[60000]; // Retorna o máximo se passar de todos
};

// 2. Cliente Preventivo
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

// 4. Data de Criação (em meses)
export const getPontuacaoPorDataCriacao = (data: string): number => {
  const dataCriacao = new Date(data);
  const hoje = new Date();
  const meses =
    (hoje.getFullYear() - dataCriacao.getFullYear()) * 12 +
    (hoje.getMonth() - dataCriacao.getMonth());

  if (meses <= 1) return 1;
  if (meses <= 3) return 3;
  if (meses <= 6) return 8;
  if (meses <= 12) return 15;
  return 15; // Mais de 12 meses
};

// 5. NPS
export const PONTUACAO_NPS: { [nota: number]: number } = {
  0: 50,
  1: 80,
  2: 90,
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

// 7. Quantidade de Sugestões
export const getPontuacaoPorQuantidadeSugestoes = (
  quantidade: number
): number => {
  if (quantidade <= 3) return 75;
  if (quantidade <= 10) return 50;
  if (quantidade <= 25) return 30;
  return 10;
};

// 8. Tempo de Casa (em anos)
export const getPontuacaoPorTempoDeCasa = (anos: number): number => {
  // A planilha original tem texto, vamos converter para um valor numérico de anos
  if (anos <= 5) return 10; // "2016-2020"
  if (anos <= 9) return 20; // "2021-2025"
  return 30;
};

// Níveis de Prioridade
export const getNivelPrioridade = (
  score: number
): { nivel: number | string; cor: string } => {
  if (score <= 100) return { nivel: 5, cor: "bg-green-500" };
  if (score <= 150) return { nivel: 4, cor: "bg-lime-500" };
  if (score <= 250) return { nivel: 3, cor: "bg-yellow-500" };
  if (score <= 300) return { nivel: 2, cor: "bg-orange-500" };
  if (score <= 400) return { nivel: 1, cor: "bg-red-500" };
  return { nivel: "Urgente", cor: "bg-red-700" };
};
