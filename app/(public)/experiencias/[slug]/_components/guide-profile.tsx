import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Star, Languages, Award } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GuideProfileProps {
  guide: {
    id: string;
    name: string | null;
    image: string | null;
    createdAt: Date;
    guideProfile: {
      bio: string | null;
      bioEn: string | null;
      languages: string[];
      yearsExperience: number | null;
      totalBookings: number;
      averageRating: number | null;
      responseTime: number | null;
      verified: boolean;
    } | null;
  };
}

export function GuideProfile({ guide }: GuideProfileProps) {
  const profile = guide.guideProfile;
  const memberSince = new Date(guide.createdAt).getFullYear();

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold mb-4">Tu guía</h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Guide Info */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={guide.image || undefined} alt={guide.name || "Guía"} />
            <AvatarFallback>
              {guide.name?.charAt(0).toUpperCase() || "G"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{guide.name || "Guía"}</h3>
              {profile?.verified && (
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              )}
            </div>

            {profile && (
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {profile.averageRating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{profile.averageRating.toFixed(1)}</span>
                  </div>
                )}

                <span>·</span>

                <span>{profile.totalBookings} experiencias realizadas</span>

                <span>·</span>

                <span>Miembro desde {memberSince}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        {profile && (
          <div className="grid grid-cols-2 gap-4">
            {profile.yearsExperience && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">Experiencia</span>
                </div>
                <p className="font-semibold">
                  {profile.yearsExperience} años
                </p>
              </div>
            )}

            {profile.languages && profile.languages.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Languages className="h-4 w-4" />
                  <span className="text-sm">Idiomas</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {profile.languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="text-xs">
                      {lang.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {profile.responseTime && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">Responde en</span>
                </div>
                <p className="font-semibold">
                  {profile.responseTime < 60
                    ? `${profile.responseTime} minutos`
                    : `${Math.round(profile.responseTime / 60)} horas`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bio */}
        {profile?.bio && (
          <div className="space-y-2">
            <h4 className="font-semibold">Sobre el guía</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Contact Button */}
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/mensajes?guideId=${guide.id}`}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Contactar guía
          </Link>
        </Button>

        {/* View Profile Link */}
        <div className="text-center">
          <Link
            href={`/guias/${guide.id}`}
            className="text-sm text-primary hover:underline"
          >
            Ver perfil completo
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
