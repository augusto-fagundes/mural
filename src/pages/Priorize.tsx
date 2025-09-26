// src/pages/Priorize.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  usePrioritization,
  PrioritizedSuggestion,
} from "@/hooks/usePrioritization";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvancedPrioritizationFilters from "@/components/AdvancedPrioritizationFilters";
import PriorityLevelsDisplay from "@/components/PriorityLevelsDisplay";

import BatchActions from "@/components/BatchActions";
import SuggestionDetailsModal from "@/components/SuggestionDetailsModal";
import SuggestionAdminActionsModal from "@/components/SuggestionAdminActionsModal";
import ScoreConfigurationModal, {
  ScoreConfig,
} from "@/components/ScoreConfigurationModal";
import AnalyticsDashboardModal from "@/components/AnalyticsDashboardModal";
import { useSuggestionSync } from "@/contexts/SuggestionSyncContext";
import {
  ArrowLeft,
  BarChart3,
  Calculator,
  TrendingUp,
  GitCompare,
  Eye,
  Settings,
  Link,
  Calendar,
  Code,
  ExternalLink,
  Filter,
} from "lucide-react";

const PrioritizedSuggestionCard = ({
  suggestion,
  rank,
}: {
  suggestion: PrioritizedSuggestion;
  rank: number;
}) => {
  const { hasJiraTask, isInRoadmap, getDevelopmentStatus } =
    useSuggestionSync();

  const hasJira = hasJiraTask(suggestion.id);
  const inRoadmap = isInRoadmap(suggestion.id);
  const devStatus = getDevelopmentStatus(suggestion.id);

  return (
    <div className="relative">
      <SuggestionDetailsModal suggestion={suggestion} rank={rank}>
        <Card
          className="w-full shadow-lg transition-all hover:shadow-xl border-l-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
          style={{ borderColor: suggestion.nivel.cor }}
        >
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-bold text-gray-400">#{rank}</span>
                <CardTitle className="text-xl flex items-center gap-2">
                  {suggestion.title}
                  <div className="flex items-center gap-1">
                    {hasJira && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200"
                      >
                        <Link className="w-3 h-3 mr-1" />
                        Jira
                      </Badge>
                    )}
                    {inRoadmap && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-1 bg-green-50 text-green-700 border-green-200"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Roadmap
                      </Badge>
                    )}
                    {devStatus !== "backlog" && (
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-1 bg-purple-50 text-purple-700 border-purple-200"
                      >
                        <Code className="w-3 h-3 mr-1" />
                        {devStatus === "in-development" && "Em Dev"}
                        {devStatus === "testing" && "Testes"}
                        {devStatus === "completed" && "Concluído"}
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </div>
              <CardDescription className="flex items-center justify-between">
                <span>
                  Cliente:{" "}
                  <span className="font-semibold">
                    {suggestion.clientData.nome}
                  </span>
                </span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-600">★</span>
                    {suggestion.votes} votos
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-blue-600">💬</span>
                    {suggestion.comments_count} comentários
                  </span>
                </div>
              </CardDescription>
            </div>
            <div className="text-center">
              <Badge
                className={`text-lg px-4 py-2 text-white ${suggestion.nivel.cor}`}
              >
                {suggestion.score.toFixed(0)}
              </Badge>
              <span className="text-xs text-gray-500 mt-1 block">
                Score: Nível {suggestion.nivel.nivel}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
              <div className="flex items-center gap-4">
                <span>
                  Módulo: <strong>{suggestion.module}</strong>
                </span>
                <span>
                  Status: <strong>{suggestion.status}</strong>
                </span>
                <span>
                  Prioridade: <strong>{suggestion.priority}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Botões de Status */}
                {hasJira && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      const savedStates = JSON.parse(
                        localStorage.getItem("suggestionStates") || "{}"
                      );
                      const jiraCode = savedStates[suggestion.id]?.jiraTaskCode;
                      if (jiraCode) {
                        window.open(
                          `https://mkloud.atlassian.net/browse/${jiraCode}`,
                          "_blank"
                        );
                      }
                    }}
                    className="h-7 px-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  >
                    <Link className="w-3 h-3 mr-1" />
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
                {inRoadmap && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="h-7 px-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="text-xs">
                      {devStatus === "in-development" && "Dev"}
                      {devStatus === "testing" && "Test"}
                      {devStatus === "completed" && "Done"}
                    </span>
                  </Button>
                )}

                <div className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">Ver detalhes</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </SuggestionDetailsModal>
      
      {/* Botão de Ações Administrativas - Fora do modal de detalhes */}
      <div className="absolute top-2 right-2 z-10">
        <SuggestionAdminActionsModal suggestion={suggestion}>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-sm border-gray-300 hover:bg-gray-50 shadow-md h-8 px-2"
          >
            <Settings className="w-3 h-3" />
          </Button>
        </SuggestionAdminActionsModal>
      </div>
    </div>
  );
};

