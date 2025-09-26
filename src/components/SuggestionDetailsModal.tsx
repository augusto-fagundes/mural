// src/components/SuggestionDetailsModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Eye,
  User,
  Users,
  Calendar,
  MessageSquare,
  Star,
  Target,
  BarChart3,
  Building2,
  Shield,
  TrendingUp,
  Clock,
  Award,
  Link,
  ExternalLink,
} from "lucide-react";
import { PrioritizedSuggestion } from "@/hooks/usePrioritization";
import { useSuggestionSync } from "@/contexts/SuggestionSyncContext";
import SuggestionComments from "./SuggestionComments";
import InternalComments from "./InternalComments";


interface SuggestionDetailsModalProps {
  suggestion: PrioritizedSuggestion;
  rank: number;
  children: React.ReactNode;
}

const SuggestionDetailsModal = ({ suggestion, rank, children }: SuggestionDetailsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { getSuggestionState } = useSuggestionSync();
  
  const suggestionState = getSuggestionState(suggestion.id);
  const hasJiraTask = !!suggestionState.jiraTaskCode;
  const isInRoadmap = !!suggestionState.isInRoadmap;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreBreakdown = () => {
    const breakdown = Object.entries(suggestion.scoreDetails).map(([key, value]) => {
      let icon, description, color;
      
      switch (key) {
        case 'Votos':
          icon = <Star className="w-4 h-4" />;
          description = 'Pontuação baseada no número de votos recebidos';
          color = 'text-yellow-600';
          break;
        case 'Faixa de Clientes':
          icon = <Users className="w-4 h-4" />;
          description = 'Pontuação baseada no porte do cliente';
          color = 'text-blue-600';
          break;
        case 'Status Preventivo':
          icon = <Shield className="w-4 h-4" />;
          description = 'Pontuação baseada no status preventivo do cliente';
          color = 'text-green-600';
          break;
        case 'Enterprise':
          icon = <Building2 className="w-4 h-4" />;
          description = 'Bonificação para clientes enterprise';
          color = 'text-purple-600';
          break;
        case 'Tempo da Sugestão':
          icon = <Clock className="w-4 h-4" />;
          description = 'Pontuação baseada no tempo desde a criação';
          color = 'text-orange-600';
          break;
        case 'NPS':
          icon = <TrendingUp className="w-4 h-4" />;
          description = 'Pontuação baseada no NPS do cliente';
          color = 'text-indigo-600';
          break;
        case 'Fidelidade':
          icon = <Award className="w-4 h-4" />;
          description = 'Pontuação baseada na fidelidade do cliente';
          color = 'text-pink-600';
          break;
        case 'Quantidade de Sugestões':
          icon = <BarChart3 className="w-4 h-4" />;
          description = 'Pontuação baseada no histórico de sugestões';
          color = 'text-cyan-600';
          break;
        default:
          icon = <Target className="w-4 h-4" />;
          description = 'Critério de pontuação';
          color = 'text-gray-600';
      }
      
      return { key, value, icon, description, color };
    });
    
    return breakdown;
  };

  const scoreBreakdown = getScoreBreakdown();
  const totalScore = Object.values(suggestion.scoreDetails).reduce((sum, value) => sum + value, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          {children}
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-gray-400">#{rank}</span>
                <DialogTitle className="text-xl">{suggestion.title}</DialogTitle>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{suggestion.clientData.nome}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(suggestion.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{suggestion.votes} votos</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{suggestion.comments_count} comentários</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Badge
                className={`text-2xl px-6 py-3 text-white ${suggestion.nivel.cor}`}
              >
                {suggestion.score.toFixed(0)}
              </Badge>
              <div className="text-sm text-gray-500 mt-2">
                <div>Score Total</div>
                <div className="font-semibold">Nível {suggestion.nivel.nivel}</div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="scoring">Pontuação</TabsTrigger>
            <TabsTrigger value="client">Cliente</TabsTrigger>
            <TabsTrigger value="comments">Comentários</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Descrição da Sugestão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {suggestion.description || 'Nenhuma descrição fornecida.'}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Informações Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Módulo:</span>
                    <Badge variant="outline">{suggestion.module}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="secondary">{suggestion.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prioridade:</span>
                    <Badge className={suggestion.priority === 'alta' ? 'bg-red-100 text-red-800' : 
                                    suggestion.priority === 'media' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-green-100 text-green-800'}>
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Público:</span>
                    <Badge variant={suggestion.is_public ? "default" : "secondary"}>
                      {suggestion.is_public ? 'Sim' : 'Não'}
                    </Badge>
                  </div>
                  {hasJiraTask && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Link className="w-4 h-4" />
                        Tarefa Jira:
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {suggestionState.jiraTaskCode}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`https://mkloud.atlassian.net/browse/${suggestionState.jiraTaskCode}`, '_blank')}
                          className="h-6 w-6 p-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {isInRoadmap && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status Roadmap:</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {suggestionState.developmentStatus === 'in-development' && '🔧 Em Desenvolvimento'}
                        {suggestionState.developmentStatus === 'testing' && '🧪 Em Testes'}
                        {suggestionState.developmentStatus === 'completed' && '✅ Concluído'}
                        {suggestionState.developmentStatus === 'backlog' && '📋 Backlog'}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Métricas de Engajamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de Votos:</span>
                    <span className="font-semibold text-yellow-600">{suggestion.votes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comentários:</span>
                    <span className="font-semibold text-blue-600">{suggestion.comments_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Engajamento:</span>
                    <Badge variant={suggestion.votes > 10 ? "default" : "secondary"}>
                      {suggestion.votes > 10 ? 'Alto' : suggestion.votes > 5 ? 'Médio' : 'Baixo'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Criado em:</span>
                    <span className="text-sm">{formatDate(suggestion.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-600" />
                  Breakdown da Pontuação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scoreBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-white dark:bg-gray-700 ${item.color}`}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-semibold">{item.key}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-2xl font-bold ${item.color}`}>+{item.value}</span>
                        <p className="text-xs text-gray-500">pontos</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-blue-600 text-white">
                          <Target className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-lg font-bold">Score Total</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Soma de todos os critérios</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-blue-600">{totalScore}</span>
                        <p className="text-sm text-gray-500">pontos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="client" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nome da Empresa</label>
                      <p className="text-lg font-semibold">{suggestion.clientData.nome}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Faixa de Clientes</label>
                      <Badge variant="outline" className="mt-1">
                        {suggestion.clientData.faixaClientes} clientes
                      </Badge>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status Preventivo</label>
                      <Badge 
                        className={`mt-1 ${
                          suggestion.clientData.statusPreventivo === 'Preventivo Urgente' ? 'bg-red-100 text-red-800' :
                          suggestion.clientData.statusPreventivo === 'Preventivo Ação' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {suggestion.clientData.statusPreventivo}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">NPS Score</label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-blue-600">{suggestion.clientData.nps}</span>
                        <Badge variant={suggestion.clientData.nps >= 70 ? "default" : suggestion.clientData.nps >= 50 ? "secondary" : "destructive"}>
                          {suggestion.clientData.nps >= 70 ? 'Excelente' : suggestion.clientData.nps >= 50 ? 'Bom' : 'Crítico'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Fidelidade</label>
                      <Badge 
                        variant="outline" 
                        className={`mt-1 ${
                          suggestion.clientData.fidelidade === 'Total' ? 'border-green-500 text-green-700' :
                          suggestion.clientData.fidelidade === 'Parcial' ? 'border-yellow-500 text-yellow-700' :
                          'border-red-500 text-red-700'
                        }`}
                      >
                        {suggestion.clientData.fidelidade}
                      </Badge>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Quantidade de Sugestões</label>
                      <p className="text-lg font-semibold">{suggestion.clientData.quantidadeSugestoes}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Comentários da Sugestão
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Comentários públicos dos clientes */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    Comentários Públicos
                  </h4>
                  <SuggestionComments suggestionId={suggestion.id} />
                </div>

                {/* Separador visual */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

                {/* Comentários internos dos operadores/administradores */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    Comentários Internos
                  </h4>
                  <InternalComments suggestionId={suggestion.id} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionDetailsModal;