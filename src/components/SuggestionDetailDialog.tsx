import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Calendar, User, ExternalLink, MessageSquare } from "lucide-react";
import SuggestionComments from "./SuggestionComments";
import { useModules } from "@/contexts/ModulesContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SuggestionDetailDialogProps {
  suggestionId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (id: string) => void;
  suggestions: any[];
}

const SuggestionDetailDialog = ({ suggestionId, isOpen, onClose, onVote, suggestions }: SuggestionDetailDialogProps) => {
  const suggestion = suggestions.find((s) => s.id === suggestionId);
  if (!suggestion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl font-bold mb-2 flex items-center gap-3">
              {suggestion.title}
              {suggestion.isPinned && (
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300 flex items-center gap-1"
                >
                  <svg width="16" height="16" fill="currentColor" className="inline-block mr-1">
                    <circle cx="8" cy="8" r="7" stroke="gold" strokeWidth="2" fill="none" />
                  </svg>
                  Destacada
                </Badge>
              )}
            </DialogTitle>
            <Button
              onClick={() => onVote(suggestion.id)}
              variant={suggestion.hasVoted ? "default" : "outline"}
              className="flex items-center gap-2 px-6 py-2 text-base font-semibold mt-1"
              aria-label={suggestion.hasVoted ? "Remover voto" : "Votar"}
            >
              <ThumbsUp className="w-5 h-5" />
              {suggestion.hasVoted ? "Remover voto" : "Votar"}
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status e informações principais */}
          <div className="flex gap-2 flex-wrap items-center mb-2">
            <Badge style={suggestion.statusColor ? { backgroundColor: suggestion.statusColor, color: "#fff" } : {}} variant="secondary">
              {suggestion.status}
            </Badge>
            <Badge style={suggestion.moduleColor ? { backgroundColor: suggestion.moduleColor, color: "#fff" } : {}}>{suggestion.module}</Badge>
          </div>

          {/* Descrição */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{suggestion.description}</p>
            {/* Imagens da sugestão */}
            {Array.isArray(suggestion.image_urls) && suggestion.image_urls.length > 0 && (
              <div className="mt-4 grid grid-cols-8 gap-3">
                {suggestion.image_urls.map((url: string, idx: number) => (
                  <a href={url} target="_blank" rel="noopener noreferrer" key={idx} className="block">
                    <img
                      src={url}
                      alt={`Imagem ${idx + 1}`}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 object-cover w-20 h-20 hover:opacity-90 transition"
                    />
                  </a>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-medium text-gray-900 dark:text-gray-100">{suggestion.email}</span>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{suggestion.createdAt}</span>
                </div>
              </div>
            </div>
          </div>

          {suggestion.adminResponse && (
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Resposta da Administração:</h3>
              <p className="text-blue-800 dark:text-blue-200 leading-relaxed">{suggestion.adminResponse}</p>
            </div>
          )}
          <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
          <SuggestionComments suggestionId={suggestion.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionDetailDialog;
