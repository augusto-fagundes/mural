// src/components/PrioritizationDashboard.tsx
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { PrioritizedSuggestion } from "@/hooks/usePrioritization";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Users,
  TrendingUp,
  CheckSquare,
  BarChart2,
  FolderKanban,
  Star,
} from "lucide-react";

interface DashboardProps {
  suggestions: PrioritizedSuggestion[];
}

const PrioritizationDashboard = ({ suggestions }: DashboardProps) => {
  const dashboardData = useMemo(() => {
    if (suggestions.length === 0) {
      return {
        totalSuggestions: 0,
        uniqueClients: 0,
        averageScore: 0,
        statusDistribution: [],
        topClientsByScore: [],
        moduleDistribution: [],
        topClientsByCount: [],
      };
    }

    const statusCounts = suggestions.reduce((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const statusDistribution = Object.entries(statusCounts).map(
      ([name, value]) => ({ name, value })
    );
    const clientScores = suggestions.reduce((acc, s) => {
      acc[s.clientData.nome] = (acc[s.clientData.nome] || 0) + s.score;
      return acc;
    }, {} as Record<string, number>);
    const topClientsByScore = Object.entries(clientScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, 5)
      .map(([name, score]) => ({ name, value: Math.round(score) }));
    const moduleCounts = suggestions.reduce((acc, s) => {
      acc[s.module] = (acc[s.module] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const moduleDistribution = Object.entries(moduleCounts).map(
      ([name, value]) => ({ name, value })
    );
    const clientSuggestionCounts = suggestions.reduce((acc, s) => {
      acc[s.clientData.nome] = (acc[s.clientData.nome] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topClientsByCount = Object.entries(clientSuggestionCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    return {
      totalSuggestions: suggestions.length,
      uniqueClients: new Set(suggestions.map((s) => s.clientData.nome)).size,
      averageScore: Math.round(
        suggestions.reduce((sum, s) => sum + s.score, 0) / suggestions.length
      ),
      statusDistribution,
      topClientsByScore,
      moduleDistribution,
      topClientsByCount,
    };
  }, [suggestions]);

  const COLORS = [
    "#3b82f6",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#6366f1",
    "#ec4899",
  ];

  return (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center gap-2">
          <BarChart2 className="w-6 h-6" /> Dashboard de Priorização
        </DialogTitle>
        <DialogDescription>
          Visão geral e análise das sugestões priorizadas.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Sugestões Analisadas
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.totalSuggestions}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Clientes Únicos
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.uniqueClients}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
            <CheckSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.averageScore}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" /> Top 5 Clientes por
              Score Acumulado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={dashboardData.topClientsByScore}
                layout="vertical"
                margin={{ left: 25, right: 20 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={120}
                  stroke="#888888"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="value"
                  fill="var(--color-top-clients-score)"
                  radius={5}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sugestões por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={dashboardData.statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={2}
                >
                  {dashboardData.statusDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Top 5 Clientes por Nº de Sugestões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={dashboardData.topClientsByCount}
                layout="vertical"
                margin={{ left: 25, right: 20 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={120}
                  stroke="#888888"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="value"
                  fill="var(--color-top-clients-count)"
                  radius={5}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-green-500" />
              Distribuição por Módulo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={dashboardData.moduleDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={2}
                >
                  {dashboardData.moduleDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  );
};

const style = document.createElement("style");
style.innerHTML = `
  :root {
    --color-top-clients-score: #f59e0b;
    --color-top-clients-count: #3b82f6;
  }
`;
document.head.appendChild(style);

export default PrioritizationDashboard;
