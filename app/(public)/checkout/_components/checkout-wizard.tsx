"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { Step1Details } from "./step-1-details";
import { Step2UserDetails } from "./step-2-user-details";
import { Step3Confirmation } from "./step-3-confirmation";
import { createBooking } from "../actions";

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
  slug: string;
  coverImage: string | null;
  priceBase: number;
  minParticipants: number;
  maxParticipants: number;
  duration: string;
  addOns: ServiceAddOn[];
}

interface CheckoutWizardProps {
  service: ServiceData;
  date: Date;
  participants: number;
  isAuthenticated: boolean;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  userId?: string;
}

interface Step1Data {
  selectedAddOns: string[];
  acceptedPolicies: boolean;
  totalAmount: number;
}

interface Step2Data {
  email: string;
  phone: string;
  fullName: string;
  dietaryRestrictions?: string;
  specialConsiderations?: string;
}

const STEPS = [
  { number: 1, title: "Detalles" },
  { number: 2, title: "Datos Personales" },
  { number: 3, title: "Confirmación" },
];

export function CheckoutWizard({
  service,
  date,
  participants,
  isAuthenticated,
  userEmail,
  userName,
  userPhone,
  userId,
}: CheckoutWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleStep1Complete = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: Step2Data) => {
    setStep2Data(data);
    setCurrentStep(3);
  };

  const handleConfirm = async () => {
    if (!step1Data || !step2Data) {
      setError("Datos incompletos");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await createBooking({
        serviceId: service.id,
        serviceDate: date,
        participants,
        addOnIds: step1Data.selectedAddOns,
        userId: isAuthenticated ? userId : undefined,
        guestEmail: !isAuthenticated ? step2Data.email : undefined,
        guestPhone: !isAuthenticated ? step2Data.phone : undefined,
        guestName: !isAuthenticated ? step2Data.fullName : undefined,
        dietaryRestrictions: step2Data.dietaryRestrictions,
        specialConsiderations: step2Data.specialConsiderations,
        totalAmount: step1Data.totalAmount,
        acceptedPolicies: step1Data.acceptedPolicies,
      });

      if (result.success && result.data) {
        // Redirect to success page
        router.push(`/checkout/success/${result.data.bookingId}`);
      } else {
        setError(result.error || "Error al crear la reserva");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Ocurrió un error inesperado. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Stepper */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step.number < currentStep
                      ? "bg-green-500 text-white"
                      : step.number === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.number < currentStep ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    step.number
                  )}
                </div>
                <p
                  className={`mt-2 text-sm font-medium ${
                    step.number <= currentStep
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors ${
                    step.number < currentStep ? "bg-green-500" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Mobile Step Indicator */}
      <div className="md:hidden">
        <Badge variant="secondary" className="w-full justify-center py-2">
          Paso {currentStep} de {STEPS.length}
        </Badge>
      </div>

      {/* Step Content */}
      <div>
        {currentStep === 1 && (
          <Step1Details
            service={service}
            date={date}
            participants={participants}
            onNext={handleStep1Complete}
          />
        )}

        {currentStep === 2 && step1Data && (
          <Step2UserDetails
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
            userName={userName}
            userPhone={userPhone}
            onNext={handleStep2Complete}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && step1Data && step2Data && (
          <Step3Confirmation
            service={service}
            date={date}
            participants={participants}
            selectedAddOns={step1Data.selectedAddOns}
            allAddOns={service.addOns}
            totalAmount={step1Data.totalAmount}
            userData={step2Data}
            onConfirm={handleConfirm}
            onBack={() => setCurrentStep(2)}
            isSubmitting={isSubmitting}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
