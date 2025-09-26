// src/components/AnalyticsDashboard.tsx
import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  Award,
  BarChart3,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Star,
  MessageSquare,
} from "lucide-react";
import { PrioritizedSuggestion } from "@/hooks/usePrioritization";
import ExportSystem from "./ExportSystem";

interface AnalyticsDashboardProps {
  suggestions: PrioritizedSuggestion[];
}

const AnalyticsDashboard = ({ suggestions }: AnalyticsDashboardProps) => {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("score");

  const analytics = useMemo(() => {
    if (!suggestions.length) return null;

    // Métricas gerais
    const totalSuggestions = suggestions.length;
    const averageScore = suggestions.reduce((sum, s) => sum + s.score, 0) / totalSuggestions;
    const totalVotes = suggestions.reduce((sum, s) => sum + s.votes, 0);
    const totalComments = suggestions.reduce((sum, s) => sum + s.comments_count, 0);

    // Distribuição por nível de prioridade
    const priorityDistribution = suggestions.reduce((acc, s) => {
      const nivel = String(s.nivel.nivel);
      acc[nivel] = (acc[nivel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityData = Object.entries(priorityDistribution).map(([nivel, count]) => ({
      nivel: nivel === "Urgente" ? "Urgente" : `Nível ${nivel}`,
      count,
      percentage: ((count / totalSuggestions) * 100).toFixed(1),
    }));

    // Top clientes por score
    const clientScores = suggestions.reduce((acc, s) => {
      const cliente = s.clientData.nome;
      if (!acc[cliente]) {
        acc[cliente] = { score: 0, count: 0, votes: 0 };
      }
      acc[cliente].score += s.score;
      acc[cliente].count += 1;
      acc[cliente].votes += s.votes;
      return acc;
    }, {} as Record<string, { score: number; count: number; votes: number }>);

    const topClients = Object.entries(clientScores)
      .map(([nome, data]) => ({
        nome: nome.length > 25 ? nome.substring(0, 25) + "..." : nome,
        score: Math.round(data.score),
        count: data.count,
        votes: data.votes,
        avgScore: Math.round(data.score / data.count),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // Tendência de score ao longo do tempo (simulado)
    const scoreTimeline = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dayScore = suggestions
        .filter(() => Math.random() > 0.7) // Simula sugestões criadas neste dia
        .reduce((sum, s) => sum + s.score, 0) / Math.max(1, suggestions.filter(() => Math.random() > 0.7).length);
      
      return {
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        score: Math.round(dayScore || averageScore + (Math.random() - 0.5) * 100),
        suggestions: Math.floor(Math.random() * 5) + 1,
      };
    });

    // Distribuição por faixa de score
    const scoreRanges = {
      "0-100": 0,
      "101-200": 0,
      "201-300": 0,
      "301-400": 0,
      "401-500": 0,
      "500+": 0,
    };

    suggestions.forEach(s => {
      if (s.score <= 100) scoreRanges["0-100"]++;
      else if (s.score <= 200) scoreRanges["101-200"]++;
      else if (s.score <= 300) scoreRanges["201-300"]++;
      else if (s.score <= 400) scoreRanges["301-400"]++;
      else if (s.score <= 500) scoreRanges["401-500"]++;
      else scoreRanges["500+"]++;
    });

    const scoreDistribution = Object.entries(scoreRanges).map(([range, count]) => ({
      range,
      count,
      percentage: ((count / totalSuggestions) * 100).toFixed(1),
    }));

    // Métricas de engajamento
    const engagementMetrics = {
      avgVotesPerSuggestion: (totalVotes / totalSuggestions).toFixed(1),
      avgCommentsPerSuggestion: (totalComments / totalSuggestions).toFixed(1),
      highEngagementSuggestions: suggestions.filter(s => s.votes > 5 || s.comments_count > 3).length,
      lowEngagementSuggestions: suggestions.filter(s => s.votes === 0 && s.comments_count === 0).length,
    };

    return {
      totalSuggestions,
      averageScore: Math.round(averageScore),
      totalVotes,
      totalComments,
      priorityData,
      topClients,
      scoreTimeline,
      scoreDistribution,
      engagementMetrics,
    };
  }, [suggestions, timeRange]);

  if (!analytics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhum dado disponível para análise</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Insights e métricas detalhadas das sugestões priorizadas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <ExportSystem suggestions={suggestions} analytics={analytics} />
        </div>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Sugestões</p>
                <p className="text-2xl font-bold">{analytics.totalSuggestions}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+12%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Score Médio</p>
                <p className="text-2xl font-bold">{analytics.averageScore}</p>
              </div>
              <Award className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+8%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Votos</p>
                <p className="text-2xl font-bold">{analytics.totalVotes}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+15%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Comentários</p>
                <p className="text-2xl font-bold">{analytics.totalComments}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              <span className="text-red-600">-3%</span>
              <span className="text-gray-500 ml-1">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com diferentes análises */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="engagement">Engajamento</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição por Prioridade */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Nível de Prioridade</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.priorityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ nivel, percentage }) => `${nivel}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribuição por Faixa de Score */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Faixa de Score</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>



        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Clientes por Score Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{client.nome}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {client.count} sugestões • Média: {client.avgScore}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {client.score}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{client.votes} votos</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Média de Votos</p>
                  <p className="text-3xl font-bold text-blue-600">{analytics.engagementMetrics.avgVotesPerSuggestion}</p>
                  <p className="text-xs text-gray-500">por sugestão</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Média de Comentários</p>
                  <p className="text-3xl font-bold text-green-600">{analytics.engagementMetrics.avgCommentsPerSuggestion}</p>
                  <p className="text-xs text-gray-500">por sugestão</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Alto Engajamento</p>
                  <p className="text-3xl font-bold text-orange-600">{analytics.engagementMetrics.highEngagementSuggestions}</p>
                  <p className="text-xs text-gray-500">sugestões</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Baixo Engajamento</p>
                  <p className="text-3xl font-bold text-red-600">{analytics.engagementMetrics.lowEngagementSuggestions}</p>
                  <p className="text-xs text-gray-500">sugestões</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Insights de Engajamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 dark:text-blue-100">Boa Taxa de Engajamento</p>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                      {((analytics.engagementMetrics.highEngagementSuggestions / analytics.totalSuggestions) * 100).toFixed(1)}% das sugestões têm alto engajamento
                    </p>
                  </div>
                </div>
                
                {analytics.engagementMetrics.lowEngagementSuggestions > analytics.totalSuggestions * 0.3 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-900 dark:text-yellow-100">Atenção: Muitas Sugestões sem Engajamento</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-200">
                        {analytics.engagementMetrics.lowEngagementSuggestions} sugestões não receberam votos ou comentários
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;