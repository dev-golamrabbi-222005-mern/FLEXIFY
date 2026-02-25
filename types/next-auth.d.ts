// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    role?: string;
    email?: string;
    phone?: string;
    user: {
      id?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    email?: string;
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    email?: string;
    phone?: string;
  }
}