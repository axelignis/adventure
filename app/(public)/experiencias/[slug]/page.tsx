import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Clock,
  Users,
  Mountain,
  Heart,
  Share2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getServiceBySlug,
  getServiceReviews,
  getRatingBreakdown,
  getRelatedServices,
  incrementViewCount,
} from "./actions";
import { ImageGallery } from "./_components/image-gallery";
import { ServiceDetails } from "./_components/service-details";
import { BookingWidget } from "./_components/booking-widget";
import { GuideProfile } from "./_components/guide-profile";
import { ReviewsSection } from "./_components/reviews-section";
import { RelatedServices } from "./_components/related-services";

interface ServicePageProps {
  params: {
    slug: string;
  };
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

const DIFFICULTY_LABELS: Record<string, string> = {
  PRINCIPIANTE: "Principiante",
  BASICO: "Básico",
  INTERMEDIO: "Intermedio",
  AVANZADO: "Avanzado",
  EXPERTO: "Experto",
};

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    return {
      title: "Experiencia no encontrada",
    };
  }

  return {
    title: `${service.title} - Aventura Marketplace`,
    description: service.description.substring(0, 160),
    openGraph: {
      title: service.title,
      description: service.description.substring(0, 160),
      images: service.coverImage ? [service.coverImage] : [],
    },
  };
}

async function ServiceContent({ slug }: { slug: string }) {
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // Increment view count (non-blocking)
  incrementViewCount(service.id);

  // Fetch additional data in parallel
  const [reviews, ratingBreakdown, relatedServices] = await Promise.all([
    getServiceReviews(service.id, 1, 10),
    getRatingBreakdown(service.id),
    getRelatedServices(service.id, service.category, service.regionId, 4),
  ]);

  // Prepare images for gallery
  const images = [
    ...(service.coverImage
      ? [
          {
            url: service.coverImage,
            altText: service.title,
            width: null,
            height: null,
          },
        ]
      : []),
    ...service.images.map((img) => ({
      url: img.url,
      altText: img.altText,
      width: img.width,
      height: img.height,
    })),
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="container py-6">
        {/* Breadcrumb & Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <a href="/explorar" className="hover:text-foreground">
              Explorar
            </a>
            <span>›</span>
            <a
              href={`/explorar?categories=${service.category}`}
              className="hover:text-foreground"
            >
              {CATEGORY_LABELS[service.category]}
            </a>
            <span>›</span>
            <span className="text-foreground">{service.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Compartir</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Guardar en favoritos</span>
            </Button>
          </div>
        </div>

        {/* Title & Quick Info */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {service.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            {service.rating && service.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{service.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({service._count.reviews}{" "}
                  {service._count.reviews === 1 ? "reseña" : "reseñas"})
                </span>
              </div>
            )}

            <span className="text-muted-foreground">·</span>

            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {service.comuna.name}, {service.region.name}
              </span>
            </div>

            <span className="text-muted-foreground">·</span>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">{CATEGORY_LABELS[service.category]}</Badge>
              <Badge variant="outline">
                {DIFFICULTY_LABELS[service.difficulty]}
              </Badge>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <ImageGallery images={images} title={service.title} />
      </section>

      {/* Main Content */}
      <section className="container py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-12">
            <ServiceDetails
              description={service.description}
              duration={service.duration}
              difficulty={service.difficulty}
              minParticipants={service.minParticipants}
              maxParticipants={service.maxParticipants}
              included={service.included}
              notIncluded={service.notIncluded}
              whatToBring={service.whatToBring}
              providedGear={service.providedGear}
              requirements={service.requirements}
              itinerary={service.itinerary}
            />

            <Separator />

            <GuideProfile guide={service.guide} />

            <Separator />

            <ReviewsSection reviews={reviews.reviews} ratingBreakdown={ratingBreakdown} />
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <BookingWidget
              serviceId={service.id}
              priceBase={service.priceBase}
              minParticipants={service.minParticipants}
              maxParticipants={service.maxParticipants}
            />
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <RelatedServices
          services={relatedServices}
          currentCategory={service.category}
        />
      )}
    </>
  );
}

function ServiceSkeleton() {
  return (
    <div className="container py-6 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-[500px] w-full rounded-lg" />
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

export default function ServicePage({ params }: ServicePageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<ServiceSkeleton />}>
          <ServiceContent slug={params.slug} />
        </Suspense>
      </main>
    </div>
  );
}
