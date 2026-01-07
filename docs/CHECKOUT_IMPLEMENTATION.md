# 🛒 Checkout Flow Implementation

## ✅ Completado

Implementación completa del flujo de checkout con wizard de 3 pasos, verificación telefónica, y creación de reservas.

---

## 📁 Archivos Creados

### Validaciones (Zod Schemas)
- **[lib/validations/checkout.ts](../lib/validations/checkout.ts)**
  - `checkoutStep1Schema` - Validación de detalles del servicio y add-ons
  - `checkoutStep2Schema` - Validación de datos de usuario
  - `phoneVerificationSchema` - Validación de código telefónico
  - `createBookingSchema` - Validación completa para crear reserva
  - `calculateTotalSchema` - Validación para cálculo de precios

### Server Actions
- **[app/(public)/checkout/actions.ts](../app/(public)/checkout/actions.ts)**
  - `calculateTotal()` - Calcula precio total con add-ons
  - `sendPhoneVerificationCode()` - Envía código de verificación (simulado)
  - `verifyPhoneCode()` - Verifica código telefónico
  - `getOrCreateGuestUser()` - Crea o recupera usuario guest
  - `createBooking()` - Crea reserva en base de datos
  - `getServiceForCheckout()` - Obtiene detalles del servicio
  - `getBookingDetails()` - Obtiene detalles de reserva creada

### Componentes del Wizard
- **[app/(public)/checkout/_components/step-1-details.tsx](../app/(public)/checkout/_components/step-1-details.tsx)**
  - Resumen del servicio seleccionado
  - Selector de add-ons con checkboxes
  - Política de cancelación
  - Checkbox de aceptación de políticas
  - Cálculo dinámico de precio total

- **[app/(public)/checkout/_components/step-2-user-details.tsx](../app/(public)/checkout/_components/step-2-user-details.tsx)**
  - Formulario de datos personales
  - Verificación telefónica con código SMS
  - Pre-llenado de datos si está autenticado
  - Guest checkout permitido
  - Campos opcionales: restricciones alimentarias, consideraciones especiales

- **[app/(public)/checkout/_components/step-3-confirmation.tsx](../app/(public)/checkout/_components/step-3-confirmation.tsx)**
  - Resumen completo de la reserva
  - Información de contacto
  - Desglose de precios
  - Placeholder para Webpay
  - Botón de confirmación final

- **[app/(public)/checkout/_components/checkout-wizard.tsx](../app/(public)/checkout/_components/checkout-wizard.tsx)**
  - Orchestrator principal del wizard
  - Stepper visual con indicadores de progreso
  - Navegación entre pasos
  - Manejo de estado del checkout
  - Llamada a createBooking al confirmar

### Páginas
- **[app/(public)/checkout/page.tsx](../app/(public)/checkout/page.tsx)**
  - Página principal de checkout
  - Recibe params: serviceId, date, participants
  - Validación de parámetros
  - Suspense con skeleton loading

- **[app/(public)/checkout/success/[bookingId]/page.tsx](../app/(public)/checkout/success/[bookingId]/page.tsx)**
  - Página de confirmación exitosa
  - Muestra número de reserva
  - "Qué sigue ahora" - próximos pasos
  - Detalles completos de la reserva
  - Botones: Ver reservas, Explorar más experiencias

### UI Components Nuevos
- **[components/ui/textarea.tsx](../components/ui/textarea.tsx)** - Textarea para comentarios
- **[components/ui/alert.tsx](../components/ui/alert.tsx)** - Alertas de error/info

### Integración
- **[app/(public)/experiencias/[slug]/_components/booking-widget.tsx](../app/(public)/experiencias/[slug]/_components/booking-widget.tsx)**
  - Actualizado para redirigir a `/checkout` con URL params
  - Pasa: serviceId, date, participants

---

## 🎯 Flujo Completo del Checkout

### Inicio del Flujo
```
Usuario en /experiencias/[slug]
    ↓
Selecciona fecha y participantes en BookingWidget
    ↓
Click "Reservar ahora"
    ↓
Redirect a /checkout?serviceId=X&date=Y&participants=Z
```

### Paso 1: Confirmar Detalles

**Información Mostrada:**
- Imagen del servicio
- Título, fecha, participantes, duración
- Precio base por persona

**Add-ons Disponibles:**
```typescript
interface ServiceAddOn {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: 'HOSPEDAJE' | 'EMBARCACION' | 'PICKUP' | 'EQUIPO_PREMIUM';
}
```

