# 🏔️ Aventura Marketplace

Plataforma de marketplace para experiencias de turismo aventura en Chile.

## 📋 Fase 0 - Setup Inicial (Completado)

Este proyecto está configurado con:

- ✅ **Next.js 14** con App Router y TypeScript
- ✅ **Tailwind CSS** + **shadcn/ui** para UI components
- ✅ **Prisma ORM** con schema completo para MVP
- ✅ **PostgreSQL** (configurado para Neon)
- ✅ **NextAuth** v5 (estructura lista)
- ✅ Estructura de carpetas organizada
- ✅ Seeds de base de datos (Regiones/Comunas de Chile + datos demo)

## 🚀 Getting Started

### 1. Instalar dependencias

```bash
npm install
# o
pnpm install
# o
yarn install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura tus variables:

```bash
cp .env.example .env
```

**Configuración mínima para desarrollo local:**

```env
# Database (Neon PostgreSQL - Free tier)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-uno-con: openssl rand -base64 32"

# Cloudinary (para imágenes)
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
```

### 3. Setup de Base de Datos

#### Opción A: Neon (Recomendado para desarrollo)

1. Crea cuenta gratuita en [Neon](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia el connection string a `DATABASE_URL`

#### Opción B: PostgreSQL Local

```bash
# Instala PostgreSQL localmente
# Ubuntu/Debian:
sudo apt-get install postgresql

# macOS (con Homebrew):
brew install postgresql@15

# Crea base de datos
createdb aventura_marketplace
```

### 4. Ejecutar migraciones y seeds

```bash
# Genera el cliente de Prisma
npm run db:generate

# Aplica el schema a la BD (dev)
npm run db:push

# Seed con datos iniciales (regiones, comunas, servicios demo)
npm run db:seed

# Ver tu base de datos en el navegador
npm run db:studio
```

### 5. Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
aventura-marketplace/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rutas de autenticación
│   ├── (public)/                 # Rutas públicas (home, explorar)
│   ├── (protected)/              # Rutas protegidas (dashboard, checkout)
│   ├── api/                      # API routes
│   ├── globals.css               # Estilos globales + CSS variables
│   ├── layout.tsx                # Layout raíz
│   └── page.tsx                  # Home page
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Header, Footer, Nav
│   ├── features/                 # Feature-specific components
│   └── providers/                # Context providers
│
├── lib/
│   ├── db.ts                     # Prisma client singleton
│   ├── auth.ts                   # NextAuth configuration (TODO)
│   ├── utils.ts                  # Utility functions
│   └── validations/              # Zod schemas
│
├── prisma/
│   ├── schema.prisma             # Database schema (Fase 1 completo)
│   └── seed.ts                   # Seed data
│
├── public/                       # Static assets
│
└── types/                        # TypeScript type definitions
```

## 🎯 Roadmap

### ✅ Fase 0 - Base Técnica (COMPLETADO)

- [x] Next.js 14 + TypeScript + Tailwind setup
- [x] PostgreSQL + Prisma schema completo
- [x] Seeds de regiones/comunas de Chile
- [x] Estructura de carpetas
- [x] Home page básica

### 🚧 Fase 1 - MVP Crítico (EN PROGRESO)

**Features prioritarios:**

1. **Catálogo público** (`/explorar`)
   - [ ] Búsqueda full-text (PostgreSQL FTS)
   - [ ] Filtros multi-categoría
   - [ ] Vista lista + mapa
   - [ ] Orden por relevancia/distancia/rating

2. **Detalle de experiencia** (`/experiencias/[slug]`)
   - [ ] Galería full-screen
   - [ ] Información completa
   - [ ] Calendario de disponibilidad
   - [ ] Add-ons seleccionables
   - [ ] Reviews con fotos

3. **Checkout**
   - [ ] Wizard móvil / Single-page desktop
   - [ ] Guest flow + verificación de teléfono
   - [ ] Integración Webpay (Oneclick + Plus)

