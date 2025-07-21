// src/data/mockClientData.ts

// 1. Definimos a estrutura (interface) dos dados de um cliente
export interface ClientData {
  nome: string;
  email: string;
  total_clientes: number;
  status_preventivo:
    | "Preventivo Urgente"
    | "Preventivo Crítico"
    | "Preventivo Atenção"
    | "N/A";
  nps: number;
  fidelidade: "Total" | "Parcial" | "Sem fidelidade";
  quantidade_sugestoes: number;
  anos_de_casa: number;
}

// 2. Criamos uma lista de clientes mockados, baseada na sua planilha
export const MOCK_CLIENTS: ClientData[] = [
  {
    nome: "VETORIAL.NET INFORMATICA E SERVICOS DE INTERNET LTDA",
    email: "carlos@empresa.com",
    total_clientes: 12000,
    status_preventivo: "Preventivo Crítico",
    nps: 2,
    fidelidade: "Total",
    quantidade_sugestoes: 8,
    anos_de_casa: 6,
  },
  {
    nome: "RAZAOINFO INTERNET LTDA",
    email: "ana@empresa.com",
    total_clientes: 25000,
    status_preventivo: "Preventivo Atenção",
    nps: 8,
    fidelidade: "Parcial",
    quantidade_sugestoes: 2,
    anos_de_casa: 3,
  },
  {
    nome: "LINK SETE SERVICOS DE INTERNET E REDES LTDA",
    email: "lucia@empresa.com",
    total_clientes: 55000,
    status_preventivo: "Preventivo Urgente",
    nps: 1,
    fidelidade: "Total",
    quantidade_sugestoes: 15,
    anos_de_casa: 8,
  },
  {
    nome: "Cliente Comum Teste",
    email: "pedro@empresa.com",
    total_clientes: 300,
    status_preventivo: "N/A",
    nps: 9,
    fidelidade: "Sem fidelidade",
    quantidade_sugestoes: 1,
    anos_de_casa: 1,
  },
];

// 3. Criamos um cliente padrão para sugestões cujo e-mail não esteja na lista
export const DEFAULT_CLIENT_DATA: ClientData = {
  nome: "Cliente Não Identificado",
  email: "",
  total_clientes: 0,
  status_preventivo: "N/A",
  nps: 5, // Uma nota neutra
  fidelidade: "Sem fidelidade",
  quantidade_sugestoes: 1,
  anos_de_casa: 0,
};
