// src/components/ScoreCalculationTables.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Calculator,
  Users,
  Shield,
  Building2,
  Clock,
  Star,
  Heart,
  MessageSquare,
  Calendar,
  AlertTriangle,
  Settings,
} from "lucide-react";
import {
  TABELA_FAIXA_CLIENTES,
  TABELA_STATUS_PREVENTIVO,
  TABELA_TEMPO_CRIACAO,
  TABELA_NPS,
  TABELA_FIDELIDADE,
  TABELA_QUANTIDADE_SUGESTOES,
  TABELA_NIVEIS_PRIORIDADE,
  CLIENTES_ENTERPRISE,
  PONTUACAO_CLIENTE_ENTERPRISE,
} from "@/config/prioritization.config";
import ScoreConfigurationModal, { ScoreConfig } from "./ScoreConfigurationModal";

const ScoreCalculationTables = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);

  const handleSaveConfig = (config: ScoreConfig) => {
    // Aqui você pode implementar a lógica para salvar a configuração
    // Por exemplo, salvar no localStorage ou enviar para uma API
    console.log('Nova configuração:', config);
    // TODO: Implementar persistência da configuração
  };

  const TableCard = ({
    title,
    icon: Icon,
    data,
    columns,
    description,
  }: {
    title: string;
    icon: any;
    data: any[];
    columns: { key: string; label: string; render?: (value: any) => React.ReactNode }[];
    description?: string;
  }) => (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5 text-blue-600" />
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className="font-semibold">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(row[col.key]) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 justify-start p-4 h-auto border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 dark:border-blue-600 dark:hover:border-blue-400 dark:hover:bg-blue-950"
            >
              <div className="flex items-center gap-3 w-full">
                <Calculator className="w-5 h-5 text-blue-600" />
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-lg">Base de Cálculos do Score</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visualize como o score de priorização é calculado
                  </p>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </Button>
          </CollapsibleTrigger>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfigModalOpen(true)}
            className="ml-2"
          >
            <Settings className="w-4 h-4 mr-1" />
            Configurar
          </Button>
        </div>
      </div>

      <CollapsibleContent className="mt-4">
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 rounded-lg border">
            <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Como funciona o cálculo?
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              O score de cada sugestão é calculado somando pontos de diferentes critérios.
              Quanto maior o score, maior a prioridade da sugestão no desenvolvimento.
            </p>
          </div>

          <Tabs defaultValue="client-data" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="client-data">Dados do Cliente</TabsTrigger>
              <TabsTrigger value="suggestion-data">Dados da Sugestão</TabsTrigger>
              <TabsTrigger value="priority-levels">Níveis de Prioridade</TabsTrigger>
            </TabsList>

            <TabsContent value="client-data" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TableCard
                  title="Faixa de Clientes"
                  icon={Users}
                  description="Pontuação baseada no número total de clientes"
                  data={TABELA_FAIXA_CLIENTES}
                  columns={[
                    { key: "faixa", label: "Faixa" },
                    {
                      key: "pontuacao",
                      label: "Pontuação",
                      render: (value) => (
                        <Badge variant="secondary">+{value}</Badge>
                      ),
                    },
                  ]}
                />

                <TableCard
                  title="Status Preventivo"
                  icon={Shield}
                  description="Pontuação baseada no status preventivo do cliente"
                  data={TABELA_STATUS_PREVENTIVO}
                  columns={[
                    { key: "status", label: "Status" },
                    {
                      key: "pontuacao",
                      label: "Pontuação",
                      render: (value) => (
                        <Badge variant="secondary">+{value}</Badge>
                      ),
                    },
                  ]}
                />

                <TableCard
                  title="NPS (Net Promoter Score)"
                  icon={Star}
                  description="Pontuação baseada na nota NPS do cliente"
                  data={TABELA_NPS}
                  columns={[
                    { key: "nota", label: "Nota" },
                    {
                      key: "pontuacao",
                      label: "Pontuação",
                      render: (value) => (
                        <Badge variant="secondary">+{value}</Badge>
                      ),
                    },
                  ]}
                />

                <TableCard
                  title="Fidelidade"
                  icon={Heart}
                  description="Pontuação baseada no nível de fidelidade do cliente"
                  data={TABELA_FIDELIDADE}
                  columns={[
                    { key: "fidelidade", label: "Fidelidade" },
                    {
                      key: "pontuacao",
                      label: "Pontuação",
                      render: (value) => (
                        <Badge variant="secondary">+{value}</Badge>
                      ),
                    },
                  ]}
                />

                <TableCard
                  title="Quantidade de Sugestões"
                  icon={MessageSquare}
                  description="Pontuação baseada no histórico de sugestões do cliente"
                  data={TABELA_QUANTIDADE_SUGESTOES}
                  columns={[
                    { key: "quantidade", label: "Quantidade" },
                    {
                      key: "pontuacao",
                      label: "Pontuação",
                      render: (value) => (
                        <Badge variant="secondary">+{value}</Badge>
                      ),
                    },
                  ]}
                />

                <Card className="w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      Clientes Enterprise
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Clientes enterprise recebem +{PONTUACAO_CLIENTE_ENTERPRISE} pontos
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                      {CLIENTES_ENTERPRISE.slice(0, 8).map((cliente, index) => (
                        <div
                          key={index}
                          className="text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded"
                        >
                          {cliente}
                        </div>
                      ))}
                      {CLIENTES_ENTERPRISE.length > 8 && (
                        <div className="text-sm text-gray-500 text-center">
                          +{CLIENTES_ENTERPRISE.length - 8} outros clientes...
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="suggestion-data" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TableCard
                  title="Tempo da Sugestão"
                  icon={Clock}
                  description="Pontuação baseada em quando a sugestão foi criada"
                  data={TABELA_TEMPO_CRIACAO}
                  columns={[
                    { key: "tempo", label: "Tempo" },
                    {
                      key: "pontuacao",
                      label: "Pontuação",
                      render: (value) => (
                        <Badge variant="secondary">+{value}</Badge>
                      ),
                    },
                  ]}
                />

                <Card className="w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Star className="w-5 h-5 text-blue-600" />
                      Votos da Comunidade
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cada voto recebido adiciona +2 pontos ao score
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">+2</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        pontos por voto
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="priority-levels" className="space-y-4">
              <TableCard
                title="Níveis de Prioridade"
                icon={AlertTriangle}
                description="Classificação das sugestões baseada no score total"
                data={TABELA_NIVEIS_PRIORIDADE}
                columns={[
                  { key: "scoreAte", label: "Score até" },
                  { key: "nivel", label: "Nível" },
                  {
                    key: "cor",
                    label: "Cor",
                    render: (value) => (
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${value}`}></div>
                        <span className="text-sm">{value}</span>
                      </div>
                    ),
                  },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </CollapsibleContent>

      <ScoreConfigurationModal
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
        onSave={handleSaveConfig}
      />
    </Collapsible>
  );
};

export default ScoreCalculationTables;