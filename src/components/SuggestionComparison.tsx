// src/components/SuggestionComparison.tsx
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  GitCompare,
  Star,
  MessageSquare,
  Users,
  Calendar,
  Target,
  TrendingUp,
  Award,
  X,
  Plus,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { PrioritizedSuggestion } from "@/hooks/usePrioritization";

interface SuggestionComparisonProps {
  suggestions: PrioritizedSuggestion[];
}

const SuggestionComparison = ({ suggestions }: SuggestionComparisonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<PrioritizedSuggestion[]>([]);
  const [availableSuggestions, setAvailableSuggestions] = useState(suggestions);

  const addSuggestion = (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion && selectedSuggestions.length < 4) {
      setSelectedSuggestions(prev => [...prev, suggestion]);
      setAvailableSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    }
  };

  const removeSuggestion = (suggestionId: string) => {
    const suggestion = selectedSuggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      setSelectedSuggestions(prev => prev.filter(s => s.id !== suggestionId));
      setAvailableSuggestions(prev => [...prev, suggestion].sort((a, b) => b.score - a.score));
    }
  };

  const resetComparison = () => {
    setSelectedSuggestions([]);
    setAvailableSuggestions(suggestions);
  };

  const getComparisonInsights = () => {
    if (selectedSuggestions.length < 2) return null;

    const scores = selectedSuggestions.map(s => s.score);
    const votes = selectedSuggestions.map(s => s.votes);
    const comments = selectedSuggestions.map(s => s.comments_count);

    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    const mostVoted = selectedSuggestions.find(s => s.votes === Math.max(...votes));
    const mostCommented = selectedSuggestions.find(s => s.comments_count === Math.max(...comments));
    const highestScored = selectedSuggestions.find(s => s.score === highestScore);

    return {
      highestScore,
      lowestScore,
      avgScore: Math.round(avgScore),
      scoreDifference: highestScore - lowestScore,
      mostVoted,
      mostCommented,
      highestScored,
    };
  };

  const insights = getComparisonInsights();

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "text-green-600 bg-green-50";
    if (percentage >= 70) return "text-blue-600 bg-blue-50";
    if (percentage >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const ComparisonCard = ({ suggestion, index }: { suggestion: PrioritizedSuggestion; index: number }) => (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
            <Badge 
              className={`${suggestion.nivel.cor} text-white`}
            >
              Nível {suggestion.nivel.nivel}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeSuggestion(suggestion.id)}
            className="h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardTitle className="text-lg line-clamp-2">{suggestion.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{suggestion.score}</p>
            <p className="text-xs text-gray-500">Score Total</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{suggestion.votes}</p>
            <p className="text-xs text-gray-500">Votos</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Cliente:</span>
            <span className="font-medium text-right text-xs">
              {suggestion.clientData.nome.length > 20 
                ? suggestion.clientData.nome.substring(0, 20) + "..."
                : suggestion.clientData.nome
              }
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Comentários:</span>
            <span className="font-medium">{suggestion.comments_count}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">NPS Cliente:</span>
            <span className="font-medium">{suggestion.clientData.nps}</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-xs text-gray-600 mb-2">Breakdown do Score:</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {Object.entries(suggestion.scoreDetails).slice(0, 4).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-500 truncate">{key.substring(0, 8)}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <GitCompare className="w-4 h-4 mr-2" />
          Comparar
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-blue-600" />
            Comparação de Sugestões
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Controles */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select onValueChange={addSuggestion} disabled={selectedSuggestions.length >= 4}>
                <SelectTrigger className="w-80">
                  <SelectValue placeholder="Adicionar sugestão para comparar..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSuggestions.slice(0, 20).map((suggestion) => (
                    <SelectItem key={suggestion.id} value={suggestion.id}>
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{suggestion.title}</span>
                        <Badge variant="outline" className="ml-2">
                          {suggestion.score}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary">
                {selectedSuggestions.length}/4 selecionadas
              </Badge>
            </div>
            <Button variant="outline" onClick={resetComparison} disabled={selectedSuggestions.length === 0}>
              Limpar Tudo
            </Button>
          </div>

          {/* Cards de Comparação */}
          {selectedSuggestions.length > 0 ? (
            <div className={`grid gap-4 ${
              selectedSuggestions.length === 1 ? "grid-cols-1 max-w-md mx-auto" :
              selectedSuggestions.length === 2 ? "grid-cols-1 lg:grid-cols-2" :
              selectedSuggestions.length === 3 ? "grid-cols-1 lg:grid-cols-3" :
              "grid-cols-1 lg:grid-cols-2 xl:grid-cols-4"
            }`}>
              {selectedSuggestions.map((suggestion, index) => (
                <ComparisonCard key={suggestion.id} suggestion={suggestion} index={index} />
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <GitCompare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Nenhuma sugestão selecionada
                </h3>
                <p className="text-gray-500 mb-4">
                  Selecione até 4 sugestões para comparar lado a lado
                </p>
                <Button onClick={() => {
                  // Adiciona automaticamente as 2 primeiras sugestões
                  if (suggestions.length >= 2) {
                    setSelectedSuggestions([suggestions[0], suggestions[1]]);
                    setAvailableSuggestions(suggestions.slice(2));
                  }
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Comparar Top 2
                </Button>
              </div>
            </Card>
          )}

          {/* Insights da Comparação */}
          {insights && selectedSuggestions.length >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Insights da Comparação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Score Médio</p>
                    <p className="text-2xl font-bold text-blue-600">{insights.avgScore}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Maior Score</p>
                    <p className="text-2xl font-bold text-green-600">{insights.highestScore}</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Menor Score</p>
                    <p className="text-2xl font-bold text-orange-600">{insights.lowestScore}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Diferença</p>
                    <p className="text-2xl font-bold text-purple-600">{insights.scoreDifference}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <Award className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100">
                        Maior Score: {insights.highestScored?.title}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-200">
                        Score: {insights.highestScored?.score} | Cliente: {insights.highestScored?.clientData.nome}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <Star className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">
                        Mais Votada: {insights.mostVoted?.title}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-200">
                        {insights.mostVoted?.votes} votos | Score: {insights.mostVoted?.score}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-purple-900 dark:text-purple-100">
                        Mais Comentada: {insights.mostCommented?.title}
                      </p>
                      <p className="text-sm text-purple-700 dark:text-purple-200">
                        {insights.mostCommented?.comments_count} comentários | Score: {insights.mostCommented?.score}
                      </p>
                    </div>
                  </div>

                  {insights.scoreDifference > 200 && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                          Grande Diferença de Score
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-200">
                          Há uma diferença significativa de {insights.scoreDifference} pontos entre as sugestões
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabela Comparativa Detalhada */}
          {selectedSuggestions.length >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Comparação Detalhada</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Critério</TableHead>
                      {selectedSuggestions.map((_, index) => (
                        <TableHead key={index} className="text-center">
                          Sugestão {index + 1}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Score Total</TableCell>
                      {selectedSuggestions.map((suggestion) => (
                        <TableCell key={suggestion.id} className="text-center">
                          <Badge className={getScoreColor(suggestion.score, insights?.highestScore || 0)}>
                            {suggestion.score}
                          </Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Votos</TableCell>
                      {selectedSuggestions.map((suggestion) => (
                        <TableCell key={suggestion.id} className="text-center">
                          {suggestion.votes}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Comentários</TableCell>
                      {selectedSuggestions.map((suggestion) => (
                        <TableCell key={suggestion.id} className="text-center">
                          {suggestion.comments_count}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Nível de Prioridade</TableCell>
                      {selectedSuggestions.map((suggestion) => (
                        <TableCell key={suggestion.id} className="text-center">
                          <Badge className={suggestion.nivel.cor}>
                            {suggestion.nivel.nivel}
                          </Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">NPS do Cliente</TableCell>
                      {selectedSuggestions.map((suggestion) => (
                        <TableCell key={suggestion.id} className="text-center">
                          {suggestion.clientData.nps}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Fidelidade</TableCell>
                      {selectedSuggestions.map((suggestion) => (
                        <TableCell key={suggestion.id} className="text-center text-xs">
                          {suggestion.clientData.fidelidade}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionComparison;