// src/components/SuggestionAdminActionsModal.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSuggestionSync } from "@/contexts/SuggestionSyncContext";
import {
  ExternalLink,
  Link,
  Copy,
  Check,
  Settings,
  Flag,
  Archive,
  Calendar,
  Code,
  PlayCircle,
  Shield,
  UserCheck,
} from "lucide-react";
import { PrioritizedSuggestion } from "@/hooks/usePrioritization";

interface SuggestionAdminActionsModalProps {
  suggestion: PrioritizedSuggestion;
  children: React.ReactNode;
}

const SuggestionAdminActionsModal = ({ suggestion, children }: SuggestionAdminActionsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [jiraTaskCode, setJiraTaskCode] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const { toast } = useToast();
  
  const {
    getSuggestionState,
    linkToJira,
    addToRoadmap,
    removeFromRoadmap,
    updateDevelopmentStatus,
    archiveSuggestion,
    unarchiveSuggestion
  } = useSuggestionSync();

  const suggestionState = getSuggestionState(suggestion.id);
  const linkedJiraTask = suggestionState.jiraTaskCode || null;
  const isInRoadmap = suggestionState.isInRoadmap || false;
  const developmentStatus = suggestionState.developmentStatus || "backlog";
  const isArchived = suggestionState.isArchived || false;

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
    linkToJira(suggestion.id, taskCode);
    
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
    if (isArchived) {
      unarchiveSuggestion(suggestion.id);
      toast({
        title: "Sugestão desarquivada",
        description: "A sugestão foi restaurada do arquivo.",
        variant: "default",
      });
    } else {
      archiveSuggestion(suggestion.id);
      toast({
        title: "Sugestão arquivada",
        description: "A sugestão foi movida para o arquivo.",
        variant: "default",
      });
    }
  };

  const handleAddToRoadmap = () => {
    if (isInRoadmap) {
      removeFromRoadmap(suggestion.id);
      toast({
        title: "Removido do roadmap",
        description: "Sugestão removida do roadmap de desenvolvimento.",
        variant: "default",
      });
    } else {
      addToRoadmap(suggestion.id);
      toast({
        title: "Adicionado ao roadmap!",
        description: "Sugestão incluída no roadmap e marcada como 'Em Desenvolvimento'.",
        variant: "default",
      });
    }
  };

  const handleDevelopmentStatusChange = (newStatus: string) => {
    updateDevelopmentStatus(suggestion.id, newStatus);
    
    toast({
      title: "Status atualizado",
      description: `Status de desenvolvimento alterado para: ${getDevelopmentStatusLabel(newStatus)}`,
      variant: "default",
    });
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
      
      <DialogContent className="max-w-3xl w-[90vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Ações Administrativas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Sugestão */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                {suggestion.title}
              </CardTitle>
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
                      onChange={(e) => setJiraTaskCode(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleLinkJiraTask} className="w-full">
                    <Link className="w-4 h-4 mr-2" />
                    Vincular Tarefa
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Vinculado: {linkedJiraTask}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyJiraLink}
                        className="flex items-center gap-1"
                      >
                        {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedLink ? "Copiado!" : "Copiar"}
                      </Button>
                      <Button
                        size="sm"
                        onClick={openJiraTask}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Abrir
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setLinkedJiraTask(null);
                      saveState({ jiraTaskCode: null });
                    }}
                    className="w-full"
                  >
                    Desvincular Tarefa
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gerenciamento de Roadmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="w-4 h-4 text-purple-600" />
                Gerenciar Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status no Roadmap:</span>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  isInRoadmap ? "bg-purple-100 text-purple-800 border-purple-300" : "bg-gray-100 text-gray-800 border-gray-300"
                }`}>
                  {isInRoadmap ? "✅ No Roadmap" : "❌ Fora do Roadmap"}
                </div>
              </div>
              
              <Button
                onClick={handleAddToRoadmap}
                variant={isInRoadmap ? "destructive" : "default"}
                className="w-full"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {isInRoadmap ? "Remover do Roadmap" : "Adicionar ao Roadmap"}
              </Button>

              {isInRoadmap && (
                <div className="space-y-3 pt-4 border-t">
                  <Label>Status de Desenvolvimento:</Label>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDevelopmentStatusColor(developmentStatus)}`}>
                      {getDevelopmentStatusLabel(developmentStatus)}
                    </div>
                  </div>
                  <Select value={developmentStatus} onValueChange={handleDevelopmentStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="backlog">📋 Backlog</SelectItem>
                      <SelectItem value="in-development">🔧 Em Desenvolvimento</SelectItem>
                      <SelectItem value="testing">🧪 Em Testes</SelectItem>
                      <SelectItem value="completed">✅ Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ações de Arquivo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Archive className="w-4 h-4 text-gray-600" />
                Gerenciar Arquivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Status do Arquivo:</span>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  isArchived ? "bg-orange-100 text-orange-800 border-orange-300" : "bg-green-100 text-green-800 border-green-300"
                }`}>
                  {isArchived ? "📦 Arquivado" : "📂 Ativo"}
                </div>
              </div>
              
              <Button
                onClick={handleArchiveSuggestion}
                variant={isArchived ? "default" : "outline"}
                className={`w-full ${
                  isArchived 
                    ? "" 
                    : "text-orange-600 border-orange-300 hover:bg-orange-50"
                }`}
              >
                <Archive className="w-4 h-4 mr-2" />
                {isArchived ? "Desarquivar Sugestão" : "Arquivar Sugestão"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionAdminActionsModal;