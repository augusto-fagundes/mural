// src/hooks/useSuggestionStates.ts
import { useState, useEffect } from 'react';

interface SuggestionState {
  jiraTaskCode?: string;
  isInRoadmap?: boolean;
  developmentStatus?: "backlog" | "in-development" | "testing" | "completed";
  roadmapId?: string;
  isArchived?: boolean;
}

interface SuggestionStates {
  [suggestionId: string]: SuggestionState;
}

export const useSuggestionStates = () => {
  const [suggestionStates, setSuggestionStates] = useState<SuggestionStates>({});

  // Carregar estados do localStorage na inicialização
  useEffect(() => {
    const savedStates = localStorage.getItem('suggestionStates');
    if (savedStates) {
      try {
        setSuggestionStates(JSON.parse(savedStates));
      } catch (error) {
        console.error('Erro ao carregar estados das sugestões:', error);
      }
    }
  }, []);

  // Função para obter o estado de uma sugestão específica
  const getSuggestionState = (suggestionId: string): SuggestionState => {
    return suggestionStates[suggestionId] || {};
  };

  // Função para atualizar o estado de uma sugestão
  const updateSuggestionState = (suggestionId: string, newState: Partial<SuggestionState>) => {
    const updatedStates = {
      ...suggestionStates,
      [suggestionId]: {
        ...suggestionStates[suggestionId],
        ...newState
      }
    };
    
    setSuggestionStates(updatedStates);
    localStorage.setItem('suggestionStates', JSON.stringify(updatedStates));
  };

  // Função para verificar se uma sugestão tem tarefa do Jira vinculada
  const hasJiraTask = (suggestionId: string): boolean => {
    return !!suggestionStates[suggestionId]?.jiraTaskCode;
  };

  // Função para verificar se uma sugestão está no roadmap
  const isInRoadmap = (suggestionId: string): boolean => {
    return !!suggestionStates[suggestionId]?.isInRoadmap;
  };

  // Função para verificar se uma sugestão está arquivada
  const isArchived = (suggestionId: string): boolean => {
    return !!suggestionStates[suggestionId]?.isArchived;
  };

  // Função para obter o status de desenvolvimento
  const getDevelopmentStatus = (suggestionId: string): string => {
    return suggestionStates[suggestionId]?.developmentStatus || 'backlog';
  };

  return {
    suggestionStates,
    getSuggestionState,
    updateSuggestionState,
    hasJiraTask,
    isInRoadmap,
    isArchived,
    getDevelopmentStatus
  };
};

export type { SuggestionState, SuggestionStates };