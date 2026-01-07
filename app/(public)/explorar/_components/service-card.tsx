import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { ActivityCategory, DifficultyLevel, Duration } from "@prisma/client";

interface ServiceCardProps {
  service: {
    id: string;
    slug: string;
    title: string;
    description: string;
    category: ActivityCategory;
    difficulty: DifficultyLevel;
    duration: Duration;
    priceBase: number;
    rating: number | null;
    reviewCount: number;
    coverImage: string | null;
    region: {
      name: string;
      slug: string;
    };
    comuna: {
      name: string;
      slug: string;
    };
  };
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

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/experiencias/${service.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {service.coverImage ? (
            <Image
              src={service.coverImage}
              alt={service.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="text-4xl">🏔️</span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-medium">
              {categoryLabels[service.category]}
            </span>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-medium">
              {difficultyLabels[service.difficulty]}
            </span>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {service.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {service.comuna.name}, {service.region.name}
            </span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>{durationLabels[service.duration]}</span>
          </div>

          {/* Rating & Reviews */}
          {service.rating !== null && service.reviewCount > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm">
                  {service.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({service.reviewCount} {service.reviewCount === 1 ? "reseña" : "reseñas"})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4" />
              <span>Sin reseñas aún</span>
            </div>
          )}

          {/* Price */}
          <div className="pt-3 border-t flex items-baseline justify-between">
            <div>
              <span className="text-xs text-muted-foreground">Desde</span>
              <p className="text-2xl font-bold">{formatPrice(service.priceBase)}</p>
            </div>
            <div className="text-xs text-muted-foreground">
              por persona
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
