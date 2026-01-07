# 🎯 Implementación de /experiencias/[slug] - Página de Detalle

## ✅ Completado

Implementación completa de la página de detalle de experiencias con todos los componentes necesarios para mostrar información detallada, permitir reservas, ver reseñas y descubrir experiencias relacionadas.

---

## 📁 Archivos Creados

### Server Actions
- **[app/(public)/experiencias/[slug]/actions.ts](../app/(public)/experiencias/[slug]/actions.ts)**
  - `getServiceBySlug()` - Obtiene servicio completo con todas las relaciones
  - `getServiceReviews()` - Paginación de reseñas con imágenes
  - `getRatingBreakdown()` - Desglose de ratings (1-5 estrellas)
  - `getRelatedServices()` - Servicios relacionados por categoría/región
  - `getServiceAvailability()` - Fechas disponibles (próximos 90 días)
  - `incrementViewCount()` - Analytics de visualizaciones

### Componentes
- **[app/(public)/experiencias/[slug]/_components/image-gallery.tsx](../app/(public)/experiencias/[slug]/_components/image-gallery.tsx)**
  - Grid responsivo de imágenes (1 principal + 4 thumbnails)
  - Lightbox modal con navegación (anterior/siguiente)
  - Navegación por teclado (←, →, Esc)
  - Contador de imágenes y captions
  - Indicador de "+X fotos" en última thumbnail

- **[app/(public)/experiencias/[slug]/_components/service-details.tsx](../app/(public)/experiencias/[slug]/_components/service-details.tsx)**
  - Descripción completa de la experiencia
  - Quick facts (duración, dificultad, capacidad)
  - Itinerario detallado con timeline
  - Qué incluye / No incluye
  - Qué traer / Equipo proporcionado
  - Requisitos y restricciones

- **[app/(public)/experiencias/[slug]/_components/booking-widget.tsx](../app/(public)/experiencias/[slug]/_components/booking-widget.tsx)**
  - Date picker con calendario (react-day-picker)
  - Selector de participantes (min/max)
  - Cálculo dinámico de precio total
  - Sticky sidebar en desktop
  - Validación de fechas disponibles
  - CTA "Reservar ahora"

- **[app/(public)/experiencias/[slug]/_components/guide-profile.tsx](../app/(public)/experiencias/[slug]/_components/guide-profile.tsx)**
  - Avatar y verificación del guía
  - Stats: rating, experiencias realizadas, miembro desde
  - Años de experiencia, idiomas, tiempo de respuesta
  - Bio del guía
  - Botón para contactar
  - Link a perfil completo

- **[app/(public)/experiencias/[slug]/_components/reviews-section.tsx](../app/(public)/experiencias/[slug]/_components/reviews-section.tsx)**
  - Rating promedio con estrellas
  - Desglose visual de ratings (1-5) con Progress bars
  - Lista de reseñas con avatar, fecha, comentario
  - Galería de fotos de reseñas
  - Empty state para sin reseñas

- **[app/(public)/experiencias/[slug]/_components/related-services.tsx](../app/(public)/experiencias/[slug]/_components/related-services.tsx)**
  - Grid de 4 experiencias relacionadas
  - Reutiliza ServiceCard de /explorar
  - Link "Ver todas" a explorar filtrado por categoría
  - Responsive: 4 cols desktop, 2 tablet, 1 mobile

### Página Principal
- **[app/(public)/experiencias/[slug]/page.tsx](../app/(public)/experiencias/[slug]/page.tsx)**
  - Dynamic route con generateMetadata para SEO
  - Server Component con Suspense boundaries
  - Layout de 2 columnas (detalles + booking widget sticky)
  - Breadcrumb navigation
  - Share y Favorite buttons
  - Parallel data fetching para performance

### UI Components Nuevos
- **[components/ui/calendar.tsx](../components/ui/calendar.tsx)** - Date picker con react-day-picker
- **[components/ui/popover.tsx](../components/ui/popover.tsx)** - Popover para calendar
- **[components/ui/progress.tsx](../components/ui/progress.tsx)** - Progress bar para ratings

---

## 🎨 Características Implementadas

### 1. Image Gallery con Lightbox

**Layout:**
- Imagen principal: 75% width en desktop, full en mobile
- 4 thumbnails: grid 2x2 en desktop/tablet
- Última thumbnail muestra "+X fotos" si hay más imágenes

**Lightbox:**
- Modal fullscreen con overlay negro 95%
- Navegación: botones ← → y teclado
- Contador de posición (X / Total)
- Caption de imagen en bottom
- Click en overlay para cerrar
- Prevención de scroll del body

### 2. Service Details Comprehensive

**Secciones:**
- Descripción larga con formato
- Quick facts con iconos (Clock, Mountain, Users)
- Itinerario timeline (opcional)
- Dual columns: Incluye/No incluye
- Dual columns: Qué traer/Equipo proporcionado
- Card de requisitos con badges

**Labels Traducidos:**
- Dificultad: PRINCIPIANTE → "Principiante"
- Duración: DIA_COMPLETO → "Día completo (5-10 horas)"
- Todos los enums traducidos a español

### 3. Booking Widget Interactivo

**Features:**
- Precio base por persona
- Calendar popover con fechas deshabilitadas:
  - Pasadas (< hoy)
  - No disponibles (si hay availability data)
- Selector de participantes:
  - Botones +/- con límites min/max
  - Validación en tiempo real
- Desglose de precio:
  ```
  $X × N personas
  Total: $XXX
  ```
- CTA deshabilitado si no hay fecha seleccionada
- Sticky positioning en desktop

### 4. Guide Profile Card

**Información:**
- Avatar con fallback a inicial
- Checkmark azul si está verificado
- Rating promedio con estrella
- Total experiencias realizadas
- Año de inicio como miembro

**Stats Grid:**
- Años de experiencia
- Idiomas (badges)
- Tiempo de respuesta promedio

**Actions:**
- Botón "Contactar guía" → /mensajes
- Link "Ver perfil completo" → /guias/[id]

### 5. Reviews Section con Breakdown

**Overview:**
- Rating promedio grande (ej: 4.8)
- Estrellas visuales
- Total de reseñas
- Progress bars para cada rating (5-1 estrellas)
- Porcentaje visual + contador

**Reviews List:**
- Card por review
- Avatar del usuario
- Fecha formateada (español)
- Estrellas del rating
- Título opcional
- Comentario
- Galería de fotos (si las hay)
- Empty state si no hay reseñas

### 6. Related Services Recommendation

**Algoritmo:**
```typescript
// Prioridad:
1. Misma categoría Y misma región
2. Misma categoría O misma región
3. Cualquier servicio verificado

// Orden:
- featured DESC
- rating DESC
- reviewCount DESC
```

**Layout:**
- 4 servicios máximo
- Grid responsive (4/2/1 cols)
- Botón "Ver todas" a /explorar?categories=X

---

## 🔧 Technical Implementation

### Server Actions con React Cache

```typescript
export const getServiceBySlug = cache(async (slug: string) => {
  // Cached per-request
  // Includes all relations: images, region, comuna, guide, addOns, faqs, _count
});
```

**Beneficios:**
- Deduplicación automática en mismo request
- Type-safe con Prisma
- Error handling granular

### Parallel Data Fetching

```typescript
const [reviews, ratingBreakdown, relatedServices] = await Promise.all([
  getServiceReviews(service.id, 1, 10),
  getRatingBreakdown(service.id),
  getRelatedServices(service.id, service.category, service.regionId, 4),
]);
```

**Performance:**
- 3 queries en paralelo vs secuencial
- Reduce latency total
- No bloquea rendering del skeleton

### Suspense Boundaries

```tsx
<Suspense fallback={<ServiceSkeleton />}>
  <ServiceContent slug={params.slug} />
</Suspense>
```

**UX:**
- Loading state mientras fetching
- Progressive rendering
- No flash of wrong content

### Image Gallery State Management

```typescript
const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

// Prevent body scroll
const openLightbox = (index: number) => {
  setSelectedIndex(index);
  document.body.style.overflow = "hidden";
};
```

**Accessibility:**
- Keyboard navigation (ArrowLeft, ArrowRight, Escape)
- ARIA labels y roles
- Focus management

### Date Picker with Availability

```typescript
const disabledDates = (date: Date) => {
  // Disable past dates
  if (date < today) return true;

  // If we have specific available dates, only enable those
  if (availableDates.length > 0) {
    return !availableDates.some(availableDate =>
      // Date comparison logic
    );
  }

  return false;
};
```

---

## 🎨 UX Features

### Breadcrumb Navigation
```
Explorar › Kayak › Experiencia en el Lago X
```
- Links funcionales
- Categoría filtrada en explorar

### Action Buttons
- Share button (preparado para Web Share API)
- Favorite button (preparado para favorites system)
- Contact guide (link a mensajes)

### Responsive Design

**Desktop (≥ 1024px):**
- Layout 2/3 - 1/3 (content - booking)
- Booking widget sticky
- Image gallery: main + 4 thumbnails

**Tablet (768px - 1023px):**
- Stack layout
- Booking widget arriba
- 2 thumbnails en grid

**Mobile (< 768px):**
- Full stack
- Booking widget primero
- 1 thumbnail en grid

### Loading States
- Skeleton para hero section
- Skeleton para image gallery
- Skeleton para content columns
- Smooth transitions

### Empty States
- "Aún no hay reseñas" con call-to-action
- Imágenes: "Sin imágenes disponibles"

---

## 📊 SEO & Metadata

### Dynamic Metadata

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);

  return {
    title: `${service.title} - Aventura Marketplace`,
    description: service.description.substring(0, 160),
    openGraph: {
      title: service.title,
      description: service.description.substring(0, 160),
      images: service.coverImage ? [service.coverImage] : [],
    },
  };
}
```

**Benefits:**
- Unique title/description per service
- OG tags para social sharing
- Image preview en redes sociales

### Structured Data (TODO Fase 2)
```json
{
  "@type": "Product",
  "name": "Kayak en Lago X",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  },
  "offers": {
    "@type": "Offer",
    "price": "45000",
    "priceCurrency": "CLP"
  }
}
```

---

## 🧪 Cómo Probar

### 1. Navegación desde /explorar
```
1. Ir a http://localhost:3000/explorar
2. Click en cualquier ServiceCard
3. Debe abrir /experiencias/[slug]
```

### 2. Direct URL
```
http://localhost:3000/experiencias/kayak-lago-llanquihue
```
(Reemplazar con un slug existente de tu seed data)

### 3. Interacción con Booking Widget
```
1. Click en date picker
2. Seleccionar fecha futura
3. Ajustar participantes con +/-
4. Ver actualización de precio total
5. Click "Reservar ahora" (TODO: implementar checkout)
```

### 4. Image Gallery
```
1. Click en imagen principal
2. Debe abrir lightbox fullscreen
3. Navegar con botones o ← →
4. Presionar Esc para cerrar
```

### 5. Reviews Section
```
- Ver breakdown de ratings
- Scroll por lista de reseñas
- Ver fotos de reseñas (si existen)
```

### 6. Related Services
```
- Ver 4 servicios relacionados
- Click "Ver todas" → debe filtrar en /explorar
```

---

## 🚀 Próximos Pasos (Fase 2)

### Booking Flow Implementation
- [ ] Checkout page con formulario
- [ ] Phone verification en checkout
- [ ] Guest checkout (sin registro)
- [ ] Add-ons selection
- [ ] Payment integration (Webpay)

### Enhanced Features
- [ ] Favorite button funcional (guardar en DB)
- [ ] Share button con Web Share API
- [ ] Reviews: "Helpful" voting
- [ ] Guide response to reviews
- [ ] Photo upload en reviews

### Advanced Components
- [ ] Map view con Mapbox
- [ ] Availability calendar expandido
- [ ] Real-time availability updates
- [ ] FAQ accordion
- [ ] Cancellation policy section

### Analytics
- [ ] Track view counts por usuario
- [ ] Conversion funnel (view → click → book)
- [ ] Popular services algorithm
- [ ] Recently viewed services

---

## 🔍 Optimizaciones Aplicadas

### 1. React Cache
- Deduplicación de queries dentro del request
- No re-fetch del mismo servicio

### 2. Parallel Queries
- Reviews, ratings y related services en paralelo
- Reduce latency ~66% vs secuencial

### 3. Incremental View Count
```typescript
// Non-blocking, no afecta rendering
incrementViewCount(service.id);
```

### 4. Image Optimization
- Next.js Image component
- Responsive sizes attribute
- Priority en imagen principal
- Lazy loading en thumbnails

### 5. Code Splitting
- Dynamic imports en calendario
- Client components solo donde necesario
- Server components por defecto

---

## 📝 Notas de Implementación

### Type Safety
- Todos los props tipados con TypeScript
- Prisma types para data fetching
- Enum labels traducidos con Record types

### Error Handling
- notFound() si servicio no existe
- Try-catch en incrementViewCount (non-critical)
- Graceful degradation en availability

### Accessibility
- ARIA labels en botones
- Keyboard navigation en gallery
- Focus management en modals
- Semantic HTML (section, nav, etc.)

### Estado del Cliente
- Mínimo estado (solo UI interactiva)
- URL params NO en booking widget (será en checkout)
- LocalStorage para favorites (Fase 2)

---

## 🔗 Integración con Otras Páginas

### Desde /explorar
```tsx
<Link href={`/experiencias/${service.slug}`}>
  <ServiceCard {...} />
