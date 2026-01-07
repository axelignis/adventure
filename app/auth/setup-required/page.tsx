import Link from "next/link";
import { Mountain, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SetupRequiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          <CardTitle>Configuración de Autenticación Requerida</CardTitle>
          <CardDescription>
            La autenticación aún no está configurada en este proyecto
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para habilitar la autenticación, necesitas configurar al menos uno de los siguientes
              métodos en tu archivo <code className="px-1.5 py-0.5 rounded bg-muted">.env.local</code>:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  📧 Email Magic Links (Recomendado)
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Permite a los usuarios iniciar sesión sin contraseña usando enlaces mágicos enviados por email.
                </p>
                <div className="bg-muted p-3 rounded font-mono text-xs overflow-x-auto">
                  <div>RESEND_API_KEY="re_xxxxx"</div>
                  <div>RESEND_FROM_EMAIL="noreply@tudominio.com"</div>
                </div>
                <Button variant="link" className="h-auto p-0 mt-2" asChild>
                  <a href="https://resend.com" target="_blank" rel="noopener noreferrer">
                    Crear cuenta en Resend <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>

              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  🔐 Google OAuth
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Permite a los usuarios iniciar sesión con su cuenta de Google.
                </p>
                <div className="bg-muted p-3 rounded font-mono text-xs overflow-x-auto">
                  <div>GOOGLE_CLIENT_ID="tu-client-id"</div>
                  <div>GOOGLE_CLIENT_SECRET="tu-client-secret"</div>
                </div>
                <Button variant="link" className="h-auto p-0 mt-2" asChild>
                  <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">
                    Configurar en Google Cloud Console <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
              📚 Guía de Configuración
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              Para instrucciones detalladas de configuración, consulta la documentación:
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/docs/AUTH_SETUP.md" target="_blank">
                Ver Guía Completa
              </Link>
            </Button>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">
                <Mountain className="mr-2 h-4 w-4" />
                Volver al inicio
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-center text-muted-foreground">
              Después de configurar las variables de entorno, reinicia el servidor de desarrollo:
              <br />
              <code className="px-1.5 py-0.5 rounded bg-muted">npm run dev</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
