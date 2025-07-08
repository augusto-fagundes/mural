import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronUp, MessageCircle, Calendar, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModules } from "@/contexts/ModulesContext";
import { useCommentCount } from "@/hooks/useCommentCount";
import { useSuggestionStatuses } from "@/hooks/useSuggestionStatuses";

interface Suggestion {
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
  isPinned?: boolean;
}

interface SuggestionCardProps {
  suggestion: Suggestion;
  onVote: (id: string) => void;
  onClick: (suggestion: Suggestion) => void;
  layout?: "card" | "list";
}

const statusMap: Record<string, string> = {
  recebido: "Recebido",
  "em-analise": "Em análise",
  aprovada: "Aprovada",
  rejeitada: "Rejeitada",
  implementada: "Implementada",
};

const getStatusStyle = (statusName: string, statuses: any[]) => {
  const status = statuses.find((s) => s.nome === statusName);
  if (status?.color) {
    return {
      backgroundColor: status.color,
      color: "#fff",
      borderColor: status.color,
    };
  }
  return {};
};

const getModuleStyle = (moduleName: string, modules: any[]) => {
  const module = modules.find((m) => m.nome === moduleName);
  if (module?.color) {
    return {
      backgroundColor: module.color,
      color: "#fff",
      borderColor: module.color,
    };
  }
  return {};
};

const SuggestionCard = ({ suggestion, onVote, onClick, layout = "card" }: SuggestionCardProps) => {
  const commentCount = useCommentCount(suggestion.id);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent opening when clicking on vote button
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    onClick(suggestion);
  };

  const handleVoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onVote(suggestion.id);
  };

  if (layout === "list") {
    return (
      <Card
        className={cn(
          "transition-all duration-200 hover:shadow-md border-l-4 cursor-pointer",
          suggestion.isPinned ? "border-l-yellow-400 bg-yellow-50" : "border-l-blue-400"
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                {suggestion.isPinned && <Pin className="w-4 h-4 text-yellow-600" />}
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">{suggestion.title}</h3>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{suggestion.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {suggestion.createdAt}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {commentCount} comentários
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  className={cn("border font-medium px-3 py-1")}
                  style={suggestion.statusColor ? { backgroundColor: suggestion.statusColor, color: "#fff" } : {}}
                >
                  {suggestion.status}
                </Badge>
                <Badge
                  className={cn("border font-medium px-3 py-1")}
                  style={suggestion.moduleColor ? { backgroundColor: suggestion.moduleColor, color: "#fff" } : {}}
                >
                  {suggestion.module}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-6">
              <button
                onClick={handleVoteClick}
                className={cn(
                  "flex flex-col items-center justify-center px-4 py-3 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                  suggestion.hasVoted
                    ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
                    : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                )}
              >
                <ChevronUp className="w-5 h-5 mb-1" />
                <span className="text-sm font-bold">{suggestion.votes}</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        suggestion.isPinned && "ring-2 ring-yellow-400 bg-yellow-50"
      )}
      onClick={handleCardClick}
    >
      {suggestion.isPinned && (
        <div className="bg-yellow-400 text-yellow-900 px-3 py-1 text-xs font-medium flex items-center gap-1">
          <Pin className="w-3 h-3" />
          Sugestão Fixada
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{suggestion.title}</h3>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge
                className={cn("border font-medium px-3 py-1")}
                style={suggestion.statusColor ? { backgroundColor: suggestion.statusColor, color: "#fff" } : {}}
              >
                {suggestion.status}
              </Badge>
              <Badge
                className={cn("border font-medium px-3 py-1")}
                style={suggestion.moduleColor ? { backgroundColor: suggestion.moduleColor, color: "#fff" } : {}}
              >
                {suggestion.module}
              </Badge>
            </div>
          </div>

          <button
            onClick={handleVoteClick}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ml-3",
              suggestion.hasVoted
                ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
                : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
            )}
          >
            <ChevronUp className="w-5 h-5 mb-1" />
            <span className="text-sm font-bold">{suggestion.votes}</span>
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-600 mb-4 line-clamp-3">{suggestion.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">{suggestion.email.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{suggestion.createdAt}</span>
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{commentCount}</span>
          </div>
        </div>

        {suggestion.adminResponse && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium mb-1">Resposta da equipe MK:</p>
            <p className="text-sm text-blue-700">{suggestion.adminResponse}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestionCard;
