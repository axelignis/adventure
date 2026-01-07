import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/db";
import type { Adapter } from "next-auth/adapters";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CLIENT" | "GUIDE" | "ADMIN";
      status: "ACTIVE" | "SUSPENDED" | "DELETED";
    } & DefaultSession["user"];
  }

  interface User {
    role: "CLIENT" | "GUIDE" | "ADMIN";
    status: "ACTIVE" | "SUSPENDED" | "DELETED";
  }
}

// Build providers array conditionally based on available environment variables
const providers = [];

// Add Resend provider if API key is configured
if (process.env.RESEND_API_KEY) {
  providers.push(
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM_EMAIL || "noreply@aventuramarketplace.com",
    })
  );
}

// Add Google provider if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },

  providers,

  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/verify-email",
    error: "/auth/error",
    newUser: "/dashboard", // Redirect after first sign in
  },

  callbacks: {
    async signIn({ user, account, profile, isNewUser }) {
      // Check if user is suspended
      if (user.status === "SUSPENDED") {
        return "/auth/error?error=AccountSuspended";
      }

      // Update last login only if user already exists (not on first sign-in)
      // On first sign-in, the user is created after this callback
      if (!isNewUser && user.id) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });
        } catch (error) {
          console.error("Error updating lastLoginAt:", error);
          // Don't block sign-in if this fails
        }
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "CLIENT" | "GUIDE" | "ADMIN";
        session.user.status = token.status as "ACTIVE" | "SUSPENDED" | "DELETED";
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allow same origin URLs
      if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
  },

  events: {
    async createUser({ user }) {
      console.log("New user created:", user.email);

      // Send welcome email (implement later)
      // await sendWelcomeEmail(user.email, user.name);
    },

    async linkAccount({ user, account }) {
      console.log("Account linked:", account.provider, user.email);
    },
  },

  // Enable debug in development
  debug: process.env.NODE_ENV === "development",
});