4. **Panel Cliente**
   - [ ] Próximas reservas
   - [ ] Historial
   - [ ] Cancelaciones
   - [ ] Reviews

5. **Reviews**
   - [ ] Sistema de calificación (1-5 ⭐)
   - [ ] Subida de 1-3 fotos
   - [ ] Moderación anti-contacto
   - [ ] Respuesta del guía

### 📅 Fase 2 - Operación Real (Q2 2026)

- [ ] Dashboard del guía
- [ ] Confirmación de reservas (SLA 24h)
- [ ] Captura de pago T-48h (Vercel Cron)
- [ ] Sistema de notificaciones omnicanal
- [ ] Chat post-pago
- [ ] Panel de administración

### 🚀 Fase 3 - Crecimiento (Q3+ 2026)

- [ ] Payouts reales
- [ ] Cupones y referidos
- [ ] Búsqueda avanzada (Meilisearch/Algolia)
- [ ] Programa de fidelidad
- [ ] Integraciones (WhatsApp, CRM, DTE)

## 🛠️ Stack Tecnológico

### Core
- **Frontend:** Next.js 14, React 19, TypeScript
- **Styling:** Tailwind CSS + shadcn/ui + Radix UI
- **Database:** PostgreSQL (Neon) + Prisma ORM
- **Auth:** NextAuth v5

### Servicios Externos (MVP)
- **Imágenes:** Cloudinary
- **Emails:** Resend
- **Pagos:** Transbank Webpay
- **Maps:** Mapbox GL JS
- **Hosting:** Vercel

### Dev Tools
- **Linting:** ESLint
- **Formatting:** Prettier
- **Type Checking:** TypeScript
- **Package Manager:** npm/pnpm/yarn

## 📊 Base de Datos

### Modelos Principales (Fase 1)

- `User` - Usuarios (clientes, guías, admins)
- `Service` - Experiencias/servicios
- `Booking` - Reservas
- `Review` - Reseñas y calificaciones
- `Region` / `Comuna` - Geografía de Chile
- `Notification` - Notificaciones
- `AuditLog` - Auditoría de acciones

**Ver schema completo:** `prisma/schema.prisma`

## 🔐 Autenticación

NextAuth v5 configurado para:

- 📧 Email magic links
- 🔵 Google OAuth
- 🍎 Apple Sign In (opcional)

## 🎨 Design System

Usando shadcn/ui con:

- **Colores:** Tema aventura (verde primario)
- **Tipografía:** Inter
- **Componentes:** Radix UI primitives
- **Accesibilidad:** WCAG AA compliant

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo (Turbopack)
npm run build            # Build de producción
npm run start            # Inicia servidor de producción
npm run lint             # Ejecuta ESLint
npm run format           # Formatea código con Prettier
npm run type-check       # Verifica tipos de TypeScript

# Base de datos
npm run db:generate      # Genera Prisma Client
npm run db:push          # Aplica cambios del schema a BD (dev)
npm run db:studio        # Abre Prisma Studio (UI visual de BD)
npm run db:seed          # Ejecuta seed de datos
```

## 🤝 Contribuir

Este es un proyecto en desarrollo activo. Para contribuir:

1. Revisa el roadmap arriba
2. Toma una tarea de Fase 1
3. Crea una rama: `git checkout -b feature/nombre-feature`
4. Desarrolla siguiendo las convenciones del proyecto
5. Commit: `git commit -m "feat: descripción del cambio"`
6. Push y abre un PR

### Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Bug fix
- `docs:` Documentación
- `style:` Formateo, puntos y comas, etc.
- `refactor:` Refactorización de código
- `test:` Tests
- `chore:` Mantenimiento

## 📞 Soporte

- 📧 Email: [email protected]
- 📚 Docs: (próximamente)
- 🐛 Issues: GitHub Issues

## 📄 License

Propietario - Aventura Marketplace © 2026

---

**Desarrollado con ❤️ para conectar aventureros con experiencias únicas en Chile 🇨🇱**
