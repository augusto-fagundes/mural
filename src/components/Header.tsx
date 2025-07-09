import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  onCreateSuggestion: () => void;
}

const Header = ({ onCreateSuggestion }: HeaderProps) => {
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate("/admin");
  };

  return (
    <header className="bg-white/95 dark:bg-[#282a36]/95 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-[#44475a] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/placeholder.svg" alt="MK Solutions" className="h-8 w-8 rounded-lg" />
            <span className="text-xl font-bold text-gray-900 dark:text-[#f8f8f2]">MK Solutions</span>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              onClick={onCreateSuggestion}
              className="bg-gradient-to-r from-dark_blue_mk to-dark_blue_mk hover:from-blue_mk hover:to-blue_mk text-white dark:from-[#bd93f9] dark:to-[#ff79c6] dark:hover:from-[#bd93f9] dark:hover:to-[#ff79c6] dark:text-[#282a36]"
            >
              Nova Sugestão
            </Button>
            {/* <Button
              onClick={handleAdminClick}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Settings className="w-4 h-4" />
              Admin
            </Button> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
