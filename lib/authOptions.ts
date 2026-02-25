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
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
    })
  ],

  callbacks: {
    async signIn({ user, account }) {
      try{
        const collection = dbConnect<DbUser>("users");
        const newUser: DbUser = {
          ...user,
          provider: account?.provider,
          providerId: account?.providerAccountId,
          role: "user",
        };
        if(!newUser?.email){
          return false;
        }
        const isExist = await collection.findOne({
          email: user.email,
        });
        if (!isExist) {
          const result = await collection.insertOne(newUser);
        }
        return true;
      }
      catch(error){
        return false;
      }
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