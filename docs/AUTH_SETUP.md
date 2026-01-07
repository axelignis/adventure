# 🔐 Authentication Setup Guide

## Overview

This project uses **NextAuth v5** (Auth.js) for authentication with the following features:

- ✅ Email Magic Links (passwordless)
- ✅ Google OAuth
- ✅ Prisma Adapter (PostgreSQL)
- ✅ Protected routes via middleware
- ✅ Type-safe session management
- ✅ Custom auth pages

## Environment Variables

Add the following to your `.env.local` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"  # Generate with: openssl rand -base64 32

# Resend (Email Magic Links)
RESEND_API_KEY="re_xxx"
RESEND_FROM_EMAIL="noreply@aventuramarketplace.com"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Setup Instructions

### 1. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET` in your `.env.local`.

### 2. Configure Resend (Email Magic Links)

1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Verify your domain or use the testing domain
4. Add `RESEND_API_KEY` to `.env.local`

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Configure consent screen
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env.local`

### 4. Database Setup

The Prisma schema already includes the necessary tables for NextAuth:

- `User`
- `Account`
- `Session`
- `VerificationToken`

Run migrations:

```bash
npm run db:push
```

### 5. Test Authentication

1. Start the development server:

```bash
npm run dev
```

2. Visit `http://localhost:3000`
3. Click "Registrarse" or "Iniciar sesión"
4. Test both email magic links and Google OAuth

## Architecture

### File Structure

```
lib/
  auth.ts                 # NextAuth configuration
  hooks/
    use-session.ts        # Custom session hook

app/
  api/
    auth/
      [...nextauth]/
        route.ts          # NextAuth API route handler

  auth/
    login/
      page.tsx            # Login page
    register/
      page.tsx            # Registration page
    verify-email/
      page.tsx            # Email verification page
    error/
      page.tsx            # Error page

components/
  providers/
    session-provider.tsx  # Session provider wrapper
  layout/
    header.tsx            # Header with auth state

middleware.ts             # Route protection

types/
  next-auth.d.ts          # TypeScript type definitions
```

### Authentication Flow

#### Email Magic Link Flow

1. User enters email on login/register page
2. NextAuth sends magic link via Resend
3. User clicks link in email
4. NextAuth verifies token and creates session
5. User is redirected to dashboard

#### Google OAuth Flow

1. User clicks "Continue with Google"
2. Redirected to Google consent screen
3. User authorizes
4. Google redirects back with auth code
5. NextAuth exchanges code for tokens
6. User account is created/linked
7. User is redirected to dashboard

### Route Protection

The `middleware.ts` file handles route protection:

**Public Routes:**
- `/` - Home
- `/explorar` - Browse experiences
- `/experiencias/*` - Experience details
- `/auth/*` - Authentication pages

**Protected Routes:**
- `/dashboard` - User dashboard
- `/perfil` - User profile
- `/reservas` - User bookings
- `/favoritos` - Favorites
- `/mensajes` - Messages

## Usage

### Server Components

```tsx
import { auth } from "@/lib/auth";

export default async function MyPage() {
  const session = await auth();

  if (!session?.user) {
    // User not authenticated
    redirect("/auth/login");
  }

  return <div>Hello {session.user.name}</div>;
}
```

### Client Components

```tsx
"use client";

import { useSession } from "@/lib/hooks/use-session";

export function MyComponent() {
  const { user, isAuthenticated, isLoading } = useSession();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <LoginPrompt />;

  return <div>Hello {user.name}</div>;
}
```

### Sign Out

```tsx
import { signOut } from "next-auth/react";

<Button onClick={() => signOut({ callbackUrl: "/" })}>
  Sign Out
</Button>
```

## Session Data

The session object includes:

```typescript
{
  user: {
    id: string;              // Database user ID
    email: string;           // User email
    name: string | null;     // User name
    image: string | null;    // Profile image URL
    role: "CLIENT" | "GUIDE" | "ADMIN";
    status: "ACTIVE" | "SUSPENDED" | "DELETED";
  }
}
```

## Security Features

### ✅ Implemented

- JWT session strategy for stateless auth
- CSRF protection (built-in NextAuth)
- Secure cookies (httpOnly, sameSite)
- Email verification required
- Account suspension checks
- Last login tracking

### 🔜 Future Enhancements

- Rate limiting on login attempts
- Two-factor authentication (2FA)
- Phone verification at checkout
- Session device management
- Suspicious activity alerts

## Customization

### Custom Auth Pages

All auth pages can be customized in:

- `/app/auth/login/page.tsx`
- `/app/auth/register/page.tsx`
- `/app/auth/verify-email/page.tsx`
- `/app/auth/error/page.tsx`

### Custom Callbacks

Edit `lib/auth.ts` to customize:

- `signIn` - Control who can sign in
- `jwt` - Customize JWT token
- `session` - Customize session object
- `redirect` - Control redirect behavior

### Email Templates

To customize email templates, configure Resend with custom HTML templates.

## Troubleshooting

### "Configuration error"

- Check that `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your domain

### "Email not sending"

- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for errors
- Ensure `RESEND_FROM_EMAIL` is verified

### "Google OAuth error"

- Verify redirect URI in Google Console matches exactly
- Check that Google+ API is enabled
- Ensure client ID and secret are correct

### "Session not persisting"

- Clear browser cookies
- Check that middleware is not blocking session
- Verify database is accessible

## Best Practices

1. **Always check authentication server-side** for protected routes
2. **Use the `useSession` hook** for client components
3. **Handle loading states** properly
4. **Provide clear error messages** to users
5. **Log authentication events** for security monitoring

## Next Steps

After authentication is working:

1. Implement user profile editing
2. Add phone verification for bookings
3. Create admin dashboard for user management
4. Set up email notifications
5. Implement password reset flow (if adding passwords)

---

**Last Updated:** January 6, 2026
**NextAuth Version:** 5.0.0-beta.25
