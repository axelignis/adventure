"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { calculateTotal } from "../actions";

interface ServiceAddOn {
  id: string;
  name: string;
  description: string | null;
  price: number;
  type: string;
}

interface ServiceData {
  id: string;
  title: string;
  coverImage: string | null;
  priceBase: number;
  duration: string;
  addOns: ServiceAddOn[];
}

interface Step1Props {
  service: ServiceData;
  date: Date;
  participants: number;
  onNext: (data: {
    selectedAddOns: string[];
    acceptedPolicies: boolean;
    totalAmount: number;
  }) => void;
}

const DURATION_LABELS: Record<string, string> = {
  MEDIO_DIA: "Medio día (2-4 horas)",
  DIA_COMPLETO: "Día completo (5-10 horas)",
  MULTI_DIA: "Multi-día",
};

const ADDON_CATEGORY_LABELS: Record<string, string> = {
  HOSPEDAJE: "Hospedaje",
  EMBARCACION: "Embarcación",
  PICKUP: "Transporte/Pickup",
  EQUIPO_PREMIUM: "Equipo Premium",
};

export function Step1Details({ service, date, participants, onNext }: Step1Props) {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [pricing, setPricing] = useState({
    serviceTotal: 0,
    addOnsTotal: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  // Calculate total whenever selection changes
  useEffect(() => {
    async function calculate() {
      const result = await calculateTotal({
        serviceId: service.id,
        participants,
        addOnIds: selectedAddOns,
      });

      if (result.success && result.data) {
        setPricing({
          serviceTotal: result.data.serviceTotal,
          addOnsTotal: result.data.addOnsTotal,
          total: result.data.total,
        });
      }
    }

    calculate();
  }, [service.id, participants, selectedAddOns]);

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const handleNext = () => {
    if (!acceptedPolicies) {
      alert("Debes aceptar las políticas de cancelación para continuar");
      return;
    }

    setLoading(true);
    onNext({
      selectedAddOns,
      acceptedPolicies,
      totalAmount: pricing.total,
    });
  };

  return (
    <div className="space-y-6">
      {/* Service Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de tu Experiencia</CardTitle>
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
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(date, "PPP", { locale: es })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>
                    {participants} {participants === 1 ? "persona" : "personas"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{DURATION_LABELS[service.duration]}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add-ons */}
      {service.addOns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Servicios Adicionales</CardTitle>
            <p className="text-sm text-muted-foreground">
              Mejora tu experiencia con estos servicios opcionales
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {service.addOns.map((addOn) => (
              <div
                key={addOn.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => toggleAddOn(addOn.id)}
              >
                <Checkbox
                  checked={selectedAddOns.includes(addOn.id)}
                  onCheckedChange={() => toggleAddOn(addOn.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{addOn.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {ADDON_CATEGORY_LABELS[addOn.type]}
                    </Badge>
                  </div>
                  {addOn.description && (
                    <p className="text-sm text-muted-foreground">
                      {addOn.description}
                    </p>
                  )}
                  <p className="text-sm font-semibold mt-1">
                    +${addOn.price.toLocaleString("es-CL")}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Cancellation Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Política de Cancelación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              • <strong>Cancelación gratuita</strong> hasta 48 horas antes de
              la experiencia
            </p>
            <p>
              • <strong>Reembolso del 50%</strong> si cancelas entre 24-48
              horas antes
            </p>
            <p>
              • <strong>Sin reembolso</strong> si cancelas con menos de 24
              horas de anticipación
            </p>
          </div>

          <div className="flex items-start gap-2 pt-4 border-t">
            <Checkbox
              id="accept-policies"
              checked={acceptedPolicies}
              onCheckedChange={(checked) => setAcceptedPolicies(checked as boolean)}
            />
            <label
              htmlFor="accept-policies"
              className="text-sm leading-tight cursor-pointer"
            >
              He leído y acepto las políticas de cancelación y los términos de
              servicio
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Price Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              ${service.priceBase.toLocaleString("es-CL")} × {participants}{" "}
              {participants === 1 ? "persona" : "personas"}
            </span>
            <span>${pricing.serviceTotal.toLocaleString("es-CL")}</span>
          </div>
          {pricing.addOnsTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span>Servicios adicionales</span>
              <span>${pricing.addOnsTotal.toLocaleString("es-CL")}</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${pricing.total.toLocaleString("es-CL")} CLP</span>
          </div>
        </CardContent>
      </Card>

      {/* Next Button */}
      <Button
        size="lg"
        className="w-full"
        onClick={handleNext}
        disabled={!acceptedPolicies || loading}
      >
        {loading ? "Cargando..." : "Continuar a Datos Personales"}
      </Button>
    </div>
  );
}
