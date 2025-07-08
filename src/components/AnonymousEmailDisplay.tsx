import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, User, Shield } from "lucide-react";
import { useAnonymousEmail } from "@/hooks/useAnonymousEmail";
import { useToast } from "@/hooks/use-toast";

export const AnonymousEmailDisplay = () => {
  const { anonymousEmail, loading, resetAnonymousEmail } = useAnonymousEmail();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetEmail = async () => {
    setIsResetting(true);
    try {
      const newEmail = resetAnonymousEmail();
      toast({
        title: "Email anônimo resetado",
        description: "Um novo email anônimo foi gerado para você.",
      });
    } catch (error) {
      toast({
        title: "Erro ao resetar email",
        description: "Não foi possível gerar um novo email anônimo.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" />
            Identidade Anônima
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Identidade Anônima
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Email Anônimo
          </Badge>
          <span className="text-sm text-gray-600 dark:text-gray-300 font-mono">{anonymousEmail}</span>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">Este email é único para você e permite votar nas sugestões de forma anônima.</div>

        <Button variant="outline" size="sm" onClick={handleResetEmail} disabled={isResetting} className="w-full">
          <RefreshCw className={`w-4 h-4 mr-2 ${isResetting ? "animate-spin" : ""}`} />
          {isResetting ? "Resetando..." : "Gerar Novo Email"}
        </Button>
      </CardContent>
    </Card>
  );
};
