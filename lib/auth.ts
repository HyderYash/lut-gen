import { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { User } from "next-auth"

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const dbUser = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!dbUser?.password) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          dbUser.password
        )

        if (!isValid) {
          return null
        }

        // Convert Prisma User to NextAuth User
        const user: User = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          image: dbUser.image,
          plan: dbUser.plan,
          referralCode: dbUser.referralCode || undefined,
          credits: dbUser.credits,
          customerId: dbUser.customerId || undefined,
        }

        return user
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                plan: "free",
                credits: 0,
              },
            })
          }
        }
        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
    async session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          plan: user.plan,
          referralCode: user.referralCode || undefined,
          credits: user.credits,
          customerId: user.customerId || undefined,
        },
      }
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    newUser: "/auth/referral"
  },
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "database" },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
