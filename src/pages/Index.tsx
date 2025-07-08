import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SuggestionCard from "@/components/SuggestionCard";
import SuggestionDetailDialog from "@/components/SuggestionDetailDialog";
import SuggestionFormDialog from "@/components/SuggestionFormDialog";
import FilterBar from "@/components/FilterBar";
import Header from "@/components/Header";
import { AnonymousEmailDisplay } from "@/components/AnonymousEmailDisplay";
import { useSuggestions } from "@/hooks/useSuggestions";
import { ModulesProvider, useModules } from "@/contexts/ModulesContext";
import { CommentRefreshProvider } from "@/contexts/CommentRefreshContext";
import { useSuggestionStatuses } from "@/hooks/useSuggestionStatuses";

interface TransformedSuggestion {
  id: string;
  title: string;
  description: string;
  module: string;
  moduleColor?: string;
  status: string;
  statusColor?: string;
  votes: number;
  hasVoted: boolean;
  createdAt: string;
  email: string;
  comments: number;
  adminResponse?: string;
  isPinned: boolean;
  isPublic: boolean;
}

const Index = () => {
  const { suggestions, loading, createSuggestion, voteSuggestion, filterSuggestions } = useSuggestions();
  const { statuses } = useSuggestionStatuses();
  const { modules } = useModules();
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Transform database suggestions to component format
  const transformedSuggestions: TransformedSuggestion[] = useMemo(
    () =>
      suggestions.map((suggestion: any) => {
        const statusId = (suggestion as any).status_id;
        const statusObj = statuses.find((s) => s.id === statusId);
        const moduleObj = modules.find((m) => m.id === suggestion.module_id);
        return {
          ...suggestion,
          id: suggestion.id,
          title: suggestion.title,
          description: suggestion.description,
          module: moduleObj ? moduleObj.nome : suggestion.module_id,
          moduleColor: moduleObj ? moduleObj.color : undefined,
          status: statusObj ? statusObj.nome : suggestion.status,
          statusColor: statusObj ? statusObj.color : undefined,
          votes: suggestion.votes,
          hasVoted: suggestion.hasVoted || false,
          createdAt: new Date(suggestion.created_at).toLocaleDateString("pt-BR"),
          email: suggestion.email,
          comments: suggestion.comments_count,
          adminResponse: suggestion.admin_response,
          isPinned: suggestion.is_pinned,
          isPublic: suggestion.is_public,
        };
      }),
    [suggestions, statuses, modules]
  );

  const handleVote = async (id: string) => {
    await voteSuggestion(id);
  };

  const handleAddSuggestion = async (newSuggestion: any) => {
    try {
      await createSuggestion({
        title: newSuggestion.title,
        description: newSuggestion.description,
        module_id: newSuggestion.module_id,
        email: newSuggestion.email,
        youtubeUrl: newSuggestion.youtubeUrl,
        isPublic: newSuggestion.isPublic,
        status_id: newSuggestion.status_id,
        image_urls: newSuggestion.image_urls,
      });
    } catch (error) {
      console.error("Error creating suggestion:", error);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSelectedSuggestionId(suggestion.id);
    setShowDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setShowDetailDialog(false);
    setSelectedSuggestionId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando sugestões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header onCreateSuggestion={() => setShowFormDialog(true)} />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Mural de Sugestões MK Solutions</h1>
          <Tabs defaultValue="suggestions">
            <TabsContent value="suggestions" className="mt-6">
              <div className="text-center mb-8">
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Ajude-nos a melhorar nossos produtos! Compartilhe suas ideias, vote nas sugestões e acompanhe o desenvolvimento.
                </p>
              </div>

              <FilterBar
                suggestions={transformedSuggestions}
                filterSuggestions={async (moduleId: string, statusId: string, searchTerm: string) => {
                  await filterSuggestions(moduleId, statusId, searchTerm);
                }}
              />

              <Tabs defaultValue="cards" className="mt-8">
                <TabsList className="grid w-full grid-cols-2 max-w-2xl mx-auto bg-white dark:bg-gray-800 border dark:border-gray-700">
                  <TabsTrigger
                    value="cards"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:text-gray-300 dark:data-[state=active]:bg-blue-600"
                  >
                    Visualização em Card
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:text-gray-300 dark:data-[state=active]:bg-blue-600"
                  >
                    Lista
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="cards" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {transformedSuggestions.map((suggestion) => (
                      <SuggestionCard key={suggestion.id} suggestion={suggestion} onVote={handleVote} onClick={handleSuggestionClick} layout="card" />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="list" className="mt-6">
                  <div className="space-y-4">
                    {transformedSuggestions.map((suggestion) => (
                      <SuggestionCard key={suggestion.id} suggestion={suggestion} onVote={handleVote} onClick={handleSuggestionClick} layout="list" />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {transformedSuggestions.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma sugestão encontrada com os filtros aplicados.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <SuggestionDetailDialog
        suggestionId={selectedSuggestionId}
        isOpen={showDetailDialog}
        onClose={handleCloseDetailDialog}
        onVote={handleVote}
        suggestions={transformedSuggestions}
      />

      <SuggestionFormDialog isOpen={showFormDialog} onClose={() => setShowFormDialog(false)} onSubmit={handleAddSuggestion} />
    </div>
  );
};

export default Index;
