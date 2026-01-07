"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ActivityCategory, DifficultyLevel, Duration } from "@prisma/client";

interface FilterOptions {
  regions: Array<{ id: string; name: string; slug: string; count: number }>;
  categories: Array<{ value: ActivityCategory; count: number }>;
  difficulties: Array<{ value: DifficultyLevel; count: number }>;
  durations: Array<{ value: Duration; count: number }>;
}

interface FilterPanelProps {
  options: FilterOptions;
}

const categoryLabels: Record<ActivityCategory, string> = {
  KAYAK: "Kayak",
  RAFTING: "Rafting",
  TREKKING: "Trekking",
  PESCA: "Pesca",
  MONTANISMO: "Montañismo",
  CICLISMO: "Ciclismo",
  ESCALADA: "Escalada",
  OTROS: "Otros",
};

const difficultyLabels: Record<DifficultyLevel, string> = {
  PRINCIPIANTE: "Principiante",
  BASICO: "Básico",
  INTERMEDIO: "Intermedio",
  AVANZADO: "Avanzado",
  EXPERTO: "Experto",
};

const durationLabels: Record<Duration, string> = {
  MEDIO_DIA: "Medio día",
  DIA_COMPLETO: "Día completo",
  MULTI_DIA: "Multi-día",
};

export function FilterPanel({ options }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
  const regions = searchParams.get("regions")?.split(",").filter(Boolean) || [];
  const difficulties = searchParams.get("difficulties")?.split(",").filter(Boolean) || [];
  const durations = searchParams.get("durations")?.split(",").filter(Boolean) || [];

  const hasActiveFilters =
    categories.length > 0 ||
    regions.length > 0 ||
    difficulties.length > 0 ||
    durations.length > 0;

  const updateFilter = (type: string, value: string, checked: boolean) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(type)?.split(",").filter(Boolean) || [];

      let updated: string[];
      if (checked) {
        updated = [...current, value];
      } else {
        updated = current.filter((v) => v !== value);
      }

      if (updated.length > 0) {
        params.set(type, updated.join(","));
      } else {
        params.delete(type);
      }

      // Reset to page 1 when filtering
      params.delete("page");

      router.push(`/explorar?${params.toString()}`);
    });
  };

  const clearAllFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("categories");
      params.delete("regions");
      params.delete("difficulties");
      params.delete("durations");
      params.delete("page");

      router.push(`/explorar?${params.toString()}`);
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear filters button */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Filtros activos
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            disabled={isPending}
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar todo
          </Button>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Categoría</Label>
        <div className="space-y-2">
          {options.categories.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category.value}`}
                checked={categories.includes(category.value)}
                onCheckedChange={(checked) =>
                  updateFilter("categories", category.value, checked as boolean)
                }
                disabled={isPending}
              />
              <label
                htmlFor={`cat-${category.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
              >
                {categoryLabels[category.value]}
                <span className="text-muted-foreground ml-1">({category.count})</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Regions */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Región</Label>
        <div className="space-y-2">
          {options.regions.map((region) => (
            <div key={region.id} className="flex items-center space-x-2">
              <Checkbox
                id={`reg-${region.id}`}
                checked={regions.includes(region.id)}
                onCheckedChange={(checked) =>
                  updateFilter("regions", region.id, checked as boolean)
                }
                disabled={isPending}
              />
              <label
                htmlFor={`reg-${region.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
              >
                {region.name}
                <span className="text-muted-foreground ml-1">({region.count})</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Difficulty */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Nivel de dificultad</Label>
        <div className="space-y-2">
          {options.difficulties.map((difficulty) => (
            <div key={difficulty.value} className="flex items-center space-x-2">
              <Checkbox
                id={`diff-${difficulty.value}`}
                checked={difficulties.includes(difficulty.value)}
                onCheckedChange={(checked) =>
                  updateFilter("difficulties", difficulty.value, checked as boolean)
                }
                disabled={isPending}
              />
              <label
                htmlFor={`diff-${difficulty.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
              >
                {difficultyLabels[difficulty.value]}
                <span className="text-muted-foreground ml-1">({difficulty.count})</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Duration */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Duración</Label>
        <div className="space-y-2">
          {options.durations.map((duration) => (
            <div key={duration.value} className="flex items-center space-x-2">
              <Checkbox
                id={`dur-${duration.value}`}
                checked={durations.includes(duration.value)}
                onCheckedChange={(checked) =>
                  updateFilter("durations", duration.value, checked as boolean)
                }
                disabled={isPending}
              />
              <label
                htmlFor={`dur-${duration.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
              >
                {durationLabels[duration.value]}
                <span className="text-muted-foreground ml-1">({duration.count})</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-20 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filtros</h2>
            {hasActiveFilters && (
              <span className="text-sm text-primary">
                {[categories, regions, difficulties, durations].flat().length} activos
              </span>
            )}
          </div>
          <Separator />
          <FilterContent />
        </div>
      </div>

      {/* Mobile sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                  {[categories, regions, difficulties, durations].flat().length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>
                Refina tu búsqueda de experiencias
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
