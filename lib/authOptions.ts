// lib/authOptions.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { dbConnect } from "./dbConnect";
import { loginUser } from "@/actions/server/auth";

interface DbUser {
  _id?: string;
  provider?: string;
  providerId?: string;
  email: string;
  name?: string | null;
  imageUrl?: string | null;
  phone?: string;
  role?: string;
  password?: string;
  status?: string;   
  createdAt?: Date;   
  updatedAt?: Date;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await loginUser({
          email: credentials.email,
          password: credentials.password,
        });

        if (!user) return null;

        return {
          id: user._id,
          email: user.email,
          name: user.name ?? "",
          role: user.role,
          phone: user.phone,
          image: user.imageUrl,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
  async signIn({ user, account }) {
    if (account?.provider === "google" || account?.provider === "facebook") {
      return true; 
    }
    return true;
  },
}
};
