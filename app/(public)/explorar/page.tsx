import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { SearchBar } from "./_components/search-bar";
import { FilterPanel } from "./_components/filter-panel";
import { ServiceCard } from "./_components/service-card";
import { Pagination } from "./_components/pagination";
import { EmptyState } from "./_components/empty-state";
import { searchServices, getFilterOptions } from "./actions";
import { ActivityCategory, DifficultyLevel, Duration } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

interface ExplorarPageProps {
  searchParams: Promise<{
    q?: string;
    categories?: string;
    regions?: string;
    difficulties?: string;
    durations?: string;
    page?: string;
  }>;
}

// Skeleton for service cards
function ServiceCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[4/3] w-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-24" />
    </div>
  );
}

// Loading state for results grid
function ResultsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Server Component for search results
async function SearchResults({ searchParams }: ExplorarPageProps) {
  const params = await searchParams;
  const query = params.q;
  const page = parseInt(params.page || "1");

  // Parse filters from URL params
  const filters = {
    categories: params.categories?.split(",").filter(Boolean) as ActivityCategory[] | undefined,
    regions: params.regions?.split(",").filter(Boolean),
    difficulties: params.difficulties?.split(",").filter(Boolean) as DifficultyLevel[] | undefined,
    durations: params.durations?.split(",").filter(Boolean) as Duration[] | undefined,
  };

  const hasFilters = !!(
    filters.categories?.length ||
    filters.regions?.length ||
    filters.difficulties?.length ||
    filters.durations?.length
  );

  // Fetch results
  const results = await searchServices({ query, filters, page, limit: 12 });

  if (results.services.length === 0) {
    return <EmptyState query={query} hasFilters={hasFilters} />;
  }

  return (
    <>
      {/* Results header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          {query ? (
            <>
              Resultados para "<span className="text-primary">{query}</span>"
            </>
          ) : (
            "Todas las experiencias"
          )}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {results.total} experiencia{results.total !== 1 ? "s" : ""} encontrada{results.total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {results.services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={results.page}
        totalPages={results.totalPages}
        total={results.total}
      />
    </>
  );
}

// Server Component for filter panel
async function FilterPanelWrapper() {
  const filterOptions = await getFilterOptions();
  return <FilterPanel options={filterOptions} />;
}

export default function ExplorarPage({ searchParams }: ExplorarPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Search */}
        <section className="border-b bg-muted/30">
          <div className="container py-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Descubre tu próxima aventura
              </h1>
              <p className="text-muted-foreground mb-6">
                Explora cientos de experiencias de turismo aventura en todo Chile
              </p>
              <SearchBar />
            </div>
          </div>
        </section>

        {/* Main Content with Filters and Results */}
        <section className="container py-8">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <Suspense
              fallback={
                <div className="hidden lg:block w-80 flex-shrink-0">
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-px w-full" />
                    <Skeleton className="h-64 w-full" />
                  </div>
                </div>
              }
            >
              <FilterPanelWrapper />
            </Suspense>

            {/* Results Area */}
            <div className="flex-1 min-w-0">
              {/* Mobile filter button */}
              <div className="mb-4 lg:hidden">
                <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                  <FilterPanelWrapper />
                </Suspense>
              </div>

              {/* Results */}
              <Suspense fallback={<ResultsGridSkeleton />}>
                <SearchResults searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/50 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Aventura Marketplace. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

// Metadata
export const metadata = {
  title: "Explorar Experiencias",
  description:
    "Descubre y reserva experiencias de turismo aventura en Chile: kayak, rafting, trekking, pesca y más.",
};
