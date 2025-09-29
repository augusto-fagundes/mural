// src/components/ScoreConfigurationModal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Settings,
  Users,
  Shield,
  Building2,
  Clock,
  Star,
  Heart,
  MessageSquare,
  Calendar,
  Save,
  RotateCcw,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EnterpriseDomain } from "@/config/prioritization.config";

interface ScoreConfig {
  pontuacaoPorVoto: number;
  faixaClientes: { [key: number]: number };
  statusPreventivo: { [key: string]: number };
  pontuacaoClienteEnterprise: number;
  tempoSugestao: { [key: string]: number };
  nps: { [key: number]: number };
  fidelidade: { [key: string]: number };
  quantidadeSugestoes: { [key: string]: number };
  niveisScore: { [key: string]: number };
  dominiosEnterprise: EnterpriseDomain[];
}

interface ScoreConfigurationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: ScoreConfig) => void;
}

const ScoreConfigurationModal = ({
  open,
  onOpenChange,
  onSave,
}: ScoreConfigurationModalProps) => {
  const { toast } = useToast();
  const [config, setConfig] = useState<ScoreConfig>({
    pontuacaoPorVoto: 2,
    faixaClientes: {
      5000: 10,
      10000: 20,
      15000: 30,
      20000: 40,
      30000: 50,
      50000: 60,
    },
    statusPreventivo: {
      "Preventivo Urgente": 50,
      "Preventivo Crítico": 40,
      "Preventivo Atenção": 30,
    },
    pontuacaoClienteEnterprise: 100,
    tempoSugestao: {
      "1 Mês": 1,
      "3 Meses": 3,
      "6 meses": 6,
      "12 ou mais": 15,
    },
    nps: {
      0: 50,
      1: 90,
      2: 80,
      3: 70,
      4: 60,
      5: 50,
      6: 40,
      7: 30,
      8: 20,
      9: 20,
      10: 20,
    },
    fidelidade: {
      "Total": 50,
      "Parcial": 10,
      "Sem fidelidade": 30,
    },
    quantidadeSugestoes: {
      "1 a 3": 75,
      "4 a 10": 50,
      "10 a 25": 30,
      "26 ou mais": 10,
    },
    niveisScore: {
      "100": 5,
      "150": 4,
      "250": 3,
      "300": 2,
      "400": 1,
      "500": 0, // Urgente
    },
    dominiosEnterprise: [
      { domain: "alcans.com.br", companyName: "ALCANS TELECOM LTDA" },
      { domain: "razaoinfo.com.br", companyName: "RAZAOINFO INTERNET LTDA" },
      { domain: "linksete.com.br", companyName: "LINK SETE SERVICOS DE INTERNET E REDES LTDA" },
    ],
  });

  const [originalConfig, setOriginalConfig] = useState<ScoreConfig>(config);

  useEffect(() => {
    if (open) {
      setOriginalConfig(config);
    }
  }, [open]);

  const handleSave = () => {
    onSave(config);
    toast({
      title: "Configuração salva!",
      description: "Os valores da base de cálculo foram atualizados com sucesso.",
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setConfig(originalConfig);
    toast({
      title: "Valores restaurados",
      description: "Os valores foram restaurados para o estado original.",
      variant: "default",
    });
  };

  const updateFaixaClientes = (faixa: number, valor: number) => {
    setConfig(prev => ({
      ...prev,
      faixaClientes: {
        ...prev.faixaClientes,
        [faixa]: valor,
      },
    }));
  };

  const updateStatusPreventivo = (status: string, valor: number) => {
    setConfig(prev => ({
      ...prev,
      statusPreventivo: {
        ...prev.statusPreventivo,
        [status]: valor,
      },
    }));
  };

  const updateTempoSugestao = (tempo: string, valor: number) => {
    setConfig(prev => ({
      ...prev,
      tempoSugestao: {
        ...prev.tempoSugestao,
        [tempo]: valor,
      },
    }));
  };

  const updateNPS = (nota: number, valor: number) => {
    setConfig(prev => ({
      ...prev,
      nps: {
        ...prev.nps,
        [nota]: valor,
      },
    }));
  };

  const updateFidelidade = (tipo: string, valor: number) => {
    setConfig(prev => ({
      ...prev,
      fidelidade: {
        ...prev.fidelidade,
        [tipo]: valor,
      },
    }));
  };

  const updateQuantidadeSugestoes = (quantidade: string, valor: number) => {
    setConfig(prev => ({
      ...prev,
      quantidadeSugestoes: {
        ...prev.quantidadeSugestoes,
        [quantidade]: valor,
      },
    }));
  };

  const updateNiveisScore = (scoreAte: string, nivel: number) => {
    setConfig(prev => ({
      ...prev,
      niveisScore: {
        ...prev.niveisScore,
        [scoreAte]: nivel,
      },
    }));
  };

  // Funções para gerenciar domínios enterprise
  const addEnterpriseDomain = () => {
    setConfig(prev => ({
      ...prev,
      dominiosEnterprise: [
        ...prev.dominiosEnterprise,
        { domain: "", companyName: "" }
      ],
    }));
  };

  const updateEnterpriseDomain = (index: number, field: keyof EnterpriseDomain, value: string) => {
    setConfig(prev => ({
      ...prev,
      dominiosEnterprise: prev.dominiosEnterprise.map((domain, i) =>
        i === index ? { ...domain, [field]: value } : domain
      ),
    }));
  };

  const removeEnterpriseDomain = (index: number) => {
    setConfig(prev => ({
      ...prev,
      dominiosEnterprise: prev.dominiosEnterprise.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Configuração da Base de Cálculo
          </DialogTitle>
          <DialogDescription>
            Ajuste os valores de pontuação para cada critério usado no cálculo do score de priorização.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="client-data" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="client-data">Dados do Cliente</TabsTrigger>
            <TabsTrigger value="enterprise-clients">Clientes Enterprise</TabsTrigger>
            <TabsTrigger value="suggestion-data">Dados da Sugestão</TabsTrigger>
            <TabsTrigger value="priority-levels">Níveis de Prioridade</TabsTrigger>
          </TabsList>

          <TabsContent value="client-data" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Faixa de Clientes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Faixa de Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Faixa</TableHead>
                        <TableHead>Pontuação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(config.faixaClientes).map(([faixa, pontos]) => (
                        <TableRow key={faixa}>
                          <TableCell>Até {Number(faixa).toLocaleString()}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={pontos}
                              onChange={(e) => updateFaixaClientes(Number(faixa), Number(e.target.value))}
                              className="w-20"
                              min="0"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Status Preventivo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Status Preventivo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Pontuação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(config.statusPreventivo).map(([status, pontos]) => (
                        <TableRow key={status}>
                          <TableCell>{status}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={pontos}
                              onChange={(e) => updateStatusPreventivo(status, Number(e.target.value))}
                              className="w-20"
                              min="0"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* NPS */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    NPS (Net Promoter Score)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {Object.entries(config.nps).map(([nota, pontos]) => (
                      <div key={nota} className="flex items-center gap-2">
                        <Label className="w-8">Nota {nota}:</Label>
                        <Input
                          type="number"
                          value={pontos}
                          onChange={(e) => updateNPS(Number(nota), Number(e.target.value))}
                          className="w-16"
                          min="0"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Fidelidade */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-blue-600" />
                    Fidelidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Pontuação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(config.fidelidade).map(([tipo, pontos]) => (
                        <TableRow key={tipo}>
                          <TableCell>{tipo}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={pontos}
                              onChange={(e) => updateFidelidade(tipo, Number(e.target.value))}
                              className="w-20"
                              min="0"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Quantidade de Sugestões */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Quantidade de Sugestões
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Pontuação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(config.quantidadeSugestoes).map(([quantidade, pontos]) => (
                        <TableRow key={quantidade}>
                          <TableCell>{quantidade}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={pontos}
                              onChange={(e) => updateQuantidadeSugestoes(quantidade, Number(e.target.value))}
                              className="w-20"
                              min="0"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="enterprise-clients" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Domínios de Clientes Enterprise
                </CardTitle>
                <CardDescription>
                  Configure os domínios de email que identificam clientes enterprise. 
                  Emails com estes domínios receberão automaticamente a pontuação enterprise.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Pontuação Enterprise */}
                  <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div>
                      <Label htmlFor="enterprise-points">Pontuação adicional para clientes enterprise</Label>
                      <Input
                        id="enterprise-points"
                        type="number"
                        value={config.pontuacaoClienteEnterprise}
                        onChange={(e) => setConfig(prev => ({ ...prev, pontuacaoClienteEnterprise: Number(e.target.value) }))}
                        className="w-32 mt-1"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Lista de Domínios */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Domínios Enterprise</h4>
                      <Button onClick={addEnterpriseDomain} size="sm" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Adicionar Domínio
                      </Button>
                    </div>

                    {config.dominiosEnterprise.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Nenhum domínio enterprise configurado.
                        <br />
                        Clique em "Adicionar Domínio" para começar.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {config.dominiosEnterprise.map((domain, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor={`domain-${index}`} className="text-sm">Domínio</Label>
                                <Input
                                  id={`domain-${index}`}
                                  placeholder="exemplo.com.br"
                                  value={domain.domain}
                                  onChange={(e) => updateEnterpriseDomain(index, 'domain', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`company-${index}`} className="text-sm">Nome da Empresa</Label>
                                <Input
                                  id={`company-${index}`}
                                  placeholder="Nome da empresa"
                                  value={domain.companyName}
                                  onChange={(e) => updateEnterpriseDomain(index, 'companyName', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeEnterpriseDomain(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Informações sobre como funciona */}
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <h5 className="font-medium mb-2">Como funciona:</h5>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Emails com domínios cadastrados aqui são automaticamente identificados como enterprise</li>
                      <li>• A empresa associada ao domínio será usada para identificação do cliente</li>
                      <li>• Clientes enterprise recebem a pontuação adicional configurada acima</li>
                      <li>• Exemplo: usuario@alcans.com.br será identificado como "ALCANS TELECOM LTDA"</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestion-data" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pontuação por Voto */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    Votos da Comunidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vote-points">Pontos por voto</Label>
                      <Input
                        id="vote-points"
                        type="number"
                        value={config.pontuacaoPorVoto}
                        onChange={(e) => setConfig(prev => ({ ...prev, pontuacaoPorVoto: Number(e.target.value) }))}
                        className="w-32 mt-1"
                        min="0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tempo da Sugestão */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Tempo da Sugestão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tempo</TableHead>
                        <TableHead>Pontuação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(config.tempoSugestao).map(([tempo, pontos]) => (
                        <TableRow key={tempo}>
                          <TableCell>{tempo}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={pontos}
                              onChange={(e) => updateTempoSugestao(tempo, Number(e.target.value))}
                              className="w-20"
                              min="0"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="priority-levels" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  Níveis de Prioridade
                </CardTitle>
                <CardDescription>
                  Configure os limites de score para cada nível de prioridade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Score até</TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(config.niveisScore).map(([scoreAte, nivel]) => (
                      <TableRow key={scoreAte}>
                        <TableCell>
                          <Input
                            type="number"
                            value={scoreAte}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const oldKey = scoreAte;
                              const newConfig = { ...config };
                              
                              // Remove a chave antiga
                              delete newConfig.niveisScore[oldKey];
                              
                              // Adiciona com a nova chave
                              newConfig.niveisScore[newValue] = nivel;
                              
                              setConfig(newConfig);
                            }}
                            className="w-20"
                            min="0"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant={nivel === 0 ? "destructive" : "secondary"}>
                            {nivel === 0 ? "Urgente" : `Nível ${nivel}`}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {nivel === 0 && "Implementação imediata"}
                          {nivel === 1 && "Prioridade muito alta"}
                          {nivel === 2 && "Prioridade alta"}
                          {nivel === 3 && "Prioridade média"}
                          {nivel === 4 && "Prioridade baixa"}
                          {nivel === 5 && "Prioridade muito baixa"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restaurar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Configuração
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreConfigurationModal;
export type { ScoreConfig };