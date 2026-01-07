import Link from "next/link";
import { ServiceCard } from "@/app/(public)/explorar/_components/service-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  priceBase: number;
  coverImage: string | null;
  rating: number | null;
  reviewCount: number;
  region: {
    name: string;
  };
  comuna: {
    name: string;
  };
  _count: {
    reviews: number;
  };
}

interface RelatedServicesProps {
  services: Service[];
  currentCategory: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  KAYAK: "Kayak",
  RAFTING: "Rafting",
  TREKKING: "Trekking",
  PESCA: "Pesca",
  MONTANISMO: "Montañismo",
  CICLISMO: "Ciclismo",
  ESCALADA: "Escalada",
  OTROS: "Otros",
};

export function RelatedServices({ services, currentCategory }: RelatedServicesProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/50">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Experiencias similares
            </h2>
            <p className="text-muted-foreground">
              Otras aventuras de {CATEGORY_LABELS[currentCategory] || "esta categoría"}
            </p>
          </div>

          <Button variant="outline" asChild className="hidden md:flex">
            <Link href={`/explorar?categories=${currentCategory}`}>
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={{
                ...service,
                reviewCount: service._count.reviews,
              }}
            />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild className="w-full">
            <Link href={`/explorar?categories=${currentCategory}`}>
              Ver todas las experiencias
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
