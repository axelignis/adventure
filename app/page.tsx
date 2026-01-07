import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import {
  Mountain,
  Waves,
  Fish,
  Compass,
  Users,
  Shield
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative py-20 md:py-32 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Vive la aventura que
              <span className="text-primary"> siempre soñaste</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Descubre experiencias únicas de turismo aventura en Chile.
              Conecta con guías certificados y explora la naturaleza.
            </p>
            
            {/* Simple search */}
            <div className="max-w-3xl mx-auto bg-card border rounded-lg p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-left">
                    ¿Qué actividad?
                  </label>
                  <select className="w-full px-4 py-2 border rounded-md">
                    <option>Todas las categorías</option>
                    <option>Kayak</option>
                    <option>Rafting</option>
                    <option>Trekking</option>
                    <option>Pesca</option>
                    <option>Montañismo</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-left">
                    ¿Dónde?
                  </label>
                  <select className="w-full px-4 py-2 border rounded-md">
                    <option>Todas las regiones</option>
                    <option>Región de Los Lagos</option>
                    <option>Región de Aysén</option>
                    <option>Región de Magallanes</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/explorar">Buscar experiencias</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["Cerca de mí", "Principiante", "Familiar", "Aventura", "Full-Day"].map((chip) => (
                <button
                  key={chip}
                  className="px-4 py-2 rounded-full border hover:bg-accent transition-colors text-sm"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Explora por categoría
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "Kayak", icon: Waves, count: 45 },
                { name: "Rafting", icon: Waves, count: 32 },
                { name: "Trekking", icon: Mountain, count: 67 },
                { name: "Pesca", icon: Fish, count: 28 },
                { name: "Montañismo", icon: Mountain, count: 41 },
                { name: "Otros", icon: Compass, count: 19 },
              ].map((category) => (
                <Link
                  key={category.name}
                  href={`/explorar?cat=${category.name.toLowerCase()}`}
                  className="group p-6 bg-card border rounded-lg hover:shadow-lg transition-all"
                >
                  <category.icon className="h-8 w-8 mb-3 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count} experiencias
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Cómo funciona
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Elige tu experiencia",
                  description: "Explora cientos de actividades y encuentra la perfecta para ti",
                },
                {
                  step: "2",
                  title: "Reserva con confianza",
                  description: "Pago seguro con Webpay y confirmación del guía",
                },
                {
                  step: "3",
                  title: "Vive la aventura",
                  description: "Disfruta una experiencia inolvidable con guías certificados",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
              <div>
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Pagos seguros</h3>
                <p className="text-sm text-muted-foreground">
                  Transbank Webpay certificado
                </p>
              </div>
              <div>
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Guías verificados</h3>
                <p className="text-sm text-muted-foreground">
                  Todos nuestros guías están certificados
                </p>
              </div>
              <div>
                <Mountain className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Miles de experiencias</h3>
                <p className="text-sm text-muted-foreground">
                  En todo Chile, desde Arica a Punta Arenas
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/50">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mountain className="h-5 w-5 text-primary" />
                <span className="font-bold">Aventura Marketplace</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Conectando aventureros con experiencias únicas en Chile.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Categorías</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/explorar?cat=kayak">Kayak</Link></li>
                <li><Link href="/explorar?cat=rafting">Rafting</Link></li>
                <li><Link href="/explorar?cat=trekking">Trekking</Link></li>
                <li><Link href="/explorar?cat=pesca">Pesca</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Ayuda</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/ayuda">Centro de ayuda</Link></li>
                <li><Link href="/cancelaciones">Cancelaciones</Link></li>
                <li><Link href="/seguridad">Seguridad</Link></li>
                <li><Link href="/contacto">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/terminos">Términos de uso</Link></li>
                <li><Link href="/privacidad">Privacidad</Link></li>
                <li><Link href="/cookies">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2026 Aventura Marketplace. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
