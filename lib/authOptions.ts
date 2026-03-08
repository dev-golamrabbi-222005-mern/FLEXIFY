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
  try {
    const collection = dbConnect<DbUser>("users");

    if (!user.email) return false;

    const isExist = await collection.findOne({
      email: user.email,
    });

    if (!isExist) {
      const newUser: DbUser = {
        email: user.email,
        name: user.name,
        imageUrl: user.image,
        provider: account?.provider,
        providerId: account?.providerAccountId,
        role: "user",
      };

      await collection.insertOne(newUser);
    }

    return true;
  } catch (error) {
    return false;
  }
},

    async session({ session, token }) {
      if (token) {
        session.role = token.role as string;
        session.email = token.email as string;
        session.phone = token.phone as string;
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