// src/components/PrioritizationFilterBar.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, TrendingUp } from "lucide-react";

interface PrioritizationFilterBarProps {
  totalItems: number;
  sortBy: "score" | "votes" | "comments";
  setSortBy: (value: "score" | "votes" | "comments") => void;
}

const PrioritizationFilterBar = ({
  totalItems,
  sortBy,
  setSortBy,
}: PrioritizationFilterBarProps) => {
  return (
    <div className="bg-white dark:bg-[#282a36] rounded-lg shadow-sm border border-gray-200 dark:border-[#44475a] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-[#bd93f9]" />
          <h3 className="font-semibold text-gray-900 dark:text-[#f8f8f2]">
            Ordenar por
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#bd93f9]">
          <TrendingUp className="w-4 h-4" />
          <span>{totalItems} sugestões priorizadas</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as any)}
        >
          <SelectTrigger className="dark:bg-[#44475a] dark:text-[#f8f8f2] dark:border-[#6272a4]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent className="dark:bg-[#282a36] dark:text-[#f8f8f2]">
            <SelectItem value="score">Maior Score</SelectItem>
            <SelectItem value="votes">Mais Votadas</SelectItem>
            <SelectItem value="comments">Mais Comentadas</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PrioritizationFilterBar;
