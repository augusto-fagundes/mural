// src/components/NotificationSystem.tsx
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
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bell,
  BellRing,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Clock,
  X,
  Settings,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PrioritizedSuggestion } from "@/hooks/usePrioritization";

interface Notification {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  category: 'priority' | 'engagement' | 'system' | 'analytics';
  actionable?: boolean;
  suggestionId?: string;
}

interface NotificationSettings {
  urgentAlerts: boolean;
  priorityChanges: boolean;
  lowEngagement: boolean;
  highScoreThreshold: boolean;
  weeklyReports: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  scoreThreshold: number;
  engagementThreshold: number;
}

interface NotificationSystemProps {
  suggestions: PrioritizedSuggestion[];
}

const NotificationSystem = ({ suggestions }: NotificationSystemProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    urgentAlerts: true,
    priorityChanges: true,
    lowEngagement: true,
    highScoreThreshold: true,
    weeklyReports: false,
    emailNotifications: false,
    pushNotifications: true,
    scoreThreshold: 400,
    engagementThreshold: 5,
  });
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent' | 'today'>('all');

  // Gerar notificações baseadas nas sugestões
  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = [];
      const now = new Date();

      // Verificar sugestões urgentes
      const urgentSuggestions = suggestions.filter(s => s.nivel.nivel === 'Urgente');
      if (urgentSuggestions.length > 0 && settings.urgentAlerts) {
        newNotifications.push({
          id: `urgent-${Date.now()}`,
          type: 'urgent',
          title: `${urgentSuggestions.length} Sugestão(ões) Urgente(s)`,
          message: `Há ${urgentSuggestions.length} sugestões com prioridade urgente que precisam de atenção imediata.`,
          timestamp: now,
          read: false,
          category: 'priority',
          actionable: true,
        });
      }

      // Verificar sugestões com score alto
      const highScoreSuggestions = suggestions.filter(s => s.score >= settings.scoreThreshold);
      if (highScoreSuggestions.length > 0 && settings.highScoreThreshold) {
        newNotifications.push({
          id: `high-score-${Date.now()}`,
          type: 'warning',
          title: `${highScoreSuggestions.length} Sugestão(ões) com Score Alto`,
          message: `${highScoreSuggestions.length} sugestões atingiram o limite de score de ${settings.scoreThreshold} pontos.`,
          timestamp: now,
          read: false,
          category: 'analytics',
          actionable: true,
        });
      }

      // Verificar baixo engajamento
      const lowEngagementSuggestions = suggestions.filter(s => 
        s.votes < settings.engagementThreshold && s.comments_count === 0
      );
      if (lowEngagementSuggestions.length > 5 && settings.lowEngagement) {
        newNotifications.push({
          id: `low-engagement-${Date.now()}`,
          type: 'info',
          title: 'Baixo Engajamento Detectado',
          message: `${lowEngagementSuggestions.length} sugestões têm baixo engajamento da comunidade.`,
          timestamp: now,
          read: false,
          category: 'engagement',
          actionable: true,
        });
      }

      // Análise de tendências
      const avgScore = suggestions.reduce((sum, s) => sum + s.score, 0) / suggestions.length;
      if (avgScore > 300) {
        newNotifications.push({
          id: `trend-positive-${Date.now()}`,
          type: 'success',
          title: 'Tendência Positiva de Qualidade',
          message: `O score médio das sugestões está em ${Math.round(avgScore)} pontos, indicando alta qualidade.`,
          timestamp: now,
          read: false,
          category: 'analytics',
          actionable: false,
        });
      }

      // Clientes enterprise com muitas sugestões
      const enterpriseActivity = suggestions.filter(s => 
        s.clientData.nome.includes('TELECOM') || s.clientData.nome.includes('NET')
      );
      if (enterpriseActivity.length > 3) {
        newNotifications.push({
          id: `enterprise-activity-${Date.now()}`,
          type: 'info',
          title: 'Alta Atividade de Clientes Enterprise',
          message: `Clientes enterprise enviaram ${enterpriseActivity.length} sugestões recentemente.`,
          timestamp: now,
          read: false,
          category: 'analytics',
          actionable: true,
        });
      }

      setNotifications(prev => {
        const existingIds = prev.map(n => n.id);
        const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.id));
        return [...prev, ...uniqueNew].slice(-20); // Manter apenas as 20 mais recentes
      });
    };

    if (suggestions.length > 0) {
      generateNotifications();
    }
  }, [suggestions, settings]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.type === 'urgent' && !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    switch (filter) {
      case 'unread':
        filtered = notifications.filter(n => !n.read);
        break;
      case 'urgent':
        filtered = notifications.filter(n => n.type === 'urgent');
        break;
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filtered = notifications.filter(n => n.timestamp >= today);
        break;
    }
    
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50 dark:bg-red-950';
      case 'warning':
        return 'border-l-orange-500 bg-orange-50 dark:bg-orange-950';
      case 'success':
        return 'border-l-green-500 bg-green-50 dark:bg-green-950';
      default:
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950';
    }
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div className={`p-4 border-l-4 rounded-lg ${getNotificationColor(notification.type)} ${
      !notification.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {getNotificationIcon(notification.type)}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
              )}
              <Badge variant="outline" className="text-xs">
                {notification.category}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {notification.message}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {notification.timestamp.toLocaleString('pt-BR')}
              </span>
              <div className="flex items-center gap-2">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                    className="text-xs h-6"
                  >
                    Marcar como lida
                  </Button>
                )}
                {notification.actionable && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-6"
                    onClick={() => {
                      toast({
                        title: "Ação executada",
                        description: "Redirecionando para a sugestão relevante...",
                      });
                      markAsRead(notification.id);
                    }}
                  >
                    Ver Detalhes
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteNotification(notification.id)}
          className="h-6 w-6 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          {urgentCount > 0 ? (
            <BellRing className="w-4 h-4 mr-2 text-red-600" />
          ) : (
            <Bell className="w-4 h-4 mr-2" />
          )}
          Notificações
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Central de Notificações
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            {/* Controles */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="unread">Não lidas</SelectItem>
                    <SelectItem value="urgent">Urgentes</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant="secondary">
                  {getFilteredNotifications().length} notificações
                </Badge>
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  Marcar todas como lidas
                </Button>
              )}
            </div>

            {/* Lista de Notificações */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getFilteredNotifications().length > 0 ? (
                getFilteredNotifications().map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              ) : (
                <Card className="p-8">
                  <div className="text-center">
                    <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Nenhuma notificação
                    </h3>
                    <p className="text-gray-500">
                      {filter === 'all' 
                        ? 'Você está em dia com todas as notificações!' 
                        : `Nenhuma notificação encontrada para o filtro "${filter}".`
                      }
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tipos de Alerta */}
                <div>
                  <h4 className="font-semibold mb-4">Tipos de Alerta</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="urgent-alerts">Alertas Urgentes</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Notificar sobre sugestões com prioridade urgente
                        </p>
                      </div>
                      <Switch
                        id="urgent-alerts"
                        checked={settings.urgentAlerts}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, urgentAlerts: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="priority-changes">Mudanças de Prioridade</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Notificar sobre alterações significativas de score
                        </p>
                      </div>
                      <Switch
                        id="priority-changes"
                        checked={settings.priorityChanges}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, priorityChanges: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="low-engagement">Baixo Engajamento</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Alertar sobre sugestões com pouca interação
                        </p>
                      </div>
                      <Switch
                        id="low-engagement"
                        checked={settings.lowEngagement}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, lowEngagement: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="high-score">Score Alto</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Notificar quando sugestões atingem score alto
                        </p>
                      </div>
                      <Switch
                        id="high-score"
                        checked={settings.highScoreThreshold}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, highScoreThreshold: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Limites */}
                <div>
                  <h4 className="font-semibold mb-4">Limites de Alerta</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="score-threshold">Limite de Score</Label>
                      <Select 
                        value={String(settings.scoreThreshold)} 
                        onValueChange={(value) => 
                          setSettings(prev => ({ ...prev, scoreThreshold: Number(value) }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="300">300 pontos</SelectItem>
                          <SelectItem value="400">400 pontos</SelectItem>
                          <SelectItem value="500">500 pontos</SelectItem>
                          <SelectItem value="600">600 pontos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="engagement-threshold">Limite de Engajamento</Label>
                      <Select 
                        value={String(settings.engagementThreshold)} 
                        onValueChange={(value) => 
                          setSettings(prev => ({ ...prev, engagementThreshold: Number(value) }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 votos</SelectItem>
                          <SelectItem value="5">5 votos</SelectItem>
                          <SelectItem value="10">10 votos</SelectItem>
                          <SelectItem value="15">15 votos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Canais de Notificação */}
                <div>
                  <h4 className="font-semibold mb-4">Canais de Notificação</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications">Notificações Push</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receber notificações no navegador
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, pushNotifications: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Notificações por Email</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receber resumos por email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-reports">Relatórios Semanais</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receber resumo semanal de atividades
                        </p>
                      </div>
                      <Switch
                        id="weekly-reports"
                        checked={settings.weeklyReports}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, weeklyReports: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSystem;