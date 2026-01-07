import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  Calendar,
  Users,
  Mail,
  Clock,
  ArrowRight,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getBookingDetails } from "../../actions";

interface SuccessPageProps {
  params: Promise<{
    bookingId: string;
  }>;
}

const DURATION_LABELS: Record<string, string> = {
  MEDIO_DIA: "Medio día",
  DIA_COMPLETO: "Día completo",
  MULTI_DIA: "Multi-día",
};

async function SuccessContent({ bookingId }: { bookingId: string }) {
  const result = await getBookingDetails(bookingId);

  if (!result.success || !result.data) {
    redirect("/explorar");
  }

  const booking = result.data;

  return (
    <div className="container max-w-3xl py-8 space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-green-900 mb-2">
              ¡Reserva Solicitada Exitosamente!
            </h1>
            <p className="text-green-700">
              Número de reserva:{" "}
              <span className="font-mono font-semibold">
                {booking.bookingNumber}
              </span>
            </p>
          </div>
          <Badge variant="secondary" className="text-base py-2 px-4">
            Estado: {booking.status === "REQUESTED" && "Esperando Confirmación"}
          </Badge>
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            ¿Qué sigue ahora?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                1
              </div>
              <div>
                <p className="font-medium">Confirmación del Guía</p>
                <p className="text-sm text-muted-foreground">
                  <strong>{booking.guide.user.name}</strong> revisará tu solicitud
                  y la confirmará en un máximo de 24 horas
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                2
              </div>
              <div>
                <p className="font-medium">Recibirás un Email</p>
                <p className="text-sm text-muted-foreground">
                  Te enviaremos un correo de confirmación con todos los detalles
                  de tu experiencia
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                3
              </div>
              <div>
                <p className="font-medium">Prepárate para la Aventura</p>
                <p className="text-sm text-muted-foreground">
                  El guía te contactará 48 horas antes para coordinar punto de
                  encuentro y últimos detalles
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Reserva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            {booking.service.coverImage && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={booking.service.coverImage}
                  alt={booking.service.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">
                {booking.service.title}
              </h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(booking.serviceDate), "PPP", { locale: es })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {booking.participants}{" "}
                    {booking.participants === 1 ? "persona" : "personas"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{DURATION_LABELS[booking.service.duration]}</span>
                </div>
              </div>
            </div>
          </div>

          {booking.addOns.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="font-medium mb-2">Servicios Adicionales:</p>
                <ul className="space-y-1 text-sm">
                  {booking.addOns.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.addOn.name}</span>
                      <span className="font-medium">
                        ${item.addOn.price.toLocaleString("es-CL")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {(booking.dietaryRestrictions || booking.specialConsiderations) && (
            <>
              <Separator />
              <div className="space-y-2 text-sm">
                {booking.dietaryRestrictions && (
                  <div>
                    <p className="font-medium">Restricciones Alimentarias:</p>
                    <p className="text-muted-foreground">
                      {booking.dietaryRestrictions}
                    </p>
                  </div>
                )}
                {booking.specialConsiderations && (
                  <div>
                    <p className="font-medium">Consideraciones Especiales:</p>
                    <p className="text-muted-foreground">
                      {booking.specialConsiderations}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          <Separator />

          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Total Pagado:</span>
            <span className="font-bold text-2xl">
              ${booking.totalAmount.toLocaleString("es-CL")} CLP
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Información de Contacto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            Se ha enviado una copia de esta reserva a tu email. Si tienes alguna
            pregunta, puedes contactar directamente al guía.
          </p>
          <div className="pt-2">
            <p className="font-medium">Tu Guía:</p>
            <p>{booking.guide.user.name}</p>
            <p className="text-muted-foreground">{booking.guide.user.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="outline" className="flex-1">
          <Link href="/dashboard/bookings">
            Ver Mis Reservas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href="/explorar">
            Explorar Más Experiencias
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Download Button (Placeholder) */}
      <div className="text-center pt-4">
        <Button variant="ghost" size="sm" disabled>
          <Download className="mr-2 h-4 w-4" />
          Descargar Comprobante (Próximamente)
        </Button>
      </div>
    </div>
  );
}

function SuccessSkeleton() {
  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export default async function CheckoutSuccessPage({ params }: SuccessPageProps) {
  const { bookingId } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<SuccessSkeleton />}>
          <SuccessContent bookingId={bookingId} />
        </Suspense>
      </main>
    </div>
  );
}
