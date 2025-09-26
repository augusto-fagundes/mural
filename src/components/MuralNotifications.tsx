// src/components/MuralNotifications.tsx
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Heart, MessageSquare, ThumbsUp, Star, Bell } from "lucide-react";

interface NotificationProps {
  type: 'vote' | 'comment' | 'favorite' | 'suggestion' | 'general';
  title: string;
  description: string;
  duration?: number;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'vote':
      return <ThumbsUp className="w-5 h-5 text-blue-600" />;
    case 'comment':
      return <MessageSquare className="w-5 h-5 text-green-600" />;
    case 'favorite':
      return <Heart className="w-5 h-5 text-red-600" />;
    case 'suggestion':
      return <Star className="w-5 h-5 text-yellow-600" />;
    default:
      return <Bell className="w-5 h-5 text-gray-600" />;
  }
};

export const useMuralNotifications = () => {
  const { toast } = useToast();

  const showNotification = ({ type, title, description, duration = 3000 }: NotificationProps) => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          {getNotificationIcon(type)}
          {title}
        </div>
      ),
      description,
      duration,
    });
  };

  const showVoteNotification = (isVoting: boolean) => {
    showNotification({
      type: 'vote',
      title: isVoting ? "Voto registrado!" : "Voto removido",
      description: isVoting 
        ? "Obrigado por votar! Sua opinião é importante."
        : "Seu voto foi removido com sucesso.",
    });
  };

  const showCommentNotification = () => {
    showNotification({
      type: 'comment',
      title: "Comentário publicado!",
      description: "Seu comentário foi adicionado com sucesso.",
    });
  };

  const showFavoriteNotification = (isFavoriting: boolean) => {
    showNotification({
      type: 'favorite',
      title: isFavoriting ? "Adicionado aos favoritos!" : "Removido dos favoritos",
      description: isFavoriting 
        ? "Você receberá notificações sobre esta sugestão."
        : "Você não receberá mais notificações sobre esta sugestão.",
    });
  };

  const showSuggestionNotification = () => {
    showNotification({
      type: 'suggestion',
      title: "Sugestão enviada!",
      description: "Sua sugestão foi enviada e está sendo analisada.",
      duration: 4000,
    });
  };

  const showWelcomeNotification = () => {
    showNotification({
      type: 'general',
      title: "Bem-vindo ao Mural!",
      description: "Vote, comente e compartilhe suas ideias conosco.",
      duration: 5000,
    });
  };

  return {
    showVoteNotification,
    showCommentNotification,
    showFavoriteNotification,
    showSuggestionNotification,
    showWelcomeNotification,
    showNotification,
  };
};

export default useMuralNotifications;