import { createContext, useContext, useState } from "react";

const CommentRefreshContext = createContext<{
  refresh: number;
  triggerRefresh: () => void;
}>({
  refresh: 0,
  triggerRefresh: () => {},
});

export const CommentRefreshProvider = ({ children }: { children: React.ReactNode }) => {
  const [refresh, setRefresh] = useState(0);

  const triggerRefresh = () => setRefresh((r) => r + 1);

  return (
    <CommentRefreshContext.Provider value={{ refresh, triggerRefresh }}>
      {children}
    </CommentRefreshContext.Provider>
  );
};

export const useCommentRefresh = () => useContext(CommentRefreshContext); 