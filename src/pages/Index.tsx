import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SuggestionCard from "@/components/SuggestionCard";
import SuggestionDetailDialog from "@/components/SuggestionDetailDialog";
import SuggestionFormDialog from "@/components/SuggestionFormDialog";
import SuggestionActionsModal from "@/components/SuggestionActionsModal";
import FilterBar from "@/components/FilterBar";
import Header from "@/components/Header";
import FavoriteModal from "@/components/FavoriteModal";
import { useMuralNotifications } from "@/components/MuralNotifications";
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
  isFavorited?: boolean;
  tags?: string[];
}

const Index = () => {
  const { suggestions, loading, createSuggestion, voteSuggestion, filterSuggestions } = useSuggestions();
  const { statuses } = useSuggestionStatuses();
  const { modules } = useModules();
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [selectedSuggestionForActions, setSelectedSuggestionForActions] = useState<TransformedSuggestion | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [userEmail, setUserEmail] = useState<string>("");
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [selectedSuggestionForFavorite, setSelectedSuggestionForFavorite] = useState<TransformedSuggestion | null>(null);
  const { showVoteNotification, showFavoriteNotification, showWelcomeNotification } = useMuralNotifications();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  // Transform database suggestions to component format
  const transformedSuggestions: TransformedSuggestion[] = useMemo(
    () =>
      suggestions.map((suggestion: any) => {
        const statusId = (suggestion as any).status_id;
        const statusObj = statuses.find((s) => s.id === statusId);
        const moduleObj = modules.find((m) => m.id === suggestion.module_id);
        
        // Adicionar tags de exemplo baseadas no módulo
        const exampleTags = {
          'Integrações': ['API', 'WhatsApp'],
          'Vendas': ['CRM', 'Pipeline'],
          'Financeiro': ['Cobrança', 'Pagamentos'],
          'Suporte': ['Tickets', 'Chat'],
          'Estoque': ['Inventário', 'Produtos']
        };
        
        // Cores para diferentes status
        const statusColors = {
          'recebido': '#3B82F6',      // Azul
          'em-analise': '#F59E0B',    // Amarelo/Laranja
          'aprovada': '#10B981',      // Verde
          'rejeitada': '#EF4444',     // Vermelho
          'implementada': '#8B5CF6'   // Roxo
        };
        
        // Cores para diferentes módulos
        const moduleColors = {
          'Integrações': '#06B6D4',   // Ciano
          'Vendas': '#F59E0B',        // Laranja
          'Financeiro': '#10B981',    // Verde
          'Suporte': '#8B5CF6',       // Roxo
          'Estoque': '#EC4899',       // Rosa
          'Marketing': '#F97316',     // Laranja escuro
          'RH': '#6366F1',           // Índigo
          'TI': '#64748B'            // Cinza azulado
        };
        
        const moduleName = moduleObj ? moduleObj.nome : suggestion.module_id;
        const tags = exampleTags[moduleName as keyof typeof exampleTags] || [];
        
        // Aplicar cores baseadas no status e módulo
        const statusColor = statusColors[statusObj?.nome as keyof typeof statusColors] || statusObj?.color;
        const moduleColor = moduleColors[moduleName as keyof typeof moduleColors] || moduleObj?.color;
        
        return {
          ...suggestion,
          id: suggestion.id,
          title: suggestion.title,
          description: suggestion.description,
          module: moduleName,
          moduleColor: moduleColor,
          status: statusObj ? statusObj.nome : suggestion.status,
          statusColor: statusColor,
          votes: suggestion.votes,
          hasVoted: suggestion.hasVoted || false,
          createdAt: new Date(suggestion.created_at).toLocaleDateString("pt-BR"),
          email: suggestion.email,
          comments: suggestion.comments_count,
          adminResponse: suggestion.admin_response,
          isPinned: suggestion.is_pinned,
          isPublic: suggestion.is_public,
          isFavorited: favorites.has(suggestion.id),
          tags: tags.slice(0, 1), // Mostrar apenas 1 tag por sugestão
        };
      }),
    [suggestions, statuses, modules, favorites]
  );

  // Mostrar mensagem de boas-vindas
  useEffect(() => {
    if (!hasShownWelcome && transformedSuggestions.length > 0) {
      const timer = setTimeout(() => {
        showWelcomeNotification();
        setHasShownWelcome(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [transformedSuggestions.length, hasShownWelcome, showWelcomeNotification]);

  const handleVote = async (id: string) => {
    const suggestion = transformedSuggestions.find(s => s.id === id);
    const wasVoted = suggestion?.hasVoted || false;
    
    await voteSuggestion(id);
    
    // Mostrar notificação baseada no estado anterior
    showVoteNotification(!wasVoted);
  };

  const handleFavorite = (id: string) => {
    const suggestion = transformedSuggestions.find(s => s.id === id);
    if (!suggestion) return;

    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      // Desfavoritar
      newFavorites.delete(id);
      setFavorites(newFavorites);
      showFavoriteNotification(false);
    } else {
      // Favoritar - abrir modal
      setSelectedSuggestionForFavorite(suggestion);
      setShowFavoriteModal(true);
    }
  };

  const handleFavoriteConfirm = (email: string) => {
    if (selectedSuggestionForFavorite) {
      const newFavorites = new Set(favorites);
      newFavorites.add(selectedSuggestionForFavorite.id);
      setFavorites(newFavorites);
      setUserEmail(email);
      showFavoriteNotification(true);
    }
  };

  const handleCloseFavoriteModal = () => {
    setShowFavoriteModal(false);
    setSelectedSuggestionForFavorite(null);
  };

  const handleAddSuggestion = async (newSuggestion: any) => {
    try {
      console.log("handleAddSuggestion recebeu:", newSuggestion);
      
      const result = await createSuggestion({
        title: newSuggestion.title,
        description: newSuggestion.description,
        module_id: newSuggestion.module_id,
        email: newSuggestion.email,
        youtubeUrl: newSuggestion.youtubeUrl,
        isPublic: newSuggestion.isPublic,
        status_id: newSuggestion.status_id,
        image_urls: newSuggestion.image_urls,
      });
      
      console.log("Sugestão criada com sucesso:", result);
      
      // Fechar o modal após sucesso
      setShowFormDialog(false);
      
    } catch (error) {
      console.error("Error creating suggestion:", error);
      // O erro já é tratado no hook useSuggestions, então não precisamos fazer nada aqui
      // O toast de erro já será exibido pelo createSuggestion
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

  const handleViewDetails = (suggestion: TransformedSuggestion) => {
    setSelectedSuggestionId(suggestion.id);
    setShowDetailDialog(true);
  };

  const handleViewActions = (suggestion: TransformedSuggestion) => {
    setSelectedSuggestionForActions(suggestion);
    setShowActionsModal(true);
  };

  const handleCloseActionsModal = () => {
    setShowActionsModal(false);
    setSelectedSuggestionForActions(null);
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
    <div className="min-h-screen bg-gradient-to-br from-[#f8f8f2] to-[#bd93f9]/10 dark:from-[#282a36] dark:to-[#44475a]">
      <Header onCreateSuggestion={() => setShowFormDialog(true)} />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-[#f8f8f2] mb-6">Mural de Sugestões MK Solutions</h1>
          <p className="text-lg text-gray-600 dark:text-[#bd93f9] max-w-2xl mx-auto">
            Ajude-nos a melhorar nossos produtos! Compartilhe suas ideias, vote nas sugestões e acompanhe o desenvolvimento.
          </p>
        </div>

        <FilterBar
          suggestions={transformedSuggestions}
          filterSuggestions={async (moduleId, statusId, searchTerm, customSortBy) => {
            await filterSuggestions(moduleId, statusId, searchTerm, false, customSortBy);
          }}
        />

        <Tabs defaultValue="cards" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 max-w-2xl mx-auto bg-white dark:bg-[#44475a] border dark:border-[#6272a4]">
            <TabsTrigger
              value="cards"
              className="data-[state=active]:bg-dark_blue_mk data-[state=active]:text-white dark:data-[state=active]:bg-[#bd93f9] dark:data-[state=active]:text-[#282a36] dark:text-[#f8f8f2]"
            >
              Visualização em Card
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-dark_blue_mk data-[state=active]:text-white dark:data-[state=active]:bg-[#bd93f9] dark:data-[state=active]:text-[#282a36] dark:text-[#f8f8f2]"
            >
              Lista
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedSuggestions.map((suggestion) => (
                <SuggestionCard 
                  key={suggestion.id} 
                  suggestion={suggestion} 
                  onVote={handleVote} 
                  onFavorite={handleFavorite} 
                  onClick={handleSuggestionClick} 
                  onViewDetails={handleViewDetails}
                  onViewActions={handleViewActions}
                  layout="card" 
                  isHomePage={true}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <div className="space-y-4">
              {transformedSuggestions.map((suggestion) => (
                <SuggestionCard 
                  key={suggestion.id} 
                  suggestion={suggestion} 
                  onVote={handleVote} 
                  onFavorite={handleFavorite} 
                  onClick={handleSuggestionClick} 
                  onViewDetails={handleViewDetails}
                  onViewActions={handleViewActions}
                  layout="list" 
                  isHomePage={true}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {transformedSuggestions.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma sugestão encontrada com os filtros aplicados.</p>
          </div>
        )}
      </main>

      <SuggestionDetailDialog
        suggestionId={selectedSuggestionId}
        isOpen={showDetailDialog}
        onClose={handleCloseDetailDialog}
        onVote={handleVote}
        suggestions={transformedSuggestions}
      />

      <SuggestionFormDialog isOpen={showFormDialog} onClose={() => setShowFormDialog(false)} onSubmit={handleAddSuggestion} />
      
      <FavoriteModal
        isOpen={showFavoriteModal}
        onClose={handleCloseFavoriteModal}
        onConfirm={handleFavoriteConfirm}
        suggestionTitle={selectedSuggestionForFavorite?.title || ""}
      />

      {selectedSuggestionForActions && (
        <SuggestionActionsModal
          suggestion={selectedSuggestionForActions as any}
          isOpen={showActionsModal}
          onClose={handleCloseActionsModal}
        />
      )}
    </div>
  );
};

export default Index;
