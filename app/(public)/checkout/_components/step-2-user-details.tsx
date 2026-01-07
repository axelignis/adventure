"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { sendPhoneVerificationCode, verifyPhoneCode } from "../actions";

interface Step2Props {
  isAuthenticated: boolean;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  onNext: (data: {
    email: string;
    phone: string;
    fullName: string;
    dietaryRestrictions?: string;
    specialConsiderations?: string;
  }) => void;
  onBack: () => void;
}

export function Step2UserDetails({
  isAuthenticated,
  userEmail = "",
  userName = "",
  userPhone = "",
  onNext,
  onBack,
}: Step2Props) {
  const [formData, setFormData] = useState({
    email: userEmail,
    phone: userPhone,
    fullName: userName,
    dietaryRestrictions: "",
    specialConsiderations: "",
  });

  const [verificationCode, setVerificationCode] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>();

  const handleSendCode = async () => {
    if (!formData.phone || formData.phone.length < 9) {
      setError("Ingresa un número de teléfono válido");
      return;
    }

    setSendingCode(true);
    setError("");

    const result = await sendPhoneVerificationCode(formData.phone);

    if (result.success) {
      setCodeSent(true);
      setDevCode(result.devCode);
    } else {
      setError(result.error || "Error al enviar código");
    }

    setSendingCode(false);
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError("El código debe tener 6 dígitos");
      return;
    }

    setVerifyingCode(true);
    setError("");

    const result = await verifyPhoneCode({
      phone: formData.phone,
      code: verificationCode,
    });

    if (result.success) {
      setPhoneVerified(true);
      setError("");
    } else {
      setError(result.error || "Código inválido");
    }

    setVerifyingCode(false);
  };

  const handleNext = () => {
    // Validation
    if (!formData.email) {
      setError("El email es requerido");
      return;
    }

    if (!formData.phone) {
      setError("El teléfono es requerido");
      return;
    }

    if (!phoneVerified) {
      setError("Debes verificar tu número de teléfono");
      return;
    }

    if (!formData.fullName) {
      setError("El nombre completo es requerido");
      return;
    }

    setError("");
    onNext({
      email: formData.email,
      phone: formData.phone,
      fullName: formData.fullName,
      dietaryRestrictions: formData.dietaryRestrictions || undefined,
      specialConsiderations: formData.specialConsiderations || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isAuthenticated
              ? "Confirma tus Datos"
              : "Ingresa tus Datos de Contacto"}
          </CardTitle>
          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground">
              Crearemos una cuenta para ti automáticamente
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={isAuthenticated}
            />
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre Completo</Label>
            <Input
              id="fullName"
              placeholder="Juan Pérez"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          {/* Phone Verification */}
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <div className="flex gap-2">
              <Input
                id="phone"
                type="tel"
                placeholder="+56912345678"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={phoneVerified}
                className="flex-1"
              />
              {!phoneVerified && (
                <Button
                  variant="outline"
                  onClick={handleSendCode}
                  disabled={sendingCode || codeSent}
                >
                  {sendingCode ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : codeSent ? (
                    "Código Enviado"
                  ) : (
                    "Enviar Código"
                  )}
                </Button>
              )}
              {phoneVerified && (
                <div className="flex items-center gap-1 text-green-600 px-3">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Verificado</span>
                </div>
              )}
            </div>
          </div>

          {/* Verification Code Input */}
          {codeSent && !phoneVerified && (
            <div className="space-y-2">
              <Label htmlFor="code">Código de Verificación</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="flex-1"
                />
                <Button onClick={handleVerifyCode} disabled={verifyingCode}>
                  {verifyingCode ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Verificar"
                  )}
                </Button>
              </div>
              {devCode && (
                <Alert>
                  <AlertDescription className="text-sm">
                    <strong>Modo desarrollo:</strong> Usa el código{" "}
                    <code className="bg-muted px-2 py-1 rounded">{devCode}</code>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Adicional (Opcional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dietary">Restricciones Alimentarias</Label>
            <Input
              id="dietary"
              placeholder="Ej: Vegetariano, celíaco, alergias"
              value={formData.dietaryRestrictions}
              onChange={(e) =>
                setFormData({ ...formData, dietaryRestrictions: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="considerations">Consideraciones Especiales</Label>
            <Textarea
              id="considerations"
              placeholder="Condiciones médicas, nivel de experiencia, otras consideraciones que el guía deba saber"
              value={formData.specialConsiderations}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specialConsiderations: e.target.value,
                })
              }
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Volver
        </Button>
        <Button onClick={handleNext} className="flex-1" disabled={!phoneVerified}>
          Continuar a Confirmación
        </Button>
      </div>
    </div>
  );
}
