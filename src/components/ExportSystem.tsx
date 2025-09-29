// src/components/ExportSystem.tsx
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Table,
  BarChart3,
  Calendar,
  Users,
  Target,
  CheckCircle,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PrioritizedSuggestion } from "@/hooks/usePrioritization";

interface ExportSystemProps {
  suggestions: PrioritizedSuggestion[];
  analytics?: any;
}

const ExportSystem = ({ suggestions, analytics }: ExportSystemProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportType, setExportType] = useState("suggestions");
  const [selectedFields, setSelectedFields] = useState({
    title: true,
    score: true,
    client: true,
    priority: true,
    votes: true,
    comments: true,
    scoreDetails: false,
    createdAt: false,
  });
  const [dateRange, setDateRange] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    { value: "pdf", label: "PDF", icon: FileText, description: "Relatório formatado para impressão" },
    { value: "excel", label: "Excel", icon: Table, description: "Planilha para análise de dados" },
    { value: "csv", label: "CSV", icon: BarChart3, description: "Dados tabulares simples" },
  ];

  const exportTypes = [
    { value: "suggestions", label: "Lista de Sugestões", description: "Exportar sugestões priorizadas" },
    { value: "analytics", label: "Relatório de Analytics", description: "Métricas e gráficos" },
    { value: "summary", label: "Resumo Executivo", description: "Visão geral para gestores" },
  ];

  const fieldOptions = [
    { key: "title", label: "Título da Sugestão", required: true },
    { key: "score", label: "Score de Priorização", required: false },
    { key: "client", label: "Cliente", required: false },
    { key: "priority", label: "Nível de Prioridade", required: false },
    { key: "votes", label: "Votos", required: false },
    { key: "comments", label: "Comentários", required: false },
    { key: "scoreDetails", label: "Detalhes do Score", required: false },
    { key: "createdAt", label: "Data de Criação", required: false },
  ];

  const handleFieldChange = (field: string, checked: boolean) => {
    setSelectedFields(prev => ({ ...prev, [field]: checked }));
  };

  const generateCSV = () => {
    const headers = [];
    const rows = [];

    // Cabeçalhos
    if (selectedFields.title) headers.push("Título");
    if (selectedFields.score) headers.push("Score");
    if (selectedFields.client) headers.push("Cliente");
    if (selectedFields.priority) headers.push("Prioridade");
    if (selectedFields.votes) headers.push("Votos");
    if (selectedFields.comments) headers.push("Comentários");
    if (selectedFields.createdAt) headers.push("Data de Criação");
    if (selectedFields.scoreDetails) headers.push("Detalhes do Score");

    // Dados
    suggestions.forEach(suggestion => {
      const row = [];
      if (selectedFields.title) row.push(`"${suggestion.title.replace(/"/g, '""')}"`); 
      if (selectedFields.score) row.push(suggestion.score);
      if (selectedFields.client) row.push(`"${suggestion.clientData.nome.replace(/"/g, '""')}"`); 
      if (selectedFields.priority) row.push(`"Nível ${suggestion.nivel.nivel}"`);
      if (selectedFields.votes) row.push(suggestion.votes);
      if (selectedFields.comments) row.push(suggestion.comments_count);
      if (selectedFields.createdAt) row.push(new Date().toLocaleDateString('pt-BR'));
      if (selectedFields.scoreDetails) {
        const details = Object.entries(suggestion.scoreDetails)
          .map(([key, value]) => `${key}: ${value}`)
          .join('; ');
        row.push(`"${details}"`);
      }
      rows.push(row.join(','));
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sugestoes_priorizadas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = () => {
    // Simulação de geração de PDF
    const content = `
      RELATÓRIO DE SUGESTÕES PRIORIZADAS
      Data: ${new Date().toLocaleDateString('pt-BR')}
      
      RESUMO:
      - Total de Sugestões: ${suggestions.length}
      - Score Médio: ${Math.round(suggestions.reduce((sum, s) => sum + s.score, 0) / suggestions.length)}
      
      SUGESTÕES:
      ${suggestions.slice(0, 10).map((s, i) => `
      ${i + 1}. ${s.title}
         Cliente: ${s.clientData.nome}
         Score: ${s.score}
         Prioridade: Nível ${s.nivel.nivel}
      `).join('')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_sugestoes_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateExcel = () => {
    // Simulação de geração de Excel (seria necessário uma biblioteca como xlsx)
    generateCSV(); // Por enquanto, gera CSV
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula processamento
      
      switch (exportFormat) {
        case "csv":
          generateCSV();
          break;
        case "pdf":
          generatePDF();
          break;
        case "excel":
          generateExcel();
          break;
      }
      
      toast({
        title: "Exportação concluída!",
        description: `Arquivo ${exportFormat.toUpperCase()} baixado com sucesso.`,
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error("Export error:", error);
      
      let errorMessage = "Ocorreu um erro ao gerar o arquivo. ";
      
      if (error instanceof Error) {
        if (error.message.includes('memory') || error.message.includes('size')) {
          errorMessage += "Muitos dados para exportar. Tente filtrar menos sugestões.";
        } else if (error.message.includes('permission')) {
          errorMessage += "Sem permissão para baixar arquivos. Verifique as configurações do navegador.";
        } else if (error.message.includes('network')) {
          errorMessage += "Problema de conexão. Verifique sua internet e tente novamente.";
        } else {
          errorMessage += "Tente novamente ou entre em contato com o suporte.";
        }
      } else {
        errorMessage += "Tente novamente em alguns instantes.";
      }
      
      toast({
        title: "Erro na exportação",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getSelectedFieldsCount = () => {
    return Object.values(selectedFields).filter(Boolean).length;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-6 h-6 text-blue-600" />
            Sistema de Exportação
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configurações de Exportação */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tipo de Exportação */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tipo de Relatório</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {exportTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      exportType === type.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setExportType(type.value)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        exportType === type.value
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`} />
                      <div>
                        <p className="font-semibold">{type.label}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Formato de Arquivo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Formato de Arquivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {exportFormats.map((format) => {
                    const Icon = format.icon;
                    return (
                      <div
                        key={format.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors text-center ${
                          exportFormat === format.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setExportFormat(format.value)}
                      >
                        <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <p className="font-semibold">{format.label}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {format.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Campos para Exportação */}
            {exportType === "suggestions" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Campos para Exportação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {fieldOptions.map((field) => (
                      <div key={field.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={field.key}
                          checked={selectedFields[field.key as keyof typeof selectedFields]}
                          onCheckedChange={(checked) => handleFieldChange(field.key, checked as boolean)}
                          disabled={field.required}
                        />
                        <Label htmlFor={field.key} className="text-sm">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Filtros de Data */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Período</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os períodos</SelectItem>
                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                    <SelectItem value="1y">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Preview e Resumo */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Resumo da Exportação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Formato:</span>
                    <Badge variant="secondary">{exportFormat.toUpperCase()}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tipo:</span>
                    <span className="text-right text-xs">
                      {exportTypes.find(t => t.value === exportType)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Registros:</span>
                    <Badge variant="outline">{suggestions.length}</Badge>
                  </div>
                  {exportType === "suggestions" && (
                    <div className="flex justify-between text-sm">
                      <span>Campos:</span>
                      <Badge variant="outline">{getSelectedFieldsCount()}</Badge>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Período:</span>
                    <span className="text-xs">
                      {dateRange === "all" ? "Todos" : dateRange}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm mb-2">Preview dos Dados:</h4>
                  <div className="space-y-1 text-xs">
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                      <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                        <p className="font-semibold truncate">{suggestion.title}</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Score: {suggestion.score} | {suggestion.clientData.nome}
                        </p>
                      </div>
                    ))}
                    {suggestions.length > 3 && (
                      <p className="text-gray-500 text-center">+{suggestions.length - 3} mais...</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleExport} 
              disabled={isExporting || getSelectedFieldsCount() === 0}
              className="w-full"
              size="lg"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Gerando arquivo...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar {exportFormat.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportSystem;