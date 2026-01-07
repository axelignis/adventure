# 🔍 Implementación de /explorar - Búsqueda y Filtrado

## ✅ Completado

Implementación completa de la página `/explorar` con búsqueda full-text PostgreSQL y sistema de filtros siguiendo la arquitectura documentada.

---

## 📁 Archivos Creados

### Server Actions
- **[app/(public)/explorar/actions.ts](../app/(public)/explorar/actions.ts)**
  - `searchServices()` - Búsqueda full-text con PostgreSQL FTS
  - `getFilterOptions()` - Opciones dinámicas de filtros
  - `getPriceRange()` - Rango de precios disponibles

### Componentes
- **[app/(public)/explorar/_components/service-card.tsx](../app/(public)/explorar/_components/service-card.tsx)**
  - Tarjeta de servicio con imagen, info, rating, precio

- **[app/(public)/explorar/_components/search-bar.tsx](../app/(public)/explorar/_components/search-bar.tsx)**
  - Barra de búsqueda con clear button
  - Actualización de URL params

- **[app/(public)/explorar/_components/filter-panel.tsx](../app/(public)/explorar/_components/filter-panel.tsx)**
  - Panel de filtros desktop (sidebar)
  - Sheet mobile responsive
  - Filtros: Categoría, Región, Dificultad, Duración

- **[app/(public)/explorar/_components/pagination.tsx](../app/(public)/explorar/_components/pagination.tsx)**
  - Paginación completa con primera/última página
  - Números de página con dots
  - Resumen de resultados

- **[app/(public)/explorar/_components/empty-state.tsx](../app/(public)/explorar/_components/empty-state.tsx)**
  - Estados vacíos para: sin resultados, sin filtros, sin búsqueda
  - Sugerencias y acciones

### Página Principal
- **[app/(public)/explorar/page.tsx](../app/(public)/explorar/page.tsx)**
  - Server Component con Suspense boundaries
  - Hero con SearchBar
  - Layout con sidebar de filtros
  - Grid de resultados
  - Paginación

### UI Components Nuevos
- **[components/ui/checkbox.tsx](../components/ui/checkbox.tsx)**
- **[components/ui/separator.tsx](../components/ui/separator.tsx)**
- **[components/ui/sheet.tsx](../components/ui/sheet.tsx)**
- **[components/ui/skeleton.tsx](../components/ui/skeleton.tsx)**

---

## 🔍 Características Implementadas

### 1. Búsqueda Full-Text (PostgreSQL FTS)

```sql
-- Usa websearch_to_tsquery para español
-- Incluye unaccent para ignorar acentos
-- Ranking basado en ts_rank_cd + rating boost

SELECT ...
FROM "Service" s
WHERE to_tsvector('spanish', unaccent(s.title || ' ' || s.description))
      @@ websearch_to_tsquery('spanish', unaccent($query))
ORDER BY ts_rank_cd(...) + (rating * 0.1) DESC
```

**Características:**
- ✅ Búsqueda en español con normalización de acentos
- ✅ Ranking por relevancia + rating de servicio
- ✅ Búsqueda en título y descripción
- ✅ Soporte para frases y operadores ("kayak lagos", kayak OR rafting)

### 2. Sistema de Filtros Multi-Categoría

**Filtros Disponibles:**
- **Categoría:** KAYAK, RAFTING, TREKKING, PESCA, MONTANISMO, CICLISMO, ESCALADA, OTROS
- **Región:** Todas las regiones con servicios activos
- **Dificultad:** PRINCIPIANTE, BASICO, INTERMEDIO, AVANZADO, EXPERTO
- **Duración:** MEDIO_DIA, DIA_COMPLETO, MULTI_DIA

**Comportamiento:**
- OR dentro de cada categoría de filtro
- AND entre diferentes categorías
- Contador de resultados por filtro
- Persistencia en URL params

### 3. URL State Management

Todos los parámetros de búsqueda y filtros se guardan en la URL:

```
/explorar?q=kayak&categories=KAYAK,RAFTING&regions=region-id&page=2
```

**Beneficios:**
- ✅ URLs compartibles
- ✅ Navegación con back/forward
- ✅ Estado preservado en refresh
- ✅ SEO friendly

### 4. Paginación

- 12 resultados por página
- Navegación: Primera, Anterior, Números, Siguiente, Última
- Ellipsis (...) para muchas páginas
- Scroll to top al cambiar página

### 5. Responsive Design

**Desktop (≥ 1024px):**
- Sidebar de filtros fijo (sticky)
- Grid de 3 columnas

**Tablet (768px - 1023px):**
- Grid de 2 columnas
- Botón de filtros con Sheet

**Mobile (< 768px):**
- Grid de 1 columna
- Sheet mobile para filtros

### 6. Performance Optimizations

**Server Components:**
- Todo el fetching en servidor
- Parallel data fetching con Promise.all
- No hydration overhead para listados

**Suspense Boundaries:**
```tsx
<Suspense fallback={<ResultsGridSkeleton />}>
  <SearchResults />
</Suspense>
```

**URL Transitions:**
- useTransition para indicadores de loading
- Optimistic UI updates

---

## 🎨 UX Features

### Empty States
- Sin resultados de búsqueda → Sugerencias
- Sin resultados con filtros → Limpiar filtros
- Sin experiencias → Mensaje informativo

### Loading States
- Skeleton loaders para grids
- Loading indicators en botones
- Smooth transitions

### Accesibilidad
- Aria labels en paginación
- Keyboard navigation
- Focus management en filtros

---

## 🧪 Cómo Probar

### 1. Navegación Básica
```
http://localhost:3000/explorar
```
Ver todas las experiencias disponibles

### 2. Búsqueda
```
http://localhost:3000/explorar?q=kayak
http://localhost:3000/explorar?q=trekking glaciar
```

### 3. Filtros
```
http://localhost:3000/explorar?categories=KAYAK,RAFTING
http://localhost:3000/explorar?difficulties=PRINCIPIANTE,BASICO
```

### 4. Combinado
```
http://localhost:3000/explorar?q=aventura&categories=KAYAK&regions=region-id&page=2
```

---

## 📊 Datos de Prueba

Los datos seed ya están en la base de datos:
- ✅ 5 Experiencias de ejemplo
- ✅ Multi-categoría (KAYAK, RAFTING, TREKKING, etc.)
- ✅ 5 Regiones de Chile con comunas
- ✅ Diferentes niveles de dificultad
- ✅ Diferentes duraciones

Para agregar más datos:
```bash
npm run db:seed
```

---

## 🚀 Próximos Pasos (Fase 2)

### Mejoras de Búsqueda
- [ ] Migrar a Meilisearch para typo-tolerance
- [ ] Sinónimos (ES/EN)
- [ ] Autocompletado de búsqueda
- [ ] Búsqueda por voz

### Filtros Adicionales
- [ ] Rango de precios (slider)
- [ ] Rating mínimo
- [ ] Disponibilidad por fechas
- [ ] Cerca de mi ubicación

### Vista de Mapa
- [ ] Toggle entre vista grid y mapa
- [ ] Mapbox integration
- [ ] Clusters para múltiples servicios
- [ ] Filtrado geográfico por área

### Performance
- [ ] ISR (Incremental Static Regeneration)
- [ ] Edge caching para resultados populares
- [ ] Prefetch en hover de tarjetas
- [ ] Infinite scroll como alternativa

---

## 🔧 Configuración Técnica

### PostgreSQL Extensions Requeridas
```sql
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

Ya configuradas en el schema de Prisma.

### Índices Recomendados
```sql
-- Ya incluidos en el schema
CREATE INDEX idx_service_search ON "Service" USING gin(to_tsvector('spanish', title || ' ' || description));
CREATE INDEX idx_service_status_verified ON "Service" (status, verified);
CREATE INDEX idx_service_category ON "Service" (category);
CREATE INDEX idx_service_region ON "Service" ("regionId");
```

---

## 📝 Notas de Implementación

### Query Performance
- Las búsquedas FTS son rápidas gracias a índices GIN
- Parallel queries para filtros y resultados
- Count query separado para no impactar paginación

### Type Safety
- Todos los filtros tipados con Prisma enums
- URL params validados y parseados
- TypeScript strict mode

### Error Handling
- Graceful degradation si falla búsqueda
- Empty states informativos
- URL params inválidos son ignorados

---

**Implementado por:** Claude & Axel
**Fecha:** Enero 6, 2026
**Siguiente:** Página de detalle de experiencia (`/experiencias/[slug]`)