**Categorías de Add-ons:**
- HOSPEDAJE: Alojamiento extra
- EMBARCACION: Upgrade de embarcación
- PICKUP: Transporte/recogida
- EQUIPO_PREMIUM: Equipamiento mejorado

**Política de Cancelación:**
- Cancelación gratuita hasta 48h antes
- 50% reembolso entre 24-48h
- Sin reembolso < 24h
- Custom policy desde service.cancellationPolicy

**Validación:**
- ✅ Checkbox "He leído y acepto las políticas" (required)

**Cálculo de Precio:**
```typescript
serviceTotal = priceBase × participants
addOnsTotal = sum(selectedAddOns.map(a => a.price))
total = serviceTotal + addOnsTotal
```

### Paso 2: Datos del Usuario

#### Si Usuario Autenticado
- Email (pre-llenado, disabled)
- Nombre completo (pre-llenado, editable)
- Teléfono (pre-llenado si existe)

#### Si Usuario Guest
- Email (requerido)
- Nombre completo (requerido)
- Teléfono (requerido)
- Se crea cuenta automáticamente con role: USER

**Verificación Telefónica:**

```typescript
// 1. Usuario ingresa teléfono
phone: "+56912345678"

// 2. Click "Enviar Código"
sendPhoneVerificationCode(phone)
  ↓
// Simulated: código siempre es "123456" en dev
// Producción: integrar Twilio/Vonage
  ↓
// 3. Usuario ingresa código
verifyPhoneCode({ phone, code: "123456" })
  ↓
// Si válido: phoneVerified = true ✅
```

**En modo desarrollo:**
- Código siempre es `123456`
- Se muestra en Alert para facilitar testing
- En producción, se enviaría SMS/WhatsApp real

**Campos Opcionales:**
- Restricciones alimentarias (Input)
- Consideraciones especiales (Textarea)
  - Condiciones médicas
  - Nivel de experiencia
  - Otras consideraciones para el guía

**Validación:**
- ✅ Email válido
- ✅ Nombre no vacío
- ✅ Teléfono verificado (required)

### Paso 3: Confirmación

**Resumen Completo:**
- Imagen y título del servicio
- Fecha seleccionada (formato español)
- Participantes
- Lista de add-ons seleccionados con precios
- Datos de contacto completos
- Restricciones/consideraciones si existen

**Desglose de Precios:**
```
Servicio ($X × N personas)     $XXX
Servicios adicionales          $YYY
─────────────────────────────────────
Total a Pagar                  $TOTAL CLP
```

**Método de Pago (Placeholder):**
- Muestra logos: Webpay, VISA, Mastercard
- Texto: "Serás redirigido a Webpay"
- Badge: "(Integración de pago en desarrollo)"

**Aviso Importante:**
> Tu reserva quedará en estado "SOLICITADA" hasta que el guía la confirme (máximo 24 horas). Recibirás un email de confirmación una vez que sea aceptada.

**Botón Final:**
- "Confirmar Reserva"
- Loading state mientras crea booking
- Disabled durante submit

### Creación de la Reserva

**Al confirmar:**

```typescript
createBooking({
  serviceId,
  serviceDate,
  participants,
  addOnIds: ["addon-1", "addon-2"],

  // Si autenticado
  userId: session.user.id,

  // Si guest
  guestEmail: "guest@email.com",
  guestPhone: "+56912345678",
  guestName: "Juan Pérez",

  // Opcional
  dietaryRestrictions: "Vegetariano",
  specialConsiderations: "Primera vez",

  totalAmount: 150000,
  acceptedPolicies: true,
})
```

**Proceso Interno:**

1. **Validar con Zod**
   ```typescript
   const validated = createBookingSchema.parse(input);
   ```

2. **Obtener/Crear Usuario**
   ```typescript
   // Si guest, crear cuenta silenciosamente
   if (!userId && guestEmail) {
     const user = await getOrCreateGuestUser(email, phone, name);
     userId = user.id;
   }
   ```

3. **Verificar Servicio**
   ```typescript
   const service = await prisma.service.findUnique({
     where: { id: serviceId },
     select: { id, title, guideId, priceBase },
   });
   ```

