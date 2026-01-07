import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
  images: {
    url: string;
    altText: string | null;
  }[];
}

interface ReviewsSectionProps {
  reviews: Review[];
  ratingBreakdown: {
    breakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
    total: number;
    average: number;
  };
}

export function ReviewsSection({ reviews, ratingBreakdown }: ReviewsSectionProps) {
  const { breakdown, total, average } = ratingBreakdown;

  if (total === 0) {
    return (
      <div className="text-center py-12">
        <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aún no hay reseñas</h3>
        <p className="text-muted-foreground">
          Sé el primero en compartir tu experiencia
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Reseñas de viajeros</h2>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Overall Rating */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{average}</div>
              <div className="flex items-center justify-center mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(average)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {total} {total === 1 ? "reseña" : "reseñas"}
              </p>
            </div>

            <Separator orientation="vertical" className="h-24" />

            {/* Rating Breakdown */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = breakdown[rating as keyof typeof breakdown];
                const percentage = total > 0 ? (count / total) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <Progress value={percentage} className="flex-1 h-2" />
                    <span className="text-sm text-muted-foreground w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              {/* Review Header */}
              <div className="flex items-start gap-4 mb-4">
                <Avatar>
                  <AvatarImage
                    src={review.user.image || undefined}
                    alt={review.user.name || "Usuario"}
                  />
                  <AvatarFallback>
                    {review.user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">
                      {review.user.name || "Usuario"}
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(review.createdAt), "PP", { locale: es })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Title */}
              {review.title && (
                <h5 className="font-semibold mb-2">{review.title}</h5>
              )}

              {/* Review Comment */}
              <p className="text-muted-foreground leading-relaxed mb-4">
                {review.comment}
              </p>

              {/* Review Images */}
              {review.images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {review.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || `Foto ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
