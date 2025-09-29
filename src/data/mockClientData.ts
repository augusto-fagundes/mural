// src/data/mockClientData.ts

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

export const MOCK_CLIENTS: ClientData[] = [
  {
    nome: "ALCANS TELECOM LTDA",
    email: "carlos@alcans.com.br",
    total_clientes: 58000,
    status_preventivo: "Preventivo Urgente",
    nps: 0,
    fidelidade: "Total",
    quantidade_sugestoes: 8,
    anos_de_casa: 10,
  },
  {
    nome: "RAZAOINFO INTERNET LTDA",
    email: "ana@razaoinfo.com.br",
    total_clientes: 25000,
    status_preventivo: "Preventivo Atenção",
    nps: 8,
    fidelidade: "Parcial",
    quantidade_sugestoes: 2,
    anos_de_casa: 3,
  },
  {
    nome: "LINK SETE SERVICOS DE INTERNET E REDES LTDA",
    email: "lucia@linksete.com.br",
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
  {
    nome: "Cliente Novo Pequeno",
    email: "cliente.novo@empresa.com",
    total_clientes: 150,
    status_preventivo: "N/A",
    nps: 10,
    fidelidade: "Sem fidelidade",
    quantidade_sugestoes: 1,
    anos_de_casa: 0,
  },
  {
    nome: "MK SOLUTIONS LTDA",
    email: "sistema@mksolution.com",
    total_clientes: 45000,
    status_preventivo: "Preventivo Crítico",
    nps: 2,
    fidelidade: "Total",
    quantidade_sugestoes: 12,
    anos_de_casa: 15,
  },
];

export const DEFAULT_CLIENT_DATA: ClientData = {
  nome: "Cliente Não Identificado",
  email: "",
  total_clientes: 0,
  status_preventivo: "N/A",
  nps: 5,
  fidelidade: "Sem fidelidade",
  quantidade_sugestoes: 1,
  anos_de_casa: 0,
};
