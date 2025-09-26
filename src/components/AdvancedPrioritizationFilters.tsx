// src/components/AdvancedPrioritizationFilters.tsx
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider,
} from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Filter,
  X,
  TrendingUp,
  Users,
  Shield,
  Star,
  Heart,
  Building2,
  RotateCcw,
} from "lucide-react";
import { PrioritizedSuggestion } from "@/hooks/usePrioritization";
import { CLIENTES_ENTERPRISE } from "@/config/prioritization.config";

export interface FilterState {
  sortBy: "score" | "votes" | "comments";
  nivelPrioridade: string[];
  faixaClientes: string;
  statusPreventivo: string[];
  clienteEnterprise: string;
  npsRange: [number, number];
  fidelidade: string[];
  scoreRange: [number, number];
  showArchived: boolean;
}

interface AdvancedPrioritizationFiltersProps {
  suggestions: PrioritizedSuggestion[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalItems: number;
  filteredCount: number;
}

const AdvancedPrioritizationFilters = ({
  suggestions,
  filters,
  onFiltersChange,
  totalItems,
  filteredCount,
}: AdvancedPrioritizationFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      sortBy: "score",
      nivelPrioridade: [],
      faixaClientes: "all",
      statusPreventivo: [],
      clienteEnterprise: "all",
      npsRange: [0, 10],
      fidelidade: [],
      scoreRange: [0, 1000],
    showArchived: false,
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const removeFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case "nivelPrioridade":
        updateFilter(
          "nivelPrioridade",
          localFilters.nivelPrioridade.filter((item) => item !== value)
        );
        break;
      case "statusPreventivo":
        updateFilter(
          "statusPreventivo",
          localFilters.statusPreventivo.filter((item) => item !== value)
        );
        break;
      case "fidelidade":
        updateFilter(
          "fidelidade",
          localFilters.fidelidade.filter((item) => item !== value)
        );
        break;
      case "faixaClientes":
        updateFilter("faixaClientes", "all");
        break;
      case "clienteEnterprise":
        updateFilter("clienteEnterprise", "all");
        break;
      case "showArchived":
        updateFilter("showArchived", false);
        break;
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.nivelPrioridade.length > 0) count++;
    if (localFilters.faixaClientes !== "all") count++;
    if (localFilters.statusPreventivo.length > 0) count++;
    if (localFilters.clienteEnterprise !== "all") count++;
    if (localFilters.npsRange[0] > 0 || localFilters.npsRange[1] < 10) count++;
    if (localFilters.fidelidade.length > 0) count++;
    if (localFilters.scoreRange[0] > 0 || localFilters.scoreRange[1] < 1000) count++;
    if (localFilters.showArchived) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">Filtros Avançados</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} ativo{activeFiltersCount > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>
                {filteredCount} de {totalItems} sugestões
              </span>
            </div>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-0">
        {/* Ordenação */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ordenar por</label>
            <Select
              value={localFilters.sortBy}
              onValueChange={(value) => updateFilter("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Maior Score</SelectItem>
                <SelectItem value="votes">Mais Votadas</SelectItem>
                <SelectItem value="comments">Mais Comentadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nível de Prioridade */}
          <div>
            <label className="block text-sm font-medium mb-2">Nível de Prioridade</label>
            <Select
              value={localFilters.nivelPrioridade.join(",") || "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  updateFilter("nivelPrioridade", []);
                } else {
                  const currentValues = localFilters.nivelPrioridade;
                  if (currentValues.includes(value)) {
                    updateFilter(
                      "nivelPrioridade",
                      currentValues.filter((v) => v !== value)
                    );
                  } else {
                    updateFilter("nivelPrioridade", [...currentValues, value]);
                  }
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os níveis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os níveis</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
                <SelectItem value="1">Nível 1</SelectItem>
                <SelectItem value="2">Nível 2</SelectItem>
                <SelectItem value="3">Nível 3</SelectItem>
                <SelectItem value="4">Nível 4</SelectItem>
                <SelectItem value="5">Nível 5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Faixa de Clientes */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1">
              <Users className="w-4 h-4" />
              Faixa de Clientes
            </label>
            <Select
              value={localFilters.faixaClientes}
              onValueChange={(value) => updateFilter("faixaClientes", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as faixas</SelectItem>
                <SelectItem value="0-5000">Até 5.000</SelectItem>
                <SelectItem value="5001-10000">5.001 - 10.000</SelectItem>
                <SelectItem value="10001-15000">10.001 - 15.000</SelectItem>
                <SelectItem value="15001-20000">15.001 - 20.000</SelectItem>
                <SelectItem value="20001-30000">20.001 - 30.000</SelectItem>
                <SelectItem value="30001-50000">30.001 - 50.000</SelectItem>
                <SelectItem value="50001+">Acima de 50.000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cliente Enterprise */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              Cliente Enterprise
            </label>
            <Select
              value={localFilters.clienteEnterprise}
              onValueChange={(value) => updateFilter("clienteEnterprise", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="enterprise">Apenas Enterprise</SelectItem>
                <SelectItem value="non-enterprise">Não Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Segunda linha de filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Preventivo */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Status Preventivo
            </label>
            <Select
              value={localFilters.statusPreventivo.join(",") || "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  updateFilter("statusPreventivo", []);
                } else {
                  const currentValues = localFilters.statusPreventivo;
                  if (currentValues.includes(value)) {
                    updateFilter(
                      "statusPreventivo",
                      currentValues.filter((v) => v !== value)
                    );
                  } else {
                    updateFilter("statusPreventivo", [...currentValues, value]);
                  }
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Preventivo Urgente">Preventivo Urgente</SelectItem>
                <SelectItem value="Preventivo Crítico">Preventivo Crítico</SelectItem>
                <SelectItem value="Preventivo Atenção">Preventivo Atenção</SelectItem>
                <SelectItem value="N/A">N/A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fidelidade */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1">
              <Heart className="w-4 h-4" />
              Fidelidade
            </label>
            <Select
              value={localFilters.fidelidade.join(",") || "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  updateFilter("fidelidade", []);
                } else {
                  const currentValues = localFilters.fidelidade;
                  if (currentValues.includes(value)) {
                    updateFilter(
                      "fidelidade",
                      currentValues.filter((v) => v !== value)
                    );
                  } else {
                    updateFilter("fidelidade", [...currentValues, value]);
                  }
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="Total">Total</SelectItem>
                <SelectItem value="Parcial">Parcial</SelectItem>
                <SelectItem value="Sem fidelidade">Sem fidelidade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Range de Score */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-1">
              <Star className="w-4 h-4" />
              Faixa de Score: {localFilters.scoreRange[0]} - {localFilters.scoreRange[1]}
            </label>
            <Slider
              value={localFilters.scoreRange}
              onValueChange={(value) => updateFilter("scoreRange", value)}
              max={1000}
              min={0}
              step={10}
              className="mt-2"
            />
          </div>
        </div>

        {/* Terceira linha de filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mostrar Arquivados */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-archived"
              checked={localFilters.showArchived}
              onCheckedChange={(checked) => updateFilter("showArchived", checked)}
            />
            <label
              htmlFor="show-archived"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
            >
              📦 Mostrar sugestões arquivadas
            </label>
          </div>
        </div>

            {/* Filtros ativos */}
            {activeFiltersCount > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Filtros ativos:</h4>
                <div className="flex flex-wrap gap-2">
                  {localFilters.nivelPrioridade.map((nivel) => (
                    <Badge
                      key={nivel}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeFilter("nivelPrioridade", nivel)}
                    >
                      Nível {nivel}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                  {localFilters.faixaClientes !== "all" && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeFilter("faixaClientes")}
                    >
                      Faixa: {localFilters.faixaClientes}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  {localFilters.statusPreventivo.map((status) => (
                    <Badge
                      key={status}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeFilter("statusPreventivo", status)}
                    >
                      {status}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                  {localFilters.clienteEnterprise !== "all" && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeFilter("clienteEnterprise")}
                    >
                      {localFilters.clienteEnterprise === "enterprise" ? "Enterprise" : "Não Enterprise"}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  {localFilters.fidelidade.map((fid) => (
                    <Badge
                      key={fid}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeFilter("fidelidade", fid)}
                    >
                      {fid}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                  {localFilters.showArchived && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeFilter("showArchived")}
                    >
                      📦 Mostrar arquivados
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
    </Card>
  );
};

export default AdvancedPrioritizationFilters;
export type { FilterState };