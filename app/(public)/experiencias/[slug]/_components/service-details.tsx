import {
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Mountain,
  AlertCircle,
  Backpack,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ServiceDetailsProps {
  description: string;
  duration: string;
  difficulty: string;
  minParticipants: number;
  maxParticipants: number;
  included: string[];
  notIncluded: string[];
  whatToBring: string[];
  providedGear: string[];
  requirements?: any;
  itinerary?: any;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  PRINCIPIANTE: "Principiante",
  BASICO: "Básico",
  INTERMEDIO: "Intermedio",
  AVANZADO: "Avanzado",
  EXPERTO: "Experto",
};

const DURATION_LABELS: Record<string, string> = {
  MEDIO_DIA: "Medio día (≤ 4 horas)",
  DIA_COMPLETO: "Día completo (5-10 horas)",
  MULTI_DIA: "Multi-día (> 1 día)",
};

export function ServiceDetails({
  description,
  duration,
  difficulty,
  minParticipants,
  maxParticipants,
  included,
  notIncluded,
  whatToBring,
  providedGear,
  requirements,
  itinerary,
}: ServiceDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Description */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Sobre esta experiencia</h2>
        <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
          {description}
        </p>
      </section>

      <Separator />

      {/* Quick Facts */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Detalles importantes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Duración</p>
              <p className="text-sm text-muted-foreground">
                {DURATION_LABELS[duration] || duration}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mountain className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Nivel de dificultad</p>
              <Badge variant="secondary">
                {DIFFICULTY_LABELS[difficulty] || difficulty}
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Capacidad</p>
              <p className="text-sm text-muted-foreground">
                {minParticipants === maxParticipants
                  ? `${maxParticipants} personas`
                  : `${minParticipants} - ${maxParticipants} personas`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Itinerary */}
      {itinerary && Array.isArray(itinerary) && itinerary.length > 0 && (
        <>
          <section>
            <h3 className="text-xl font-semibold mb-4">Itinerario</h3>
            <div className="space-y-4">
              {itinerary.map((item: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {item.time || index + 1}
                  </div>
                  <div className="flex-1 pt-2">
                    {item.location && (
                      <p className="font-medium text-sm text-muted-foreground mb-1">
                        {item.location}
                      </p>
                    )}
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <Separator />
        </>
      )}

      {/* What's Included */}
      <section className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Qué incluye</h3>
          </div>
          {included && included.length > 0 ? (
            <ul className="space-y-2">
              {included.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No especificado
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold">Qué NO incluye</h3>
          </div>
          {notIncluded && notIncluded.length > 0 ? (
            <ul className="space-y-2">
              {notIncluded.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Todo incluido
            </p>
          )}
        </div>
      </section>

      <Separator />

      {/* What to Bring & Provided Gear */}
      <section className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Backpack className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Qué debes traer</h3>
          </div>
          {whatToBring && whatToBring.length > 0 ? (
            <ul className="space-y-2">
              {whatToBring.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary text-lg leading-none">•</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No se requiere equipo especial
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Equipo proporcionado</h3>
          </div>
          {providedGear && providedGear.length > 0 ? (
            <ul className="space-y-2">
              {providedGear.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary text-lg leading-none">•</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sin equipo proporcionado
            </p>
          )}
        </div>
      </section>

      {/* Requirements */}
      {requirements && (
        <>
          <Separator />
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold">Requisitos y restricciones</h3>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  {requirements.ageMin && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Edad mínima</span>
                      <span className="text-sm">{requirements.ageMin} años</span>
                    </div>
                  )}
                  {requirements.physical && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Condición física
                      </span>
                      <Badge variant="outline">{requirements.physical}</Badge>
                    </div>
                  )}
                  {requirements.swimming && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Saber nadar
                      </span>
                      <span className="text-sm">
                        {requirements.swimming ? "Requerido" : "No requerido"}
                      </span>
                    </div>
                  )}
                  {requirements.technical && (
                    <div>
                      <span className="text-sm font-medium block mb-1">
                        Habilidades técnicas
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {requirements.technical}
                      </p>
                    </div>
                  )}
                  {requirements.restrictions && (
                    <div>
                      <span className="text-sm font-medium block mb-1">
                        Restricciones
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {requirements.restrictions}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
