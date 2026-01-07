"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Frown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  query?: string;
  hasFilters: boolean;
}

export function EmptyState({ query, hasFilters }: EmptyStateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clearAllFilters = () => {
    router.push("/explorar");
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");
    router.push(`/explorar?${params.toString()}`);
  };

  if (query) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <Search className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">
          No encontramos resultados para "{query}"
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Intenta con otros términos de búsqueda o ajusta los filtros.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={clearSearch}>
            Limpiar búsqueda
          </Button>
          {hasFilters && (
            <Button onClick={clearAllFilters}>
              Ver todas las experiencias
            </Button>
          )}
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p className="font-medium mb-2">Sugerencias:</p>
          <ul className="list-disc list-inside space-y-1 text-left max-w-sm">
            <li>Verifica la ortografía</li>
            <li>Usa términos más generales</li>
            <li>Prueba con sinónimos</li>
            <li>Quita algunos filtros</li>
          </ul>
        </div>
      </div>
    );
  }

  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <Frown className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">
          No hay experiencias con estos filtros
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Intenta ajustar o quitar algunos filtros para ver más resultados.
        </p>
        <Button onClick={clearAllFilters}>
          Limpiar todos los filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">
        No hay experiencias disponibles
      </h2>
      <p className="text-muted-foreground max-w-md">
        Por el momento no tenemos experiencias publicadas. Vuelve pronto para descubrir aventuras increíbles.
      </p>
    </div>
  );
}
