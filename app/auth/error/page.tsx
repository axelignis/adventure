import Link from "next/link";
import { Mountain, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Error de configuración",
    description: "Hay un problema con la configuración del servidor. Por favor contacta al soporte.",
  },
  AccessDenied: {
    title: "Acceso denegado",
    description: "No tienes permiso para acceder a esta página.",
  },
  Verification: {
    title: "Error de verificación",
    description: "El enlace de verificación ha expirado o ya fue usado. Por favor solicita uno nuevo.",
  },
  OAuthSignin: {
    title: "Error al iniciar sesión",
    description: "Hubo un problema al conectar con el proveedor de autenticación.",
  },
  OAuthCallback: {
    title: "Error de autenticación",
    description: "No se pudo completar la autenticación. Por favor intenta de nuevo.",
  },
  OAuthCreateAccount: {
    title: "Error al crear cuenta",
    description: "No se pudo crear tu cuenta. Por favor intenta de nuevo.",
  },
  EmailCreateAccount: {
    title: "Error al crear cuenta",
    description: "No se pudo crear tu cuenta con este email. Por favor intenta de nuevo.",
  },
  Callback: {
    title: "Error de callback",
    description: "Hubo un error al procesar tu solicitud.",
  },
  OAuthAccountNotLinked: {
    title: "Cuenta ya registrada",
    description: "Este email ya está registrado con otro método de inicio de sesión. Por favor usa el método original.",
  },
  EmailSignin: {
    title: "Error al enviar email",
    description: "No se pudo enviar el email de verificación. Por favor intenta de nuevo.",
  },
  CredentialsSignin: {
    title: "Error de credenciales",
    description: "Las credenciales proporcionadas son incorrectas.",
  },
  SessionRequired: {
    title: "Sesión requerida",
    description: "Debes iniciar sesión para acceder a esta página.",
  },
  AccountSuspended: {
    title: "Cuenta suspendida",
    description: "Tu cuenta ha sido suspendida. Por favor contacta al soporte para más información.",
  },
  AccountDeleted: {
    title: "Cuenta eliminada",
    description: "Esta cuenta ha sido eliminada y ya no puede ser usada.",
  },
  Default: {
    title: "Error de autenticación",
    description: "Ocurrió un error inesperado. Por favor intenta de nuevo.",
  },
};

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error || "Default";
  const errorInfo = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle>{errorInfo.title}</CardTitle>
          <CardDescription>{errorInfo.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error === "OAuthAccountNotLinked" && (
            <div className="p-3 rounded-md bg-muted text-sm">
              <p>
                <strong>Consejo:</strong> Si ya tienes una cuenta, intenta iniciar sesión con
                el método que usaste originalmente (email o Google).
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Button className="w-full" asChild>
              <Link href="/auth/login">Volver a intentar</Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/">
                <Mountain className="mr-2 h-4 w-4" />
                Volver al inicio
              </Link>
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Si el problema persiste, por favor{" "}
            <Link href="/contacto" className="text-primary hover:underline">
              contacta a soporte
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