4. **Crear Booking**
   ```typescript
   const booking = await prisma.booking.create({
     data: {
       userId,
       serviceId,
       guideId: service.guideId,
       serviceDate,
       participants,
       totalAmount,
       status: "REQUESTED",      // ← Estado inicial
       paymentStatus: "PENDING", // ← Pago pendiente
       dietaryRestrictions,
       specialConsiderations,
     },
   });
   ```

5. **Crear BookingAddOns**
   ```typescript
   if (addOnIds.length > 0) {
     await prisma.bookingAddOn.createMany({
       data: addOnIds.map(addOnId => ({
         bookingId: booking.id,
         addOnId,
       })),
     });
   }
   ```

6. **Revalidar Cache**
   ```typescript
   revalidatePath("/dashboard");
   revalidatePath("/dashboard/bookings");
   ```

7. **Retornar Resultado**
   ```typescript
   return {
     success: true,
     data: {
       bookingId: booking.id,
       bookingNumber: booking.bookingNumber, // Auto-generado
     },
   };
   ```

### Página de Éxito

**URL:** `/checkout/success/[bookingId]`

**Acceso:**
- Solo usuario dueño de la reserva
- Redirect si no autorizado

**Contenido:**

1. **Header de Éxito**
   - ✅ Icono verde grande
   - "¡Reserva Solicitada Exitosamente!"
   - Número de reserva: `BOOK-XXXXXX`
   - Badge: "Estado: Esperando Confirmación"

2. **Qué Sigue Ahora**
   ```
   1. Confirmación del Guía
      → [Nombre] revisará tu solicitud en máx. 24h

   2. Recibirás un Email
      → Correo de confirmación con todos los detalles

   3. Prepárate para la Aventura
      → El guía te contactará 48h antes para coordinar
   ```

3. **Detalles de la Reserva**
   - Imagen y título del servicio
   - Fecha (formato español largo)
   - Participantes
   - Duración
   - Lista de add-ons si existen
   - Restricciones/consideraciones si existen
   - **Total Pagado:** $XXX CLP

4. **Información de Contacto**
   - "Tu Guía: [Nombre]"
   - Email del guía
   - Nota: "Se ha enviado copia a tu email"

5. **Botones de Acción**
   - "Ver Mis Reservas" → `/dashboard/bookings`
   - "Explorar Más Experiencias" → `/explorar`
   - "Descargar Comprobante" (disabled, próximamente)

---

## 🎨 UX Features Implementadas

### Stepper Visual

**Desktop:**
```
[✓] ────── [2] ────── [ 3 ]
Detalles  Datos    Confirmación
```

**Mobile:**
```
┌─────────────────────┐
│   Paso 2 de 3       │
└─────────────────────┘
```

**Estados:**
- ✓ Verde: Paso completado
- Número con fondo primario: Paso actual
- Número gris: Paso pendiente

### Navegación

**Botones:**
- Paso 1: Solo "Continuar" (adelante)
- Paso 2: "Volver" + "Continuar"
- Paso 3: "Volver" + "Confirmar Reserva"

**Validación por Paso:**
- No permite avanzar sin completar campos requeridos
- Muestra mensajes de error claros
- Deshabilita botones durante loading

### Loading States

**Durante Cálculo de Precio:**
- Actualización automática al seleccionar add-ons
- Sin flickering, smooth transitions

**Durante Envío de Código:**
```tsx
<Button disabled={sendingCode}>
  {sendingCode ? <Loader2 className="animate-spin" /> : "Enviar Código"}
</Button>
```

**Durante Verificación:**
```tsx
<Button disabled={verifyingCode}>
  {verifyingCode ? <Loader2 className="animate-spin" /> : "Verificar"}
</Button>
```

**Durante Creación de Reserva:**
```tsx
<Button disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Loader2 className="animate-spin mr-2" />
      Procesando...
    </>
  ) : "Confirmar Reserva"}
</Button>
```

### Error Handling

**Errores de Validación:**
```tsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>{error}</AlertDescription>
</Alert>
```

**Tipos de Errores:**
- "Service not found" → Redirect a /explorar
- "Invalid verification code" → Muestra en alert
- "Failed to create booking" → Muestra en alert, permite reintentar
- "Unauthorized access" → Redirect a login

### Responsive Design

**Mobile (< 768px):**
- Stepper compacto como badge
- Formularios full-width
- Botones stacked verticalmente
- Cards con padding reducido

**Tablet (768px - 1023px):**
- Stepper horizontal completo
- Formularios max-width limitado
- Botones side-by-side

