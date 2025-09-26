// src/contexts/SuggestionSyncContext.tsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

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

interface SuggestionSyncContextType {
  suggestionStates: SuggestionStates;
  getSuggestionState: (suggestionId: string) => SuggestionState;
  updateSuggestionState: (suggestionId: string, newState: Partial<SuggestionState>) => void;
  hasJiraTask: (suggestionId: string) => boolean;
  isInRoadmap: (suggestionId: string) => boolean;
  isArchived: (suggestionId: string) => boolean;
  getDevelopmentStatus: (suggestionId: string) => string;
  // Funções para notificar mudanças
  subscribeToChanges: (callback: (suggestionId: string, newState: SuggestionState) => void) => () => void;
  // Funções específicas para ações administrativas
  linkToJira: (suggestionId: string, jiraCode: string) => void;
  addToRoadmap: (suggestionId: string, roadmapId: string) => void;
  removeFromRoadmap: (suggestionId: string) => void;
  updateDevelopmentStatus: (suggestionId: string, status: SuggestionState['developmentStatus']) => void;
  archiveSuggestion: (suggestionId: string) => void;
  unarchiveSuggestion: (suggestionId: string) => void;
}

const SuggestionSyncContext = createContext<SuggestionSyncContextType | undefined>(undefined);

export const SuggestionSyncProvider = ({ children }: { children: React.ReactNode }) => {
  const [suggestionStates, setSuggestionStates] = useState<SuggestionStates>({});
  const [subscribers, setSubscribers] = useState<Set<(suggestionId: string, newState: SuggestionState) => void>>(new Set());

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

  // Função para notificar todos os subscribers sobre mudanças
  const notifySubscribers = useCallback((suggestionId: string, newState: SuggestionState) => {
    subscribers.forEach(callback => {
      try {
        callback(suggestionId, newState);
      } catch (error) {
        console.error('Erro ao notificar subscriber:', error);
      }
    });
  }, [subscribers]);

  // Função para obter o estado de uma sugestão específica
  const getSuggestionState = useCallback((suggestionId: string): SuggestionState => {
    return suggestionStates[suggestionId] || {};
  }, [suggestionStates]);

  // Função para atualizar o estado de uma sugestão
  const updateSuggestionState = useCallback((suggestionId: string, newState: Partial<SuggestionState>) => {
    const currentState = suggestionStates[suggestionId] || {};
    const updatedState = { ...currentState, ...newState };
    
    const updatedStates = {
      ...suggestionStates,
      [suggestionId]: updatedState
    };
    
    setSuggestionStates(updatedStates);
    localStorage.setItem('suggestionStates', JSON.stringify(updatedStates));
    
    // Notificar todos os subscribers sobre a mudança
    notifySubscribers(suggestionId, updatedState);
  }, [suggestionStates, notifySubscribers]);

  // Função para verificar se uma sugestão tem tarefa do Jira vinculada
  const hasJiraTask = useCallback((suggestionId: string): boolean => {
    return !!suggestionStates[suggestionId]?.jiraTaskCode;
  }, [suggestionStates]);

  // Função para verificar se uma sugestão está no roadmap
  const isInRoadmap = useCallback((suggestionId: string): boolean => {
    return !!suggestionStates[suggestionId]?.isInRoadmap;
  }, [suggestionStates]);

  // Função para verificar se uma sugestão está arquivada
  const isArchived = useCallback((suggestionId: string): boolean => {
    return !!suggestionStates[suggestionId]?.isArchived;
  }, [suggestionStates]);

  // Função para obter o status de desenvolvimento
  const getDevelopmentStatus = useCallback((suggestionId: string): string => {
    return suggestionStates[suggestionId]?.developmentStatus || 'backlog';
  }, [suggestionStates]);

  // Função para se inscrever em mudanças
  const subscribeToChanges = useCallback((callback: (suggestionId: string, newState: SuggestionState) => void) => {
    setSubscribers(prev => new Set([...prev, callback]));
    
    // Retorna função para cancelar a inscrição
    return () => {
      setSubscribers(prev => {
        const newSet = new Set(prev);
        newSet.delete(callback);
        return newSet;
      });
    };
  }, []);

  // Funções específicas para ações administrativas
  const linkToJira = useCallback((suggestionId: string, jiraCode: string) => {
    updateSuggestionState(suggestionId, { jiraTaskCode: jiraCode });
  }, [updateSuggestionState]);

  const addToRoadmap = useCallback((suggestionId: string, roadmapId: string) => {
    updateSuggestionState(suggestionId, { 
      isInRoadmap: true, 
      roadmapId: roadmapId,
      developmentStatus: 'in-development'
    });
  }, [updateSuggestionState]);

  const removeFromRoadmap = useCallback((suggestionId: string) => {
    updateSuggestionState(suggestionId, { 
      isInRoadmap: false, 
      roadmapId: undefined,
      developmentStatus: 'backlog'
    });
  }, [updateSuggestionState]);

  const updateDevelopmentStatus = useCallback((suggestionId: string, status: SuggestionState['developmentStatus']) => {
    updateSuggestionState(suggestionId, { developmentStatus: status });
  }, [updateSuggestionState]);

  const archiveSuggestion = useCallback((suggestionId: string) => {
    updateSuggestionState(suggestionId, { isArchived: true });
  }, [updateSuggestionState]);

  const unarchiveSuggestion = useCallback((suggestionId: string) => {
    updateSuggestionState(suggestionId, { isArchived: false });
  }, [updateSuggestionState]);

  const value: SuggestionSyncContextType = {
    suggestionStates,
    getSuggestionState,
    updateSuggestionState,
    hasJiraTask,
    isInRoadmap,
    isArchived,
    getDevelopmentStatus,
    subscribeToChanges,
    linkToJira,
    addToRoadmap,
    removeFromRoadmap,
    updateDevelopmentStatus,
    archiveSuggestion,
    unarchiveSuggestion
  };

  return (
    <SuggestionSyncContext.Provider value={value}>
      {children}
    </SuggestionSyncContext.Provider>
  );
};

export const useSuggestionSync = () => {
  const context = useContext(SuggestionSyncContext);
  if (context === undefined) {
    throw new Error('useSuggestionSync must be used within a SuggestionSyncProvider');
  }
  return context;
};

export type { SuggestionState, SuggestionStates };