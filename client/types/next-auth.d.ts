import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user?: {
      roles?: string[];
    } & DefaultSession["user"];
  }

  interface User {
    roles?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    roles?: string[];
    error?: string;
  }
}