**Desktop (≥ 1024px):**
- Container max-w-4xl centrado
- Stepper con líneas conectoras
- Espaciado generoso

---

## 📊 Database Schema

### Modelos Utilizados

**Booking:**
```prisma
model Booking {
  id                      String   @id @default(cuid())
  bookingNumber           String   @unique @default(cuid())

  userId                  String
  user                    User     @relation(...)

  serviceId               String
  service                 Service  @relation(...)

  guideId                 String
  guide                   GuideProfile @relation(...)

  serviceDate             DateTime
  participants            Int
  totalAmount             Float

  status                  BookingStatus    @default(REQUESTED)
  paymentStatus           PaymentStatus    @default(PENDING)

  dietaryRestrictions     String?
  specialConsiderations   String?

  addOns                  BookingAddOn[]

  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
}
```

**BookingAddOn (Join Table):**
```prisma
model BookingAddOn {
  id         String  @id @default(cuid())
  bookingId  String
  booking    Booking @relation(...)
  addOnId    String
  addOn      ServiceAddOn @relation(...)
}
```

**ServiceAddOn:**
```prisma
model ServiceAddOn {
  id          String   @id @default(cuid())
  serviceId   String
  service     Service  @relation(...)

  name        String
  description String?
  price       Float
  category    AddOnCategory
  available   Boolean  @default(true)
}
```

**Enums:**
```prisma
enum BookingStatus {
  REQUESTED        // ← Inicial
  CONFIRMED        // Guía aceptó
  PAYMENT_CAPTURED // Pago capturado
  SCHEDULED        // Programado
  COMPLETED        // Finalizado
  CANCELLED        // Cancelado
  REJECTED         // Guía rechazó
}

enum PaymentStatus {
  PENDING          // ← Inicial
  AUTHORIZED       // Pre-autorizado
  CAPTURED         // Capturado
  REFUNDED         // Reembolsado
  FAILED           // Falló
}

enum AddOnCategory {
  HOSPEDAJE
  EMBARCACION
  PICKUP
  EQUIPO_PREMIUM
}
```

---

## 🔐 Security Considerations

### Input Validation

**Todas las entradas validadas con Zod:**
```typescript
try {
  const validated = createBookingSchema.parse(input);
} catch (error) {
  return { success: false, error: "Invalid input" };
}
```

**Sanitización:**
- Emails validados con Zod email()
- Teléfonos verificados antes de guardar
- Strings sin caracteres especiales peligrosos

### Authorization

**En getBookingDetails:**
```typescript
const session = await auth();

if (session?.user?.id !== booking.userId) {
  return { success: false, error: "Unauthorized" };
}
```

**En createBooking:**
- Verifica que servicio existe
- Verifica que usuario tiene permiso
- Guest users válidos creados automáticamente

### Phone Verification

**Actual (Simulado):**
- Código hardcodeado: "123456"
- Solo para desarrollo

**Producción (TODO):**
- Integrar Twilio/Vonage
- Códigos aleatorios
- TTL de 5 minutos
- Rate limiting (max 3 intentos)
- Almacenar en Redis con expiración

### Payment Security

**Estado Actual:**
- NO se procesa pago real
- Booking creado con status PENDING
- Placeholder de Webpay en UI

**Fase 2 (TODO):**
- Integración real con Webpay Plus
- Tokenización de Transbank
- PCI-DSS compliance
- Webhooks para confirmación de pago

---

## 🧪 Testing

### Cómo Probar el Flujo Completo

1. **Ir a un Servicio:**
   ```
   http://localhost:3000/experiencias/kayak-lago-llanquihue
   ```

2. **Seleccionar Fecha y Participantes:**
   - Fecha: Cualquier día futuro
   - Participantes: 2

3. **Click "Reservar ahora":**
   - Redirect a `/checkout?serviceId=X&date=Y&participants=2`

4. **Paso 1 - Seleccionar Add-ons:**
   - Marcar "Hospedaje en cabaña" (+$30,000)
   - Marcar "Pickup desde hotel" (+$15,000)
   - Aceptar políticas ✓
   - Click "Continuar"

