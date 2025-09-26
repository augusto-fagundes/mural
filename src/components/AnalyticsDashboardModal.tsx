// src/components/AnalyticsDashboardModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { PrioritizedSuggestion } from "@/hooks/usePrioritization";

interface AnalyticsDashboardModalProps {
  suggestions: PrioritizedSuggestion[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const AnalyticsDashboardModal = ({ 
  suggestions, 
  open, 
  onOpenChange, 
  children 
}: AnalyticsDashboardModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setIsOpen(newOpen);
    }
  };
  
  const isControlled = open !== undefined;
  const modalOpen = isControlled ? open : isOpen;

  if (children) {
    return (
      <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Analytics Dashboard
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <AnalyticsDashboard suggestions={suggestions} />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Analytics Dashboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <AnalyticsDashboard suggestions={suggestions} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyticsDashboardModal;