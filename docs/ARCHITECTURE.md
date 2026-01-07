# 🏗️ Arquitectura del Sistema

## Visión General

Aventura Marketplace es una aplicación web full-stack construida con Next.js 14 que implementa un marketplace multi-categoría para experiencias de turismo aventura en Chile.

## Principios Arquitectónicos

### 1. **Server-First con Client Enhancement**
- Maximizar uso de Server Components (RSC)
- Client Components solo cuando sea necesario (interactividad, hooks)
- ISR (Incremental Static Regeneration) para catálogo
- SSR para flujos de reserva

### 2. **Progressive Enhancement**
- Funcionalidad básica sin JavaScript
- Mejoras progresivas con JS habilitado
- SEO-first approach

### 3. **Type Safety End-to-End**
- TypeScript en todo el stack
- Prisma como ORM type-safe
- Zod para validaciones runtime

### 4. **Performance Budget**
- LCP ≤ 2.5s
- FID ≤ 100ms
- CLS ≤ 0.1
- Lighthouse Score ≥ 90

## Stack Detallado

### Frontend Layer

```
┌─────────────────────────────────────┐
│         Next.js 14 App Router       │
├─────────────────────────────────────┤
│  Server Components (default)        │
│  - Home, Catálogo, Detalle          │
│  - Layout components                │
├─────────────────────────────────────┤
│  Client Components ("use client")   │
│  - Forms, Modals, Interactive UI    │
│  - Map components (Mapbox)          │
│  - Image upload                     │
└─────────────────────────────────────┘
```

**Librerías UI:**
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Composable components
- **Radix UI** - Accessible primitives
- **Framer Motion** - Animations (subtle)
- **Lucide React** - Icons

### Data Layer

```
┌─────────────────────────────────────┐
│         PostgreSQL (Neon)           │
├─────────────────────────────────────┤
│  Extensions:                        │
│  - unaccent (search)                │
│  - pg_trgm (fuzzy matching)         │
│  - tsvector (full-text search)      │
└─────────────────────────────────────┘
           ↕
┌─────────────────────────────────────┐
│           Prisma ORM                │
├─────────────────────────────────────┤
│  - Type-safe queries                │
│  - Migrations                       │
│  - Seeding                          │
└─────────────────────────────────────┘
           ↕
┌─────────────────────────────────────┐
│       Application Logic             │
│  (Server Actions & API Routes)      │
└─────────────────────────────────────┘
```

### Authentication Flow

```
User Request
    ↓
NextAuth v5 Middleware
    ↓
┌─────────────┬─────────────┐
│   Public    │  Protected  │
│   Routes    │   Routes    │
└─────────────┴─────────────┘
    ↓              ↓
  Render      Check Session
               ↓
           Authorize → Render
```

**Providers (Fase 1):**
- Email Magic Links (passwordless)
- Google OAuth
- Phone verification (checkout)

### File Upload Pipeline

```
Client Upload
    ↓
Next.js API Route
    ↓
Validation (size, type, EXIF)
    ↓
Sharp Processing
    ↓
    ├─ Resize (max 2000px)
    ├─ EXIF Strip
    ├─ Generate Thumbnails
    │   - thumb (400w)
    │   - card (800w)
    │   - hero (1600w)
    └─ Hash (deduplication)
    ↓
Cloudinary Upload
    ↓
Save URL to Database
```

### Search Architecture (MVP)

```
User Query
    ↓
┌──────────────────────────────┐
│   PostgreSQL Full-Text       │
│   Search (FTS)               │
├──────────────────────────────┤
│  1. websearch_to_tsquery     │
│  2. unaccent normalization   │
│  3. Trigram matching         │
│  4. Haversine distance       │
│  5. Rating boost             │
└──────────────────────────────┘
    ↓
Ranked Results
    ↓
┌──────────────────────────────┐
│   Filters Applied            │
│   (Category, Region, Price)  │
└──────────────────────────────┘
    ↓
Paginated Response
```

**Migración futura (Fase 3):**
- Meilisearch para typo-tolerance
- Sinónimos (ES/EN)
- Faceted search nativo

### Booking Flow (Fase 1 MVP)

```
1. User selects service + date
    ↓
2. Checkout Form
   - Guest allowed
   - Phone verification
    ↓
3. Payment (Webpay)
   - Oneclick (preferred)
   - Webpay Plus (fallback)
    ↓
4. Create Booking
   Status: REQUESTED
    ↓
5. Notify Guide
   (Email + Push)
    ↓
6. Guide Confirms (24h SLA)
   Status: CONFIRMED
    ↓
7. Payment Capture (T-48h)
   Status: PAYMENT_CAPTURED
    ↓
8. Service Day
   Status: SCHEDULED
    ↓
9. Complete
   Status: COMPLETED
    ↓
10. Review Window Opens
    (T+4h → T+30d)
```

### Notification System

```
┌──────────────────────────────┐
│    Notification Event        │
│  (booking_confirmed, etc)    │
└──────────────────────────────┘
         ↓
┌──────────────────────────────┐
│   Channel Decision Logic     │
│  - User preferences          │
│  - Event priority            │
│  - Quiet hours (22-07h)      │
└──────────────────────────────┘
         ↓
    ┌────┴────┬────────┬─────────┐
    ↓         ↓        ↓         ↓
  Email    Push Web  WhatsApp  In-App
    │         │        │         │
    └─────────┴────────┴─────────┘
              ↓
         Audit Log
```

