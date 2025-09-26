// src/components/BatchActions.tsx
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckSquare,
  Square,
  MoreVertical,
  Download,
  Star,
  MessageSquare,
  Target,
  Trash2,
  Edit,
  Copy,
  Archive,
  Tag,
  Command,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PrioritizedSuggestion } from "@/hooks/usePrioritization";

interface BatchActionsProps {
  suggestions: PrioritizedSuggestion[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

const BatchActions = ({ suggestions, onSelectionChange }: BatchActionsProps) => {
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [showBatchPanel, setShowBatchPanel] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + A - Selecionar todos
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        handleSelectAll();
      }
      
      // Escape - Limpar seleção
      if (event.key === 'Escape') {
        handleClearSelection();
      }
      
      // Ctrl/Cmd + E - Exportar selecionados
      if ((event.ctrlKey || event.metaKey) && event.key === 'e' && selectedIds.length > 0) {
        event.preventDefault();
        handleExportSelected();
      }
      

    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds]);

  useEffect(() => {
    setShowBatchPanel(selectedIds.length > 0);
    onSelectionChange?.(selectedIds);
  }, [selectedIds, onSelectionChange]);

  const handleSelectAll = () => {
    if (selectedIds.length === suggestions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(suggestions.map(s => s.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleToggleSelection = (suggestionId: string) => {
    setSelectedIds(prev => 
      prev.includes(suggestionId)
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId]
    );
  };

  const handleExportSelected = () => {
    const selectedSuggestions = suggestions.filter(s => selectedIds.includes(s.id));
    
    // Gerar CSV das sugestões selecionadas
    const headers = ['Título', 'Score', 'Cliente', 'Prioridade', 'Votos', 'Comentários'];
    const rows = selectedSuggestions.map(s => [
      `"${s.title.replace(/"/g, '""')}"`,
      s.score,
      `"${s.clientData.nome.replace(/"/g, '""')}"`,
      `"Nível ${s.nivel.nivel}"`,
      s.votes,
      s.comments_count
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sugestoes_selecionadas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Exportação concluída!",
      description: `${selectedSuggestions.length} sugestões exportadas com sucesso.`,
    });
  };



  const handleBulkAction = (action: string) => {
    const count = selectedIds.length;
    
    switch (action) {
      case 'archive':
        toast({
          title: "Sugestões arquivadas",
          description: `${count} sugestões foram arquivadas.`,
        });
        break;
      case 'priority-high':
        toast({
          title: "Prioridade alterada",
          description: `${count} sugestões marcadas como alta prioridade.`,
        });
        break;
      case 'priority-low':
        toast({
          title: "Prioridade alterada",
          description: `${count} sugestões marcadas como baixa prioridade.`,
        });
        break;
      case 'tag':
        toast({
          title: "Tags adicionadas",
          description: `Tags aplicadas a ${count} sugestões.`,
        });
        break;
      case 'delete':
        toast({
          title: "Sugestões removidas",
          description: `${count} sugestões foram removidas.`,
          variant: "destructive",
        });
        break;
    }
    
    handleClearSelection();
  };

  const getSelectedSuggestions = () => {
    return suggestions.filter(s => selectedIds.includes(s.id));
  };

  const getSelectionStats = () => {
    const selected = getSelectedSuggestions();
    const totalScore = selected.reduce((sum, s) => sum + s.score, 0);
    const avgScore = selected.length > 0 ? Math.round(totalScore / selected.length) : 0;
    const totalVotes = selected.reduce((sum, s) => sum + s.votes, 0);
    
    return { totalScore, avgScore, totalVotes, count: selected.length };
  };

  const stats = getSelectionStats();



  return (
    <>
      {/* Painel de Ações em Lote */}
      {showBatchPanel && (
        <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">
                    {selectedIds.length} sugestão{selectedIds.length !== 1 ? 'ões' : ''} selecionada{selectedIds.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Score Total: <strong>{stats.totalScore}</strong></span>
                  <span>Média: <strong>{stats.avgScore}</strong></span>
                  <span>Votos: <strong>{stats.totalVotes}</strong></span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportSelected}
                  disabled={selectedIds.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                

                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4 mr-2" />
                      Ações
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleBulkAction('priority-high')}>
                      <Target className="w-4 h-4 mr-2" />
                      Marcar como Alta Prioridade
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('priority-low')}>
                      <Target className="w-4 h-4 mr-2" />
                      Marcar como Baixa Prioridade
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction('tag')}>
                      <Tag className="w-4 h-4 mr-2" />
                      Adicionar Tags
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('archive')}>
                      <Archive className="w-4 h-4 mr-2" />
                      Arquivar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleBulkAction('delete')}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                >
                  Limpar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controles de Seleção */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="flex items-center gap-2"
          >
            {selectedIds.length === suggestions.length ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            {selectedIds.length === suggestions.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
          </Button>
          
          {selectedIds.length > 0 && (
            <Badge variant="secondary">
              {selectedIds.length} de {suggestions.length} selecionadas
            </Badge>
          )}
        </div>
        

      </div>



      {/* Estilos CSS para seleção */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .suggestion-item {
            position: relative;
          }
          
          .suggestion-item:hover .selection-checkbox {
            opacity: 1;
          }
          
          .selection-checkbox {
            position: absolute;
            top: 12px;
            left: 12px;
            z-index: 10;
            opacity: 0;
            transition: opacity 0.2s;
          }
          
          .suggestion-item.selected .selection-checkbox {
            opacity: 1;
          }
          
          .suggestion-item.selected {
            ring: 2px;
            ring-color: rgb(59 130 246);
            border-color: rgb(59 130 246);
          }
        `
      }} />
    </>
  );
};

export default BatchActions;