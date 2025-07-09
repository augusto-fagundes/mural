import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, TrendingUp } from "lucide-react";
import { useSuggestionStatuses } from "@/hooks/useSuggestionStatuses";
import { useModules } from "@/contexts/ModulesContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useSuggestions } from "@/hooks/useSuggestions";

interface FilterBarProps {
  suggestions: any[];
  filterSuggestions: (moduleId: string, statusId: string, searchTerm: string, customSortBy: string, includePrivate?: boolean) => Promise<void>;
}

const FilterBar = ({ suggestions, filterSuggestions }: FilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { sortBy, setSortBy } = useSuggestions();

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const { modules } = useModules();
  const { statuses } = useSuggestionStatuses();

  useEffect(() => {
    filterSuggestions(moduleFilter, statusFilter, debouncedSearchTerm, sortBy, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, moduleFilter, statusFilter, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setModuleFilter("");
    setStatusFilter("");
    setSortBy("recent");
    filterSuggestions("", "", "", sortBy, false);
  };

  return (
    <div className="bg-white dark:bg-[#282a36] rounded-lg shadow-sm border border-gray-200 dark:border-[#44475a] p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600 dark:text-[#bd93f9]" />
        <h3 className="font-semibold text-gray-900 dark:text-[#f8f8f2]">Filtros e Busca</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400 dark:text-[#bd93f9]" />
          <Input
            placeholder="Buscar sugestões..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 dark:bg-[#44475a] dark:text-[#f8f8f2] dark:placeholder:text-[#6272a4] dark:border-[#6272a4]"
          />
        </div>

        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="dark:bg-[#44475a] dark:text-[#f8f8f2] dark:border-[#6272a4]">
            <SelectValue placeholder="Módulo" />
          </SelectTrigger>
          <SelectContent className="dark:bg-[#282a36] dark:text-[#f8f8f2]">
            <SelectItem value="all">Todos os módulos</SelectItem>
            {modules.map((module) => (
              <SelectItem
                key={module.id}
                value={module.id}
                className="dark:hover:bg-[#bd93f9] dark:hover:text-[#282a36] dark:focus:bg-[#bd93f9] dark:focus:text-[#282a36]"
              >
                {module.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="dark:bg-[#44475a] dark:text-[#f8f8f2] dark:border-[#6272a4]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="dark:bg-[#282a36] dark:text-[#f8f8f2]">
            <SelectItem value="all">Todos os status</SelectItem>
            {statuses.map((status) => (
              <SelectItem
                key={status.id}
                value={status.id}
                className="dark:hover:bg-[#bd93f9] dark:hover:text-[#282a36] dark:focus:bg-[#bd93f9] dark:focus:text-[#282a36]"
              >
                {status.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="dark:bg-[#44475a] dark:text-[#f8f8f2] dark:border-[#6272a4]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent className="dark:bg-[#282a36] dark:text-[#f8f8f2]">
            <SelectItem value="recent">Mais recentes</SelectItem>
            <SelectItem value="votes">Mais votadas</SelectItem>
            <SelectItem value="comments">Mais comentadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#bd93f9]">
          <TrendingUp className="w-4 h-4" />
          <span>{suggestions.length} sugestões encontradas</span>
        </div>

        <Button variant="outline" size="sm" onClick={clearFilters} className="dark:border-[#bd93f9] dark:text-[#bd93f9] dark:hover:bg-[#44475a]">
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
