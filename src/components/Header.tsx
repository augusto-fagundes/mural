import { Button } from "@/components/ui/button";
// 1. Importamos os ícones que vamos usar
import { Settings, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import QuickSuggestionTemplates from "./QuickSuggestionTemplates";
import { useSuggestions } from "@/hooks/useSuggestions";
import { useModules } from "@/contexts/ModulesContext";
import { useSuggestionStatuses } from "@/hooks/useSuggestionStatuses";

interface HeaderProps {
  onCreateSuggestion: () => void;
}

const Header = ({ onCreateSuggestion }: HeaderProps) => {
  const navigate = useNavigate();
  const { createSuggestion } = useSuggestions();
  const { modules } = useModules();
  const { statuses } = useSuggestionStatuses();

  const handleAdminClick = () => {
    navigate("/admin");
  };

  // 2. Criamos a função para navegar para a página de priorização
  const handlePrioritizeClick = () => {
    navigate("/prioritize");
  };

  // Função para criar sugestão a partir dos guias
  const handleCreateSuggestionFromGuide = async (data: any) => {
    try {
      // Encontrar o módulo pelo nome
      const module = modules.find(m => m.nome === data.module);
      const moduleId = module?.id || modules[0]?.id; // Fallback para o primeiro módulo

      // Encontrar o status "Recebido" ou usar o primeiro status disponível
      const receivedStatus = statuses.find(s => s.nome === 'Recebido');
      const statusId = receivedStatus?.id || statuses[0]?.id;

      const suggestionData = {
        title: data.title,
        description: data.description,
        module_id: moduleId,
        status_id: statusId,
        email: 'sistema@mksolution.com', // Email padrão para sugestões criadas via guias
        isPublic: true
      };

      await createSuggestion(suggestionData);
    } catch (error) {
      console.error('Erro ao criar sugestão:', error);
      // Note: Toast notification should be handled by the useSuggestions hook
      // This is just a fallback log for debugging
    }
  };

  return (
    <header className="bg-white/95 dark:bg-[#282a36]/95 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-[#44475a] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="/placeholder.svg"
              alt="MK Solutions"
              className="h-8 w-8 rounded-lg"
            />
            <span className="text-xl font-bold text-gray-900 dark:text-[#f8f8f2]">
              MK Solutions
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Guias de Melhoria */}
            <QuickSuggestionTemplates onCreateSuggestion={handleCreateSuggestionFromGuide} />

            {/* 3. Adicionamos o novo botão "Priorizar Sugestões" aqui */}
            <Button
              onClick={handlePrioritizeClick}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-[#8be9fd] dark:text-[#8be9fd] dark:hover:bg-[#44475a]"
            >
              <TrendingUp className="w-4 h-4" />
              Priorize
            </Button>

            <Button
              onClick={onCreateSuggestion}
              className="bg-gradient-to-r from-dark_blue_mk to-dark_blue_mk hover:from-blue_mk hover:to-blue_mk text-white dark:from-[#bd93f9] dark:to-[#ff79c6] dark:hover:from-[#bd93f9] dark:hover:to-[#ff79c6] dark:text-[#282a36]"
            >
              Nova Sugestão
            </Button>

            <Button
              onClick={handleAdminClick}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Settings className="w-4 h-4" />
              Admin
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