const PrioritizedSuggestionListItem = ({
  suggestion,
  rank,
}: {
  suggestion: PrioritizedSuggestion;
  rank: number;
}) => {
  const { hasJiraTask, isInRoadmap, getDevelopmentStatus } =
    useSuggestionSync();

  const hasJira = hasJiraTask(suggestion.id);
  const inRoadmap = isInRoadmap(suggestion.id);
  const devStatus = getDevelopmentStatus(suggestion.id);

  return (
    <SuggestionDetailsModal suggestion={suggestion} rank={rank}>
      <Card className="w-full shadow-sm transition-all hover:shadow-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-xl font-bold text-gray-400">#{rank}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{suggestion.title}</p>
                <div className="flex items-center gap-1">
                  {hasJira && (
                    <Badge
                      variant="outline"
                      className="text-xs px-1 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
                    >
                      <Link className="w-3 h-3" />
                    </Badge>
                  )}
                  {inRoadmap && (
                    <Badge
                      variant="outline"
                      className="text-xs px-1 py-0.5 bg-green-50 text-green-700 border-green-200"
                    >
                      <Calendar className="w-3 h-3" />
                    </Badge>
                  )}
                  {devStatus !== "backlog" && (
                    <Badge
                      variant="outline"
                      className="text-xs px-1 py-0.5 bg-purple-50 text-purple-700 border-purple-200"
                    >
                      <Code className="w-3 h-3" />
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                <span>Cliente: {suggestion.clientData.nome}</span>
                <span>★ {suggestion.votes} votos</span>
                <span>💬 {suggestion.comments_count} comentários</span>
                <span>Módulo: {suggestion.module}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Botões de Status */}
            <div className="flex items-center gap-2">
              {hasJira && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    const savedStates = JSON.parse(
                      localStorage.getItem("suggestionStates") || "{}"
                    );
                    const jiraCode = savedStates[suggestion.id]?.jiraTaskCode;
                    if (jiraCode) {
                      window.open(
                        `https://mkloud.atlassian.net/browse/${jiraCode}`,
                        "_blank"
                      );
                    }
                  }}
                  className="h-8 px-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  <Link className="w-3 h-3 mr-1" />
                  <ExternalLink className="w-3 h-3" />
                </Button>
              )}
              {inRoadmap && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="h-8 px-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  <span className="text-xs">
                    {devStatus === "in-development" && "Dev"}
                    {devStatus === "testing" && "Test"}
                    {devStatus === "completed" && "Done"}
                  </span>
                </Button>
              )}
            </div>

            <div className="text-center">
              <Badge
                className={`text-md px-3 py-1 text-white ${suggestion.nivel.cor}`}
              >
                {suggestion.score.toFixed(0)}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">Score</p>
            </div>
            <div className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
              <Eye className="w-4 h-4" />
              <span className="text-xs font-medium">Detalhes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </SuggestionDetailsModal>
  );
};

