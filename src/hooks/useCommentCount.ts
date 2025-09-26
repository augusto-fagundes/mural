import { useState, useEffect } from "react";
import { useCommentRefresh } from "@/contexts/CommentRefreshContext";

export const useCommentCount = (suggestionId: string) => {
  const [count, setCount] = useState(0);
  const { refreshTrigger } = useCommentRefresh();

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        // Simular contagem de comentários mock baseada no ID da sugestão
        const mockCounts: { [key: string]: number } = {
          'test-1': 5,
          'test-2': 3,
          'test-3': 8,
          'test-4': 2,
          'test-5': 12,
          'test-6': 1,
          'test-7': 7,
          'test-8': 4,
          'test-9': 9,
          'test-10': 6,
          'test-11': 3,
          'test-12': 11,
          'test-13': 2,
          'test-14': 5,
          'test-15': 8,
        };
        
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setCount(mockCounts[suggestionId] || 2);
      } catch (error) {
        console.error("Error fetching comment count:", error);
        setCount(2); // Fallback para 2 comentários
      }
    };

    fetchCommentCount();
  }, [suggestionId, refreshTrigger]);

  return count;
};