5. **Paso 2 - Datos Personales:**

   **Si NO autenticado (Guest):**
   - Email: test@email.com
   - Nombre: Juan Pérez
   - Teléfono: +56912345678
   - Click "Enviar Código"
   - Ingresar: `123456` (código dev)
   - Click "Verificar" → ✅ Verificado
   - Restricciones: "Vegetariano"
   - Consideraciones: "Primera vez haciendo kayak"
   - Click "Continuar"

   **Si autenticado:**
   - Datos pre-llenados
   - Solo verificar teléfono
   - Click "Continuar"

6. **Paso 3 - Confirmación:**
   - Revisar resumen completo
   - Ver desglose de precios
   - Click "Confirmar Reserva"

7. **Redirect a Success:**
   ```
   /checkout/success/cm4abc123
   ```

8. **Ver Confirmación:**
   - ✅ Número de reserva
   - Estado: REQUESTED
   - Detalles completos
   - Click "Ver Mis Reservas" → `/dashboard/bookings`

### Escenarios de Error

**Sin fecha seleccionada:**
```
Alert: "Por favor selecciona una fecha"
```

**Sin verificar teléfono:**
```
Alert: "Debes verificar tu número de teléfono"
Button "Continuar" disabled
```

**Código de verificación incorrecto:**
```
Alert: "Invalid verification code"
```

**Servicio no encontrado:**
```
Redirect → /explorar
```

**Booking creation failed:**
```
Alert: "Failed to create booking. Please try again."
Button "Confirmar Reserva" enabled para reintentar
```

---

## 🚀 Próximos Pasos (Fase 2)

### Payment Integration (Webpay)

```typescript
// 1. Initialize transaction
const transaction = await webpay.create({
  amount: totalAmount,
  sessionId: booking.id,
  returnUrl: `/checkout/payment/return`,
});

// 2. Redirect user
redirect(transaction.url);

// 3. Handle return
// /checkout/payment/return?token=XXX
const result = await webpay.confirm(token);

if (result.status === "AUTHORIZED") {
  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      paymentStatus: "AUTHORIZED",
      status: "CONFIRMED",
    },
  });
}
```

### Email Notifications

**Al crear booking:**
```typescript
await sendEmail({
  to: user.email,
  subject: `Reserva ${booking.bookingNumber} - Confirmación Pendiente`,
  template: "booking-requested",
  data: { booking, service, user },
});
```

**Al confirmar guía:**
```typescript
await sendEmail({
  to: user.email,
  subject: `✅ Reserva Confirmada - ${service.title}`,
  template: "booking-confirmed",
  data: { booking, service, guide },
});
```

### Dashboard de Reservas

**Usuario:**
- `/dashboard/bookings` - Ver todas mis reservas
- Filtros por estado
- Cancelar reserva (si permite política)

**Guía:**
- `/dashboard/guide/bookings` - Ver reservas recibidas
- Confirmar/Rechazar solicitudes
- Ver detalles de participantes

### Advanced Features

- [ ] Sistema de cupones/descuentos
- [ ] Reservas grupales (múltiples participantes con datos individuales)
- [ ] Multi-fecha (paquetes de varios días)
- [ ] Recurring bookings (tours regulares)
- [ ] Waitlist si no hay disponibilidad

---

## 📝 Notas de Implementación

### Type Safety

**Todo el flujo es type-safe:**
```typescript
// Zod inference
type CreateBookingInput = z.infer<typeof createBookingSchema>;

// Server action return type
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

### Error Handling Pattern

```typescript
try {
  const result = await someAction();

  if (result.success) {
    // Happy path
  } else {
    setError(result.error);
  }
} catch (err) {
  console.error(err);
  setError("Unexpected error");
}
```

### State Management

**Wizard State:**
```typescript
// Paso actual
const [currentStep, setCurrentStep] = useState(1);

// Datos de cada paso
const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
const [step2Data, setStep2Data] = useState<Step2Data | null>(null);

// Loading/Error
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState("");
```

### Data Flow

```
BookingWidget (client)
    ↓ URL params
CheckoutPage (server)
    ↓ validation
CheckoutWizard (client)
    ↓ step1Data
Step1Details → onNext(data)
    ↓ step2Data
Step2UserDetails → onNext(data)
    ↓ step3
Step3Confirmation → onConfirm()
    ↓ server action
createBooking(combinedData)
    ↓ success
redirect(/checkout/success/[id])
```

---

**Implementado por:** Claude
**Fecha:** Enero 7, 2026
**Estado:** ✅ Completo y funcional
**Siguiente:** Integración de pagos con Webpay y sistema de notificaciones
