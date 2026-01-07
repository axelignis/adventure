"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Users, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BookingWidgetProps {
  serviceId: string;
  priceBase: number;
  minParticipants: number;
  maxParticipants: number;
  availableDates?: Date[];
}

export function BookingWidget({
  serviceId,
  priceBase,
  minParticipants,
  maxParticipants,
  availableDates = [],
}: BookingWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [participants, setParticipants] = useState(minParticipants);

  const handleParticipantChange = (delta: number) => {
    const newValue = participants + delta;
    if (newValue >= minParticipants && newValue <= maxParticipants) {
      setParticipants(newValue);
    }
  };

  const totalPrice = priceBase * participants;

  const handleBooking = () => {
    if (!selectedDate) {
      alert("Por favor selecciona una fecha");
      return;
    }

    // TODO: Implement booking flow
    console.log("Booking:", {
      serviceId,
      date: selectedDate,
      participants,
      totalPrice,
    });
  };

  // Disable dates that are not available
  const disabledDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable past dates
    if (date < today) return true;

    // If we have specific available dates, only enable those
    if (availableDates.length > 0) {
      return !availableDates.some(
        (availableDate) =>
          availableDate.getFullYear() === date.getFullYear() &&
          availableDate.getMonth() === date.getMonth() &&
          availableDate.getDate() === date.getDate()
      );
    }

    // Otherwise, allow all future dates
    return false;
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            ${priceBase.toLocaleString("es-CL")}
          </span>
          <span className="text-muted-foreground">/ persona</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date Picker */}
        <div className="space-y-2">
          <Label>Fecha</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP", { locale: es })
                ) : (
                  <span>Selecciona una fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={disabledDates}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Participants */}
        <div className="space-y-2">
          <Label>Participantes</Label>
          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {participants} {participants === 1 ? "persona" : "personas"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleParticipantChange(-1)}
                disabled={participants <= minParticipants}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Disminuir participantes</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleParticipantChange(1)}
                disabled={participants >= maxParticipants}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Aumentar participantes</span>
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Mínimo: {minParticipants} · Máximo: {maxParticipants}
          </p>
        </div>

        {/* Price Breakdown */}
        {selectedDate && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                ${priceBase.toLocaleString("es-CL")} × {participants}{" "}
                {participants === 1 ? "persona" : "personas"}
              </span>
              <span>${totalPrice.toLocaleString("es-CL")}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${totalPrice.toLocaleString("es-CL")}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={handleBooking}
          disabled={!selectedDate}
        >
          Reservar ahora
        </Button>
      </CardFooter>

      <CardContent className="pt-0">
        <p className="text-xs text-center text-muted-foreground">
          No se realizará ningún cargo aún
        </p>
      </CardContent>
    </Card>
  );
}
