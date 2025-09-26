// src/hooks/usePrioritization.ts
import { useState, useEffect, useCallback } from "react";
import { useSuggestions } from "./useSuggestions";
import * as config from "@/config/prioritization.config";
import {
  MOCK_CLIENTS,
  DEFAULT_CLIENT_DATA,
  ClientData,
} from "@/data/mockClientData";
import { FilterState } from "@/components/AdvancedPrioritizationFilters";

export interface PrioritizedSuggestion {
  id: string;
  title: string;
  description: string;
  email: string;
  votes: number;
  comments_count: number;
  created_at: string;
  module: string;
  status: string;
  priority: string;
  is_public: boolean;
  score: number;
  scoreDetails: Record<string, number | string>;
  clientData: ClientData;
  nivel: { nivel: number | string; cor: string };
  isArchived?: boolean;
  developmentStatus?: "backlog" | "in-development" | "testing" | "completed";
  roadmapId?: string;
  jiraTaskCode?: string;
}

const getClientDataByEmail = (email: string): ClientData => {
  const client = MOCK_CLIENTS.find(
    (c) => c.email.toLowerCase() === email.toLowerCase()
  );
  return client || { ...DEFAULT_CLIENT_DATA, email: email };
};

export const usePrioritization = () => {
  const {
    suggestions: suggestionsFromHook,
    loading: loadingSuggestions,
    fetchSuggestions,
  } = useSuggestions();
  const [prioritizedSuggestions, setPrioritizedSuggestions] = useState<
    PrioritizedSuggestion[]
  >([]);
  const [loading, setLoading] = useState(true);
  // 1. NOVO: Estado para controlar a ordenação
  const [sortBy, setSortBy] = useState<"score" | "votes" | "comments">("score");
  // 2. NOVO: Estado para filtros avançados
  const [filters, setFilters] = useState<FilterState>({
    sortBy: "score",
    nivelPrioridade: [],
    faixaClientes: "all",
    statusPreventivo: [],
    clienteEnterprise: "all",
    npsRange: [0, 10],
    fidelidade: [],
    scoreRange: [0, 1000],
  });
  const [filteredSuggestions, setFilteredSuggestions] = useState<PrioritizedSuggestion[]>([]);

  useEffect(() => {
    fetchSuggestions(true);
  }, [fetchSuggestions]);

  const applyFilters = useCallback((suggestions: PrioritizedSuggestion[], currentFilters: FilterState) => {
    let filtered = [...suggestions];

    // Filtro por nível de prioridade
    if (currentFilters.nivelPrioridade.length > 0) {
      filtered = filtered.filter((s) =>
        currentFilters.nivelPrioridade.includes(String(s.nivel.nivel))
      );
    }

    // Filtro por faixa de clientes
    if (currentFilters.faixaClientes !== "all") {
      filtered = filtered.filter((s) => {
        const totalClientes = s.clientData.total_clientes;
        switch (currentFilters.faixaClientes) {
          case "0-5000":
            return totalClientes <= 5000;
          case "5001-10000":
            return totalClientes > 5000 && totalClientes <= 10000;
          case "10001-15000":
            return totalClientes > 10000 && totalClientes <= 15000;
          case "15001-20000":
            return totalClientes > 15000 && totalClientes <= 20000;
          case "20001-30000":
            return totalClientes > 20000 && totalClientes <= 30000;
          case "30001-50000":
            return totalClientes > 30000 && totalClientes <= 50000;
          case "50001+":
            return totalClientes > 50000;
          default:
            return true;
        }
      });
    }

    // Filtro por status preventivo
    if (currentFilters.statusPreventivo.length > 0) {
      filtered = filtered.filter((s) =>
        currentFilters.statusPreventivo.includes(s.clientData.status_preventivo)
      );
    }

    // Filtro por cliente enterprise
    if (currentFilters.clienteEnterprise !== "all") {
      filtered = filtered.filter((s) => {
        const isEnterprise = config.CLIENTES_ENTERPRISE.includes(
          s.clientData.nome.toUpperCase()
        );
        return currentFilters.clienteEnterprise === "enterprise" ? isEnterprise : !isEnterprise;
      });
    }

    // Filtro por NPS
    if (currentFilters.npsRange[0] > 0 || currentFilters.npsRange[1] < 10) {
      filtered = filtered.filter((s) =>
        s.clientData.nps >= currentFilters.npsRange[0] &&
        s.clientData.nps <= currentFilters.npsRange[1]
      );
    }

    // Filtro por fidelidade
    if (currentFilters.fidelidade.length > 0) {
      filtered = filtered.filter((s) =>
        currentFilters.fidelidade.includes(s.clientData.fidelidade)
      );
    }

    // Filtro por score
    if (currentFilters.scoreRange[0] > 0 || currentFilters.scoreRange[1] < 1000) {
      filtered = filtered.filter((s) =>
        s.score >= currentFilters.scoreRange[0] &&
        s.score <= currentFilters.scoreRange[1]
      );
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (currentFilters.sortBy) {
        case "votes":
          return b.votes - a.votes;
        case "comments":
          return b.comments_count - a.comments_count;
        case "score":
        default:
          return b.score - a.score;
      }
    });

    return filtered;
  }, []);

  const calculateAndSort = useCallback(() => {
    if (suggestionsFromHook.length === 0) {
      setLoading(false);
      return;
    }

    const scored = suggestionsFromHook.map((suggestion: any) => {
      const clientData = getClientDataByEmail(suggestion.email);

      const scoreVotos = suggestion.votes * config.PONTUACAO_POR_VOTO;
      const scoreFaixa = config.getPontuacaoPorFaixaClientes(
        clientData.total_clientes
      );
      const scorePreventivo =
        config.PONTUACAO_STATUS_PREVENTIVO[clientData.status_preventivo] || 0;
      const scoreEnterprise = config.CLIENTES_ENTERPRISE.includes(
        clientData.nome.toUpperCase()
      )
        ? config.PONTUACAO_CLIENTE_ENTERPRISE
        : 0;
      const scoreData = config.getPontuacaoPorDataCriacao(
        suggestion.created_at
      );
      const scoreNPS = config.PONTUACAO_NPS[clientData.nps] || 0;
      const scoreFidelidade =
        config.PONTUACAO_FIDELIDADE[clientData.fidelidade] || 0;
      const scoreQtdeSugestoes = config.getPontuacaoPorQuantidadeSugestoes(
        clientData.quantidade_sugestoes
      );
      const scoreTempoCasa = config.getPontuacaoPorTempoDeCasa(
        clientData.anos_de_casa
      );

      const totalScore =
        scoreVotos +
        scoreFaixa +
        scorePreventivo +
        scoreEnterprise +
        scoreData +
        scoreNPS +
        scoreFidelidade +
        scoreQtdeSugestoes +
        scoreTempoCasa;

      return {
        id: suggestion.id,
        title: suggestion.title,
        description: suggestion.description,
        email: suggestion.email,
        votes: suggestion.votes,
        comments_count: suggestion.comments_count,
        created_at: suggestion.created_at,
        module: suggestion.module,
        status: suggestion.status,
        priority: suggestion.priority,
        is_public: suggestion.is_public,
        score: totalScore,
        clientData: clientData,
        nivel: config.getNivelPrioridade(totalScore),
        scoreDetails: {
          Votos: `+${scoreVotos}`,
          "Faixa de Clientes": `+${scoreFaixa}`,
          "Status Preventivo": `+${scorePreventivo}`,
          Enterprise: `+${scoreEnterprise}`,
          "Tempo da Sugestão": `+${scoreData}`,
          NPS: `+${scoreNPS}`,
          Fidelidade: `+${scoreFidelidade}`,
          "Qtde Sugestoões": `+${scoreQtdeSugestoes}`,
          "Tempo de Casa": `+${scoreTempoCasa}`,
        },
      };
    });

    setPrioritizedSuggestions(scored as PrioritizedSuggestion[]);
    
    // Aplicar filtros
    const filtered = applyFilters(scored as PrioritizedSuggestion[], filters);
    setFilteredSuggestions(filtered);
    
    setLoading(false);
  }, [suggestionsFromHook, filters, applyFilters]);

  useEffect(() => {
    if (!loadingSuggestions) {
      calculateAndSort();
    }
  }, [loadingSuggestions, calculateAndSort]);

  // Atualizar filtros quando sortBy muda
  useEffect(() => {
    setFilters(prev => ({ ...prev, sortBy }));
  }, [sortBy]);

  // Aplicar filtros quando mudam
  useEffect(() => {
    if (prioritizedSuggestions.length > 0) {
      const filtered = applyFilters(prioritizedSuggestions, filters);
      setFilteredSuggestions(filtered);
    }
  }, [prioritizedSuggestions, filters, applyFilters]);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setSortBy(newFilters.sortBy);
  }, []);

  // 3. NOVO: Retorna dados para filtros avançados
  return { 
    prioritizedSuggestions, 
    filteredSuggestions,
    loading, 
    sortBy, 
    setSortBy,
    filters,
    handleFiltersChange
  };
};
