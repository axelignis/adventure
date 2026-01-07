"use client";

import { useSession as useNextAuthSession } from "next-auth/react";

/**
 * Custom hook to access the current user session
 *
 * @returns Session data with user information, loading state, and session status
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, isLoading } = useSession();
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (!isAuthenticated) return <LoginPrompt />;
 *
 * return <div>Hello {user.name}</div>;
 * ```
 */
export function useSession() {
  const { data: session, status } = useNextAuthSession();

  return {
    session,
    user: session?.user,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading",
    status,
  };
}
