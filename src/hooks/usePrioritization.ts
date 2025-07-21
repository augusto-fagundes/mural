// src/hooks/usePrioritization.ts
import { useState, useEffect, useCallback } from "react";
import { useSuggestions } from "./useSuggestions";
import * as config from "@/config/prioritization.config";
import {
  MOCK_CLIENTS,
  DEFAULT_CLIENT_DATA,
  ClientData,
} from "@/data/mockClientData";

export interface PrioritizedSuggestion {
  id: string;
  title: string;
  score: number;
  scoreDetails: Record<string, number | string>;
  clientData: ClientData;
  nivel: { nivel: number | string; cor: string };
}

const getClientDataByEmail = (email: string): ClientData => {
  const client = MOCK_CLIENTS.find(
    (c) => c.email.toLowerCase() === email.toLowerCase()
  );
  return client || { ...DEFAULT_CLIENT_DATA, email: email };
};

export const usePrioritization = () => {
  // --- INÍCIO DA CORREÇÃO ---
  // ANTES (com erro): const { suggestions: suggestionsFromHook, ... } = useSuggestions(true);

  // CORREÇÃO: Chamamos o hook sem parâmetros.
  // Ele nos retorna as sugestões e a função para buscá-las.
  const {
    suggestions: suggestionsFromHook,
    loading: loadingSuggestions,
    fetchSuggestions,
  } = useSuggestions();
  // --- FIM DA CORREÇÃO ---

  const [prioritizedSuggestions, setPrioritizedSuggestions] = useState<
    PrioritizedSuggestion[]
  >([]);
  const [loading, setLoading] = useState(true);

  // NOVO: Usamos useEffect para chamar a função fetchSuggestions assim que o hook for montado.
  // O "true" aqui dentro garante que estamos buscando TODAS as sugestões (públicas e privadas).
  useEffect(() => {
    fetchSuggestions(true);
  }, [fetchSuggestions]);

  const calculateScores = useCallback(() => {
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
          "Qtde Sugestões": `+${scoreQtdeSugestoes}`,
          "Tempo de Casa": `+${scoreTempoCasa}`,
        },
      };
    });

    scored.sort((a, b) => b.score - a.score);
    setPrioritizedSuggestions(scored as PrioritizedSuggestion[]);
    setLoading(false);
  }, [suggestionsFromHook]);

  useEffect(() => {
    // A lógica de cálculo agora depende do 'loadingSuggestions' para ser executada
    if (!loadingSuggestions) {
      calculateScores();
    }
  }, [loadingSuggestions, calculateScores]);

  return { prioritizedSuggestions, loading };
};
