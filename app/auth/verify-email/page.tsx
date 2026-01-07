import Link from "next/link";
import { Mountain, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle>Revisa tu correo</CardTitle>
          <CardDescription>
            Te hemos enviado un enlace mágico para iniciar sesión
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Hemos enviado un enlace de inicio de sesión a tu email. Haz clic en el enlace
              para acceder a tu cuenta.
            </p>

            <div className="space-y-2">
              <p className="font-medium text-foreground">¿No recibiste el correo?</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Revisa tu carpeta de spam o correo no deseado</li>
                <li>Verifica que escribiste correctamente tu email</li>
                <li>Espera unos minutos, puede tardar en llegar</li>
              </ul>
            </div>

            <p className="text-xs">
              El enlace expira en <strong>24 horas</strong> por seguridad.
            </p>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/auth/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio de sesión
              </Link>
            </Button>

            <Button variant="ghost" className="w-full" asChild>
              <Link href="/">
                <Mountain className="mr-2 h-4 w-4" />
                Volver al inicio
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
