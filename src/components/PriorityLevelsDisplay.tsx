// src/components/PriorityLevelsDisplay.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  TrendingUp,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TABELA_NIVEIS_PRIORIDADE } from "@/config/prioritization.config";

interface PriorityLevelsDisplayProps {
  currentScores?: { nivel: string | number; count: number; color: string }[];
}

const PriorityLevelsDisplay = ({ currentScores }: PriorityLevelsDisplayProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const getLevelDescription = (nivel: string | number) => {
    switch (String(nivel)) {
      case "Urgente":
        return "Implementação imediata necessária";
      case "1":
        return "Prioridade muito alta";
      case "2":
        return "Prioridade alta";
      case "3":
        return "Prioridade média";
      case "4":
        return "Prioridade baixa";
      case "5":
        return "Prioridade muito baixa";
      default:
        return "Nível de prioridade";
    }
  };

  const getLevelIcon = (nivel: string | number) => {
    switch (String(nivel)) {
      case "Urgente":
        return <AlertTriangle className="w-4 h-4" />;
      case "1":
      case "2":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors py-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  Níveis de Prioridade
                </CardTitle>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Classificação automática baseada no score total calculado
                </p>
              </div>
              {isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
        <div className="space-y-3">
          {TABELA_NIVEIS_PRIORIDADE.map((item, index) => {
            const currentCount = currentScores?.find(
              (score) => String(score.nivel) === String(item.nivel)
            )?.count || 0;

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full ${item.cor} flex items-center justify-center text-white text-xs font-bold`}>
                    {String(item.nivel) === "Urgente" ? "!" : item.nivel}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {getLevelIcon(item.nivel)}
                      <span className="font-semibold">
                        Nível {item.nivel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getLevelDescription(item.nivel)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Score {item.scoreAte === "500" ? "≥ 500" : `≤ ${item.scoreAte}`}
                    </Badge>
                    {currentScores && (
                      <Badge 
                        variant={currentCount > 0 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {currentCount} sugestão{currentCount !== 1 ? "ões" : ""}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legenda explicativa */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Como funciona a classificação?
          </h4>
          <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
            <p>• O score é calculado automaticamente somando pontos de diferentes critérios</p>
            <p>• Quanto maior o score, maior a prioridade da sugestão</p>
            <p>• As cores ajudam a identificar rapidamente o nível de urgência</p>
            <p>• Sugestões "Urgentes" (score ≥ 500) precisam de atenção imediata</p>
          </div>
        </div>

            {/* Distribuição visual */}
            {currentScores && currentScores.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-sm mb-3">Distribuição atual das sugestões</h4>
                <div className="flex h-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {currentScores.map((score, index) => {
                    const total = currentScores.reduce((sum, s) => sum + s.count, 0);
                    const percentage = total > 0 ? (score.count / total) * 100 : 0;
                    
                    return percentage > 0 ? (
                      <div
                        key={index}
                        className={score.color}
                        style={{ width: `${percentage}%` }}
                        title={`Nível ${score.nivel}: ${score.count} sugestões (${percentage.toFixed(1)}%)`}
                      />
                    ) : null;
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>Baixa prioridade</span>
                  <span>Alta prioridade</span>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default PriorityLevelsDisplay;