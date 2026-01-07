import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's unique ID from the database */
      id: string;
      /** The user's role in the system */
      role: "CLIENT" | "GUIDE" | "ADMIN";
      /** The user's account status */
      status: "ACTIVE" | "SUSPENDED" | "DELETED";
    } & DefaultSession["user"];
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: "CLIENT" | "GUIDE" | "ADMIN";
    status: "ACTIVE" | "SUSPENDED" | "DELETED";
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's unique ID */
    id: string;
    /** The user's role in the system */
    role: "CLIENT" | "GUIDE" | "ADMIN";
    /** The user's account status */
    status: "ACTIVE" | "SUSPENDED" | "DELETED";
  }
}
