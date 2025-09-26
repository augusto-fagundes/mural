// src/components/QuickSuggestionTemplates.tsx
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Zap,
  Lightbulb,
  Sparkles,
  Rocket,
  Shield,
  Users,
  BarChart3,
  Settings,
  Plus,
  Copy,
  Edit,
  Star,
  Clock,
  Target,
  FileText,
  Workflow,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  title: string;
  description: string;
  category: 'feature' | 'improvement' | 'integration' | 'performance' | 'security' | 'analytics';
  icon: any;
  guideSteps: string[];
  placeholders: {
    title: string;
    description: string;
    module: string;
    priority: string;
  };
  estimatedImpact: 'low' | 'medium' | 'high';
}

interface QuickSuggestionTemplatesProps {
  onCreateSuggestion?: (suggestion: {
    title: string;
    description: string;
    module: string;
    priority: string;
  }) => void;
}

const QuickSuggestionTemplates = ({ onCreateSuggestion }: QuickSuggestionTemplatesProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('media');

  const templates: Template[] = [
    {
      id: 'new-feature',
      title: 'Nova Funcionalidade',
      description: 'Guia para propor uma nova funcionalidade para o sistema',
      category: 'feature',
      icon: Sparkles,
      guideSteps: [
        'Defina claramente o objetivo da funcionalidade',
        'Liste os benefícios esperados para os usuários',
        'Descreva os requisitos técnicos necessários',
        'Identifique os principais casos de uso',
        'Considere o impacto em outras funcionalidades'
      ],
      placeholders: {
        title: 'Nova funcionalidade: [Nome da funcionalidade]',
        description: '**Objetivo:**\n[Descrever o objetivo principal]\n\n**Benefícios:**\n- [Benefício 1]\n- [Benefício 2]\n\n**Requisitos:**\n- [Requisito técnico 1]\n- [Requisito técnico 2]\n\n**Casos de uso:**\n- [Caso de uso 1]\n- [Caso de uso 2]',
        module: 'Geral',
        priority: 'media'
      },
      estimatedImpact: 'high'
    },
    {
      id: 'performance',
      title: 'Melhoria de Performance',
      description: 'Guia para propor otimizações de performance do sistema',
      category: 'performance',
      icon: Rocket,
      guideSteps: [
        'Identifique o problema de performance específico',
        'Meça as métricas atuais (tempo de resposta, uso de recursos)',
        'Proponha uma solução técnica viável',
        'Estime os benefícios esperados',
        'Considere o impacto em outras funcionalidades'
      ],
      placeholders: {
        title: 'Otimização: [Área a ser otimizada]',
        description: '**Problema de performance:**\n[Descrever o problema atual]\n\n**Métricas atuais:**\n[Tempo de resposta, uso de CPU/memória, etc.]\n\n**Solução proposta:**\n[Descrever a solução técnica]\n\n**Benefícios esperados:**\n- Redução de tempo de resposta\n- Melhoria na experiência do usuário\n- [Outros benefícios específicos]',
        module: 'Performance',
        priority: 'media'
      },
      estimatedImpact: 'high'
    },
    {
      id: 'integration',
      title: 'Nova Integração',
      description: 'Guia para propor integração com sistemas externos',
      category: 'integration',
      icon: Settings,
      guideSteps: [
        'Identifique o sistema ou serviço a ser integrado',
        'Defina o objetivo e benefícios da integração',
        'Mapeie os dados que serão sincronizados',
        'Determine a frequência de sincronização',
        'Considere aspectos de segurança e autenticação'
      ],
      placeholders: {
        title: 'Integração: [Nome do sistema/serviço]',
        description: '**Sistema a integrar:**\n[Nome e descrição do sistema]\n\n**Objetivo da integração:**\n[Descrever o objetivo e benefícios]\n\n**Dados a sincronizar:**\n- [Tipo de dados 1]\n- [Tipo de dados 2]\n\n**Frequência de sincronização:**\n[Tempo real, diária, semanal, etc.]\n\n**Considerações técnicas:**\n[API disponível, autenticação, etc.]',
        module: 'Integrações',
        priority: 'media'
      },
      estimatedImpact: 'high'
    },
    {
      id: 'security',
      title: 'Melhoria de Segurança',
      description: 'Guia para propor melhorias de segurança do sistema',
      category: 'security',
      icon: Shield,
      guideSteps: [
        'Identifique a vulnerabilidade ou risco de segurança',
        'Avalie o nível de criticidade (Alto/Médio/Baixo)',
        'Proponha uma solução de segurança específica',
        'Considere o impacto na experiência do usuário',
        'Liste os recursos necessários para implementação'
      ],
      placeholders: {
        title: 'Segurança: [Área de segurança]',
        description: '**Vulnerabilidade/Risco identificado:**\n[Descrever o risco específico]\n\n**Nível de criticidade:**\n[Alto/Médio/Baixo - justificar]\n\n**Solução proposta:**\n[Descrever a solução de segurança]\n\n**Impacto na segurança:**\n[Benefícios de segurança esperados]\n\n**Recursos necessários:**\n[Tempo, ferramentas, conhecimento específico]',
        module: 'Segurança',
        priority: 'alta'
      },
      estimatedImpact: 'high'
    },
    {
      id: 'ui-improvement',
      title: 'Melhoria de Interface',
      description: 'Guia para sugerir melhorias na experiência do usuário',
      category: 'improvement',
      icon: Users,
      guideSteps: [
        'Identifique a tela ou componente específico',
        'Descreva o problema de usabilidade atual',
        'Proponha uma solução centrada no usuário',
        'Liste os benefícios para a experiência do usuário',
        'Inclua referências visuais ou mockups se possível'
      ],
      placeholders: {
        title: 'UI/UX: [Área da interface]',
        description: '**Tela/Componente:**\n[Nome da tela ou componente específico]\n\n**Problema atual:**\n[Descrever o problema de usabilidade]\n\n**Melhoria proposta:**\n[Descrever a solução centrada no usuário]\n\n**Benefícios para o usuário:**\n- [Melhoria na navegação]\n- [Redução de cliques/passos]\n- [Maior clareza visual]\n\n**Referências:**\n[Mockups, exemplos de outras aplicações, etc.]',
        module: 'Interface',
        priority: 'media'
      },
      estimatedImpact: 'medium'
    },
    {
      id: 'analytics',
      title: 'Nova Métrica/Relatório',
      description: 'Guia para propor novos relatórios ou métricas analíticas',
      category: 'analytics',
      icon: BarChart3,
      guideSteps: [
        'Defina o objetivo e valor do relatório',
        'Identifique os dados necessários e suas fontes',
        'Escolha as visualizações mais adequadas',
        'Determine a frequência de atualização',
        'Identifique os usuários que utilizarão o relatório'
      ],
      placeholders: {
        title: 'Relatório: [Nome do relatório]',
        description: '**Objetivo do relatório:**\n[Descrever o valor e objetivo do relatório]\n\n**Dados necessários:**\n- [Fonte de dados 1]\n- [Fonte de dados 2]\n- [Métricas específicas]\n\n**Visualizações:**\n- [Gráficos de linha, barras, pizza, etc.]\n- [Tabelas, dashboards, etc.]\n\n**Frequência de atualização:**\n[Tempo real, diária, semanal, mensal]\n\n**Usuários alvo:**\n[Gestores, analistas, equipe técnica, etc.]',
        module: 'Relatórios',
        priority: 'baixa'
      },
      estimatedImpact: 'medium'
    },
    {
      id: 'automation',
      title: 'Automação de Processo',
      description: 'Guia para propor automação de processos manuais',
      category: 'improvement',
      icon: Workflow,
      guideSteps: [
        'Mapeie o processo manual atual em detalhes',
        'Identifique as etapas que podem ser automatizadas',
        'Defina os gatilhos para iniciar a automação',
        'Liste as ações que serão executadas automaticamente',
        'Calcule o tempo e recursos economizados'
      ],
      placeholders: {
        title: 'Automação: [Nome do processo]',
        description: '**Processo atual:**\n[Descrever o processo manual passo a passo]\n\n**Automação proposta:**\n[Descrever como o processo será automatizado]\n\n**Gatilhos:**\n- [Condição ou evento 1]\n- [Condição ou evento 2]\n\n**Ações automatizadas:**\n- [Ação automática 1]\n- [Ação automática 2]\n\n**Benefícios:**\n- Tempo economizado: [X horas/dia]\n- Redução de erros manuais\n- [Outros benefícios específicos]',
        module: 'Automação',
        priority: 'media'
      },
      estimatedImpact: 'high'
    }
  ];

  const modules = ['Integradores', 'Financeiro', 'Técnico', 'Workspace', 'Estoque', 'Bot', 'BI', 'Mapa', 'Notas', 'CRM', 'Gestão', 'Outro'];

  const getCategoryColor = (category: Template['category']) => {
    const colors = {
      feature: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      bug: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      improvement: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      integration: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      performance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      security: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return colors[category];
  };

  const getImpactColor = (impact: Template['estimatedImpact']) => {
    const colors = {
      low: 'text-gray-600',
      medium: 'text-orange-600',
      high: 'text-red-600'
    };
    return colors[impact];
  };

  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setCustomTitle(template.placeholders.title);
    setCustomDescription(template.placeholders.description);
    setSelectedModule(template.placeholders.module);
    setSelectedPriority(template.placeholders.priority);
  };

  const handleCreateSuggestion = () => {
    if (!customTitle.trim() || !customDescription.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e a descrição da sugestão.",
        variant: "destructive",
      });
      return;
    }

    const suggestionData = {
      title: customTitle,
      description: customDescription,
      module: selectedModule || 'Geral',
      priority: selectedPriority
    };

    onCreateSuggestion?.(suggestionData);
    
    toast({
      title: "Sugestão criada!",
      description: "Sua sugestão foi criada com sucesso usando o guia.",
    });

    // Reset form
    setSelectedTemplate(null);
    setCustomTitle('');
    setCustomDescription('');
    setSelectedModule('');
    setSelectedPriority('media');
    setIsOpen(false);
  };

  const TemplateCard = ({ template }: { template: Template }) => {
    const Icon = template.icon;
    
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleUseTemplate(template)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg">{template.title}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {template.description}
                </p>
              </div>
            </div>
            <Badge className={getCategoryColor(template.category)}>
              {template.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-1 text-sm">
              <Target className={`w-4 h-4 ${getImpactColor(template.estimatedImpact)}`} />
              <span className={getImpactColor(template.estimatedImpact)}>
                {template.estimatedImpact === 'high' ? 'Alto' : 
                 template.estimatedImpact === 'medium' ? 'Médio' : 'Baixo'} impacto
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Zap className="w-4 h-4 mr-2" />
          Guias de Melhoria
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-blue-600" />
            Guias de Melhoria
          </DialogTitle>
        </DialogHeader>

        {!selectedTemplate ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="feature">Funcionalidades</TabsTrigger>
              <TabsTrigger value="improvement">Melhorias</TabsTrigger>
              <TabsTrigger value="analytics">Análises</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="feature" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.filter(t => t.category === 'feature').map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="improvement" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.filter(t => t.category === 'improvement').map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bug" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.filter(t => t.category === 'bug').map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            {/* Header do Template Selecionado */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-3">
                <selectedTemplate.icon className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold">{selectedTemplate.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedTemplate.description}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Voltar aos Guias
              </Button>
            </div>

            {/* Passos do Guia - Movido para o topo */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Passos do Guia
              </h4>
              <Card className="p-3 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {selectedTemplate.guideSteps.map((step, index) => (
                    <li key={index} className="text-blue-700 dark:text-blue-300">
                      {step}
                    </li>
                  ))}
                </ol>
              </Card>
            </div>

            {/* Formulário de Edição */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título da Sugestão</label>
                  <Input
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Digite o título da sugestão"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Módulo</label>
                    <Select value={selectedModule} onValueChange={setSelectedModule}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o módulo" />
                      </SelectTrigger>
                      <SelectContent>
                        {modules.map((module) => (
                          <SelectItem key={module} value={module}>
                            {module}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Prioridade</label>
                    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <Textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Descreva sua sugestão em detalhes"
                    rows={10}
                    className="resize-none"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Preview da Sugestão</h4>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{customTitle || 'Título da sugestão'}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{selectedModule || 'Módulo'}</Badge>
                        <Badge className={selectedPriority === 'alta' ? 'bg-red-100 text-red-800' : 
                                        selectedPriority === 'media' ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-green-100 text-green-800'}>
                          Prioridade {selectedPriority || 'média'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">
                        {customDescription || 'Descrição da sugestão aparecerá aqui...'}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateSuggestion} className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Sugestão
                  </Button>
                  <Button variant="outline" onClick={() => {
                    navigator.clipboard.writeText(customDescription);
                    toast({ title: "Copiado!", description: "Descrição copiada para a área de transferência." });
                  }}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickSuggestionTemplates;