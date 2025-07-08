import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, TrendingUp } from "lucide-react";
import { useSuggestionStatuses } from "@/hooks/useSuggestionStatuses";
import { useModules } from "@/contexts/ModulesContext";
import { useDebounce } from "@/hooks/useDebounce";

interface FilterBarProps {
  suggestions: any[];
  filterSuggestions: (moduleId: string, statusId: string, searchTerm: string) => Promise<void>;
}

const FilterBar = ({ suggestions, filterSuggestions }: FilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const { modules } = useModules();
  const { statuses } = useSuggestionStatuses();

  useEffect(() => {
    filterSuggestions(moduleFilter, statusFilter, debouncedSearchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, moduleFilter, statusFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setModuleFilter("");
    setStatusFilter("");
    setSortBy("recent");
    filterSuggestions("", "", "");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filtros e Busca</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input placeholder="Buscar sugestões..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>

        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Módulo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os módulos</SelectItem>
            {modules.map((module) => (
              <SelectItem key={module.id} value={module.id}>
                {module.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais recentes</SelectItem>
            <SelectItem value="votes">Mais votadas</SelectItem>
            <SelectItem value="comments">Mais comentadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>{suggestions.length} sugestões encontradas</span>
        </div>

        <Button variant="outline" size="sm" onClick={clearFilters}>
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