**Canales por Evento (Fase 1):**
- Email: Confirmaciones, recibos, reviews
- Push Web: Mensajes, cambios urgentes
- WhatsApp/SMS: Verificación teléfono (solo)
- In-App: Todo (histórico)

## Patterns & Best Practices

### 1. **Server Actions over API Routes**

Preferir Server Actions para mutations:

```typescript
// ✅ Good: Server Action
"use server";
export async function createBooking(data: BookingInput) {
  const session = await auth();
  // ...
}

// ❌ Avoid: API Route para operaciones simples
// app/api/bookings/route.ts
```

### 2. **Colocation of Components**

```
app/
  (public)/
    explorar/
      page.tsx
      _components/
        search-filters.tsx
        service-card.tsx
        map-view.tsx
```

### 3. **Type Safety con Zod**

```typescript
// lib/validations/booking.ts
export const bookingSchema = z.object({
  serviceId: z.string().cuid(),
  date: z.date(),
  participants: z.number().min(1),
  // ...
});

export type BookingInput = z.infer<typeof bookingSchema>;
```

### 4. **Error Handling**

```typescript
try {
  const booking = await prisma.booking.create({ ... });
  return { success: true, data: booking };
} catch (error) {
  console.error("Booking creation failed:", error);
  return { 
    success: false, 
    error: "No pudimos crear tu reserva. Intenta de nuevo." 
  };
}
```

### 5. **Loading States & Suspense**

```tsx
<Suspense fallback={<ServiceCardSkeleton />}>
  <ServiceList />
</Suspense>
```

## Security Considerations

### 1. **Input Validation**
- Zod schemas para todas las entradas
- Sanitización de strings (anti-XSS)
- Rate limiting en API routes

### 2. **Authentication**
- NextAuth session management
- CSRF protection (built-in)
- Secure cookies (httpOnly, sameSite)

### 3. **Authorization**
- Middleware checks antes de rutas protegidas
- Server-side verification en Server Actions
- Role-based access control (RBAC)

### 4. **Data Privacy**
- EXIF removal de todas las imágenes
- Hash de datos sensibles (teléfono, RUT)
- PII encryption en database

### 5. **Payment Security**
- Transbank tokenization (Oneclick)
- No almacenar tarjetas localmente
- PCI-DSS compliance via Webpay

## Performance Optimizations

### 1. **Images**
```tsx
<Image
  src={service.coverImage}
  alt={service.title}
  width={1600}
  height={900}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  placeholder="blur"
  blurDataURL={service.blurHash}
/>
```

### 2. **Database Queries**
- Índices en columnas frecuentemente filtradas
- `select` específico (no `SELECT *`)
- Paginación con `cursor` para grandes datasets
- Denormalización estratégica (rating, reviewCount)

### 3. **Caching**
```typescript
export const revalidate = 3600; // ISR: 1 hora

export async function getServices() {
  return unstable_cache(
    async () => await prisma.service.findMany(),
    ['services-list'],
    { revalidate: 3600, tags: ['services'] }
  )();
}
```

### 4. **Bundle Size**
- Tree-shaking automático (Next.js)
- Dynamic imports para features pesados
- Lazy loading de componentes no críticos

## Monitoring & Observability

### Fase 1 (MVP)
- **Vercel Analytics** - Web Vitals
- **Sentry** - Error tracking
- **GA4** - User behavior
- **Prisma Logging** - Query performance

### Fase 2+
- **Uptime monitoring** (BetterStack/Pingdom)
- **APM** (Application Performance Monitoring)
- **Custom dashboards** para métricas de negocio

## Deployment

### Vercel (Recomendado)
```bash
# Auto-deploy en push a main
git push origin main

# Preview deployments en PRs
# Automático por cada PR
```

**Configuración:**
- Next.js optimization automático
- Edge Functions para geolocalización
- Image optimization built-in
- Analytics integrado

### Alternatives
- AWS Amplify
- Railway
- Fly.io
- Self-hosted (Docker + Nginx)

## Testing Strategy

### Fase 1 (Básico)
- TypeScript type checking
- ESLint para calidad de código
- Manual E2E testing (crítico paths)

### Fase 2+ (Robusto)
- **Unit tests:** Vitest + Testing Library
- **Integration tests:** Playwright
- **E2E tests:** Playwright (críticos flows)
- **Visual regression:** Percy/Chromatic

## Scalability Considerations

### Current (MVP) → 1,000 usuarios
- Single Neon database
- Vercel Hobby tier OK
- Cloudinary free tier

### Growth (1K-10K usuarios)
- Upgrade Neon to Pro
- Vercel Pro
- Upstash Redis (caching, rate-limit)
- Read replicas para queries pesados

### Scale (10K+ usuarios)
- Database sharding por región
- CDN global (Cloudflare)
- Microservices para pagos/notificaciones
- Búsqueda con Meilisearch/Algolia

---

**Última actualización:** Fase 0 completada - Enero 2026
