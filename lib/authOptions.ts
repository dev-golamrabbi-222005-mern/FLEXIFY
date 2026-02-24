// lib/authOptions.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect } from "./dbConnect";
import { loginUser } from "@/actions/server/auth";

interface DbUser {
  _id?: string;
  provider?: string;
  email: string;
  name?: string;
  imageUrl?: string;
  phone?: string;
  role?: string;
  password?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        // email: { label: "Email", type: "email" },
        // password: { label: "Password", type: "password" },
      },
      async authorize(credentials: {email: string, password: string}, req) {
        console.log(credentials);
        if (!(credentials?.email as string) || !(credentials?.password as string)) {
          return null;
        }

        const user = await loginUser({
          email: credentials.email as string,
          password: credentials.password as string,
        });

        return user;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      const collection = dbConnect<DbUser>("users");

      const isExist = await collection.findOne({
        email: user.email,
      });

      if (isExist) {
        return true;
      }

      const newUser: DbUser = {
        provider: account?.provider,
        email: user.email!,
        name: user.name ?? "",
        imageUrl: user.image ?? "",
        phone: user.phone ?? "",
        role: "user",
      };

      const result = await collection.insertOne(newUser);
      return result.acknowledged;
    },

    async session({ session, token }) {
      if (token) {
        session.role = token.role;
        session.email = token.email;
        session.phone = token.phone;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (user) {
        const collection = dbConnect<DbUser>("users");

        if (account?.provider === "google") {
          const dbUser = await collection.findOne({
            email: user.email!,
          });

          token.role = dbUser?.role;
          token.email = dbUser?.email;
          token.phone = dbUser?.phone;
        } else {
          token.role = user.role;
          token.email = user.email;
          token.phone = user.phone;
        }
      }

      return token;
    },
  },
};