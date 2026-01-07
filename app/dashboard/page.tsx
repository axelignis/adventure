import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Heart, MessageSquare, User } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              ¡Bienvenido, {session.user.name || "Aventurero"}!
            </h1>
            <p className="text-muted-foreground">
              Este es tu panel de control donde puedes gestionar tus reservas y preferencias.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximas reservas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  No tienes reservas programadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Experiencias guardadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mensajes</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Sin mensajes nuevos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Perfil</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{session.user.role}</div>
                <p className="text-xs text-muted-foreground">
                  Tipo de cuenta
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información de la cuenta</CardTitle>
              <CardDescription>Detalles de tu perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{session.user.email}</p>
              </div>
              <div className="grid gap-1">
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">{session.user.name || "No especificado"}</p>
              </div>
              <div className="grid gap-1">
                <p className="text-sm text-muted-foreground">Rol</p>
                <p className="font-medium">{session.user.role}</p>
              </div>
              <div className="grid gap-1">
                <p className="text-sm text-muted-foreground">Estado</p>
                <p className="font-medium">{session.user.status}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