</Link>
```

### Hacia /explorar (related)
```tsx
<Link href={`/explorar?categories=${category}`}>
  Ver todas
</Link>
```

### Hacia /guias/[id]
```tsx
<Link href={`/guias/${guide.id}`}>
  Ver perfil completo
</Link>
```

### Hacia /mensajes (TODO)
```tsx
<Link href={`/mensajes?guideId=${guide.id}`}>
  Contactar guía
</Link>
```

---

## 📦 Dependencies Añadidas

```json
{
  "react-day-picker": "^9.x", // Date picker
  "date-fns": "^4.x"          // Date utilities + locale ES
}
```

**Componentes Radix:**
- `@radix-ui/react-popover` (calendar popover)
- `@radix-ui/react-progress` (rating bars)

---

## 🎯 Coverage de Features del Schema

### Service Model ✅
- ✅ title, description, category, difficulty, duration
- ✅ priceBase, minParticipants, maxParticipants
- ✅ included, notIncluded, whatToBring, providedGear
- ✅ requirements (JSON parsed)
- ✅ itinerary (JSON parsed, timeline)
- ✅ coverImage + images relation
- ✅ rating, reviewCount (denormalized)
- ✅ region, comuna (relations)
- ✅ guide (full profile)

### Review Model ✅
- ✅ rating, title, comment
- ✅ user relation (avatar, name)
- ✅ images relation
- ✅ createdAt (formatted)
- ✅ status filter (PUBLISHED only)

### GuideProfile Model ✅
- ✅ bio, yearsExperience, languages
- ✅ totalBookings, averageRating
- ✅ responseTime, verified

### ServiceAvailability Model 🟡
- 🟡 Estructura lista, no poblada en seed
- 🟡 Date picker usa lógica simple (future dates)

---

**Implementado por:** Claude
**Fecha:** Enero 6, 2026
**Estado:** ✅ Completo y funcional
**Siguiente:** Checkout flow (`/checkout`) y Payment integration (Webpay)
