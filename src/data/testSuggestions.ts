// src/data/testSuggestions.ts

export const TEST_SUGGESTIONS: any[] = [];

// Função para adicionar as sugestões de teste ao sistema
export const addTestSuggestions = () => {
  // Esta função pode ser usada para popular o sistema com dados de teste
  console.log('Sugestões de teste carregadas:', TEST_SUGGESTIONS.length);
  return TEST_SUGGESTIONS;
};

// Estatísticas das sugestões de teste
export const getTestSuggestionsStats = () => {
  const stats = {
    total: TEST_SUGGESTIONS.length,
    byStatus: {} as Record<string, number>,
    byModule: {} as Record<string, number>,
    byPriority: {} as Record<string, number>,
    totalVotes: 0,
    totalComments: 0,
    avgVotes: 0,
    avgComments: 0
  };

  TEST_SUGGESTIONS.forEach(suggestion => {
    // Por status
    stats.byStatus[suggestion.status] = (stats.byStatus[suggestion.status] || 0) + 1;
    
    // Por módulo
    stats.byModule[suggestion.module] = (stats.byModule[suggestion.module] || 0) + 1;
    
    // Por prioridade
    stats.byPriority[suggestion.priority] = (stats.byPriority[suggestion.priority] || 0) + 1;
    
    // Totais
    stats.totalVotes += suggestion.votes;
    stats.totalComments += suggestion.comments_count;
  });

  stats.avgVotes = Math.round(stats.totalVotes / stats.total);
  stats.avgComments = Math.round(stats.totalComments / stats.total);

  return stats;
};