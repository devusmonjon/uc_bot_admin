import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./mongoose";
import User from "@/database/user.model";
import { compare } from "bcrypt";

interface SessionUser {
  username: string;
  _id: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
          placeholder: "Username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ username: credentials?.username });
        console.log(user, "user");

        if (user) {
          const isPasswordValid = await compare(
            credentials?.password || "",
            user.password
          );

          if (isPasswordValid) {
            console.log(user, "password is valid");

            return user;
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // @ts-expect-error: sdfs
    async session({ session, token }) {
      await connectToDatabase();

      // Agar token mavjud bo'lmasa yoki yaroqsiz bo'lsa, sessionni null qaytarish
      if (!token || !token.sub) {
        return null;
      }

      const isExistingUser = await User.findOne({
        // @ts-ignore
        _id: token.sub,
      });
      console.log(isExistingUser, "SDsd")

      // @ts-ignore
      session.user = {
        _id: isExistingUser?._id,
        username: isExistingUser?.username,
      } as SessionUser;

      // console.log(session)

      return session;
    },
    async jwt({ token, user }) {
      // Agar foydalanuvchi mavjud bo'lsa, token ga foydalanuvchi ma'lumotlarini qo'shish
      if (user) {
        // @ts-expect-error: error not defined
        token.sub = user._id;
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
};