// src/components/FavoriteModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Mail, Bell, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email: string) => void;
  suggestionTitle: string;
}

const FavoriteModal = ({ isOpen, onClose, onConfirm, suggestionTitle }: FavoriteModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "E-mail obrigatório",
        description: "Por favor, digite seu e-mail para receber notificações.",
        variant: "destructive",
      });
      return;
    }

    // Validar formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, digite um e-mail válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simular delay de envio
    setTimeout(() => {
      onConfirm(email);
      setIsSubmitting(false);
      setEmail("");
      onClose();
      
      toast({
        title: "Favoritado com sucesso!",
        description: `Você receberá notificações sobre "${suggestionTitle}" no e-mail ${email}`,
        variant: "default",
      });
    }, 1000);
  };

  const handleClose = () => {
    setEmail("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Heart className="w-6 h-6 text-red-500" />
            Favoritar Sugestão
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Receba notificações por e-mail
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Você será notificado sobre atualizações, mudanças de status e respostas da equipe para esta sugestão.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium truncate">
              📝 {suggestionTitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Seu e-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Favoritando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Favoritar
                  </div>
                )}
              </Button>
            </div>
          </form>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            💡 Você pode desfavoritar a qualquer momento clicando novamente no coração
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FavoriteModal;