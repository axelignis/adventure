# ⚠️ Configuración Requerida para Autenticación

## El problema que estás viendo

Si ves un error "Configuration" al intentar iniciar sesión, es porque necesitas configurar las siguientes variables de entorno en tu archivo `.env.local`:

## 🔧 Configuración Mínima Requerida

### 1. Base de Datos (OBLIGATORIO)

La autenticación necesita una base de datos PostgreSQL para funcionar.

```bash
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

**¿Cómo obtenerla?**

1. Ve a [Neon.tech](https://neon.tech) (gratis)
2. Crea una cuenta
3. Crea un nuevo proyecto
4. Copia el connection string
5. Pégalo en `.env.local`

### 2. Proveedor de Autenticación (Elige al menos uno)

#### Opción A: Email Magic Links (Recomendado para empezar)

```bash
RESEND_API_KEY="re_xxxxx"
RESEND_FROM_EMAIL="noreply@tudominio.com"
```

**¿Cómo obtenerla?**

1. Ve a [Resend.com](https://resend.com) (gratis)
2. Crea una cuenta
3. Verifica tu dominio o usa el dominio de testing
4. Crea una API key
5. Cópiala a `.env.local`

#### Opción B: Google OAuth

```bash
GOOGLE_CLIENT_ID="tu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxx"
```

**¿Cómo obtenerla?**

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto nuevo
3. Habilita "Google+ API"
4. Ve a "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configura el consent screen
6. Agrega authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copia Client ID y Client Secret a `.env.local`

## 📝 Tu archivo .env.local debería verse así:

```bash
# NextAuth Configuration (Ya configurado ✅)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ilY6uPSIkVa6DtpfeYsWXQ04JodLaJsh37hISF47dsA="

# Database (⚠️ REEMPLAZAR CON TU CONNECTION STRING)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Email Provider (⚠️ CONFIGURAR SI QUIERES MAGIC LINKS)
RESEND_API_KEY="re_xxxxx"
RESEND_FROM_EMAIL="noreply@tudominio.com"

# Google OAuth (⚠️ CONFIGURAR SI QUIERES GOOGLE LOGIN)
GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxx"
```

## 🚀 Después de configurar

1. Guarda el archivo `.env.local`
2. Reinicia el servidor de desarrollo:
   ```bash
   # Detener el servidor actual (Ctrl+C)
   npm run dev
   ```
3. Refresca el navegador
4. ¡Intenta iniciar sesión de nuevo!

## 🎯 Solución Rápida (5 minutos)

**Opción más rápida:**

1. Crear cuenta en [Neon.tech](https://neon.tech) → Copiar DATABASE_URL
2. Crear cuenta en [Resend.com](https://resend.com) → Copiar API Key
3. Actualizar `.env.local` con ambos valores
4. Reiniciar servidor
5. ✅ ¡Listo!

---

## 📚 Documentación Completa

Para más detalles, consulta:
- [docs/AUTH_SETUP.md](docs/AUTH_SETUP.md) - Guía completa de configuración
- [docs/AUTH_IMPLEMENTATION_SUMMARY.md](docs/AUTH_IMPLEMENTATION_SUMMARY.md) - Resumen técnico

---

**¿Necesitas ayuda?** Revisa la documentación o contacta al equipo de desarrollo.
