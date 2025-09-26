// src/components/SuggestionActionsModal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  ExternalLink,
  Link,
  Copy,
  Check,
  Settings,
  Flag,
  Archive,
  Star,
  MessageSquare,
  Calendar,
  Code,
  PlayCircle,
} from "lucide-react";
import { PrioritizedSuggestion } from "@/hooks/usePrioritization";
import SuggestionComments from "./SuggestionComments";
import InternalComments from "./InternalComments";

interface SuggestionActionsModalProps {
  suggestion: PrioritizedSuggestion;
  children: React.ReactNode;
}

const SuggestionActionsModal = ({ suggestion, children }: SuggestionActionsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [jiraTaskCode, setJiraTaskCode] = useState("");
  const [linkedJiraTask, setLinkedJiraTask] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isInRoadmap, setIsInRoadmap] = useState(false);
  const [developmentStatus, setDevelopmentStatus] = useState("backlog");
  const [isArchived, setIsArchived] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();

  // Carregar estados salvos do localStorage
  useEffect(() => {
    const savedStates = JSON.parse(localStorage.getItem('suggestionStates') || '{}');
    const suggestionState = savedStates[suggestion.id] || {};
    
    setLinkedJiraTask(suggestionState.jiraTaskCode || null);
    setIsInRoadmap(suggestionState.isInRoadmap || false);
    setDevelopmentStatus(suggestionState.developmentStatus || "backlog");
    setIsArchived(suggestionState.isArchived || false);
  }, [suggestion.id]);

  const handleLinkJiraTask = () => {
    if (!jiraTaskCode.trim()) {
      toast({
        title: "Código obrigatório",
        description: "Por favor, insira o código da tarefa do Jira.",
        variant: "destructive",
      });
      return;
    }

    // Validar formato do código (ex: NI-2933)
    const jiraCodePattern = /^[A-Z]+-\d+$/;
    if (!jiraCodePattern.test(jiraTaskCode.trim())) {
      toast({
        title: "Formato inválido",
        description: "Use o formato: PROJETO-NÚMERO (ex: NI-2933)",
        variant: "destructive",
      });
      return;
    }

    const taskCode = jiraTaskCode.trim();
    setLinkedJiraTask(taskCode);
    
    // Salvar no localStorage
    const savedSuggestions = JSON.parse(localStorage.getItem('suggestionStates') || '{}');
    savedSuggestions[suggestion.id] = {
      ...savedSuggestions[suggestion.id],
      jiraTaskCode: taskCode
    };
    localStorage.setItem('suggestionStates', JSON.stringify(savedSuggestions));
    
    toast({
      title: "Tarefa vinculada!",
      description: `Sugestão vinculada à tarefa ${taskCode} do Jira.`,
      variant: "default",
    });
    setJiraTaskCode("");
  };

  const getJiraUrl = (taskCode: string) => {
    return `https://mkloud.atlassian.net/browse/${taskCode}`;
  };

  const copyJiraLink = async () => {
    if (!linkedJiraTask) return;
    
    const url = getJiraUrl(linkedJiraTask);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      toast({
        title: "Link copiado!",
        description: "Link do Jira copiado para a área de transferência.",
        variant: "default",
      });
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  const openJiraTask = () => {
    if (!linkedJiraTask) return;
    window.open(getJiraUrl(linkedJiraTask), '_blank');
  };

  const handleArchiveSuggestion = () => {
    const newArchivedStatus = !isArchived;
    setIsArchived(newArchivedStatus);
    
    // Salvar no localStorage
    const savedSuggestions = JSON.parse(localStorage.getItem('suggestionStates') || '{}');
    savedSuggestions[suggestion.id] = {
      ...savedSuggestions[suggestion.id],
      isArchived: newArchivedStatus
    };
    localStorage.setItem('suggestionStates', JSON.stringify(savedSuggestions));
    
    if (newArchivedStatus) {
      toast({
        title: "Sugestão arquivada",
        description: "A sugestão foi movida para o arquivo.",
        variant: "default",
      });
    } else {
      toast({
        title: "Sugestão desarquivada",
        description: "A sugestão foi restaurada e está visível novamente.",
        variant: "default",
      });
    }
  };



  const handleAddToFavorites = () => {
    toast({
      title: "Adicionado aos favoritos",
      description: "Sugestão marcada como favorita.",
      variant: "default",
    });
  };

  const handleAddComment = () => {
    setShowComments(!showComments);
  };

  const handleAddToRoadmap = () => {
    const newRoadmapStatus = !isInRoadmap;
    const newDevStatus = newRoadmapStatus ? "in-development" : "backlog";
    
    setIsInRoadmap(newRoadmapStatus);
    setDevelopmentStatus(newDevStatus);
    
    // Salvar no localStorage
    const savedSuggestions = JSON.parse(localStorage.getItem('suggestionStates') || '{}');
    savedSuggestions[suggestion.id] = {
      ...savedSuggestions[suggestion.id],
      isInRoadmap: newRoadmapStatus,
      developmentStatus: newDevStatus,
      roadmapId: newRoadmapStatus ? `roadmap-${Date.now()}` : undefined
    };
    localStorage.setItem('suggestionStates', JSON.stringify(savedSuggestions));
    
    if (newRoadmapStatus) {
      toast({
        title: "Adicionado ao roadmap!",
        description: "Sugestão incluída no roadmap e marcada como 'Em Desenvolvimento'.",
        variant: "default",
      });
    } else {
      toast({
        title: "Removido do roadmap",
        description: "Sugestão removida do roadmap de desenvolvimento.",
        variant: "default",
      });
    }
  };

  const getDevelopmentStatusLabel = (status: string) => {
    switch (status) {
      case "backlog":
        return "📋 Backlog";
      case "in-development":
        return "🔧 Em Desenvolvimento";
      case "testing":
        return "🧪 Em Testes";
      case "completed":
        return "✅ Concluído";
      default:
        return "📋 Backlog";
    }
  };

  const getDevelopmentStatusColor = (status: string) => {
    switch (status) {
      case "backlog":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "in-development":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "testing":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl w-[90vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Ações da Sugestão
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Sugestão */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{suggestion.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Cliente:</span>
                  <span className="ml-2 font-medium">{suggestion.clientData.nome}</span>
                </div>
                <div>
                  <span className="text-gray-600">Score:</span>
                  <span className="ml-2 font-medium">{suggestion.score.toFixed(0)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Votos:</span>
                  <span className="ml-2 font-medium">{suggestion.votes}</span>
                </div>
                <div>
                  <span className="text-gray-600">Comentários:</span>
                  <span className="ml-2 font-medium">{suggestion.comments_count}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vincular Tarefa do Jira */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Link className="w-4 h-4 text-blue-600" />
                Vincular Tarefa do Jira
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!linkedJiraTask ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="jira-code">Código da Tarefa</Label>
                    <Input
                      id="jira-code"
                      placeholder="Ex: NI-2933"
                      value={jiraTaskCode}
                      onChange={(e) => setJiraTaskCode(e.target.value.toUpperCase())}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formato: PROJETO-NÚMERO (ex: NI-2933)
                    </p>
                  </div>
                  <Button onClick={handleLinkJiraTask} className="w-full">
                    <Link className="w-4 h-4 mr-2" />
                    Vincular Tarefa
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">
                          Tarefa Vinculada: {linkedJiraTask}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {getJiraUrl(linkedJiraTask)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyJiraLink}
                          className="border-green-300 hover:bg-green-100"
                        >
                          {copiedLink ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openJiraTask}
                          className="border-green-300 hover:bg-green-100"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLinkedJiraTask(null)}
                          className="border-red-300 hover:bg-red-100 text-red-600"
                        >
                          <Link className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status de Desenvolvimento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Code className="w-4 h-4 text-purple-600" />
                Status de Desenvolvimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">Status Atual</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isInRoadmap ? "Incluído no roadmap" : "Não está no roadmap"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getDevelopmentStatusColor(developmentStatus)}`}>
                    {getDevelopmentStatusLabel(developmentStatus)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddToRoadmap}
                    className={`${
                      isInRoadmap 
                        ? "border-red-300 hover:bg-red-100 text-red-600" 
                        : "border-green-300 hover:bg-green-100 text-green-600"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outras Ações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Outras Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleAddToFavorites}
                  className="flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Adicionar aos Favoritos
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleAddComment}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  {showComments ? "Fechar Comentários" : "Ver Comentários"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleArchiveSuggestion}
                  className={`flex items-center gap-2 ${
                    isArchived 
                      ? "text-green-600 border-green-300 hover:bg-green-50" 
                      : "text-orange-600 border-orange-300 hover:bg-orange-50"
                  }`}
                >
                  <Archive className="w-4 h-4" />
                  {isArchived ? "Desarquivar" : "Arquivar Sugestão"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Comentários */}
        {showComments && (
          <div className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Comentários dos Clientes */}
              <div className="space-y-4">
                <SuggestionComments suggestionId={suggestion.id} />
              </div>
              
              {/* Comentários Internos */}
              <div className="space-y-4">
                <InternalComments suggestionId={suggestion.id} />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionActionsModal;