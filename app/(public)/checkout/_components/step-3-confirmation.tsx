"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Users,
  Mail,
  Phone,
  User,
  CreditCard,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ServiceAddOn {
  id: string;
  name: string;
  price: number;
}

interface ServiceData {
  title: string;
  coverImage: string | null;
  priceBase: number;
}

interface Step3Props {
  service: ServiceData;
  date: Date;
  participants: number;
  selectedAddOns: string[];
  allAddOns: ServiceAddOn[];
  totalAmount: number;
  userData: {
    email: string;
    phone: string;
    fullName: string;
    dietaryRestrictions?: string;
    specialConsiderations?: string;
  };
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  error?: string;
}

export function Step3Confirmation({
  service,
  date,
  participants,
  selectedAddOns,
  allAddOns,
  totalAmount,
  userData,
  onConfirm,
  onBack,
  isSubmitting,
  error,
}: Step3Props) {
  const selectedAddOnDetails = allAddOns.filter((addOn) =>
    selectedAddOns.includes(addOn.id)
  );

  const addOnsTotal = selectedAddOnDetails.reduce(
    (sum, addOn) => sum + addOn.price,
    0
  );

  const serviceTotal = service.priceBase * participants;

  return (
    <div className="space-y-6">
      {/* Service Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de tu Reserva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            {service.coverImage && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={service.coverImage}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{service.title}</h3>
              <div className="space-y-1 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(date, "PPP", { locale: es })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {participants} {participants === 1 ? "persona" : "personas"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {selectedAddOnDetails.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Servicios Adicionales:</h4>
                <ul className="space-y-1 text-sm">
                  {selectedAddOnDetails.map((addOn) => (
                    <li key={addOn.id} className="flex justify-between">
                      <span>{addOn.name}</span>
                      <span className="font-medium">
                        ${addOn.price.toLocaleString("es-CL")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{userData.fullName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{userData.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{userData.phone}</span>
          </div>

          {(userData.dietaryRestrictions || userData.specialConsiderations) && (
            <>
              <Separator />
              {userData.dietaryRestrictions && (
                <div>
                  <p className="font-medium mb-1">Restricciones Alimentarias:</p>
                  <p className="text-muted-foreground">
                    {userData.dietaryRestrictions}
                  </p>
                </div>
              )}
              {userData.specialConsiderations && (
                <div>
                  <p className="font-medium mb-1">Consideraciones Especiales:</p>
                  <p className="text-muted-foreground">
                    {userData.specialConsiderations}
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Desglose de Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>
              Servicio (${service.priceBase.toLocaleString("es-CL")} ×{" "}
              {participants})
            </span>
            <span>${serviceTotal.toLocaleString("es-CL")}</span>
          </div>
          {addOnsTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span>Servicios adicionales</span>
              <span>${addOnsTotal.toLocaleString("es-CL")}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total a Pagar</span>
            <span>${totalAmount.toLocaleString("es-CL")} CLP</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method (Placeholder) */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Método de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-6 text-center space-y-2">
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-16 h-10 bg-white rounded border flex items-center justify-center text-xs font-bold">
                Webpay
              </div>
              <div className="w-16 h-10 bg-white rounded border flex items-center justify-center text-xs font-bold">
                VISA
              </div>
              <div className="w-16 h-10 bg-white rounded border flex items-center justify-center text-xs font-bold">
                MC
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Serás redirigido a Webpay para completar el pago de forma segura
            </p>
            <p className="text-xs text-muted-foreground">
              (Integración de pago en desarrollo)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> Tu reserva quedará en estado "SOLICITADA"
          hasta que el guía la confirme (máximo 24 horas). Recibirás un email de
          confirmación una vez que sea aceptada.
        </AlertDescription>
      </Alert>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isSubmitting}
        >
          Volver
        </Button>
        <Button
          onClick={onConfirm}
          className="flex-1"
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            "Confirmar Reserva"
          )}
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Al confirmar, aceptas nuestros términos de servicio y política de
        privacidad
      </p>
    </div>
  );
}