const Prioritize = () => {
  const {
    prioritizedSuggestions,
    filteredSuggestions,
    loading,
    sortBy,
    setSortBy,
    filters,
    handleFiltersChange,
  } = usePrioritization();
  const navigate = useNavigate();
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleConfigSave = (config: ScoreConfig) => {
    // Aqui você pode implementar a lógica para aplicar as configurações
    // Por exemplo, salvar no localStorage ou enviar para uma API
    localStorage.setItem("scoreConfig", JSON.stringify(config));

    // Recarregar as sugestões com as novas configurações
    window.location.reload();
  };

  // Calcular distribuição dos níveis de prioridade
  const priorityDistribution = filteredSuggestions.reduce((acc, suggestion) => {
    const nivel = String(suggestion.nivel.nivel);
    const existing = acc.find((item) => String(item.nivel) === nivel);
    if (existing) {
      existing.count++;
    } else {
      acc.push({
        nivel: suggestion.nivel.nivel,
        count: 1,
        color: suggestion.nivel.cor,
      });
    }
    return acc;
  }, [] as { nivel: string | number; count: number; color: string }[]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Calculando prioridades...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Mural
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setAnalyticsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Button>
            <Button
              variant="outline"
              onClick={() => setConfigModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Configurações de Score
            </Button>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold">Priorize</h1>
          </div>
          {/* <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Sistema inteligente de priorização baseado em múltiplos critérios
            para guiar o desenvolvimento do ERP. As sugestões são ordenadas por
            score calculado automaticamente.
          </p> */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* Níveis de Prioridade */}
        <section>
          <PriorityLevelsDisplay currentScores={priorityDistribution} />
        </section>



        {/* Resultados */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    Sugestões
                  </CardTitle>
                  <CardDescription>
                    {filteredSuggestions.length} de{" "}
                    {prioritizedSuggestions.length} sugestões
                    {filteredSuggestions.length !==
                      prioritizedSuggestions.length && " (filtradas)"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filtros
                    {filteredSuggestions.length !== prioritizedSuggestions.length && (
                      <Badge variant="secondary" className="ml-1">
                        {filteredSuggestions.length}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {/* Filtros Avançados */}
            {filtersOpen && (
              <div className="px-6 pb-4">
                <AdvancedPrioritizationFilters
                  suggestions={prioritizedSuggestions}
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  totalItems={prioritizedSuggestions.length}
                  filteredCount={filteredSuggestions.length}
                />
              </div>
            )}
            
            <CardContent>
              {/* Sistema de Ações em Lote */}
              <BatchActions suggestions={filteredSuggestions} />
              <Tabs defaultValue="cards" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-sm">
                  <TabsTrigger value="cards">
                    Visualização detalhada
                  </TabsTrigger>
                  <TabsTrigger value="list">Lista simples</TabsTrigger>
                </TabsList>

                <TabsContent value="cards" className="mt-6">
                  {filteredSuggestions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <BarChart3 className="w-16 h-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Nenhuma sugestão encontrada
                      </h3>
                      <p className="text-gray-500 dark:text-gray-500">
                        Ajuste os filtros para ver mais resultados
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredSuggestions.map((suggestion, index) => (
                        <PrioritizedSuggestionCard
                          key={suggestion.id}
                          suggestion={suggestion}
                          rank={index + 1}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="list" className="mt-6">
                  {filteredSuggestions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <BarChart3 className="w-16 h-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Nenhuma sugestão encontrada
                      </h3>
                      <p className="text-gray-500 dark:text-gray-500">
                        Ajuste os filtros para ver mais resultados
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredSuggestions.map((suggestion, index) => (
                        <PrioritizedSuggestionListItem
                          key={suggestion.id}
                          suggestion={suggestion}
                          rank={index + 1}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </main>

      <ScoreConfigurationModal
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
        onSave={handleConfigSave}
      />

      <AnalyticsDashboardModal
        suggestions={prioritizedSuggestions}
        open={analyticsModalOpen}
        onOpenChange={setAnalyticsModalOpen}
      />
    </div>
  );
};

export default Prioritize;
