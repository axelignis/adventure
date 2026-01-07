"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }

      // Reset to page 1 when searching
      params.delete("page");

      router.push(`/explorar?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setQuery("");

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      params.delete("page");
      router.push(`/explorar?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-3xl">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar experiencias... (ej: kayak, trekking)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 h-12 text-base"
            disabled={isPending}
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              disabled={isPending}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Limpiar búsqueda</span>
            </Button>
          )}
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 px-6"
          disabled={isPending}
        >
          {isPending ? "Buscando..." : "Buscar"}
        </Button>
      </div>
    </form>
  );
}
