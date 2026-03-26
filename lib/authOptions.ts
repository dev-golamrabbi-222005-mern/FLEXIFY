// lib/authOptions.ts
import { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { dbConnect } from "./dbConnect";
import { loginUser } from "@/actions/server/auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    role?: string;
  }
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
        const collection = await dbConnect("users");
        const isExist = await collection.findOne({ email: user.email });

        if (!isExist) {
          await collection.insertOne({
            name: user.name,
            email: user.email,
            imageUrl: user.image,
            role: "", 
            status: "none",
            provider: account.provider,
            createdAt: new Date(),
          });
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      if (!token.role && token.email) {
        const collection = await dbConnect("users");
        const dbUser = await collection.findOne({ email: token.email });
        if (dbUser) token.role = dbUser.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || ""; 
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
