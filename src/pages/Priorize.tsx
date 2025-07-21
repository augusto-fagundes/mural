// src/pages/Priorize.tsx
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

const PrioritizedSuggestionCard = ({
  suggestion,
  rank,
}: {
  suggestion: PrioritizedSuggestion;
  rank: number;
}) => {
  return (
    <Card
      className="w-full shadow-lg transition-all hover:shadow-xl border-l-4"
      style={{ borderColor: suggestion.nivel.cor }}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-gray-400">#{rank}</span>
            <CardTitle className="text-xl">{suggestion.title}</CardTitle>
          </div>
          <CardDescription>
            Cliente:{" "}
            <span className="font-semibold">{suggestion.clientData.nome}</span>
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
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 border-t pt-4">
          {Object.entries(suggestion.scoreDetails).map(([key, value]) => (
            <div key={key}>
              <span className="font-semibold">{key}: </span>
              <span className="text-blue-600 font-bold">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Prioritize = () => {
  const { prioritizedSuggestions, loading } = usePrioritization();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Calculando prioridades...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Priorização de Sugestões</h1>
        <p className="text-lg text-gray-600 mt-2">
          Sugestões ordenadas por score de prioridade para guiar o
          desenvolvimento.
        </p>
      </div>
      <div className="space-y-4 max-w-4xl mx-auto">
        {prioritizedSuggestions.map((suggestion, index) => (
          <PrioritizedSuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Prioritize;
